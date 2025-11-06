# Deploy to GitHub Pages

Build and deploy the application to GitHub Pages with proper asset path configuration.

## What This Does

1. Runs full build with GitHub Pages configuration
2. Validates build output and assets
3. Tests critical paths in production build
4. Deploys to gh-pages branch
5. Verifies deployment success

## Usage

```bash
/deploy-gh-pages [--skip-tests]
```

Examples:
- `/deploy-gh-pages` - Full build, test, and deploy
- `/deploy-gh-pages --skip-tests` - Deploy without tests

## Deployment Steps

1. **Pre-Deploy Validation**
   - Run TypeScript type checking
   - Run linting and formatting checks
   - Ensure no console errors in code

2. **Build**
   - Set VITE_DEPLOY_TARGET=github
   - Run production build
   - Verify asset prefix configuration
   - Check bundle size

3. **Test Build**
   - Serve production build locally
   - Test critical user paths
   - Verify asset loading
   - Check for 404 errors

4. **Deploy**
   - Push dist/ to gh-pages branch
   - Verify deployment on GitHub
   - Test live site

5. **Post-Deploy**
   - Verify site loads correctly
   - Check console for errors
   - Test key features
   - Update deployment documentation

## Configuration

- Asset Prefix: `/immersive-awe-canvas/`
- Output Directory: `dist/`
- Branch: `gh-pages`
- Domain: Set in GitHub repo settings

## Troubleshooting

- If assets 404: Check assetPrefix in rsbuild.config.ts
- If routes 404: Add 404.html fallback
- If build fails: Check environment variables
- If slow: Enable bundle analysis with BUNDLE_ANALYZE=1
