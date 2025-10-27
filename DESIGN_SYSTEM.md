# Immersive Awe Canvas - Minimalistic Design System

## Philosophy
Clean, modern, and distraction-free aesthetic that puts the 3D experience first. Zero Lovable influence - this is our unique visual identity.

## Core Principles
1. **Subtlety First** - UI should enhance, not compete with the 3D scene
2. **Surgical Precision** - Every element serves a purpose
3. **Breathing Room** - Generous whitespace and minimal density
4. **Tactile Feedback** - Subtle, sophisticated interactions
5. **Theme-Aware** - Seamless day/night transitions

---

## Color System

### Day Theme
- **Background**: `rgba(255, 255, 255, 0.02)` - Nearly invisible
- **Surface**: `rgba(255, 255, 255, 0.08)` - Subtle presence
- **Border**: `rgba(0, 0, 0, 0.06)` - Barely there
- **Text Primary**: `rgba(0, 0, 0, 0.9)` - Strong contrast
- **Text Secondary**: `rgba(0, 0, 0, 0.5)` - Muted support
- **Accent**: Derived from scene (dynamic)

### Night Theme
- **Background**: `rgba(0, 0, 0, 0.02)` - Nearly invisible
- **Surface**: `rgba(255, 255, 255, 0.04)` - Subtle presence
- **Border**: `rgba(255, 255, 255, 0.08)` - Barely there
- **Text Primary**: `rgba(255, 255, 255, 0.95)` - Strong contrast
- **Text Secondary**: `rgba(255, 255, 255, 0.5)` - Muted support
- **Accent**: Derived from scene (dynamic)

### State Colors (Semantic)
- **Hover**: Opacity +0.04
- **Active**: Opacity +0.08, scale 0.98
- **Focus**: 1px outline with accent color at 40% opacity
- **Disabled**: Opacity 0.3

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI',
             'Inter', 'Roboto', sans-serif;
```

### Scale (Refined)
- **xs**: 11px / 1.4 line-height
- **sm**: 12px / 1.4 line-height
- **base**: 13px / 1.5 line-height
- **md**: 14px / 1.5 line-height
- **lg**: 16px / 1.4 line-height
- **xl**: 20px / 1.3 line-height
- **2xl**: 24px / 1.2 line-height

### Weights
- **Regular**: 400 (default text)
- **Medium**: 500 (UI elements, buttons)
- **Semibold**: 600 (headings, emphasis)

---

## Spacing System

### Scale (4px base unit)
- **0**: 0px
- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px

### Component Padding
- **Buttons**: px-4 py-2 (16px x 8px)
- **Inputs**: px-3 py-2 (12px x 8px)
- **Cards**: p-6 (24px)
- **Panels**: p-8 (32px)
- **Modals**: p-10 (40px)

---

## Border & Radius

### Border Width
- **Default**: 1px (hairline)
- **Focus**: 1px (never thicker)
- **Divider**: 1px

### Border Radius
- **sm**: 6px (small elements, badges)
- **md**: 8px (buttons, inputs)
- **lg**: 12px (cards, panels)
- **xl**: 16px (modals, large surfaces)
- **full**: 9999px (circular buttons)

---

## Shadows & Depth

### Elevation System
```css
/* Level 0 - Flat */
box-shadow: none;

/* Level 1 - Subtle lift */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

/* Level 2 - Card/Button hover */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06),
            0 1px 2px rgba(0, 0, 0, 0.04);

/* Level 3 - Floating panels */
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08),
            0 2px 4px rgba(0, 0, 0, 0.04);

/* Level 4 - Modals */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
            0 4px 8px rgba(0, 0, 0, 0.06);
