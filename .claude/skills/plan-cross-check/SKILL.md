---
name: plan-cross-check
description: Review the current implementation plan with Gemini CLI before coding starts. Trigger whenever the user says "계획 검토해줘", "plan check", "Gemini로 plan 봐줘", "cross-check 해줘", or uses `/plan-cross-check`.
---

# Plan Cross Check

Use this workflow after the first draft plan and before implementation.

## Read first
- `.claude/references/next16.2-agent-notes.md`
- Installed Next.js docs from `node_modules/next/dist/docs/` when available

## Workflow
1. Read `.claude/plans/current-plan.md`. If it is missing, create it from the current chat plan first.
2. Make sure the plan is concrete enough to review:
   - Goal
   - Success Criteria
   - Likely Files or Surfaces
   - Execution Steps
   - Risks
   - Validation
3. Run `node .claude/scripts/review-plan-with-gemini.mjs --json --file .claude/plans/current-plan.md`.
4. Summarize only the material critique:
   - missing steps
   - hidden risks
   - validation gaps
   - sequencing problems
5. Update `.claude/plans/current-plan.md`.
6. Return the hardened plan in a compact form so implementation can start immediately.

## Gemini 없을 때 fallback
If `gemini` is missing or auth is not configured:
1. Report that Gemini is unavailable.
2. Claude가 직접 plan을 아래 관점에서 자체 검증:
   - 빠진 단계가 없는지
   - 실행 순서가 안전한지
   - 검증 계획이 구체적인지
   - 숨겨진 의존성이나 리스크가 없는지
3. 발견한 문제를 plan에 반영하고 계속 진행.

## Notes
- Keep the critique practical. Do not expand the task just because more is theoretically possible.
