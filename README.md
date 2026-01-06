# Node.js 게시판 프로젝트 - 기술 명세서

## 📋 문서 정보

- **프로젝트명**: Node.js 게시판 프로젝트
- **버전**: 1.0.0
- **작성일**: 2024
- **라이선스**: ISC
- **배포 URL**: http://jangdonggun.iptime.org:3000

---

## 1. 프로젝트 개요

### 1.1 프로젝트 소개

Express.js와 MongoDB를 활용한 풀스택 게시판 웹 애플리케이션입니다. 사용자 인증, 게시물 CRUD, 댓글 시스템, 실시간 채팅 등 커뮤니티 기능을 제공하는 웹 애플리케이션입니다.

### 1.2 주요 기능

- **사용자 인증 및 관리**: 회원가입, 로그인, 로그아웃, 비밀번호 재설정, 아이디 찾기
- **게시판 기능**: 게시물 작성, 조회, 수정, 삭제, 좋아요
- **댓글 시스템**: 댓글 작성, 대댓글 작성, 댓글 조회
- **실시간 채팅**: Socket.io 기반 1:1 채팅, Server-Sent Events를 활용한 실시간 메시지 수신
- **파일 업로드**: 이미지 파일 업로드 (최대 10개 동시 업로드)
- **사용자 프로필**: 마이페이지 조회 및 관리

---

## 2. 시스템 아키텍처

### 2.1 아키텍처 패턴

**MVC (Model-View-Controller) 패턴**을 따릅니다:

- **Model**: MongoDB 데이터베이스와 직접 상호작용하는 데이터 레이어
- **View**: EJS 템플릿 엔진을 사용한 서버 사이드 렌더링
- **Controller**: Express.js 라우트 핸들러를 통한 비즈니스 로직 처리

### 2.2 시스템 구성도

```
┌─────────────────┐
│   Client (Web)  │
└────────┬────────┘
         │ HTTP/WebSocket
         │
┌────────▼─────────────────┐
│   Express.js Server      │
│  ┌────────────────────┐  │
│  │  Route Handlers    │  │
│  │  - Authentication  │  │
│  │  - CRUD Operations │  │
│  │  - File Upload     │  │
│  └────────────────────┘  │
│  ┌────────────────────┐  │
│  │  Socket.io Server  │  │
│  │  - Real-time Chat  │  │
│  └────────────────────┘  │
└────────┬─────────────────┘
         │
┌────────▼────────┐
│   MongoDB 7.0   │
│  - login        │
│  - post         │
│  - comments     │
│  - chatroom     │
│  - message      │
│  - counter      │
└─────────────────┘
```

### 2.3 데이터 흐름

1. **사용자 요청** → Express.js 라우트 핸들러
2. **인증 확인** → Passport.js 세션 검증
3. **비즈니스 로직** → MongoDB 쿼리 실행
4. **응답 생성** → EJS 템플릿 렌더링 또는 JSON 응답
5. **실시간 통신** → Socket.io 또는 SSE를 통한 양방향 통신

---

## 3. 기술 스택

### 3.1 Backend 기술

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 20.x | JavaScript 런타임 환경 |
| Express.js | 4.18.2 | 웹 애플리케이션 프레임워크 |
| MongoDB | 7.0 | NoSQL 데이터베이스 |
| MongoDB Native Driver | 3.6.4 | MongoDB 직접 연결 |
| Mongoose | 7.1.0 | MongoDB ODM (선택적 사용) |
| Passport.js | 0.6.0 | 인증 미들웨어 |
| Passport-local | 1.0.0 | 로컬 인증 전략 |
| express-session | 1.17.3 | 세션 관리 |
| bcrypt | 5.1.0 | 비밀번호 해싱 |
| Socket.io | 4.6.1 | 실시간 양방향 통신 |
| Nodemailer | 7.0.12 | 이메일 전송 |
| Multer | 1.4.5-lts.1 | 파일 업로드 처리 |
| dotenv | 16.0.3 | 환경 변수 관리 |
| connect-flash | 0.1.1 | 플래시 메시지 |
| cookie-parser | 1.4.6 | 쿠키 파싱 |
| body-parser | 1.20.2 | 요청 본문 파싱 |

