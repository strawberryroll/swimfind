<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Documentation

작업 전에 해당 영역의 기준 문서를 읽는다.

- MVP 범위: `docs/product/mvp.md`
- 다음 작업·개발 우선순위: `docs/ROADMAP.md`
- 사용자 흐름: `docs/product/user-flow.md`
- 화면 요구사항: `docs/product/ia.md`
- 아키텍처: `docs/engineering/architecture.md`
- DB/Drizzle/migration: `docs/engineering/database.md`
- 스타일링: `docs/engineering/styling.md`
- GitHub/PR/CI/배포: `docs/engineering/github-ci.md`

문서 우선순위와 최신 상태는 `docs/README.md`를 따른다.

문서와 실제 코드가 충돌하면 임의로 문서 또는 코드를 변경하지 말고
충돌 내용을 먼저 사용자에게 알린다.
