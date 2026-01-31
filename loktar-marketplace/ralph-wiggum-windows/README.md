# Ralph Wiggum Plugin - Windows PowerShell Version

A Claude Code plugin that enables autonomous loop processing for long-running tasks on Windows.

## Requirements

- **Windows PowerShell 5.1+** or **PowerShell 7+** - Either version works
- **Claude Code** with plugin support

To check your PowerShell version:
```powershell
$PSVersionTable.PSVersion
```

## Installation

### Option 1: Symlink (Recommended for Development)

```powershell
# Create junction link to Claude plugins folder
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\plugins\ralph-wiggum" -Target "D:\dev\ralph-wiggum-windows"
```

### Option 2: Copy

```powershell
# Copy plugin to Claude plugins folder
Copy-Item -Recurse "D:\dev\ralph-wiggum-windows" "$env:USERPROFILE\.claude\plugins\ralph-wiggum"
```

### Verify Installation

```powershell
claude --plugins
```

You should see `ralph-wiggum` listed.

## Usage

### Start a Loop

```
/ralph-loop <prompt>
```

Examples:
```
/ralph-loop Fix all TypeScript errors in src/
/ralph-loop -m 5 Refactor the authentication module
/ralph-loop -p "DONE" Complete all items in TODO.md
```

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `-MaxIterations` | `-m` | Maximum number of iterations (0 = unlimited) |
| `-CompletionPromise` | `-p` | Text that signals completion when wrapped in `<promise>` tags |
| `-Help` | `-h` | Show help information |

### Cancel a Loop

```
/cancel-ralph
```

### Get Help

```
/help
```

## How It Works

1. `/ralph-loop` creates a state file at `.claude/ralph-loop.local.md`
2. When Claude attempts to stop, the stop hook intercepts the event
3. The hook checks for completion conditions:
   - Max iterations reached
   - Completion promise detected in output
4. If not complete, it blocks the stop and prompts Claude to continue
5. The iteration counter increments and the loop continues

## Completion Conditions

The loop terminates when ANY of these conditions are met:

1. **Max Iterations**: Set with `-m N` - stops after N iterations
2. **Completion Promise**: Set with `-p TEXT` - stops when Claude outputs `<promise>TEXT</promise>`
3. **Manual Cancel**: User runs `/cancel-ralph`

## State File Format

The state file (`.claude/ralph-loop.local.md`) uses YAML frontmatter:

```yaml
---
active: true
iteration: 1
max_iterations: 0
completion_promise: "DONE"
started_at: "2024-01-15T10:30:00.000Z"
---

Your prompt text here
```

## Troubleshooting

### Plugin Not Loading

1. Verify PowerShell is available: `powershell.exe -Command "$PSVersionTable.PSVersion"`
2. Check plugin location: `dir "$env:USERPROFILE\.claude\plugins\ralph-wiggum"`
3. Verify hooks.json references powershell.exe correctly

### Loop Not Continuing

1. Check state file exists: `Test-Path .claude/ralph-loop.local.md`
2. Verify state file content: `Get-Content .claude/ralph-loop.local.md`
3. Check hook is executing: Look for PowerShell process during stop

### Execution Policy Errors

If you see execution policy errors, the plugin uses `-ExecutionPolicy Bypass` flag, but you may need to adjust your system policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## File Structure

```
ralph-wiggum-windows/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata
├── commands/
│   ├── cancel-ralph.md      # Cancel command
│   ├── help.md              # Help command
│   └── ralph-loop.md        # Main loop command
├── hooks/
│   ├── hooks.json           # Hook configuration
│   └── stop-hook.ps1        # Stop event handler
├── scripts/
│   └── setup-ralph-loop.ps1 # Loop setup script
└── README.md
```

## License

MIT
