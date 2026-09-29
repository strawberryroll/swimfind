# SwimFind GitHub Strategy and CI

이 문서는 SwimFind의 GitHub 작업 흐름, PR 규칙, CI와 배포 정책을 정의한다.

브랜치, Issue, PR, 커밋, GitHub Actions 또는 Vercel 설정을 변경할 때 먼저 확인한다.

---

## 1. Delivery Flow

```text
Issue (기능 단위)
→ 짧은 feature/fix/refactor 브랜치
→ Pull Request
→ GitHub Actions CI + Vercel Preview
→ Squash merge
→ main
→ Vercel Production 자동 배포
```

`main`은 항상 배포 가능한 상태로 유지한다.

---

## 2. Branch Policy

GitHub Flow를 사용한다.

- 기능 개발: `feature/`
- 버그 수정: `fix/`
- 구조 개선: `refactor/`
- 브랜치는 한 Issue 또는 하나의 사용자 가치 단위에만 집중하고 짧게 유지한다.
- 작업 완료 후 Squash merge하고 원격 feature 브랜치는 삭제한다.
- `main`에 직접 push하지 않는다.

브랜치 이름 예시:

```text
feature/pool-search
fix/pool-status-label
refactor/pool-service
```

---

## 3. Issue, Pull Request, Commit

### Issue and Pull Request

Issue와 PR은 화면 전체 기준이 아니라, 사용자에게 전달되는 가치가 완성되는 기능 단위로 만든다.

PR 본문에는 다음을 적는다.

- 작업 내용
- 변경 이유
- 확인 사항 또는 테스트 결과
- 관련 Issue

저장소의 템플릿은 다음 경로에서 관리한다.

```text
.github/ISSUE_TEMPLATE/feature.md
.github/ISSUE_TEMPLATE/bug.md
.github/pull_request_template.md
```

기능 Issue에는 목표, 포함·제외 범위, 완료 기준을 기록한다.
버그 Issue에는 재현 방법, 기대 결과, 실제 결과를 기록한다.

### Commit

커밋 메시지는 Conventional Commit 형식을 사용하며 한국어 설명을 허용한다.

사용 가능한 type:

```text
feat
fix
refactor
test
docs
chore
```

필요하면 scope를 추가한다.

```text
feat(pool): 수영장 검색 기능 구현
fix(schedule): 자유수영 상태 계산 오류 수정
chore: Drizzle 개발 환경 설정
```

패키지 설치마다 커밋하지 않고, 의미 있는 작업 단위로 묶는다.

---

## 4. Merge and Main Protection

- PR 병합은 Squash merge만 사용한다.
- `main`은 PR을 통해서만 변경한다.
- CI가 통과해야 병합할 수 있다.
- 1인 MVP 단계에서는 별도 승인자를 필수로 두지 않는다.

GitHub repository 설정에서 `main` 보호 규칙을 적용할 때는 다음을 활성화한다.

- Pull Request 필수
- 상태 검사(CI) 통과 필수
- 직접 push 제한

---

## 5. CI and Deployment

PR에서는 GitHub Actions CI와 Vercel Preview 배포로 변경사항을 확인한다.

CI의 목표 순서:

```text
pnpm install --frozen-lockfile
→ pnpm check
→ pnpm typecheck
→ pnpm test
→ pnpm build
```

각 명령의 의미:

- `pnpm check`: Biome 검사
- `pnpm typecheck`: TypeScript 타입 검사
- `pnpm test`: Vitest 단위·컴포넌트 테스트
- `pnpm build`: Next.js production build 검사

E2E 테스트는 초기에는 로컬에서 실행하고, 테스트가 안정화된 뒤 별도 GitHub Actions job으로 추가한다.

`main`에 Squash merge되면 Vercel Production 배포가 자동으로 실행되도록 연결한다.

### Current Implementation Status

현재는 이 정책 문서만 준비된 상태다.

- GitHub Actions workflow는 아직 만들지 않았다.
- `typecheck`, `test` 스크립트와 Vitest 설정은 아직 만들지 않았다.
- Vercel Preview 및 Production 연결, `main` 보호 규칙은 GitHub/Vercel 설정에서 별도로 적용해야 한다.

CI workflow를 구현할 때는 현재 등록된 실제 package script와 이 문서를 함께 확인하고, 없는 script를 먼저 추가한 뒤 workflow에서 사용한다.
