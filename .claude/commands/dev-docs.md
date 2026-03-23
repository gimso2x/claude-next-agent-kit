---
description: Create or refresh lightweight working docs for the current task. Use when starting a larger task and you want a durable plan, TODO updates, and memory touchpoints under `.claude/`.
argument-hint: [task or focus]
---

Create or refresh the working docs for the current task.

Goals:
- create `.claude/plans/current-plan.md` if it does not exist
- update `.claude/TODO.md` with the active task and likely follow-ups
- keep `.claude/memory/*` aligned only when durable facts changed

Workflow:
1. Read `.claude/TODO.md`, `.claude/memory/architecture.md`, `.claude/memory/domain.md`, `.claude/memory/decisions.md`, and `.claude/references/next16.2-agent-notes.md`.
2. Use the current request plus `$ARGUMENTS` as the planning focus.
3. Create or refresh `.claude/plans/current-plan.md` with:
   - Goal
   - Scope
   - Plan
   - Risks
   - Validation
   - Open Questions
4. Update `Now`, `Next`, and `Blocked` in `.claude/TODO.md` if they are stale.
5. Touch architecture or domain memory only if the task introduces durable changes or constraints.
6. Keep edits compact and practical, not essay-like.

Output:
- summarize what changed
- list the next best follow-up, usually `/plan-cross-check` or `/feature-loop`
