import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const data = isLogin 
        ? { username, password }
        : { username, password, name: name || username }

      const response = await api.post(endpoint, data)
      
      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // 홈으로 이동
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>🏆 서원 월말 시상식</h1>
        <h2>{isLogin ? '로그인' : '회원가입'}</h2>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">이름 (선택)</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">사용자 이름 *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자 이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호 *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="switch-form">
          <p>
            {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="switch-button"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="demo-account">
            <p>테스트 계정:</p>
            <p>사용자 이름: <strong>admin</strong></p>
            <p>비밀번호: <strong>admin123</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
