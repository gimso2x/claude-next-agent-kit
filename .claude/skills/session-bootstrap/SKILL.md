---
name: session-bootstrap
description: Prepare a fresh Claude coding session for a Next.js 16.2-style project. Use when starting new work, resuming after /clear, or when Claude needs to rebuild context from TODO, memory, and current workflow rules.
---

# Session Bootstrap

Rebuild context without loading the whole project into the conversation.
Treat this as the manual, fuller companion to the lightweight `SessionStart` hook.

## Read first
- `.claude/TODO.md`
- `.claude/memory/architecture.md`
- `.claude/memory/domain.md`
- `.claude/memory/decisions.md`
- `.claude/references/next16.2-agent-notes.md`

## Workflow
1. Restate the active goal and success criteria in one short paragraph.
2. Summarize `Now`, `Next`, and `Blocked` from `.claude/TODO.md`.
3. Pull only the architecture and domain facts that matter for the current task.
4. Surface recent decisions that could constrain implementation.
5. Recommend the next working mode:
   - Plan Mode for multi-file, risky, or unclear work
   - direct execution for small, local, low-risk tasks
6. Pick the best follow-on skill:
   - `/plan-cross-check` for plan hardening before implementation
   - `/feature-loop`
   - `/debug-loop`
   - `/review-loop`
   - `/memory-sync`
   - `/parallel-worktree`

## Working habits to reinforce
- Use `/clear` between major phases.
- Use `/compact` before context gets crowded.
- Disable unused MCP servers with `/mcp`.
- Keep one primary feature or bug per session when possible.
- Offload high-volume output to local scripts and summarize the result back into chat.
