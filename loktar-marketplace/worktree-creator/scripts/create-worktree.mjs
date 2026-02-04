#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import { existsSync, copyFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import path from 'path';
import * as readline from 'readline';

// Docker-style random name generator arrays
const ADJECTIVES = [
  'admiring', 'adoring', 'affectionate', 'agitated', 'amazing', 'angry', 'awesome',
  'beautiful', 'blissful', 'bold', 'boring', 'brave', 'busy', 'charming', 'clever',
  'cool', 'compassionate', 'competent', 'condescending', 'confident', 'cranky',
  'crazy', 'dazzling', 'determined', 'distracted', 'dreamy', 'eager', 'ecstatic',
  'elastic', 'elated', 'elegant', 'eloquent', 'epic', 'exciting', 'fervent',
  'festive', 'flamboyant', 'focused', 'friendly', 'frosty', 'funny', 'gallant',
  'gifted', 'goofy', 'gracious', 'great', 'happy', 'hardcore', 'heuristic',
  'hopeful', 'hungry', 'infallible', 'inspiring', 'intelligent', 'interesting',
  'jolly', 'jovial', 'keen', 'kind', 'laughing', 'loving', 'lucid', 'magical',
  'mystifying', 'modest', 'musing', 'naughty', 'nervous', 'nice', 'nifty',
  'nostalgic', 'objective', 'optimistic', 'peaceful', 'pedantic', 'pensive',
  'practical', 'priceless', 'quirky', 'quizzical', 'recursing', 'relaxed',
  'reverent', 'romantic', 'sad', 'serene', 'sharp', 'silly', 'sleepy', 'stoic',
  'strange', 'stupefied', 'suspicious', 'sweet', 'tender', 'thirsty', 'trusting',
  'unruffled', 'upbeat', 'vibrant', 'vigilant', 'vigorous', 'wizardly', 'wonderful',
  'xenodochial', 'youthful', 'zealous', 'zen'
];

const ANIMALS = [
  'albatross', 'alligator', 'alpaca', 'ant', 'anteater', 'antelope', 'ape',
  'armadillo', 'badger', 'barracuda', 'bat', 'bear', 'beaver', 'bee', 'bison',
  'boar', 'buffalo', 'butterfly', 'camel', 'capybara', 'caribou', 'cassowary',
  'cat', 'caterpillar', 'cattle', 'chameleon', 'cheetah', 'chicken', 'chimpanzee',
  'chinchilla', 'clam', 'cobra', 'cockroach', 'cod', 'condor', 'cormorant',
  'coyote', 'crab', 'crane', 'cricket', 'crocodile', 'crow', 'deer', 'dinosaur',
  'dog', 'dolphin', 'donkey', 'dove', 'dragonfly', 'duck', 'eagle', 'echidna',
  'eel', 'elephant', 'elk', 'emu', 'falcon', 'ferret', 'finch', 'fish',
  'flamingo', 'fox', 'frog', 'gazelle', 'gerbil', 'giraffe', 'gnat', 'gnu',
  'goat', 'goldfish', 'goose', 'gorilla', 'grasshopper', 'grouse', 'hamster',
  'hare', 'hawk', 'hedgehog', 'heron', 'herring', 'hippopotamus', 'hornet',
  'horse', 'hummingbird', 'hyena', 'ibex', 'iguana', 'impala', 'jackal',
  'jaguar', 'jay', 'jellyfish', 'kangaroo', 'kingfisher', 'koala', 'kookaburra',
  'lark', 'lemur', 'leopard', 'lion', 'llama', 'lobster', 'locust', 'louse',
  'lynx', 'magpie', 'mallard', 'manatee', 'mandrill', 'mantis', 'marten',
  'meerkat', 'mink', 'mole', 'mongoose', 'monkey', 'moose', 'mosquito', 'mouse',
  'mule', 'narwhal', 'newt', 'nightingale', 'octopus', 'okapi', 'opossum',
  'oryx', 'ostrich', 'otter', 'owl', 'oyster', 'panther', 'parrot', 'partridge',
  'peafowl', 'pelican', 'penguin', 'pheasant', 'pig', 'pigeon', 'pony',
  'porcupine', 'porpoise', 'quail', 'quelea', 'quetzal', 'rabbit', 'raccoon',
  'ram', 'rat', 'raven', 'reindeer', 'rhinoceros', 'rook', 'salamander',
  'salmon', 'sandpiper', 'sardine', 'scorpion', 'seahorse', 'seal', 'shark',
  'sheep', 'shrew', 'skunk', 'snail', 'snake', 'sparrow', 'spider', 'spoonbill',
  'squid', 'squirrel', 'starling', 'stingray', 'stork', 'swallow', 'swan',
  'tapir', 'tarsier', 'termite', 'tiger', 'toad', 'toucan', 'turkey', 'turtle',
  'viper', 'vulture', 'wallaby', 'walrus', 'wasp', 'weasel', 'whale', 'wildcat',
  'wolf', 'wolverine', 'wombat', 'woodpecker', 'wren', 'yak', 'zebra'
];

