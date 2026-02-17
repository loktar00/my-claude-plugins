# Worktree Creator

A Claude Code plugin that automates git worktree creation for TypeScript projects with branch creation, environment setup, npm install, and automatic Claude launch in a new terminal.

## Features

- Creates a git worktree as a sibling directory to your current repository
- Creates a new git branch (optional, defaults to worktree name)
- Copies all `.env*` files from the current directory
- Optionally copies the `.claude` directory (permissions/settings) to avoid re-accepting in each worktree
- Runs `npm install` in the new worktree
- Launches Claude in a new terminal window
- Cross-platform support (Windows, macOS, Linux)

## Usage

Use the `/create-worktree` command in Claude:

```
/create-worktree
```

Then provide the worktree name and optionally a branch name:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs" my-feature
```

Or with a custom branch name:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/create-worktree.mjs" my-feature feature/my-new-feature
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `worktree-name` | Yes | Name for the worktree directory |
| `branch-name` | No | Name for the new branch (defaults to worktree-name) |

## Example

If your repository is at `/projects/my-app`, running:

```bash
node create-worktree.mjs feature-auth feature/authentication
```

Will:
1. Create a worktree at `/projects/feature-auth`
2. Create a new branch called `feature/authentication`
3. Copy all `.env*` files from `/projects/my-app`
4. Copy the `.claude` directory (if it exists and you confirm)
5. Run `npm install` in the new worktree
6. Open a new terminal with Claude running in `/projects/feature-auth`

## Requirements

- Git (with worktree support)
- Node.js
- npm
- Claude CLI installed globally

## Platform Support

| Platform | Terminal |
|----------|----------|
| Windows | PowerShell |
| macOS | Terminal.app |
| Linux | gnome-terminal, konsole, or xterm |
