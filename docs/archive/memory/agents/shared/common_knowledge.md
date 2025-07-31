# Shared Agent Knowledge

## Purpose

This file contains knowledge and insights that should be shared across all agents in the swarm orchestration system.

## Project-Specific Knowledge

### Immersive Awe Canvas - 3D Workspace Platform

#### Core Technologies
- **Frontend**: React + TypeScript + Three.js (React Three Fiber)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build System**: Rsbuild (Webpack-based)
- **Testing**: Vitest + React Testing Library
- **Package Manager**: Bun (preferred) / npm (fallback)
- **Code Quality**: Biome (formatting + linting)

#### Architecture Patterns
- **Scene Objects**: Dynamic 3D objects with customizable materials and animations
- **Background Effects**: Shader-based atmospheric backgrounds (Void, Aurora, Plasma, Cinematic, etc.)
- **Navigation**: World-based navigation system with smooth transitions
- **State Management**: React Context + custom hooks pattern
- **Testing Strategy**: Behavior-driven testing following TDD principles

#### Key Development Insights

##### WebGL/Shader Development
- Template string interpolation in shaders fails in production builds
- Always inline GLSL functions directly in shader code
- Use `precision mediump float;` declarations for compatibility
- Test shaders across different devices and contexts

##### React Hook Patterns  
- Be careful with useEffect dependency arrays - avoid state that causes unwanted re-runs
- Use functional state updates for async operations (setTimeout, promises)
- Race conditions can occur when effects trigger from state changes they also cause

##### Testing Strategies
- Use fake timers carefully - they can interfere with React Testing Library's waitFor
- Test behavior through public APIs, not implementation details
- Mock external dependencies (Supabase, Three.js) consistently across tests

##### Performance Considerations
- Particle systems should be optimized for 60fps (limit particle count)
- Use React.memo for expensive component re-renders
- Batch state updates where possible
- Monitor WebGL context limits on mobile devices

#### Common Pitfalls & Solutions

1. **Shader Compilation Issues**
   - Problem: `THREE.WebGLProgram: Shader Error - Fragment shader is not compiled`
   - Solution: Inline all shader functions, avoid template interpolation

2. **Hook Dependencies**
   - Problem: useEffect runs unexpectedly causing state resets
   - Solution: Carefully audit dependency arrays, remove state that causes cycles

3. **Test Timing Issues**
   - Problem: Tests fail intermittently due to timing
   - Solution: Use proper waitFor patterns, avoid fake timers with complex hooks

4. **Build vs Development Differences**
   - Problem: Code works in dev but fails in production
   - Solution: Test with production builds, avoid dynamic imports in shaders

## Cross-Agent Coordination

### Swarm Roles
- **Coordinator**: Overall project oversight and task distribution
- **Researcher**: Investigate solutions, gather requirements, analyze problems  
- **Coder**: Implement features following TDD practices
- **Tester**: Focus on test quality, coverage, and reliability
- **Reviewer**: Code review, architecture decisions, refactoring opportunities

### Communication Protocols
- All agents should reference MEMORY.md for consistent development practices
- Use conventional commit messages for all changes
- Document significant decisions and rationale in session summaries
- Share learnings through this common_knowledge.md file

### Quality Standards
- 100% test coverage through behavior-driven testing
- TypeScript strict mode compliance
- Biome formatting and linting standards
- TDD red-green-refactor cycle adherence

## Last Updated

2025-01-22T03:48:00.000Z - Initial shared knowledge documentation