/**
 * Generate a random name in Docker naming convention style (adjective-animal)
 */
function generateRandomName() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adjective}-${animal}`;
}

/**
 * Recursively find all .env files in a directory
 * @param {string} dir - Directory to search
 * @param {string} baseDir - Base directory for calculating relative paths
 * @returns {Array<{absolute: string, relative: string}>} Array of file paths
 */
function findEnvFilesRecursively(dir, baseDir) {
  const results = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      // Skip node_modules and .git for performance
      if (entry === 'node_modules' || entry === '.git') {
        continue;
      }

      try {
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively search subdirectories
          results.push(...findEnvFilesRecursively(fullPath, baseDir));
        } else if (stat.isFile() && entry.startsWith('.env')) {
          // Found an .env file
          results.push({
            absolute: fullPath,
            relative: path.relative(baseDir, fullPath)
          });
        }
      } catch {
        // Skip files we can't access
      }
    }
  } catch {
    // Skip directories we can't read
  }

  return results;
}

/**
 * Copy .env files to worktree, preserving directory structure
 * @param {Array<{absolute: string, relative: string}>} envFiles - Files to copy
 * @param {string} worktreePath - Destination worktree path
 */
function copyEnvFiles(envFiles, worktreePath) {
  for (const { absolute, relative } of envFiles) {
    const destPath = path.join(worktreePath, relative);
    const destDir = path.dirname(destPath);

    // Create parent directories if needed
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    copyFileSync(absolute, destPath);
    console.log(`  Copied: ${relative}`);
  }
}

/**
 * Prompt user for input
 * @param {readline.Interface} rl - Readline interface
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's response
 */
function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Create worktree with all setup steps
 * @param {string} worktreeName - Name for the worktree directory
 * @param {string} branchName - Name for the git branch
 * @param {string} repoRoot - Path to the repository root
 */
function createWorktree(worktreeName, branchName, repoRoot) {
  // Worktree path is under {project-root}-worktrees/
  const worktreesParentDir = `${repoRoot}-worktrees`;
  const worktreePath = path.join(worktreesParentDir, worktreeName);

  console.log(`\nWorktree name: ${worktreeName}`);
  console.log(`Branch name: ${branchName}`);
  console.log(`Creating worktree at: ${worktreePath}`);

  // Check if worktree path already exists
  if (existsSync(worktreePath)) {
    console.error(`Error: Directory already exists: ${worktreePath}`);
    process.exit(1);
  }

  // Create parent worktrees directory if needed
  if (!existsSync(worktreesParentDir)) {
    mkdirSync(worktreesParentDir, { recursive: true });
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

  // Copy all .env* files recursively
  console.log('\n[2/4] Copying .env files...');
  try {
    const envFiles = findEnvFilesRecursively(repoRoot, repoRoot);
    if (envFiles.length === 0) {
      console.log('  No .env files found to copy');
    } else {
      copyEnvFiles(envFiles, worktreePath);
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
}

/**
 * Main function with interactive prompts
 */
async function main() {
  // Check if we're in a git repository
  let repoRoot;
  try {
    repoRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error('Error: Not in a git repository');
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    // Prompt for branch name (required)
    let branchName = await prompt(rl, 'Enter branch name: ');
    if (!branchName) {
      console.error('Error: Branch name is required');
      process.exit(1);
    }

    // Prompt for custom worktree name (optional)
    const useCustomName = await prompt(rl, 'Use custom worktree name? (y/N): ');
    let worktreeName;

    if (useCustomName.toLowerCase() === 'y') {
      worktreeName = await prompt(rl, 'Enter worktree name: ');
      if (!worktreeName) {
        console.log('No name provided, generating random name...');
        worktreeName = generateRandomName();
      }
    } else {
      worktreeName = generateRandomName();
    }

    rl.close();

    createWorktree(worktreeName, branchName, repoRoot);
  } catch (error) {
    rl.close();
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
