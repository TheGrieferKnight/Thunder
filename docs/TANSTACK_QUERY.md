# TanStack Query Guide

This document explains TanStack Query setup, patterns, and best practices.

## Overview

TanStack Query (formerly React Query) is a powerful data synchronization library for React. It handles fetching, caching, synchronizing, and updating server state.

## Setup

### Query Client

The query client is configured in `src/lib/query-client.ts`:

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      gcTime: 1000 * 60 * 30,     // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Provider

Wrap your app with `QueryClientProvider`:

```tsx
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `staleTime` | Time until data is considered stale | `0` |
| `gcTime` | Time before inactive data is garbage collected | `300000` (5min) |
| `retry` | Number of retry attempts | `3` |
| `refetchOnWindowFocus` | Refetch when window regains focus | `true` |
| `refetchOnMount` | Refetch when component mounts | `true` |
| `refetchOnReconnect` | Refetch on network reconnect | `true` |

## Core Concepts

### Queries

Use `useQuery` for fetching data:

```tsx
import { useQuery } from "@tanstack/react-query";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Query Keys

Query keys uniquely identify queries:

```tsx
// Simple key
["users"]

// Key with parameters
["users", userId]

// Complex key
["users", { status: "active", page: 1 }]

// Hierarchical key
["users", userId, "posts", postId]
```

### Mutations

Use `useMutation` for modifying data:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function CreateUserForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name: "New User" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
```

### Query Options Pattern

Extract query options for reuse:

```tsx
// lib/queries/users.ts
import { queryOptions } from "@tanstack/react-query";

export const userQueries = {
  list: () => queryOptions({
    queryKey: ["users"],
    queryFn: fetchUsers,
  }),
  detail: (id: string) => queryOptions({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  }),
};

// Usage in component
const { data } = useQuery(userQueries.list());
const { data: user } = useQuery(userQueries.detail(userId));
```

## Common Patterns

### Dependent Queries

Queries that depend on other data:

```tsx
const { data: user } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
  queryKey: ["posts", user?.id],
  queryFn: () => fetchPosts(user.id),
  enabled: !!user, // Only run when user exists
});
```

### Parallel Queries

Fetch multiple resources in parallel:

```tsx
const userQuery = useQuery({ queryKey: ["user", userId], queryFn: fetchUser });
const postsQuery = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
```

### Infinite Queries

For pagination/infinite scroll:

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

function PostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  return (
    <>
      {data?.pages.map(page => (
        page.posts.map(post => <Post key={post.id} post={post} />)
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? "Loading..." : "Load More"}
      </button>
    </>
  );
}
```

### Optimistic Updates

Update UI before server response:

```tsx
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["user", userId] });
    
    // Snapshot previous value
    const previousUser = queryClient.getQueryData(["user", userId]);
    
    // Optimistically update
    queryClient.setQueryData(["user", userId], newUser);
    
    return { previousUser };
  },
  onError: (err, newUser, context) => {
    // Rollback on error
    queryClient.setQueryData(["user", userId], context.previousUser);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
  },
});
```

## Integration with Tauri

### Using Tauri Commands

```tsx
import { commands } from "../bindings";

function useGreet(name: string) {
  return useQuery({
    queryKey: ["greet", name],
    queryFn: () => commands.greet(name),
  });
}
```

### Tauri Mutation

```tsx
function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Settings) => commands.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
```

## Devtools

### Setup

The devtools component shows query state:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Features

- View all queries and their status
- Inspect query data and metadata
- Manually refetch/invalidate queries
- Time travel through query history

## Error Handling

### Error Boundaries

Use error boundaries with suspense:

```tsx
import { ErrorBoundary } from "react-error-boundary";

function UserList() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <UserListContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function UserListContent() {
  const { data } = useSuspenseQuery({ queryKey: ["users"], queryFn: fetchUsers });
  return <ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

### Global Error Handling

```tsx
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Query error:", error);
      // Show toast notification
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  }),
});
```

## Caching Strategies

### Aggressive Caching

For data that rarely changes:

```tsx
useQuery({
  queryKey: ["config"],
  queryFn: fetchConfig,
  staleTime: Infinity,      // Never refetch automatically
  gcTime: Infinity,         // Keep forever
});
```

### No Caching

For always-fresh data:

```tsx
useQuery({
  queryKey: ["live-data"],
  queryFn: fetchLiveData,
  staleTime: 0,            // Always stale
  gcTime: 0,               // No caching
  refetchInterval: 5000,   // Poll every 5s
});
```

### Background Refetching

Keep data fresh in background:

```tsx
useQuery({
  queryKey: ["notifications"],
  queryFn: fetchNotifications,
  refetchInterval: 30000,        // Refetch every 30s
  refetchIntervalInBackground: true,
});
```

## Best Practices

1. **Use query options pattern**: Extract and reuse query definitions
2. **Invalidate strategically**: Only invalidate what needs updating
3. **Handle loading states**: Show loading indicators for better UX
4. **Use TypeScript**: Get full type safety for query data
5. **Preload data**: Use route loaders with router integration
6. **Avoid over-fetching**: Use select to transform/limit data

```tsx
const { data: userName } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
  select: (user) => user.name, // Only subscribe to name changes
});
```

## Troubleshooting

### Data not updating
- Check if query is invalidated
- Verify query key matches exactly
- Ensure mutation refetches on success

### Too many requests
- Increase `staleTime` to prevent refetching
- Use `enabled` to conditionally fetch
- Batch mutations when possible

### Memory issues
- Lower `gcTime` for unused data
- Use `keepPreviousData` for pagination
- Clear cache on logout: `queryClient.clear()`
