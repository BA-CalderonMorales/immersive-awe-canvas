# Refactor React Component

Refactor React components following project patterns: MVVM, hooks, TypeScript best practices, and performance optimization.

## What This Does

1. Analyzes component structure and complexity
2. Applies MVVM pattern where appropriate
3. Extracts custom hooks for reusable logic
4. Optimizes re-renders with React.memo/useMemo
5. Improves TypeScript type safety
6. Follows project conventions and patterns

## Usage

```bash
/refactor-component <component-path>
```

Examples:
- `/refactor-component client/components/experience/ExperienceLayout.tsx`
- `/refactor-component client/components/scene/DynamicScene.tsx`

## Refactoring Strategies

1. **MVVM Pattern**
   - Extract ViewModels for complex logic
   - Separate UI from business logic
   - Create testable logic layers

2. **Custom Hooks**
   - Extract stateful logic to hooks
   - Make hooks reusable across components
   - Follow naming convention: `use[Feature]`

3. **Performance**
   - Add React.memo where appropriate
   - Use useMemo for expensive calculations
   - Implement useCallback for stable functions
   - Optimize dependency arrays

4. **Type Safety**
   - Strengthen prop interfaces
   - Add proper return types
   - Use discriminated unions
   - Remove 'any' types

5. **Code Organization**
   - Group related logic together
   - Extract sub-components
   - Improve readability
   - Add JSDoc comments

## Output

- Refactored component code
- New ViewModels or hooks if extracted
- Updated TypeScript interfaces
- Performance improvement notes
- Test recommendations
