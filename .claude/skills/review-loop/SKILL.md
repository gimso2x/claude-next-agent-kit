---
name: review-loop
description: Run a risk-first code review for a Next.js 16.2-style project. Use when reviewing diffs, checking a feature before merge, auditing a refactor, or asking Claude to focus on bugs, regressions, missing tests, and architecture risks instead of implementation.
---

# Review Loop

Use this workflow for review-only tasks. Stay read-only unless the user explicitly asks for fixes.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Review order
1. Findings first, ordered by severity.
2. Open questions or assumptions.
3. Residual testing gaps if no findings are present.

## Review checklist
- App Router file conventions
- `proxy.ts` behavior and routing impact
- async request APIs
- server/client boundary correctness
- route handlers versus server functions
- hydration and navigation risks
- performance regressions from unnecessary client expansion
- accessibility and state preservation where UI changed
- missing or weak validation coverage

## Reporting format
- Cite file paths directly.
- Keep each finding concrete and actionable.
- Prefer behavior regressions over style commentary.

## Escalation
- If confidence is low, say so clearly.
- For architecture-heavy changes, ask `code-architecture-reviewer` for a read-only second pass.
- For high-risk changes, run `/gemini-cross-check` or `node scripts/cross-check-with-gemini.mjs --json` as an external second opinion.
- Treat Gemini output as critique input, not as the source of truth.
