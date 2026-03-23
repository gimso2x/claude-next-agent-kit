---
name: feature
description: Runs the default feature workflow in this workspace. Use when the user requests a feature, UI change, or product behavior change. Mirror the canonical Claude workflow in `.claude/skills/feature/SKILL.md` and keep plans and memory in shared `.claude/*` state.
---

# Feature

This Antigravity skill mirrors the canonical Claude workflow in `.claude/skills/feature/SKILL.md`.

## Canonical source

Read and follow:
- `.claude/skills/feature/SKILL.md`
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
- Validate before claiming success and summarize the concrete evidence.
