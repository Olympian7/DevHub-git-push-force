$ErrorActionPreference = "SilentlyContinue"

$jobs = Get-Job -Name "sigma-*"
if (-not $jobs) {
    Write-Host "No sigma jobs found."
    return
}

$jobs | Stop-Job
$jobs | Remove-Job

Write-Host "Stopped and removed sigma jobs."
