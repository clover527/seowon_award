import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import authRoutes from './routes/auth.js'
import nominationRoutes from './routes/nominations.js'
import { initDatabase } from './database.js'
import { setupStaticFiles } from './static.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/nominations', nominationRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('클라이언트 연결:', socket.id)

  socket.on('join-month', (month) => {
    socket.join(`month-${month}`)
    console.log(`클라이언트가 ${month}월 룸에 참여했습니다`)
  })

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id)
  })
})

// Make io available to routes
app.set('io', io)

// Vercel 서버리스 함수로도 사용 가능하도록
export default async function handler(req, res) {
  return app(req, res)
}

// 일반 서버 실행 (로컬 개발 및 프로덕션)
if (process.env.VERCEL !== '1') {
  initDatabase().then(() => {
    // 프로덕션 모드일 때 정적 파일 서빙 설정
    // Render.com이나 다른 클라우드 환경에서는 항상 정적 파일 서빙
    if (isProduction || process.env.RENDER) {
      setupStaticFiles(app)
      console.log('프로덕션 모드: 정적 파일 서빙 활성화')
    }
    
    const port = process.env.PORT || PORT
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`서버가 포트 ${port}에서 실행 중입니다`)
      console.log(`환경: ${isProduction ? '프로덕션' : '개발'}`)
      if (process.env.RENDER) {
        console.log(`Render.com에서 실행 중`)
      }
      if (isProduction) {
        console.log(`✅ 900명이 접속할 수 있는 서버가 실행 중입니다!`)
      }
    })
  }).catch((error) => {
    console.error('데이터베이스 초기화 실패:', error)
  })
}

export { io }
