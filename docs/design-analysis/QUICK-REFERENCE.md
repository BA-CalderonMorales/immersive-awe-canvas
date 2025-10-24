# Quick Reference: Design Patterns & Color Palettes

## Color Palettes at a Glance

### Recommended Vibrant Set (Use This)
```
Cyan      #06B6D4  -  Primary actions
Magenta   #D946EF  -  Secondary actions  
Lime      #84CC16  -  Success/positive
Violet    #A855F7  -  Emphasis
Orange    #FB923C  -  Warnings
Rose      #F43F5E  -  Destructive
Teal      #14B8A6  -  Informational
Indigo    #6366F1  -  Neutral
```

### Day Theme (Light)
```
Background:  #FFFFFF (white)
Borders:     #D1D5DB (gray-300)
Text:        #1F2937 (gray-900)
Hover:       #FFFFFF (pure white)
```

### Night Theme (Dark)
```
Background:  #111827 (near-black)
Borders:     #4B5563 (slate-600)
Text:        #FFFFFF (white)
Hover:       #000000 (darker black)
```

---

## CSS Variables Template

```css
:root {
    /* Semantic colors */
    --color-primary: #06B6D4;
    --color-secondary: #8B5CF6;
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-error: #EF4444;
    
    /* Easing functions */
    --ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    
    /* Shadows (5 levels) */
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
}
```

---

## Glass Button Pattern (Copy & Paste)

```tsx
import { cn } from "@utils/utils";
import { Button } from "@/components/ui/button";

interface GlassButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    theme: "day" | "night";
    uiColor: string;
    active?: boolean;
}

const GlassButton = ({
    icon: Icon,
    label,
    onClick,
    theme,
    uiColor,
    active = false,
}: GlassButtonProps) => {
    const isDayTheme = theme === "day";
    
    return (
        <Button
            size="icon"
            onClick={onClick}
            className={cn(
                "transition-all duration-150 ease-out",
                "hover:scale-105 hover:-translate-y-0.5",
                "active:scale-95",
                active && "ring-2 ring-offset-2",
            )}
            style={{
                background: isDayTheme
                    ? "rgba(255, 255, 255, 0.9)"
                    : "rgba(0, 0, 0, 0.7)",
                borderColor: active ? uiColor : 
                    (isDayTheme ? "#D1D5DB" : "#4B5563"),
                color: isDayTheme ? "#1F2937" : uiColor,
            }}
        >
            <Icon size={20} />
        </Button>
    );
};
```

---

## Animation Easing Reference

```css
/* Use in transitions */
.button {
    transition: all 150ms var(--ease-fast);
}

/* Use in keyframes */
@keyframes slide-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: slide-in 300ms var(--ease-smooth) forwards;
}
```

**When to use each:**
- `ease-fast`: Button clicks, immediate feedback
- `ease-smooth`: Page transitions, loading states
- `ease-bounce`: Emphasized animations, attention-grabbing

---

## Focus & Accessibility Pattern

```css
/* Keyboard focus visible */
.glass-button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}

/* Mouse users don't see focus */
.glass-button:focus:not(:focus-visible) {
    outline: none;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Responsive Breakpoints

```css
/* Mobile: 320px - 640px */
@media (max-width: 640px) {
    .glass-button { min-width: 44px; min-height: 44px; }
}

/* Tablet: 641px - 1024px */
@media (min-width: 641px) and (max-width: 1024px) {
    .glass-button { min-width: 44px; min-height: 44px; }
}

/* Desktop: 1025px - 1920px */
@media (min-width: 1025px) and (max-width: 1920px) {
    .glass-button { min-width: 40px; min-height: 40px; }
}

