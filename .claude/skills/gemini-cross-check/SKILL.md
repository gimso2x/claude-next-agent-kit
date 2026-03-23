---
name: gemini-cross-check
description: Run an external second-opinion review with Gemini CLI for a diff, staged changes, or a risky Next.js 16.2 change. Use when you want cross-model validation before merge, after Claude finishes an implementation, or when a review/debug result still feels uncertain. Trigger whenever the user says "get a second opinion", "cross-check", "Gemini review", "double-check with Gemini", or wants external validation on risky code before merging.
---

# Gemini Cross Check

Use this workflow when implementation or review is done and you want one more critique pass on the actual code diff.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Decide the review surface:
   - default working tree diff
   - `--staged` for staged-only validation
   - `--base origin/main` for pre-merge review
2. Run `node scripts/cross-check-with-gemini.mjs --json` from the project root.
3. If the change is ready to merge, prefer `node scripts/cross-check-with-gemini.mjs --json --base origin/main`.
4. Summarize only the material findings back into chat.
5. Reconcile differences between Claude and Gemini instead of blindly trusting either one.

## Notes
- This is a second opinion, not an auto-merge gate.
- If `gemini` is missing or auth is not configured, report that briefly and continue with Claude's review path.
- Prefer running this after local lint and tests, not before.
