---
description: Create a new git worktree with TypeScript project setup
allowed-tools: [
  "Bash(node \"${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs\" *)"
]
---

# Create Worktree

Creates a new git worktree alongside the current repository with:
- New branch (optional, defaults to worktree name)
- Copies all .env files from current directory
- Runs npm install
- Launches Claude in a new terminal window

## Usage

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs" <worktree-name> [branch-name]
```

## Parameters
- `worktree-name`: Name for the worktree directory (required)
- `branch-name`: Name for the new branch (optional, defaults to worktree-name)

## Example

To create a worktree named "feature-auth" with a branch called "feature/authentication":

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs" feature-auth feature/authentication
```
