import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { dbGet, dbRun } from '../database.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'seowon-award-secret-key-change-in-production'

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '사용자 이름과 비밀번호를 입력해주세요' })
    }

    // 중복 확인
    const existingUser = await dbGet('SELECT * FROM users WHERE username = ?', [username])
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자 이름입니다' })
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const result = await dbRun(
      'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
      [username, hashedPassword, name || username]
    )

    // JWT 토큰 생성
    const token = jwt.sign({ userId: result.lastID, username }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      message: '회원가입 성공',
      token,
      user: {
        id: result.lastID,
        username,
        name: name || username
      }
    })
  } catch (error) {
    console.error('회원가입 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '사용자 이름과 비밀번호를 입력해주세요' })
    }

    // 사용자 조회
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username])
    if (!user) {
      return res.status(401).json({ error: '사용자 이름 또는 비밀번호가 올바르지 않습니다' })
    }

    // 비밀번호 확인
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: '사용자 이름 또는 비밀번호가 올바르지 않습니다' })
    }

    // JWT 토큰 생성
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    })
  } catch (error) {
    console.error('로그인 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 인증 미들웨어
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다' })
    }
    req.user = user
    next()
  })
}

export default router
