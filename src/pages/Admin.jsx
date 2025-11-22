import { useState } from 'react'
import { getAllMonths, getNominations, getTopStudents, deleteNomination, resetMonth } from '../utils/storage'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import './Admin.css'

function Admin() {
  const [selectedMonth, setSelectedMonth] = useState(getAllMonths()[0] || '')
  const allMonths = getAllMonths()
  const nominations = selectedMonth ? getNominations(selectedMonth) : []
  const topStudents = selectedMonth ? getTopStudents(selectedMonth, 10) : []

  const handleDelete = (nominationId) => {
    if (window.confirm('이 추천을 삭제하시겠습니까?')) {
      deleteNomination(nominationId, selectedMonth)
      window.location.reload()
    }
  }

  const handleResetMonth = () => {
    let monthLabel = selectedMonth
    try {
      const [year, month] = selectedMonth.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)
      monthLabel = format(date, 'yyyy년 M월', { locale: ko })
    } catch (error) {
      monthLabel = selectedMonth.replace('-', '년 ') + '월'
    }
    
    if (window.confirm(`정말 ${monthLabel}의 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      resetMonth(selectedMonth)
      setSelectedMonth('')
      window.location.reload()
    }
  }

  const exportData = () => {
    if (!selectedMonth) return
    
    const data = {
      month: selectedMonth,
      nominations: nominations,
      topStudents: topStudents
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `시상식_${selectedMonth}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    if (!selectedMonth || nominations.length === 0) return
    
    const headers = ['순위', '학생 이름', '추천 이유', '추천자', '득표 수', '추천 날짜']
    const rows = topStudents.map((student, index) => {
      let dateStr = ''
      try {
        dateStr = format(new Date(student.timestamp), 'yyyy-MM-dd', { locale: ko })
      } catch (error) {
        dateStr = new Date(student.timestamp).toISOString().split('T')[0]
      }
      return [
        index + 1,
        student.studentName,
        student.reason,
        student.nominator,
        student.votes || 1,
        dateStr
      ]
    })
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `시상식_${selectedMonth}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>⚙️ 관리자 페이지</h1>
        <p>시상식 데이터를 관리하세요</p>
      </div>

      <div className="admin-controls">
        <div className="control-group">
          <label htmlFor="adminMonthSelect">월 선택:</label>
          <select
            id="adminMonthSelect"
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
              <option value="">데이터가 없습니다</option>
            )}
          </select>
        </div>

        {selectedMonth && (
          <div className="action-buttons">
            <button onClick={exportCSV} className="action-btn export">
              📊 CSV 내보내기
            </button>
            <button onClick={exportData} className="action-btn export">
              💾 JSON 내보내기
            </button>
            <button 
              onClick={handleResetMonth} 
              className="action-btn danger"
            >
              🗑️ 전체 삭제
            </button>
          </div>
        )}
      </div>

      {selectedMonth && nominations.length > 0 ? (
        <>
          <div className="admin-stats">
            <div className="stat-item">
              <span className="stat-label">총 추천 수</span>
              <span className="stat-value">{nominations.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">총 득표 수</span>
              <span className="stat-value">
                {nominations.reduce((sum, n) => sum + (n.votes || 1), 0)}
              </span>
            </div>
          </div>

          <div className="admin-nominations">
            <h2>
              {(() => {
                try {
                  const [year, month] = selectedMonth.split('-')
                  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
                  return format(date, 'yyyy년 M월', { locale: ko })
                } catch (error) {
                  return selectedMonth.replace('-', '년 ') + '월'
                }
              })()} 추천 목록
            </h2>
            <div className="admin-list">
              {nominations
                .sort((a, b) => (b.votes || 1) - (a.votes || 1))
                .map((nomination, index) => (
                  <div key={nomination.id} className="admin-nomination-card">
                    <div className="admin-card-header">
                      <div className="admin-rank">#{index + 1}</div>
                      <div className="admin-card-title">
                        <h3>{nomination.studentName}</h3>
                        <span className="vote-badge">👍 {nomination.votes || 1}표</span>
                      </div>
                      <button
                        onClick={() => handleDelete(nomination.id)}
                        className="delete-btn"
                        title="삭제"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="admin-reason">{nomination.reason}</p>
                    <div className="admin-card-footer">
                      <span>추천자: {nomination.nominator}</span>
                      <span>
                        {(() => {
                          try {
                            return format(new Date(nomination.timestamp), 'yyyy-MM-dd HH:mm', { locale: ko })
                          } catch (error) {
                            return new Date(nomination.timestamp).toLocaleString('ko-KR')
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      ) : selectedMonth ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>이 월에는 데이터가 없습니다</h2>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>먼저 월을 선택해주세요</h2>
        </div>
      )}
    </div>
  )
}

export default Admin
