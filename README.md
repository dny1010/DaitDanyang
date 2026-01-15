# 🐾 PetShop – 반려동물 쇼핑몰 & 커뮤니티 서비스

PetShop은 **반려동물 쇼핑몰 기능과 사용자 커뮤니티를 결합한 웹 서비스**입니다.  
JWT 기반 인증을 통해 사용자별 기능을 분리하고,  
프론트엔드와 백엔드의 역할을 명확히 나누어 확장성과 유지보수를 고려해 설계했습니다.

---

## 📌 프로젝트 개요
- **프로젝트 유형**: 개인 프로젝트
- **주요 기능**: 쇼핑몰, 장바구니, 주문, 커뮤니티 게시판, 인증
- **인증 방식**: JWT (Access Token)

---

## 🛠 기술 스택

### Frontend
- React
- Axios
- React-Bootstrap

### Backend
- Flask
- SQLAlchemy
- Flask-JWT-Extended

### Database
- SQLite (instance 기반)

### Auth
- JWT (Access Token)

---

## 🧩 전체 아키텍처
[React Frontend]
└─ Axios Client (Interceptor)
└─ JWT 자동 첨부
↓
[Flask REST API]
├─ Auth / Product / Cart / Order / Board
├─ JWT 인증 & 권한 제어
└─ SQLAlchemy ORM
↓
[SQLite Database]

- 프론트엔드는 UI와 상태 관리에 집중
- 백엔드는 인증 및 비즈니스 로직 담당

---

## 🔐 인증 및 권한 처리

- 로그인 성공 시 **JWT Access Token 발급**
- 토큰은 `localStorage`에 저장
- Axios Interceptor에서 모든 요청에 자동으로 `Authorization: Bearer <token>` 헤더 추가
- 서버에서만 토큰 유효성 및 권한 검증 수행

> 프론트엔드는 인증 판단을 하지 않고, 서버 중심의 보안 구조를 유지합니다.

---

## 📦 Axios Client 설계

모든 API 요청은 공통 Axios 인스턴스를 통해 처리됩니다.

### 설계 목적
- JWT 토큰 자동 첨부
- 공통 에러 처리
- baseURL 환경변수 관리

### 기대 효과
- 중복 코드 제거
- 인증 로직 중앙화
- 유지보수 및 확장 용이

---

## 🛒 주요 기능

### 상품
- 카테고리별 상품 조회
- 서버 페이징 및 정렬 처리
- 조회수/리뷰 기준 정렬

### 장바구니
- JWT 기반 사용자 식별
- 수량 변경(PATCH)과 추가(POST) 로직 분리
- 중복 요청 방지 구조

### 주문
- 장바구니 → 주문 생성
- 주문 취소 기능
- 사용자별 주문 내역 관리

### 게시판
- 문의사항 / 건의사항 / 기타 카테고리
- 공지사항 / 이벤트 별도 관리
- 권한 분리
  - 비회원: 목록 조회
  - 회원: 본인 글 상세 조회
  - 관리자: 모든 글 접근 및 답변 가능

---

## 🗂 게시판 권한 설계

- 카테고리별 접근 제어
- 공지사항 / 이벤트는 누구나 상세 열람 가능
- 일반 게시글은 작성자 또는 관리자만 접근 가능

> 프론트 조작만으로는 권한을 우회할 수 없도록 서버에서 제어했습니다.

---

## 🧪 트러블슈팅 경험

### JWT 인증 실패
- **문제**: 토큰이 존재함에도 인증 실패 발생
- **원인**: Authorization 헤더 형식 불일치
- **해결**: Axios Interceptor에서 Bearer 형식 통일

### DB Migration 충돌
- **문제**: Alembic migration head 충돌
- **해결**: DB 초기화 전략 및 기본값 설계 개선

---

## 📈 개선 및 확장 계획
- Refresh Token 도입
- 관리자 전용 페이지 분리
- 검색 기능 고도화
- Docker 기반 배포 환경 구성

---

## ✨ 프로젝트를 통해 배운 점
- JWT 기반 인증 흐름 이해
- 프론트엔드와 백엔드 역할 분리의 중요성
- 공통 로직 분리(Interceptor)를 통한 유지보수 효율성
- 실제 서비스 구조를 고려한 권한 설계 경험

---

