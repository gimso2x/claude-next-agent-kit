---
name: memory-sync
description: Update the local second brain after meaningful work. Use when a task changes durable architecture, domain language, TODO state, or tradeoff decisions, and Claude should synchronize `.claude/TODO.md` and memory files instead of leaving knowledge only in chat history.
---

# Memory Sync

Use this workflow after a meaningful task finishes or a session is about to end.

## Update targets
- `.claude/TODO.md`
- `.claude/memory/architecture.md`
- `.claude/memory/domain.md`
- `.claude/memory/decisions.md`

## Workflow
1. Distill the work into durable facts, not a transcript.
2. Move finished items out of `Now`.
3. Add follow-up tasks to `Next` or `Blocked`.
4. Record decisions with a date, rationale, and follow-up.
5. Update architecture only if structure actually changed.
6. Update domain memory only if terms, flows, or ownership changed.

## Guardrails
- Keep entries short and scannable.
- Prefer bullets over paragraphs.
- Do not duplicate the same fact in multiple files unless the duplication is intentional.
- Treat these files as the project's local second brain.
