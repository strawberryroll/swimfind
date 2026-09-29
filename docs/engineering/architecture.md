# SwimFind Architecture

SwimFind의 전체 기술 구조와 서버 경계, 폴더 책임, 데이터 흐름을 정의한다.

이 문서는 구현 위치나 데이터 요청 방식을 결정할 때 기준으로 사용한다.

DB의 세부 테이블 및 상태 규칙은 `database.md`,
스타일링 세부 규칙은 `styling.md`를 참고한다.

---

## 1. Architecture Goals

SwimFind의 MVP는 사용자가 로그인하지 않아도
지역, 수영장 이름 또는 현재 위치를 기준으로 수영장을 찾고,
오늘 자유수영이 가능한지 확인하여 방문 여부를 판단할 수 있어야 한다.

기술 구조는 다음 원칙을 우선한다.

- 공개 탐색 화면은 서버 렌더링을 우선한다.
- 브라우저 상호작용이 필요한 부분만 Client Component로 분리한다.
- DB 접근은 Repository에 제한한다.
- 도메인 규칙은 Service에 집중시킨다.
- UI에서 동일한 도메인 규칙을 다시 구현하지 않는다.
- 모든 요청을 억지로 API Route를 거치게 하지 않는다.
- 향후 모바일 API가 추가되어도 Service와 Repository를 재사용할 수 있게 한다.
- MVP 단계에서는 불필요한 추상화와 인프라를 만들지 않는다.

---

## 2. Tech Stack

### Core

```text
Framework
Next.js App Router + TypeScript

Package Manager
pnpm

Lint / Format
Biome

Database
PostgreSQL + Neon

ORM
Drizzle ORM
```

### Application

```text
Authentication
Better Auth

Client Server State
TanStack Query

Forms / Validation
React Hook Form + Zod

File Storage
AWS S3 + presigned URL

Map
NAVER Maps JavaScript API
Browser Geolocation API
```

### Styling

```text
CSS Modules
CSS Variables
CVA
clsx
```

자세한 스타일링 기준은 다음 문서를 따른다.

```text
docs/engineering/styling.md
```

### Testing

```text
Unit
Vitest

Component
React Testing Library

E2E
Playwright
```

### Deployment / Operation

```text
Vercel
GitHub Actions
Sentry
PostHog
```

---

## 3. High-Level Data Flow

SwimFind는 요청의 성격에 따라 서버 접근 방식을 구분한다.

### Public Initial Read

홈, 검색 결과, 수영장 상세의 최초 데이터 조회는
Server Component를 기본으로 한다.

```text
Browser
→ Next.js Server Component
→ Service
→ Repository
→ Drizzle
→ Neon PostgreSQL
```

불필요한 HTTP 요청 없이 서버에서 직접 데이터를 읽는다.

---

### Dynamic Client Read

무한 스크롤처럼 화면 진입 이후 추가 데이터가 필요한 경우
Route Handler를 사용한다.

```text
Client Component
→ Route Handler
→ Service
→ Repository
→ Drizzle
→ Neon PostgreSQL
```

예:

```text
GET /api/pools
후기 다음 페이지
```

TanStack Query는 이런 브라우저 기반 동적 조회에서 사용한다.

---

### Mutation / Form Submission

후기 작성, 정보 제보, 프로필 수정 등
사용자 입력 기반 변경 작업은 Server Action을 우선 사용한다.

```text
Client Form
→ Server Action
→ Zod validation
→ Session / Permission Check
→ Service
→ Repository
→ PostgreSQL
```

DB 변경 성공 후 필요한 cache revalidation을 수행한다.

---

### External / Future Mobile API

향후 모바일 클라이언트 또는 외부 API가 필요하면
Route Handler를 추가한다.

```text
Mobile / External Client
→ Route Handler
→ Service
→ Repository
→ Database
```

웹용 Service와 Repository를 그대로 재사용한다.

---

## 4. Layer Responsibilities

### `app`

책임:

- URL
- page
- layout
- loading
- error
- Route Handler
- searchParams 전달
- 화면 조립

두지 않는 것:

- 복잡한 DB query
- 자유수영 상태 계산
- 도메인 비즈니스 규칙

