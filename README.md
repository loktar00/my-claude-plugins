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
│   └── ralph-wiggum-windows/   # Ralph Wiggum plugin for Windows
└── README.md
```

## License

MIT
