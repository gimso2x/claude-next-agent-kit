# Next.js 16.2 Agent Notes

Use this reference when you need the fast, high-signal version of the Next.js 16.2 agent guidance.

## Source baseline
- Next.js 16.2 release: March 18, 2026
- AI Coding Agents guide: updated March 20, 2026

## Working rules
- Prefer installed docs in `node_modules/next/dist/docs/` over memory.
- Treat `proxy.ts` as the v16 boundary name instead of `middleware.ts`.
- Remember that `params`, `searchParams`, `cookies()`, and `headers()` are async APIs in modern Next.
- Keep App Router file conventions front-of-mind before changing routing, error boundaries, or metadata.

## Debugging notes
- Browser log forwarding can push client logs into the terminal during development.
- `next-browser` can help with browser-aware debugging when it is available.
- Server Function logging now appears in the dev terminal.
- Hydration mismatch overlays now show a clearer client-versus-server diff.
- Use `next dev --inspect` during development and `next start --inspect` for production-style debugging.

## Review checklist
- Did the change keep the correct server/client boundary?
- Did the route still fit App Router conventions?
- Did the change touch `proxy.ts`, async request APIs, or route handlers safely?
- Did the debugging path include raw logs instead of paraphrased symptoms?
