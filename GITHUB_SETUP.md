# 🔐 GitHub 푸시 문제 해결 가이드

## 문제
GitHub에서 비밀번호 인증이 더 이상 지원되지 않습니다. **Personal Access Token (PAT)**을 사용해야 합니다.

## 해결 방법

### 방법 1: Personal Access Token 사용 (추천!)

#### 1단계: GitHub에서 Personal Access Token 생성

1. **GitHub에 로그인**: https://github.com
2. 우측 상단 프로필 클릭 → **Settings**
3. 왼쪽 메뉴에서 **Developer settings** 클릭
4. **Personal access tokens** → **Tokens (classic)** 클릭
5. **Generate new token** → **Generate new token (classic)** 클릭
6. 설정:
   - **Note**: `seowon-award-app` (아무 이름이나)
   - **Expiration**: `90 days` (또는 원하는 기간)
   - **Scopes**: ✅ `repo` 체크 (모든 권한)
7. **Generate token** 클릭
8. **토큰 복사** (이 토큰은 다시 볼 수 없으니 꼭 복사하세요!)

#### 2단계: GitHub 저장소 만들기 (아직 안 했다면)

1. https://github.com/new 접속
2. **Repository name**: `seowon-award`
3. **Public** 또는 **Private** 선택
4. **Create repository** 클릭

#### 3단계: 원격 저장소 설정

터미널에서 실행:

```bash
cd "/Users/leews/seowon app"

# 기존 origin 제거 (있다면)
git remote remove origin

# 올바른 저장소 URL로 설정
git remote add origin https://github.com/solgae0527/seowon-award.git

# 확인
git remote -v
```

#### 4단계: 코드 푸시 (토큰 사용)

```bash
# 파일 추가
git add .

# 커밋
git commit -m "서원 시상식 앱 초기 버전"

# 푸시 (비밀번호 대신 토큰 입력)
git push -u origin main
```

**중요**: 
- Username: `solgae0527`
- Password: 위에서 복사한 **Personal Access Token** 붙여넣기

---

### 방법 2: SSH 키 사용 (더 편함, 한 번만 설정)

#### 1단계: SSH 키 생성 (아직 없으면)

```bash
# SSH 키 확인
ls -al ~/.ssh

# 키가 없다면 생성
ssh-keygen -t ed25519 -C "your_email@example.com"
# 엔터 3번 (비밀번호 없이)

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub
```

#### 2단계: GitHub에 SSH 키 추가

1. 위에서 복사한 공개 키 전체 복사
2. GitHub → Settings → **SSH and GPG keys**
3. **New SSH key** 클릭
4. **Title**: `MacBook` (아무 이름)
5. **Key**: 복사한 공개 키 붙여넣기
6. **Add SSH key** 클릭

#### 3단계: SSH URL로 변경

```bash
cd "/Users/leews/seowon app"

# 기존 origin 제거
git remote remove origin

# SSH URL로 설정
git remote add origin git@github.com:solgae0527/seowon-award.git

# 푸시
git push -u origin main
```

---

### 방법 3: GitHub Desktop 사용 (가장 쉬움!)

1. **GitHub Desktop 다운로드**: https://desktop.github.com
2. 설치 후 GitHub 계정으로 로그인
3. File → **Add Local Repository**
4. `/Users/leews/seowon app` 선택
5. **Publish repository** 클릭

---

## 빠른 해결 (지금 바로!)

### 1. Personal Access Token 생성
https://github.com/settings/tokens/new 접속

### 2. 토큰 복사 후 아래 명령 실행:

```bash
cd "/Users/leews/seowon app"

# 원격 저장소 확인/설정
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/solgae0527/seowon-award.git

# 푸시 시도
git push -u origin main
```

**Username**: `solgae0527`  
**Password**: (복사한 토큰 붙여넣기)

---

## 문제 해결

### "remote origin already exists" 오류
```bash
git remote remove origin
git remote add origin https://github.com/solgae0527/seowon-award.git
```

### "Authentication failed" 오류
- Personal Access Token을 사용했는지 확인
- 토큰에 `repo` 권한이 있는지 확인

### 저장소가 없다는 오류
- 먼저 GitHub에서 저장소를 만들어야 합니다
- https://github.com/new 에서 `seowon-award` 저장소 생성

---

## 다음 단계 (푸시 성공 후)

1. ✅ Vercel에서 GitHub 저장소 연결
2. ✅ 자동 배포
3. ✅ 900명에게 주소 공유!

질문이 있으면 알려주세요! 🚀
