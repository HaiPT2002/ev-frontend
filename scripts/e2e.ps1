Param()

# Simple end-to-end smoke test script (PowerShell).
# It attempts to start the Spring Boot backend (using mvnw.cmd in the repo root),
# waits for the backend to respond on /api/vehicles, then performs a simple GET
# and reports success. Finally it attempts to stop the started process.

$root = Resolve-Path "..\.."
Write-Host "Workspace root:" $root

# Start backend via mvnw.cmd from workspace root
$mvnw = Join-Path $root 'mvnw.cmd'
if (-Not (Test-Path $mvnw)) {
  Write-Error "mvnw.cmd not found at $mvnw. Cannot start backend."
  exit 2
}

Write-Host "Starting backend with mvnw..."
$proc = Start-Process -FilePath $mvnw -ArgumentList 'spring-boot:run' -WorkingDirectory $root -PassThru
Write-Host "Started process PID:" $proc.Id

# wait for backend to be ready
$url = 'http://localhost:8080/api/vehicles'
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
  try {
    $r = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 2
    Write-Host "Backend responded; sample items:" ($r | Measure-Object).Count
    $ready = $true
    break
  } catch {
    Start-Sleep -Seconds 2
  }
}

if (-Not $ready) {
  Write-Error "Backend did not become ready within timeout."
  # Attempt to stop process
  try { Stop-Process -Id $proc.Id -Force } catch {}
  exit 3
}

Write-Host "Running simple API checks..."
try {
  $vehicles = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5
  Write-Host "GET /api/vehicles OK (count =" ($vehicles | Measure-Object).Count ")"
  Write-Host "E2E smoke test succeeded."
} catch {
  Write-Error "API check failed: $_"
}

# Stop backend process
try {
  Stop-Process -Id $proc.Id -Force
  Write-Host "Stopped backend process."
} catch {
  Write-Warning "Failed to stop process $($proc.Id): $_"
}

exit 0