### 3.2 Frontend 기술

| 기술 | 버전 | 용도 |
|------|------|------|
| EJS | 3.1.9 | 서버 사이드 템플릿 엔진 |
| HTML5/CSS3 | - | 마크업 및 스타일링 |
| JavaScript (ES6+) | - | 클라이언트 사이드 로직 |
| Socket.io Client | 4.6.1 | 실시간 통신 클라이언트 |
| Bootstrap | - | UI 프레임워크 (Simple Sidebar) |

### 3.3 인프라 및 배포

| 기술 | 버전 | 용도 |
|------|------|------|
| Docker | - | 컨테이너화 |
| Docker Compose | 3.8 | 멀티 컨테이너 오케스트레이션 |
| Nginx | - | 리버스 프록시 (선택사항) |

---

## 4. 데이터베이스 스키마

### 4.1 컬렉션 구조

#### 4.1.1 login 컬렉션 (사용자 정보)

```javascript
{
  _id: ObjectId,
  id: String,           // 사용자 아이디 (고유)
  pw: String,           // BCrypt 해시된 비밀번호
  em: String,           // 이메일
  nm: String            // 사용자 이름
}
```

**인덱스**: `id` (고유 인덱스)

#### 4.1.2 post 컬렉션 (게시물)

```javascript
{
  _id: Number,          // 게시물 ID (자동 증가)
  제목: String,         // 게시물 제목
  내용: String,         // 게시물 내용
  작성자: String,       // 작성자 이름
  작성자_id: String,    // 작성자 아이디
  날짜: String,         // 작성 날짜/시간 (KST, ISO 형식)
  likes: [String]       // 좋아요한 사용자 ID 배열
}
```

**인덱스**: `_id` (고유 인덱스)

#### 4.1.3 comments 컬렉션 (댓글)

```javascript
{
  _id: ObjectId,
  postId: Number,       // 게시물 ID
  content: String,       // 댓글 내용
  writer: String,       // 작성자 이름
  writer_id: String,    // 작성자 아이디
  date: String,         // 작성 날짜/시간 (KST, ISO 형식)
  parentId: Number      // 부모 댓글 ID (대댓글인 경우)
}
```

**인덱스**: `postId` (일반 인덱스), `parentId` (일반 인덱스)

#### 4.1.4 chatroom 컬렉션 (채팅방)

```javascript
{
  _id: ObjectId,
  title: String,         // 채팅방 제목
  member: [String],     // 참여자 ID 배열
  date: Date            // 생성 날짜
}
```

**인덱스**: `member` (배열 인덱스)

#### 4.1.5 message 컬렉션 (메시지)

```javascript
{
  _id: ObjectId,
  parent: String,       // 채팅방 ID
  userid: String,       // 발신자 ID
  content: String,      // 메시지 내용
  date: Date            // 전송 시간
}
```

**인덱스**: `parent` (일반 인덱스), `date` (일반 인덱스)

#### 4.1.6 counter 컬렉션 (카운터)

```javascript
{
  _id: ObjectId,
  name: String,          // 카운터 이름 (예: "게시물갯수")
  toTalPost: Number     // 총 게시물 수
}
```

---

## 5. API 명세서

### 5.1 인증 관련 API

#### 5.1.1 회원가입

- **엔드포인트**: `POST /signup`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```javascript
  {
    id: String,      // 사용자 아이디 (필수)
    pw: String,      // 비밀번호 (필수)
    em: String,      // 이메일 (필수)
    nm: String       // 사용자 이름 (필수)
  }
  ```
- **Response**:
  - 성공: `302 Redirect` → `/login`
  - 실패: `200 OK` - "이미 사용 중인 아이디입니다." 또는 "회원가입 실패"
