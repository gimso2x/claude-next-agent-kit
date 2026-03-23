---
name: feature
description: Run the default feature workflow for a Next.js 16.2-style project. Trigger whenever the user gives a feature requirement, says "추가해줘", "만들어줘", "구현해줘", "이 기능 해줘", or uses `/feature`. Draft a plan first, show it, then ask whether to run `/plan-cross-check` or implement now.
---

# Feature

Use this as the default implementation workflow.

The default shape is:
plan first -> ask once -> implement -> validate -> report

## Read first
- `.claude/TODO.md`
- `.claude/references/next16.2-agent-notes.md`
- Relevant memory files only when they matter for the request
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Restate the requested outcome and success criteria.
2. Inspect similar code and affected surfaces before editing.
3. Check `.claude/memory/architecture.md`, `.claude/memory/domain.md`, `.claude/memory/decisions.md`, and `.claude/TODO.md` for placeholder-only or obviously stale content.
4. If the memory files are still mostly templates, seed them with compact real facts that can be inferred from the repository and the current request.
5. Do not invent missing business facts. If something is not known yet, leave it as an open question instead of pretending it is known.
6. Update `.claude/TODO.md` so the active task is visible in `Now` when that section is still generic or stale.
7. Draft a compact plan and persist it to `.claude/plans/current-plan.md`.
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
12. If the user chooses to proceed immediately, implement the plan in slices.
13. Run relevant validation directly:
   - `node .claude/scripts/run-project-checks.mjs --lint` when available
   - route, auth, `proxy.ts`, or navigation changes should include route-focused verification in the summary
   - tests when they exist and the change meaningfully affects behavior
14. After implementation, update only the durable records that actually changed:
   - `architecture.md` when route structure, boundaries, or system shape changed
   - `domain.md` when glossary, flows, ownership, or constraints changed
   - `decisions.md` when a lasting tradeoff or rule was introduced
   - `TODO.md` when `Now`, `Next`, `Blocked`, or `Done` should move
15. Report the result clearly:
   - changed files or surfaces
   - validation actually run
   - pass/fail/no-op result
   - memory files updated or intentionally left unchanged
   - remaining risk or follow-up

## Quality bar
- Do not skip the plan.
- Do not ask the user to choose among many helper commands.
- The only branching question here is `/plan-cross-check` versus implement now.
- Do not claim success without validation evidence.
