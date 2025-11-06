# Add UI Component

Generate a new UI component using shadcn/ui patterns with TypeScript and Tailwind CSS.

## What This Does

1. Creates React component with TypeScript
2. Applies shadcn/ui and Radix UI patterns
3. Adds Tailwind CSS styling
4. Implements accessibility features
5. Generates component tests
6. Updates component index exports

## Usage

```bash
/add-ui-component <component-name> [--primitive dialog|sheet|popover|dropdown]
```

Examples:
- `/add-ui-component SettingsPanel` - Custom component
- `/add-ui-component NotificationBanner --primitive sheet` - Using Sheet primitive
- `/add-ui-component ColorPicker --primitive popover` - Custom picker in popover

## Generated Files

1. **Component File**
   - `client/components/ui/[component-name].tsx`
   - TypeScript interface
   - Accessible markup
   - Tailwind styling
   - Forwardref support

2. **Test File**
   - Basic render test
   - Accessibility tests
   - Interaction tests
   - Props validation

3. **Export Update**
   - Update `client/components/ui/index.ts`
   - Add to component exports

## Template Structure

```tsx
import { cn } from "@/lib/utils";

interface [ComponentName]Props extends React.HTMLAttributes<HTMLDivElement> {
  // Component-specific props
}

export function [ComponentName]({
  className,
  ...props
}: [ComponentName]Props) {
  return (
    <div
      className={cn("base-styles", className)}
      {...props}
    >
      {/* Component content */}
    </div>
  );
}
```

## Styling Guidelines

1. **Tailwind Classes**
   - Use design system tokens
   - Follow responsive patterns
   - Implement dark mode support
   - Use CSS variables for themes

2. **Class Variance Authority**
   - Define variants for common patterns
   - Use `cva()` for complex styling
   - Support size/variant props

3. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support

## Radix UI Primitives

Available primitives to base on:
- Dialog - Modal dialogs
- Sheet - Slide-in panels
- Popover - Floating content
- Dropdown - Menu dropdowns
- Tooltip - Hover information
- Select - Custom select boxes
- Tabs - Tabbed interfaces

## Integration

1. Generate component
2. Add to component library
3. Import in consuming components
4. Update Storybook (if available)
5. Document usage examples
