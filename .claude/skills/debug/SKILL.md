---
name: debug
description: Run the debugging workflow for a Next.js 16.2-style project. Trigger whenever the user reports that something is broken, says "안돼", "오류", "깨져", "fails", "doesn't work", or uses `/debug`. Investigate, fix, validate, and report.
---

# Debug

Use this workflow when the goal is root-cause isolation and repair.

## Read first
- `.claude/TODO.md` if the issue is already tracked
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Restate the symptom exactly as observed.
2. Gather raw evidence before theorizing:
   - logs
   - stack traces
   - reproduction steps
3. Reproduce the issue with the smallest reliable path.
4. Narrow the likely root cause.
5. Apply the smallest fix that explains the evidence.
6. Run the narrowest validation that proves the fix.
7. Report:
   - root cause
   - fix
   - validation actually run
   - pass/fail/no-op result
   - remaining risk

## Notes
- Do not jump to fixes before the evidence points somewhere concrete.
- If the likely fix is much larger than the current ask, pause and explain why before expanding scope.
