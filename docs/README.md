# SwimFind Documentation

이 디렉터리는 SwimFind의 제품 요구사항과 기술 구현 기준을 관리한다.

Codex를 포함한 개발 에이전트는 작업 종류에 따라 관련 문서를 먼저 확인하고,
실제 코드와 함께 검토한 뒤 변경한다.

---

## Documentation Structure

```text
docs/
├─ README.md
├─ product/
│  ├─ mvp.md
│  ├─ user-flow.md
│  └─ ia.md
└─ engineering/
   ├─ architecture.md
   ├─ database.md
   ├─ github-ci.md
   └─ styling.md
```

---

## Product Documents

### `product/mvp.md`

SwimFind MVP에서 해결하려는 핵심 문제와 기능 범위를 정의한다.

주요 내용:

- MVP의 핵심 문제
- 핵심 사용자
- 핵심 가치
- 우선 구현 기능
- MVP에서 제외하는 기능

제품 범위나 기능 우선순위를 판단할 때 가장 먼저 참고한다.

---

### `product/user-flow.md`

사용자가 SwimFind를 이용하는 핵심 흐름과 예외 상황을 정의한다.

주요 내용:

- 오늘 자유수영 가능한 수영장 탐색
- 관심 수영장 재확인
- 후기 확인과 작성
- 정보 제보
- 검색 결과 없음
- 휴관, 일정 종료, 정보 미확인 등의 예외 처리

화면 간 이동과 사용자 행동 흐름을 구현할 때 참고한다.

---

### `product/ia.md`

각 화면의 목적과 표시해야 할 정보를 정의한다.

주요 화면:

- 홈
- 수영장 검색 결과
- 수영장 상세
- 관심 수영장
- 후기
- 로그인
- 정보 제보
- 마이페이지

페이지 또는 컴포넌트를 구현할 때 해당 화면의 요구사항을 확인한다.

---

## Engineering Documents

### `engineering/architecture.md`

SwimFind의 전체 기술 구조와 구현 원칙을 정의한다.

주요 내용:

- 기술 스택
- Next.js App Router 구조
- Server Component / Client Component 기준
- Service / Repository 역할
- Server Action / Route Handler 경계
- 폴더 구조
- 캐싱
- 인증
- 이미지 업로드
- 지도
- 테스트
- 배포 및 운영

새로운 기능의 코드 위치나 서버 경계를 결정할 때 참고한다.

---

### `engineering/database.md`

SwimFind의 데이터 모델과 데이터 처리 규칙을 정의한다.

주요 내용:

- 수영장 기본 정보
- 일반 운영시간
- 자유수영 일정과 회차
- 자유수영 가격
- 휴관 및 운영 예외
- 후기
- 관심 수영장
- 정보 제보
- 자유수영 상태 계산에 필요한 데이터

Drizzle schema, migration, Repository, Service를 수정할 때 먼저 확인한다.

---

### `engineering/styling.md`

SwimFind의 스타일링 규칙을 정의한다.

현재 스타일링 기준:

- CSS Modules
- CSS Variables
- class-variance-authority
- clsx

주요 내용:

- 디자인 토큰
- CSS Modules 파일 배치
- CVA 사용 기준
- clsx 사용 기준
- 공용 UI와 도메인 UI의 스타일 책임

UI 컴포넌트와 스타일 구조를 변경할 때 참고한다.

---

### `engineering/github-ci.md`

GitHub 작업 흐름, PR, 커밋, CI, 배포 정책을 정의한다.

주요 내용:

- GitHub Flow 브랜치 전략
- Issue와 PR 작성 기준
- Conventional Commit 규칙
- Squash merge와 `main` 보호 정책
- GitHub Actions CI와 Vercel 배포 목표

브랜치, PR, 커밋, CI workflow, GitHub 또는 Vercel 설정을 변경할 때 참고한다.

---

## Document Priority

문서 간 내용이 다르거나 실제 코드와 문서가 충돌하는 경우,
임의로 하나를 선택해서 수정하지 않는다.

다음 순서로 현재 상태를 확인한다.

1. 실제 코드와 적용된 migration
2. 최신 engineering 문서
3. product 문서
4. 이전 설계 문서와 기획 자료

충돌이 발견되면 변경 전에 사용자에게 내용을 알리고 확인한다.

---

## Current Source of Truth

현재 구현 기준은 최신 문서와 실제 코드를 기준으로 한다.

현재 스타일링 기준은 다음과 같다.

```text
CSS Modules
CSS Variables
CVA
clsx
```

데이터 모델 역시 이전 문서보다
최신 DB 설계와 실제 Drizzle schema / migration을 우선한다.

---

## Agent Usage

Codex 등의 개발 에이전트는 모든 문서를 매번 읽을 필요가 없다.

작업 종류에 따라 필요한 문서만 먼저 읽는다.

```text
제품 범위 / 기능 우선순위
→ product/mvp.md

화면 흐름 / 예외 처리
→ product/user-flow.md

화면 요구사항
→ product/ia.md

아키텍처 / 서버 경계 / 폴더 구조
→ engineering/architecture.md

Drizzle / DB / migration / 상태 계산
→ engineering/database.md

CSS / UI 스타일링
→ engineering/styling.md

브랜치 / PR / 커밋 / CI / 배포
→ engineering/github-ci.md
```

문서만 보고 구현 상태를 추측하지 않는다.

변경 전에 관련 코드와 현재 설정을 함께 확인한다.

---

## Documentation Maintenance

중요한 설계 결정이 바뀌면 관련 문서를 함께 수정한다.

예:

```text
DB 구조 변경
→ engineering/database.md 수정

서버 구조 변경
→ engineering/architecture.md 수정

스타일링 규칙 변경
→ engineering/styling.md 수정

GitHub 작업 흐름 / CI / 배포 정책 변경
→ engineering/github-ci.md 수정

MVP 범위 변경
→ product/mvp.md 수정

사용자 흐름 변경
→ product/user-flow.md 또는 product/ia.md 수정
```

과거 결정과 현재 결정을 한 문서에 동시에 유지하지 않는다.

현재 구현 기준이 아닌 내용은 제거하거나 명확하게 Deprecated로 표시한다.
