# Production Deployment Script for Video Image Capture (PowerShell)
# This script builds and deploys the Next.js application for production

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting production deployment..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeMajorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajorVersion -lt 18) {
    Write-Host "❌ Node.js version 18 or higher is required. Current version: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm." -ForegroundColor Red
    exit 1
}

# Clean previous builds
Write-Host "📦 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build the Next.js application
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (-not (Test-Path ".next")) {
    Write-Host "❌ Build failed! .next directory was not created." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build completed successfully!" -ForegroundColor Green

# Display build information
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "  Deployment Ready!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "To start the production server, run:" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or use Docker:" -ForegroundColor White
Write-Host "  docker-compose up -d" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor White
Write-Host "  http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Deployment script completed!" -ForegroundColor Green

