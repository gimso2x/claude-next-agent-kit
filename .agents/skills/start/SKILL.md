---
name: start
description: Starts a large or resumed task in this workspace. Use when the user begins substantial work, resumes prior work, or asks to kick off a multi-file change. Mirror the canonical Claude workflow in `.claude/skills/start/SKILL.md` and keep plans and memory in shared `.claude/*` state.
---

# Start

This Antigravity skill mirrors the canonical Claude workflow in `.claude/skills/start/SKILL.md`.

## Canonical source

Read and follow:
- `.claude/skills/start/SKILL.md`
- `.claude/TODO.md`
- `.claude/memory/architecture.md`
- `.claude/memory/domain.md`
- `.claude/memory/decisions.md`
- `.claude/references/next16.2-agent-notes.md`

## Required behavior

- Draft the plan first and persist it to `.claude/plans/current-plan.md`.
- Show the plan before implementing.
- Ask exactly one branching question: implement now or run `/plan-cross-check` first.
- Seed memory files when they are still placeholders; otherwise update only changed durable facts.
- After implementation, validate and report changed surfaces, validation evidence, memory updates, and remaining risk.
