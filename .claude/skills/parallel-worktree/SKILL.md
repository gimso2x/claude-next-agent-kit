---
name: parallel-worktree
description: Choose between staying in the main session, using built-in or custom subagents, or splitting work into a git worktree. Use when tasks are large, output-heavy, parallelizable, or when review and debugging context should be isolated from the main conversation. Trigger whenever the user says "split this work", "run in parallel", "isolate this", "separate branch", or the task is clearly too noisy or large for a single conversation thread.
---

# Parallel Worktree

Use this workflow when context isolation matters.

## WAT decision frame
- Workflow: can the task stay in one focused loop?
- Agents: would a built-in or custom subagent isolate noisy exploration?
- Tools: does the task really need a separate worktree, server, or log stream?

## Default rule
- Stay in one session for small, local, single-feature work.
- Use subagents for read-heavy exploration, reviews, and log analysis.
- Use a git worktree when branches, servers, or long-running test loops need real isolation.
- Harden the plan with `/plan-cross-check` before parallelizing implementation slices.

## Suggested choices
1. Use the main session when the task is a small code change with tight context.
2. Use built-in Explore or Plan when the next step is codebase research.
3. Use `next-reviewer` for risk-first read-only review.
4. Use `log-investigator` for read-only log triage.
5. Use `plan-reviewer` before parallelizing a risky implementation plan.
6. Use `code-architecture-reviewer` when the main risk is system shape, route boundaries, or long-term maintainability.
7. Use a separate worktree when:
   - the change is large enough to deserve its own branch
   - you need a second dev server or parallel terminal flow
   - logs and test output would drown the main conversation

## Worktree guardrails
- Keep branch purpose narrow.
- Do not split a trivial fix into a worktree just because the feature exists.
- Merge findings back into `.claude/TODO.md` and memory when the isolated work finishes.
