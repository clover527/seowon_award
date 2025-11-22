import sqlite3 from 'sqlite3'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, 'database.sqlite')
let db = null

export function getDb() {
  if (!db) {
    db = new sqlite3.Database(dbPath)
  }
  return db
}

export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDb().all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

export async function initDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDb()

    database.serialize(() => {
      // Users table
      database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Nominations table
      database.run(`
        CREATE TABLE IF NOT EXISTS nominations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_name TEXT NOT NULL,
          reason TEXT NOT NULL,
          nominator_id INTEGER,
          month TEXT NOT NULL,
          votes INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (nominator_id) REFERENCES users(id)
        )
      `)

      // Votes table (한 사용자가 한 추천에 여러 번 투표하는 것을 방지)
      database.run(`
        CREATE TABLE IF NOT EXISTS votes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nomination_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(nomination_id, user_id),
          FOREIGN KEY (nomination_id) REFERENCES nominations(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('테이블 생성 오류:', err)
          reject(err)
        } else {
          console.log('데이터베이스 초기화 완료')
          
          // 기본 관리자 계정 생성 (없는 경우)
          createDefaultAdmin().then(() => {
            resolve()
          }).catch(reject)
        }
      })
    })
  })
}

async function createDefaultAdmin() {
  try {
    const admin = await dbGet('SELECT * FROM users WHERE username = ?', ['admin'])
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await dbRun(
        'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
        ['admin', hashedPassword, '관리자']
      )
      console.log('기본 관리자 계정 생성 완료 (username: admin, password: admin123)')
    }
  } catch (error) {
    console.error('관리자 계정 생성 오류:', error)
  }
}
