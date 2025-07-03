# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### 🐛 Bug Fixes
- Temporarily disable componentTagger plugin to fix Three.js compatibility issues causing runtime errors
- Consolidate test structure by moving all tests from `src/components/__tests__/` to `src/test/` directory
- Fix missing Three.js Canvas rendering by adding required onDragStateChange prop to WorldView component
- Fix flickering eyeball and info icons by consolidating conflicting hint state systems
- Fix scene object rendering and enable mobile gizmo controls for touch interaction
- Improve gizmo sensitivity for mobile interfaces and prevent camera interference
- Implement enhanced drag mode logic with green wireframe highlighting for all objects
- Add click-outside-to-deselect functionality and improved object selection behavior

### 🧹 Chore
- Reorganize test files to follow consistent structure as per RULES.md

## [1.1.0] - 2025-07-03

### ✨ Features
- Implement object addition and improve settings UI
- support shorthand hex colors
- Add GitHub star CTA to LikeDialog
- Toggle wireframe with drag controls
- Add hover effect to geometries
- Implement DragControls toggle button
- Implement DragControls and toggle button
- Apply DragControls on initial load
- Implement DragControls for object dragging
- Implement object movement controls
- Implement onboarding UI hint
- Style carousel buttons and implement move button
- Implement object dragging and selection
- Implement object grabbing and movement
- Improve UI and object interaction
- Improve object management
- Add object creation and positioning
- improve UI contrast with automatic text color
- add hex color validation utility
- add color utils and testing
- Enhance UI and fix Crystalline Spire
- add jelly torus object and adjust UI button backgrounds
- Expand environment options and improve geometries
- Add info icon to hidden UI
- Add shortcut for shortcuts menu
- Enhance landing page UI and shortcuts
- Enhance home page design and UX
- Add keyboard navigation and home button
- Implement carousel and navigation

### 🐛 Bug Fixes
- pass sanitized slug to experience

### 🔧 Maintenance
- update README.md
- Update preview.yml
- forcing style on canvas.
- Update README.md
- update README.md

