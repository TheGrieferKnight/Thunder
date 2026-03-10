# File-Based Routing Guide

This comprehensive guide explains how file-based routing works in TanStack Router and how to add new routes.

## Overview

TanStack Router's file-based routing automatically generates route definitions from your file structure. This eliminates manual route configuration and provides excellent type safety.

## File Structure

```
src/routes/
├── __root.tsx       # Root layout (required)
├── index.tsx        # Home page (/)
├── settings.tsx     # Settings page (/settings)
└── items.$id.tsx    # Dynamic route (/items/:id)
```

## Route File Naming Conventions

### Basic Routes

| File Name | Route Path | Description |
|-----------|------------|-------------|
| `index.tsx` | `/` | Index/home route |
| `about.tsx` | `/about` | Static route |
| `settings.tsx` | `/settings` | Static route |

### Dynamic Routes

Use `$` prefix for dynamic segments:

| File Name | Route Path | Description |
|-----------|------------|-------------|
| `items.$id.tsx` | `/items/:id` | Single dynamic parameter |
| `users.$userId.posts.$postId.tsx` | `/users/:userId/posts/:postId` | Multiple parameters |

### Nested Routes

Create folders for nested routes:

```
src/routes/
├── posts/
│   ├── index.tsx          # /posts
│   ├── $postId.tsx        # /posts/:postId
│   └── $postId.edit.tsx   # /posts/:postId/edit
```

### Layout Routes (Pathless)

Use `_` prefix for layout routes that don't add to the URL:

```
src/routes/
├── _layout/
│   ├── route-a.tsx        # /route-a
│   └── route-b.tsx        # /route-b
```

Both routes share the same layout from `_layout.tsx` without a URL prefix.

### Ignored Files

Files prefixed with `-` are ignored:

```
src/routes/
├── -utils.tsx             # Ignored by router
├── -components/
│   └── Header.tsx         # Ignored by router
```

## Route File Structure

### Basic Route File

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <h1>Home Page</h1>;
}
```

### Route with Loader

Load data before rendering:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    const response = await fetch(`/api/users/${params.userId}`);
    return response.json();
  },
  component: UserComponent,
});

function UserComponent() {
  const user = Route.useLoaderData();
  return <h1>{user.name}</h1>;
}
```

### Route with Error Handling

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    const response = await fetch(`/api/users/${params.userId}`);
    if (!response.ok) {
      throw new Error("User not found");
    }
    return response.json();
  },
  errorComponent: ({ error }) => (
    <div className="text-red-500">{error.message}</div>
  ),
  component: UserComponent,
});
```

### Route with Pending State

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ params }) => {
    const response = await fetch(`/api/users/${params.userId}`);
    return response.json();
  },
  pendingComponent: () => <div>Loading...</div>,
  component: UserComponent,
});
```

## Root Layout (`__root.tsx`)

The root layout wraps all routes:

```tsx
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  );
}
```

## Navigation

### Using `<Link>`

```tsx
import { Link } from "@tanstack/react-router";

// Static route
<Link to="/settings">Settings</Link>

// Dynamic route with params
<Link to="/items/$id" params={{ id: "123" }}>
  Item 123
</Link>

// With search params
<Link to="/search" search={{ q: "hello" }}>
  Search for "hello"
</Link>
```

### Active Link Styling

TanStack Router adds an `active` class to active links:

```tsx
<Link
  to="/settings"
  className="[&.active]:font-bold [&.active]:text-blue-600"
>
  Settings
</Link>
```

### Programmatic Navigation

```tsx
import { useNavigate } from "@tanstack/react-router";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/settings" });
  };

  return <button onClick={handleClick}>Go to Settings</button>;
}
```

## Accessing Route Data

### URL Parameters

```tsx
function ItemComponent() {
  const { id } = Route.useParams();
  return <h1>Item ID: {id}</h1>;
}
```

### Search Parameters

```tsx
function SearchComponent() {
  const search = Route.useSearch<{ q: string }>();
  return <h1>Searching for: {search.q}</h1>;
}
```

### Loader Data

```tsx
function UserComponent() {
  const user = Route.useLoaderData();
  return <h1>{user.name}</h1>;
}
```

## Adding a New Route

### Step 1: Create the Route File

Create a new file in `src/routes/`:

```tsx
// src/routes/dashboard.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
```

### Step 2: Add Navigation Link

Add a link in your root layout or navigation component:

```tsx
<Link to="/dashboard" className="[&.active]:text-blue-600">
  Dashboard
</Link>
```

### Step 3: Verify

1. The dev server automatically regenerates `routeTree.gen.ts`
2. Navigate to the new route in your browser
3. TypeScript will provide autocomplete for the new route

## Route Options Reference

| Option | Description |
|--------|-------------|
| `component` | React component to render |
| `loader` | Function to load data before render |
| `pendingComponent` | Component shown while loading |
| `errorComponent` | Component shown on error |
| `validateSearch` | Validate/search params schema |
| `beforeLoad` | Run code before loader |
| `meta` | Metadata for the route |

## Best Practices

1. **Keep route files focused**: Each route file should handle one route
2. **Use loaders for data fetching**: Don't fetch in components when possible
3. **Handle loading and error states**: Provide feedback to users
4. **Use TypeScript**: Get full type safety for params and data
5. **Organize with folders**: Group related routes in folders

## Troubleshooting

### Route not found
- Check file name matches the expected pattern
- Ensure the file is in `src/routes/`
- Restart the dev server to regenerate route tree

### TypeScript errors
- Run `bun run dev` to regenerate types
- Check that `routeTree.gen.ts` exists
- Verify `declare module` in `router.ts`

### Navigation not working
- Verify `to` path matches a route
- Check `params` for dynamic routes
- Use TypeScript to catch typos
