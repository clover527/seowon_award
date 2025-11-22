# 🚀 900명 접속을 위한 배포 가이드

## 방법 1: 무료 호스팅 사용 (추천!) ✨

### Vercel 배포 (가장 쉬움!)

1. **GitHub에 코드 업로드**
```bash
git init
git add .
git commit -m "서원 시상식 앱"
# GitHub에 새 저장소 만들고 푸시
```

2. **Vercel에 배포**
   - https://vercel.com 접속
   - GitHub 로그인
   - "New Project" 클릭
   - 저장소 선택
   - 설정:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   
3. **환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - `NODE_ENV=production` 추가

4. **도메인 받기**
   - Vercel이 자동으로 `your-app.vercel.app` 도메인 제공
   - 예: `seowon-award.vercel.app`
   - 이 주소를 900명에게 공유!

### 또는 Render.com

1. https://render.com 접속
2. "New Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   - Build Command: `npm run build`
   - Start Command: `npm run start`
   - Environment: `Node`

## 방법 2: 직접 서버 배포

### 1. 빌드
```bash
npm run build
```

### 2. 프로덕션 서버 실행
```bash
NODE_ENV=production npm run dev:server
```

### 3. 공개 도메인 설정 (옵션)
- 무료 도메인: Freenom, DuckDNS 등
- 또는 IP 주소로 접속 (예: `http://123.45.67.89:3001`)

## 방법 3: 클라우드 서버 (AWS, Google Cloud 등)

### AWS EC2 배포

1. **EC2 인스턴스 생성**
   - Ubuntu 서버 선택
   - 보안 그룹: 포트 3001 열기

2. **서버 설정**
```bash
# 서버에 접속 후
sudo apt update
sudo apt install nodejs npm -y
git clone [your-repo]
cd "seowon app"
npm install
npm run build
```

3. **PM2로 관리**
```bash
sudo npm install -g pm2
NODE_ENV=production pm2 start server/index.js --name "seowon-award"
pm2 save
pm2 startup
```

4. **Nginx 리버스 프록시 설정** (옵션)
   - 도메인 이름 연결
   - HTTPS 설정

## 배포 후 할 일

### 1. 학생들에게 주소 공유
- **QR 코드**: 학교 게시판에 붙이기
- **카카오톡 공지**: 단체방에 링크 공유
- **문자 발송**: 학교 정보시스템 활용

### 2. 간단한 주소 사용
- 무료 짧은 URL: bit.ly, tinyurl.com
- 예: `bit.ly/seowon-award` → 실제 주소로 리다이렉트

### 3. 접속 확인
- 서버 로그 모니터링
- 동시 접속자 수 확인

## ⚠️ 중요 사항

### 보안
- 기본 비밀번호 변경 필수!
- HTTPS 사용 권장
- SQLite 대신 PostgreSQL 권장 (900명 대응)

### 성능
- 데이터베이스 최적화
- 캐싱 추가 고려
- 로드 밸런싱 (필요시)

### 비용
- Vercel: 무료 (제한 있음)
- Render: 무료 티어 있음
- AWS: 사용량에 따라 과금

## 📱 900명에게 공유하는 방법

### 방법 1: QR 코드 배포
1. QR 코드 생성
2. 교실, 복도, 게시판에 부착
3. 학생들이 스캔해서 접속

### 방법 2: 공지사항
1. 학교 홈페이지에 링크 게시
2. 이메일/문자로 링크 발송
3. 온라인 수업 게시판 활용

### 방법 3: 브라우저 북마크
1. 학교 컴퓨터에 북마크로 저장
2. 모든 학생이 사용할 수 있도록 설정

## 🎯 가장 빠른 방법

**1단계**: Vercel에 배포 (5분)
**2단계**: QR 코드 생성 및 배포
**3단계**: 학생들에게 알림

이렇게 하면 900명 모두 인터넷에서 접속 가능합니다!
