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
    python3-venv \
    pipx \
    git

# Install yt-dlp using pipx (recommended for CLI tools in externally-managed environments)
echo "📥 Installing yt-dlp using pipx (recommended method)..."
if command -v pipx &> /dev/null; then
    # Use pipx to install yt-dlp (manages its own virtual environment)
    pipx ensurepath
    pipx install yt-dlp
    echo "✓ yt-dlp installed via pipx"
else
    echo "⚠ pipx not available, trying alternative methods..."
    
    # Alternative: Try to install yt-dlp via apt (if available)
    if apt-cache show yt-dlp &> /dev/null; then
        echo "📥 Installing yt-dlp via apt..."
        sudo apt-get install -y yt-dlp
    else
        # Last resort: Use pip with --break-system-packages (not recommended but may be necessary)
        echo "⚠ Installing yt-dlp via pip with --break-system-packages flag..."
        echo "   (This is not recommended but may be necessary for your system)"
        sudo pip3 install --break-system-packages --no-cache-dir yt-dlp
    fi
fi

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
    YTDLP_VERSION=$(yt-dlp --version 2>/dev/null || echo "installed")
    echo "✓ yt-dlp: $YTDLP_VERSION"
else
    echo "✗ yt-dlp: Not found"
    echo "   You may need to reload your shell or run: source ~/.bashrc"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Package installation completed!"
echo ""
echo "All required packages for the Video Image Capture app are now installed."

