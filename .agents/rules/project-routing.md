# Project Routing

Configure this rule as `Always On` in Antigravity.

## Canonical source of truth

- `.claude/` is the canonical layer for workflows, shared memory, plans, hooks, and scripts.
- `.agents/` is the Antigravity wrapper layer.

## Route user requests

- Large task, resumed task, or broad multi-file work: use `start`
- Default feature work, UI work, or behavior change: use `feature`
- Broken behavior, regression, or error: use `debug`
- Review, audit, or risk analysis: use `review`
- Plan critique before coding: use `plan-cross-check`

## Shared state

Read and write shared project state only in:
- `.claude/plans/current-plan.md`
- `.claude/TODO.md`
- `.claude/memory/architecture.md`
- `.claude/memory/domain.md`
- `.claude/memory/decisions.md`

Do not fork separate Antigravity-only memory or plan files.

## Behavior guardrails

- `start` and `feature` must draft the plan first, show it, then ask exactly one branching question: implement now or run `/plan-cross-check` first.
- `start` and `feature` should seed memory files only when they are still placeholders; later runs should update only changed durable facts.
- `debug` should gather evidence before proposing fixes.
- `review` stays read-only unless the user explicitly asks for changes.
- Do not claim success without validation evidence.
