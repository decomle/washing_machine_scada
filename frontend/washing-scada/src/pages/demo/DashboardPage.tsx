import { washingMachinesData, type WashingMachine } from '../../data/washingMachines';

const DashboardPage = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'idle':
        return 'bg-gray-100 text-gray-800';
      case 'intake':
        return 'bg-blue-100 text-blue-800';
      case 'draining':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDoorStatusColor = (doors: string) => {
    return doors === 'closed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Washing Machine Dashboard</h1>
          <p className="text-gray-600">Monitor and control industrial washing machines</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Machines</p>
            <p className="text-2xl font-bold text-gray-900">{washingMachinesData.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {washingMachinesData.filter(m => m.status === 'active').length}
            </p>
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {washingMachinesData.map((machine: WashingMachine) => (
          <div key={machine.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Machine Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">🏭</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{machine.id}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                      {machine.status.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDoorStatusColor(machine.doors)}`}>
                      {machine.doors.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Motor Status */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Motor Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Speed:</span>
                  <span className="ml-1 font-medium">{machine.motors.speed} RPM</span>
                </div>
                <div>
                  <span className="text-gray-500">Run Time:</span>
                  <span className="ml-1 font-medium">{formatTime(machine.motors.run_time)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Work Time:</span>
                  <span className="ml-1 font-medium">{formatTime(machine.motors.work_time)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Remain:</span>
                  <span className="ml-1 font-medium">{formatTime(machine.motors.remain_time)}</span>
                </div>
              </div>
            </div>

            {/* Heat Status */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Heat System</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-1 font-medium">{machine.heats.heat_type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Current:</span>
                  <span className="ml-1 font-medium">{machine.heats.current_heat}°C</span>
                </div>
                <div>
                  <span className="text-gray-500">Target:</span>
                  <span className="ml-1 font-medium">{machine.heats.configured_heat}°C</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                    machine.heats.status === 'heating' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {machine.heats.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Water Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Water System</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Current:</span>
                  <span className="ml-1 font-medium">{machine.waters.actual_volume}L</span>
                </div>
                <div>
                  <span className="text-gray-500">Target:</span>
                  <span className="ml-1 font-medium">{machine.waters.configured_volume}L</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                    machine.waters.status === 'stable' ? 'bg-green-100 text-green-800' :
                    machine.waters.status === 'water intake' ? 'bg-blue-100 text-blue-800' :
                    machine.waters.status === 'drain' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {machine.waters.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;