/* Ultrawide: 1921px+ */
@media (min-width: 1921px) {
    .glass-button { min-width: 48px; min-height: 48px; }
}
```

---

## Implementation Checklist

### Phase 1: Quick Wins (1 day)
```
- [ ] Add semantic color variables to CSS
- [ ] Enhance button micro-interactions
- [ ] Add ARIA labels to buttons
- [ ] Test keyboard navigation
```

### Phase 2: Polish (1 day)
```
- [ ] Add typography system
- [ ] Create animation easing constants
- [ ] Implement shadow system
- [ ] Add keyboard focus states
```

### Phase 3: Advanced (1.5 days)
```
- [ ] Auto-hide UI on inactivity
- [ ] Add reduced motion support
- [ ] Build color picker
- [ ] Test on mobile
```

### Phase 4: Professional (2 days)
```
- [ ] Refine loading states
- [ ] Implement toast notifications
- [ ] Optimize dark theme
- [ ] Performance test
```

---

## Design Grades Summary

| Pattern | Current | Target | Effort |
|---------|---------|--------|--------|
| Glassmorphism | A+ | A+ | - (keep as is) |
| Dual Theme | A+ | A+ | - (keep as is) |
| Navigation | A | A | - (keep as is) |
| Color System | A- | A | Phase 1 (30 min) |
| Typography | B+ | A | Phase 2 (45 min) |
| Micro-interactions | A- | A+ | Phase 1 (20 min) |
| Shadows | A- | A | Phase 2 (20 min) |
| Accessibility | B+ | A | Phase 1 (1 hour) |
| Focus States | B | A+ | Phase 2 (15 min) |
| Performance | A+ | A+ | - (already good) |

---

## Font Stack Recommendation

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

---

## Sizing System (Type Scales)

```
Heading 1: clamp(2rem, 5vw, 3rem)
Heading 2: clamp(1.5rem, 4vw, 2rem)
Heading 3: clamp(1.25rem, 3vw, 1.5rem)
Body:      1rem
Label:     0.875rem (14px)
Caption:   0.75rem (12px)
```

---

## Shadow System Explanation

| Level | Use Case | Example |
|-------|----------|---------|
| xs | Minimal floating | Badges |
| sm | Default | Buttons, cards |
| md | Elevated | Modals, panels |
| lg | Prominent | Main overlays |
| xl | Maximum | Important notifications |

---

## Glass Effect Best Practices

```css
/* Perfect glass for your project */
.glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(209, 213, 219, 0.5);
    border-radius: 8px;
}

/* Dark variant */
[data-theme="night"] .glass {
    background: rgba(17, 24, 39, 0.8);
    border: 1px solid rgba(75, 85, 99, 0.5);
}
```

---

## Testing Checklist

### Keyboard Navigation
- [ ] Tab through all buttons
- [ ] Focus visible on all interactive elements
- [ ] Shortcuts work (SPACE, G, H, E, S, C, Z)

### Screen Readers
- [ ] ARIA labels present
- [ ] Icon buttons have labels
- [ ] Shortcuts documented

### Color Contrast
- [ ] Day theme text: 4.5:1 minimum
- [ ] Night theme text: 4.5:1 minimum
- [ ] Link colors readable

### Responsive
- [ ] Mobile: Touch targets 44px+
- [ ] Tablet: Optimized spacing
- [ ] Desktop: Proper alignment
- [ ] Ultrawide: Good spacing

### Performance
- [ ] Animations 60fps
- [ ] Paint times < 16ms
- [ ] No layout shifts
- [ ] CSS-only animations

---

## Common Issues & Solutions

### Issue: Glass blur causes text to be hard to read
**Solution:** Increase background opacity or add text shadow

### Issue: Focus outline clashes with design
**Solution:** Use `focus-visible` to only show for keyboard users

### Issue: Animations feel sluggish
**Solution:** Use `ease-fast` instead of `ease-smooth`

### Issue: Dark theme looks dull
**Solution:** Use brighter accent colors and increase shadow opacity

### Issue: Touch targets too small on mobile
**Solution:** Ensure minimum 44px x 44px with `min-width`/`min-height`

---

## Files to Update

1. `client/index.css` - Add CSS variables and patterns
2. `tailwind.config.ts` - Add custom font sizes
3. `client/components/experience/ui/GlassButton.tsx` - Enhance interactions
4. `client/components/experience/ui/TopBar.tsx` - Add ARIA labels
5. `client/components/experience/ui/BottomBar.tsx` - Add ARIA labels

---

## Recommended Implementation Order

1. Start with Phase 1 (can do in 1 day)
2. Colors first (enables everything else)
3. ARIA labels next (accessibility)
4. Button enhancements last (visual polish)

Then move to Phase 2 when ready.

---

## Resources

- Contrast checker: https://webaim.org/resources/contrastchecker/
- ARIA guide: https://www.w3.org/WAI/ARIA/apg/
- Easing: https://cubic-bezier.com/
- Type scales: https://typescale.com/
- Shadows: https://material.io/design/environment/elevation.html

---

**Print this page as your quick reference while implementing!**
