# Claude Next 16.2 Kit

Reusable Claude Code kit for Next.js 16.2-style projects.

## 한국어 사용법

이 키트는 `복잡한 보조 명령을 많이 외우지 않고`, 아래 4개 흐름 중심으로 쓰도록 정리한 버전입니다.

기본 원칙:
- 큰 작업과 기능 작업은 Claude가 먼저 plan을 만듭니다.
- plan을 보여준 뒤, `바로 진행`할지 `/plan-cross-check`를 먼저 할지 한 번만 묻습니다.
- 선택이 끝나면 Claude가 구현, 검증, 결과 보고까지 이어서 진행합니다.
- 꼭 slash command를 정확히 안 써도 됩니다. 자연어로 말해도 대응되는 흐름을 타도록 설명을 넣어뒀습니다.
- `plans`는 작업 시작 시 자동으로 채워지고, `memory`는 비어 있으면 처음에 seed하고 이후 바뀐 durable fact만 업데이트합니다.

### 1. 큰 작업 시작

입력:

```text
/start
[작업 요구사항]
```

동작:
1. 현재 TODO / memory / Next 16.2 참고사항을 읽고 맥락을 정리합니다.
2. 작업 plan을 만듭니다.
3. plan을 채팅에 보여줍니다.
4. `이 plan으로 바로 진행할까요, 아니면 /plan-cross-check를 먼저 돌릴까요?` 라고 묻습니다.
5. 사용자가 선택하면 Claude가 작업을 진행합니다.
6. 작업 후 관련 검증을 실행합니다.
7. 필요하면 `memory`와 `TODO`를 실제 사실로 초기 채우거나 갱신합니다.
8. 변경 내용, 검증 결과, memory 업데이트 여부, 남은 리스크를 알려줍니다.

이 흐름은 `새 세션`, `재개 작업`, `범위가 큰 기능`, `여러 파일을 건드리는 작업`에 적합합니다.

### 2. 일반 기능 작업

입력:

```text
/feature
[요구사항]
```

동작:
1. 요구사항을 바탕으로 짧고 실무적인 plan을 만듭니다.
2. plan을 먼저 보여줍니다.
3. `바로 진행`할지 `/plan-cross-check`를 먼저 할지 묻습니다.
4. 사용자가 선택하면 Claude가 구현을 진행합니다.
5. 구현 후 lint 중심으로 검증하고, 필요 시 더 좁은 회귀 확인을 합니다.
6. 필요하면 `memory`와 `TODO`를 실제 사실로 초기 채우거나 갱신합니다.
7. 변경 파일, 검증 결과, memory 업데이트 여부, 남은 리스크를 알려줍니다.

이 흐름은 대부분의 기능 추가, UI 수정, 동작 변경에 기본값으로 쓰면 됩니다.

### 3. 디버깅

입력:

```text
/debug
[무엇이 안 되는지]
```

동작:
1. 증상을 다시 정리합니다.
2. 로그와 재현 경로를 봅니다.
3. 원인을 좁힙니다.
4. 가장 작은 수정으로 고칩니다.
5. 관련 검증을 다시 돌립니다.
6. 원인, 수정 내용, 검증 결과, 남은 리스크를 알려줍니다.

### 4. 리뷰

입력:

```text
/review
[무엇을 리뷰할지]
```

동작:
1. 기본적으로 read-only로 봅니다.
2. findings first 방식으로 리뷰합니다.
3. 버그, 회귀, App Router, async API, server/client boundary, validation 누락을 우선 봅니다.
4. 필요한 경우에만 open question이나 testing gap을 덧붙입니다.

## 꼭 기억할 것

- `/start`는 무조건이 아니라 `큰 작업 시작`이나 `재개 세션`용입니다.
- 작은 작업은 바로 `/feature`로 시작해도 됩니다.
- `/plan-cross-check`는 선택사항입니다.
- 복잡한 helper command를 직접 고를 필요 없이, 기본적으로는 위 4개만 쓰면 됩니다.
- `memory`는 placeholder 상태면 첫 `/start`나 `/feature`에서 seed되고, 이후에는 바뀐 durable fact만 갱신됩니다.
- 예:
  - "큰 작업 시작해줘" -> `/start`
  - "이 기능 추가해줘" -> `/feature`
  - "이거 안돼" -> `/debug`
  - "이거 리뷰해줘" -> `/review`

## 프로젝트에 넣는 방법

1. 이 저장소의 파일을 실제 프로젝트 루트에 복사합니다.
2. Claude Code를 그 프로젝트 루트에서 엽니다.
3. 필요하면 `git init` 또는 기존 git 저장소 안에서 사용합니다.

## Requirements

- Node.js 20+ in the environment where Claude Code runs
- Claude Code hooks enabled via `.claude/settings.json`
- A git repository is strongly recommended

## Git expectations

- `guard-command.mjs` blocks broad or destructive git commands.
- `review-plan-with-gemini.mjs` does not require git.
- If you copy this kit into a brand-new folder, initialize git before using diff-based review flows.

## Windows and WSL

- All hook and script logic lives in `.mjs` files under `.claude/`.
- If Claude runs inside WSL, install `node` inside WSL too.
- If you want `/plan-cross-check`, install and authenticate `gemini` in the same environment where Claude runs.

## English note

Use the Korean section above as the canonical workflow.

Short version:
- Large task: `/start` -> plan -> ask whether to run `/plan-cross-check` or implement now -> implement -> validate -> report
- Feature task: `/feature` -> plan -> ask whether to run `/plan-cross-check` or implement now -> implement -> validate -> report
- Bug: `/debug`
- Review: `/review`
