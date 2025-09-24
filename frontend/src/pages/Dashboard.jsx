import { useAppContext } from "../context/ContextAPI";

const Dashboard = () => {
  const { logout, token } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Welcome to InsightForm!</h2>
            <p className="text-green-700">
              You have successfully logged in. This is your protected dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Forms</h3>
              <p className="text-blue-700">Create and manage your forms</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Analytics</h3>
              <p className="text-purple-700">View form analytics and insights</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Settings</h3>
              <p className="text-orange-700">Manage your account settings</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Authentication Status</h3>
            <p className="text-xs text-gray-500 break-all">
              Token: {token ? `${token.substring(0, 20)}...` : 'No token'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
