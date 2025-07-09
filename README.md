
# Immersive Awe Canvas

A professional 3D canvas experience for exploring and manipulating interactive geometries in your browser. Built with React, Three.js, and modern web technologies.

**Live Demo:** [immersive-awe-canvas.lovable.app](https://immersive-awe-canvas.lovable.app)

## Features

### Core 3D Experience
- **Multiple Scene Types:** TorusKnot, WobbleField, CrystallineSpire, DistortionSphere, MorphingIcosahedron, WavyGrid, and JellyTorus
- **Dynamic Day/Night Themes:** Toggle between light and dark modes with per-world color schemes
- **Smooth Animations:** Optimized 60fps animations with glitch-free geometry rendering
- **World Navigation:** Seamless transitions between different 3D environments

### Professional Object Manipulation
- **Blender-Style Gizmos:** Precise transform controls with visual axis indicators
- **Smooth Drag Controls:** Fluid object movement with lerp interpolation
- **Object Selection:** Click-to-select with visual wireframe feedback
- **Real-time Updates:** Immediate visual feedback during manipulation

### Advanced Scene Editing
- **Live Scene Editor:** Professional settings panel with organized sections
- **Add/Remove Objects:** Dynamic scene composition with multiple geometry types
- **Material Controls:** Real-time adjustment of colors, metalness, roughness, and transparency
- **Transform Properties:** Position, rotation, and scale controls with precise input
- **Object Management:** Organized object list with selection and property editing

### Developer Experience
- **Semantic Versioning:** Automated GitHub releases following conventional commits
- **TypeScript:** Full type safety with strict mode enabled
- **Modern Architecture:** Component-based design with reusable hooks and utilities
- **Performance Optimized:** Efficient rendering with proper animation lifecycle management

### User Interface
- **Responsive Design:** Optimized layouts for desktop and mobile devices
- **Keyboard Shortcuts:** Complete keyboard navigation and control system
- **Accessibility:** Professional contrast ratios and intuitive interactions
- **Clean Design:** Minimalist interface inspired by Excalidraw and Blender

### Technical Features
- **Supabase Integration:** Backend data management and potential for user features
- **Hot Module Replacement:** Fast development iteration with Vite
- **Component Library:** Comprehensive UI components with shadcn/ui
- **Build Optimization:** Production-ready builds with tree shaking and minification

## Quick Start

### Prerequisites
- Node.js 18 or higher
- **[Bun](https://bun.sh/)** (recommended for optimal performance)

> **⚡ Why Bun?** We recommend using Bun instead of npm for the fastest development experience. Bun provides significantly faster package installation, test execution, and build times.

### Installation
```bash
git clone <repository-url>
cd immersive-awe-canvas

# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies and start development
bun install
bun run dev
```

### Development Commands
```bash
bun install       # Install dependencies
bun run dev       # Start development server
bun run test      # Run test suite
bun run typecheck # TypeScript validation
bun run build     # Production build
bun run preview   # Preview production build
```

### Alternative with npm
If you prefer to use npm (may yield different results):
```bash
npm install
npm run dev
npm run test
npm run typecheck
npm run build
```

### Versioning Commands
```bash
bun run version:patch  # Bug fixes (1.0.0 → 1.0.1)
bun run version:minor  # Features (1.0.0 → 1.1.0)
bun run version:major  # Breaking changes (1.0.0 → 2.0.0)
```

## Controls

### Mouse/Touch
- **Look Around:** Click and drag to rotate camera
- **Zoom:** Mouse wheel or pinch gestures
- **Select Objects:** Click on any geometry to select
- **Gizmo Control:** Drag transform gizmos for precise movement

### Keyboard Shortcuts
- `Space` - Toggle day/night theme
- `N` / `P` - Next/previous world
- `Z` - Toggle drag mode for object manipulation
- `V` - Hide/show UI
- `E` - Toggle settings panel
- `S` or `Ctrl+K` - Search worlds
- `H` - Help dialog
- `G` - Go to home
- `C` - Copy scene configuration
- `.` (Period) - Freeze/unfreeze animations
- `Esc` - Close dialogs

## Architecture

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber, React Three Drei
- **UI Components:** shadcn/ui, Radix UI primitives
- **Backend:** Supabase (PostgreSQL, real-time subscriptions)
- **Build Tool:** Vite with optimized production builds
- **Deployment:** GitHub Actions with automated releases

### Modular Architecture

This project follows a modular architecture with clear separation between client and server concerns:

#### 🖥️ Client Module (`src/modules/client/`)
Contains all UI-related code:
- **Components**: React components for rendering the user interface
- **Hooks**: Client-side state management and UI logic
- **Context**: React context providers for shared state
- **Utils**: Client-side utility functions
- **Types**: Client-side type definitions

#### 🗄️ Server Module (`src/modules/server/`)
Contains all backend-related code:
- **Database**: Supabase client configuration and types
- **API**: Data fetching hooks and external API integrations
- **Utils**: Server-side utilities (logging, security)
- **Types**: Server-side type definitions

### Project Structure
```
src/
├── modules/             # Modular architecture
│   ├── client/         # UI-related code
│   │   ├── components/ # React components
│   │   ├── hooks/      # Client-side hooks
│   │   ├── context/    # React contexts
│   │   ├── utils/      # Client utilities
│   │   └── types/      # Client types
│   ├── server/         # Backend-related code
│   │   ├── database/   # Supabase client & types
│   │   ├── api/        # Data fetching & APIs
│   │   ├── utils/      # Server utilities
│   │   └── types/      # Server types
│   └── index.ts        # Module exports
├── components/         # Legacy components (re-exported via modules)
├── hooks/             # Legacy hooks (re-exported via modules)
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── integrations/      # External service integrations
```

### Using the Modular Architecture

#### For UI Development
If you're working on the user interface:

```typescript
// Import client-side functionality
import { ComponentName } from '@/modules/client';
import { useClientHook } from '@/modules/client/hooks';
```

#### For Backend Development
If you're working with data and APIs:

```typescript
// Import server-side functionality
import { useWorlds } from '@/modules/server';
import { supabase } from '@/modules/server/database';
```

### Benefits of This Architecture

1. **Clear Separation of Concerns**: UI and backend code are clearly separated
2. **Better Onboarding**: New developers can focus on either client or server work
3. **Improved Maintainability**: Easier to locate and modify specific functionality
4. **Backward Compatibility**: Existing imports continue to work
5. **Scalability**: Easy to add new features to appropriate modules

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
