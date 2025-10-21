#!/bin/bash
set -e

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Immersive Awe Canvas Development Environment"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Show environment info
echo "Environment:"
echo "  Node.js:    $(node --version 2>/dev/null || echo 'N/A')"
echo "  Bun:        $(bun --version 2>/dev/null || echo 'N/A')"
echo "  TypeScript: $(tsc --version 2>/dev/null || echo 'N/A')"
echo ""

# Show git status
echo "Repository Status:"
echo "  Branch:     $(git branch --show-current 2>/dev/null || echo 'N/A')"
echo "  Status:     $(git status --short 2>/dev/null | wc -l | xargs) file(s) modified"
echo ""

# Show recent commits
echo "Recent Commits:"
git log --oneline -3 2>/dev/null || echo "  No commits available"
echo ""

# Check if dependencies need updating
if [ -f "package.json" ]; then
    echo "Checking for dependency updates..."
    bun outdated 2>/dev/null | head -10 || echo "  All dependencies up to date"
fi

echo ""
echo "Quick Start:"
echo "  bun run dev             # Start development server"
echo "  bun run build           # Build for production"
echo "  bun run test            # Run tests"
echo "  bun run typecheck       # Type checking"
echo "  bun run check           # Lint & format check"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
