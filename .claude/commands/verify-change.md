---
name: verify-change
description: Run a compact first-pass verification gate for the current change. Use after implementation or before merge when you want fresh evidence, route-risk checks, and the next best action summarized in one pass.
argument-hint: [scope, route, or risk focus]
---

Run a compact first-pass verification gate for the current change.

This is the lightweight "do I have fresh evidence?" pass.
Use it before saying the work is done.
If the change still feels risky, ambiguous, or cross-cutting after this pass, follow with `/review-loop`.

Workflow:
1. Inspect the current task plus `$ARGUMENTS`.
2. If git is available, inspect the current diff or status to determine the changed surface.
3. Run `node scripts/run-project-checks.mjs --json --lint` when the project supports it.
4. Detect whether route-level verification is needed. Treat these as route-sensitive by default:
   - `src/app/**`
   - `app/**`
   - `proxy.ts`
   - `route.ts`
   - auth, redirect, navigation, layout, page, loading, error, not-found changes
5. If the change is route-sensitive, perform the `route-smoke` workflow and include the smoke checklist in the result.
6. Perform a quick risk scan focused on:
   - App Router conventions
   - async request APIs
   - server-client boundary correctness
   - proxy or routing side effects
   - missing validation coverage
7. Apply an evidence-first rule:
   - do not claim success without a fresh command result or direct inspection evidence
   - if lint, route checks, or the inspected surface do not support a success claim, say so plainly
8. If the change looks architecture-heavy or cross-cutting, recommend `/review-loop` or `code-architecture-reviewer`.
9. Do not run Gemini by default. Only recommend `/gemini-cross-check` when the diff is high-risk, ambiguous, or pre-merge confidence is still low.

Output:
- verification surface
- evidence actually used
- checks actually run
- pass/fail/no-op status for local validation
- route smoke checklist if relevant
- highest-risk finding or remaining concern
- whether this passed a compact first-pass check or needs deeper review
- next best action
