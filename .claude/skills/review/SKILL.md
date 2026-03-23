---
name: review
description: Run a read-only, findings-first review for a Next.js 16.2-style project. Trigger whenever the user says "리뷰해줘", "분석해줘", "문제 찾아줘", "안전한지 봐줘", "check this", "audit", or uses `/review`.
---

# Review

Use this workflow for review-only tasks.
Stay read-only unless the user explicitly asks for fixes.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Determine review scope
- If the user specifies files or a diff, use that.
- If the user says "변경사항", "지금 바꾼거", or similar, run `git diff` (unstaged) and `git diff --cached` (staged) first.
- If both are empty, ask the user what to review instead of guessing.

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
- If there are no findings, say so plainly.
