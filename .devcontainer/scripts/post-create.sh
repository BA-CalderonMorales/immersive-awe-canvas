#!/bin/bash
set -e

echo "Setting up Immersive Awe Canvas development environment..."

# Verify installations
echo "Development environment verification:"
echo "Node.js environment:"
node --version
npm --version

echo "Bun environment:"
bun --version

echo "Version control:"
git --version

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
    echo "Custom PS1 prompt already present in bashrc."
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
    echo "Welcome to Immersive Awe Canvas development!"
    echo "Environment: Node.js $(node --version 2>/dev/null || echo 'N/A') + Bun $(bun --version 2>/dev/null || echo 'N/A')"
    echo "TypeScript $(tsc --version 2>/dev/null || echo 'N/A')"
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
    echo "Immersive Awe Canvas welcome prompt already present in bashrc."
fi

# Install project dependencies with Bun
echo "Installing dependencies with Bun..."
bun install

# Set up git hooks (if using husky)
if [ -f "package.json" ] && grep -q "husky" package.json; then
    echo "Setting up git hooks..."
    bun run prepare || true
fi

# Build the project to ensure everything works
echo "Running initial build..."
bun run build

# Run type checking
echo "Running type check..."
bun run typecheck

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
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
    echo "Created .env.local template. Please configure your environment variables."
fi

echo ""
echo "Development environment setup complete!"
echo "Run 'bun run dev' to start the development server."
echo ""
