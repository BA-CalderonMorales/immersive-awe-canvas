# Contributing to Immersive Awe Canvas

Thank you for your interest in contributing! This project follows strict semantic versioning and conventional commit standards to maintain high code quality and clear release history.

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+ 
- npm (comes with Node.js)
- Git familiarity

### Development Setup
```bash
git clone <repository-url>
cd immersive-awe-canvas
npm ci
npm run dev
```

### Running Tests & Checks
```bash
npm test       # Run full test suite
npm run typecheck  # TypeScript validation
npm run build      # Production build test
```

## 📝 Commit Standards

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for automatic semantic versioning:

### Commit Types & Version Impact

| Type | Example | Version Bump | When to Use |
|------|---------|--------------|-------------|
| `feat:` | `feat: add gizmo controls` | **Minor** (1.0.0 → 1.1.0) | New features |
| `fix:` | `fix: resolve drag fluidity issue` | **Patch** (1.0.0 → 1.0.1) | Bug fixes |
| `perf:` | `perf: optimize render loop` | **Patch** (1.0.0 → 1.0.1) | Performance improvements |
| `feat!:` | `feat!: redesign API` | **Major** (1.0.0 → 2.0.0) | Breaking changes |
| `chore:` | `chore: update dependencies` | **None** | Maintenance tasks |

### Examples of Good Commits
```bash
feat: add Blender-style transform gizmos
fix: prevent animation conflicts during drag operations  
perf: reduce geometry complexity for better frame rates
chore: update Three.js to latest version
docs: add contributor guidelines
```

## 🏗️ Development Workflow

### 1. Feature Development
- Create feature branch: `git checkout -b feat/your-feature-name`
- Make changes following our code standards
- Write tests for new functionality
- Test thoroughly: `npm test && npm run typecheck && npm run build`

### 2. Pull Request Process
- Use descriptive PR titles matching commit conventions
- Include **Codex CI** section with test results
- Target the `develop` branch for features/bugfixes
- Target `main` branch only for hotfixes

### 3. Code Standards
- **TypeScript**: Strict mode enabled, prefer immutable patterns
- **Testing**: Write tests before production code (TDD)
- **Components**: Small, focused, reusable components
- **Imports**: Use absolute paths with `@/` prefix

## 🔄 Automated Release Process

Our GitHub Actions automatically:
1. **Analyzes commits** for semantic versioning
2. **Bumps version** in package.json
3. **Generates changelog** from conventional commits  
4. **Creates Git tags** and GitHub releases
5. **Publishes** release artifacts

### Manual Version Management
```bash
npm run version:patch  # Bug fixes: 1.0.0 → 1.0.1
npm run version:minor  # Features: 1.0.0 → 1.1.0
npm run version:major  # Breaking: 1.0.0 → 2.0.0
```

## 🎯 Project Goals

This project aims to create an **immersive 3D canvas experience** with:
- **Intuitive controls** (drag, gizmos, keyboard shortcuts)
- **Professional UX** (inspired by Blender, Excalidraw)
- **Smooth performance** (60fps interactions)
- **Extensible architecture** (easy to add new geometries/scenes)

## 📚 Key Technologies

- **React 18** + **TypeScript** for type-safe components
- **Three.js** + **React Three Fiber** for 3D rendering
- **Tailwind CSS** + **shadcn/ui** for design system
- **Supabase** for backend services
- **RSBuild** for fast development builds and optimized production bundles

## 🤝 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code Review**: All PRs receive thorough review for quality

## 📄 License

This project is open source under the MIT License. See LICENSE file for details.

---

**Ready to contribute?** Start by exploring the codebase, running the development server, and checking our [open issues](../../issues) for beginner-friendly tasks!