$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$outDir = 'c:\Study\HocKy6\LinguaFlow\docs\ui-screenshots\paper-interactions'

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$pages = @(
    @{ name = "01-home-flashcard-deck"; url = "http://localhost:3000/" },
    @{ name = "02-srs-library-card"; url = "http://localhost:3000/srs" },
    @{ name = "03-ielts-mock-test-stamps"; url = "http://localhost:3000/ielts/mock-test" },
    @{ name = "04-roadmap-red-thread"; url = "http://localhost:3000/roadmap" },
    @{ name = "05-games-ticket-cards"; url = "http://localhost:3000/games" },
    @{ name = "06-dictionary-catalog-drawers"; url = "http://localhost:3000/dictionary" },
    @{ name = "07-listening-cassette-odometer"; url = "http://localhost:3000/listening/practice" },
    @{ name = "08-analytics-highlighter-bars"; url = "http://localhost:3000/analytics" }
)

Write-Host "=========================================================="
Write-Host "   CAPTURING SCREENSHOTS FOR PAPER MICRO-INTERACTIONS"
Write-Host "=========================================================="

foreach ($p in $pages) {
    $pName = $p.name
    $pUrl = $p.url
    
    $desktopOut = "$outDir\${pName}.png"
    Remove-Item -Force $desktopOut -ErrorAction SilentlyContinue
    $tempProfile = "$env:TEMP\edge_p_" + [System.Guid]::NewGuid().ToString()
    Write-Host "Capturing: ${pName} from $pUrl..."
    Start-Process -FilePath $edge -ArgumentList "--headless", "--disable-gpu", "--no-first-run", "--user-data-dir=""$tempProfile""", "--window-size=1440,900", "--screenshot=""$desktopOut""", "$pUrl" -Wait
    Start-Sleep -Milliseconds 600
}

Write-Host "`nAll 8 screenshots successfully captured into $outDir!"
