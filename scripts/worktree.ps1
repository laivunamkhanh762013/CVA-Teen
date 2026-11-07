<#
.SYNOPSIS
    Script quan ly Git Worktree toi uu cho Antigravity va GitHub tren Windows PowerShell.

.DESCRIPTION
    Git Worktree cho phep ban va Antigravity lam viec song song tren nhieu nhanh (branch)
    khac nhau ma khong can stash hoac chuyen doi nhanh tren thu muc goc.

.EXAMPLE
    .\scripts\worktree.ps1 add feature-chat-ai
    .\scripts\worktree.ps1 list
    .\scripts\worktree.ps1 push feature-chat-ai
    .\scripts\worktree.ps1 remove feature-chat-ai
#>

param (
    [Parameter(Position = 0, Mandatory = $true)]
    [ValidateSet("add", "list", "remove", "push", "help")]
    [string]$Action,

    [Parameter(Position = 1, Mandatory = $false)]
    [string]$BranchName
)

$WorktreeDir = Join-Path $PSScriptRoot "..\.worktrees"

function Show-Help {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "     TOOL QUAN LY GIT WORKTREE CHO ANTIGRAVITY & GITHUB   " -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Cach dung:"
    Write-Host "  .\scripts\worktree.ps1 add <ten-nhanh>     : Tao worktree moi trong .worktrees/<ten-nhanh>"
    Write-Host "  .\scripts\worktree.ps1 list               : Liet ke cac worktree dang hoat dong"
    Write-Host "  .\scripts\worktree.ps1 push <ten-nhanh>    : Day nhanh worktree len GitHub"
    Write-Host "  .\scripts\worktree.ps1 remove <ten-nhanh>  : Xoa worktree va don dep thu muc"
    Write-Host "  .\scripts\worktree.ps1 help               : Hien thi huong dan nay"
    Write-Host ""
}

switch ($Action) {
    "help" {
        Show-Help
    }

    "list" {
        Write-Host "`n[+] Danh sach Git Worktrees hien co:" -ForegroundColor Green
        git worktree list
    }

    "add" {
        if (-not $BranchName) {
            Write-Error "Vui long nhap ten nhanh can tao! Vi du: .\scripts\worktree.ps1 add feature-moi"
            exit 1
        }

        if (-not (Test-Path $WorktreeDir)) {
            New-Item -ItemType Directory -Path $WorktreeDir -Force | Out-Null
        }

        $TargetFolder = Join-Path $WorktreeDir $BranchName

        if (Test-Path $TargetFolder) {
            Write-Warning "Thu muc worktree '$TargetFolder' da ton tai!"
            exit 1
        }

        Write-Host "`n[+] Dang tao Git Worktree cho nhanh: $BranchName..." -ForegroundColor Cyan
        
        $branchExists = git branch --list $BranchName
        if ($branchExists) {
            git worktree add $TargetFolder $BranchName
        } else {
            git worktree add -b $BranchName $TargetFolder
        }

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[THANH CONG] Worktree da duoc tao tai: $TargetFolder" -ForegroundColor Green
            Write-Host "Ban hoac Antigravity co the mo thu muc nay de code doc lap!" -ForegroundColor Yellow
            Write-Host "De day nhanh len GitHub, chay: .\scripts\worktree.ps1 push $BranchName" -ForegroundColor Cyan
        } else {
            Write-Error "Khong the tao worktree. Vui long kiem tra lai trang thai git!"
        }
    }

    "push" {
        if (-not $BranchName) {
            Write-Error "Vui long nhap ten nhanh can day len GitHub! Vi du: .\scripts\worktree.ps1 push feature-moi"
            exit 1
        }

        Write-Host "`n[+] Dang day nhanh '$BranchName' len GitHub (origin)..." -ForegroundColor Cyan
        git push -u origin $BranchName

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[THANH CONG] Da day nhanh '$BranchName' len GitHub!" -ForegroundColor Green
        } else {
            Write-Warning "Khong the push len GitHub. Hay dam bao ban da cau hinh remote 'origin' va dang nhap GitHub!"
            Write-Host "Goi y kiem tra: git remote -v" -ForegroundColor Yellow
        }
    }

    "remove" {
        if (-not $BranchName) {
            Write-Error "Vui long nhap ten nhanh/worktree can xoa! Vi du: .\scripts\worktree.ps1 remove feature-moi"
            exit 1
        }

        $TargetFolder = Join-Path $WorktreeDir $BranchName
        Write-Host "`n[+] Dang xoa Git Worktree tai: $TargetFolder..." -ForegroundColor Cyan

        git worktree remove $TargetFolder --force
        git worktree prune

        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n[THANH CONG] Da go bo worktree '$BranchName' thanh cong!" -ForegroundColor Green
        } else {
            Write-Error "Gap loi khi xoa worktree. Thu chay git worktree prune!"
        }
    }
}
