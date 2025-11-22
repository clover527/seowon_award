import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { getSocket } from '../utils/socket'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import './Nominate.css'

function Nominate() {
  const navigate = useNavigate()
  const [studentName, setStudentName] = useState('')
  const [reason, setReason] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [nominations, setNominations] = useState([])
  const [loading, setLoading] = useState(false)

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  const currentMonth = getCurrentMonth()

  // 날짜 포맷팅
  let currentMonthStr = ''
  try {
    const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    currentMonthStr = format(date, 'yyyy년 M월', { locale: ko })
  } catch (error) {
    const now = new Date()
    currentMonthStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월`
  }

  // 추천 목록 불러오기
  useEffect(() => {
    loadNominations()
    setupSocket()
  }, [])

  const loadNominations = async () => {
    try {
      const response = await api.get(`/nominations/month/${currentMonth}`)
      setNominations(response.data)
    } catch (error) {
      console.error('추천 목록 불러오기 오류:', error)
    }
  }

  const setupSocket = () => {
    const socket = getSocket()
    
    socket.emit('join-month', currentMonth)

    socket.on('nomination-added', (newNomination) => {
      setNominations(prev => {
        const exists = prev.find(n => n.id === newNomination.id)
        if (!exists) {
          return [newNomination, ...prev]
        }
        return prev
      })
    })

    socket.on('vote-updated', (updatedNomination) => {
      setNominations(prev =>
        prev.map(n =>
          n.id === updatedNomination.id ? updatedNomination : n
        )
      )
    })

    socket.on('nominations-updated', () => {
      loadNominations()
    })

    return () => {
      socket.off('nomination-added')
      socket.off('vote-updated')
      socket.off('nominations-updated')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!studentName.trim()) {
      setError('학생 이름을 입력해주세요')
      setLoading(false)
      return
    }

    if (!reason.trim()) {
      setError('추천 이유를 입력해주세요')
      setLoading(false)
      return
    }

    try {
      await api.post('/nominations', {
        studentName: studentName.trim(),
        reason: reason.trim()
      })

      setSuccess(true)
      setStudentName('')
      setReason('')
      loadNominations()

      setTimeout(() => {
        setSuccess(false)
        navigate('/results')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || '추천 저장 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (nominationId) => {
    try {
      await api.post(`/nominations/${nominationId}/vote`)
      // Socket.io가 자동으로 업데이트를 보내줌
    } catch (err) {
      alert(err.response?.data?.error || '투표 중 오류가 발생했습니다')
    }
  }

  // 득표수 계산
  const getVoteCount = (nomination) => {
    return nomination.vote_count || nomination.votes || 1
  }

  return (
    <div className="nominate-page">
      <div className="page-header">
        <h1>✨ 학생 추천하기</h1>
        <p>잘한 친구를 추천해주세요 - {currentMonthStr}</p>
      </div>

      <div className="nominate-form-container">
        <form onSubmit={handleSubmit} className="nominate-form">
          <div className="form-group">
            <label htmlFor="studentName">학생 이름 *</label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="추천할 학생의 이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">추천 이유 *</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="이 학생을 추천하는 이유를 작성해주세요"
              rows="5"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">✅ 추천이 완료되었습니다!</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '저장 중...' : '추천하기'}
          </button>
        </form>
      </div>

      {nominations.length > 0 && (
        <div className="current-nominations">
          <h2>📋 현재 추천 목록</h2>
          <div className="nominations-grid">
            {nominations
              .sort((a, b) => getVoteCount(b) - getVoteCount(a))
              .map((nomination) => (
                <div key={nomination.id} className="nomination-card">
                  <div className="nomination-header">
                    <h3>{nomination.student_name}</h3>
                    <button
                      onClick={() => handleVote(nomination.id)}
                      className="vote-button"
                      title="좋아요"
                    >
                      👍 {getVoteCount(nomination)}
                    </button>
                  </div>
                  <p className="nomination-reason">{nomination.reason}</p>
                  <div className="nomination-footer">
                    <span className="nominator">추천자: {nomination.nominator_name || '익명'}</span>
                    <span className="timestamp">
                      {(() => {
                        try {
                          return format(new Date(nomination.created_at), 'M월 d일', { locale: ko })
                        } catch (error) {
                          return new Date(nomination.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                        }
                      })()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Nominate