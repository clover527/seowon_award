# 🚀 Render.com 배포 가이드 (가장 쉬움!)

Vercel 대신 **Render.com**을 사용하면 Express + Socket.io가 완벽하게 작동합니다!

## ✅ Render.com 장점

- ✅ Express 서버 완벽 지원
- ✅ Socket.io 지원
- ✅ SQLite 지원
- ✅ 무료 플랜 제공
- ✅ 900명 접속 가능

---

## 1단계: Render.com 가입

1. https://render.com 접속
2. **"Get Started for Free"** 클릭
3. **GitHub 계정으로 로그인** (가장 쉬움!)

---

## 2단계: 새 Web Service 생성

1. Render 대시보드에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. **"Connect GitHub"** 클릭 (처음이면)
4. `solgae0527/seowon_award` 저장소 선택
5. **"Connect"** 클릭

---

## 3단계: 서비스 설정

### 기본 설정:
- **Name**: `seowon-award` (아무 이름이나)
- **Region**: `Oregon (US West)` 또는 원하는 지역
- **Branch**: `main`
- **Root Directory**: `./` (기본값)

### 빌드 설정:
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 환경 변수 (Environment Variables):

**"Add Environment Variable"** 클릭해서 다음 추가:

1. **Key**: `NODE_ENV`
   **Value**: `production`

2. **Key**: `JWT_SECRET`
   **Value**: `seowon-award-secret-key-2024-change-me`

3. **Key**: `PORT`
   **Value**: `10000` (Render가 자동으로 설정하지만 명시적으로 추가)

---

## 4단계: 플랜 선택

- **Free** 플랜 선택 (무료!)
- 또는 **Starter** (더 많은 리소스)

---

## 5단계: 배포!

맨 아래 **"Create Web Service"** 클릭!

⏳ 배포는 약 5-10분 걸립니다...

---

## 6단계: 배포 완료! 🎉

배포가 완료되면:

1. ✅ **배포된 주소 확인**
   - 예: `https://seowon-award.onrender.com`
   - 또는: `https://seowon-award-xxxx.onrender.com`

2. ✅ **주소 클릭해서 접속 테스트**
   - 로그인 페이지가 나오면 성공!

3. ✅ **기본 계정으로 로그인**
   - Username: `admin`
   - Password: `admin123`

---

## 7단계: 900명에게 공유! 📢

### 방법 1: QR 코드
배포된 주소로 접속 → `/share.html` 추가 → QR 코드 생성

### 방법 2: 링크 공유
카카오톡, 문자, 학교 홈페이지에 링크 공유

### 방법 3: 짧은 URL
bit.ly로 짧은 URL 만들기

---

## ⚠️ 중요 참고사항

### 1. 무료 플랜 제한
- **Cold Start**: 15분 비활성 후 첫 요청이 느릴 수 있음 (30초 이내)
- **리소스 제한**: 하지만 900명 접속은 충분히 가능!

### 2. SQLite 파일 저장
- 무료 플랜에서는 파일이 주기적으로 삭제될 수 있음
- 중간중간 백업 권장
- 또는 나중에 PostgreSQL로 업그레이드 가능

### 3. 비밀번호 변경 필수!
배포 후 반드시 관리자 비밀번호 변경!

---

## 🎯 배포 확인 체크리스트

- [ ] Render에 GitHub 저장소 연결됨
- [ ] 환경 변수 추가됨 (`NODE_ENV`, `JWT_SECRET`, `PORT`)
- [ ] 배포 성공!
- [ ] 배포된 주소로 접속 가능
- [ ] 로그인 페이지 표시됨
- [ ] 기본 계정으로 로그인 성공

---

## 📞 문제 해결

### 배포 실패하면?
1. Render 대시보드 → **Events** 탭에서 로그 확인
2. 빌드 로그 확인
3. 오류 메시지 알려주시면 해결 도와드릴게요!

### 접속이 안 되면?
1. 배포가 완료되었는지 확인 (5-10분 대기)
2. 주소가 정확한지 확인
3. 브라우저 캐시 삭제 후 재접속

---

## 🚀 Render.com이 Vercel보다 좋은 점

- ✅ Express 서버 완벽 지원
- ✅ Socket.io 실시간 통신 지원
- ✅ SQLite 사용 가능
- ✅ 더 간단한 설정

지금 Render.com으로 가서 배포하세요! 5-10분이면 끝납니다! 🎉
