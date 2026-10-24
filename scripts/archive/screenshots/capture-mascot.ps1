# Capture 8 representative mascot integration screenshots via Microsoft Edge headless
$outDir = "C:\Study\HocKy6\LinguaFlow\docs\ui-screenshots\r1-mascot"
if (!(Test-Path $outDir)) {
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$shots = @(
  @{ name = "01-tutor-mascot.png"; url = "http://localhost:3000/tutor"; w = 1280; h = 900; delay = 0 },
  @{ name = "02-listening-headphones.png"; url = "http://localhost:3000/listening"; w = 1280; h = 900; delay = 0 },
  @{ name = "03-speaking-mic.png"; url = "http://localhost:3000/speaking"; w = 1280; h = 900; delay = 0 },
  @{ name = "04-writing-author.png"; url = "http://localhost:3000/writing"; w = 1280; h = 900; delay = 0 },
  @{ name = "05-exam-history-trophy.png"; url = "http://localhost:3000/exam-practice/history"; w = 1280; h = 900; delay = 0 },
  @{ name = "06-mock-test-stopwatch.png"; url = "http://localhost:3000/ielts/mock-test"; w = 1280; h = 950; delay = 0 },
  @{ name = "07-games-laugh-tease.png"; url = "http://localhost:3000/games"; w = 1280; h = 900; delay = 0 },
  @{ name = "08-empty-state-shrug.png"; url = "http://localhost:3000/dictionary?q=xyznonexistent123"; w = 1280; h = 1450; delay = 3000 }
)

foreach ($s in $shots) {
  $out = Join-Path $outDir $s.name
  $argsList = @("--headless", "--disable-gpu", "--window-size=$($s.w),$($s.h)", "--screenshot=$out")
  if ($s.delay -gt 0) {
    $argsList += "--virtual-time-budget=$($s.delay)"
  }
  $argsList += $s.url
  Write-Host "Capturing $($s.name)..."
  Start-Process -FilePath "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -ArgumentList $argsList -Wait
}
Write-Host "All 8 mascot screenshots captured successfully!"
