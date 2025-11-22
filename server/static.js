import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 정적 파일 서빙 (프로덕션 빌드된 React 앱)
export function setupStaticFiles(app) {
  // 프로덕션 빌드 경로 (여러 경로 시도)
  const possiblePaths = [
    join(__dirname, '../../dist'),
    join(process.cwd(), 'dist'),
    join(__dirname, '../dist')
  ]
  
  let distPath = null
  for (const path of possiblePaths) {
    if (existsSync(path) && existsSync(join(path, 'index.html'))) {
      distPath = path
      console.log(`정적 파일 경로 발견: ${distPath}`)
      break
    }
  }
  
  if (!distPath) {
    console.error('❌ dist 폴더를 찾을 수 없습니다!')
    console.error('시도한 경로들:', possiblePaths)
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' })
      }
      res.status(500).send(`
        <h1>빌드 파일을 찾을 수 없습니다</h1>
        <p>dist 폴더가 없습니다. Render.com 설정에서 빌드 명령어를 확인하세요.</p>
        <p>Build Command: <code>npm install && npm run build</code></p>
      `)
    })
    return
  }
  
  // 정적 파일 서빙
  app.use(express.static(distPath))
  console.log(`✅ 정적 파일 서빙 시작: ${distPath}`)
  
  // React Router를 위한 fallback - 모든 라우트를 index.html로
  app.get('*', (req, res) => {
    // API 경로는 제외
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' })
    }
    
    // index.html 서빙
    try {
      const htmlPath = join(distPath, 'index.html')
      if (existsSync(htmlPath)) {
        const html = readFileSync(htmlPath, 'utf-8')
        res.send(html)
      } else {
        res.status(404).send('index.html을 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('index.html 읽기 오류:', error)
      res.status(500).send('서버 오류가 발생했습니다.')
    }
  })
}
