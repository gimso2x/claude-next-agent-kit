---
title: start
description: Kick off a large or resumed task while sharing state with Claude through `.claude`.
---

# /start

1. Read `.claude/skills/start/SKILL.md` and follow it as the canonical workflow.
2. Read shared state from `.claude/TODO.md`, `.claude/memory/*`, and `.claude/references/next16.2-agent-notes.md`.
3. If the memory files are still placeholders, seed them from repository facts and the current request.
4. Persist the working plan to `.claude/plans/current-plan.md`.
5. Show the user the plan with Goal, Success Criteria, Likely Files or Surfaces, Execution Steps, Risks, and Validation.
6. Ask exactly one branching question: implement now or run `/plan-cross-check` first.
7. If the user chooses `/plan-cross-check`, run that workflow, update the plan, then continue.
8. Implement in manageable slices, validate, update durable memory only when it truly changed, and report the result.
