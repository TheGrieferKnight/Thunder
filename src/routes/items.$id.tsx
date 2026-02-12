import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/$id")({
  component: ItemComponent,
});

function ItemComponent() {
  const { id } = Route.useParams();

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Item Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">
          Viewing item with ID: <span className="font-mono font-bold">{id}</span>
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This demonstrates dynamic routing with route parameters.
        </p>
      </div>
    </div>
  );
}
