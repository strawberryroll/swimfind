# SwimFind GitHub Strategy and CI

이 문서는 SwimFind의 GitHub 작업 흐름, PR 규칙, CI와 배포 정책을 정의한다.

브랜치, Issue, PR, 커밋, GitHub Actions 또는 Vercel 설정을 변경할 때 먼저 확인한다.

---

## 1. Delivery Flow

```text
Issue (기능 단위)
→ 짧은 feature/fix/refactor 브랜치
→ Pull Request
→ GitHub Actions CI (PR별 Vercel Preview는 검증 예정)
→ Squash merge
→ main
→ 운영 준비 완료 후 Vercel Production 자동 배포
```

`main`은 항상 CI가 통과하는 상태로 유지한다. 운영 배포 가능 여부는 운영 DB와 배포 환경을 준비할 때 별도로 검증한다.

---

## 2. Branch Policy

GitHub Flow를 사용한다.

- 기능 개발: `feature/`
- 버그 수정: `fix/`
- 구조 개선: `refactor/`
- 브랜치는 한 Issue 또는 하나의 사용자 가치 단위에만 집중하고 짧게 유지한다.
- 작업 완료 후 Squash merge하고 원격 feature 브랜치는 삭제한다.
- `main`에 직접 push하지 않는다.
- 고정된 `dev`·`develop` 브랜치는 두지 않는다. Vercel의 자동 Git 배포에서는 `main`이 Production Branch이고 `feature/`·`fix/`·`refactor/` 작업 브랜치가 Preview 대상이다. 수동으로 배포를 생성할 때는 `main` 커밋도 Preview 환경에 배포할 수 있다. Vercel의 Development 환경은 로컬 개발용 변수 범위이며 Git 브랜치 이름이 아니다.

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

현재 PR에서는 GitHub Actions CI로 변경사항을 확인한다. 수동 Preview 조회는 확인했지만, PR 브랜치의 자동 Preview 배포는 아직 검증하지 않았다.

CI의 목표 순서:

```text
pnpm install --frozen-lockfile
→ pnpm check
→ pnpm typecheck
→ pnpm test --run
→ pnpm build
```

각 명령의 의미:

- `pnpm check`: Biome 검사
- `pnpm typecheck`: TypeScript 타입 검사
- `pnpm test`: Vitest 단위·컴포넌트 테스트
- `pnpm build`: Next.js production build 검사

E2E 테스트는 초기에는 로컬에서 실행하고, 테스트가 안정화된 뒤 별도 GitHub Actions job으로 추가한다.

운영 준비 단계에서 `main`에 Squash merge되면 Vercel Production 배포가 자동으로 실행되도록 연결한다.

### Current Implementation Status

`main`에는 `.github/workflows/ci.yml`과 `typecheck`·`test` 스크립트가 있다.
workflow `CI`의 `validate` job은 `main` 대상 PR과 `main` push에서 위 순서로 실행된다.
`typecheck`는 `next typegen && tsc --noEmit`이고, `test`는 Vitest다.
Vitest는 현재 테스트 파일을 자동 탐색하며 별도 `vitest.config.*` 파일은 없다.
PR #21과 병합 커밋의 `main` push에서 `validate`가 통과했다.

Vercel GitHub App으로 SwimFind 프로젝트를 생성했다. 사용자는 개발 DB를 연결한 Preview만 먼저 배포하고, Production은 운영 DB가 준비될 때까지 보류하기로 했다. `main`의 `91836e3` 커밋을 수동으로 Preview 환경에 배포했고, Vercel에서 Ready 상태를 확인했다. 해당 Preview의 `/pools/1`·`/pools/2`·`/pools/3`은 수영장 데이터를 표시하고, 없는 정수 ID와 잘못된 ID는 404 화면을 표시한다. PR별 Preview 배포 검증은 아직 확인하지 않았다.
가져오기 화면에서 `DATABASE_URL`을 Preview 범위로 선택했지만, 첫 `Deploy`는 main의 Production 빌드를 시작했다. 이 빌드는 Production 범위에 변수가 없어 `DATABASE_URL` 미설정 오류로 실패했다. 수동 생성한 Preview 배포는 별개이며, 서비스 중인 Production 배포는 없다. Production 범위에 개발 DB 연결을 넣지 않는다. 운영 DB·Production 배포·공개 출시는 단계 9 범위다.
운영 DB를 준비하기 전에는 Vercel 프로젝트의 Ignored Build Step을 `Only build pre-production`으로 설정해 Production 빌드를 건너뛰고 Preview 빌드를 유지한다. 작업 브랜치에 추가한 `vercel.json`은 `main`의 Git 자동 배포만 끄며, `main`에 병합된 뒤 적용된다. 두 설정 모두 `main`의 새 커밋을 자동으로 Preview에 배포하지는 않는다. 새 `main` 커밋의 Preview가 필요하면 현재는 수동 배포한다. 운영 배포를 시작할 때 두 설정을 함께 재검토한다.
저장소는 public이다. private 상태에서 GitHub Free의 보호 규칙 API가 HTTP 403을 반환해, 사용자 결정에 따라 public으로 전환했다.
`main` 보호 규칙은 PR 필수(필수 승인자 0명), `validate` 상태 검사 통과 필수, 최신 main 기준 검사 필수로 설정됐다.
관리자에게도 규칙을 적용하고, 강제 push·브랜치 삭제를 금지하며 선형 이력을 요구한다.
병합 방식은 Squash만 허용하고 Merge commit·Rebase merge는 비활성화했다. API 재조회로 적용값을 확인했다.
