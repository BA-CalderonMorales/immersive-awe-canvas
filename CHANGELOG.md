
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

### Changed
- Refactored `ExperiencePage` for clarity, moving logic to the `useWorlds` hook.
- UI elements now use world-specific colors from the database, removing `mix-blend-mode` for more reliable visibility.
- Replaced help toast notification with a more comprehensive and up-to-date help dialog.
- Issue reporting is now a "fire-and-forget" operation to improve UI responsiveness.

### Fixed
- Resolved major UI visibility issue where text and buttons could become invisible against certain scene backgrounds.
- Corrected a broken theme implementation in the toast notification component.
- Adjusted "Echoing Void" night theme for better visibility.
- Corrected various `logEvent` calls across the application to fix build errors.
- Version display in help dialog now correctly uses the project's local timezone.
- Resolved CORS issue in the `create-github-issue` edge function.
- Fixed a rendering issue in the issue report form where content could be clipped by the scrollbar.

### Removed
- Deleted unused CSS and TypeScript files.
