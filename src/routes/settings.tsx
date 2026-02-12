import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
      <p className="text-gray-600">
        This is the settings page. Configure your application preferences here.
      </p>
      <div className="mt-6 space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">General</h2>
          <p className="text-gray-500 text-sm mt-1">
            General application settings
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Appearance</h2>
          <p className="text-gray-500 text-sm mt-1">
            Theme and display settings
          </p>
        </div>
      </div>
    </div>
  );
}
