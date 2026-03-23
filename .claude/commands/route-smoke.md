---
name: route-smoke
description: Build a route-level smoke test checklist from changed files or a target route. Use after route, layout, page, proxy, auth, or navigation changes when you want a compact manual verification plan.
argument-hint: [route, screen, or focus]
---

Create a compact route smoke-test plan.

Workflow:
1. Inspect the current task plus `$ARGUMENTS`.
2. If git is available, inspect changed files to find impacted routes, layouts, route handlers, or `proxy.ts`.
3. If git is not available or the diff is empty, require `$ARGUMENTS` or the current chat request to name the route or screen explicitly.
4. Read only the relevant route files and `.claude/references/next16.2-agent-notes.md`.
5. Build a smoke checklist that covers:
   - entry path and navigation path
   - auth or redirect behavior
   - server-client boundary risks
   - loading, error, and empty states
   - route handler side effects if applicable
   - mobile or responsive checks when UI changed
6. If browser tooling is available, suggest the shortest useful verification flow.
7. If a route seems risky, suggest `/review-loop` or `code-architecture-reviewer`.

Output:
- impacted routes or surfaces
- manual smoke checklist
- highest-risk regression to watch
- if the route could not be inferred confidently, say that clearly
