---
name: debug
description: Runs the debugging workflow in this workspace. Use when the user reports a failure, regression, or symptom that needs root-cause analysis and repair. Mirror the canonical Claude workflow in `.claude/skills/debug/SKILL.md`.
---

# Debug

This Antigravity skill mirrors the canonical Claude workflow in `.claude/skills/debug/SKILL.md`.

## Canonical source

Read and follow:
- `.claude/skills/debug/SKILL.md`
- `.claude/TODO.md` when the issue is already tracked
- `.claude/references/next16.2-agent-notes.md`

## Required behavior

- Gather evidence before proposing fixes.
- Reproduce with the smallest reliable path.
- Apply the smallest fix that explains the evidence.
- Run the narrowest validation that proves the fix.
- Report root cause, fix, validation evidence, and remaining risk.
