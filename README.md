# 🐾 PetShop – 반려동물 쇼핑몰 & 커뮤니티 서비스

PetShop은 **반려동물 쇼핑몰 기능과 사용자 커뮤니티, 챗봇을 결합한 웹 서비스**입니다.  
JWT 기반 인증을 통해 사용자별 기능을 분리하고,  
프론트엔드와 백엔드의 역할을 명확히 나누어 확장성과 유지보수를 고려해 설계했습니다.

---

## 🕒 개발 시간
2025/12/08 ~ 2025/01/15 (약 6주)


## 👥 팀원 역할
- 🐻 **이 호**
  - 팀장, 전체 구조 설계
  - JWT 인증 및 공통 API 구조 설계
  - 프로젝트 방향성 조율

- 🐱 **박선영**
  - 프론트 구성
  - 백 구성
  - PPT
  - 발표

- 🐤 **이다미**
  - 데이터 수집
  - 프론트 구성
  - PPT

- 🐵 **김태훈**
  - 프론트 구성

- 🐻 **빙승현**
  - 프론트 구성
  - 데이터 수집
  - 벡터 DB 구성


## 📌 프로젝트 개요
- **프로젝트 유형**: 개인 프로젝트
- **주요 기능**: 쇼핑몰, 장바구니, 주문, 커뮤니티 게시판, 인증
- **인증 방식**: JWT (Access Token)

---

## 📂 프로젝트 보고서
[호이즈다냥 결과보.pdf](./호이즈다냥.pdf)


## 🛠 기술 스택

| 영역 | 기술 스택 |
| --- | --- |
| Front-end | <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=fff"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=000"/> <img src="https://img.shields.io/badge/reactbootstrap-7952B3?style=flat-square&logo=reactbootstrap&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=fff"/> |
| Back-end | <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/> <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=Flask&logoColor=white"/> |
| Database | <img src="https://img.shields.io/badge/SQLite-4479A1?style=flat-square&logo=SQLite&logoColor=white"/> |
| Cloud | <img src="https://img.shields.io/badge/huggingface-FFD21E?style=flat-square&logo=huggingface&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> |
| Others | <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"/> <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white"/> |

### 🔐 Auth
- JWT (Access Token)
- Flask-JWT-Extended

## 🧩 전체 아키텍처
[React Frontend] <br>
└─ Axios Client (Interceptor) <br>
└─ JWT 자동 첨부<br>
↓<br>
[Flask REST API]<br>
├─ Auth / Product / Cart / Order / Board<br>
├─ JWT 인증 & 권한 제어<br>
└─ SQLAlchemy ORM<br>
↓<br>
[SQLite Database]<br>

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

### 마이페이지
- 주문 관리
- 리뷰작성 -> 리뷰관리
- 회원정보 관리 및 탈퇴

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

---
## ✨ 배운점
🐻 이 호 :  이번 프로젝트를 통해 단순한 기능 구현을 넘어, 구조와 설계를 고려한 개발의 중요성을 깊이 이해하게 되었습니다.<br>
             JWT 기반 인증과 공통 API 구조를 직접 설계하며, 인증 흐름을 프론트엔드와 백엔드 전반에서 이해하고 구현하는 경험을 쌓았습니다.<br>
             또한 Axios Interceptor를 활용해 공통 로직을 분리함으로써, 코드 구조가 협업과 유지보수에 미치는 영향을 체감했습니다.<br>
             프로젝트 진행 과정에서는 팀장으로서 전체 방향성을 설계하고, 팀원 간 구현 방식의 차이를 조율하는 역할을 맡았습니다.<br>
             이 과정에서 설계 의도의 공유와 합의가 프로젝트 흐름에 큰 영향을 준다는 점을 직접 경험했습니다.<br>
             이번 경험을 통해 새로운 분야에 도전하는 과정에서도, 기술적 성장과 협업을 함께 고민하며 꾸준히 발전할 수 있다는 자신감을 얻게 되었습니다.<br>
🐱 박선영 : 이번 프로젝트를 통해 프론트엔드와 백엔드 간의 역할 분리와 데이터 흐름을 명확히 이해할 수 있었습니다. React와 Flask를 연동하며 API 요청, <br>
            응답 구조와 인증 흐름을 다뤄보면서 화면 구현뿐 아니라 백엔드와의 연결 방식을 고려하게 되었습니다. <br>
            이 과정을 통해 기능만 구현하기보다 전체 구조를 고려하며 개발하는 역량을 키울 수 있었습니다. <br>
            또한 협업 과정에서 공통 규칙과 소통의 중요성을 체감하며 실제 서비스 개발에 필요한 협업 경험을 쌓을 수 있었습니다.<br>
🐥 이다미 : 이번 애견용품 쇼핑몰 프로젝트를 진행하며 단순히 기능을 구현하는 것을 넘어, 하나의 서비스가 어떻게 구성되고 흐르는지 전체적인 구조를 이해할 수 있었습니다.
            React로 상품 목록, 장바구니, 마이페이지 등의 화면을 만들고 Flask 백엔드와 연동하면서, 화면에서 보이는 기능들이 서버와 어떻게 연결되는지도 직접 경험해 볼 수 있었습니다
            주문과 리뷰, 회원 정보와 같은 기능을 구현하는 과정에서는 데이터 구조와 API의 역할을 자연스럽게 이해하게 되었고, 개별 기능이 아니라 전체 흐름 속에서 개발을 바라보는 시각도 생겼습니다.
            아직 익숙하지 않은 부분도 많지만, 프로젝트를 하면서 직접 찾아보고 적용해 나가는 과정 자체가 공부가 되었고, 기능을 더 응용해 볼수록 개발에 대한 흥미도 점점 커졌습니다.
🐵 김태훈 : 챗봇과 홈페이지 제작 프로젝트를 진행하며 웹 서비스가 어떤 구조로 동작하는지 전반적인 흐름을 이해할 수 있었습니다.
            프론트엔드와 백엔드가 어떻게 연동되는지, 데이터가 어떤 방식으로 전달되는지를 간접적으로 경험하며
            웹 개발에서 협업과 역할 분담, 소통의 중요성을 느낄 수 있었습니다.
            비록 모든 구현에 직접 참여하지는 못했지만, 프로젝트를 통해 웹 서비스 개발 과정에 대한 이해를 넓힐 수 있는 계기가 되었습니다.
🦁 빙승현 : 각각의 구성들의 데이터 통신구조에대해서 깊게 알게되었고 또 도메인에 맞는 챗봇 DB의 구축과 로컬 DB와의 연계에대해서 조금더 깊이 알게된 프로젝트였습니다. <br>
            팀원분들의 배려를 통해서 프로젝트간 많이 기본요소에대해서 많이 배웠고 프로젝트에서 각자의 부분의 진행도 좋지만 각 부분의 한계점과 또 서로의 파트에대해서 <br>
            아이디어 제안 및 수정을 통해 자연스럽게 깎아나가는 과정또한 중요한 부분이라는것을 느낀 소중한 시간이였습니다. <br>

