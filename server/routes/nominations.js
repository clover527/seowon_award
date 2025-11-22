import express from 'express'
import { dbGet, dbAll, dbRun } from '../database.js'
import { authenticateToken } from './auth.js'

const router = express.Router()

// 현재 월 가져오기
function getCurrentMonth() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

// 모든 월 가져오기
router.get('/months', async (req, res) => {
  try {
    const months = await dbAll(`
      SELECT DISTINCT month 
      FROM nominations 
      ORDER BY month DESC
    `)
    res.json(months.map(m => m.month))
  } catch (error) {
    console.error('월 목록 조회 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 특정 월의 추천 목록 가져오기
router.get('/month/:month', async (req, res) => {
  try {
    const { month } = req.params
    const nominations = await dbAll(`
      SELECT 
        n.*,
        u.name as nominator_name,
        COUNT(DISTINCT v.id) as vote_count
      FROM nominations n
      LEFT JOIN users u ON n.nominator_id = u.id
      LEFT JOIN votes v ON n.id = v.nomination_id
      WHERE n.month = ?
      GROUP BY n.id
      ORDER BY vote_count DESC, n.created_at DESC
    `, [month])

    res.json(nominations)
  } catch (error) {
    console.error('추천 목록 조회 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 추천 추가
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { studentName, reason } = req.body
    const userId = req.user.userId
    const month = getCurrentMonth()

    if (!studentName || !reason) {
      return res.status(400).json({ error: '학생 이름과 추천 이유를 입력해주세요' })
    }

    const result = await dbRun(
      'INSERT INTO nominations (student_name, reason, nominator_id, month) VALUES (?, ?, ?, ?)',
      [studentName.trim(), reason.trim(), userId, month]
    )

    // 첫 투표는 추천자 본인의 것
    await dbRun(
      'INSERT INTO votes (nomination_id, user_id) VALUES (?, ?)',
      [result.lastID, userId]
    )

    // 실시간 업데이트
    const io = req.app.get('io')
    const newNomination = await dbGet(`
      SELECT 
        n.*,
        u.name as nominator_name,
        (SELECT COUNT(*) FROM votes WHERE nomination_id = n.id) as vote_count
      FROM nominations n
      LEFT JOIN users u ON n.nominator_id = u.id
      WHERE n.id = ?
    `, [result.lastID])

    if (io) {
      io.to(`month-${month}`).emit('nomination-added', newNomination)
    }

    res.json({
      message: '추천이 추가되었습니다',
      nomination: newNomination
    })
  } catch (error) {
    console.error('추천 추가 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 투표하기
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // 추천 존재 확인
    const nomination = await dbGet('SELECT * FROM nominations WHERE id = ?', [id])
    if (!nomination) {
      return res.status(404).json({ error: '추천을 찾을 수 없습니다' })
    }

    // 이미 투표했는지 확인
    const existingVote = await dbGet(
      'SELECT * FROM votes WHERE nomination_id = ? AND user_id = ?',
      [id, userId]
    )

    if (existingVote) {
      return res.status(400).json({ error: '이미 투표하셨습니다' })
    }

    // 투표 추가
    await dbRun(
      'INSERT INTO votes (nomination_id, user_id) VALUES (?, ?)',
      [id, userId]
    )

    // 실시간 업데이트
    const io = req.app.get('io')
    const updatedNomination = await dbGet(`
      SELECT 
        n.*,
        u.name as nominator_name,
        (SELECT COUNT(*) FROM votes WHERE nomination_id = n.id) as vote_count
      FROM nominations n
      LEFT JOIN users u ON n.nominator_id = u.id
      WHERE n.id = ?
    `, [id])

    if (io) {
      io.to(`month-${nomination.month}`).emit('vote-updated', updatedNomination)
      io.to(`month-${nomination.month}`).emit('nominations-updated', {
        month: nomination.month
      })
    }

    res.json({
      message: '투표가 완료되었습니다',
      nomination: updatedNomination
    })
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: '이미 투표하셨습니다' })
    }
    console.error('투표 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

// 추천 삭제 (관리자 또는 작성자만)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const nomination = await dbGet('SELECT * FROM nominations WHERE id = ?', [id])
    if (!nomination) {
      return res.status(404).json({ error: '추천을 찾을 수 없습니다' })
    }

    // 작성자 또는 관리자만 삭제 가능
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId])
    if (nomination.nominator_id !== userId && user.username !== 'admin') {
      return res.status(403).json({ error: '삭제 권한이 없습니다' })
    }

    await dbRun('DELETE FROM votes WHERE nomination_id = ?', [id])
    await dbRun('DELETE FROM nominations WHERE id = ?', [id])

    // 실시간 업데이트
    const io = req.app.get('io')
    if (io) {
      io.to(`month-${nomination.month}`).emit('nomination-deleted', { id: parseInt(id) })
      io.to(`month-${nomination.month}`).emit('nominations-updated', {
        month: nomination.month
      })
    }

    res.json({ message: '추천이 삭제되었습니다' })
  } catch (error) {
    console.error('추천 삭제 오류:', error)
    res.status(500).json({ error: '서버 오류가 발생했습니다' })
  }
})

export default router
