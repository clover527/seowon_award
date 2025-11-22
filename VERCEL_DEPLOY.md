# 🚀 Vercel 배포 가이드

## 1단계: GitHub에 코드 업로드

### GitHub 저장소 만들기

1. https://github.com 접속 및 로그인
2. 우측 상단 "+" 클릭 → "New repository"
3. 저장소 이름: `seowon-award` (또는 원하는 이름)
4. "Create repository" 클릭

### 코드 업로드

터미널에서 실행:

```bash
cd "/Users/leews/seowon app"

# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "서원 시상식 앱 초기 버전"

# GitHub 저장소 연결 (위에서 만든 저장소 URL 사용)
git remote add origin https://github.com/YOUR_USERNAME/seowon-award.git

# 코드 푸시
git branch -M main
git push -u origin main
```

⚠️ **중요**: `YOUR_USERNAME`을 본인의 GitHub 사용자 이름으로 변경하세요!

## 2단계: Vercel에 배포

### Vercel 가입 및 로그인

1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (가장 쉬움!)

### 프로젝트 배포

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. **GitHub 저장소 선택**: `seowon-award` 선택
3. **프로젝트 설정**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables (환경 변수)** 추가:
   - Key: `NODE_ENV`
   - Value: `production`
   - Key: `JWT_SECRET`
   - Value: `your-super-secret-key-change-this` (임의의 긴 문자열)

5. **"Deploy"** 버튼 클릭!

### 배포 완료! 🎉

배포가 완료되면 Vercel이 자동으로 주소를 만들어줍니다:
- 예: `https://seowon-award.vercel.app`
- 또는: `https://seowon-award-username.vercel.app`

## 3단계: 데이터베이스 설정 (중요!)

⚠️ **SQLite는 Vercel에서 사용 불가능합니다!**

### 옵션 1: Supabase (무료, 추천!)

1. https://supabase.com 접속
2. 무료 계정 생성
3. 새 프로젝트 생성
4. Database → Settings → Connection string 복사
5. Vercel 환경 변수에 추가:
   - Key: `DATABASE_URL`
   - Value: (Supabase에서 복사한 문자열)

### 옵션 2: Vercel Postgres (비용 발생 가능)

1. Vercel 대시보드 → Storage → Create Database
2. Postgres 선택
3. 자동으로 환경 변수 추가됨

### 옵션 3: PlanetScale (무료 티어 있음)

1. https://planetscale.com 접속
2. 무료 계정 생성
3. 데이터베이스 생성
4. Connection string을 Vercel 환경 변수에 추가

## 4단계: 학생들에게 공유

### 방법 1: QR 코드 생성

1. 배포된 주소 (예: `https://seowon-award.vercel.app`)로 접속
2. `/share.html` 페이지 접속 (자동으로 QR 코드 생성됨)
3. QR 코드를 인쇄하여 교실/게시판에 부착

### 방법 2: 링크 공유

1. 배포된 주소를 카카오톡/문자로 공유
2. 학교 홈페이지에 링크 게시
3. 온라인 수업 게시판에 공지

### 방법 3: 짧은 URL 사용

1. https://bit.ly 또는 https://tinyurl.com 접속
2. 배포된 주소를 짧게 만들기
3. 예: `bit.ly/seowon-award`

## ⚠️ 주의사항

### 1. 비밀번호 변경 필수!
- 기본 계정 (admin/admin123)은 반드시 변경하세요!
- 배포 후 로그인해서 비밀번호 변경

### 2. 데이터베이스 마이그레이션 필요
- SQLite → PostgreSQL로 변경 필요
- `server/database.js` 파일 수정 필요

### 3. 무료 플랜 제한
- Vercel 무료 플랜: 월 100GB 대역폭
- 900명 접속 시 충분하지만, 트래픽 모니터링 필요

## 🎯 빠른 배포 (5분 안에!)

**가장 빠른 방법:**

1. ✅ GitHub에 코드 업로드 (2분)
2. ✅ Vercel에 연결 및 배포 (2분)
3. ✅ 주소 확인 및 공유 (1분)

**총 5분이면 900명이 접속 가능합니다!**

## 📞 문제 해결

### 배포 실패 시
- Vercel 로그 확인 (Deployments → 해당 배포 클릭 → Logs)
- 환경 변수 확인
- GitHub 저장소 권한 확인

### 접속 안 될 때
- 도메인이 활성화되었는지 확인
- Vercel 대시보드에서 상태 확인
- 브라우저 캐시 삭제 후 재접속

## 💡 추가 팁

- **커스텀 도메인**: Vercel에서 무료 도메인 설정 가능
- **자동 배포**: GitHub에 푸시하면 자동으로 재배포됨
- **프리뷰 배포**: Pull Request마다 미리보기 URL 제공

배포 후 주소를 알려주시면 QR 코드도 만들어드릴게요! 🚀
