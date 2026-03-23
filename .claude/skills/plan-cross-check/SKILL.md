---
name: plan-cross-check
description: Review an implementation plan with Gemini CLI before coding starts. Use when a task is multi-file, high-risk, architecturally unclear, or when you want a second-opinion critique on sequencing, missing risks, and validation before implementation.
---

# Plan Cross Check

Use this workflow after the first draft plan and before implementation.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Draft the implementation plan in chat first.
2. Persist the current plan to `.claude/plans/current-plan.md`.
3. Run `node scripts/review-plan-with-gemini.mjs --json --file .claude/plans/current-plan.md`.
4. Summarize the material critique only:
   - missing steps
   - hidden risks
   - validation gaps
   - sequencing problems
5. Update the plan.
6. Start implementation only after the plan is hardened enough.

## Use this especially when
- the change spans multiple route segments or shared UI
- authentication, redirects, `proxy.ts`, or request lifecycles are involved
- the task will be parallelized across subagents or worktrees
- the task is costly to redo if the plan is weak

## Notes
- This mirrors the plan-review pattern shown in the advanced workflow material, but uses a lightweight local script instead of requiring a custom MCP server.
- If `gemini` is missing or auth is not configured, briefly report that and continue with Claude-only planning.
