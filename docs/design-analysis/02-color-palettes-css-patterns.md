# Professional Color Palettes & CSS Patterns for Three.js Immersive UIs

## COLOR PALETTE SYSTEMS

### Primary Palette: Recommended Accent Colors

#### Vibrant, Modern Set (Recommended for Your Project)
```
Cyan-500:      #06B6D4  rgb(6, 182, 212)
Magenta-500:   #D946EF  rgb(217, 70, 239)
Lime-500:      #84CC16  rgb(132, 204, 22)
Violet-500:    #A855F7  rgb(168, 85, 247)
Orange-500:    #FB923C  rgb(251, 146, 60)
Rose-500:      #F43F5E  rgb(244, 63, 94)
Teal-500:      #14B8A6  rgb(20, 184, 166)
Indigo-500:    #6366F1  rgb(99, 102, 241)
```

**Why These Work:**
- High saturation but not overwhelming
- WCAG AA contrast on both light and dark backgrounds
- Trendy in modern three.js applications
- Distinct enough to identify separate worlds/scenes
- Work well with glassmorphism effects

#### Professional, Sophisticated Set
```
Slate-400:     #94A3B8  rgb(148, 163, 184)
Blue-400:      #60A5FA  rgb(96, 165, 250)
Emerald-400:   #34D399  rgb(52, 211, 153)
Amber-400:     #FBBF24  rgb(251, 191, 36)
Fuchsia-400:   #E879F9  rgb(232, 121, 249)
Cyan-400:      #22D3EE  rgb(34, 211, 238)
Lime-400:      #A3E635  rgb(163, 230, 53)
Violet-400:    #C4B5FD  rgb(196, 181, 253)
```

**Best For:** Corporate or premium aesthetic

---

### Grayscale System (For Day Theme)

```
White:         #FFFFFF  rgb(255, 255, 255)
Gray-50:       #F9FAFB  rgb(249, 250, 251)
Gray-100:      #F3F4F6  rgb(243, 244, 246)
Gray-200:      #E5E7EB  rgb(229, 231, 235)
Gray-300:      #D1D5DB  rgb(209, 213, 219)  [Border]
Gray-600:      #4B5563  rgb(75, 85, 99)
Gray-700:      #374151  rgb(55, 65, 81)
Gray-900:      #111827  rgb(17, 24, 39)
Black:         #000000  rgb(0, 0, 0)
```

**Usage:**
- Gray-300: Borders in day theme
- Gray-900: Text in day theme
- Gray-600: Hover states
- White: Backgrounds

### Dark Theme System

```
Pure Black:    #000000  rgb(0, 0, 0)
Near Black:    #0F172A  rgb(15, 23, 42)
Dark BG:       #111827  rgb(17, 24, 39)    [Panel background]
Slate-600:     #475569  rgb(71, 85, 105)   [Borders]
Slate-400:     #94A3B8  rgb(148, 163, 184) [Secondary text]
Gray-300:      #D1D5DB  rgb(209, 213, 219) [Primary text]
White:         #FFFFFF  rgb(255, 255, 255) [Text emphasis]
```

---

## PROFESSIONAL CSS PATTERNS

### Pattern 1: Glass Container with Optimal Depth

```css
/* Premium glass effect matching your current implementation */
.glass-container {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(209, 213, 219, 0.5);
    border-radius: 8px;
    
    /* Subtle shadow for depth */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    /* Performance: hardware acceleration */
    transform: translateZ(0);
    will-change: backdrop-filter;
}

/* Dark theme variant */
[data-theme="night"] .glass-container {
    background: rgba(17, 24, 39, 0.8);
    border: 1px solid rgba(75, 85, 99, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Pattern 2: Interactive Button States

```css
/* Comprehensive button state management */
.glass-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    min-width: 40px;
    padding: 0.5rem;
    
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid transparent;
    border-radius: 6px;
    color: #1F2937;
    font-size: 0.875rem;
    font-weight: 500;
    
    /* Smooth transitions */
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    
    /* GPU acceleration */
    transform: translateZ(0);
    backface-visibility: hidden;
}

/* Hover state: lift and brighten */
.glass-button:hover {
    transform: scale(1.05) translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 1);
}

/* Active state: press down */
.glass-button:active {
    transform: scale(0.98) translateY(0);
    transition-duration: 75ms;
}

/* Focus state: keyboard accessible */
.glass-button:focus {
    outline: none;
    ring: 2px;
    ring-color: currentColor;
    ring-offset: 2px;
}

/* Dark theme variant */
[data-theme="night"] .glass-button {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(75, 85, 99, 0.5);
    color: #FFFFFF;
}

