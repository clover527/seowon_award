import { io } from 'socket.io-client'

// Socket URL 자동 감지
function getSocketUrl() {
  // 프로덕션 환경 변수가 있으면 사용
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }
  
  // 현재 호스트 기반으로 Socket URL 생성
  const host = window.location.hostname
  const port = window.location.port || '3000'
  
  // localhost면 기본 포트 3001 사용
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3001'
  }
  
  // 네트워크 접속이면 같은 IP의 3001 포트 사용
  return `http://${host}:3001`
}

let socket = null

export function connectSocket() {
  if (!socket) {
    const SOCKET_URL = getSocketUrl()
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Socket 연결됨:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket 연결 해제됨')
    })

    socket.on('error', (error) => {
      console.error('Socket 오류:', error)
    })
  }
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket || connectSocket()
}
