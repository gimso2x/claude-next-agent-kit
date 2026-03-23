import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const parsed = {
    cwd: process.cwd(),
    json: false,
    lint: false,
    test: false,
    build: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--cwd" && argv[index + 1]) {
      parsed.cwd = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg === "--lint") {
      parsed.lint = true;
    } else if (arg === "--test") {
      parsed.test = true;
    } else if (arg === "--build") {
      parsed.build = true;
    } else if (arg === "--all") {
      parsed.lint = true;
      parsed.test = true;
      parsed.build = true;
    }
  }

  if (!parsed.lint && !parsed.test && !parsed.build) {
    parsed.lint = true;
  }

  return parsed;
}

function commandExists(command) {
  const result = spawnSync(command, ["--version"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  return !result.error && result.status === 0;
}

function pickManager() {
  const candidates = ["pnpm", "npm", "bun"];
  for (const candidate of candidates) {
    if (commandExists(candidate)) {
      return candidate;
    }
  }
  return null;
}

function tailText(text, maxLines = 18) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-maxLines)
    .join("\n");
}

function runScript(manager, scriptName, cwd) {
  const command =
    manager === "npm" ? `npm run ${scriptName}` : `${manager} ${scriptName}`;
  const start = Date.now();
  const result = spawnSync(command, {
    cwd,
    shell: true,
    encoding: "utf8"
  });

  return {
    script: scriptName,
    command,
    durationMs: Date.now() - start,
    status: result.status === 0 ? "passed" : "failed",
    outputTail: tailText(`${result.stdout || ""}\n${result.stderr || ""}`.trim())
  };
}

function emit(output, asJson) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(output)}\n`);
    return;
  }

  process.stdout.write(`${output.summary}\n`);
  for (const result of output.results) {
    process.stdout.write(
      `- ${result.script}: ${result.status} (${result.durationMs}ms) via ${result.command}\n`
    );
    if (result.outputTail) {
      process.stdout.write(`${result.outputTail}\n`);
    }
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  const packageJsonPath = path.join(options.cwd, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    emit(
      {
        cwd: options.cwd,
        manager: null,
        requested: [],
        ran: [],
        results: [],
        status: "noop",
        summary: "No package.json found. Skipped project checks."
      },
      options.json
    );
    process.exit(0);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const scripts = packageJson.scripts || {};
  const requested = [
    options.lint ? "lint" : null,
    options.test ? "test" : null,
    options.build ? "build" : null
  ].filter(Boolean);

  const manager = pickManager();
  if (!manager) {
    emit(
      {
        cwd: options.cwd,
        manager: null,
        requested,
        ran: [],
        results: [],
        status: "noop",
        summary: "No supported package manager found. Skipped project checks."
      },
      options.json
    );
    process.exit(0);
  }

  const runnable = requested.filter((scriptName) => typeof scripts[scriptName] === "string");
  if (runnable.length === 0) {
    emit(
      {
        cwd: options.cwd,
        manager,
        requested,
        ran: [],
        results: [],
        status: "noop",
        summary: "Requested checks are not defined in package.json. Skipped project checks."
      },
      options.json
    );
    process.exit(0);
  }

  const results = runnable.map((scriptName) => runScript(manager, scriptName, options.cwd));
  const failed = results.filter((result) => result.status === "failed");
  const summary =
    failed.length === 0
      ? `${runnable.join(", ")} passed with ${manager}.`
      : `${failed.map((item) => item.script).join(", ")} failed with ${manager}.`;

  emit(
    {
      cwd: options.cwd,
      manager,
      requested,
      ran: runnable,
      results,
      status: failed.length === 0 ? "passed" : "failed",
      summary
    },
    options.json
  );
  process.exit(0);
} catch (error) {
  emit(
    {
      cwd: process.cwd(),
      manager: null,
      requested: [],
      ran: [],
      results: [],
      status: "failed",
      summary: `Project checks failed before execution: ${error.message}`
    },
    process.argv.includes("--json")
  );
  process.exit(1);
}
