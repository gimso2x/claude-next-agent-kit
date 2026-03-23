---
name: plan-cross-check
description: Reviews the current implementation plan before coding starts. Use when a draft plan exists in `.claude/plans/current-plan.md` and the user wants a stronger critique before implementation. Mirror the canonical Claude workflow in `.claude/skills/plan-cross-check/SKILL.md`.
---

# Plan Cross Check

This Antigravity skill mirrors the canonical Claude workflow in `.claude/skills/plan-cross-check/SKILL.md`.

## Canonical source

Read and follow:
- `.claude/skills/plan-cross-check/SKILL.md`
- `.claude/plans/current-plan.md`
- `.claude/references/next16.2-agent-notes.md`

## Required behavior

- Ensure `.claude/plans/current-plan.md` exists before reviewing.
- Prefer `node .claude/scripts/review-plan-with-gemini.mjs --json --file .claude/plans/current-plan.md` when Gemini is available.
- If Gemini is unavailable, perform the same critique directly and update the plan yourself.
- Return a hardened plan that can be implemented immediately.
