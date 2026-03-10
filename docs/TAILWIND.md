# Tailwind CSS Setup

This document explains the Tailwind CSS v4 setup in the Thunder project.

## Overview

Tailwind CSS v4 introduces a new CSS-first configuration approach, eliminating the need for JavaScript config files.

## Setup

### 1. Vite Plugin

Tailwind is integrated via the `@tailwindcss/vite` plugin:

```typescript
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### 2. CSS Import

Import Tailwind in your main CSS file:

```css
/* src/index.css */
@import "tailwindcss";
```

### 3. Import in Application

Import the CSS file in your entry point:

```typescript
// src/main.tsx
import "./index.css";
```

## Tailwind v4 vs v3

| Feature | v3 | v4 |
|---------|----|----|
| Config file | `tailwind.config.js` | CSS-first (no config file) |
| PostCSS | Required | Not required |
| Theme customization | JS config | CSS variables |
| Build speed | Fast | Faster (Rust-based) |

## Customization

### Theme Variables

Customize the theme directly in CSS:

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-family-display: "Inter", sans-serif;
}
```

### Using Custom Variables

```tsx
<button className="bg-primary text-white">
  Click me
</button>
```

### Extending Colors

```css
@import "tailwindcss";

@theme {
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-300: #7dd3fc;
  --color-brand-400: #38bdf8;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
}
```

## Common Patterns

### Active Link Styling

TanStack Router adds an `active` class to active links:

```tsx
<Link
  to="/"
  className="[&.active]:text-blue-600 text-gray-900"
>
  Home
</Link>
```

### Responsive Design

Use responsive prefixes for different screen sizes:

```tsx
<div className="px-4 sm:px-6 lg:px-8">
  <!-- Content -->
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Dark Mode

Enable dark mode with the `dark:` prefix:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- Content -->
</div>
```

### Hover, Focus, and Active States

```tsx
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-300">
  Click me
</button>
```

## Utility Classes Reference

### Layout
- `flex`, `grid` - Display modes
- `justify-center`, `items-center` - Alignment
- `gap-4` - Gap between items

### Spacing
- `p-4` - Padding
- `m-4` - Margin
- `px-4`, `py-4` - Horizontal/vertical padding
- `space-x-4` - Space between children

### Typography
- `text-sm`, `text-lg`, `text-xl` - Font size
- `font-bold`, `font-medium` - Font weight
- `text-gray-900` - Text color

### Backgrounds
- `bg-white`, `bg-gray-50` - Background color
- `bg-opacity-50` - Opacity

### Borders
- `border`, `border-2` - Border width
- `border-gray-200` - Border color
- `rounded`, `rounded-lg` - Border radius

### Shadows
- `shadow-sm`, `shadow`, `shadow-lg` - Box shadow

## Best Practices

1. **Use semantic color names**: Create custom colors like `primary`, `secondary` instead of hardcoding hex values

2. **Group related utilities**: Keep responsive variants together
   ```tsx
   <div className="px-4 py-2 sm:px-6 sm:py-3">
   ```

3. **Extract components**: For repeated patterns, create React components
   ```tsx
   function Button({ children }) {
     return (
       <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
         {children}
       </button>
     );
   }
   ```

4. **Use the `@apply` directive sparingly**: Prefer utility classes directly in JSX

## Troubleshooting

### Styles not updating
- Restart the dev server
- Clear browser cache
- Check for CSS syntax errors

### Classes not working
- Verify class name spelling
- Check if the class exists in Tailwind
- Ensure no conflicting CSS is overriding

### Production build issues
- Run `bun run build` to check for errors
- Verify all CSS imports are correct
