
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
- bun

### Installation
```bash
git clone <repository-url>
cd immersive-awe-canvas
bun install
bun dev
```

### Development Commands
```bash
bun test           # Run test suite
bun typecheck      # TypeScript validation
bun build          # Production build
bun run preview    # Preview production build
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

### Project Structure
```
src/
├── components/          # React components
│   ├── scene/          # 3D scene components
│   ├── experience/     # Main experience logic
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── integrations/      # External service integrations
```

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

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Issues:** [GitHub Issues](../../issues) for bugs and feature requests
- **Discussions:** [GitHub Discussions](../../discussions) for questions
- **Documentation:** Check our comprehensive [CONTRIBUTING.md](CONTRIBUTING.md)
