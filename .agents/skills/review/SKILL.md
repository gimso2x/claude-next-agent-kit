---
name: review
description: Runs a read-only, findings-first review in this workspace. Use when the user asks for code review, audit, or risk analysis. Mirror the canonical Claude workflow in `.claude/skills/review/SKILL.md`.
---

# Review

This Antigravity skill mirrors the canonical Claude workflow in `.claude/skills/review/SKILL.md`.

## Canonical source

Read and follow:
- `.claude/skills/review/SKILL.md`
- `.claude/references/next16.2-agent-notes.md`

## Required behavior

- Stay read-only unless the user explicitly asks for fixes.
- Present findings first, ordered by severity.
- Focus on regressions, routing, async APIs, server/client boundaries, and missing validation.
- If there are no findings, say so plainly and note any residual testing gaps.
