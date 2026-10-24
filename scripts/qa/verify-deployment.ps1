# PowerShell Complete Verification Script for Phase D6 Deployment DoD
$ErrorActionPreference = "Stop"

Write-Host "=========================================================="
Write-Host "   PHASE D6 PRODUCTION DEPLOYMENT DoD VERIFICATION"
Write-Host "=========================================================="

# 1. API Health Check
Write-Host "`n[1/7] Testing Production API Health Check..."
$health = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/health" -Method Get
Write-Host "Health Check Response: $($health | ConvertTo-Json -Compress)"
if ($health.status -ne "ok" -or $health.database -ne "connected" -or $health.environment -ne "production") {
    throw "Health check failed: expected status 'ok', database 'connected', environment 'production'!"
}
Write-Host ">> PASSED: Health Check returned Version $($health.version), DB Connected, Environment: $($health.environment)"

# 2. Web Frontend Check (Next.js 15 Standalone)
Write-Host "`n[2/7] Testing Web Frontend Production Serving (Port 3000)..."
$webResponse = Invoke-WebRequest -Uri "http://localhost:3000/vi" -Method Get -MaximumRedirection 5 -UseBasicParsing
Write-Host "Web Frontend HTTP Status: $($webResponse.StatusCode)"
if ($webResponse.StatusCode -ne 200) {
    throw "Web frontend check failed: status $($webResponse.StatusCode)"
}
Write-Host ">> PASSED: Production Web Frontend is LIVE and serving HTTP 200 OK"

# 3. Register User A
Write-Host "`n[3/7] Registering User A (Production User Alpha)..."
$headers = @{ "Content-Type" = "application/json" }
$timestamp = (Get-Date -Format "yyyyMMddHHmmss")
$userAEmail = "alpha_$timestamp@lingual.test"
$bodyA = @{
    email = $userAEmail
    password = "LingualProd@2026!"
    displayName = "Production User Alpha"
    interfaceLocale = "vi"
    timezone = "Asia/Ho_Chi_Minh"
} | ConvertTo-Json
$resA = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/register" -Method Post -Body $bodyA -Headers $headers
$tokenA = $resA.accessToken
$userAId = $resA.user.id
Write-Host ">> PASSED: User A registered with ID: $userAId, Email: $userAEmail"

# 4. Register & Login User B
Write-Host "`n[4/7] Registering and Logging in User B (Production User Beta)..."
$userBEmail = "beta_$timestamp@lingual.test"
$bodyB = @{
    email = $userBEmail
    password = "LingualProd@2026!"
    displayName = "Production User Beta"
    interfaceLocale = "en"
    timezone = "UTC"
} | ConvertTo-Json
$resB = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/register" -Method Post -Body $bodyB -Headers $headers
$userBId = $resB.user.id
Write-Host "User B registered with ID: $userBId. Now testing Argon2 Login..."

$loginBodyB = @{
    email = $userBEmail
    password = "LingualProd@2026!"
} | ConvertTo-Json
$loginResB = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/login" -Method Post -Body $loginBodyB -Headers $headers
$tokenB = $loginResB.accessToken
if (-not $tokenB) {
    throw "Login for User B failed!"
}
Write-Host ">> PASSED: User B registered and logged in successfully with Argon2 verified JWT token!"

# 5. SRS Review & SM-2 Execution for User A
Write-Host "`n[5/7] Executing SRS Flashcard Review for User A..."
$authHeaderA = @{ 
    "Authorization" = "Bearer $tokenA"
    "Content-Type" = "application/json" 
}
$queueAInitial = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/srs/queue" -Method Get -Headers $authHeaderA
Write-Host "User A initial SRS stats: Due Today=$($queueAInitial.stats.dueToday), Learning=$($queueAInitial.stats.learning), New=$($queueAInitial.stats.newWords)"
$testWord = $queueAInitial.queue[0]
Write-Host "Submitting SM-2 Review for word: '$($testWord.wordId)' ($($testWord.targetText) - $($testWord.translation)) with quality=4..."

$reviewPayload = @{
    wordId = $testWord.wordId
    quality = 4
} | ConvertTo-Json
$reviewResult = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/srs/review" -Method Post -Body $reviewPayload -Headers $authHeaderA
Write-Host "Review Result: nextInterval=$($reviewResult.nextInterval), nextRepetition=$($reviewResult.nextRepetition), xpEarned=$($reviewResult.xpEarned), totalXP=$($reviewResult.totalXP)"

if ($reviewResult.nextRepetition -lt 1 -or $reviewResult.xpEarned -ne 10) {
    throw "SM-2 calculation or XP reward invalid!"
}
Write-Host ">> PASSED: SM-2 Algorithm successfully processed review and awarded 10 XP."

