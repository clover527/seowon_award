import axios from 'axios'

// API URL 자동 감지
function getApiUrl() {
  // 프로덕션 환경 변수가 있으면 사용
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // 현재 호스트 기반으로 API URL 생성
  const host = window.location.hostname
  const port = window.location.port || '3000'
  
  // localhost면 기본 포트 3001 사용
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3001/api'
  }
  
  // 네트워크 접속이면 같은 IP의 3001 포트 사용
  return `http://${host}:3001/api`
}

const API_URL = getApiUrl()

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
