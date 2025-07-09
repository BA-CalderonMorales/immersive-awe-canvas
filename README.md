
# Immersive Awe Canvas

A professional 3D canvas experience for exploring and manipulating interactive geometries in your browser. Built with React, Three.js, RSBuild, and modern web technologies using a modular monorepo architecture.

**Live Demo:** [immersive-awe-canvas.lovable.app](https://immersive-awe-canvas.lovable.app)

## ✨ Features

<details>
<summary><strong>🎯 Core 3D Experience</strong></summary>

- **Multiple Scene Types:** TorusKnot, WobbleField, CrystallineSpire, DistortionSphere, MorphingIcosahedron, WavyGrid, and JellyTorus
- **Dynamic Day/Night Themes:** Toggle between light and dark modes with per-world color schemes
- **Smooth Animations:** Optimized 60fps animations with glitch-free geometry rendering
- **World Navigation:** Seamless transitions between different 3D environments
- **Anti-aliasing:** High-quality rendering with MSAA support

</details>

<details>
<summary><strong>🎮 Professional Object Manipulation</strong></summary>

- **Blender-Style Gizmos:** Precise transform controls with visual axis indicators
- **Smooth Drag Controls:** Fluid object movement with lerp interpolation
- **Object Selection:** Click-to-select with visual wireframe feedback
- **Real-time Updates:** Immediate visual feedback during manipulation
- **Mobile-Optimized:** Enhanced gizmo sensitivity for touch devices

</details>

<details>
<summary><strong>🛠️ Advanced Scene Editing</strong></summary>

- **Live Scene Editor:** Professional settings panel with MVVM architecture
- **Add/Remove Objects:** Dynamic scene composition with multiple geometry types
- **Material Controls:** Real-time adjustment of colors, metalness, roughness, and transparency
- **Transform Properties:** Position, rotation, and scale controls with precise input
- **Object Management:** Organized object list with selection and property editing
- **Collapsible Sections:** Organized UI with glassmorphism effects

</details>

<details>
<summary><strong>👨‍💻 Developer Experience</strong></summary>

- **Semantic Versioning:** Automated GitHub releases following conventional commits
- **TypeScript:** Full type safety with strict mode enabled
- **Modern Architecture:** Modular monorepo with client/server/database/utils separation
- **Performance Optimized:** RSBuild with tree shaking and hot module replacement
- **Comprehensive Testing:** Vitest with 54 passing tests and proper mocking
- **MVVM Pattern:** Clean separation of concerns with ViewModels for complex UI logic

</details>

<details>
<summary><strong>🎨 User Interface</strong></summary>

- **Responsive Design:** Optimized layouts for desktop, tablet, and mobile devices
- **Keyboard Shortcuts:** Complete keyboard navigation and control system
- **Accessibility:** Professional contrast ratios and intuitive interactions
- **Clean Design:** Minimalist interface inspired by Excalidraw and Blender
- **Theme Support:** Dynamic day/night mode switching

</details>

<details>
<summary><strong>⚡ Technical Features</strong></summary>

- **Supabase Integration:** Backend data management with type-safe APIs
- **RSBuild:** Fast development and optimized production builds
- **Component Library:** Comprehensive UI components with shadcn/ui and Radix UI
- **Build Optimization:** Production-ready builds with code splitting and asset optimization
- **GitHub Integration:** Dynamic version display from GitHub releases API

</details>

## 🚀 Quick Start

<details>
<summary><strong>Prerequisites</strong></summary>

- **Node.js 18+** - Required for development
- **[Bun](https://bun.sh/)** - Recommended for optimal performance
- **Git** - For version control

> **⚡ Why Bun?** We use Bun for significantly faster package installation, test execution, and build times compared to npm/yarn.

</details>

<details>
<summary><strong>Installation & Setup</strong></summary>

```bash
# Clone the repository
git clone https://github.com/BA-CalderonMorales/immersive-awe-canvas.git
cd immersive-awe-canvas

# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server with RSBuild
bun run dev
```

The development server will start at `http://localhost:8080` with hot module replacement enabled.

</details>

<details>
<summary><strong>Development Commands</strong></summary>

```bash
# Core Development
bun install          # Install all dependencies
bun run dev          # Start RSBuild dev server (localhost:8080)
bun run build        # Production build with RSBuild
bun run build:dev    # Development build
bun run preview      # Preview production build

# Quality Assurance
bun run test         # Run Vitest test suite (54 tests)
bun run typecheck    # TypeScript validation
bun run lint         # ESLint code analysis

# Monorepo Management
bun run install:all  # Install dependencies for all workspaces
```

</details>

<details>
<summary><strong>Alternative Package Managers</strong></summary>

While Bun is recommended, you can use npm if needed:

```bash
npm install
npm run dev
npm run test
npm run build
```

**Note:** Different package managers may yield different dependency resolution results.

</details>

<details>
<summary><strong>Automated Versioning</strong></summary>

**⚠️ Important:** This project uses automated semantic versioning. Manual version commands are **not used**.

- Versions are automatically bumped based on conventional commits
- Use proper commit prefixes: `fix:`, `feat:`, `BREAKING CHANGE:`
- GitHub Actions handles releases automatically
- See `RULES.md` for detailed versioning guidelines

</details>

## 🎮 Controls

<details>
<summary><strong>Mouse/Touch Interactions</strong></summary>

- **Look Around:** Click and drag to rotate camera
- **Zoom:** Mouse wheel or pinch gestures
- **Select Objects:** Click on any geometry to select
- **Gizmo Control:** Drag transform gizmos for precise movement
- **Mobile Optimized:** Enhanced touch sensitivity for mobile devices

</details>

<details>
<summary><strong>Keyboard Shortcuts</strong></summary>

| Key | Action |
|-----|--------|
| `Space` | Toggle day/night theme |
| `N` / `P` | Next/previous world |
| `Z` | Toggle drag mode for object manipulation |
| `V` | Hide/show UI |
| `E` | Toggle settings panel |
| `S` or `Ctrl+K` | Search worlds |
| `H` | Help dialog |
| `G` | Go to home |
| `C` | Copy scene configuration |
| `.` (Period) | Freeze/unfreeze animations |
| `Esc` | Close dialogs |

</details>

## 🏢 Architecture

<details>
<summary><strong>Technology Stack</strong></summary>

- **Build System:** RSBuild with React plugin and TypeScript support
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **UI Components:** shadcn/ui, Radix UI primitives
- **Backend:** Supabase (PostgreSQL, real-time subscriptions)
- **Testing:** Vitest with comprehensive mocking and 54 test cases
- **Deployment:** GitHub Actions with automated semantic releases
- **Package Manager:** Bun for optimal performance

</details>

<details>
<summary><strong>Monorepo Structure</strong></summary>

This project uses a **modular monorepo architecture** with clear separation of concerns across multiple workspaces:

#### 🖥️ Client Workspace (`client/`)
Frontend React application with modern architecture:
- **Components**: Organized by feature with scene, UI, and layout components
- **Hooks**: Custom React hooks for state management and API integration
- **Context**: React context providers for global state (SceneObjects, Experience, etc.)
- **Pages**: Route-based page components
- **Types**: TypeScript definitions for client-side data structures
- **Test**: Comprehensive test suite with Vitest (54 tests)

#### 🗄️ Server Workspace (`server/`)
Backend utilities and API integrations:
- **GitHub API**: Dynamic version fetching from GitHub releases
- **Security**: Input validation and sanitization utilities
- **Logging**: Structured logging with different levels
- **Validation**: Type guards and data validation functions
- **Utils**: Server-side utility functions

#### 🖾 Database Workspace (`database/`)
Supabase integration and database management:
- **Types**: Auto-generated TypeScript types from Supabase schema
- **Migrations**: Database schema migrations
- **Queries**: Reusable database query functions
- **Hooks**: React hooks for database operations

#### 🛠️ Utils Workspace (`utils/`)
Shared utilities across all workspaces:
- **Common Functions**: Utility functions used by both client and server
- **Type Guards**: Shared type validation functions
- **Constants**: Application-wide constants and configurations

</details>

<details>
<summary><strong>Directory Structure</strong></summary>

```
immersive-awe-canvas/
├── client/                    # Frontend React application
│   ├── components/           # React components organized by feature
│   │   ├── scene/           # 3D scene components (objects, controls, materials)
│   │   ├── ui/              # UI components (buttons, dialogs, forms)
│   │   └── layout/          # Layout components (headers, sidebars)
│   ├── context/             # React context providers
│   │   ├── ExperienceContext.tsx
│   │   ├── SceneObjectsContext.tsx
│   │   └── KeyboardShortcutsContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useWorlds.ts
│   │   ├── use-mobile.ts
│   │   └── useExperience.ts
│   ├── pages/               # Route-based page components
│   ├── types/               # Client-side TypeScript definitions
│   ├── test/                # Test files and utilities
│   └── lib/                 # Client-side utilities
├── server/                   # Backend utilities and API integrations
│   ├── github-api.ts        # GitHub releases API integration
│   ├── security.ts          # Input validation and sanitization
│   ├── logger.ts            # Structured logging utilities
│   ├── validation.ts        # Type guards and validation
│   └── utils.ts             # Server-side utility functions
├── database/                 # Supabase integration (future expansion)
│   ├── types/               # Auto-generated Supabase types
│   ├── migrations/          # Database schema migrations
│   └── queries/             # Reusable database queries
├── utils/                    # Shared utilities across workspaces
│   ├── typeguards.ts        # Shared type validation
│   ├── utils.ts             # Common utility functions
│   └── constants.ts         # Application constants
├── public/                   # Static assets
├── dist/                     # Built application (generated)
├── rsbuild.config.ts         # RSBuild configuration
├── vitest.config.ts          # Vitest testing configuration
├── package.json              # Root package.json with workspaces
└── tsconfig.json             # TypeScript configuration
```

</details>

<details>
<summary><strong>Import Patterns & Usage</strong></summary>

#### Client-Side Development
Working with UI components and React logic:

```typescript
// Import client components and hooks
import { SceneEditor } from '@/components/scene/editor/SceneEditor';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useWorlds } from '@/hooks/useWorlds';
import { SceneConfig } from '@/types/scene';
```

#### Server-Side Integration
Working with APIs and backend utilities:

```typescript
// Import server utilities
import { fetchGitHubReleases } from '@server/github-api';
import { validateInput } from '@server/security';
import { logger } from '@server/logger';
```

#### Shared Utilities
Using common functions across workspaces:

```typescript
// Import shared utilities
import { isValidString } from '@utils/typeguards';
import { formatDate } from '@utils/utils';
```

</details>

<details>
<summary><strong>Architecture Benefits</strong></summary>

1. **🏢 Monorepo Structure**: All related code in one repository with clear workspace boundaries
2. **🔄 Clear Separation**: Client, server, database, and utils are logically separated
3. **🚀 Developer Experience**: Easy to navigate and understand project structure
4. **🔧 Maintainability**: Changes are isolated to appropriate workspaces
5. **📊 Scalability**: Easy to add new features without architectural debt
6. **🧪 Testing**: Comprehensive test coverage with proper mocking strategies
7. **🔄 Type Safety**: Full TypeScript coverage across all workspaces

</details>

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Commit Standards
We use [Conventional Commits](https://www.conventionalcommits.org/) for semantic versioning:
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)  
- `perf:` - Performance improvements (patch version bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking changes (major version bump)

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new functionality
- Use immutable patterns where possible
- Keep components small and focused
- Maintain 60fps performance standards

When adding new features:
- **UI Components/Logic**: Add to `src/modules/client/`
- **Data Fetching/APIs**: Add to `src/modules/server/`
- **Shared Types**: Consider where the type is primarily used

This modular approach helps maintain clean code organization and makes the codebase more approachable for new contributors.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Issues:** [GitHub Issues](../../issues) for bugs and feature requests
- **Discussions:** [GitHub Discussions](../../discussions) for questions
- **Documentation:** Check our comprehensive [CONTRIBUTING.md](CONTRIBUTING.md)
