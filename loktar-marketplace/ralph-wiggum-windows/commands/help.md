---
description: Show help for Ralph Wiggum plugin
---

# Ralph Wiggum Plugin Help

Ralph Wiggum is a loop control plugin that allows Claude to continue working on tasks automatically until completion conditions are met.

## Commands

### /ralph-loop [options] <prompt>

Start a loop that continues until completion.

**Options:**
- `-m, -MaxIterations <n>`: Maximum iterations (0 = unlimited)
- `-p, -CompletionPromise <text>`: Stop when `<promise>text</promise>` is output
- `-h, -Help`: Show help

**Examples:**
```
/ralph-loop Fix all TypeScript errors in this project
/ralph-loop -m 10 Refactor the authentication module
/ralph-loop -p "COMPLETE" Implement the feature described in TODO.md
```

### /cancel-ralph

Stop the currently active Ralph loop immediately.

## How It Works

1. `/ralph-loop` creates a state file at `.claude/ralph-loop.local.md`
2. A stop hook intercepts when Claude tries to stop
3. The hook checks completion conditions (max iterations, promise tags)
4. If not complete, it blocks the stop and prompts Claude to continue
5. The loop continues until a condition is met or `/cancel-ralph` is run

## Completion Conditions

The loop stops when ANY of these occur:

1. **Max iterations reached**: If `-m N` was set and N iterations complete
2. **Promise detected**: If `-p TEXT` was set and Claude outputs `<promise>TEXT</promise>`
3. **Manual cancel**: User runs `/cancel-ralph`

## Tips

- Use `-m` to limit iterations when exploring or uncertain about scope
- Use `-p` with a specific promise for deterministic completion
- The promise tag must match exactly (case-sensitive)
- Check `.claude/ralph-loop.local.md` to see current loop state
