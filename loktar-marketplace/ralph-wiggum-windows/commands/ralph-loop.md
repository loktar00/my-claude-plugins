---
description: Start a Ralph Wiggum loop that continues until completion
allowed-tools: [
  "Bash(powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.ps1\" *)",
  "Read(.claude/ralph-loop.local.md)"
]
---

# Ralph Loop Command

Start a loop that will continue processing until a completion condition is met.

## Usage

```!
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PLUGIN_ROOT}/scripts/setup-ralph-loop.ps1" $ARGUMENTS
```

After the loop is started, begin working on the prompt. The loop will automatically continue after each response until:

1. Max iterations is reached (if `-m` flag was used)
2. You output `<promise>TEXT</promise>` matching the completion promise (if `-p` flag was used)
3. The user runs `/cancel-ralph`

## Options

- `-m, -MaxIterations <n>`: Set maximum number of iterations
- `-p, -CompletionPromise <text>`: Text to output in `<promise>` tags to signal completion
- `-h, -Help`: Show help information
