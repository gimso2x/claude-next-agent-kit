@AGENTS.md

# Claude Navigation

Read only what the current task needs:
- `.claude/TODO.md` for active work and handoffs
- `.claude/memory/architecture.md` for routing, boundaries, and system shape
- `.claude/memory/domain.md` for product terms, flows, and ownership
- `.claude/memory/decisions.md` for prior tradeoffs and dated decisions
- `.claude/references/next16.2-agent-notes.md` for Next.js 16.2-specific guidance

## 워크플로우

4개만 쓰면 됩니다:

- `/start <큰 작업 요구사항>`
  - 맥락 재구성 → plan 작성 → 보여주기 → `/plan-cross-check` 여부 질문 → 구현 → 검증 → 결과 보고
- `/feature <요구사항>`
  - plan 작성 → 보여주기 → `/plan-cross-check` 여부 질문 → 구현 → 검증 → 결과 보고
- `/debug <증상>`
  - 증거 수집 → 원인 분석 → 수정 → 검증 → 결과 보고
- `/review <리뷰 대상>`
  - read-only 리뷰 → findings first → 결과 보고

`/plan-cross-check`는 위 1, 2번에서 선택적으로 호출됩니다.

자연어로 말해도 같은 흐름을 탑니다:
- "큰 작업 시작해줘", "이거 이어서 해줘" -> `/start`
- "이 기능 추가해줘", "이 요구사항으로 구현해줘" -> `/feature`
- "이거 안돼", "에러나", "왜 깨지지?" -> `/debug`
- "이거 리뷰해줘", "문제점 분석해줘" -> `/review`

## Working habits

- 큰 작업은 plan을 먼저 보여주고 승인 후 진행
- memory 파일이 비어 있거나 placeholder 위주면 첫 `/start` 또는 `/feature`에서 실제 사실로 초기 채우기
- 이후에는 바뀐 durable fact만 memory에 업데이트
- 구현 후 관련 검증을 실행하고 결과를 명확히 보고
- `/clear` between major phases, `/compact` before context gets crowded
- `/mcp` lean — disable unused servers
- 고출력 작업은 로컬 스크립트로 처리하고 결과만 채팅에 요약
