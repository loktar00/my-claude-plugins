# Ralph Wiggum Loop Setup Script - PowerShell Version
# Creates the state file to initiate a ralph loop

param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$PromptParts,

    [Alias("m")]
    [int]$MaxIterations = 0,

    [Alias("p")]
    [string]$CompletionPromise = "null",

    [Alias("h")]
    [switch]$Help
)

# Show help if requested
if ($Help) {
    $helpText = @"
Ralph Wiggum Loop - PowerShell Version

Usage: /ralph-loop [options] <prompt>

Options:
  -MaxIterations, -m <n>     Maximum number of iterations (0 = unlimited)
  -CompletionPromise, -p <text>  Stop when <promise>text</promise> is output
  -Help, -h                  Show this help message

Examples:
  /ralph-loop Fix all the bugs in this file
  /ralph-loop -m 5 Refactor this code
  /ralph-loop -p "DONE" Complete the implementation

The loop will continue until:
  1. Max iterations is reached (if set)
  2. Completion promise is detected in output
  3. You run /cancel-ralph
"@
    Write-Host $helpText
    exit 0
}

# Combine prompt parts into single string
$prompt = ($PromptParts -join ' ').Trim()

# Validate prompt
if ([string]::IsNullOrWhiteSpace($prompt)) {
    Write-Error "Error: No prompt provided. Use -Help for usage information."
    exit 1
}

# Escape completion promise for YAML
$escapedPromise = if ($CompletionPromise -eq "null") { "null" } else { "`"$CompletionPromise`"" }

# Create state file content
$timestamp = (Get-Date).ToUniversalTime().ToString("o")
$stateContent = @"
---
active: true
iteration: 1
max_iterations: $MaxIterations
completion_promise: $escapedPromise
started_at: "$timestamp"
---

$prompt
"@

# Ensure .claude directory exists
New-Item -Path ".claude" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null

# Write state file
$stateFile = ".claude/ralph-loop.local.md"
Set-Content -Path $stateFile -Value $stateContent

# Output confirmation
Write-Host "Ralph loop started!"
Write-Host "  Prompt: $prompt"
if ($MaxIterations -gt 0) {
    Write-Host "  Max iterations: $MaxIterations"
}
if ($CompletionPromise -ne "null") {
    Write-Host "  Completion promise: $CompletionPromise"
}
Write-Host ""
Write-Host "The loop will begin processing. Use /cancel-ralph to stop."
