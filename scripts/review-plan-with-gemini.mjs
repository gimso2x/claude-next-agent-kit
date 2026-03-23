import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const parsed = {
    cwd: process.cwd(),
    json: false,
    file: null,
    prompt: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cwd" && argv[index + 1]) {
      parsed.cwd = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg === "--file" && argv[index + 1]) {
      parsed.file = path.resolve(parsed.cwd, argv[index + 1]);
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
    "You are reviewing an implementation plan for a Next.js 16.2-style project before coding starts.",
    "Review the plan from stdin.",
    "Focus on missing implementation steps, risky sequencing, hidden architecture assumptions, validation gaps, proxy.ts impact, async request API pitfalls, server/client boundary mistakes, migration risk, and rollback or observability blind spots.",
    "Respond in Korean.",
    "Format:",
    "1. Strong points.",
    "2. Risks and gaps, ordered by severity.",
    "3. Plan hardening suggestions.",
    '4. If the plan is already solid, say "계획 품질 양호".',
    "Keep the answer concise and actionable."
  ].join("\n");
}

function readPlanText(options) {
  const explicitFile = options.file;
  const defaultFile = path.join(options.cwd, ".claude", "plans", "current-plan.md");

  if (explicitFile) {
    const dir = path.dirname(explicitFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(explicitFile)) {
      throw new Error(`Plan file not found: ${explicitFile}`);
    }
    return {
      source: explicitFile,
      text: fs.readFileSync(explicitFile, "utf8")
    };
  }

  if (fs.existsSync(defaultFile)) {
    return {
      source: defaultFile,
      text: fs.readFileSync(defaultFile, "utf8")
    };
  }

  const stdinText = fs.readFileSync(0, "utf8");
  if (stdinText.trim()) {
    return {
      source: "stdin",
      text: stdinText
    };
  }

  throw new Error(
    "No plan input found. Pass --file .claude/plans/current-plan.md or pipe the plan via stdin."
  );
}

try {
  const options = parseArgs(process.argv.slice(2));

  if (!commandExists("gemini")) {
    emit(
      {
        cwd: options.cwd,
        status: "noop",
        summary: "Gemini CLI is not available. Install and authenticate Gemini CLI, then rerun the plan review.",
        response: ""
      },
      options.json
    );
    process.exit(0);
  }

  const plan = readPlanText(options);
  const prompt = buildPrompt(options.prompt);
  const geminiInput = `${prompt}\n\nPlan to review:\n\n${plan.text.trim()}\n`;
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
      source: plan.source,
      status: "passed",
      summary: "Gemini plan review completed.",
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
      summary: `Gemini plan review failed before execution: ${error.message}`,
      response: ""
    },
    process.argv.includes("--json")
  );
  process.exit(1);
}
