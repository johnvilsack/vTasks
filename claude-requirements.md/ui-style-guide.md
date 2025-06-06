# vTasks 2.0 UI Style Guide

This style guide provides direction for implementing the visual design of vTasks 2.0, emphasizing a clean, modern aesthetic while preserving the functional layout users appreciate.

## 1. Design Philosophy

vTasks 2.0 follows a minimalist, functional design approach inspired by Braun's classic industrial design and modern Apple aesthetics. The interface should:

- Prioritize content and functionality over decoration
- Use whitespace effectively to create visual hierarchy
- Employ subtle depth and elevation to establish interface layers
- Support both light and dark modes with equal consideration
- Remain accessible to all users regardless of abilities

## 2. Color System

### 2.1 Base Colors

The color system uses CSS variables to enable theming and mode switching:

#### Light Mode
```css
:root {
  --bg-color: 248, 250, 252;
  --card-bg-color: 255, 255, 255;
  --text-primary: 17, 24, 39;
  --text-secondary: 107, 114, 128;
  --text-placeholder: 156, 163, 175;
  --accent-color: 59, 130, 246;
  --accent-color-hover: 37, 99, 235;
  --accent-text-color: 255, 255, 255;
  --border-color: 229, 231, 235;
  --divider-color: 243, 244, 246;
  --input-bg-color: 249, 250, 251;
  --input-border-color: 209, 213, 219;
  --button-secondary-bg-color: 229, 231, 235;
  --button-secondary-text-color: 55, 65, 81;
  --destructive-color: 239, 68, 68;
  --destructive-color-hover: 220, 38, 38;
  --completed-text-color: 156, 163, 175;
  --completed-accent-color: 209, 213, 219;
  --highlight-color: 79, 70, 229;
}
```

#### Dark Mode
```css
:root.dark {
  --bg-color: 17, 24, 39;
  --card-bg-color: 31, 41, 55;
  --text-primary: 243, 244, 246;
  --text-secondary: 209, 213, 219;
  --text-placeholder: 156, 163, 175;
  --accent-color: 59, 130, 246;
  --accent-color-hover: 96, 165, 250;
  --accent-text-color: 255, 255, 255;
  --border-color: 55, 65, 81;
  --divider-color: 55, 65, 81;
  --input-bg-color: 31, 41, 55;
  --input-border-color: 75, 85, 99;
  --button-secondary-bg-color: 55, 65, 81;
  --button-secondary-text-color: 229, 231, 235;
  --destructive-color: 248, 113, 113;
  --destructive-color-hover: 239, 68, 68;
  --completed-text-color: 107, 114, 128;
  --completed-accent-color: 55, 65, 81;
  --highlight-color: 129, 140, 248;
}
```

### 2.2 Semantic Colors

#### Priority Colors
- Critical: `rgb(239, 68, 68)` (red-500)
- High: `rgb(245, 158, 11)` (amber-500)
- Normal: No special color (uses border-color)
- Low: `rgb(14, 165, 233)` (sky-500)

#### Status Colors
- Active: No special color (uses card-bg-color)
- Snoozed: Light blue background `rgba(186, 230, 253, 0.2)` (sky-100 at 20% opacity)
- Completed: Light gray background with reduced opacity
- Stashed: Light yellow background `rgba(254, 249, 195, 0.2)` (yellow-100 at 20% opacity)
- Woke Up: Light green accent `rgb(74, 222, 128)` (green-400)

## 3. Typography

### 3.1 Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

### 3.2 Type Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### 3.3 Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3.4 Usage Guidelines

- App Title: `text-xl` + `font-semibold`
- Card Titles: `text-base` + `font-medium`
- Card Details: `text-sm` + `font-normal`
- Metadata: `text-xs` + `font-normal`
- Buttons: `text-sm` + `font-medium`
- Form Labels: `text-xs` + `font-medium`
- Form Inputs: `text-sm` + `font-normal`

