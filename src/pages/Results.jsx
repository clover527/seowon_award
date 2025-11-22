import { useState, useEffect } from 'react'
import api from '../utils/api'
import { getSocket } from '../utils/socket'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import './Results.css'

function Results() {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [allMonths, setAllMonths] = useState([])
  const [nominations, setNominations] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  useEffect(() => {
    loadMonths()
  }, [])

  useEffect(() => {
    if (selectedMonth) {
      loadNominations()
      setupSocket()
    }
  }, [selectedMonth])

  const loadMonths = async () => {
    try {
      const response = await api.get('/nominations/months')
      const months = response.data
      setAllMonths(months)
      
      if (months.length > 0 && !selectedMonth) {
        setSelectedMonth(months[0])
      } else if (months.length === 0) {
        setSelectedMonth(getCurrentMonth())
      }
    } catch (error) {
      console.error('월 목록 불러오기 오류:', error)
      setSelectedMonth(getCurrentMonth())
    }
  }

  const loadNominations = async () => {
    if (!selectedMonth) return
    
    setLoading(true)
    try {
      const response = await api.get(`/nominations/month/${selectedMonth}`)
      const data = response.data
      setNominations(data)
      
      // 득표수 순으로 정렬
      const sorted = [...data].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      setTopStudents(sorted.slice(0, 10))
    } catch (error) {
      console.error('추천 목록 불러오기 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupSocket = () => {
    const socket = getSocket()
    
    if (selectedMonth) {
      socket.emit('join-month', selectedMonth)
    }

    socket.on('vote-updated', (updatedNomination) => {
      setNominations(prev =>
        prev.map(n =>
          n.id === updatedNomination.id ? updatedNomination : n
        )
      )
      loadNominations() // 전체 목록 새로고침
    })

    socket.on('nominations-updated', () => {
      loadNominations()
    })

    socket.on('nomination-deleted', ({ id }) => {
      setNominations(prev => prev.filter(n => n.id !== id))
      loadNominations()
    })

    return () => {
      socket.off('vote-updated')
      socket.off('nominations-updated')
      socket.off('nomination-deleted')
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

  // 날짜 포맷팅
  let monthDisplay = '선택된 월 없음'
  if (selectedMonth) {
    try {
      const [year, month] = selectedMonth.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)
      monthDisplay = format(date, 'yyyy년 M월', { locale: ko })
    } catch (error) {
      monthDisplay = selectedMonth.replace('-', '년 ') + '월'
    }
  }

  const getVoteCount = (nomination) => {
    return nomination.vote_count || nomination.votes || 1
  }

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>📊 추천 결과</h1>
        <p>학생들의 추천 현황을 확인하세요</p>
      </div>

      <div className="month-selector-container">
        <label htmlFor="monthSelect" className="month-label">월 선택:</label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-select"
        >
          {allMonths.length > 0 ? (
            allMonths.map((month) => {
              let monthLabel = month
              try {
                const [year, m] = month.split('-')
                const date = new Date(parseInt(year), parseInt(m) - 1, 1)
                monthLabel = format(date, 'yyyy년 M월', { locale: ko })
              } catch (error) {
                monthLabel = month.replace('-', '년 ') + '월'
              }
              return (
                <option key={month} value={month}>
                  {monthLabel}
                </option>
              )
            })
          ) : (
            <option value={getCurrentMonth()}>
              {(() => {
                const month = getCurrentMonth()
                try {
                  const [year, m] = month.split('-')
                  const date = new Date(parseInt(year), parseInt(m) - 1, 1)
                  return format(date, 'yyyy년 M월', { locale: ko })
                } catch (error) {
                  return month.replace('-', '년 ') + '월'
                }
              })()}
            </option>
          )}
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h2>데이터를 불러오는 중...</h2>
        </div>
      ) : nominations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>{monthDisplay}에는 아직 추천이 없습니다</h2>
          <p>첫 번째 추천을 작성해보세요!</p>
        </div>
      ) : (
        <>
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">{nominations.length}</div>
              <div className="stat-label">총 추천 수</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{getVoteCount(topStudents[0] || {})}</div>
              <div className="stat-label">최고 득표</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {Math.round(nominations.reduce((sum, n) => sum + getVoteCount(n), 0) / nominations.length) || 0}
              </div>
              <div className="stat-label">평균 득표</div>
            </div>
          </div>

          <div className="ranking-section">
            <h2>🏆 {monthDisplay} 랭킹</h2>
            <div className="ranking-list">
              {topStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className={`ranking-item ${index < 3 ? 'top-three' : ''}`}
                >
                  <div className="rank-position">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `${index + 1}위`}
                  </div>
                  <div className="rank-content">
                    <div className="rank-header">
                      <h3>{student.student_name}</h3>
                      <button
                        onClick={() => handleVote(student.id)}
                        className="vote-button"
                      >
                        👍 {getVoteCount(student)}
                      </button>
                    </div>
                    <p className="rank-reason">{student.reason}</p>
                    <div className="rank-footer">
                      <span>추천자: {student.nominator_name || '익명'}</span>
                      <span>
                        {(() => {
                          try {
                            return format(new Date(student.created_at), 'M월 d일', { locale: ko })
                          } catch (error) {
                            return new Date(student.created_at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {nominations.length > 10 && (
            <div className="all-nominations">
              <h2>전체 추천 목록</h2>
              <div className="nominations-list">
                {nominations
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((nomination) => (
                    <div key={nomination.id} className="nomination-item">
                      <div className="nomination-item-header">
                        <h4>{nomination.student_name}</h4>
                        <button
                          onClick={() => handleVote(nomination.id)}
                          className="vote-button small"
                        >
                          👍 {getVoteCount(nomination)}
                        </button>
                      </div>
                      <p>{nomination.reason}</p>
                      <div className="nomination-item-footer">
                        <span>{nomination.nominator_name || '익명'}</span>
                        <span>
                          {(() => {
                            try {
                              return format(new Date(nomination.created_at), 'M월 d일 HH:mm', { locale: ko })
                            } catch (error) {
                              return new Date(nomination.created_at).toLocaleString('ko-KR')
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Results