- **비즈니스 로직**:
  1. 아이디 중복 확인
  2. 비밀번호 BCrypt 해싱 (salt rounds: 10)
  3. 사용자 정보 저장
- **에러 처리**:
  - 중복 아이디: `200 OK` - "이미 사용 중인 아이디입니다."
  - 서버 오류: `500 Internal Server Error` - "회원가입 실패"

#### 5.1.2 로그인

- **엔드포인트**: `POST /login`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```javascript
  {
    id: String,      // 사용자 아이디
    pw: String       // 비밀번호
  }
  ```
- **Response**:
  - 성공: `302 Redirect` → `/list`
  - 실패: `302 Redirect` → `/login?error=1`
- **인증 방식**: Passport.js LocalStrategy
- **세션 관리**: express-session을 통한 세션 생성 및 관리
- **비즈니스 로직**:
  1. Passport.js LocalStrategy로 인증
  2. 비밀번호 BCrypt 비교
  3. 세션에 사용자 정보 저장 (`req.session.user`)
  4. Passport.js 세션 직렬화 (`serializeUser`)

#### 5.1.3 로그아웃

- **엔드포인트**: `GET /logout`
- **Response**: `302 Redirect` → `/login`
- **비즈니스 로직**:
  1. Passport.js `req.logout()` 호출
  2. 세션 무효화 (`req.session.destroy()`)

#### 5.1.4 비밀번호 재설정 요청

- **엔드포인트**: `POST /reset-password`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **비즈니스 로직**:
  1. 이메일로 사용자 조회
  2. 6자리 인증 코드 생성 (100000 ~ 999999)
  3. 인증 코드를 메모리 Map에 저장 (`verificationCodes`)
  4. Nodemailer를 통해 이메일 전송
- **이메일 설정**: 환경 변수에서 SMTP 설정 읽기

#### 5.1.5 인증 코드 검증

- **엔드포인트**: `POST /verify-code`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "code": "123456"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **비즈니스 로직**:
  1. 이메일로 저장된 인증 코드 조회
  2. 입력된 코드와 비교
  3. 일치하면 `success: true` 반환

#### 5.1.6 새 비밀번호 설정

- **엔드포인트**: `POST /reset-password-new`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "newPassword": "newpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **비즈니스 로직**:
  1. 새 비밀번호 BCrypt 해싱
  2. MongoDB에서 사용자 비밀번호 업데이트
  3. 인증 코드 삭제 (보안)

#### 5.1.7 아이디 찾기

- **엔드포인트**: `POST /findid`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "em": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "ids": ["userid1", "userid2"]
  }
  ```
- **비즈니스 로직**:
  1. 이메일로 사용자 조회 (`find()` 사용 - 여러 계정 가능)
  2. 조회된 사용자의 아이디 배열 반환

### 5.2 게시판 API

#### 5.2.1 게시물 목록 조회

- **엔드포인트**: `GET /list`
- **인증**: 필요 (`로그인` 미들웨어)
- **Response**: `list.ejs` 템플릿 렌더링
- **데이터**: 모든 게시물 배열 (`posts`), 현재 사용자 정보 (`user`)
- **비즈니스 로직**:
  1. MongoDB에서 모든 게시물 조회 (`find().toArray()`)
  2. 최신순 정렬 (현재 구현 없음 - 개선 필요)

#### 5.2.2 게시물 상세 조회

- **엔드포인트**: `GET /detail/:id`
- **Path Parameter**: `id` (Number) - 게시물 ID
- **Response**: `detail.ejs` 템플릿 렌더링
- **데이터**: 게시물 정보 (`post`), 댓글 배열 (`comments`), 사용자 정보 (`user`)
- **비즈니스 로직**:
  1. 게시물 ID로 조회
  2. 해당 게시물의 댓글 조회 (`_id` 내림차순 정렬)
  3. 템플릿에 데이터 전달

#### 5.2.3 게시물 작성 페이지

- **엔드포인트**: `GET /write`
- **인증**: 필요 (`로그인` 미들웨어)
- **Response**: `write.ejs` 템플릿 렌더링

#### 5.2.4 게시물 작성

- **엔드포인트**: `POST /add`
- **인증**: 필요 (`로그인` 미들웨어)
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```javascript
  {
    title: String,      // 게시물 제목
    content: String     // 게시물 내용
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "redirect": "/list"
  }
  ```
- **비즈니스 로직**:
  1. `counter` 컬렉션에서 총 게시물 수 조회
  2. 새 게시물 ID 생성 (`총게시물갯수 + 1`)
  3. KST 시간 생성 및 포맷팅 (`YYYY-MM-DD HH:mm:ss`)
  4. 게시물 저장
  5. 카운터 증가 (`$inc` 연산자)

#### 5.2.5 게시물 삭제

- **엔드포인트**: `DELETE /delete`
- **인증**: 필요 (`로그인` 미들웨어)
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "_id": 1
  }
  ```
