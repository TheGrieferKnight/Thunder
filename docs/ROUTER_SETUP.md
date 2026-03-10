# Router Setup

This document explains how the TanStack Router is initialized and configured.

## Overview

The router is the core of TanStack Router, managing route matching, navigation, and state.

## Router Instance

### Location

The router is defined in `src/router.ts`:

```typescript
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = createRouter({ routeTree });
```

### Type Safety

The `Register` interface declaration enables full type inference throughout your app:

- Autocomplete for route paths in `<Link to="...">`
- Type-safe `params` and `search` objects
- Inferred loader data types

## Route Tree

### Generated File

The route tree is auto-generated at `src/routeTree.gen.ts`:

```typescript
// Auto-generated - DO NOT EDIT
import { Route as rootRoute } from './routes/__root'

// Route imports and configuration...
export const routeTree = rootRoute._addFileChildren({...})
```

### Generation

The route tree is regenerated when:
- Starting the dev server
- Adding/removing/renaming route files
- Running `bun run build`

## Router Provider

The router is provided to your app via `RouterProvider`:

```tsx
// src/main.tsx
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
```

## Router Configuration Options

```typescript
export const router = createRouter({
  routeTree,
  
  // Enable scroll restoration
  scrollRestoration: true,
  
  // Default preload delay (ms)
  defaultPreloadDelay: 100,
  
  // Preload on link hover
  defaultPreload: 'intent',
  
  // Custom not found component
  notFoundMode: 'fuzzy',
  
  // History manager (for custom history)
  history: createBrowserHistory(),
});
```

### Common Options

| Option | Description | Default |
|--------|-------------|---------|
| `routeTree` | Generated route tree | Required |
| `scrollRestoration` | Restore scroll on navigation | `false` |
| `defaultPreload` | Preload strategy | `'intent'` |
| `defaultPreloadDelay` | Delay before preload | `50` |
| `notFoundMode` | 404 handling | `'fuzzy'` |

## Router Devtools

TanStack Router includes devtools for debugging:

### Installation

```bash
bun add -D @tanstack/react-router-devtools
```

### Usage

Add to your root layout:

```tsx
import { ReactRouterDevtools } from "@tanstack/react-router-devtools";

function RootComponent() {
  return (
    <>
      {/* Your app */}
      <Outlet />
      
      {/* Devtools - only in development */}
      {import.meta.env.DEV && <ReactRouterDevtools />}
    </>
  );
}
```

## Router Hooks

### useNavigate

Programmatically navigate:

```tsx
import { useNavigate } from "@tanstack/react-router";

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate({ to: "/settings" })}>
      Go to Settings
    </button>
  );
}
```

### useRouter

Access the router instance:

```tsx
import { useRouter } from "@tanstack/react-router";

function MyComponent() {
  const router = useRouter();
  
  // Access router state
  console.log(router.state.location.pathname);
  
  return <div>Current path: {router.state.location.pathname}</div>;
}
```

### useLocation

Access current location:

```tsx
import { useLocation } from "@tanstack/react-router";

function MyComponent() {
  const location = useLocation();
  
  return (
    <div>
      <p>Path: {location.pathname}</p>
      <p>Search: {JSON.stringify(location.search)}</p>
    </div>
  );
}
```

### useParams

Access route parameters:

```tsx
import { useParams } from "@tanstack/react-router";

function MyComponent() {
  const params = useParams({ from: "/items/$id" });
  
  return <div>Item ID: {params.id}</div>;
}
```

### useSearch

Access search parameters:

```tsx
import { useSearch } from "@tanstack/react-router";

function MyComponent() {
  const search = useSearch({ from: "/search" });
  
  return <div>Query: {search.q}</div>;
}
```

## Navigation Methods

### navigate

Navigate to a new route:

```tsx
router.navigate({ to: "/settings" });
router.navigate({ to: "/items/$id", params: { id: "123" } });
router.navigate({ to: "/search", search: { q: "hello" } });
```

### push

Add to history stack (navigate):

```tsx
router.history.push("/settings");
```

### replace

Replace current entry:

```tsx
router.history.replace("/settings");
```

### go back/forward

```tsx
router.history.go(-1); // Back
router.history.go(1);  // Forward
```

## Integration with TanStack Query

TanStack Router integrates seamlessly with TanStack Query for data fetching:

### Route Loader with Query

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";

const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });

export const Route = createFileRoute("/users/$userId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQueryOptions(params.userId)),
  component: UserComponent,
});

function UserComponent() {
  const { userId } = Route.useParams();
  const { data } = useQuery(userQueryOptions(userId));
  return <div>{data.name}</div>;
}
```

### Passing QueryClient to Loader

```tsx
// In router.ts
export const router = createRouter({
  routeTree,
  context: { queryClient },
});

// Make typesafe
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

## Best Practices

1. **Keep router.ts minimal**: Only router configuration belongs here
2. **Use type inference**: Let TypeScript infer types from routes
3. **Preload strategically**: Use `defaultPreload: 'intent'` for better UX
4. **Handle 404s**: Configure a not found route or component
5. **Integrate with Query**: Use route loaders with TanStack Query

## Troubleshooting

### Routes not type-safe
- Ensure `declare module` is present in router.ts
- Check that `routeTree.gen.ts` is generated
- Restart TypeScript server in your IDE

### Navigation issues
- Check route paths match file names
- Verify params for dynamic routes
- Use browser DevTools to inspect router state

### Build errors
- Run `bun run build` to regenerate route tree
- Check for syntax errors in route files
- Verify all imports are correct
