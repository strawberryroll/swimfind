---
name: issue-pr-lifecycle
description: "Manage a SwimFind GitHub issue, pull request, squash merge, and issue closure when the user explicitly requests a delivery workflow."
---

# Issue PR Lifecycle

SwimFind의 단일 기능 또는 수정 작업을 GitHub Flow로 전달한다.

사용자가 Issue 생성, PR 생성, 머지, Issue 종료를 요청하거나
“이슈부터 머지까지 진행해줘”처럼 전체 전달 흐름을 명시할 때 사용한다.

## Preparation

1. `docs/engineering/github-ci.md`와 해당 영역의 기준 문서를 읽는다.
2. `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`를 읽어 현재 템플릿을 따른다.
3. 현재 브랜치, Git 상태, 기존 Issue·PR을 확인한다.
   - 비밀값 또는 `.env` 파일은 출력·stage·commit·PR에 포함하지 않는다.
   - 사용자 변경과 현재 작업이 섞였거나 PR 범위가 불명확하면 분리 기준을 설명하고 확인을 요청한다.

## Issue

- 기능 Issue를 만들거나 수정하기 전에 `.github/ISSUE_TEMPLATE/feature.md`의 실제 헤딩을 확인한다.
- 기능 Issue 본문에는 반드시 아래 헤딩을 이 순서로 사용한다. 비슷한 표현으로 바꾸거나 생략하지 않는다.
  - `## 목표`
  - `## 포함`
  - `## 제외`
  - `## 완료 기준`
  - `## 참고`
- 제목은 템플릿의 접두사 규칙을 따른다. 예: `[Feature] 오늘 자유수영 상태 계산`
- 작업 영역에 맞는 기존 라벨을 적용한다.
- Issue 생성만 요청된 경우 이후 브랜치·PR 작업을 진행하지 않는다.

## Branch and Pull Request

- `main`에는 직접 커밋·push하지 않는다. 기능 목적에 맞는 짧은 `feature/`, `fix/`, `refactor/` 브랜치를 사용한다.
- 커밋은 의미 있는 단위로 나누고, 한국어 Conventional Commit 메시지를 사용한다.
- PR 전에는 변경에 비례한 검사를 실행하고 실제 결과만 PR 본문에 기록한다.
- PR 본문은 템플릿을 채우고, 같은 저장소 Issue에는 `Closes #번호`를 작성한다.
- PR 생성 후 base가 `main`인지, 충돌이 없는지, 연결 이슈가 GitHub에서 실제 인식됐는지 확인한다.
- 키워드 연결이 인식되지 않으면 그 사실을 알리고, 머지 후 Issue 상태를 확인한다. 연결 실패를 숨기거나 자동 종료를 가정하지 않는다.

## Merge and Issue Closure

머지와 Issue 종료는 외부 상태를 바꾸므로 사용자가 명시적으로 요청한 경우에만 실행한다.

1. PR의 open 상태, base branch, 충돌 여부, 검사 결과를 확인한다.
2. Squash 커밋 메시지를 사용자와 결정한다. 기본 형식은 `type(scope): 한국어 설명`이다.
3. 사용자가 머지를 승인하면 Squash merge하고 원격 기능 브랜치를 삭제한다.
4. PR 머지 결과와 Issue 상태를 다시 확인한다.
5. 연결 키워드로 Issue가 자동 종료되지 않았지만 완료 기준이 충족되면, 사용자 승인 후 PR 번호와 확인 결과를 남기고 Issue를 수동 종료한다.

## Boundaries

- 사용자가 요청하지 않은 Issue, PR, 머지, 브랜치 삭제를 만들거나 수행하지 않는다.
- 한 PR에 무관한 변경을 섞지 않는다.
- CI 또는 설정이 아직 없는 경우 통과했다고 표현하지 않는다.
