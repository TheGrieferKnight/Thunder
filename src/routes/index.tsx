import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Home</h1>
      <p className="text-gray-600">
        Welcome to the Thunder app! This is the home page using TanStack Router
        with file-based routing.
      </p>
    </div>
  );
}