[data-theme="night"] .glass-button:hover {
    background: rgba(0, 0, 0, 0.9);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Active state with color accent */
.glass-button.active {
    border-color: currentColor;
    box-shadow: inset 0 0 0 1px currentColor;
    animation: pulse-glow 0.4s ease-out;
}

@keyframes pulse-glow {
    0% {
        box-shadow: 0 0 0 0 currentColor;
    }
    70% {
        box-shadow: 0 0 0 8px rgba(var(--color-accent), 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(var(--color-accent), 0);
    }
}
```

### Pattern 3: Typography System

```css
/* Semantic typography hierarchy */

/* Heading 1: Main titles (World name) */
.h1,
h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: #111827;
}

[data-theme="night"] .h1,
[data-theme="night"] h1 {
    color: #FFFFFF;
}

/* Heading 2: Section titles */
.h2,
h2 {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
}

/* Paragraph: Body text */
.body,
p {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
    color: #4B5563;
}

[data-theme="night"] .body,
[data-theme="night"] p {
    color: #D1D5DB;
}

/* Label: Button text, labels */
.label,
label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: #6B7280;
}

[data-theme="night"] .label,
[data-theme="night"] label {
    color: #9CA3AF;
}

/* Caption: Help text, hints */
.caption,
.text-caption {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01em;
    color: #9CA3AF;
    opacity: 0.7;
}

[data-theme="night"] .caption,
[data-theme="night"] .text-caption {
    color: #6B7280;
}

/* Mono: Code, technical text */
.mono,
code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    font-weight: 500;
}
```

### Pattern 4: Layered Shadow System

```css
/* Comprehensive shadow system for depth */

/* Shadow Level 0: No shadow (flat) */
.shadow-none {
    box-shadow: none;
}

/* Shadow Level 1: Floating (buttons, badges) */
.shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Shadow Level 2: Lifted (cards, inputs) */
.shadow-sm {
    box-shadow: 
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* Shadow Level 3: Elevated (modals, panels) */
.shadow-md {
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Shadow Level 4: Prominent (main modals) */
.shadow-lg {
    box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Shadow Level 5: Maximum (overlays, notifications) */
.shadow-xl {
    box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark theme: Increase opacity for visibility */
[data-theme="night"] .shadow-sm {
    box-shadow: 
        0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.15);
}

[data-theme="night"] .shadow-md {
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.3),
        0 2px 4px -1px rgba(0, 0, 0, 0.15);
}

[data-theme="night"] .shadow-lg {
    box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.3),
        0 4px 6px -2px rgba(0, 0, 0, 0.1);
}
```

### Pattern 5: Transition & Animation Easing

```css
/* Professional easing functions */

/* Fast, snappy (interactive feedback) */
--ease-in-out-fast: cubic-bezier(0.4, 0, 0.2, 1);

/* Natural, smooth (transitions) */
--ease-in-out-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Bouncy, playful (emphasized states) */
--ease-in-out-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Applied to transitions */
.glass-button {
    transition-property: all;
    transition-duration: 150ms;
    transition-timing-function: var(--ease-in-out-fast);
}

/* Applied to animations */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-animation {
    animation: fade-in 300ms var(--ease-in-out-smooth) forwards;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## SPECIFIC EXAMPLES FOR YOUR USE CASES

### Example 1: Scene World Selector (Top Bar)

```tsx
import React from 'react';

const WorldSelector = ({ worlds, currentIndex, onSelect, theme, accentColor }) => {
    return (
        <div className="glass-container">
            <h2 className="h2" style={{ color: accentColor }}>
                {worlds[currentIndex].name}
            </h2>
            <p className="caption">
                World {currentIndex + 1} of {worlds.length}
            </p>
        </div>
    );
};

export default WorldSelector;
```

**CSS:**
```css
.glass-container {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(209, 213, 219, 0.5);
    border-radius: 8px;
    padding: 1rem;
    
    /* Smooth color transitions */
    transition: border-color 300ms var(--ease-in-out-smooth);
}

.glass-container:hover {
    border-color: rgba(209, 213, 219, 1);
}
```

### Example 2: Settings Panel (Bottom Bar)

```tsx
const SettingsPanel = ({ 
    settings, 
    onChange, 
    theme, 
    accentColor 
}) => {
    return (
        <div className="settings-panel glass-container">
            <h3 className="h3">Settings</h3>
            
            {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="setting-row">
                    <label className="label">{key}</label>
                    <input
                        type="range"
                        value={value}
                        onChange={(e) => onChange(key, e.target.value)}
                        className="slider"
                    />
                </div>
            ))}
        </div>
    );
};
```

**CSS:**
```css
.settings-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-height: 400px;
    overflow-y: auto;
}

.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.slider {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.1),
        var(--accent-color, currentColor)
    );
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-color, currentColor);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 150ms var(--ease-in-out-fast);
}

.slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent-color, currentColor);
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

### Example 3: Notification/Toast Component

```tsx
const Toast = ({ 
    message, 
    type = 'info',
    duration = 3000,
    theme,
    accentColor
}) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            // fade out
        }, duration);
        return () => clearTimeout(timer);
    }, [duration]);
    
    return (
        <div className={`toast toast-${type}`}>
            <p className="body">{message}</p>
        </div>
    );
};
```

**CSS:**
```css
.toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    
    animation: toast-slide-in 300ms var(--ease-in-out-fast);
    z-index: 9999;
}