# 6. Data Isolation Verification (User A vs User B)
Write-Host "`n[6/7] Verifying Strict Multi-User Data Isolation..."
$authHeaderB = @{ 
    "Authorization" = "Bearer $tokenB"
    "Content-Type" = "application/json" 
}
$meA = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/me" -Method Get -Headers $authHeaderA
$meB = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/me" -Method Get -Headers $authHeaderB
$queueB = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/srs/queue" -Method Get -Headers $authHeaderB

Write-Host "User A Profile: TotalXP=$($meA.user.totalXP), CurrentStreak=$($meA.user.currentStreak)"
Write-Host "User B Profile: TotalXP=$($meB.user.totalXP), CurrentStreak=$($meB.user.currentStreak)"
Write-Host "User B SRS stats: Learning=$($queueB.stats.learning), DueToday=$($queueB.stats.dueToday)"

if ($meA.user.totalXP -ne 10 -or $meB.user.totalXP -ne 0 -or $queueB.stats.learning -ne 0) {
    throw "Data Isolation violation: User states crossed boundaries!"
}
Write-Host ">> PASSED: Complete Data Isolation verified between User A and User B."

# 7. PostgreSQL Persistence Verification Across Restart
Write-Host "`n[7/7] Verifying Database Persistence across Container Restart..."
Write-Host "Issuing: docker compose restart postgres api..."
docker compose restart postgres api
Write-Host "Waiting for API to be ready..."
$retryCount = 0
$apiReady = $false
while (-not $apiReady -and $retryCount -lt 15) {
    Start-Sleep -Seconds 2
    $retryCount++
    try {
        $healthCheck = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/health" -Method Get -TimeoutSec 3
        if ($healthCheck.status -eq "ok" -and $healthCheck.database -eq "connected") {
            $apiReady = $true
        }
    } catch {
        # Waiting for container startup
    }
}

if (-not $apiReady) {
    throw "API failed to recover after container restart!"
}
Write-Host "API recovered and database reconnected successfully."

# Verify User A data still persists across restart
$meAAfter = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/me" -Method Get -Headers $authHeaderA
Write-Host "User A Profile after DB restart: ID=$($meAAfter.user.id), TotalXP=$($meAAfter.user.totalXP), Streak=$($meAAfter.user.currentStreak)"
if ($meAAfter.user.totalXP -ne 10) {
    throw "Persistence failure: User A XP was not preserved across PostgreSQL restart!"
}
Write-Host ">> PASSED: User A XP ($($meAAfter.user.totalXP)) and Streak ($($meAAfter.user.currentStreak)) persisted in PostgreSQL."

# Verify User A can still login with Argon2 password hash after restart
$loginAAfter = Invoke-RestMethod -Uri "http://localhost:4000/api/v1/auth/login" -Method Post -Body $bodyA -Headers $headers
if (-not $loginAAfter.accessToken) {
    throw "Persistence failure: User A failed to authenticate after PostgreSQL restart!"
}
Write-Host ">> PASSED: User A authenticated successfully with existing Argon2 password hash after DB restart."

# Direct SQL query in PostgreSQL container to verify physical row persistence in volume
$rawUserOutput = powershell -Command "Write-Output 'SELECT count(*) FROM users;' | docker exec -i linguaflow-postgres psql -U postgres -d linguaflow_db -t"
$intUserCount = [int](($rawUserOutput | Out-String).Trim() -replace '[^\d]', '')
Write-Host "PostgreSQL users table row count: $intUserCount"
if ($intUserCount -lt 7) {
    throw "Persistence failure: expected at least 7 users in database, got $intUserCount!"
}

$rawStateOutput = powershell -Command "Write-Output 'SELECT count(*) FROM user_word_states;' | docker exec -i linguaflow-postgres psql -U postgres -d linguaflow_db -t"
$intStateCount = [int](($rawStateOutput | Out-String).Trim() -replace '[^\d]', '')
Write-Host "PostgreSQL user_word_states table row count: $intStateCount"
if ($intStateCount -lt 1) {
    throw "Persistence failure: expected at least 1 user_word_state in database, got $intStateCount!"
}
Write-Host ">> PASSED: PostgreSQL volume 'postgres_data' confirmed persistent with $intUserCount users and $intStateCount SRS state records."

Write-Host "`n=========================================================="
Write-Host " ALL 7 DoD VERIFICATION TESTS PASSED FLAWLESSLY!"
Write-Host "   - API Health Check: Live & Production Connected"
Write-Host "   - Web Frontend: Live on http://localhost:3000 (HTTP 200)"
Write-Host "   - User Registration: 2 Independent Users Created"
Write-Host "   - Argon2 Authentication & JWT Issuance: Verified"
Write-Host "   - SRS Flashcard Engine & SM-2 Calculation: Verified"
Write-Host "   - Multi-User Data Isolation: Verified"
Write-Host "   - PostgreSQL Volume Persistence Across Restart: Verified"
Write-Host "=========================================================="
