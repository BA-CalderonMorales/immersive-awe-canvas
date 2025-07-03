# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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