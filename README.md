# Claude Next 16.2 Kit

Reusable Claude Code kit for Next.js 16.2-style projects.

## 한국어 사용법

이 키트는 `Next.js 16.2 계열 프로젝트에서 Claude Code를 어떻게 운영할지`를 정리한 실전용 세트입니다.
README는 한국어 섹션을 우선 기준으로 보고, 아래 영어 섹션은 보조 참고용으로 봐도 됩니다.

### 1. 프로젝트에 넣기
1. 이 저장소의 파일을 실제 프로젝트 루트에 복사합니다.
2. Claude Code를 그 프로젝트 루트에서 엽니다.
3. 필요하면 `git init` 또는 기존 git 저장소 안에서 사용합니다.

### 2. 기본 작업 흐름
1. 세션 시작: `/session-bootstrap`
2. 기능 작업 시작:
   - 작은 작업이면 `/feature-loop`
   - 큰 작업이면 `/dev-docs`로 작업 문서를 먼저 만들고 `/plan-cross-check`로 계획을 검토한 뒤 `/feature-loop`로 구현합니다
3. route, auth, `proxy.ts`, 네비게이션 변경이 있으면 `/route-smoke`
4. 머지 전 검토:
   - `/verify-change`로 먼저 가벼운 1차 evidence check를 합니다
   - 불안한 지점이 남거나 심화 리뷰가 필요하면 `/review-loop`를 돌립니다
   - 구조/경계 관점의 read-only 검토는 `code-architecture-reviewer`
   - 외부 2차 의견이 필요하면 `/gemini-cross-check`
5. 작업 중간 문서 갱신: `/dev-docs-update`
6. 작업 완료 후 durable memory 반영: `/memory-sync`
7. 복잡한 작업 분리, 병렬화, worktree 판단: `/parallel-worktree`

### 3. 어떤 명령을 언제 쓰는지
- `/feature-loop`: 기본 구현 루프
- `/debug-loop`: 버그 재현과 원인 분석
- `/plan-cross-check`: 구현 전 계획을 Gemini로 비평
- `/review-loop`: 코드 변경을 깊게 읽는 심화 pre-merge 리뷰
- `/gemini-cross-check`: 구현 후 diff를 Gemini로 한 번 더 비평
- `/dev-docs`: 현재 작업용 plan/TODO 문서 생성 또는 초기화
- `/dev-docs-update`: 작업 진행 중인 plan/TODO 문서 갱신
- `/route-smoke`: 변경된 route 기준으로 스모크 테스트 체크리스트 생성
- `/verify-change`: 완료 주장 전에 fresh evidence를 확인하는 가벼운 1차 검증 게이트
- `/memory-sync`: 작업 완료 후 TODO, architecture, domain, decisions에 durable 정보 반영
- `/parallel-worktree`: 병렬 작업/서브에이전트/worktree 분리 판단

### 4. 에이전트 사용법
- `next-reviewer`: 일반 코드 리뷰 전용 read-only reviewer
- `log-investigator`: 로그/증상 분석 전용 read-only investigator
- `plan-reviewer`: 구현 전 계획 리뷰 전용 read-only reviewer
- `code-architecture-reviewer`: 구조/경계/라우팅 관점 아키텍처 리뷰어

### 5. dev-docs-update 와 memory-sync 차이
- `/dev-docs-update`: 작업이 아직 진행 중일 때, 현재 plan/TODO를 계속 맞추는 용도
- `/memory-sync`: 작업이 끝났거나 세션을 닫기 전에 durable memory만 반영하는 용도
- 즉, `진행 중 문서`는 `/dev-docs-update`, `완료 후 기억 정리`는 `/memory-sync`

### 6. Gemini는 꼭 써야 하나?
- 아닙니다. 선택입니다.
- 평소에는 Claude 중심으로 작업해도 됩니다.
- 큰 변경, 애매한 설계, 머지 전 불안한 diff에서만 `/plan-cross-check` 또는 `/gemini-cross-check`를 쓰는 식으로 운영하면 됩니다.

### 7. 주의할 점
- 이 키트의 hook과 script는 Node.js 20+ 기준입니다.
- git diff 기반 리뷰는 git 저장소 안에서만 잘 동작합니다.
- WSL에서 Claude를 돌리면 WSL 내부에도 `node`와 필요 시 `gemini`가 설치돼 있어야 합니다.
- `.claude/plans/current-plan.md`는 필요할 때만 생성해서 쓰면 됩니다.

## What this kit contains
- `AGENTS.md` and `CLAUDE.md` for project entry instructions
- `.claude/settings.json` for permissions and hooks
- `.claude/skills/*` for planning, implementation, debugging, review, and memory updates
- `.claude/commands/*` for working-doc updates and route-level verification helpers
- `.claude/agents/*` for read-only specialist reviewers
- `.claude/hooks/*` for lightweight session context, command guards, write guards, and post-edit validation
- `scripts/*` for local validation and optional Gemini CLI cross-checks

## Copy into a real project
1. Copy this folder's contents into your project root.
2. Keep `.claude/settings.local.json` local-only if you add one.
3. Open Claude Code from that project root.
4. Start with `/session-bootstrap`.

## Recommended workflow
1. `/feature-loop` and ask for a plan first, or use `/dev-docs` if you want a durable working plan file immediately.
2. Create or update `.claude/plans/current-plan.md` when the task is large enough to benefit from a persisted plan.
3. Run `/plan-cross-check` for multi-file, risky, or unclear work.
4. Implement after the plan is hardened.
5. Run `/route-smoke` when routing, auth, proxy, or navigation changed.
6. Run `/verify-change` for a compact first-pass evidence check.
7. Run `/review-loop` or a read-only reviewer agent only when you want a deeper pre-merge review.
8. Run `/gemini-cross-check` only when you want an external second opinion on the code diff.
9. Use `/dev-docs-update` while the task is still active and the working plan needs another pass.
10. Use `/memory-sync` when the task is done or when durable project memory changed.

## Requirements
- Node.js 20+ in the environment where Claude Code runs
- Claude Code hooks enabled via `.claude/settings.json`
- A git repository is strongly recommended

## Git expectations
- `guard-command.mjs` blocks broad or destructive git commands.
- `cross-check-with-gemini.mjs` reviews a git diff, so it needs a git repository with changes to inspect.
- `review-plan-with-gemini.mjs` does not require git.
- If you copy this kit into a brand-new folder, initialize git before using diff-based review flows.

## Gemini CLI
- Gemini is optional.
- `/plan-cross-check` and `/gemini-cross-check` fall back to a friendly no-op message when `gemini` is missing or not authenticated.
- Install and authenticate Gemini CLI only if you want cross-model critique.
- Official docs:
  - Authentication: https://google-gemini.github.io/gemini-cli/docs/get-started/authentication.html
  - Commands and headless mode: https://google-gemini.github.io/gemini-cli/docs/cli/commands.html

## Windows and WSL
- All hook and script logic lives in `.mjs` files. Run them directly with `node scripts/<name>.mjs`.
- If Claude runs inside WSL, install both `node` and optional `gemini` inside WSL too.
- Hook commands in `.claude/settings.json` resolve paths from `CLAUDE_PROJECT_DIR` inside Node so they are not tied to the current working directory or shell syntax.

## Notes
- `.next/logs/next-development.log` is optional. The post-edit hook reads it only if it exists.
- Memory files are starter templates. Replace the example bullets with real project facts early.
- `.claude/plans/` is tracked with `.gitkeep`; create `current-plan.md` only when you need a persisted plan.
