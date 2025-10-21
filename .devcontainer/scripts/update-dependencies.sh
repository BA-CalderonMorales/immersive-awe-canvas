#!/bin/bash
set -e

echo "🔄 Updating Immersive Awe Canvas dependencies..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Update Bun itself
echo "🥟 Updating Bun..."
curl -fsSL https://bun.sh/install | bash

# Update project dependencies
echo "📚 Updating project dependencies..."
bun update

# Run tests to ensure nothing broke
echo "🧪 Running tests..."
bun run test

# Run type checking
echo "🔍 Running type check..."
bun run typecheck

# Build to ensure everything works
echo "🔨 Building project..."
bun run build

echo "✅ All dependencies updated successfully!"
echo ""
echo "💡 Review CHANGELOG.md for any breaking changes"
echo "💡 Check GitHub releases: https://github.com/BA-CalderonMorales/immersive-awe-canvas/releases"