import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const parsed = {
    cwd: process.cwd(),
    json: false,
    staged: false,
    base: null,
    prompt: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cwd" && argv[index + 1]) {
      parsed.cwd = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg === "--staged") {
      parsed.staged = true;
    } else if (arg === "--base" && argv[index + 1]) {
      parsed.base = argv[index + 1];
      index += 1;
    } else if (arg === "--prompt" && argv[index + 1]) {
      parsed.prompt = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function runProcess(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 8 * 1024 * 1024,
    ...options
  });
}

function commandExists(command) {
  const result = runProcess(command, ["--version"]);
  return !result.error && result.status === 0;
}

function git(args, cwd) {
  return runProcess("git", args, { cwd });
}

function emit(output, asJson) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(output)}\n`);
    return;
  }

  process.stdout.write(`${output.summary}\n`);
  if (output.response) {
    process.stdout.write(`${output.response}\n`);
  }
}

function buildPrompt(customPrompt) {
  if (customPrompt) {
    return customPrompt;
  }

  return [
    "You are providing a second-opinion code review for a Next.js 16.2-style project.",
    "Review the git diff from stdin.",
    "Focus on bugs, regressions, security issues, App Router convention mistakes, proxy.ts side effects, async request API misuse, hydration or navigation risks, unnecessary client expansion, and missing validation.",
    "Respond in Korean.",
    "Format:",
    "1. Findings first, ordered by severity.",
    "2. Keep each finding concrete with file/path impact and suggested fix.",
    '3. If no material issues are found, say "중요한 문제 없음".',
    "4. Keep the answer concise."
  ].join("\n");
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (!commandExists("git")) {
    emit(
      {
        cwd: options.cwd,
        status: "noop",
        summary: "Git is not available. Skipped Gemini cross-check.",
        response: ""
      },
      options.json
    );
    process.exit(0);
  }

  const repoCheck = git(["rev-parse", "--show-toplevel"], options.cwd);
  if (repoCheck.status !== 0) {
    emit(
      {
        cwd: options.cwd,
        status: "noop",
        summary: "Current directory is not a git repository. Skipped Gemini cross-check.",
        response: ""
      },
      options.json
    );
    process.exit(0);
  }

  if (!commandExists("gemini")) {
    emit(
      {
        cwd: options.cwd,
        status: "noop",
        summary: "Gemini CLI is not available. Install and authenticate Gemini CLI, then rerun the cross-check.",
        response: ""
      },
      options.json
    );
    process.exit(0);
  }

  const diffArgs = options.base
    ? ["diff", "--no-ext-diff", "--unified=3", `${options.base}...HEAD`]
    : options.staged
      ? ["diff", "--cached", "--no-ext-diff", "--unified=3"]
      : ["diff", "--no-ext-diff", "--unified=3"];
  const diffResult = git(diffArgs, options.cwd);
  const statusResult = git(["status", "--short"], options.cwd);

  if (diffResult.status !== 0) {
    emit(
      {
        cwd: options.cwd,
        status: "failed",
        summary: `Failed to collect git diff: ${(diffResult.stderr || diffResult.stdout || "").trim()}`,
        response: ""
      },
      options.json
    );
    process.exit(1);
  }

  const diffText = (diffResult.stdout || "").trim();
  if (!diffText) {
    emit(
      {
        cwd: options.cwd,
        status: "noop",
        summary: "No diff found for Gemini cross-check.",
        response: (statusResult.stdout || "").trim()
      },
      options.json
    );
    process.exit(0);
  }

  const prompt = buildPrompt(options.prompt);
  const geminiInput = `${prompt}\n\nGit diff to review:\n\n${diffText}\n`;
  const geminiResult = runProcess("gemini", ["--output-format", "json"], {
    cwd: options.cwd,
    input: geminiInput
  });

  if (geminiResult.status !== 0) {
    emit(
      {
        cwd: options.cwd,
        status: "failed",
        summary: `Gemini CLI failed: ${(geminiResult.stderr || geminiResult.stdout || "").trim()}`,
        response: ""
      },
      options.json
    );
    process.exit(1);
  }

  const parsed = JSON.parse(geminiResult.stdout || "{}");
  const response = typeof parsed.response === "string" ? parsed.response.trim() : "";
  emit(
    {
      cwd: options.cwd,
      status: "passed",
      summary: "Gemini cross-check completed.",
      response,
      stats: parsed.stats || {}
    },
    options.json
  );
  process.exit(0);
} catch (error) {
  emit(
    {
      cwd: process.cwd(),
      status: "failed",
      summary: `Gemini cross-check failed before execution: ${error.message}`,
      response: ""
    },
    process.argv.includes("--json")
  );
  process.exit(1);
}
