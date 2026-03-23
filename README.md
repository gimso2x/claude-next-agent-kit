# Claude Next 16.2 Kit

Reusable Claude Code kit for Next.js 16.2-style projects.

## What this kit contains
- `AGENTS.md` and `CLAUDE.md` for project entry instructions
- `.claude/settings.json` for permissions and hooks
- `.claude/skills/*` for planning, implementation, debugging, review, and memory updates
- `.claude/hooks/*` for lightweight session context, command guards, write guards, and post-edit validation
- `scripts/*` for local validation and optional Gemini CLI cross-checks

## Copy into a real project
1. Copy this folder's contents into your project root.
2. Keep `.claude/settings.local.json` local-only if you add one.
3. Open Claude Code from that project root.
4. Start with `/session-bootstrap`.

## Recommended workflow
1. `/feature-loop` and ask for a plan first.
2. Save or update `.claude/plans/current-plan.md`.
3. Run `/plan-cross-check` for multi-file, risky, or unclear work.
4. Implement after the plan is hardened.
5. Run `/review-loop`.
6. Run `/gemini-cross-check` only when you want an external second opinion on the code diff.
7. Finish with `/memory-sync`.

## Requirements
- Node.js 20+ in the environment where Claude Code runs
- Claude Code hooks enabled via `.claude/settings.json`
- A git repository is strongly recommended

## Git expectations
- `guard-command.mjs` blocks broad or destructive git commands.
- `cross-check-with-gemini.mjs` reviews a git diff, so it needs a git repository with changes to inspect.
- `review-plan-with-gemini.mjs` does not require git.
- If you copy this kit into a brand-new folder, initialize git before using diff-based review flows.

## Gemini CLI
- Gemini is optional.
- `/plan-cross-check` and `/gemini-cross-check` fall back to a friendly no-op message when `gemini` is missing or not authenticated.
- Install and authenticate Gemini CLI only if you want cross-model critique.
- Official docs:
  - Authentication: https://google-gemini.github.io/gemini-cli/docs/get-started/authentication.html
  - Commands and headless mode: https://google-gemini.github.io/gemini-cli/docs/cli/commands.html

## Windows and WSL
- The active hook logic lives in `.mjs` files.
- PowerShell and bash wrappers are included only for manual script runs.
- If Claude runs inside WSL, install both `node` and optional `gemini` inside WSL too.
- Hook commands in `.claude/settings.json` resolve paths from `CLAUDE_PROJECT_DIR` inside Node so they are not tied to the current working directory or shell syntax.

## Notes
- `.next/logs/next-development.log` is optional. The post-edit hook reads it only if it exists.
- Memory files are starter templates. Replace the example bullets with real project facts early.
