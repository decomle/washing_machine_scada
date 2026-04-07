import { washingMachinesData } from '../../data/washingMachines';
import type { WashingMachine } from '../../data/washingMachines';

const getStatusBadge = (status: string) => {
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

const getDoorBadge = (doors: string) =>
  doors === 'closed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

const MachinesPage = () => {
  const totalMachines = washingMachinesData.length;
  const activeCount = washingMachinesData.filter((machine) => machine.status === 'active').length;
  const warningCount = washingMachinesData.filter((machine) => machine.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
          <p className="mt-2 text-gray-600">Overview of all industrial washing machines in the system.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total machines</p>
            <p className="mt-3 text-3xl font-semibold text-gray-900">{totalMachines}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active machines</p>
            <p className="mt-3 text-3xl font-semibold text-green-700">{activeCount}</p>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Warning machines</p>
            <p className="mt-3 text-3xl font-semibold text-yellow-700">{warningCount}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Machine ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Door</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Motor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Heat</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Water</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {washingMachinesData.map((machine: WashingMachine) => (
              <tr key={machine.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{machine.id}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(machine.status)}`}>
                    {machine.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDoorBadge(machine.doors)}`}>
                    {machine.doors}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {machine.motors.speed} RPM • {machine.motors.work_time}m work
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {machine.heats.current_heat}°C / {machine.heats.configured_heat}°C
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {machine.waters.actual_volume}L / {machine.waters.configured_volume}L
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachinesPage;
