# -----------------------------------------------------------------------
# auto_deploy.ps1 - Automated Git + Vercel deployment for FilmologyX
# -----------------------------------------------------------------------

Set-Location -Path "C:\Users\safwa\FilmologyX"

# ---- 1. Git init (if needed) -------------------------------------------
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
} else {
    Write-Host "Git repo already initialized." -ForegroundColor Green
}

# ---- 2. Stage & commit all changes ------------------------------------
git add -A
$status = git status --porcelain
if ($status) {
    git commit -m "feat: add Comedy/Romance/Arabic pills and expanded catalog"
    Write-Host "Changes committed." -ForegroundColor Green
} else {
    Write-Host "Nothing new to commit." -ForegroundColor Yellow
}

# ---- 3. Push to GitHub -------------------------------------------------
$remoteUrl = Read-Host "`nPaste your GitHub repository HTTPS URL`n(e.g. https://github.com/your-user/filmologyx.git)"
if (-not $remoteUrl) { Write-Error "URL required."; exit 1 }

if (git remote 2>$null | Where-Object { $_ -eq "origin" }) {
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
git push -u origin main --force
if ($LASTEXITCODE -ne 0) { Write-Error "Git push failed. Check your URL and credentials."; exit 1 }

# ---- 4. Install Vercel CLI (if missing) --------------------------------
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "`nInstalling Vercel CLI..." -ForegroundColor Cyan
    npm i -g vercel
}

# ---- 5. Deploy to Vercel -----------------------------------------------
$vercelToken = Read-Host "`nPaste your Vercel personal token`n(create one at https://vercel.com/account/tokens)"
if (-not $vercelToken) { Write-Error "Token required."; exit 1 }

$projectName = Read-Host "`nVercel project name (press Enter for default 'filmologyx')"
if (-not $projectName) { $projectName = "filmologyx" }

Write-Host "`nDeploying to Vercel in production mode..." -ForegroundColor Cyan
vercel --prod --yes --token $vercelToken --name $projectName

Write-Host "`n✅ Done! Copy the URL printed above and open it in your browser." -ForegroundColor Green
Write-Host "From now on, every 'git push' to main will auto-deploy your site." -ForegroundColor Green
