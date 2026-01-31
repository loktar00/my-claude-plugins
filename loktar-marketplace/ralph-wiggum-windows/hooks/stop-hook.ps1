# Ralph Wiggum Stop Hook - PowerShell Version
# This hook intercepts stop events to continue the ralph-loop

# Read hook input from stdin
$hookInput = [Console]::In.ReadToEnd() | ConvertFrom-Json

# Check if ralph-loop state file exists
$stateFile = ".claude/ralph-loop.local.md"
if (-not (Test-Path $stateFile)) {
    exit 0
}

# Read state file content
$content = Get-Content $stateFile -Raw

# Parse YAML frontmatter using regex
$frontmatterMatch = [regex]::Match($content, '(?s)^---\r?\n(.+?)\r?\n---')
if (-not $frontmatterMatch.Success) {
    Write-Error "Invalid state file format - no frontmatter found"
    exit 0
}
$frontmatter = $frontmatterMatch.Groups[1].Value

# Extract fields from frontmatter
$active = if ($frontmatter -match 'active:\s*(true|false)') { $Matches[1] -eq 'true' } else { $false }
$iteration = if ($frontmatter -match 'iteration:\s*(\d+)') { [int]$Matches[1] } else { 1 }
$maxIterations = if ($frontmatter -match 'max_iterations:\s*(\d+)') { [int]$Matches[1] } else { 0 }
$completionPromise = if ($frontmatter -match 'completion_promise:\s*"([^"]*)"') { $Matches[1] } else { "null" }

# If not active, exit
if (-not $active) {
    exit 0
}

# Check max iterations limit
if ($maxIterations -gt 0 -and $iteration -ge $maxIterations) {
    Write-Host "Ralph loop: Max iterations ($maxIterations) reached. Stopping loop."
    Remove-Item $stateFile -Force
    exit 0
}

# Read transcript and get last assistant message
$transcriptPath = $hookInput.transcript_path
if ($transcriptPath -and (Test-Path $transcriptPath)) {
    $lastLine = Get-Content $transcriptPath |
        Where-Object { $_ -match '"role":"assistant"' } |
        Select-Object -Last 1

    if ($lastLine) {
        try {
            $lastMessage = $lastLine | ConvertFrom-Json
            $lastOutput = ($lastMessage.message.content |
                Where-Object { $_.type -eq "text" } |
                ForEach-Object { $_.text }) -join "`n"

            # Check for completion promise
            if ($completionPromise -and $completionPromise -ne "null") {
                if ($lastOutput -match '<promise>(.+?)</promise>') {
                    $promiseText = $Matches[1].Trim()
                    if ($promiseText -eq $completionPromise) {
                        Write-Host "Ralph loop: Completion promise '$completionPromise' detected. Stopping loop."
                        Remove-Item $stateFile -Force
                        exit 0
                    }
                }
            }
        }
        catch {
            # If JSON parsing fails, continue with the loop
            Write-Host "Warning: Could not parse transcript line"
        }
    }
}

# Continue loop - increment iteration
$nextIteration = $iteration + 1

# Update the state file with new iteration count
$updatedContent = $content -replace 'iteration:\s*\d+', "iteration: $nextIteration"
Set-Content -Path $stateFile -Value $updatedContent -NoNewline

# Extract prompt text (everything after the second ---)
$parts = $content -split '---', 3
$promptText = if ($parts.Count -ge 3) { $parts[2].Trim() } else { "Continue working on the task." }

# Build system message
$systemMsg = "Ralph loop iteration $nextIteration"
if ($maxIterations -gt 0) {
    $systemMsg += " of $maxIterations"
}
if ($completionPromise -and $completionPromise -ne "null") {
    $systemMsg += ". Output <promise>$completionPromise</promise> when the task is complete."
}

# Output JSON to block stop and continue loop
$response = @{
    decision = "block"
    reason = $promptText
    systemMessage = $systemMsg
}
$response | ConvertTo-Json -Compress