- **Response**: `"삭제완료"`
- **비즈니스 로직**:
  1. 게시물 ID로 삭제 (`deleteOne()`)
- **보안**: 작성자 확인 로직 없음 (개선 필요)

#### 5.2.6 게시물 좋아요

- **엔드포인트**: `POST /post/like`
- **인증**: 필요 (세션 확인)
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "postId": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "liked": true
  }
  ```
- **비즈니스 로직**:
  1. 게시물 조회
  2. 사용자 ID가 `likes` 배열에 있는지 확인
  3. 있으면 제거 (`$pull`), 없으면 추가 (`$addToSet`)
  4. 토글 결과 반환

### 5.3 댓글 API

#### 5.3.1 댓글 작성

- **엔드포인트**: `POST /comment/add`
- **인증**: 필요 (세션 확인)
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "postId": 1,
    "content": "댓글 내용"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **비즈니스 로직**:
  1. 세션에서 사용자 정보 확인
  2. KST 시간 생성 및 포맷팅
  3. 댓글 저장

#### 5.3.2 대댓글 작성

- **엔드포인트**: `POST /comment/reply`
- **인증**: 필요 (세션 확인)
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "postId": 1,
    "parentId": 5,
    "content": "대댓글 내용"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```
- **비즈니스 로직**:
  1. 세션에서 사용자 정보 확인
  2. KST 시간 생성 및 포맷팅
  3. `parentId`를 포함하여 댓글 저장

### 5.4 채팅 API

#### 5.4.1 채팅방 생성

- **엔드포인트**: `POST /chatroom`
- **인증**: 필요 (`로그인` 미들웨어)
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```javascript
  {
    당한사람id: String    // 상대방 사용자 ID
  }
  ```
- **Response**: `"저장완료"`
- **비즈니스 로직**:
  1. 현재 사용자 ID와 상대방 ID를 `member` 배열에 저장
  2. 채팅방 생성

#### 5.4.2 채팅방 목록 조회

- **엔드포인트**: `GET /chat`
- **인증**: 필요 (`로그인` 미들웨어)
- **Response**: `chat.ejs` 템플릿 렌더링
- **비즈니스 로직**:
  1. 현재 사용자 ID가 `member` 배열에 포함된 채팅방 조회

#### 5.4.3 메시지 전송

- **엔드포인트**: `POST /message`
- **인증**: 필요 (`로그인` 미들웨어)
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```javascript
  {
    parent: String,      // 채팅방 ID
    content: String      // 메시지 내용
  }
  ```
- **Response**: MongoDB Insert 결과

#### 5.4.4 메시지 조회 (Server-Sent Events)

- **엔드포인트**: `GET /message/:id`
- **인증**: 필요 (`로그인` 미들웨어)
- **Path Parameter**: `id` (String) - 채팅방 ID
- **Response**: Server-Sent Events 스트림
- **Content-Type**: `text/event-stream`
- **비즈니스 로직**:
  1. 초기 메시지 목록 전송
  2. MongoDB Change Streams를 통한 실시간 업데이트
  3. 새 메시지가 추가되면 SSE로 전송