---

### `features`

사용자 기능과 도메인 UI를 관리한다.

예:

```text
pool
pool-search
pool-detail
favorite
review
report
auth
```

포함 예:

```text
PoolCard
PoolStatusBadge
SearchForm
FavoriteButton
ReviewForm
```

특정 기능에서만 사용하는 UI와 로직은
가능하면 해당 feature 내부에 둔다.

---

### `components/ui`

특정 도메인을 모르는 공용 UI 컴포넌트를 둔다.

예:

```text
Button
Input
Modal
Badge
Chip
```

다음과 같은 도메인 의미를 직접 가지지 않는다.

```text
Pool
Review
Favorite
```

---

### `schemas`

클라이언트와 서버에서 공유하는
외부 입력 검증용 Zod schema를 둔다.

예:

```text
review
report
profile
pool-search
```

Drizzle table schema를 이 위치에 두지 않는다.

---

### `server`

서버에서만 사용하는 코드를 관리한다.

주요 책임:

```text
Authentication
Service
Repository
Database
Cache invalidation
Server-only domain logic
```

브라우저 전용 상태와 UI 표현 코드는 두지 않는다.

---

### `shared`

여러 도메인에서 공통으로 사용하는
범용 코드만 둔다.

예:

```text
routes
pagination
formatDate
formatCurrency
shared types
constants
```

특정 feature에서만 사용하는 파일은
`shared`로 이동하지 않는다.

---

