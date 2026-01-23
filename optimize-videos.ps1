# Video optimization script for web
# Requires FFmpeg

$videosPath = "assets\videos"
$excludeFile = "LAMBO5.mp4"

Write-Host "Checking for FFmpeg..." -ForegroundColor Cyan

# Try to find FFmpeg
$ffmpegExe = $null

# First check in PATH
try {
    $ffmpegExe = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
} catch {}

# If not found, search in standard winget installation paths
if (-not $ffmpegExe) {
    $possiblePaths = @(
        "$env:LOCALAPPDATA\Microsoft\WinGet\Packages",
        "$env:ProgramFiles",
        "$env:ProgramFiles(x86)"
    )
    
    foreach ($basePath in $possiblePaths) {
        $found = Get-ChildItem -Path $basePath -Filter "ffmpeg.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $ffmpegExe = $found.FullName
            break
        }
    }
}

if (-not $ffmpegExe -or -not (Test-Path $ffmpegExe)) {
    Write-Host "ERROR: FFmpeg not found" -ForegroundColor Red
    Write-Host "Please install FFmpeg:" -ForegroundColor Yellow
    Write-Host "1. Download from https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "2. Or use: winget install ffmpeg" -ForegroundColor Yellow
    Write-Host "3. Or use: choco install ffmpeg" -ForegroundColor Yellow
    exit 1
}

Write-Host "FFmpeg found: $ffmpegExe" -ForegroundColor Green

$videoFiles = Get-ChildItem -Path $videosPath -File | Where-Object { $_.Name -ne $excludeFile }

if ($videoFiles.Count -eq 0) {
    Write-Host "No video files found (excluding $excludeFile)" -ForegroundColor Yellow
    exit 0
}

Write-Host "`nFound $($videoFiles.Count) video files to optimize" -ForegroundColor Cyan

# Create optimized folder
$optimizedPath = Join-Path $videosPath "optimized"
if (-not (Test-Path $optimizedPath)) {
    New-Item -ItemType Directory -Path $optimizedPath | Out-Null
    Write-Host "Created folder: $optimizedPath" -ForegroundColor Green
}

foreach ($video in $videoFiles) {
    $inputFile = $video.FullName
    # Convert all files to .mp4 for consistency
    $outputName = [System.IO.Path]::ChangeExtension($video.Name, ".mp4")
    $outputFile = Join-Path $optimizedPath $outputName
    
    # Skip if already optimized
    if (Test-Path $outputFile) {
        Write-Host "`nSkipping: $($video.Name) (already optimized)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "`nProcessing: $($video.Name)..." -ForegroundColor Cyan
    
    # Optimization parameters for web:
    # - H.264 codec (libx264) - best compatibility
    # - CRF 23 - good quality at reasonable size
    # - preset medium - balance between speed and size
    # - movflags faststart - allows playback before full download
    # - pix_fmt yuv420p - compatibility with all browsers
    # - maxrate and bufsize - bitrate limit for fast loading
    # - audio codec aac - web standard
    
    $ffmpegArgs = @(
        "-i", "`"$inputFile`"",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-maxrate", "2M",
        "-bufsize", "4M",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-y",
        "`"$outputFile`""
    )
    
    try {
        & $ffmpegExe $ffmpegArgs 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            $originalSize = (Get-Item $inputFile).Length / 1MB
            $optimizedSize = (Get-Item $outputFile).Length / 1MB
            $savings = [math]::Round((1 - $optimizedSize / $originalSize) * 100, 1)
            
            Write-Host "  Successfully optimized!" -ForegroundColor Green
            Write-Host "  Original size: $([math]::Round($originalSize, 2)) MB" -ForegroundColor Gray
            Write-Host "  New size: $([math]::Round($optimizedSize, 2)) MB" -ForegroundColor Gray
            Write-Host "  Savings: $savings%" -ForegroundColor Green
        } else {
            Write-Host "  Error during optimization" -ForegroundColor Red
        }
    } catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host "`nOptimization complete!" -ForegroundColor Green
Write-Host "Optimized videos are in: $optimizedPath" -ForegroundColor Cyan
