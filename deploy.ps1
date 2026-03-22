<#
.SYNOPSIS
Deploy InteleSalud to a VPS that already has nginx and other sites running.
Adapted from the existing medicalcore Next.js standalone deploy pattern.
#>

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$ConfigFile = "deploy_config.env"
$TarFile = "intelesalud_build.tar.gz"
$RuntimeFile = "deploy_runtime.env"
$AppEnvFile = "deploy_app.env"

function Read-KeyValueFile {
    param([string]$Path)

    $map = @{}
    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if ($trimmed -eq "" -or $trimmed.StartsWith("#")) {
            continue
        }

        $separatorIndex = $trimmed.IndexOf("=")
        if ($separatorIndex -lt 1) {
            continue
        }

        $key = $trimmed.Substring(0, $separatorIndex).Trim()
        $value = $trimmed.Substring($separatorIndex + 1).Trim()
        $map[$key] = $value
    }

    return $map
}

function Get-ConfigValue {
    param(
        [hashtable]$Config,
        [string]$Name,
        [string]$Default = ""
    )

    if ($Config.ContainsKey($Name) -and $Config[$Name].Trim() -ne "") {
        return $Config[$Name].Trim()
    }

    return $Default
}

function Write-LfFile {
    param(
        [string]$Path,
        [string[]]$Lines
    )

    $content = ($Lines -join "`n")
    if ($content.Length -gt 0) {
        $content += "`n"
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $content, $utf8NoBom)
}

if (-not (Test-Path $ConfigFile)) {
    Write-Host "Error: '$ConfigFile' was not found." -ForegroundColor Red
    Write-Host "Copy 'deploy_config.env.example' to 'deploy_config.env' and fill in your values." -ForegroundColor Yellow
    exit 1
}

Write-Host "Reading deploy configuration..." -ForegroundColor Cyan
$Config = Read-KeyValueFile -Path $ConfigFile

$IP = Get-ConfigValue -Config $Config -Name "VPS_IP"
$User = Get-ConfigValue -Config $Config -Name "VPS_USER" -Default "admin"
$TargetDir = Get-ConfigValue -Config $Config -Name "VPS_TARGET_DIR" -Default "/var/www/intelesalud"
$Domain = Get-ConfigValue -Config $Config -Name "VPS_DOMAIN"
$Port = Get-ConfigValue -Config $Config -Name "VPS_APP_PORT" -Default "3004"
$AppUser = Get-ConfigValue -Config $Config -Name "VPS_APP_USER" -Default $User
$AppGroup = Get-ConfigValue -Config $Config -Name "VPS_APP_GROUP" -Default $AppUser
$ServiceName = Get-ConfigValue -Config $Config -Name "VPS_SERVICE_NAME" -Default "intelesalud"
$NginxSiteName = Get-ConfigValue -Config $Config -Name "VPS_NGINX_SITE_NAME" -Default $ServiceName
$SslMode = Get-ConfigValue -Config $Config -Name "VPS_SSL_MODE" -Default "cloudflare_origin"
$SslCertPath = Get-ConfigValue -Config $Config -Name "VPS_SSL_CERT_PATH"
$SslKeyPath = Get-ConfigValue -Config $Config -Name "VPS_SSL_KEY_PATH"
$FirebaseAuthProxyTarget = Get-ConfigValue -Config $Config -Name "FIREBASE_AUTH_PROXY_TARGET"

if ([string]::IsNullOrWhiteSpace($IP) -or [string]::IsNullOrWhiteSpace($Domain)) {
    Write-Host "Error: VPS_IP and VPS_DOMAIN are required in '$ConfigFile'." -ForegroundColor Red
    exit 1
}

$SshArgs = @()
$KeyPath = Get-ConfigValue -Config $Config -Name "VPS_KEY_PATH"
if (-not [string]::IsNullOrWhiteSpace($KeyPath)) {
    $SshArgs += "-i"
    $SshArgs += $KeyPath
}

$RuntimeLines = @(
    "APP_BASE_DIR=$TargetDir"
    "APP_DIR=$TargetDir/current"
    "APP_USER=$AppUser"
    "APP_GROUP=$AppGroup"
    "DOMAIN=$Domain"
    "APP_PORT=$Port"
    "SERVICE_NAME=$ServiceName"
    "NGINX_SITE_NAME=$NginxSiteName"
    "SSL_MODE=$SslMode"
    "SSL_CERT_PATH=$SslCertPath"
    "SSL_KEY_PATH=$SslKeyPath"
    "ENV_FILE_PATH=$TargetDir/shared/intelesalud.env"
    "FIREBASE_AUTH_PROXY_TARGET=$FirebaseAuthProxyTarget"
)

