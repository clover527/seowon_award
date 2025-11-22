import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Nominate from './pages/Nominate'
import Results from './pages/Results'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Layout from './components/Layout'
import { connectSocket } from './utils/socket'

// 인증 필요 라우트
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  useEffect(() => {
    // 로그인되어 있으면 Socket 연결
    const token = localStorage.getItem('token')
    if (token) {
      connectSocket()
    }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nominate" element={<Nominate />} />
                <Route path="/results" element={<Results />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App

