# Domain Memory

Use this file as the local second brain for business language and product flow.

## Suggested sections
- Glossary: durable terms that appear in tickets, APIs, and UI copy
- Core flows: happy path, admin path, failure path
- Ownership: which team or subsystem owns what
- Constraints: legal, compliance, or product rules that change implementation choices

## Starter example
- Glossary:
  - Tenant: end-user who submits a claim
  - Landlord: account that reviews dispute evidence
- Core flows:
  - User submits form -> server validates -> route handler forwards -> UI shows result
- Ownership:
  - Frontend owns UI state and validation hints
  - Backend owns scoring, persistence, and audit logs
- Constraints:
  - PII must not be logged in client-visible output

## WAT framing
- Workflows: repeatable coding, debugging, and review loops
- Agents: built-in or custom subagents used for isolation and parallel work
- Tools: hooks, scripts, MCP servers, browser tooling, and test commands

Replace the starter example with real product language early, or Claude will keep reasoning from placeholders.
