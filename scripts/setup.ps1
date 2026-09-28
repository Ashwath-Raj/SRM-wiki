[CmdletBinding()]
param(
    [switch]$NoOptional
)

$ErrorActionPreference = 'Stop'

function Write-Log([string]$Message) {
    Write-Host "`n[setup] $Message"
}
function Write-Warn([string]$Message) {
    Write-Warning $Message
}
function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name is required but was not found on PATH."
    }
}

$Root = (git rev-parse --show-toplevel 2>$null)
if (-not $Root) { $Root = (Get-Location).Path }
Set-Location $Root

Write-Log "Checking prerequisites"
Require-Command git
Require-Command node
Require-Command npm
Require-Command npx

$NodeMajor = [int]((node -p "process.versions.node.split('.')[0]").Trim())
if ($NodeMajor -lt 20) {
    throw "Node.js 20+ is required. Found $(node --version)."
}

Write-Log "Checking project-side harness"
$Required = @(
    'CLAUDE.md',
    '.claude/settings.json',
    '.claude/rules',
    '.claude/hooks',
    'agent-state'
)
foreach ($Path in $Required) {
    if (-not (Test-Path (Join-Path $Root $Path))) {
        throw "Missing repository harness path: $Path"
    }
}

Write-Log "Installing/updating Claude Code"
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    irm https://claude.ai/install.ps1 | iex
}
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
    throw "Claude Code installation completed but 'claude' is not on PATH. Open a new PowerShell and rerun setup."
}

Write-Log "Configuring free-only OpenRouter"
$ConfigDir = Join-Path $HOME '.config\claude-code'
New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
$OpenRouterFile = Join-Path $ConfigDir 'openrouter.ps1'

