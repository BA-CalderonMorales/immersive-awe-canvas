#!/bin/bash
set -e

echo "🚀 Setting up Immersive Awe Canvas development environment..."

# Ensure proper ownership of workspace files (important for Codespaces)
echo ""
echo "Setting up workspace permissions..."
sudo chown -R vscode:vscode /workspaces/immersive-awe-canvas 2>/dev/null || echo "⚠️  Could not change ownership (non-blocking)"

# Verify environment
echo ""
echo "Development environment verification:"
echo "  Node.js:    $(node --version)"
echo "  npm:        $(npm --version)"
echo "  Bun:        $(bun --version)"
echo "  TypeScript: $(tsc --version)"
echo "  Git:        $(git --version)"
echo "  Git LFS:    $(git lfs version 2>/dev/null || echo 'Not installed')"
echo ""

# Initialize Git LFS
if command -v git-lfs &> /dev/null; then
    echo "Initializing Git LFS..."
    git lfs install --skip-smudge || echo "Git LFS initialization failed (non-blocking)"
fi

# Set up shell environment
echo "Setting up shell environment..."

# Add custom PS1 prompt
if ! grep -q "# Immersive Awe Canvas Custom PS1" ~/.bashrc; then
    echo "Adding custom PS1 prompt..."
    # shellcheck disable=SC2016  # Intentionally keep variables unexpanded in heredoc; evaluated by interactive shells later
    cat >> ~/.bashrc << 'EOF'

# Immersive Awe Canvas Custom PS1
# Color definitions
COL_USER='\[\e[96m\]'      # Cyan for [me]
COL_PATH='\[\e[93m\]'      # Yellow for path
COL_BRANCH='\[\e[92m\]'    # Green for branch
COL_BRACKETS='\[\e[90m\]'  # Dark gray for brackets and punctuation
COL_RESET='\[\e[0m\]'      # Reset color

parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'
}

set_bash_prompt() {
    local branch=$(parse_git_branch)
    if [ -n "$branch" ]; then
        PS1="${COL_BRACKETS}[${COL_USER}me${COL_BRACKETS}]:${COL_PATH}\w ${COL_BRACKETS}(${COL_BRANCH}$branch${COL_BRACKETS}): ${COL_RESET}"
    else
        PS1="${COL_BRACKETS}[${COL_USER}me${COL_BRACKETS}]:${COL_PATH}\w${COL_BRACKETS}: ${COL_RESET}"
    fi
}

PROMPT_COMMAND=set_bash_prompt
EOF
else
    echo "✓ Custom PS1 prompt already configured"
fi

# Add Immersive Awe Canvas development welcome message to bashrc
WELCOME_MARKER="# Immersive Awe Canvas Development Welcome"
if ! grep -q "$WELCOME_MARKER" ~/.bashrc; then
    echo "Adding Immersive Awe Canvas development prompt..."
    # shellcheck disable=SC2016  # Intentionally keep command substitutions and vars literal for later evaluation in interactive shells
    cat >> ~/.bashrc << 'EOF'

# Immersive Awe Canvas Development Welcome
if [ "$TERM" != "dumb" ] && [ -t 1 ]; then
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║  Welcome to Immersive Awe Canvas development!                ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Environment: Node.js $(node --version 2>/dev/null || echo 'N/A') + Bun $(bun --version 2>/dev/null || echo 'N/A')"
    echo ""
    echo "Available commands:"
    echo "  bun run dev             # Start development server (http://localhost:8080)"
    echo "  bun run build           # Build for production"
    echo "  bun run test            # Run tests"
    echo "  bun run typecheck       # Check TypeScript types"
    echo "  bun run lint            # Lint code with Biome"
    echo "  bun run format          # Format code with Biome"
    echo "  bun run check           # Run all checks (lint + format)"
    echo ""
fi
EOF
else
    echo "✓ Immersive Awe Canvas welcome prompt already configured"
fi

# Clean up any existing node_modules to avoid EEXIST errors
if [ -d "node_modules" ]; then
    echo ""
    echo "Cleaning up existing node_modules..."
    rm -rf node_modules
fi

# Clean up any stale bun cache if needed
if [ -d ".bun" ]; then
    echo "Cleaning up stale bun cache..."
    rm -rf .bun
fi

# Ensure .bun-cache directory is writable
mkdir -p ~/.bun/install/cache
chmod -R 755 ~/.bun 2>/dev/null || true

# Install project dependencies with Bun
echo ""
echo "Installing dependencies with Bun..."
# Use --backend=copyfile to avoid permission issues with hardlinks/symlinks
BUN_INSTALL_CACHE_DIR=~/.bun/install/cache bun install --backend=copyfile

# Set up git hooks (if using husky)
if [ -f "package.json" ] && grep -q "husky" package.json; then
    echo "Setting up git hooks..."
    bun run prepare 2>/dev/null || true
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "Creating .env.local template..."
    cat > .env.local << EOF
# Local development environment variables
# Copy this to .env.local and fill in your values

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Configuration (optional)
GITHUB_TOKEN=your_github_token

# Build Configuration
VITE_DEPLOY_TARGET=local
EOF
    echo "✓ Created .env.local template. Please configure your environment variables."
fi

# Run type checking
echo ""
echo "Running type check..."
bun run typecheck || echo "⚠️  Type check failed (non-blocking)"

# Build the project to ensure everything works
echo ""
echo "Running initial build..."
bun run build || echo "⚠️  Initial build failed (non-blocking)"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Development environment setup complete! ✓                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Run 'bun run dev' to start the development server."
echo ""
