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

function tokenize(command) {
  return command.match(/"[^"]*"|'[^']*'|\S+/g) || [];
}

function hasUnquotedGroupedPath(command) {
  if (!/\bgit\s+(add|checkout|restore)\b/.test(command)) {
    return false;
  }

  return tokenize(command).some((token) => {
    const trimmed = token.trim();
    const quoted =
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"));

    if (quoted) {
      return false;
    }

    return /[\\/][^"']*\([^"']+\)[^"']*/.test(trimmed);
  });
}

function looksLikeEnvMutation(command) {
  if (!/\.env([\w.-]*)?/i.test(command)) {
    return false;
  }

  return (
    />{1,2}/.test(command) ||
    /\b(Set-Content|Add-Content|Out-File|tee|sed\s+-i|perl\s+-pi|python\b|node\b).*\.env/i.test(command)
  );
}

try {
  const raw = await readStdin();
  const input = raw ? JSON.parse(raw) : {};
  const command = input.tool_input?.command || "";

  if (!command) {
    process.exit(0);
  }

  if (/\bgit\s+add\s+(?:\.|-A|--all)(?:\s|$)/.test(command)) {
    deny("Do not use broad staging. Stage explicit files only.");
    process.exit(0);
  }

  if (/\bgit\s+reset\s+--hard\b/.test(command)) {
    deny("Do not use destructive resets from Claude.");
    process.exit(0);
  }

  if (/\bgit\s+checkout\s+--\b/.test(command) || /\bgit\s+restore\b/.test(command)) {
    deny("Do not discard file changes unless the user explicitly asked for it.");
    process.exit(0);
  }

  if (/\bgit\s+clean\b[^\n]*\b-f\b[^\n]*\b-d\b/.test(command)) {
    deny("Do not run broad git clean commands from Claude.");
    process.exit(0);
  }

  if (
    /\brm\s+-rf\s+(\.|\*|\/)/.test(command) ||
    /\b(del|erase)\b[^\n]*\/[sq]/i.test(command) ||
    /\brmdir\b[^\n]*\/s[^\n]*\/q/i.test(command) ||
    /\bRemove-Item\b[^\n]*-Recurse[^\n]*-Force/i.test(command)
  ) {
    deny("Do not run broad destructive delete commands from Claude.");
    process.exit(0);
  }

  if (looksLikeEnvMutation(command)) {
    deny("Do not edit .env files through shell commands. Use explicit local setup instead.");
    process.exit(0);
  }

  if (hasUnquotedGroupedPath(command)) {
    deny("Quote paths that contain route-group parentheses, especially in git commands.");
    process.exit(0);
  }

  process.exit(0);
} catch (error) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Command guard failed safely: ${error.message}`
      }
    })
  );
  process.exit(0);
}
