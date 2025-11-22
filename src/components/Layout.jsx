import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            🏆 서원 시상식
          </Link>
          <div className="nav-links">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              홈
            </Link>
            <Link 
              to="/nominate" 
              className={location.pathname === '/nominate' ? 'active' : ''}
            >
              추천하기
            </Link>
            <Link 
              to="/results" 
              className={location.pathname === '/results' ? 'active' : ''}
            >
              결과보기
            </Link>
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              관리
            </Link>
            <div className="user-menu">
              {user && <span className="user-name">{user.name || user.username}</span>}
              <button onClick={handleLogout} className="logout-button">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

