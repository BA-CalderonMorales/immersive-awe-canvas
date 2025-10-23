# Immersive Awe Canvas - Metaprompt

## Project Context
You are working on "Immersive Awe Canvas" - a professional 3D canvas experience for exploring and manipulating interactive geometries in the browser. This is a modular monorepo with client/server/database/utils workspaces, built with React, Three.js, and modern web technologies.

## Core Technologies
- **Frontend**: React 18 + TypeScript, Three.js + React Three Fiber/Drei, Tailwind CSS
- **UI Framework**: shadcn/ui + Radix UI primitives  
- **Backend**: Supabase (PostgreSQL with real-time subscriptions)
- **Build System**: RSBuild with React plugin and TypeScript support
- **Testing**: Vitest with comprehensive mocking (54+ tests)
- **Package Manager**: Bun (recommended for performance)
- **Architecture**: Clean API layered architecture (Controllers → Services → Repositories → Clients)

## Key Architectural Patterns
- **Monorepo Structure**: client/, server/, database/, utils/ workspaces
- **MVVM Pattern**: ViewModels for complex UI logic separation
- **Clean API**: Using @ba-calderonmorales/clean-api package for consistent API patterns
- **Type Safety**: Full TypeScript with strict mode enabled
- **Component Organization**: Feature-based organization (scene/, ui/, layout/, experience, home, transition/)

## Development Conventions
- **Import Paths**: Use @/ for client imports, @server/, @utils/ for cross-workspace
- **File Naming**: PascalCase for components, camelCase for utilities/hooks
- **Commit Style**: Conventional commits (feat:, fix:, perf:, BREAKING CHANGE:)
- **Versioning**: Automated semantic versioning via GitHub Actions
- **Code Quality**: Biome for linting/formatting, strict TypeScript

## Common Workflows
- **Development**: `bun run dev` (RSBuild dev server on localhost:8080)
- **Building**: `bun run build` (production build with optimizations)
- **Testing**: `bun run test` (Vitest suite), `bun run test:api` (API tests)
- **Quality Checks**: `bun run lint`, `bun run typecheck`, `bun run format`
- **Installation**: `bun install` (use Bun, not npm for optimal performance)

## File Organization Patterns
- **Client Components**: `client/components/{scene,ui,layout,experience,home,transition}/`
- **Hooks**: `client/hooks/` with custom React hooks for state/API logic
- **Context**: `client/context/` for global state (ExperienceContext, SceneObjectsContext, etc.)
- **Types**: `client/types/` for client-specific TypeScript definitions
- **Server API**: `server/api/{controllers,services,repositories,clients}/` layered architecture
- **Database**: `database/supabase/{migrations,types}/` with consolidated migrations
- **Utils**: `utils/` for shared utilities across workspaces

## 3D Scene Features
- **Scene Types**: TorusKnot, WobbleField, CrystallineSpire, DistortionSphere, MorphingIcosahedron, WavyGrid, JellyTorus
- **Object Manipulation**: Blender-style gizmos, smooth drag controls, wireframe selection
- **Themes**: Dynamic day/night modes with per-world color schemes
- **Performance**: 60fps animations, MSAA anti-aliasing, optimized rendering

## Keyboard Shortcuts & Controls
- **Navigation**: Space (theme toggle), N/P (next/prev world), G (home)
- **UI**: V (hide/show UI), E (settings panel), H (help), Esc (close dialogs)
- **Scene**: Z (drag mode), . (freeze animations), C (copy config), S/Ctrl+K (search)
- **3D Controls**: Click/drag (rotate), wheel (zoom), click objects (select)

## Quality Assurance
- **Testing Strategy**: Unit tests with Vitest, API integration tests, architecture tests
- **Performance Standards**: Maintain 60fps, optimize bundle size, tree shaking
- **Accessibility**: Professional contrast ratios, keyboard navigation, screen reader support
- **Security**: Input validation, type guards, secure API patterns

## Development Best Practices
- **Component Design**: Keep components small/focused, use MVVM for complex logic
- **State Management**: React Context for global state, custom hooks for logic
- **Error Handling**: Consistent error patterns across API layers
- **Documentation**: Update docs for architectural changes, maintain API references
- **Performance**: Profile 3D scenes, optimize Three.js rendering, minimize re-renders

When working on this project, prioritize:
1. Maintaining the modular monorepo structure and clean API patterns
2. Ensuring 60fps performance in 3D scenes and smooth animations  
3. Following TypeScript strict mode and comprehensive testing
4. Using conventional commits for proper semantic versioning
5. Keeping components organized by feature with clear separation of concerns