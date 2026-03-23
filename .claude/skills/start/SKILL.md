---
name: start
description: Start a large or resumed task for a Next.js 16.2-style project. Trigger whenever the user starts a substantial task, resumes an old task, says "큰 작업 시작", "이 요구사항으로 시작해줘", "이거 이어서 해줘", or uses `/start`. Draft a plan first, show it, then ask whether to run `/plan-cross-check` or implement now.
---

# Start

Use this when the task is large enough that context rebuild and planning should happen before coding.

This is not just a status summary.
Treat it as the kickoff flow for larger work.

## Read first
- `.claude/TODO.md`
- `.claude/memory/architecture.md`
- `.claude/memory/domain.md`
- `.claude/memory/decisions.md`
- `.claude/references/next16.2-agent-notes.md`

## Workflow
1. Rebuild only the context needed for the current request.
2. Inspect `.claude/memory/architecture.md`, `.claude/memory/domain.md`, `.claude/memory/decisions.md`, and `.claude/TODO.md` for placeholder-only or obviously stale content.
3. If the memory files are still mostly templates, seed them with compact real facts that can be inferred from the repository and the current request.
4. Do not invent unknown business facts. When something is not known yet, leave it blank or state it as an open question instead of guessing.
5. Update `.claude/TODO.md` so the active task is visible in `Now` when that section is still generic or stale.
6. Restate the goal, success criteria, and meaningful constraints.
7. Draft a compact implementation plan and persist it to `.claude/plans/current-plan.md`.
8. Show the plan to the user in chat with these sections:
   - Goal
   - Success Criteria
   - Likely Files or Surfaces
   - Execution Steps
   - Risks
   - Validation
9. Ask exactly one question:
   - `이 plan으로 바로 진행할까요, 아니면 /plan-cross-check를 먼저 돌릴까요?`
10. Stop and wait for the user's answer.
11. If the user chooses `/plan-cross-check`, run that workflow, update the plan, then continue implementation.
12. If the user chooses to proceed immediately, start implementation right away.
13. Implement in manageable slices.
14. Run relevant local validation before claiming the work is done.
15. After implementation, update only the durable records that actually changed:
   - `architecture.md` when route structure, boundaries, or system shape changed
   - `domain.md` when glossary, flows, ownership, or constraints changed
   - `decisions.md` when a lasting tradeoff or rule was introduced
   - `TODO.md` when `Now`, `Next`, `Blocked`, or `Done` should move
16. Summarize:
   - changed files or surfaces
   - validation actually run
   - pass/fail/no-op result
   - memory files updated or intentionally left unchanged
   - remaining risk or follow-up

## Notes
- If the request is clearly tiny and local, steer toward `/feature` instead of over-framing it.
- Do not ask the user to choose among many helper commands. The only branching question here is `/plan-cross-check` versus implement now.
