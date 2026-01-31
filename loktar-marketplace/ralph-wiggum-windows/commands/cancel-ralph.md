---
description: Cancel an active Ralph Wiggum loop
allowed-tools: [
  "Bash(powershell.exe -Command \"Test-Path .claude/ralph-loop.local.md\")",
  "Bash(powershell.exe -Command \"Remove-Item .claude/ralph-loop.local.md -Force\")",
  "Read(.claude/ralph-loop.local.md)"
]
---

# Cancel Ralph Loop

Cancel the currently active Ralph Wiggum loop.

## Instructions

1. First, check if a ralph loop is active by testing if `.claude/ralph-loop.local.md` exists
2. If it exists, read it to show the user what loop was running
3. Remove the state file to cancel the loop
4. Confirm the cancellation to the user

## Example Response

If active:
```
Ralph loop cancelled!
The loop was on iteration X with prompt: "..."
```

If not active:
```
No active Ralph loop found.
```
