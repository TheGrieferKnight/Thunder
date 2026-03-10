# Vite Configuration

This document explains the Vite configuration for the Thunder project.

## Overview

Vite is our build tool and development server. It's configured with several plugins to support our tech stack.

## Plugins

### 1. TanStack Router Plugin

```typescript
import { tanstackRouter } from "@tanstack/router-plugin/vite";

tanstackRouter({
  routesDirectory: "./src/routes",
  generatedRouteTree: "./src/routeTree.gen.ts",
})
```

**Purpose:** Enables file-based routing by automatically generating a route tree from your route files.

**Configuration Options:**
- `routesDirectory`: The folder containing your route files (default: `./src/routes`)
- `generatedRouteTree`: Output path for the generated route tree file
- `routeFileIgnorePrefix`: Prefix for files that should be ignored (default: `-`)
- `quoteStyle`: Quote style for generated code (`'single'` or `'double'`)

**How it works:**
1. Scans the `routesDirectory` for route files
2. Parses file names to determine route paths
3. Generates `routeTree.gen.ts` with type-safe route definitions
4. Regenerates automatically when route files change

### 2. Tailwind CSS Plugin

```typescript
import tailwindcss from "@tailwindcss/vite";

tailwindcss()
```

**Purpose:** Integrates Tailwind CSS v4 into the Vite build process.

**Tailwind v4 Changes:**
- No separate `tailwind.config.js` needed
- Configuration is done directly in CSS
- Uses `@import "tailwindcss"` in your CSS file
- Faster build times with the new engine

### 3. React Plugin with Babel

```typescript
import react from "@vitejs/plugin-react";

react({
  babel: {
    plugins: ['babel-plugin-react-compiler'],
  },
})
```

**Purpose:** Enables React support with the React Compiler for automatic optimizations.

**React Compiler:**
- Automatically memoizes components
- Reduces unnecessary re-renders
- No manual `useMemo` or `useCallback` needed in most cases

## Server Configuration

```typescript
server: {
  port: 1420,
  strictPort: true,
  host: host || false,
  hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
  watch: {
    ignored: ["**/src-tauri/**"],
  },
}
```

**Options:**
- `port: 1420`: Fixed port for Tauri compatibility
- `strictPort: true`: Fails if port is unavailable
- `hmr`: Hot Module Replacement configuration for remote development
- `watch.ignored`: Excludes `src-tauri` from file watching (Rust changes trigger Tauri's own reload)

## Adding New Plugins

To add a new Vite plugin:

1. Install the package:
   ```bash
   bun add -D <package-name>
   ```

2. Import and add to the plugins array in `vite.config.ts`:
   ```typescript
   import newPlugin from "new-plugin";

   export default defineConfig({
     plugins: [
       // ... existing plugins
       newPlugin(),
     ],
   })
   ```

## Troubleshooting

### Route tree not generating
- Ensure the TanStack Router plugin is listed before other plugins
- Check that route files are in the correct directory
- Try restarting the dev server

### Tailwind styles not applying
- Verify `@import "tailwindcss"` is in your main CSS file
- Ensure the CSS file is imported in `main.tsx`
- Check browser DevTools for conflicting styles

### Build errors
- Run `bun run build` to see TypeScript errors
- Check that all imports are correct
- Verify `tsconfig.json` settings
