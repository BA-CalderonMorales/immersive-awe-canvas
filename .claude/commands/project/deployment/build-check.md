# Build Quality Check

Run comprehensive build quality checks including TypeScript, linting, tests, and bundle analysis.

## What This Does

1. Runs TypeScript type checking
2. Runs Biome linting and formatting
3. Executes test suite
4. Analyzes bundle size
5. Checks for common issues
6. Generates quality report

## Usage

```bash
/build-check [--fix]
```

Examples:
- `/build-check` - Run all checks
- `/build-check --fix` - Run checks and auto-fix issues

## Checks Performed

1. **TypeScript Validation**
   ```bash
   bun run typecheck
   ```
   - Strict mode compilation
   - Type errors and warnings
   - Unused variables/imports

2. **Code Quality**
   ```bash
   bun run lint
   bun run format:check
   ```
   - Biome linting rules
   - Code formatting consistency
   - Import organization

3. **Test Suite**
   ```bash
   bun run test
   bun run test:api
   ```
   - Unit tests (54+ tests)
   - API integration tests
   - Architecture tests

4. **Build Validation**
   ```bash
   bun run build
   ```
   - Production build success
   - Bundle size analysis
   - Asset optimization
   - Tree shaking verification

5. **Security Checks**
   - Check for console.log in production
   - Verify no sensitive data in code
   - Check dependency vulnerabilities

## Quality Report

- Total issues found: X
- Critical: X
- Warnings: X
- TypeScript errors: X
- Lint errors: X
- Test failures: X
- Bundle size: X MB (Target: < 1MB)

## Exit Codes

- 0: All checks passed
- 1: Critical issues found
- 2: Warnings found (non-blocking)