## 4. Layout & Spacing

### 4.1 Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 4.2 Container Widths

```css
--max-width-xs: 20rem;    /* 320px */
--max-width-sm: 24rem;    /* 384px */
--max-width-md: 28rem;    /* 448px */
--max-width-lg: 32rem;    /* 512px */
--max-width-xl: 36rem;    /* 576px */
--max-width-2xl: 42rem;   /* 672px */
--max-width-3xl: 48rem;   /* 768px */
--max-width-4xl: 56rem;   /* 896px */
--max-width-5xl: 64rem;   /* 1024px */
--max-width-6xl: 72rem;   /* 1152px */
```

### 4.3 Breakpoints

```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

## 5. Component Styling

### 5.1 Card Design

#### Base Card
```css
.card {
  padding: var(--space-3);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  background-color: rgb(var(--card-bg-color));
  border: 1px solid rgb(var(--border-color));
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
}
```

#### Priority Indicators
```css
.card.priority-critical {
  border-left: 4px solid rgb(239, 68, 68);
}

.card.priority-high {
  border-left: 4px solid rgb(245, 158, 11);
}

.card.priority-normal {
  border-left: 1px solid rgb(var(--border-color));
}

.card.priority-low {
  border-left: 4px solid rgb(14, 165, 233);
}
```

#### Status Styles
```css
.card.snoozed {
  background-color: rgba(186, 230, 253, 0.2);
}

.card.completed {
  background-color: rgb(var(--card-bg-color));
  opacity: 0.7;
}

.card.stashed {
  background-color: rgba(254, 249, 195, 0.2);
}
```

### 5.2 Form Controls

#### Buttons
```css
.button {
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all 0.15s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button-primary {
  background-color: rgb(var(--accent-color));
  color: rgb(var(--accent-text-color));
}

.button-primary:hover {
  background-color: rgb(var(--accent-color-hover));
}

.button-secondary {
  background-color: rgb(var(--button-secondary-bg-color));
  color: rgb(var(--button-secondary-text-color));
}

.button-secondary:hover {
  opacity: 0.9;
}

.button-destructive {
  background-color: rgb(var(--destructive-color));
  color: white;
}

.button-destructive:hover {
  background-color: rgb(var(--destructive-color-hover));
}
```

#### Inputs
```css
.input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgb(var(--input-border-color));
  background-color: rgb(var(--input-bg-color));
  color: rgb(var(--text-primary));
  font-size: var(--text-sm);
  width: 100%;
  transition: all 0.15s ease-in-out;
}

.input:focus {
  outline: none;
  border-color: rgb(var(--accent-color));
  box-shadow: 0 0 0 2px rgba(var(--accent-color), 0.2);
}

.input::placeholder {
  color: rgb(var(--text-placeholder));
}
```

#### Checkboxes
```css
.checkbox {
  appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgb(var(--input-border-color));
  border-radius: 0.25rem;
  margin-right: 0.5rem;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
}

