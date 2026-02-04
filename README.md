# My Claude Plugins

A collection of custom plugins for [Claude Code](https://github.com/anthropics/claude-code).

## Plugins

### Ralph Wiggum (Windows)

A loop control plugin that enables autonomous processing for long-running tasks on Windows. Allows Claude to continue working on tasks automatically until completion conditions are met.

**Features:**
- Configurable max iterations
- Completion promise detection
- Manual cancel support

See [ralph-wiggum-windows/README.md](loktar-marketplace/ralph-wiggum-windows/README.md) for detailed usage.

### Worktree Creator

Automates git worktree creation for TypeScript projects with branch creation, environment setup, and automatic Claude launch.

**Features:**
- Creates git worktree as a sibling directory
- Creates a new branch (optional, defaults to worktree name)
- Copies all `.env*` files from the source directory
- Runs `npm install` in the new worktree
- Launches Claude in a new terminal window
- Cross-platform support (Windows, macOS, Linux)

See [worktree-creator/README.md](loktar-marketplace/worktree-creator/README.md) for detailed usage.

## Installation

Plugins are organized under `loktar-marketplace/`. To install a plugin, symlink or copy it to your Claude plugins folder:

```powershell
# Example: Install ralph-wiggum-windows
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\plugins\ralph-wiggum" -Target "<path-to-repo>\loktar-marketplace\ralph-wiggum-windows"
```

## Structure

```
my-claude-plugins/
├── loktar-marketplace/
│   ├── .claude-plugin/
│   │   └── marketplace.json    # Marketplace configuration
│   ├── ralph-wiggum-windows/   # Ralph Wiggum plugin for Windows
│   └── worktree-creator/       # Git worktree automation plugin
└── README.md
```

## License

MIT