```

### Backdrop Effects
- **Blur**: 12px (subtle) - use sparingly
- **Saturation**: 180% (when blurred)
- **Brightness**: 1.05 (day) / 0.95 (night)

---

## Animation & Transitions

### Duration
- **Fast**: 120ms (hover, small changes)
- **Default**: 200ms (most transitions)
- **Slow**: 300ms (panels, modals)
- **Splash**: 500ms (page transitions)

### Easing
- **Default**: cubic-bezier(0.4, 0, 0.2, 1) - Smooth in-out
- **Enter**: cubic-bezier(0, 0, 0.2, 1) - Ease out
- **Exit**: cubic-bezier(0.4, 0, 1, 1) - Ease in
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Playful

### Micro-interactions
- **Hover**: Scale 1.02, opacity +0.1
- **Active**: Scale 0.98, opacity +0.2
- **Focus**: Outline fade-in 120ms
- **Disabled**: Opacity 0.3, no transitions

---

## Component Patterns

### Buttons
```tsx
// Minimal Primary Button
<button className="
  px-4 py-2 rounded-md
  bg-white/[0.08] hover:bg-white/[0.12]
  border border-black/[0.06]
  text-sm font-medium
  transition-all duration-200
  hover:scale-[1.02] active:scale-[0.98]
">
```

### Inputs
```tsx
// Minimal Input Field
<input className="
  px-3 py-2 rounded-md
  bg-transparent
  border border-black/[0.06] focus:border-black/[0.2]
  text-sm
  outline-none
  transition-colors duration-200
  placeholder:text-black/[0.3]
">
```

### Cards
```tsx
// Minimal Card Container
<div className="
  p-6 rounded-lg
  bg-white/[0.02]
  border border-black/[0.06]
  shadow-[0_1px_2px_rgba(0,0,0,0.04)]
">
```

### Panels
```tsx
// Floating Minimal Panel
<div className="
  p-8 rounded-xl
  bg-white/[0.04] backdrop-blur-xl
  border border-black/[0.08]
  shadow-[0_4px_16px_rgba(0,0,0,0.08)]
">
```

---

## Iconography

### Style
- **Line-based** icons only (no filled variants)
- **Stroke width**: 1.5px (refined, not chunky)
- **Size**: 16px (default), 20px (emphasis), 24px (large)
- **Source**: Lucide React (consistent, minimal)

### Usage
- Always pair with accessible labels
- Use color sparingly (mostly inherit text color)
- Consistent optical sizing

---

## Responsive Breakpoints

- **sm**: 640px (mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (laptop)
- **xl**: 1280px (desktop)
- **2xl**: 1536px (large desktop)

### Mobile-First Approach
```tsx
// Default: mobile
// md: tablet and up
// lg: desktop and up
className="text-sm md:text-base lg:text-md"
```

---

## Accessibility

### Focus States
- 1px outline with accent color
- Never remove outlines (use custom styling)
- Minimum 44px touch targets on mobile

### Contrast Ratios
- Text on background: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI elements: Minimum 3:1

### Motion
- Respect `prefers-reduced-motion`
- Disable animations when requested

---

## Implementation Guidelines

### DO
- Use theme-aware opacity values
- Maintain generous spacing
- Keep interactions subtle but satisfying
- Test in both day/night themes
- Use semantic HTML
- Implement keyboard navigation

### DON'T
- Add glass morphism effects
- Use gradients (except for backgrounds)
- Create busy, cluttered interfaces
- Use bright, saturated accent colors
- Copy Lovable's aesthetic
- Over-animate interactions

---

## Component Checklist

Before marking a component as "redesigned":
- [ ] Follows minimal aesthetic (subtle backgrounds, borders)
- [ ] Works in both day/night themes
- [ ] Has proper hover/active/focus states
- [ ] Uses correct spacing from scale
- [ ] Accessible (keyboard nav, ARIA labels, focus states)
- [ ] Smooth transitions (200ms default)
- [ ] Icons are 16px line-style from Lucide
- [ ] Text uses defined typography scale
- [ ] Responsive (mobile-first)
- [ ] No Lovable styling remnants
