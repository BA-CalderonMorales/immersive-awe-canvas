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

- `chore:` commits trigger **patch** version bumps (e.g., 1.0.0 → 1.0.1)
- `fix:`, `feat:`, and `perf:` commits trigger **minor** version bumps (e.g., 1.0.0 → 1.1.0)
- `breaking:` commits trigger **major** version bumps (e.g., 1.0.0 → 2.0.0)
- `docs:`, `style:`, `refactor:`, `test:` commits do **not** trigger version bumps

### Version Management Commands

```bash
npm run version:patch  # For bug fixes (1.0.0 → 1.0.1)
npm run version:minor  # For new features (1.0.0 → 1.1.0)  
npm run version:major  # For breaking changes (1.0.0 → 2.0.0)
npm run changelog     # Generate changelog from commits
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
