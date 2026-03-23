---
title: review
description: Run a read-only, findings-first review while sharing project guidance with Claude through `.claude`.
---

# /review

1. Read `.claude/skills/review/SKILL.md` and follow it as the canonical workflow.
2. Use the user-specified files or diff when provided.
3. If the user asks to review current changes, inspect `git diff` and `git diff --cached` first.
4. Stay read-only unless the user explicitly asks for fixes.
5. Report findings first, ordered by severity, then open questions or testing gaps.
