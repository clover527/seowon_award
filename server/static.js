import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 정적 파일 서빙 (프로덕션 빌드된 React 앱)
export function setupStaticFiles(app) {
  // 프로덕션 빌드 경로
  const distPath = join(__dirname, '../../dist')
  
  // 정적 파일 서빙
  app.use(express.static(distPath))
  
  // React Router를 위한 fallback - 모든 라우트를 index.html로
  app.get('*', (req, res) => {
    // API 경로는 제외
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' })
    }
    
    // index.html 서빙
    try {
      const html = readFileSync(join(distPath, 'index.html'), 'utf-8')
      res.send(html)
    } catch (error) {
      res.status(404).send('앱을 먼저 빌드해주세요. npm run build')
    }
  })
}
