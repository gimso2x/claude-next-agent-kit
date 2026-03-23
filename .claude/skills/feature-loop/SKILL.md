---
name: feature-loop
description: Run the main feature implementation loop for a Next.js 16.2-style project. Use for new features, scoped enhancements, refactors with user-visible behavior, and any coding task that should follow Plan Mode, small checkpoints, validation, and memory updates.
---

# Feature Loop

Use this as the default implementation workflow.

## Read first
- `.claude/TODO.md`
- `.claude/references/next16.2-agent-notes.md`
- Relevant memory files only when needed
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Start in Plan Mode for multi-file or high-risk work.
2. Restate the requested outcome, success criteria, and the first checkpoint.
3. Inspect similar code and affected surfaces before editing.
4. Draft the implementation plan before editing.
5. If the task is multi-file, high-risk, or architecturally unclear, stop after the first plan draft and run `/plan-cross-check`.
6. Update the plan with the material critique, then implement in slices.
7. Check the Next.js 16.2 constraints that apply:
   - App Router conventions
   - server/client boundary
   - `proxy.ts`
   - async request APIs
8. Keep the loop small:
   - implement one slice
   - validate the slice
   - summarize risk
   - move to the next slice
9. Prefer tests before or immediately after the implementation when the project supports them.
10. Use local scripts for heavy output instead of dumping long logs into chat.
11. Run `node scripts/run-project-checks.mjs --lint` after meaningful code changes.
12. For high-risk diffs or pre-merge checks, run `/gemini-cross-check` for an external second opinion.
13. Call `/memory-sync` if the work changed durable decisions, flows, or the TODO queue.

## Validation posture
- Default to lint-first validation.
- Run tests when they exist and the feature meaningfully changes behavior.
- Run build only when the project is stable enough that build failures are actionable.

## Quality bar
- One session, one feature when possible.
- Harden the plan before parallelizing or launching subagents.
- Do not ignore thinking logs when they surface uncertainty or hidden assumptions.
- Prefer raw error output over paraphrased symptoms.
