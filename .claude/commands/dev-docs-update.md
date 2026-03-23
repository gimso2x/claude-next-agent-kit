---
name: dev-docs-update
description: Update `.claude` working docs after progress, review, or context compaction. Use when the task moved forward and TODO, plan, or memory files need a compact refresh.
argument-hint: [what changed]
---

Refresh the project's lightweight working docs after progress.

Workflow:
1. Read `.claude/TODO.md`, `.claude/memory/architecture.md`, `.claude/memory/domain.md`, `.claude/memory/decisions.md`, and `.claude/plans/current-plan.md` if it exists.
2. Use the current chat state plus `$ARGUMENTS` to determine what changed.
3. Update `.claude/TODO.md` first:
   - move completed items out of `Now`
   - add follow-ups to `Next`
   - add real blockers to `Blocked`
4. If a current task still exists, create or refresh `.claude/plans/current-plan.md`.
5. Update decisions, architecture, or domain memory only when the change is durable enough to matter next session.
6. Keep the docs compact and remove stale placeholders when a real fact is now known.

Output:
- summarize the delta you wrote
- mention any unresolved blocker or missing validation