## 5. Recommended Folder Structure

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ pools/
│  │  ├─ page.tsx
│  │  └─ [poolId]/
│  │     └─ page.tsx
│  ├─ favorites/
│  │  └─ page.tsx
│  ├─ reviews/
│  │  ├─ page.tsx
│  │  └─ write/
│  │     └─ page.tsx
│  ├─ reports/
│  │  └─ page.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ my/
│  │  └─ page.tsx
│  └─ api/
│
├─ components/
│  └─ ui/
│
├─ features/
│  ├─ pool/
│  ├─ pool-search/
│  ├─ pool-detail/
│  ├─ favorite/
│  ├─ review/
│  ├─ report/
│  └─ auth/
│
├─ schemas/
│
├─ server/
│  ├─ auth/
│  ├─ db/
│  │  ├─ index.ts
│  │  └─ schema/
│  ├─ pool/
│  ├─ favorite/
│  ├─ review/
│  └─ report/
│
├─ shared/
│  ├─ constants/
│  ├─ utils/
│  └─ types/
│
└─ styles/
```

실제 프로젝트가 이 구조와 조금 다르면
문서만 보고 강제로 구조를 맞추지 않는다.

기존 코드와 구현 상황을 먼저 확인한 뒤 변경한다.

---

## 6. Server Component vs Client Component

### Server Component를 기본으로 사용하는 경우

다음 화면의 최초 데이터 조회:

```text
홈
검색 결과
수영장 상세
```

이유:

- 공개 데이터 중심
- 초기 렌더링 단순화
- 불필요한 클라이언트 JavaScript 감소
- 새로고침이나 URL 공유 시 동일한 조건 복원 가능

---

### Client Component가 필요한 경우

브라우저 API 또는 즉각적인 상호작용이 필요한 부분만 분리한다.

예:

```text
필터 컨트롤
NAVER 지도 렌더링
현재 위치 권한 요청
이미지 미리보기
후기 폼
관심 저장 버튼
```

페이지 전체를 필요 없이 Client Component로 만들지 않는다.

---

## 7. URL as Search State

검색 조건의 기준은 URL `searchParams`이다.

예:

```text
/pools?region=incheon&availableToday=true
```

검색어, 지역, 주요 필터는 가능하면 URL에 표현한다.

장점:

- 새로고침 후 조건 유지
- URL 공유 가능
- 뒤로가기 동작 유지
- 서버 렌더링과 클라이언트 캐시 기준 통일

TanStack Query cache는 URL 상태를 대체하지 않고
사용자 경험을 보완한다.

---

## 8. Server Action vs Route Handler

### Server Action

폼 제출 또는 웹 내부의 단순 변경에 사용한다.

예:

```text
후기 작성
후기 수정
정보 제보
프로필 수정
```

주요 역할:

```text
Zod validation
Session 확인
Service 호출
Cache revalidation
```

---

### Route Handler

클라이언트에서 HTTP 기반 동적 조회가 필요한 경우 사용한다.

예:

```text
무한 스크롤
후기 다음 페이지
```

또는 다음 경우 사용한다.

```text
향후 모바일 API
외부 클라이언트 API
```

모든 서버 요청을 Route Handler로 강제하지 않는다.

---

## 9. Service and Repository

### Repository

DB 접근을 담당한다.

예:

```text
select
insert
update
delete
transaction
```

가능하면 도메인 상태를 Repository에서 계산하지 않는다.

---

### Service

도메인 규칙을 담당한다.

예:

```text
오늘 자유수영 상태 계산
권한 확인
일정과 휴관 우선순위 적용
Repository 결과 조합
화면/API용 DTO 구성
```

같은 Service를 다음 경로에서 재사용할 수 있어야 한다.

```text
Server Component
Server Action
Route Handler
```

---

## 10. Authentication and Authorization

공개 기능:

```text
수영장 탐색
검색 결과 조회
수영장 상세
후기 조회
```

로그인이 필요한 기능:

```text
관심 수영장 저장
후기 작성 / 수정 / 삭제
정보 제보
마이페이지
```

로그인 후에는 사용자가 원래 보던 화면으로 복귀할 수 있도록
`returnTo` 흐름을 유지한다.

권한 검사를 UI 숨김만으로 처리하지 않는다.

Server Action과 Route Handler에서 session을 확인하고,
Service에서 필요한 경우 resource ownership을 검증한다.

요청 body에서 전달된 `userId`를 신뢰하지 않는다.

사용자 ID는 인증된 session을 기준으로 한다.

---

## 11. Caching and Data Fetching

캐시는 계층별 역할을 구분한다.

### Next.js Server Cache

대상:

```text
수영장 기본 정보
시설 정보
FAQ
검증된 일정
```

빈번하게 바뀌지 않는 공개 데이터에 사용한다.

변경 시 관련 tag 또는 path를 revalidate한다.

---

### Router Cache

브라우저 navigation 과정에서
이전 페이지 UI를 재사용하는 역할을 한다.

Next.js navigation과 서버 재검증 정책을 따른다.

---

### TanStack Query

다음과 같은 클라이언트 상호작용에 선택적으로 사용한다.

```text
무한 스크롤
필터 조합별 목록 캐시
관심 상태 optimistic update
```

모든 데이터 조회를 TanStack Query로 옮기지 않는다.

검색 결과 최초 데이터는 Server Component에서 제공하고,
추가 페이지가 필요한 시점에 목록 영역만
`useInfiniteQuery`로 확장할 수 있다.

예시 query key:

```ts
["pools", normalizedSearchCondition];
```

---

### PostgreSQL

다음 데이터의 원본이다.

```text
수영장
일정
후기
관심
정보 제보
```

데이터 정합성은 PostgreSQL의
constraint와 transaction을 기준으로 관리한다.

---

## 12. File Upload Architecture

후기 이미지 등 파일 업로드는
AWS S3 presigned URL 방식을 사용한다.

기본 흐름:

```text
Browser
→ presigned URL 발급 요청
→ S3 직접 업로드
→ object key를 서버에 전달
→ DB 저장
```

파일을 Next.js 서버를 통해 그대로 중계하지 않는다.

DB에는 전체 S3 URL보다 object key를 저장한다.

예:

```text
reviews/{userId}/{uuid}.webp
```

AWS credential은 브라우저에 노출하지 않는다.

이미지 업로드 상세 정책은 기능 구현 시 별도로 검토한다.

---

## 13. Map and Location

NAVER Maps JavaScript API의 역할은
우리 DB 검색 결과를 지도에 표시하는 것이다.

```text
SwimFind PostgreSQL
→ 검색 결과
→ NAVER Maps marker
```

NAVER Maps를 수영장 원본 데이터베이스처럼 사용하지 않는다.

현재 위치는 Browser Geolocation API로 얻는다.

사용자가 위치 권한을 거부하거나 오류가 발생하면
항상 지역 직접 선택 방법을 제공한다.

주변 검색은 `pools.latitude`, `pools.longitude`를 기준으로 한다.

초기 MVP는 기본 거리 계산으로 시작하고,
검색 규모가 증가하면 PostGIS 도입을 검토한다.

---

## 14. Testing Strategy

테스트 우선순위는
UI snapshot을 많이 만드는 것이 아니라
사용자에게 잘못된 자유수영 상태를 보여주지 않는 것이다.

### Unit Test

도구:

```text
Vitest
```

우선 대상:

```text
자유수영 상태 계산
임시 휴관 우선순위
날짜 / 시간 경계
입장 마감
정보 미확인
Zod schema
검색 조건 변환
```

---

### Component Test

도구:

```text
React Testing Library
```

대상:

```text
필터 입력
상태 Badge
관심 버튼
후기 폼
정보 제보 폼
오류 / 재시도 상태
```

---

### E2E

도구:

```text
Playwright
```

핵심 흐름:

```text
홈
→ 검색
→ 상세
```

추가 흐름:

```text
로그인
→ 관심 저장

