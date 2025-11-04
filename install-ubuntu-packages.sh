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

# Install yt-dlp - try multiple methods
echo "📥 Installing yt-dlp..."

YTDLP_INSTALLED=false

# Method 1: Try pipx (recommended for CLI tools in externally-managed environments)
if command -v pipx &> /dev/null; then
    echo "   Trying pipx installation..."
    pipx ensurepath 2>/dev/null || true
    
    # Try to install with pipx
    if pipx install yt-dlp 2>/dev/null; then
        echo "✓ yt-dlp installed via pipx"
        YTDLP_INSTALLED=true
        
        # Check if it's in the expected location
        if [ -f "$HOME/.local/bin/yt-dlp" ]; then
            echo "   Location: $HOME/.local/bin/yt-dlp"
        fi
    else
        echo "   ⚠ pipx installation failed, trying alternatives..."
    fi
fi

# Method 2: Try apt (if pipx didn't work or isn't available)
if [ "$YTDLP_INSTALLED" = false ]; then
    if apt-cache show yt-dlp &> /dev/null; then
        echo "   Trying apt installation..."
        if sudo apt-get install -y yt-dlp 2>/dev/null; then
            echo "✓ yt-dlp installed via apt"
            YTDLP_INSTALLED=true
        fi
    fi
fi

# Method 3: Try pip with --break-system-packages (last resort)
if [ "$YTDLP_INSTALLED" = false ]; then
    echo "   Trying pip installation (with --break-system-packages)..."
    if sudo pip3 install --break-system-packages --no-cache-dir yt-dlp 2>/dev/null; then
        echo "✓ yt-dlp installed via pip"
        YTDLP_INSTALLED=true
    fi
fi

# Method 4: Install pipx first if it's not available, then try again
if [ "$YTDLP_INSTALLED" = false ] && ! command -v pipx &> /dev/null; then
    echo "   Installing pipx first..."
    if sudo apt-get install -y pipx 2>/dev/null; then
        pipx ensurepath 2>/dev/null || true
        if pipx install yt-dlp 2>/dev/null; then
            echo "✓ yt-dlp installed via pipx (after installing pipx)"
            YTDLP_INSTALLED=true
        fi
    fi
fi

if [ "$YTDLP_INSTALLED" = false ]; then
    echo "❌ Failed to install yt-dlp using all methods"
    echo "   Please install manually using one of the following:"
    echo "   1. pipx install yt-dlp"
    echo "   2. sudo apt-get install yt-dlp"
    echo "   3. sudo pip3 install --break-system-packages yt-dlp"
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

# Check for yt-dlp in multiple locations
YTDLP_FOUND=false
YTDLP_PATH=""

# Check in PATH first
if command -v yt-dlp &> /dev/null; then
    YTDLP_PATH=$(command -v yt-dlp)
    YTDLP_FOUND=true
elif [ -f "$HOME/.local/bin/yt-dlp" ]; then
    # Check pipx installation path
    YTDLP_PATH="$HOME/.local/bin/yt-dlp"
    YTDLP_FOUND=true
elif [ -f "/usr/local/bin/yt-dlp" ]; then
    YTDLP_PATH="/usr/local/bin/yt-dlp"
    YTDLP_FOUND=true
elif [ -f "/usr/bin/yt-dlp" ]; then
    YTDLP_PATH="/usr/bin/yt-dlp"
    YTDLP_FOUND=true
fi

if [ "$YTDLP_FOUND" = true ]; then
    YTDLP_VERSION=$($YTDLP_PATH --version 2>/dev/null || echo "installed")
    echo "✓ yt-dlp: $YTDLP_VERSION (found at: $YTDLP_PATH)"
    
    # If it's in ~/.local/bin, add to PATH note
    if [[ "$YTDLP_PATH" == *"/.local/bin/"* ]]; then
        echo "   Note: Add to PATH: export PATH=\"\$HOME/.local/bin:\$PATH\""
        echo "   Or add to ~/.bashrc: echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc"
    fi
else
    echo "✗ yt-dlp: Not found in PATH or common locations"
    echo ""
    echo "   Troubleshooting steps for remote server:"
    echo "   1. Reload your shell: source ~/.bashrc"
    echo "   2. Or add to PATH: export PATH=\"\$HOME/.local/bin:\$PATH\""
    echo "   3. Or install manually: sudo pip3 install --break-system-packages yt-dlp"
    echo "   4. Verify installation: $HOME/.local/bin/yt-dlp --version"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Package installation completed!"
echo ""
echo "All required packages for the Video Image Capture app are now installed."

