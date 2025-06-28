
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Vite, React, TypeScript, and Supabase.
- Dynamic 3D scenes with `react-three-fiber`.
- World switching functionality with improved transitions.
- Day/Night theme toggling for scenes, with per-world UI color settings (`ui_day_color`, `ui_night_color`) for high-contrast UI.
- Scene customization panel using `lil-gui`.
- Ability to copy scene configuration.
- UI improvements, including an animated loading overlay.
- Keyboard controls (Arrows, WASD, Space, N/P) and a search shortcut (Ctrl/Cmd + K).
- Added keyboard shortcuts: 'H' for Home and 'S' for Search.
- A detailed help dialog and a searchable world list.
- New `useWorlds` custom hook to encapsulate world state management.
- GitHub issue reporting system via Supabase Edge Function.
- Automated cron job to clean up old logs.
- Interactive parallax effect on the home page.
- Interactive 3D objects in scenes that respond to mouse movement.
- Additional clouds in the home page's night theme for enhanced atmosphere.
- Resizable side panel for scene settings on desktop for a better editing experience.
- Disclaimer for issue reporting and like functionality, directing users to LinkedIn pending implementation of user authentication.
- Added new `WavyGrid` object type for more diverse scenes.
- Added more material controls to the scene editor (emissive color, transparency, opacity).
- Added a shortcut list display when the main UI is hidden for a minimalistic view.
- Informational modal in scene settings panel with usage tips.
- Added zoom controls via mouse wheel/pinch and set zoom limits.
- Added several new "environment" presets for scene backgrounds (sunset, dawn, night, etc.).
- GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`) to automatically build and deploy the application to GitHub Pages on pushes to the `main` branch.
- Added `isHexColor` utility to validate hex color strings.
- Configuration in `vite.config.ts` to set the `base` path for production builds, enabling correct asset loading on GitHub Pages.
- Updated `src/App.tsx` to configure `BrowserRouter` with a dynamic `basename` to ensure correct client-side routing on GitHub Pages.
- **Persistent UI State:** UI visibility preferences are now preserved across world navigation using localStorage.
- **Enhanced Info Button:** Moved info button to top bar next to heart icon with improved onboarding experience for first-time users.
- **Stable Crystalline Spire Rendering:** Fixed theme switching issues that caused visual artifacts in the Crystalline Spire world.

### Changed
- Refactored `ExperiencePage` for clarity, moving logic to the `useWorlds` hook.
- UI elements now use world-specific colors from the database, removing `mix-blend-mode` for more reliable visibility.
- Replaced help toast notification with a more comprehensive and up-to-date help dialog.
- Issue reporting is now a "fire-and-forget" operation to improve UI responsiveness.
- Replaced the loading spinner with a more thematic "summoning" animation.
- Disabled issue reporting and "like" features, replacing them with informational tooltips/messages.
- Scene settings UI now opens on the side on desktop, resizing the canvas, while remaining a drawer on mobile.
- Overhauled app entry and world-switching transitions to be more subtle and cinematic.
- Scene lock (`.` key) now freezes all scene animations, including camera rotation, for a complete pause.
- Replaced tooltip on scene settings info icon with a more detailed modal.
- Updated "Genesis Torus" world to use a new, more dynamic scene configuration.
- Updated help dialog, hidden UI view, and README with a complete and reorganized list of user controls and keyboard shortcuts.
- Updated "Distortion Sphere" world with new default scene settings.
- Swapped "Wobble Field" and "Distortion Sphere" worlds.
- Enhanced the "Distortion Sphere" visual effect to be more dynamic and interactive.
- Redesigned the "Liking is Coming Soon" modal for a cleaner look and a stronger call to action.
- **Improved UI Layout:** Info button relocated to top bar for better accessibility and consistent user experience.
- **Optimized Material Handling:** Simplified material configuration system to prevent rendering issues during theme changes.

### Fixed
- Fixed a TypeScript error in `vite.config.ts` that caused build failures.
- Addressed a development server build error (`EMFILE: too many open files`) by optimizing Vite's file-watching configuration.
- Resolved major UI visibility issue where text and buttons could become invisible against certain scene backgrounds.
- Corrected a broken theme implementation in the toast notification component.
- Adjusted "Echoing Void" night theme for better visibility.
- Corrected various `logEvent` calls across the application to fix build errors.
- Version display in help dialog now correctly uses the project's local timezone.
- Resolved CORS issue in the `create-github-issue` edge function.
- Fixed a rendering issue in the issue report form where content could be clipped by the scrollbar.
- Restored the missing settings button on mobile devices.
- Corrected styling for dropdown menus in the scene editor panel to ensure they are not transparent.
- Fixed a build error related to a missing `BackgroundConfig` type import.
- Fixed an issue causing asset loading failures (404 errors) on the deployed GitHub Pages site.
- **Fixed UI State Persistence:** UI visibility state is now properly maintained when navigating between worlds.
- **Fixed Crystalline Spire Theme Switching:** Resolved rendering artifacts and disappearing elements when switching between day/night themes.
- **Fixed TypeScript Errors:** Resolved property access errors in material configuration handling.

### Removed
- Deleted unused CSS and TypeScript files.
- **Removed Duplicate Info Button:** Consolidated info functionality into the top bar, removing the separate bottom-left info button component.