if ($env:OPENROUTER_API_KEY) {
    $OpenRouterKey = $env:OPENROUTER_API_KEY
} else {
    $Secure = Read-Host 'OpenRouter API key (input hidden)' -AsSecureString
    $Ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    try {
        $OpenRouterKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($Ptr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($Ptr)
    }
}
if ([string]::IsNullOrWhiteSpace($OpenRouterKey)) {
    throw 'No OpenRouter API key supplied.'
}

# Escape a PowerShell single-quoted string.
$EscapedKey = $OpenRouterKey.Replace("'", "''")
@"
# Machine-local Claude Code free-only OpenRouter configuration.
# DO NOT COMMIT THIS FILE.
`$env:OPENROUTER_API_KEY='$EscapedKey'
`$env:ANTHROPIC_BASE_URL='https://openrouter.ai/api'
`$env:ANTHROPIC_AUTH_TOKEN=`$env:OPENROUTER_API_KEY
`$env:ANTHROPIC_API_KEY=''
`$env:ANTHROPIC_MODEL='openrouter/free'
`$env:ANTHROPIC_DEFAULT_OPUS_MODEL='openrouter/free'
`$env:ANTHROPIC_DEFAULT_SONNET_MODEL='openrouter/free'
`$env:ANTHROPIC_DEFAULT_HAIKU_MODEL='openrouter/free'
`$env:CLAUDE_CODE_SUBAGENT_MODEL='openrouter/free'
`$env:CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT='1'
`$env:CLAUDE_CODE_MAX_CONTEXT_TOKENS='200000'
`$env:CLAUDE_CODE_MAX_RETRIES='2'
`$env:CLAUDE_AUTOCOMPACT_PCT_OVERRIDE='75'
"@ | Set-Content -Path $OpenRouterFile -Encoding utf8

# Apply to the current process.
. $OpenRouterFile

# Load automatically in future PowerShell sessions.
if (-not (Test-Path $PROFILE)) {
    New-Item -ItemType File -Force -Path $PROFILE | Out-Null
}
$ProfileLine = ". `"$OpenRouterFile`""
$ProfileContent = Get-Content $PROFILE -Raw
if ($ProfileContent -notmatch [regex]::Escape($ProfileLine)) {
    Add-Content -Path $PROFILE -Value "`r`n# Claude Code free-only OpenRouter harness`r`n$ProfileLine`r`n"
}

Write-Log "Installing portable Agent Skills globally"
function Invoke-NativeAllowFailure([string]$FilePath, [string[]]$Arguments) {
    & $FilePath @Arguments
    return $LASTEXITCODE
}

function Install-SkillsRepo([string]$Repo) {
    Write-Log "Skills: $Repo"
    $code = Invoke-NativeAllowFailure 'npx' @('--yes','skills@latest','add',$Repo,'--all','--global','--copy')
    if ($code -ne 0) {
        Write-Warn "Skills install failed for $Repo (exit $code); rerun setup later to retry."
    }
}

Install-SkillsRepo 'anthropics/skills'
Install-SkillsRepo 'wshobson/agents'
Install-SkillsRepo 'vercel-labs/agent-skills'
Install-SkillsRepo 'mobbin/skills'
Install-SkillsRepo 'https://github.com/referodesign/refero_skill'
Install-SkillsRepo 'senlindesign/taste-skill'
Install-SkillsRepo 'emilkowalski/skills'
Install-SkillsRepo 'rebelytics/one-skill-to-rule-them-all'
Install-SkillsRepo 'microsoft/playwright'

Write-Log "Installing the Context7 find-docs skill"
$code = Invoke-NativeAllowFailure 'npx' @('--yes','skills@latest','add','https://github.com/upstash/context7','--skill','find-docs','--global','--copy','-y')
if ($code -ne 0) {
    Write-Warn "Context7 skill install failed (exit $code); MCP registration will still be attempted."
}

Write-Log "Registering Claude Code marketplaces"
foreach ($Marketplace in @('anthropics/claude-plugins-official','thedotmack/claude-mem','referodesign/refero_skill','pbakaus/impeccable')) {
    $code = Invoke-NativeAllowFailure 'claude' @('plugin','marketplace','add',$Marketplace,'--scope','user')
    if ($code -ne 0) { Write-Warn "Could not register marketplace: $Marketplace (exit $code)" }
}

Write-Log "Installing official Claude Code plugins used by this harness"
$OfficialPlugins = @(
    'claude-code-setup',
    'claude-md-management',
    'code-review',
    'code-simplifier',
    'commit-commands',
    'feature-dev',
    'figma',
    'frontend-design',
    'hookify',
    'planning-with-files',
    'plugin-dev',
    'pr-review-toolkit',
    'security-guidance'
)
foreach ($Plugin in $OfficialPlugins) {
    $code = Invoke-NativeAllowFailure 'claude' @('plugin','install',"$Plugin@claude-plugins-official",'--scope','user')
    if ($code -ne 0) { Write-Warn "Could not install official plugin: $Plugin (exit $code)" }
}

Write-Log "Installing Claude-Mem"
$code = Invoke-NativeAllowFailure 'claude' @('plugin','install','claude-mem','--scope','user')
if ($code -ne 0) { Write-Warn "Claude-Mem plugin installation failed (exit $code); rerun setup and/or use the documented marketplace install." }

Write-Log "Installing Refero"
$code = Invoke-NativeAllowFailure 'claude' @('plugin','install','refero@refero','--scope','user')
if ($code -ne 0) { Write-Warn "Refero plugin installation failed (exit $code); the standalone skill and MCP registration will still be attempted." }

Write-Log "Installing Impeccable globally"
$code = Invoke-NativeAllowFailure 'npx' @('--yes','impeccable','install','-y','--providers=claude','--scope=global')
if ($code -ne 0) { Write-Warn "Impeccable global install failed (exit $code). The repo already contains the project skill; rerun this step later if necessary." }

Write-Log "Registering user-scope MCP servers"
function Test-McpExists([string]$Name) {
    & claude mcp get $Name *> $null
    return ($LASTEXITCODE -eq 0)
}

function Add-HttpMcp([string]$Name, [string]$Url) {
    if (Test-McpExists $Name) {
        Write-Host "[setup] MCP already present: $Name"
        return
    }
    $code = Invoke-NativeAllowFailure 'claude' @('mcp','add','--scope','user','--transport','http',$Name,$Url)
    if ($code -ne 0) { Write-Warn "Could not register MCP: $Name (exit $code)" }
}

function Add-StdioMcp([string]$Name, [string[]]$CommandArgs) {
    if (Test-McpExists $Name) {
        Write-Host "[setup] MCP already present: $Name"
        return
    }
    $args = @('mcp','add','--scope','user',$Name,'--') + $CommandArgs
    $code = Invoke-NativeAllowFailure 'claude' $args
    if ($code -ne 0) { Write-Warn "Could not register MCP: $Name (exit $code)" }
}

Add-HttpMcp 'figma' 'https://mcp.figma.com/mcp'
Add-HttpMcp 'mobbin' 'https://api.mobbin.com/mcp'
Add-HttpMcp 'context7' 'https://mcp.context7.com/mcp'
Add-HttpMcp 'refero' 'https://api.refero.design/mcp'
Add-StdioMcp 'playwright' @('npx', '-y', '@playwright/mcp@latest')

if ($env:GITHUB_PERSONAL_ACCESS_TOKEN) {
    Write-Warn 'GITHUB_PERSONAL_ACCESS_TOKEN is present; this setup intentionally does not persist it or register an authenticated GitHub MCP automatically.'
}

if (-not $NoOptional) {
    Write-Log "Installing optional non-live tools"

    # Headroom is installed for experimentation only. It is NOT placed in the
    # Claude Code request path by this script.
    $Python = Get-Command py -ErrorAction SilentlyContinue
    if ($Python) {
        $code = Invoke-NativeAllowFailure 'py' @('-3.13','-m','pip','install','--user','headroom-ai[all]')
        if ($code -ne 0) {
            $code = Invoke-NativeAllowFailure 'py' @('-m','pip','install','--user','headroom-ai[all]')
        }
        if ($code -ne 0) { Write-Warn "Headroom install failed via Python (exit $code)." }
    } else {
        $Python = Get-Command python -ErrorAction SilentlyContinue
        if ($Python) {
            $code = Invoke-NativeAllowFailure 'python' @('-m','pip','install','--user','headroom-ai[all]')
            if ($code -ne 0) { Write-Warn "Headroom install failed via Python (exit $code)." }
        } else {
            Write-Warn 'Python not found; skipped Headroom.'
        }
    }

    # OmniRoute is installed but deliberately NOT configured as Claude's model
    # gateway. The live path remains direct -> OpenRouter/free.
    $code = Invoke-NativeAllowFailure 'npm' @('install','-g','omniroute')
    if ($code -ne 0) { Write-Warn "OmniRoute install failed (exit $code). It is intentionally not wired into Claude Code." }
} else {
    Write-Log "Skipping optional Headroom/OmniRoute tools (-NoOptional)"
}

Write-Log "Checking Windows shell compatibility"
if (-not (Get-Command bash.exe -ErrorAction SilentlyContinue)) {
    Write-Warn 'Git Bash was not found. The shared Claude hooks are POSIX shell scripts; install Git for Windows so Claude Code can execute them.'
}

Write-Log "Validating repository JSON"
if (Get-Command python -ErrorAction SilentlyContinue) {
    try {
        python -c "import json; json.load(open('.claude/settings.json', encoding='utf-8')); print('settings.json: OK')"
    } catch {
        throw '.claude/settings.json is not valid JSON.'
    }
}

Write-Log "Final verification"
Write-Host "Claude: $(claude --version)"
Write-Host "Base URL: $env:ANTHROPIC_BASE_URL"
Write-Host "Model: $env:ANTHROPIC_MODEL"
Write-Host "Subagent model: $env:CLAUDE_CODE_SUBAGENT_MODEL"
Write-Host "`nMCP status:"
claude mcp list

Write-Host "`n[setup] Bootstrap complete."
Write-Host @"

NEXT HUMAN STEP:
  1. Start a NEW Claude Code session in this repository.
  2. Run /mcp once and authenticate Figma, Mobbin and Refero if prompted.
  3. Do NOT run /learn-codebase during setup; the project memory layer should remain idle until real work begins.

The live model path is intentionally:
  Claude Code -> OpenRouter -> openrouter/free

Headroom and OmniRoute are installed only as optional tooling and are NOT in the live request path.
No Git commit or push was performed.
"@
