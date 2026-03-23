# Decisions

Record decisions as short dated entries. Keep rationale and consequence, not a full transcript.

## Template
- 2026-03-23: Decision title
  - Context:
  - Decision:
  - Why:
  - Follow-up:

## Seed entries
- 2026-03-23: Use Node-based hooks for this kit
  - Context: The kit must work in both Windows PowerShell and WSL bash environments.
  - Decision: Keep active hooks in `.mjs` and use `.ps1` / `.sh` only as manual wrappers.
  - Why: One implementation path is easier to maintain and easier to smoke-test.
  - Follow-up: Validate the wrappers separately in each shell.

- 2026-03-23: Keep automatic validation lightweight
  - Context: Different projects have different test and build stability.
  - Decision: Run `lint` automatically by default and keep `test` / `build` opt-in.
  - Why: Fast feedback is useful, but blocking on unstable builds creates noise.
  - Follow-up: Promote broader checks only after a project proves stable.
