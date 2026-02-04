#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { existsSync, copyFileSync, readdirSync } from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: create-worktree.mjs <worktree-name> [branch-name]');
  console.error('');
  console.error('Arguments:');
  console.error('  worktree-name  Name for the worktree directory (required)');
  console.error('  branch-name    Name for the new branch (optional, defaults to worktree-name)');
  process.exit(1);
}

const worktreeName = args[0];
const branchName = args[1] || worktreeName;

// Check if we're in a git repository
let repoRoot;
try {
  repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
} catch (error) {
  console.error('Error: Not in a git repository');
  process.exit(1);
}

// Worktree path is a sibling to the current repository
const worktreePath = path.join(path.dirname(repoRoot), worktreeName);

console.log(`Creating worktree at: ${worktreePath}`);
console.log(`Branch name: ${branchName}`);

// Check if worktree path already exists
if (existsSync(worktreePath)) {
  console.error(`Error: Directory already exists: ${worktreePath}`);
  process.exit(1);
}

// Create the worktree with a new branch
try {
  console.log('\n[1/4] Creating git worktree...');
  execSync(`git worktree add -b "${branchName}" "${worktreePath}"`, {
    encoding: 'utf8',
    stdio: 'inherit'
  });
  console.log('Worktree created successfully');
} catch (error) {
  console.error('Error creating worktree:', error.message);
  process.exit(1);
}

// Copy all .env* files
console.log('\n[2/4] Copying .env files...');
try {
  const envFiles = readdirSync(repoRoot).filter(f => f.startsWith('.env'));
  if (envFiles.length === 0) {
    console.log('No .env files found to copy');
  } else {
    for (const envFile of envFiles) {
      const srcPath = path.join(repoRoot, envFile);
      const destPath = path.join(worktreePath, envFile);
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${envFile}`);
    }
  }
} catch (error) {
  console.error('Warning: Error copying .env files:', error.message);
  // Continue anyway - this is not a critical error
}

// Run npm install
console.log('\n[3/4] Running npm install...');
try {
  execSync('npm install', {
    cwd: worktreePath,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  console.log('npm install completed');
} catch (error) {
  console.error('Warning: npm install failed:', error.message);
  // Continue anyway - still launch claude
}

// Launch claude in a new terminal
console.log('\n[4/4] Launching Claude in new terminal...');
try {
  if (process.platform === 'win32') {
    // Windows: Use cmd.exe to start a new terminal window
    spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', `cd /d "${worktreePath}" && claude`], {
      detached: true,
      stdio: 'ignore',
      shell: true
    }).unref();
  } else if (process.platform === 'darwin') {
    // macOS: Use osascript to open Terminal.app
    const script = `tell application "Terminal" to do script "cd '${worktreePath}' && claude"`;
    spawn('osascript', ['-e', script], {
      detached: true,
      stdio: 'ignore'
    }).unref();
  } else {
    // Linux: Try common terminal emulators
    const terminals = [
      ['gnome-terminal', '--', 'bash', '-c', `cd "${worktreePath}" && claude; exec bash`],
      ['konsole', '-e', 'bash', '-c', `cd "${worktreePath}" && claude; exec bash`],
      ['xterm', '-e', 'bash', '-c', `cd "${worktreePath}" && claude; exec bash`]
    ];

    let launched = false;
    for (const [cmd, ...args] of terminals) {
      try {
        execSync(`which ${cmd}`, { stdio: 'ignore' });
        spawn(cmd, args, {
          detached: true,
          stdio: 'ignore'
        }).unref();
        launched = true;
        break;
      } catch {
        // Terminal not found, try next
      }
    }

    if (!launched) {
      console.log(`Could not find a terminal emulator. Please run 'claude' manually in: ${worktreePath}`);
    }
  }
  console.log('Claude launched in new terminal');
} catch (error) {
  console.error('Warning: Could not launch new terminal:', error.message);
  console.log(`Please run 'claude' manually in: ${worktreePath}`);
}

console.log('\n=== Worktree setup complete ===');
console.log(`Location: ${worktreePath}`);
console.log(`Branch: ${branchName}`);
