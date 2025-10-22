# Immersive Awe Canvas - Dev Container Setup

## Overview

This dev container is configured for developing the Immersive Awe Canvas application with Node.js 20, Bun, and TypeScript.

## Key Features

- **Base Image**: Node.js 20 (Debian Bookworm)
- **Package Manager**: Bun v1.1.34 (with npm/npx fallback)
- **User**: `vscode` (UID 1001) for VS Code compatibility
- **Locale**: Full UTF-8 locale support (en_US.UTF-8)
- **Tools**: Git, Git LFS, GitHub CLI, TypeScript, Biome

## Architecture

Inspired by the terminal-jarvis dev container setup:

### 1. Dockerfile
- Uses official `node:20-bookworm` base image
- Installs and configures locales properly
- Creates `vscode` user with sudo access
- Installs Bun globally
- Sets up all environment variables

### 2. devcontainer.json
- Direct Dockerfile build (no docker-compose)
- Proper locale environment variables
- Lifecycle scripts (postCreateCommand, postStartCommand)
- VS Code extensions and settings
- Port forwarding (8080, 54321)

### 3. Setup Scripts

#### `post-create.sh`
Runs once when container is first created:
- Verifies all tools are installed
- Installs project dependencies with Bun
- Sets up custom bash prompt
- Configures welcome message
- Runs initial type check and build
- Creates `.env.local` template

#### `post-start.sh`
Runs each time the container starts:
- Shows environment info
- Displays git status and recent commits
- Lists available commands

#### `setup-dev-environment.sh`
Manual setup script for troubleshooting or re-running setup

## Rebuild Instructions

If you experience issues with the dev container:

### Option 1: Rebuild Container (Recommended)
1. Press `F1` or `Ctrl+Shift+P`
2. Run: `Dev Containers: Rebuild Container`
3. Wait for the build and post-create script to complete

### Option 2: Rebuild Without Cache
1. Press `F1` or `Ctrl+Shift+P`
2. Run: `Dev Containers: Rebuild Container Without Cache`
3. This will force a clean rebuild

### Option 3: Manual Setup
If the container is already running but setup didn't complete:
```bash
bash .devcontainer/scripts/setup-dev-environment.sh
```

## Troubleshooting

### Issue: "bun: command not found"
**Root Cause**: Container didn't build properly or wrong base image
**Solution**: Rebuild container without cache

### Issue: Locale warnings
**Root Cause**: Locale not configured in container
**Solution**: Already fixed in Dockerfile with proper locale-gen setup

### Issue: Permission errors
**Root Cause**: User mismatch between host and container
**Solution**: Using `vscode` user (UID 1001) for compatibility

### Issue: Dependencies not installed
**Root Cause**: post-create script didn't run
**Solution**: Run `bash .devcontainer/scripts/setup-dev-environment.sh` manually

## Environment Variables

The following environment variables are set in the container:

```bash
NODE_ENV=development
VITE_GIT_COMMIT_HASH=dev
LANG=en_US.UTF-8
LC_ALL=en_US.UTF-8
LC_CTYPE=en_US.UTF-8
LC_COLLATE=en_US.UTF-8
LC_MESSAGES=en_US.UTF-8
```

## Ports

- **8080**: Application development server
- **54321**: Supabase local development

## Differences from Docker Compose Setup

The previous setup used docker-compose.yml with features. The new setup:

1. ✅ Uses direct Dockerfile build (simpler, more control)
2. ✅ Proper locale configuration (no warnings)
3. ✅ Correct user setup (vscode instead of node)
4. ✅ All tools verified during build
5. ✅ Better aligned with terminal-jarvis proven patterns
6. ✅ More explicit environment variable setup

## Verification

After container starts, verify everything is working:

```bash
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
bun --version    # Should show 1.1.34
tsc --version    # Should show TypeScript version
locale           # Should show en_US.UTF-8
```

## Quick Start

Once the container is running:

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run test       # Run tests
bun run typecheck  # Type checking
bun run check      # Lint & format check
```

## Notes

- The container uses `waitFor: postCreateCommand` to ensure setup completes before opening
- Scripts are executable and use `set -e` for fail-fast behavior
- Git LFS is configured with `--skip-smudge` for faster clones
- All setup is idempotent - safe to re-run

## Credits

This setup is inspired by the terminal-jarvis dev container configuration, which has proven to be reliable and robust.