### 5.5 파일 업로드 API

#### 5.5.1 파일 업로드 페이지

- **엔드포인트**: `GET /upload`
- **인증**: 필요 (`로그인` 미들웨어)
- **Response**: `upload.ejs` 템플릿 렌더링

#### 5.5.2 파일 업로드

- **엔드포인트**: `POST /upload`
- **인증**: 필요 (`로그인` 미들웨어)
- **Content-Type**: `multipart/form-data`
- **Request**: `uploading` 필드에 파일 배열 (최대 10개)
- **Response**: `302 Redirect` → `/`
- **저장 경로**: `./public/image/`
- **파일명**: 원본 파일명 유지
- **제한사항**: 
  - 최대 파일 수: 10개
  - 파일 타입 검증 없음 (개선 필요)
  - 파일 크기 제한 없음 (개선 필요)

### 5.6 Socket.io 이벤트

#### 5.6.1 클라이언트 → 서버 이벤트

| 이벤트명 | 설명 | 데이터 형식 |
|---------|------|------------|
| `joinroom` | 특정 방에 입장 | 없음 |
| `room1-send` | room1에 메시지 전송 (본인 제외) | `{ message: String }` |
| `user-send` | 모든 사용자에게 메시지 전송 (본인 제외) | `{ message: String }` |

#### 5.6.2 서버 → 클라이언트 이벤트

| 이벤트명 | 설명 | 데이터 형식 |
|---------|------|------------|
| `broadcast` | 브로드캐스트 메시지 수신 | 클라이언트가 전송한 데이터 |

---

## 6. 보안 사양

### 6.1 인증 및 인가

#### 6.1.1 비밀번호 보안

- **해싱 알고리즘**: BCrypt
- **Salt Rounds**: 10
- **저장 형식**: 해시된 비밀번호만 저장 (평문 저장 금지)

#### 6.1.2 세션 관리

- **세션 스토어**: 메모리 (기본값)
- **세션 시크릿**: 환경 변수 `SESSION_SECRET` 사용
- **세션 옵션**:
  ```javascript
  {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  }
  ```
- **세션 만료**: 기본값 사용 (브라우저 종료 시)

#### 6.1.3 인증 미들웨어

- **미들웨어 함수**: `로그인(req, res, next)`
- **검증 로직**:
  1. `req.isAuthenticated()` 확인 (Passport.js)
  2. `req.session.user` 확인 (세션)
  3. 미인증 시 `/login`으로 리다이렉트

### 6.2 입력 검증

#### 6.2.1 현재 상태

- **회원가입**: 아이디 중복 확인만 수행
- **파일 업로드**: 파일 타입 및 크기 검증 없음
- **SQL Injection**: MongoDB Native Driver 사용으로 방지됨
- **XSS**: EJS 자동 이스케이프 (기본값)

#### 6.2.2 개선 필요 사항

- 입력 값 길이 제한
- 파일 타입 검증 (이미지 파일만 허용)
- 파일 크기 제한
- 이메일 형식 검증
- 비밀번호 강도 검증

### 6.3 환경 변수 관리

#### 6.3.1 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `DB_URL` | MongoDB 연결 URL | `mongodb://localhost:27017/server` |
| `SESSION_SECRET` | 세션 암호화 키 | `your-super-secret-key` |
| `EMAIL_USER` | 이메일 계정 | `your-email@naver.com` |
| `EMAIL_PASS` | 이메일 앱 비밀번호 | `your-app-password` |

#### 6.3.2 선택적 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `PORT` | 서버 포트 | `3000` |
| `EMAIL_HOST` | SMTP 호스트 | `smtp.naver.com` |
| `EMAIL_PORT` | SMTP 포트 | `465` |

### 6.4 보안 헤더

- **현재 상태**: 보안 헤더 미설정
- **개선 필요**: Helmet.js 미들웨어 추가 권장

---

