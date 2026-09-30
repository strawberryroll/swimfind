---
name: commit-plan
description: "Analyze the current SwimFind Git worktree and propose logical Conventional Commit groups when the user asks for a commit plan. Do not create commits."
---

# Commit Plan

SwimFind의 변경사항을 의미 있는 커밋 단위로 제안한다.

사용자가 “커밋 제안해줘”, “커밋을 어떻게 나눌까”, “커밋 계획”처럼
커밋 구성을 요청할 때 사용한다.

## Workflow

1. `docs/engineering/github-ci.md`를 읽어 현재 Git 규칙을 확인한다.
2. `git status --short --branch`와 diff를 확인한다.
   - 추적 중인 변경은 `git diff`와 `git diff --cached`로 확인한다.
   - 추적되지 않은 파일은 파일 목록과 내용을 확인한다.
   - `.env`, 자격 증명, 비밀값은 출력하거나 커밋 대상으로 제안하지 않는다.
3. 변경의 목적과 의존 관계를 기준으로 커밋을 나눈다.
   - 패키지 하나마다 기계적으로 나누지 않는다.
   - 테스트는 검증하는 기능과 함께 두되, 테스트 환경 설치 자체가 독립적인 작업이면 별도 커밋으로 제안할 수 있다.
   - 사용자 변경과 현재 작업의 변경이 섞였거나 목적이 불명확하면 분리 기준을 밝히고 커밋 전 확인을 요청한다.
4. 현재 브랜치가 `main`이면, 직접 커밋·push하지 말고 작업 목적에 맞는 `feature/`, `fix/`, `refactor/` 브랜치를 먼저 만들도록 안내한다.
5. 각 제안에 Conventional Commit 메시지(한국어 설명)를 제시하고, 포함 파일과 필요한 검사 명령을 함께 적는다.

## Safety Boundary

이 Skill은 분석과 제안만 수행한다.

- 파일을 수정하지 않는다.
- `git add`, `git commit`, `git push`, 브랜치 전환·생성, stash, reset을 실행하지 않는다.
- 실제 커밋은 사용자가 “제안대로 커밋해줘”처럼 명시적으로 요청한 경우에만 별도 작업으로 진행한다.
