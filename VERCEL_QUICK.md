# 🚀 Vercel 배포 빠른 가이드

## ✅ GitHub 푸시 완료! 이제 Vercel 배포만 하면 됩니다!

### 단계별 가이드 (5분)

---

## 1단계: Vercel 가입/로그인

1. 브라우저가 자동으로 열렸습니다
   - 안 열렸다면: https://vercel.com 접속

2. **"Sign Up"** 또는 **"Continue with GitHub"** 클릭
   - GitHub 계정으로 로그인하는 게 가장 쉬움!

---

## 2단계: 프로젝트 생성

1. Vercel 대시보드에서 **"Add New..."** 클릭
2. **"Project"** 선택
3. **"Import Git Repository"** 섹션에서
   - `solgae0527/seowon-award` 저장소 찾기
   - **"Import"** 클릭

---

## 3단계: 프로젝트 설정

Vercel이 자동으로 설정을 감지합니다:

✅ **Framework Preset**: Vite (자동 감지)
✅ **Root Directory**: `./` (기본값)
✅ **Build Command**: `npm run build` (자동 설정)
✅ **Output Directory**: `dist` (자동 설정)
✅ **Install Command**: `npm install` (기본값)

**그대로 두고 다음으로!**

---

## 4단계: 환경 변수 추가 (중요!)

**Environment Variables** 섹션에서 다음 추가:

### 변수 1:
- **Name**: `NODE_ENV`
- **Value**: `production`

### 변수 2:
- **Name**: `JWT_SECRET`
- **Value**: `seowon-award-super-secret-key-2024-change-later`
  (아무 긴 문자열이나 가능, 나중에 변경 가능)

**"Add"** 클릭해서 각각 추가!

---

## 5단계: 배포 시작!

맨 아래 **"Deploy"** 버튼 클릭!

⏳ 배포는 약 2-3분 걸립니다...

---

## 6단계: 배포 완료! 🎉

배포가 완료되면:

1. ✅ **배포된 주소 확인**
   - 예: `https://seowon-award.vercel.app`
   - 또는: `https://seowon-award-solgae0527.vercel.app`

2. ✅ **주소 클릭해서 접속 테스트**
   - 로그인 페이지가 나오면 성공!

3. ✅ **기본 계정으로 로그인**
   - Username: `admin`
   - Password: `admin123`

---

## 7단계: 900명에게 공유! 📢

### 방법 1: QR 코드 생성

1. 배포된 주소로 접속
2. URL 끝에 `/share.html` 추가
   - 예: `https://seowon-award.vercel.app/share.html`
3. QR 코드 인쇄해서 교실/게시판에 부착!

### 방법 2: 링크 공유

- 카카오톡 단체방에 링크 공유
- 학교 홈페이지에 게시
- 온라인 수업 게시판에 공지

### 방법 3: 짧은 URL 만들기

1. https://bit.ly 접속
2. 배포된 주소를 짧게 만들기
3. 예: `bit.ly/seowon-award`

---

## ⚠️ 중요 사항

### 1. SQLite 문제 해결 필요

현재는 SQLite를 사용하지만, Vercel에서는 작동하지 않을 수 있습니다.

**해결 방법**: Supabase 사용 (무료)

1. https://supabase.com 접속
2. 무료 계정 생성
3. 새 프로젝트 생성
4. Database → Settings → Connection string 복사
5. Vercel 환경 변수에 추가:
   - Name: `DATABASE_URL`
   - Value: (복사한 문자열)

### 2. 비밀번호 변경 필수!

배포 후 반드시:
1. 로그인 (admin/admin123)
2. 관리자 비밀번호 변경
3. 또는 회원가입해서 새 계정 사용

---

## 🎯 배포 확인 체크리스트

- [ ] Vercel에 GitHub 저장소 연결됨
- [ ] 환경 변수 추가됨 (`NODE_ENV`, `JWT_SECRET`)
- [ ] 배포 성공!
- [ ] 배포된 주소로 접속 가능
- [ ] 로그인 페이지 표시됨
- [ ] 기본 계정으로 로그인 성공

---

## 📞 문제 발생 시

### 배포 실패하면?
1. Vercel 대시보드 → **Deployments** 클릭
2. 실패한 배포 클릭
3. **Logs** 탭에서 오류 확인
4. 오류 메시지 알려주시면 해결 도와드릴게요!

### 접속이 안 되면?
1. 배포가 완료되었는지 확인 (2-3분 대기)
2. 주소가 정확한지 확인
3. 브라우저 캐시 삭제 후 재접속

---

## 🚀 다음 단계

배포 완료 후 받은 주소를 알려주시면:
- ✅ QR 코드 생성
- ✅ 데이터베이스 설정 도와드리기
- ✅ 추가 기능 구현

지금 Vercel로 가서 배포하세요! 5분이면 끝납니다! 🎉
