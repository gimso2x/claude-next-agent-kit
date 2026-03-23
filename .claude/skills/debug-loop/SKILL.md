---
name: debug-loop
description: Run the structured debugging loop for a Next.js 16.2-style project. Use for runtime errors, navigation issues, auth regressions, hydration mismatches, route-handler bugs, proxy issues, or when raw logs need to be turned into a concrete fix plan. Trigger whenever the user reports something broken, pastes an error or stack trace, says "doesn't work", "keeps failing", "weird behavior", or describes any unexpected runtime outcome, even if they don't call it a "bug".
---

# Debug Loop

Use this workflow when the goal is root-cause isolation, not feature delivery.

Do not jump to fixes before the evidence points to a likely root cause.

## Read first
- `.claude/TODO.md` if the issue is already tracked
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Capture the symptom exactly as observed.
2. Ask for or read raw logs before theorizing.
3. Reproduce the issue with the smallest reliable path.
4. Check whether the bug touches Next.js 16.2-sensitive areas:
   - `proxy.ts`
   - async `params`, `searchParams`, `cookies()`, `headers()`
   - route handlers
   - server/client boundaries
   - hydration mismatches
5. Use the best available evidence source:
   - browser logs forwarded to the terminal
   - `.next/logs/next-development.log`
   - server function logs
   - `next-browser` when available
6. Isolate one likely root cause at a time.
7. If the evidence is still thin, keep investigating instead of patching by instinct.
8. Apply the smallest fix that explains the evidence.
9. Re-run lint and the narrowest regression check that proves the fix.
10. Summarize:
   - root cause
   - fix
   - residual risk
   - whether `/memory-sync` should record a decision

## Special notes
- Use hydration diff output when the browser overlay provides it.
- Consider `next dev --inspect` or `next start --inspect` when the issue is debugger-worthy.
- If the session gets noisy, split the investigation into smaller phases with `/clear`.
