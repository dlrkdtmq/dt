# serve-build.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 1. 기존 serve 종료
$serveProcess = Get-Process | Where-Object { $_.Path -like "*serve*" -and $_.MainWindowTitle -eq "" }
if ($serveProcess) {
    Write-Output "기존 serve 종료 중..."
    $serveProcess | Stop-Process -Force
    Start-Sleep -Seconds 1
}

# 2. 빌드
Write-Output "빌드 시작..."
npm run build

# 3. serve 실행 (포그라운드, VSCode 터미널에 표시)
Write-Output "서버 실행 중 (http://localhost:3000)..."
npx serve -s build