## 7. 성능 사양

### 7.1 서버 사양

- **포트**: 3000 (기본값, 환경 변수로 변경 가능)
- **호스트**: `0.0.0.0` (모든 네트워크 인터페이스)
- **동시 연결**: 제한 없음 (Node.js 이벤트 루프 기반)

### 7.2 데이터베이스 사양

- **데이터베이스**: MongoDB 7.0
- **연결 풀**: MongoDB Native Driver 기본 설정
- **인덱스**: 
  - `login.id`: 고유 인덱스
  - `post._id`: 고유 인덱스
  - `comments.postId`: 일반 인덱스
  - `message.parent`: 일반 인덱스

### 7.3 파일 업로드 사양

- **최대 파일 수**: 10개
- **저장 경로**: `./public/image/`
- **파일명 정책**: 원본 파일명 유지
- **제한사항**: 파일 크기 및 타입 제한 없음

### 7.4 실시간 통신 사양

- **프로토콜**: WebSocket (Socket.io), Server-Sent Events
- **폴백**: Socket.io가 자동으로 폴백 지원
- **이벤트 기반**: 비동기 이벤트 처리

---

## 8. 배포 사양

### 8.1 Docker 배포

#### 8.1.1 Dockerfile

```dockerfile
FROM node:20

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    iputils-ping \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 애플리케이션 코드 복사
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### 8.1.2 Docker Compose

- **서비스**: 
  - `mongodb`: MongoDB 7.0 컨테이너
  - `app`: Node.js 애플리케이션 컨테이너
- **네트워크**: `node_board_network` (bridge)
- **볼륨**: 
  - `mongodb_data`: MongoDB 데이터 영구 저장
  - `./public/image`: 업로드 파일 영구 저장
- **의존성**: `app` 서비스가 `mongodb` 헬스 체크 완료 후 시작

### 8.2 환경 변수 설정

`.env` 파일 예시:

```env
# 데이터베이스
DB_URL=mongodb://admin:password@mongodb:27017/server?authSource=admin
MONGO_USERNAME=admin
MONGO_PASSWORD=your-secure-password

# 애플리케이션
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key-change-this

# 이메일
EMAIL_HOST=smtp.naver.com
EMAIL_PORT=465
EMAIL_USER=your-email@naver.com
EMAIL_PASS=your-app-password
```

### 8.3 배포 절차

1. **환경 변수 설정**: `.env` 파일 생성
2. **Docker 이미지 빌드**: `docker compose build`
3. **컨테이너 실행**: `docker compose up -d`
4. **헬스 체크**: `curl http://localhost:3000`

---

## 9. 프로젝트 구조

```
Node.js_board/
├── index.js                 # 메인 서버 파일 (531줄)
├── package.json             # 프로젝트 설정 및 의존성
├── package-lock.json        # 의존성 잠금 파일
├── Dockerfile               # Docker 이미지 빌드 설정
├── docker-compose.yml       # Docker Compose 설정
├── .env                     # 환경 변수 (Git 제외)
├── .gitignore               # Git 제외 파일 목록
├── .dockerignore            # Docker 빌드 제외 파일 목록
│
├── views/                   # EJS 템플릿 파일
│   ├── login.ejs            # 로그인 페이지
│   ├── signup.ejs           # 회원가입 페이지
│   ├── list.ejs             # 게시물 목록 페이지
│   ├── detail.ejs           # 게시물 상세 페이지
│   ├── write.ejs            # 게시물 작성 페이지
│   ├── edit.ejs             # 게시물 수정 페이지
│   ├── mypage.ejs           # 마이페이지
│   ├── chat.ejs             # 채팅 페이지
│   ├── socket.ejs           # Socket.io 테스트 페이지
│   ├── upload.ejs           # 파일 업로드 페이지
│   ├── findid.ejs           # 아이디 찾기 페이지
│   ├── reset-password.ejs   # 비밀번호 재설정 페이지
│   ├── search.ejs           # 검색 페이지
│   └── nav.html             # 네비게이션 컴포넌트
│
├── public/                  # 정적 파일 디렉토리
│   ├── image/               # 업로드된 이미지 파일
│   ├── css/                 # CSS 파일
│   ├── js/                  # JavaScript 파일
│   └── assets/              # 기타 정적 파일
│
└── node_modules/            # npm 패키지 (Git 제외)
```