### 📝 Other Changes
- Fix: Resolve git push permission issue
- Fix changelog generation
- Fix:
- Fix: Remove --require=module from workflow
- Fix: Resolve ESM loading error in workflow
- Fix: npm install dependency conflict
- Fix: Semantic release workflow
- Fix sunset background
- Refactor: Improve code quality and background.
- Run SQL script
- Fix UI and background issues
- Refactor code for improved devex
- Update documentation and help
- Refactor: Improve developer experience
- Fix default object movement
- Improve Gizmo UX
- Refactor: Improve object movement and add gizmo UI
- Fix default object immovability
- Fix geometry movement
- Fix object dragging in scene
- Refine scene geometries
- Feature: shorthand hex color utilities (#30)
- Fix: Improve contrast in settings panel
- [dyad] Enable drag-and-drop for all objects - wrote 8 file(s)
- [dyad] Fix bug with added geometries - wrote 1 file(s)
- Remove wireframe button and update settings colors
- Refactor: Improve settings menu color scheme
- Fix type errors
- [dyad] Fix dragging for all objects - wrote 2 file(s)
- Reverted all changes back to version 583837a32af4e8ae120403e9b342d0edbf9a6ec5
- [dyad] Fix object dragging - wrote 10 file(s)
- [dyad] Fix dragging for new objects - wrote 1 file(s)
- Reverted all changes back to version 38a086e37aac7959178d999d47aad236c6d1e499
- [dyad] Fix dragging for new objects - wrote 3 file(s)
- [dyad] Implement full scene editor - wrote 6 file(s)
- [dyad] Enable scene editor for objects - wrote 5 file(s), deleted 1 file(s)
- Reverted all changes back to version 1ab13aa598b4a8811d3cc4662711355ad87edf8b
- [dyad] Implement scene object editor - wrote 4 file(s)
- Fix: Wobble field appearance
- Fix: Remove onToggleWireframe prop
- Remove wireframe button
- Refine drag movement
- [dyad] Refine object drag controls - wrote 1 file(s)
- [dyad] Implement object drag controls - wrote 16 file(s) + extra files edited outside of Dyad
- Fix: Force wireframe toggle with button
- Refactor: Implement wireframe toggle for all geometries
- Refactor: Use 'Z' for wireframe toggle
- Fix: Toggle wireframe with drag controls
- Fix WobbleFieldObject errors
- Fix: Implement hover effect for objects
- Fix: DragControls and keyboard controls
- Fix DynamicWorld component props
- Refactor: Simplify codebase, remove fluff
- Fix: Resolve module import error
- Refactor: Simplify codebase, remove drag controls
- Fix: Import error in SceneControls
- Refactor: Remove over-engineered code and simplify
- Refactor: Remove over-engineered code and simplify
- Fix: Resolve module import error
- Refactor: Remove over-engineered code
- Fix: Pass movementMode to ObjectTransformControls
- Refactor: Remove over-engineered code
- Fix: ObjectMoveControls type error
- Refactor ExperienceContainer
- Fix: Resolve loading issues and simplify code
- Refactor: Remove over-engineered code
- Fix: Ensure scenes are visible
- Refactor DynamicSceneObject.tsx
- Implement object dragging plan
- Fix: Resolve THREE namespace error
- Enhance OrbitControls for object dragging
- Fix: Implement object dragging functionality
- Refactor: Split ObjectMoveControls.tsx
- Fix: Onboarding hints text visibility
- Remove onboarding arrow
- Fix onboarding hint arrow direction.
- Fix: Ensure text next to show/hide button is visible
- Refine onboarding hints UI.
- Refine mobile onboarding hints
- Refactor: Improve mobile UI for onboarding hints
- Refine onboarding hints
- Refactor: Improve onboarding hints UI
- Fix: Match hidden UI button styles
- Fix: Pass `onShowObjectControls` to BottomBar
- Refactor: Toggle object controls with tooltip
- Fix: Add missing prop to BottomBar
- Fix: Object move button breaks app
- Fix: Apply consistent button styling
- Fix: Pass isSettingsOpen to NavigationControls
- Fix UI and button styling, address flickering, and improve settings behavior
- Reverted to commit aa35ed8f4dbae35e275e4e83107c344ea4d1bb78
- Fix: Resolve blank screen issue
- Fix: Ensure scene renders correctly
- Refactor: Split ExperienceContainer into smaller components
- Fix build errors and type issues.
- Fix TypeScript errors and import issues
- Fix: Object manipulation functionality
- Refactor: ObjectManagerControls into smaller components
- Run database migrations
- Fix: Ensure bottom UI controls are always visible
- Fix: Remove style prop from mesh
- Refactor object controls and interactions
- Refactor: Split DynamicSceneObject.tsx
- Fix: MeshProps type error in DynamicSceneObject
- Fix: Improve long press on mobile
- Fix: DynamicSceneObject geometry args type errors
- Zoom out camera for all scenes
- Fix: Swap home and like button positions
- Swap home and like button positions
- Fix: Move InfoTooltip to the left of world name
- Swap home and like button positions
- Run SQL migration for UI colors
- Fix: Theme switch for Distortion Sphere and Wobble Field
- Fix: Ensure UI color contrast on theme switch
- Apply UI color fix to all scenes
- Fix: Apply DB UI colors to all buttons
- Apply database UI color updates
- Fix: Ensure UI buttons are always visible
- Fix: Ensure UI buttons are visible
- Fix: Restore UI toggle and info button
- Fix: Restore missing UI button
- Fix: Ensure scene renders correctly
- Fix: Restore UI button visibility
- Feature: automatic text contrast (#29)
- Feature: color validation utility (#28)
- Feature: color utilities and CI linting (#26)
- Feature: add RULES documentation (#25)
- docs: add repository workflow rules
- Add MEMORY guidelines (#24)
- docs: add development guidelines memory
- Fix: Prevent heart/info icon jumping
- Fix: Heart/Info icon glitch on load
- Fix: Icon glitch on scene load
- Fix: Resolve scene rendering issue
- Refactor: Split TopBar.tsx into smaller components
- Fix: Resolve rendering issues, button flicker, and UI problems
- Reverted to commit da8c0dc8bfbb411e44ab3e4149c4e91caf7b72e5
- Reverted to commit c1e97e2e0cfa49948d705d9958f247b3bb06631f
- Fix: Import useState and useEffect in ExperienceContainer
- Fix: Button flicker and improve transitions
- Fix: TransitionSplash animation errors
- Improve: Smoother route and loading transitions
- Fix: Info icon help menu logic
- Refactor: SceneControls component
- Update open graph meta tags (#23)
- Update meta tags to remove Lovable branding
- Reverted to commit 5f0b06ab3884d9d44c59a83985118b8d90a6957e
- Fix: Crystalline Spire and lil-gui issues
- Fix: Crystalline Spire, GUI, and UI issues
- Fix routing, improve UI, and enhance lil-gui.
- Fix: Crystalline Spire scene broken, UI issues
- Refactor: Implement unlit shading, improve UI/UX, and clean up code
- Fix: Info button design consistency
- Fix: CrystallineSpireObject TypeScript errors
- Fix: CrystallineSpireObject material config
- Fix UI visibility and Crystalline Spire theme bug
- Fix TypeScript errors in InfoButton and WorldExperiencePage
- Refactor: Redirect to first world and improve transitions
- Fix UI and navigation improvements
- Fix: Canvas not taking full screen
- Fix: Canvas and navigation issues
- Refactor: Split ExperienceLogic into smaller components
- Fix: Fullscreen canvas and world navigation
- Fix canvas layout and GH pages routing (#17)
- Fix GH pages routing and fullscreen canvas
- fix canvas layout and 404 routing
- Fix layout and world refresh (#16)
- fix canvas sizing
- fix canvas sizing and revert router
- fix layout and refresh
- codex: fix world slug pass-through (#15)
- codex: hide entry splash after world loads
- Create delete-branch-if-pr-closed.yml
- cleanup: adding logical spacing in nodes within App.tsx
- cleanup: adding logical spacing within code in WorldExperiencePage.tsx
- cleanup: adding some logical spacing between blocks of code.
- Fix: Initial load issue for Genesis Torus
- Fix: Use ExperienceProvider in LoadingOverlay
- Fix: Apply UI color updates
- Run SQL to add slugs and feature flags
- Run SQL for Crystalline Spire update
- Fix: Improve light mode visuals
- Apply SQL changes to secure logs table
- Fix light mode button text color
- Fix: Button text color in light mode
- Refine info button and tooltip
- Fix: Info button placement and functionality
- Fix: Improve info button on mobile
- Refactor: Split HomePage.tsx into components
- Refactor info button for mobile
- Fix: Info icon as button on mobile
- Fix: Improve mobile title responsiveness
- Run SQL migration to add new world
- Fix: Resolve type errors in DynamicBackground and validation
- Fix: Implement security enhancements
- Merge pull request #8 from BA-CalderonMorales/codex/implement-grab-and-move-functionality-and-improve-ui-button
- Merge pull request #4 from BA-CalderonMorales/codex/update-documentation-for-deploy-preview-test
- docs: add build & preview steps
- Merge pull request #3 from BA-CalderonMorales/codex/add-pr-deployment-previews
- Add preview workflow for pull requests
- Add more background types and improve existing ones
- Fix: Environment preset validation error
- Fix: Resolve bipyramidGeometry type error
- Reverted to commit c366622e55424d6a0d94f7ce660d38b874c777f0
- Fix DynamicMaterial TypeScript errors
- Fix: Address potential undefined value errors
- Fix: Add emissive properties to baseProps
- Fix: Address WebGL rendering error
- Fix rendering error
- Fix: Crystalline spire rendering error
- Fix: Material uniform error
- Refactor: SceneControls into smaller components
- Add more background options
- Enhance Crystalline Spire visuals
- Refactor: Make Crystalline Spire minimalistic
- Run SQL to update scene type
- Refactor: Split CrystallineSpireObject into smaller components
- Refactor: Implement Crystalline Spire scene
- Fix: Add CrystallineSpire to DynamicObject
- Refactor: Implement Crystalline Spire
- Enhance zoom and add swarm effect
- Refine wobble effect and add more spheres
- Fix: Missing semicolon in WobbleFieldObject.tsx
- Refactor: Focus on central sphere geometry
- Refactor: Make geometry objects behave like wobble field
- Apply scene config from SQL
- Apply night mode background changes
- Apply database changes
- Apply database changes for Wobble Field
- Apply database changes for Wobble Field.
- Fix: Apply WobbleField changes and tone down intensity
- Refactor: Split WobbleFieldObject into smaller files
- Fix: Resolve 'mouseInfluence' error
- Refactor: Improve Wobble Field visuals
- Fix WobbleFieldObject geometry args
- Refactor: Make Distortion Sphere more Rick-like
- Refactor: Improve Wobble Field scene
- Fix: Pass isLocked prop to object components
- Fix: Freeze scene motion for all objects
- Fix: M key not collapsing shortcut menu
- Fix: Ensure shortcut menu collapses on 'M' key press
- Fix: Ensure shortcut menu toggles with "M" key
- Fix: Prevent shortcut menu from showing with UI
- Fix: Prevent M key from working after V
- Reverted to commit 8c456a4eb33d2f88f3ec769befc52baf4724221a
- Add logging module and track previous fixes
- Fix: useKeyboardDebug.ts type error
- Fix: Ensure 'M' key shortcut works
- Refactor ExperienceLogic.tsx
- Refactor hotkey-related files
- Fix: Restore shortcut menu toggle
- Fix: Ensure shortcut menu toggle works
- Fix: Stop object following mouse, add grab gesture
- Remove mouse tracking and add grab cursor
- Refactor: Split ExperienceContent.tsx into smaller components
- Fix: Shortcuts menu toggle
- Refactor: Use context for shortcuts state
- Fix: Use Collapsible state hook
- Code edited in Lovable Code Editor
- Code edited in Lovable Code Editor
- Code edited in Lovable Code Editor
- Code edited in Lovable Code Editor
- Fix: Use "m" key for shortcuts menu toggle
- Fix: Ensure shortcuts toggle works when visible
- Fix: Implement shortcut key for shortcuts menu
- Fix: Implement shortcut for shortcuts menu
- Fix: Use close square bracket for shortcuts toggle
- Enhance UI interaction and accessibility
- Refactor: Improve keyboard shortcuts overlay
- Fix: Spacebar theme switch and collapsible shortcuts
- Fix: Resolve build error in vite.config.ts
- Code edited in Lovable Code Editor
- Fix: Dynamic base path for deployments
- Fix: Resolve EMFILE error in development
- Reverted to commit 8587503a811049bd5998006bb4c56c20e3571d50
- Refactor: Separate deployment configurations
- Fix: Resolve 404 errors on deployed site
- chore(docs): ensure that README and CHANGELOG updated.
- chore(automation): fixing routing problem.
- chore(automation): try out gh pages deployment.
- cleanup(local): due to issues with lovable publish button.
- Update "Buy Me a Coffee" link
- Fix: Pass `isLiked` prop to `ExperienceUI`
- Apply Distortion Sphere settings
- Refactor UI and update Distortion Sphere
- Enhance Distortion Sphere and add dark mode options
- Run database swap for world names
- Apply "Distortion Sphere" settings
- Add controls to help menu
- Fix: Matcap texture loading error
- Add more background and material options, implement zoom.
- Run SQL to update Genesis Torus settings.
- Refactor UI and scene lock, add info modal
- Add funding and edit mode shortcuts
- Add like button coffee link and scene freeze hotkey
- Fix: Like button tooltip and Genesis Torus config
- Apply SQL database updates.
- Fix: TorusKnotObject type error
- Add object locking and options menu
- Fix: Improve scene settings interaction
- Fix: TorusKnotObject TypeScript error
- Fix: TorusKnotObject type error
- Update version and Genesis Torus
- Fix issue report UI
- Refactor UI and update keybindings
- Refactor: Break down ExperienceUI component
- Refactor: Split ExperiencePage.tsx into components
- Fix UI and shortcut display issues.
- Add more scene variety and settings
- Enhance landing text and initial UI state
- Fix: Restore settings cog and improve transitions
- Fix UI issues introduced by AI
- Refactor transitions and home button placement
- Refactor teleport and add fullscreen mode
- Enhance transitions and UI on home page
- Add more scene settings and diversity
- Fix: Remove duplicate buttons in settings panel
- Refactor UI for improved aesthetics
- Disable issue reporting and liking, enhance scene controls, and update documentation.
- Move like button and adjust title height
- Reverted to commit 28635060d200d7d47a5ea5a2e36911f314576ccb
- Fix: BackgroundScene text rendering errors
- Revert homepage changes
- Fix BackgroundScene errors
- Enhance landing page and transitions
- Fix UI, enhance experiences, add like feature
- Fix: Cannot read properties of null (reading 'useEffect')
- Add scene interactivity and UI/UX improvements
- Refactor UI and fix issue submission
- Fix type errors in multiple components.
- Fix: IssueReportForm.tsx type error
- Run SQL for log cleanup.
- Fix issue report form and input focus
- Fix: Use correct hook import
- Refine issue reporting and UI on mobile
- Fix: Update version and add issue reporting
- Refactor: Update versioning and issue reporting
- Fix: ScrollAreaScrollbar error in HelpDialog
- Fix: Resolve runtime error with useEffect
- Run SQL migration for logging table.
- Refactor: Clean up HelpDialog UI
- Fix: Resolve 'handleGoHome' declaration error
- Add keyboard shortcuts and update UI
- Refactor UI and accessibility
- Add UI color columns to worlds table
- Fix: Improve dark mode visibility and security
- Implement world search and update CHANGELOG
- Fix: Start journey on Enter keypress
- Fix: UI and transition improvements
- Fix UI theme and add landing page theme switch
- Run SQL migration
- Run SQL to remove component_key
- Refactor UI and improve theming
- Fix: Persist lil-gui settings
- Fix: Scene editor background
- Refactor UI and enhance scene uniqueness
- Enhance world experiences and add features
- Fix: Remove string refs in ExperiencePage
- Fix: Typeguard for SceneConfig
- Apply database schema changes
- Apply database schema changes
- Run Supabase SQL
- Connect to Supabase project
- Enhance landing page and add more worlds
- Fix: Wrap ExperienceContent with ExperienceProvider
- Refactor: Improve landing page and experience transitions
- Fix TypeError: Cannot read properties of undefined
- Fix: Resolve runtime error
- Fix TypeError: Cannot read properties of undefined
- Update to latest Lovable version
- Refactor: Improve UI and UX of main page
- Fix: Resolve 'Cannot read properties of undefined'
- Update to latest Lovable version
- Fix: Resolve runtime error
- Update to latest Lovable version
- Fix runtime error
- Fix React Query error
- Fix: Resolve module not found error
- Fix: Cannot find module '@react-three/postprocessing'
- Update project template
- Enhance immersive experience
- Fix: Resolve runtime error
- Create an engaging and interactive site
- Use tech stack vite_react_shadcn_ts


## [1.0.4] - 2025-07-03

### Features

- Create professional photorealistic sunset background with atmospheric scattering
- Implement realistic color temperature and atmospheric perspective effects
- Add sophisticated cloud simulation with proper lighting
- Enhanced sun disk rendering with corona and glow effects

### Code Quality Improvements

- Extract helper functions for localStorage operations in useExperienceState
- Implement early return patterns in MainObjectControls
- Consolidate DOM manipulation in ExperienceContext
- Remove redundant formatting and empty lines across components
- Optimize callback dependencies and eliminate unnecessary complexity

### Performance Optimizations

- Increase sunset background geometry resolution for smoother rendering
- Add proper render order for background elements
- Optimize shader complexity with better atmospheric calculations
- Reduce React re-renders with cleaner state management

### Visual Enhancements

- Professional sunset with realistic gradient transitions
- Atmospheric scattering simulation for authentic sky colors
- Dynamic cloud formations with sun-based lighting
- Enhanced color grading and gamma correction for realism

## [1.0.3] - 2025-07-03

### Features

- Implement proper skybox rendering for immersive backgrounds using sphere geometry
- Create enhanced sunset background with realistic gradient layers and sun disk
- Add improved gradient background with sphere rendering instead of plane geometry

### Code Quality Improvements

- Remove dead console.log statements across components
- Implement early return pattern to reduce nested conditionals
- Consolidate cloud rendering logic in DynamicBackground component
- Clean up unused drag state handlers and callbacks
- Improve TypeScript interfaces and remove unnecessary props

### Performance Optimizations

- Replace flat plane backgrounds with proper sphere geometry for immersive experience
- Add depth testing and writing controls for background rendering
- Optimize shader materials with proper uniforms management
- Implement efficient background type switching with early returns

### Bug Fixes

- Fix backgrounds appearing as planes in space instead of immersive environments
- Resolve console log pollution in production builds
- Clean up unused function references causing TypeScript errors
- Improve background rendering depth and perspective

## [1.0.2] - 2025-07-03

### Features

- Add responsive device detection hooks for mobile, tablet, and desktop
- Create beautiful sunset background effect for better light mode experience
- Implement responsive settings panel that adapts to different screen sizes

### Mobile/Tablet Improvements

- Redesign object adding panel with responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
- Improve button sizing and spacing for touch interfaces
- Add proper tablet-specific width constraints for settings panel
- Enhance mobile typography with appropriate font sizes

### UI/UX Improvements

- Replace blinding sky background in Genesis Torus light mode with warm sunset gradient
- Add visual icons and better spacing to object selection interface
- Improve settings panel layout with device-appropriate padding and sizing
- Enhanced touch targets for mobile interactions

### Bug Fixes

- Fix settings panel overflow and cramped layout on tablet devices
- Resolve object adding experience on mobile devices
- Improve visual contrast and readability across device types

## [1.0.1] - 2025-07-03

### Features

- Add new glass button design system with consistent theming
- Implement enhanced design tokens for better UI contrast and shadows
- Create reusable GlassButton component with proper hover states and animations
- Add proper semantic color tokens for day/night themes

### UI/UX Improvements

- Replace hardcoded button styles with design system tokens
- Improve button hover animations and visual feedback
- Add scale animations and ring focus states for better accessibility
- Consolidate button styling across all UI components
- Remove duplicate styling patterns and improve maintainability

### Code Quality

- Remove dead code and console logs from ExperienceUI component
- Simplify conditional logic with early returns pattern
- Consolidate glass button styling into reusable component
- Improve TypeScript interfaces and prop passing
- Clean up unnecessary style calculations and duplicated classes

### Performance

- Reduce bundle size by eliminating duplicate button styling code
- Optimize component re-renders with cleaner prop interfaces
- Improve animation performance with CSS custom properties

## [1.0.0] - 2025-01-03

### Features

- Add immersive 3D canvas experience with interactive geometries
- Implement Blender-style gizmo controls for precise object manipulation  
- Add smooth drag controls with lerp interpolation for fluid movement
- Create dynamic scene objects with proper selection and wireframe feedback
- Implement professional settings panel with Excalidraw-inspired design
- Support for multiple scene types: TorusKnot, WobbleField, CrystallineSpire, DistortionSphere, MorphingIcosahedron, WavyGrid, JellyTorus
- Add comprehensive theming system with day/night modes
- Implement proper semantic versioning and automated GitHub releases
- Add object management system with add/remove/select functionality
- Create reusable drag controls hook for consistent behavior
- Implement real-time material and transform property editing
- Add visual wireframe feedback for selected and hovered objects

### Bug Fixes

- Resolve animation conflicts during object manipulation
- Fix gizmo interference with natural object animations
- Ensure proper cleanup of drag controls and event listeners
- Prevent glitchy behavior in geometry animations
- Correct main scene object selection and manipulation

### Performance

- Optimize geometry parameters for smooth 60fps rendering
- Reduce animation complexity while maintaining visual quality
- Implement efficient object selection and management
- Add proper animation lifecycle management

### Maintenance

- Set up GitHub Actions workflow for automated versioning and releases
- Create changelog generation system following conventional commits
- Implement proper TypeScript types and validation
- Add comprehensive project documentation and development guidelines
- Update RULES.md with semantic versioning standards
- Create CONTRIBUTING.md for open source development

### Other Changes

- Initialize project with modern React + Three.js stack
- Set up Supabase integration for backend capabilities
- Configure Tailwind CSS with custom design system
- Add comprehensive UI component library with shadcn/ui
- Create professional README with feature documentation
- Update help dialog with current features and controls