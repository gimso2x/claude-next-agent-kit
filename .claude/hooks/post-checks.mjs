import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input.trim();
}

function normalize(filePath, cwd) {
  const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(cwd, filePath);
  return resolved.replace(/\\/g, "/").toLowerCase();
}

function takeTail(text, lineCount = 20) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-lineCount)
    .join("\n");
}

function shouldCheck(filePath) {
  return (
    /\.(cjs|cts|css|js|json|jsx|mjs|mts|scss|ts|tsx)$/.test(filePath) ||
    /(^|\/)(next\.config|package\.json|tsconfig)\b/.test(filePath)
  );
}

try {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};
  const cwd = input.cwd || process.cwd();
  const rawPath = input.tool_input?.file_path || "";

  if (!rawPath) {
    process.exit(0);
  }

  const normalizedPath = normalize(rawPath, cwd);
  if (!shouldCheck(normalizedPath)) {
    process.exit(0);
  }

  const packageJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    process.exit(0);
  }

  const runnerPath = path.join(cwd, ".claude", "scripts", "run-project-checks.mjs");
  if (!fs.existsSync(runnerPath)) {
    process.exit(0);
  }

  const result = spawnSync(
    process.execPath,
    [runnerPath, "--json", "--lint", "--cwd", cwd],
    {
      cwd,
      encoding: "utf8"
    }
  );

  if (result.status !== 0 || !result.stdout.trim()) {
    process.exit(0);
  }

  const parsed = JSON.parse(result.stdout);
  if (parsed.status === "noop") {
    process.exit(0);
  }

  let additionalContext = `Validation summary: ${parsed.summary}`;

  if (parsed.status === "failed") {
    const devLogPath = path.join(cwd, ".next", "logs", "next-development.log");
    if (fs.existsSync(devLogPath)) {
      const logTail = takeTail(fs.readFileSync(devLogPath, "utf8"));
      if (logTail) {
        additionalContext += `\n\nRecent .next/logs/next-development.log tail:\n${logTail}`;
      }
    }
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext
      }
    })
  );
} catch {
  process.exit(0);
}
