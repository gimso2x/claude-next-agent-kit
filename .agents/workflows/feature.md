---
title: feature
description: Run the default feature workflow while sharing state with Claude through `.claude`.
---

# /feature

1. Read `.claude/skills/feature/SKILL.md` and follow it as the canonical workflow.
2. Inspect similar code and affected surfaces before editing.
3. If the memory files are still placeholders, seed them from repository facts and the current request.
4. Persist the working plan to `.claude/plans/current-plan.md`.
5. Show the user the plan with Goal, Success Criteria, Likely Files or Surfaces, Execution Steps, Risks, and Validation.
6. Ask exactly one branching question: implement now or run `/plan-cross-check` first.
7. If the user chooses `/plan-cross-check`, run that workflow, update the plan, then continue.
8. Implement in slices, validate with `.claude/scripts/run-project-checks.mjs` when available, update durable memory only when it truly changed, and report the result.
