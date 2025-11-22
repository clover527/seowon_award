import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import ShareLink from '../components/ShareLink'
import './Home.css'

function Home() {
  const [topStudents, setTopStudents] = useState([])
  const [currentMonth, setCurrentMonth] = useState('')
  const [loading, setLoading] = useState(true)

  // 현재 월 가져오기
  const getCurrentMonth = () => {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const month = getCurrentMonth()
      setCurrentMonth(month)
      
      const response = await api.get(`/nominations/month/${month}`)
      const nominations = response.data
      
      // 득표수 순으로 정렬하고 상위 5개만
      const sorted = nominations
        .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
        .slice(0, 5)
      
      setTopStudents(sorted)
    } catch (error) {
      console.error('데이터 불러오기 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  // 날짜 포맷팅
  let monthName = currentMonth
  try {
    if (currentMonth) {
      const [year, month] = currentMonth.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1, 1)
      monthName = format(date, 'yyyy년 M월', { locale: ko })
    }
  } catch (error) {
    monthName = currentMonth.replace('-', '년 ') + '월'
  }

  return (
    <div className="home">
      <div className="hero">
        <h1>🏆 서원 월말 시상식</h1>
        <p className="subtitle">매월 잘한 학생들을 추천하고 함께 축하해요!</p>
        {currentMonth && (
          <div className="current-month">
            현재 진행 중: <strong>{monthName}</strong>
          </div>
        )}
      </div>

      <div className="share-section">
        <ShareLink />
        <div className="access-tips">
          <h3>💡 빠른 접속 팁</h3>
          <ul>
            <li>📌 <strong>북마크 저장</strong>: 이 페이지를 북마크에 저장하세요 (Cmd+D / Ctrl+D)</li>
            <li>📱 <strong>홈 화면 추가</strong>: 모바일에서 홈 화면에 추가하면 앱처럼 사용 가능!</li>
            <li>🔖 <strong>QR 코드</strong>: 위의 QR 코드를 스캔하면 바로 접속됩니다</li>
          </ul>
          <p className="note">⚠️ 이 앱은 로컬 네트워크용이므로 구글 검색에서는 찾을 수 없습니다. 북마크나 홈 화면 추가를 권장합니다!</p>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/nominate" className="action-card primary">
          <div className="action-icon">✨</div>
          <h3>학생 추천하기</h3>
          <p>잘한 친구를 추천해주세요</p>
        </Link>
        <Link to="/results" className="action-card">
          <div className="action-icon">📊</div>
          <h3>결과 보기</h3>
          <p>추천 결과를 확인하세요</p>
        </Link>
        <Link to="/admin" className="action-card">
          <div className="action-icon">⚙️</div>
          <h3>관리</h3>
          <p>시상식 관리</p>
        </Link>
      </div>

      {loading ? (
        <div className="loading">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : topStudents.length > 0 ? (
        <div className="top-students">
          <h2>🔥 이번 달 인기 학생들</h2>
          <div className="student-list">
            {topStudents.map((student, index) => (
              <div key={student.id} className="student-card">
                <div className="rank-badge">{index + 1}</div>
                <div className="student-info">
                  <h3>{student.student_name}</h3>
                  <p>{student.reason}</p>
                  <div className="vote-count">👍 {student.vote_count || 1}표</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>아직 추천이 없습니다. 첫 번째 추천을 작성해보세요!</p>
        </div>
      )}

      <div className="info-section">
        <h2>📋 사용 방법</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="step-number">1</div>
            <h3>학생 추천</h3>
            <p>잘한 학생의 이름과 이유를 작성해주세요</p>
          </div>
          <div className="info-card">
            <div className="step-number">2</div>
            <h3>투표 참여</h3>
            <p>추천된 학생들에게 좋아요를 눌러주세요</p>
          </div>
          <div className="info-card">
            <div className="step-number">3</div>
            <h3>시상식</h3>
            <p>월말에 가장 많은 추천을 받은 학생들에게 시상을 진행합니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home