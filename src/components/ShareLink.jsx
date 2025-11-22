import { useState, useEffect } from 'react'
import './ShareLink.css'

function ShareLink() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.origin)
  }, [])

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '서원 시상식',
          text: '서원 월말 시상식 앱에 접속하세요!',
          url: currentUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyLink()
        }
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className="share-link-container">
      <button onClick={() => setShowQR(!showQR)} className="qr-toggle-button">
        {showQR ? '❌' : '📱'} {showQR ? 'QR 코드 닫기' : 'QR 코드 보기'}
      </button>
      
      {showQR && (
        <div className="qr-modal">
          <div className="qr-content">
            <h3>📱 QR 코드로 접속하기</h3>
            <p>이 QR 코드를 스캔하세요</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`}
              alt="QR Code"
              className="qr-image"
            />
            <div className="link-display">
              <code>{currentUrl}</code>
            </div>
            <div className="share-buttons">
              <button onClick={copyLink} className="copy-button">
                {copied ? '✅ 복사 완료!' : '📋 링크 복사'}
              </button>
              {navigator.share && (
                <button onClick={shareLink} className="share-button">
                  📤 공유하기
                </button>
              )}
            </div>
            <p className="help-text">
              💡 같은 Wi-Fi에 연결된 기기만 접속 가능합니다
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareLink
