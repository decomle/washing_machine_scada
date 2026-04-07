import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6 py-10 rounded-3xl shadow-xl bg-white border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Washing Machine SCADA</h2>
        <p className="text-gray-600 mb-6">Navigate to the dashboard to monitor your machines.</p>
        <Link
          to="/demo/dashboard"
          className="inline-flex items-center px-5 py-3 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