.checkbox:checked {
  background-color: rgb(var(--accent-color));
  border-color: rgb(var(--accent-color));
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

### 5.3 Tab Navigation
```css
.tabs {
  display: flex;
  border-bottom: 1px solid rgb(var(--divider-color));
  margin-bottom: var(--space-4);
}

.tab {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: rgb(var(--text-secondary));
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.tab:hover {
  color: rgb(var(--text-primary));
}

.tab.active {
  color: rgb(var(--accent-color));
  border-bottom-color: rgb(var(--accent-color));
}
```

## 6. Card Layout Reference

### 6.1 Task Card Layout

```
┌────────────────────────────────────────────────┐
│ [□] Task Title                           •••   │
│                                                │
│ Optional details would appear here...          │
│                                                │
│ Project - Contact                 Due: Jun 5   │
└────────────────────────────────────────────────┘
```

### 6.2 Layout Specifications

```css
.card {
  display: grid;
  grid-template-areas:
    "checkbox title actions"
    "spacer details details"
    "metadata dates dates";
  grid-template-columns: auto 1fr auto;
  gap: var(--space-2);
}

.card-checkbox {
  grid-area: checkbox;
  align-self: center;
}

.card-title {
  grid-area: title;
  padding-right: var(--space-16);
}

.card-actions {
  grid-area: actions;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
}

.card:hover .card-actions {
  opacity: 1;
}

.card-details {
  grid-area: details;
  font-size: var(--text-sm);
  color: rgb(var(--text-secondary));
}

.card-metadata {
  grid-area: metadata;
  font-size: var(--text-xs);
  color: rgb(var(--text-secondary));
}

.card-dates {
  grid-area: dates;
  font-size: var(--text-xs);
  text-align: right;
  color: rgb(var(--text-secondary));
}
```

## 7. Responsive Design

### 7.1 Mobile Layout

On mobile devices (< 640px):
- Full-width cards
- Bottom navigation bar
- Collapsible filter controls
- Action buttons always visible
- Modal forms take up more screen space

### 7.2 Tablet/Desktop Layout

On larger screens (≥ 640px):
- Two-panel layout (navigation sidebar + content)
- Fixed-width cards centered in the content area
- Expanded filter options
- Action buttons revealed on hover
- Modal forms with moderate width and centered placement

## 8. Animation Guidelines

### 8.1 Timing Functions

```css
--transition-fast: 150ms;
--transition-normal: 200ms;
--transition-slow: 300ms;
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### 8.2 Key Animations

#### Card Entrance Animation
```css
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-entrance {
  animation: cardEntrance var(--transition-normal) var(--ease-out) forwards;
}
```

#### Snooze Return Animation
```css
@keyframes snoozeReturn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
    background-color: rgba(186, 230, 253, 0.4);
  }
  50% {
    background-color: rgba(186, 230, 253, 0.4);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    background-color: rgba(186, 230, 253, 0.2);
  }
}

.snooze-return {
  animation: snoozeReturn var(--transition-slow) var(--ease-out) forwards;
}
```

## 9. Accessibility Considerations

### 9.1 Color Contrast

- Maintain a minimum contrast ratio of 4.5:1 for normal text
- Use 3:1 minimum contrast for large text and UI components
- Test both light and dark modes for proper contrast

### 9.2 Focus States

```css
:focus {
  outline: 2px solid rgb(var(--accent-color));
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid rgb(var(--accent-color));
  outline-offset: 2px;
}
```

### 9.3 Screen Reader Support

- Use proper ARIA attributes
- Ensure logical tab order
- Provide text alternatives for icons
- Support keyboard navigation for all interactive elements

## 10. Icon System

### 10.1 Icon Guidelines

- Use consistent line weight (1.5px stroke)
- 24x24px viewbox for standard icons
- Match icon color to text color by default
- Maintain simple, recognizable shapes

### 10.2 Common Icons

```
• Task: checkbox or circle
• Note: document or note
• Complete: checkmark
• Edit: pencil
• Delete: trash can
• Archive: box
• Snooze: clock
• Priority: flag or exclamation
• Project: folder
• Tag: tag
• Filter: funnel
• Search: magnifying glass
• More actions: three dots
• Add: plus
• Close: X
• Sync: circular arrows
```

## 11. Implementation Notes

### 11.1 CSS Methodology

- Use CSS variables for theming and consistency
- Consider a utility-first approach for rapid development
- Implement dark mode with a class-based toggle
- Use semantic class names for component states

### 11.2 Responsive Implementation

- Use mobile-first development approach
- Implement breakpoints for larger screens
- Test on multiple device sizes
- Ensure touch targets are at least 44x44px

### 11.3 Performance Considerations

- Optimize transitions and animations
- Minimize layout shifts
- Implement efficient list rendering
- Use appropriate image formats and sizes