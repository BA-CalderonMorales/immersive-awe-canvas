# Repository Workflow Rules

These rules keep development consistent across the project. The document is intentionally brief so it can be referenced often.

## General Principles

- Follow Test-Driven Development. Write tests before production code and keep changes small.
- Use strict TypeScript and prefer immutable patterns.
- When looking for solutions, consult **context7** and the guidance in **MEMORY.md**. Do not copy text from MEMORY.md into this file.
- Avoid modifying App.tsx or vite.config deployment settings unless absolutely necessary to keep the live sites accessible.

## Local Workflow

Use these npm/bun scripts during feature work:

- `npm ci` or `bun install` – install dependencies
- `npm start` or `bun dev` – run the development server
- `npm run ios` or `bun ios` – run the iOS app
- `npm run android` or `bun android` – run the Android app
- `npm test` or `bun test` – run the full test suite
- `npm run typecheck` or `bun typecheck` – run TypeScript checks
- `npm run build` or `bun build` – build release artifacts

Run `npm ci` or `bun install`, `npm test` or `bun test`, `npm run typecheck` or `bun typecheck`, and `npm run build` or `bun build` before pushing changes. CI uses the same commands.

## Commit Standards

Commits must use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Examples:

```
feat: add dark mode toggle
fix: handle null todo values  
chore: update dependencies
perf: optimize render performance
docs: update API documentation
```

### Semantic Versioning Rules

**IMPORTANT**: Project follows semantic versioning starting from v0.0.1. Version bumps are automated via semantic-release.

**PATCH** version bumps (e.g., 0.0.1 → 0.0.2):
- `chore:` commits - maintenance and tooling changes
- `perf:` commits - performance improvements
- `docs:` commits - documentation updates
- `style:` commits - code formatting and style changes
- `test:` commits - test additions and improvements
- `hotfix:` commits - emergency bug fixes

**MINOR** version bumps (e.g., 0.0.1 → 0.1.0):
- `fix:` commits - bug fixes and corrections
- `feat:` commits - new features and functionality

**MAJOR** version bumps (e.g., 0.1.0 → 1.0.0):
- `breaking:` commits - breaking changes
- `refactor:` commits - code restructuring (potentially breaking)

**Version Reset Policy**: If project needs version reset, use the manage-releases.yml workflow or manual deletion of releases/tags, then create a `feat:` commit to trigger new initial release.

## Version Management

### Automated Versioning

Versions are **automatically** managed by semantic-release based on conventional commits. Manual version commands are **not used**.

### GitHub Workflows

- **semantic-release.yml**: Automatically creates releases on push to main
- **manage-releases.yml**: Manual workflow for deleting releases/tags (version reset)

### Version Reset Process

If version reset is needed (e.g., premature v1.0.0):

1. **Delete releases**: `gh release delete vX.X.X --yes`
2. **Delete local tags**: `git tag -d vX.X.X`
3. **Delete remote tags**: `git push origin --delete vX.X.X`
4. **Create trigger commit**: `git commit --allow-empty -m "feat: initialize project at vX.X.X"`
5. **Push to trigger release**: `git push`

### Version Monitoring

```bash
# Check current releases
gh release list

# Monitor workflow progress
gh run list --workflow=semantic-release.yml
gh run watch

# Check git tags
git tag -l
```

## Pull Requests

Prefix PR titles to show intent:

- **Feature:** … → merge into `develop`
- **Bugfix:** … → merge into `develop`
- **Cleanup:** … → merge into `develop`
- **Pipeline:** … → merge into `develop`
- **Hotfix:** … → merge directly to `main`

Include a **Codex CI** section summarising `install`, `build`, `typecheck`, and `test` results.

After merging into `develop`, automatically open a PR that merges `develop` into `main` so changes can be tested against the main branch.

## Continuous Integration

All dependencies must be installed with `npm ci` in CI jobs. The Super-Linter runs on every pull request via `.github/workflows/super-linter.yml`.
