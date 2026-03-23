---
name: review-loop
description: Run a deep risk-first code review for a Next.js 16.2-style project. Use after `/verify-change`, before merge, when the diff feels risky, or whenever you want findings-first feedback on bugs, regressions, missing tests, and architecture concerns. Trigger whenever the user says "review", "check this", "look at this diff", "audit", "is this safe to merge", or asks for feedback on code changes, even without explicitly saying "code review".
---

# Review Loop

Use this workflow for review-only tasks. Stay read-only unless the user explicitly asks for fixes.

This is the deeper pass, not the quick gate.
Use `/verify-change` for the fast evidence check.
Use `/review-loop` when you want a serious pre-merge review or when `/verify-change` surfaced concerns that need a fuller read.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Review order
1. Findings first, ordered by severity.
2. Open questions or assumptions.
3. Residual testing gaps if no findings are present.

## Review checklist
- Compare the change against the stated goal or plan when that context exists.
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
