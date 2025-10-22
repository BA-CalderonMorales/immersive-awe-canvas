#!/bin/bash
set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Immersive Awe Canvas - Development Environment Setup        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Verify all required tools are installed
echo "Verifying installation..."
echo "  ✓ Node.js:    $(node --version)"
echo "  ✓ npm:        $(npm --version)"
echo "  ✓ Bun:        $(bun --version)"
echo "  ✓ TypeScript: $(tsc --version)"
echo "  ✓ Git:        $(git --version)"
echo "  ✓ GitHub CLI: $(gh --version 2>/dev/null | head -1 || echo 'Not installed')"
echo ""

# Run the post-create setup
echo "Running post-create setup..."
bash "$(dirname "$0")/post-create.sh"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Setup complete! You're ready to develop.                    ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
