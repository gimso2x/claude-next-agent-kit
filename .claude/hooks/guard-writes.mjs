import path from "node:path";

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input.trim();
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason
      }
    })
  );
}

function translateForeignAbsolute(filePath) {
  const trimmed = `${filePath}`.trim();

  const wslMatch = trimmed.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (wslMatch) {
    return `${wslMatch[1].toUpperCase()}:/${wslMatch[2]}`;
  }

  const msysMatch = trimmed.match(/^\/([a-zA-Z])\/(.*)$/);
  if (msysMatch) {
    return `${msysMatch[1].toUpperCase()}:/${msysMatch[2]}`;
  }

  return trimmed;
}

function normalize(filePath, cwd) {
  const translatedPath = translateForeignAbsolute(filePath);
  const translatedCwd = translateForeignAbsolute(cwd);
  const isWindowsAbsolute = /^[a-zA-Z]:[\\/]/.test(translatedPath);
  const isPosixAbsolute = translatedPath.startsWith("/");
  const resolved =
    isWindowsAbsolute || isPosixAbsolute
      ? translatedPath
      : /^[a-zA-Z]:[\\/]/.test(translatedCwd)
        ? path.win32.resolve(translatedCwd, translatedPath)
        : path.resolve(translatedCwd, translatedPath);
  return resolved.replace(/\\/g, "/").toLowerCase();
}

function collectPaths(value, results = [], keyName = "") {
  if (typeof value === "string" && /(path|file)/i.test(keyName)) {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectPaths(item, results, keyName);
    }
    return results;
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      collectPaths(childValue, results, childKey);
    }
  }

  return results;
}

function isSensitive(normalizedPath) {
  return (
    /(^|\/)\.env[^/]*$/.test(normalizedPath) ||
    /(^|\/)\.next(\/|$)/.test(normalizedPath) ||
    /(^|\/)node_modules(\/|$)/.test(normalizedPath) ||
    /(^|\/)\.git(\/|$)/.test(normalizedPath) ||
    /(^|\/)(certificates|secrets)(\/|$)/.test(normalizedPath) ||
    /(^|\/)(dist|build|coverage)(\/|$)/.test(normalizedPath) ||
    /\.(pem|key|p12)$/i.test(normalizedPath)
  );
}

try {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};
  const cwd = input.cwd || process.cwd();
  const candidatePaths = collectPaths(input.tool_input || {}, []);

  for (const candidate of candidatePaths) {
    const normalizedPath = normalize(candidate, cwd);
    if (isSensitive(normalizedPath)) {
      deny(`Editing protected path is blocked: ${candidate}`);
      process.exit(0);
    }
  }

  process.exit(0);
} catch (error) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Write guard failed safely: ${error.message}`
      }
    })
  );
  process.exit(0);
}
