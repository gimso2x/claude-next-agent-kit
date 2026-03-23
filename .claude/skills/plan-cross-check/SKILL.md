---
name: plan-cross-check
description: Review an implementation plan with Gemini CLI before coding starts. Use when a task is multi-file, high-risk, architecturally unclear, or when you want a second-opinion critique on sequencing, missing risks, and validation before implementation. Trigger whenever a plan has been drafted and the user says "check this plan", "is this approach right", "validate before I start", or the task spans multiple files or touches shared boundaries.
---

# Plan Cross Check

Use this workflow after the first draft plan and before implementation.

The plan should be practical enough that another engineer could execute it without guessing hidden context.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Draft the implementation plan in chat first.
2. Make sure the plan covers these sections before persisting it:
   - Goal
   - Success Criteria
   - Impacted Files or Surfaces
   - Execution Sequence
   - Risks
   - Validation
   - Open Questions
3. Prefer exact file paths when they are already known. If not, name the route, feature surface, or ownership boundary that will likely change.
4. Break the plan into small implementation slices instead of one large blob.
5. Persist the current plan to `.claude/plans/current-plan.md`, creating the file if it is missing.
6. Run `node scripts/review-plan-with-gemini.mjs --json --file .claude/plans/current-plan.md`.
7. Summarize the material critique only:
   - missing steps
   - hidden risks
   - validation gaps
   - sequencing problems
8. Update the plan.
9. Start implementation only after the plan is hardened enough.

## Use this especially when
- the change spans multiple route segments or shared UI
- authentication, redirects, `proxy.ts`, or request lifecycles are involved
- the task will be parallelized across subagents or worktrees
- the task is costly to redo if the plan is weak

## Notes
- This mirrors the plan-review pattern shown in the advanced workflow material, but uses a lightweight local script instead of requiring a custom MCP server.
- If `gemini` is missing or auth is not configured, briefly report that and continue with Claude-only planning.
- If you want a durable plan scaffold first, run `/dev-docs`.
