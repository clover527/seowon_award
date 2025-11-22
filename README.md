# 서원 월말 시상식 앱 🏆

전교생을 대상으로 매월 잘한 학생들을 추천하고 시상식을 진행하기 위한 웹 애플리케이션입니다.

## 주요 기능

- 🔐 **로그인 시스템**: 사용자 인증 및 회원가입
- ✨ **학생 추천**: 잘한 학생의 이름과 이유를 작성하여 추천
- 👍 **투표 기능**: 추천된 학생들에게 좋아요를 눌러 표시
- 🔄 **실시간 업데이트**: Socket.io를 통한 실시간 투표 수 업데이트
- 📊 **결과 확인**: 월별 추천 결과와 랭킹 확인
- ⚙️ **관리 기능**: 시상식 데이터 관리 및 내보내기

## 기술 스택

### 프론트엔드
- **React 18**: 사용자 인터페이스 구축
- **React Router**: 페이지 라우팅
- **Vite**: 빠른 개발 환경
- **Socket.io Client**: 실시간 업데이트
- **Axios**: HTTP 클라이언트

### 백엔드
- **Node.js + Express**: 서버 프레임워크
- **SQLite**: 데이터베이스
- **Socket.io**: 실시간 통신
- **JWT**: 인증 토큰
- **bcryptjs**: 비밀번호 암호화

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행 (프론트엔드 + 백엔드 동시 실행)

```bash
npm run dev:all
```

또는 개별 실행:

**백엔드 서버:**
```bash
npm run dev:server
```

**프론트엔드 개발 서버:**
```bash
npm run dev
```

### 3. 접속 주소

- **프론트엔드**: http://localhost:3000 (또는 터미널에 표시된 주소)
- **백엔드 API**: http://localhost:3001

### 4. 네트워크 접속

같은 Wi-Fi 네트워크에 연결된 다른 기기에서도 접속 가능합니다:
- 프론트엔드: `http://[당신의-IP]:3000`
- 예: `http://192.168.219.106:3000`

## 기본 계정

시스템에 기본 관리자 계정이 생성됩니다:
- **사용자 이름**: `admin`
- **비밀번호**: `admin123`

## 사용 방법

### 1. 로그인/회원가입
- 처음 접속하면 로그인 페이지로 이동합니다
- 새 계정을 만들거나 기본 계정으로 로그인하세요

### 2. 학생 추천하기
1. "추천하기" 메뉴로 이동
2. 학생 이름과 추천 이유를 입력
3. "추천하기" 버튼 클릭
4. 실시간으로 추천 목록에 추가됩니다

### 3. 투표하기
- 추천된 학생에게 좋아요 버튼을 눌러주세요
- 투표 수가 실시간으로 업데이트됩니다 (모든 사용자에게 동시에 반영)

### 4. 결과 확인
- "결과보기" 메뉴에서 월별 랭킹 확인
- 득표수 순으로 정렬되어 표시됩니다

### 5. 관리자 기능
- "관리" 메뉴에서 데이터 관리
- CSV 또는 JSON 형식으로 데이터 내보내기
- 특정 추천 삭제 또는 전체 데이터 초기화

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 추천
- `GET /api/nominations/months` - 모든 월 목록
- `GET /api/nominations/month/:month` - 특정 월의 추천 목록
- `POST /api/nominations` - 추천 추가 (인증 필요)
- `POST /api/nominations/:id/vote` - 투표하기 (인증 필요)
- `DELETE /api/nominations/:id` - 추천 삭제 (인증 필요, 작성자/관리자만)

## 실시간 업데이트 (Socket.io)

Socket.io를 통해 다음과 같은 이벤트가 실시간으로 전송됩니다:
- `nomination-added`: 새 추천 추가됨
- `vote-updated`: 투표 수 업데이트됨
- `nomination-deleted`: 추천 삭제됨
- `nominations-updated`: 전체 목록 업데이트 필요

## 데이터 저장

모든 데이터는 SQLite 데이터베이스(`server/database.sqlite`)에 저장됩니다.

## 환경 변수

`.env` 파일을 생성하여 다음을 설정할 수 있습니다:
```
JWT_SECRET=your-secret-key-here
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.