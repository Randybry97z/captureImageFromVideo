#!/bin/bash

# Script to install all Ubuntu system packages required for the Video Image Capture app

set -e  # Exit on any error

echo "📦 Installing Ubuntu packages for Video Image Capture app..."

# Update package list
echo "🔄 Updating package list..."
sudo apt-get update

# Install system packages
echo "📥 Installing system packages..."
sudo apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    git

# Install yt-dlp using pip3
echo "📥 Installing yt-dlp (Python package)..."
sudo pip3 install --no-cache-dir yt-dlp

# Verify installations
echo ""
echo "✅ Verifying installations..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v ffmpeg &> /dev/null; then
    echo "✓ ffmpeg: $(ffmpeg -version | head -n1)"
else
    echo "✗ ffmpeg: Not found"
fi

if command -v python3 &> /dev/null; then
    echo "✓ python3: $(python3 --version)"
else
    echo "✗ python3: Not found"
fi

if command -v pip3 &> /dev/null; then
    echo "✓ pip3: $(pip3 --version)"
else
    echo "✗ pip3: Not found"
fi

if command -v git &> /dev/null; then
    echo "✓ git: $(git --version)"
else
    echo "✗ git: Not found"
fi

if command -v yt-dlp &> /dev/null; then
    echo "✓ yt-dlp: $(yt-dlp --version)"
else
    echo "✗ yt-dlp: Not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Package installation completed!"
echo ""
echo "All required packages for the Video Image Capture app are now installed."

