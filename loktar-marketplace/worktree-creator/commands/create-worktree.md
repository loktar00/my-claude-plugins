---
description: Create a new git worktree with TypeScript project setup
allowed-tools: [
  "Bash(node \"${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs\")"
]
---

# Create Worktree

Creates a new git worktree in a dedicated worktrees directory with:
- Interactive prompts for branch name and optional custom worktree name
- Random Docker-style naming (e.g., "clever-octopus", "bold-zebra")
- Recursively copies all .env files preserving directory structure
- Runs npm install
- Launches Claude in a new terminal window

## Usage

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs"
```

The script will interactively prompt for:
1. **Branch name** (required) - The git branch to create
2. **Custom worktree name** (optional) - If declined, generates a random name

## Worktree Location

Worktrees are created under `{project-root}-worktrees/`:
```
D:\dev\my-project\              # Original repo
D:\dev\my-project-worktrees\    # Worktrees directory
  ├── clever-octopus\           # Worktree 1
  ├── bold-zebra\               # Worktree 2
  └── feature-auth\             # Worktree 3 (custom name)
```

## .env File Handling

The script recursively finds and copies all `.env*` files from the source repository, preserving their relative paths:
```
Source:                          Destination:
my-project/.env            →     my-project-worktrees/clever-octopus/.env
my-project/apps/api/.env   →     my-project-worktrees/clever-octopus/apps/api/.env
my-project/packages/shared/.env.local → my-project-worktrees/clever-octopus/packages/shared/.env.local
```

## Example

```
> node create-worktree.mjs

Enter branch name: feature/authentication
Use custom worktree name? (y/N): n

Worktree name: clever-octopus
Branch name: feature/authentication
Creating worktree at: D:\dev\my-project-worktrees\clever-octopus

[1/4] Creating git worktree...
[2/4] Copying .env files...
  Copied: .env
  Copied: apps/api/.env
  Copied: packages/shared/.env.local
[3/4] Running npm install...
[4/4] Launching Claude in new terminal...

=== Worktree setup complete ===
Location: D:\dev\my-project-worktrees\clever-octopus
Branch: feature/authentication
```
