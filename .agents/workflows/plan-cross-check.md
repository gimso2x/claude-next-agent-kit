---
title: plan-cross-check
description: Critique the current plan before implementation while sharing project state with Claude through `.claude`.
---

# /plan-cross-check

1. Read `.claude/skills/plan-cross-check/SKILL.md` and follow it as the canonical workflow.
2. Ensure `.claude/plans/current-plan.md` exists.
3. If Gemini is available, run `node .claude/scripts/review-plan-with-gemini.mjs --json --file .claude/plans/current-plan.md`.
4. If Gemini is unavailable, perform the same critique directly.
5. Update `.claude/plans/current-plan.md`.
6. Return the hardened plan so implementation can continue immediately.