$AppEnvLines = @()
foreach ($Entry in $Config.GetEnumerator() | Sort-Object Name) {
    if ($Entry.Key -match '^(NEXT_PUBLIC_|FIREBASE_|DATABASE_URL|IP_HASH_SECRET|GOOGLE_CALENDAR_)') {
        if (-not [string]::IsNullOrWhiteSpace($Entry.Value)) {
            $AppEnvLines += "$($Entry.Key)=$($Entry.Value)"
        }
    }
}

Write-Host "Preparing runtime configuration..." -ForegroundColor Cyan
Write-LfFile -Path $RuntimeFile -Lines $RuntimeLines
Write-LfFile -Path $AppEnvFile -Lines $AppEnvLines

if ($SkipBuild) {
    Write-Host "Skipping local build. Reusing existing standalone artifacts..." -ForegroundColor Yellow
}
else {
    Write-Host "Building application..." -ForegroundColor Cyan
    & npm ci
    & npx prisma generate
    & npm run build
}

Write-Host "Packaging application..." -ForegroundColor Cyan
if (Test-Path $TarFile) {
    Remove-Item $TarFile -Force
}

$PackagePaths = @(
    ".next\standalone",
    ".next\static",
    "public",
    "prisma",
    "vps_setup.sh",
    "package.json"
)

$ExistingPackagePaths = @()
foreach ($Path in $PackagePaths) {
    if (Test-Path $Path) {
        $ExistingPackagePaths += $Path
    }
}

$RequiredPackagePaths = @(".next\standalone", ".next\static", "prisma", "vps_setup.sh", "package.json")
$MissingRequiredPaths = @()
foreach ($Path in $RequiredPackagePaths) {
    if (-not (Test-Path $Path)) {
        $MissingRequiredPaths += $Path
    }
}

if ($MissingRequiredPaths.Count -gt 0) {
    Write-Host "Error: required deploy artifacts are missing: $($MissingRequiredPaths -join ', ')" -ForegroundColor Red
    exit 1
}

& tar -czf $TarFile @ExistingPackagePaths

Write-Host "Uploading build and runtime files to $User@$IP..." -ForegroundColor Cyan
$ScpArgs = $SshArgs + @($TarFile, $RuntimeFile, $AppEnvFile, "$User@$IP`:`~/")
& scp $ScpArgs

$RemoteScript = @'
set -euo pipefail

RUNTIME_FILE="$HOME/deploy_runtime.env"
APP_ENV_FILE="$HOME/deploy_app.env"
BUILD_FILE="$HOME/{0}"

set -a
. "$RUNTIME_FILE"
set +a

RELEASE_ID="$(date +%Y%m%d%H%M%S)"
RELEASE_DIR="$APP_BASE_DIR/releases/$RELEASE_ID"

sudo mkdir -p "$RELEASE_DIR" "$APP_BASE_DIR/shared" "$APP_BASE_DIR/releases"
sudo tar -xzf "$BUILD_FILE" -C "$RELEASE_DIR"
sudo ln -sfn "$RELEASE_DIR" "$APP_BASE_DIR/current"

sudo cp "$APP_ENV_FILE" "$ENV_FILE_PATH"
sudo chown -R "$APP_USER:$APP_GROUP" "$APP_BASE_DIR"
sudo chmod 640 "$ENV_FILE_PATH"
sudo chown root:"$APP_GROUP" "$ENV_FILE_PATH"
sudo chmod +x "$RELEASE_DIR/vps_setup.sh"
sudo -E bash "$RELEASE_DIR/vps_setup.sh"

rm -f "$BUILD_FILE" "$RUNTIME_FILE" "$APP_ENV_FILE"
'@ -f $TarFile

Write-Host "Running remote install..." -ForegroundColor Cyan
$SshExecArgs = $SshArgs + @("$User@$IP", $RemoteScript)
& ssh $SshExecArgs

Write-Host "Deploy finished. Verify https://$Domain once DNS is configured." -ForegroundColor Green

if (Test-Path $TarFile) { Remove-Item $TarFile -Force }
if (Test-Path $RuntimeFile) { Remove-Item $RuntimeFile -Force }
if (Test-Path $AppEnvFile) { Remove-Item $AppEnvFile -Force }
