$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$outDir = 'c:\Study\HocKy6\LinguaFlow\docs\ui-screenshots\r1-batch1'

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$pages = @(
    @{ name = "home"; url = "http://localhost:3001/" },
    @{ name = "dashboard"; url = "http://localhost:3001/dashboard" },
    @{ name = "login"; url = "http://localhost:3001/login" },
    @{ name = "register"; url = "http://localhost:3001/register" }
)

Write-Host "=========================================================="
Write-Host "   CAPTURING SCREENSHOTS FOR R1 BATCH 1"
Write-Host "=========================================================="

foreach ($p in $pages) {
    $pName = $p.name
    $pUrl = $p.url
    
    # 1. Desktop: 1440x900
    $desktopOut = "$outDir\${pName}-desktop.png"
    Remove-Item -Force $desktopOut -ErrorAction SilentlyContinue
    $tempProfileD = "$env:TEMP\edge_p_" + [System.Guid]::NewGuid().ToString()
    Write-Host "`nCapturing Desktop: ${pName} (1440x900) from $pUrl..."
    Start-Process -FilePath $edge -ArgumentList "--headless", "--disable-gpu", "--no-first-run", "--user-data-dir=""$tempProfileD""", "--window-size=1440,900", "--screenshot=""$desktopOut""", "$pUrl" -Wait
    Start-Sleep -Milliseconds 800
    
    # 2. Mobile: 390x844
    $mobileOut = "$outDir\${pName}-mobile.png"
    Remove-Item -Force $mobileOut -ErrorAction SilentlyContinue
    $tempProfileM = "$env:TEMP\edge_p_" + [System.Guid]::NewGuid().ToString()
    Write-Host "Capturing Mobile: ${pName} (390x844) from $pUrl..."
    Start-Process -FilePath $edge -ArgumentList "--headless", "--disable-gpu", "--no-first-run", "--user-data-dir=""$tempProfileM""", "--window-size=390,844", "--screenshot=""$mobileOut""", "$pUrl" -Wait
    Start-Sleep -Milliseconds 800
}

Write-Host "`n=========================================================="
Write-Host " BATCH 1 SCREENSHOTS CAPTURED:"
Write-Host "=========================================================="
Get-ChildItem $outDir | Select-Object Name, Length, LastWriteTime
