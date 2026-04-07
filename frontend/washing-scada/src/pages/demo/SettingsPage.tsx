const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Application-level settings and SCADA configuration will appear here.</p>
      </div>
      <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
        <p className="text-sm">For now, this page is a placeholder so every sidebar link has a valid route.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
