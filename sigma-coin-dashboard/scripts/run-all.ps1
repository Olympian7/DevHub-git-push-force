    $ErrorActionPreference = "Stop"

function Test-PortOpen {
    param([int]$Port)

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $iar = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        $connected = $iar.AsyncWaitHandle.WaitOne(500)
        if (-not $connected) {
            return $false
        }
        $client.EndConnect($iar)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Close()
    }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $projectRoot "backend"
$pythonExe = "c:/VSCODE/.venv/Scripts/python.exe"

$jobsToStart = @(
    @{
        Name = "sigma-frontend"
        Port = 3000
        Script = {
            param($root)
            Set-Location $root
            npm run dev
        }
        Args = @($projectRoot)
    },
    @{
        Name = "sigma-backend"
        Port = 5000
        Script = {
            param($root)
            Set-Location $root
            npm run dev
        }
        Args = @($backendRoot)
    },
    @{
        Name = "sigma-ml"
        Port = 8000
        Script = {
            param($root, $py)
            Set-Location $root
            if (Test-Path $py) {
                & $py -m uvicorn main:app --app-dir ml-service --reload --port 8000
            }
            else {
                python -m uvicorn main:app --app-dir ml-service --reload --port 8000
            }
        }
        Args = @($projectRoot, $pythonExe)
    }
)

foreach ($job in $jobsToStart) {
    if (Test-PortOpen -Port $job.Port) {
        Write-Host ("Skipping {0}: port {1} already in use." -f $job.Name, $job.Port) -ForegroundColor Yellow
        continue
    }

    $existing = Get-Job -Name $job.Name -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Host ("Skipping {0}: job already exists." -f $job.Name) -ForegroundColor Yellow
        continue
    }

    Start-Job -Name $job.Name -ScriptBlock $job.Script -ArgumentList $job.Args | Out-Null
    Write-Host ("Started {0}." -f $job.Name) -ForegroundColor Green
}

Write-Host ""
Write-Host "Current jobs:" -ForegroundColor Cyan
$sigmaJobs = Get-Job -Name "sigma-*" -ErrorAction SilentlyContinue
if ($sigmaJobs) {
    $sigmaJobs | Format-Table Id, Name, State -AutoSize
}
else {
    Write-Host "No sigma background jobs in this terminal session."
}

Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  Receive-Job -Name sigma-frontend -Keep"
Write-Host "  Receive-Job -Name sigma-backend -Keep"
Write-Host "  Receive-Job -Name sigma-ml -Keep"
Write-Host "  .\\scripts\\stop-all.ps1"
