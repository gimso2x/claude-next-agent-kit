import fs from "node:fs";
import path from "node:path";

async function readStdin() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input.trim();
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return "";
  }
}

function takeLines(text, count) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(0, count)
    .join("\n");
}

function takeBullets(text, count) {
  return text
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .slice(0, count)
    .join("\n");
}

function buildContext(projectRoot) {
  const todoPath = path.join(projectRoot, ".claude", "TODO.md");
  const architecturePath = path.join(projectRoot, ".claude", "memory", "architecture.md");
  const domainPath = path.join(projectRoot, ".claude", "memory", "domain.md");
  const decisionsPath = path.join(projectRoot, ".claude", "memory", "decisions.md");

  const todo = takeLines(readText(todoPath), 16);
  const architecture = takeLines(readText(architecturePath), 18);
  const domain = takeLines(readText(domainPath), 18);
  const decisions = takeBullets(readText(decisionsPath), 8);

  const sections = [
    `Current date: ${new Date().toISOString().slice(0, 10)}.`,
    "Session bootstrap reminders:",
    "- Start large or risky work in Plan Mode first.",
    "- Stop after the first draft plan and run /plan-cross-check before risky implementation.",
    "- Use /clear between major phases and /compact before context gets crowded.",
    "- Keep /mcp lean and disable unused servers.",
    "- Prefer local scripts for heavy output, then summarize the result back into chat.",
    "- Use /session-bootstrap when you want a fuller manual context rebuild."
  ];

  if (todo) {
    sections.push("", "TODO snapshot:", todo);
  }

  if (architecture) {
    sections.push("", "Architecture snapshot:", architecture);
  }

  if (domain) {
    sections.push("", "Domain snapshot:", domain);
  }

  if (decisions) {
    sections.push("", "Recent decisions:", decisions);
  }

  return sections.join("\n");
}

try {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};
  const projectRoot = input.cwd || process.cwd();
  const additionalContext = buildContext(projectRoot);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext
      }
    })
  );
} catch (error) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: `Session bootstrap hook failed: ${error.message}`
      }
    })
  );
}
