@AGENTS.md

# Claude Navigation

Use this file as the lazy-loading entrypoint.

Read only what the current task needs:
- `.claude/TODO.md` for active work and handoffs
- `.claude/memory/architecture.md` for routing, boundaries, and system shape
- `.claude/memory/domain.md` for product terms, flows, and ownership
- `.claude/memory/decisions.md` for prior tradeoffs and dated decisions
- `.claude/references/next16.2-agent-notes.md` for Next.js 16.2-specific guidance

Prefer these slash skills for real work:
- `/session-bootstrap`
- `/feature-loop`
- `/debug-loop`
- `/plan-cross-check`
- `/review-loop`
- `/gemini-cross-check`
- `/memory-sync`
- `/parallel-worktree`

Useful project commands:
- `/dev-docs`
- `/dev-docs-update`
- `/route-smoke`
- `/verify-change`

Useful read-only agents:
- `next-reviewer`
- `log-investigator`
- `plan-reviewer`
- `code-architecture-reviewer`

Working habits:
- Start multi-file or high-risk work in Plan Mode first
- For risky work, stop after the first draft plan and run `/plan-cross-check` before implementation
- Use `/verify-change` before claiming work is done
- Use `/review-loop` for the deeper pre-merge review, especially after `/verify-change` flags risk
- Use `/clear` between major phases and `/compact` before context gets crowded
- Keep `/mcp` lean and disable unused servers
- Offload high-volume tasks to local scripts and summarize results back into the chat