로그인
→ 후기 작성
```

E2E는 초기에는 로컬을 우선하고,
안정화 후 CI에 추가한다.

---

## 15. Environment Separation

개발과 운영 환경을 분리한다.

### Vercel

```text
Development / Preview
→ Local + PR Preview

Production
→ main branch
```

---

### Neon

```text
Development
→ swimfind-dev

Production
→ swimfind-prod
```

로컬과 Preview 환경은 운영 DB에 연결하지 않는다.

---

### S3

```text
Development
→ swimfind-images-dev

Production
→ swimfind-images-prod
```

개발 이미지와 운영 이미지를 분리한다.

---

### Environment Variables

로컬에서는:

```text
.env.local
```

Vercel에서는 환경별 Environment Variables를 사용한다.

비밀값은 Git repository에 커밋하지 않는다.

---

## 16. Migration Principle

DB 구조 변경은 다음 흐름을 따른다.

```text
Drizzle schema 수정
→ migration 생성
→ 생성된 SQL 확인
→ 개발 DB 적용
→ 테스트
→ 운영 DB 적용
```

migration은 DB 구조 변경의 이력이다.

이미 적용된 migration을 임의로 수정하거나 삭제하지 않는다.

새 컬럼 또는 제약을 추가할 때
기존 코드와 새 코드가 잠시 공존할 수 있는지 고려한다.

예:

```text
nullable column 추가
→ 코드 배포
→ 데이터 채움
→ 필요 시 NOT NULL 추가
```

DB 상세 규칙은 다음 문서를 따른다.

```text
docs/engineering/database.md
```

---

## 17. Git and CI Direction

기본 workflow:

```text
Issue
→ short-lived branch
→ PR
→ GitHub Actions CI
→ Vercel Preview
→ Squash Merge
→ main
→ Production
```

브랜치 예:

```text
feature/*
fix/*
refactor/*
```

CI에서 점진적으로 다음 항목을 검사한다.

```text
pnpm install --frozen-lockfile
→ biome check
→ typecheck
→ Vitest
→ next build
```

E2E는 핵심 흐름 안정화 후 별도 job으로 추가한다.

---

## 18. Architecture Decision Principles

새로운 구현을 추가할 때 다음 순서로 판단한다.

1. Server Component로 충분한가?
2. 브라우저 상호작용 때문에 Client Component가 필요한가?
3. 웹 내부 변경이면 Server Action으로 충분한가?
4. 클라이언트 동적 조회 또는 외부 API가 필요한 경우에만 Route Handler를 사용하는가?
5. 도메인 규칙이 UI나 Repository에 들어가고 있지 않은가?
6. 기존 Service / Repository를 재사용할 수 있는가?
7. 현재 MVP에 실제 필요한 복잡도인가?

기술 요소를 많이 사용하는 것보다
핵심 사용자 흐름을 단순하고 일관되게 구현하는 것을 우선한다.