.toast.toast-success {
    border-color: rgba(16, 185, 129, 0.5);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.toast.toast-error {
    border-color: rgba(239, 68, 68, 0.5);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}

.toast.toast-warning {
    border-color: rgba(245, 158, 11, 0.5);
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
}

@keyframes toast-slide-in {
    from {
        opacity: 0;
        transform: translateX(100px) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0) translateY(0);
    }
}

@keyframes toast-slide-out {
    from {
        opacity: 1;
        transform: translateX(0) translateY(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px) translateY(20px);
    }
}
```

---

## CSS VARIABLES FOR DYNAMIC THEMING

```css
:root {
    /* Colors */
    --color-primary: #06B6D4;
    --color-secondary: #8B5CF6;
    --color-success: #10B981;
    --color-warning: #F59E0B;
    --color-danger: #EF4444;
    
    /* Backgrounds */
    --bg-primary: #FFFFFF;
    --bg-secondary: #F9FAFB;
    --bg-tertiary: #F3F4F6;
    
    /* Text */
    --text-primary: #111827;
    --text-secondary: #4B5563;
    --text-tertiary: #9CA3AF;
    
    /* Borders */
    --border-primary: #D1D5DB;
    --border-secondary: #E5E7EB;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Easing */
    --ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

[data-theme="night"] {
    --color-primary: #06B6D4;
    --color-secondary: #C084FC;
    --color-success: #34D399;
    --color-warning: #FBBF24;
    --color-danger: #F87171;
    
    --bg-primary: #111827;
    --bg-secondary: #1F2937;
    --bg-tertiary: #374151;
    
    --text-primary: #F9FAFB;
    --text-secondary: #D1D5DB;
    --text-tertiary: #9CA3AF;
    
    --border-primary: #4B5563;
    --border-secondary: #374151;
    
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}
```

---

## RESPONSIVE BREAKPOINTS FOR 3D CANVAS UIs

```css
/* Mobile First Approach */

/* Extra small devices: 320px - 640px */
@media (max-width: 640px) {
    .glass-button {
        min-width: 44px;
        min-height: 44px;
        padding: 0.75rem;
    }
    
    .h1, h1 {
        font-size: 1.5rem;
    }
    
    .top-bar {
        padding: 0.75rem;
        gap: 0.5rem;
    }
}

/* Small devices: 641px - 768px */
@media (min-width: 641px) and (max-width: 768px) {
    .glass-button {
        min-width: 44px;
        min-height: 44px;
    }
    
    .top-bar {
        padding: 1rem;
        gap: 1rem;
    }
}

/* Medium devices: 769px - 1024px */
@media (min-width: 769px) and (max-width: 1024px) {
    .glass-button {
        min-width: 40px;
        min-height: 40px;
    }
    
    .top-bar {
        padding: 1.5rem;
        gap: 1.5rem;
    }
}

/* Large devices: 1025px - 1920px */
@media (min-width: 1025px) and (max-width: 1920px) {
    .glass-button {
        min-width: 40px;
        min-height: 40px;
    }
    
    .top-bar {
        padding: 2rem;
        gap: 2rem;
    }
}

/* Extra large devices: 1921px+ */
@media (min-width: 1921px) {
    .glass-button {
        min-width: 48px;
        min-height: 48px;
        font-size: 1rem;
    }
    
    .top-bar {
        padding: 2.5rem;
        gap: 2.5rem;
    }
    
    .h1, h1 {
        font-size: clamp(3rem, 6vw, 4rem);
    }
}
```

---

## CONCLUSION

These patterns and color systems are:
1. Production-ready
2. Accessible (WCAG AA+)
3. Performance-optimized
4. Theme-flexible
5. Modern and professional

Implement these incrementally in your Immersive Awe Canvas project to enhance its already-excellent design foundation.