---

## 10. 주요 기능 상세

### 10.1 사용자 인증 플로우

```
1. 사용자 회원가입
   └─> 아이디 중복 확인
   └─> 비밀번호 BCrypt 해싱
   └─> MongoDB에 저장
   └─> 로그인 페이지로 리다이렉트

2. 사용자 로그인
   └─> Passport.js LocalStrategy 인증
   └─> 비밀번호 BCrypt 비교
   └─> 세션 생성 (express-session)
   └─> Passport.js 세션 직렬화
   └─> 게시물 목록 페이지로 리다이렉트

3. 세션 유지
   └─> 모든 보호된 라우트에서 `로그인` 미들웨어 검증
   └─> 세션 만료 시 로그인 페이지로 리다이렉트
```

### 10.2 게시물 작성 플로우

```
1. 게시물 작성 페이지 접근
   └─> 로그인 확인
   └─> write.ejs 렌더링

2. 게시물 작성
   └─> 카운터 컬렉션에서 총 게시물 수 조회
   └─> 새 게시물 ID 생성 (총게시물갯수 + 1)
   └─> KST 시간 생성 및 포맷팅
   └─> 게시물 저장
   └─> 카운터 증가
   └─> 게시물 목록 페이지로 리다이렉트
```

### 10.3 실시간 채팅 플로우

```
1. 채팅방 생성
   └─> 사용자 ID와 상대방 ID를 member 배열에 저장
   └─> 채팅방 생성

2. 메시지 전송
   └─> MongoDB에 메시지 저장
   └─> Socket.io 또는 SSE를 통해 실시간 전송

3. 실시간 업데이트
   └─> MongoDB Change Streams 모니터링
   └─> 새 메시지 감지 시 SSE로 클라이언트에 전송
```

---

## 11. 개선 사항

### 11.1 보안 개선

- [ ] Helmet.js 미들웨어 추가
- [ ] 파일 업로드 타입 및 크기 검증
- [ ] 입력 값 검증 및 sanitization
- [ ] CSRF 보호 추가
- [ ] Rate limiting 추가
- [ ] 게시물 삭제 시 작성자 확인

### 11.2 기능 개선

- [ ] 게시물 수정 기능 구현
- [ ] 게시물 검색 기능 구현
- [ ] 페이지네이션 추가
- [ ] 게시물 정렬 기능 (최신순, 인기순)
- [ ] 이미지 미리보기 기능
- [ ] 파일 다운로드 기능

### 11.3 성능 개선

- [ ] MongoDB 인덱스 최적화
- [ ] 쿼리 최적화
- [ ] 캐싱 전략 도입 (Redis)
- [ ] 정적 파일 CDN 사용
- [ ] 이미지 리사이징 및 최적화

### 11.4 코드 품질 개선

- [ ] 에러 핸들링 통일
- [ ] 로깅 시스템 도입 (Winston 등)
- [ ] 코드 모듈화 (라우터 분리)
- [ ] 테스트 코드 작성
- [ ] API 문서화 (Swagger 등)

---

## 12. 참고 자료

### 12.1 공식 문서

- [Express.js 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [Passport.js 공식 문서](http://www.passportjs.org/)
- [Socket.io 공식 문서](https://socket.io/docs/)
- [EJS 공식 문서](https://ejs.co/)

### 12.2 배포 정보

- **서버 주소**: http://jangdonggun.iptime.org:3000
- **데이터베이스**: MongoDB 7.0
- **런타임**: Node.js 20.x

---

## 13. 라이선스

ISC License

---

## 14. 작성자

개인 포트폴리오 프로젝트
