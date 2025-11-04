#!/bin/bash

# Quick fix script to add yt-dlp to PATH and verify installation

echo "🔍 Checking for yt-dlp installation..."

# Check if yt-dlp exists in common locations
if [ -f "$HOME/.local/bin/yt-dlp" ]; then
    echo "✓ Found yt-dlp at: $HOME/.local/bin/yt-dlp"
    
    # Add to PATH for current session
    export PATH="$HOME/.local/bin:$PATH"
    echo "✓ Added to PATH for current session"
    
    # Verify it works
    if command -v yt-dlp &> /dev/null; then
        echo "✓ yt-dlp is now accessible: $(yt-dlp --version)"
    fi
    
    # Add to ~/.bashrc if not already there
    if ! grep -q ".local/bin" ~/.bashrc 2>/dev/null; then
        echo "" >> ~/.bashrc
        echo "# Add pipx/local bin to PATH" >> ~/.bashrc
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
        echo "✓ Added to ~/.bashrc for future sessions"
    else
        echo "✓ Already in ~/.bashrc"
    fi
    
elif [ -f "/usr/local/bin/yt-dlp" ]; then
    echo "✓ Found yt-dlp at: /usr/local/bin/yt-dlp"
    echo "✓ Version: $(/usr/local/bin/yt-dlp --version)"
    
elif [ -f "/usr/bin/yt-dlp" ]; then
    echo "✓ Found yt-dlp at: /usr/bin/yt-dlp"
    echo "✓ Version: $(/usr/bin/yt-dlp --version)"
    
else
    echo "❌ yt-dlp not found. Installing now..."
    
    # Try different installation methods
    if sudo apt-get install -y yt-dlp 2>/dev/null; then
        echo "✓ Installed via apt"
    elif sudo pip3 install --break-system-packages --no-cache-dir yt-dlp 2>/dev/null; then
        echo "✓ Installed via pip"
        export PATH="$HOME/.local/bin:$PATH"
    else
        echo "❌ Installation failed. Please install manually:"
        echo "   sudo pip3 install --break-system-packages yt-dlp"
        exit 1
    fi
fi

echo ""
echo "✅ Done! yt-dlp should now be accessible."
echo ""
echo "To use in current session, run:"
echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
echo ""
echo "Or restart your shell/session."

