import { useState } from 'react';
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
  const [machines, setMachines] = useState<WashingMachine[]>(washingMachinesData);
  const [newMachineIp, setNewMachineIp] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const totalMachines = machines.length;
  const activeCount = machines.filter((machine) => machine.status === 'active').length;
  const warningCount = machines.filter((machine) => machine.status === 'warning').length;

  const addMachine = () => {
    if (!newMachineIp.trim()) return;

    // Generate new machine ID
    const nextId = `WM-${String(Math.max(...machines.map(m => parseInt(m.id.split('-')[1])), 0) + 1).padStart(3, '0')}`;

    // Create new machine with default values
    const newMachine: WashingMachine = {
      id: nextId,
      status: 'idle',
      doors: 'closed',
      motors: {
        speed: 0,
        run_time: 0,
        wait_time: 0,
        work_time: 0,
        remain_time: 0
      },
      heats: {
        configured_heat: 0,
        current_heat: 24,
        heat_type: 'None',
        heat_speed: 0,
        status: 'idle'
      },
      waters: {
        configured_volume: 0,
        actual_volume: 0,
        status: 'stable'
      }
    };

    setMachines([...machines, newMachine]);
    setNewMachineIp('');
    setShowAddForm(false);
  };

  const removeMachine = (machineId: string) => {
    setMachines(machines.filter(machine => machine.id !== machineId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Machines</h1>
          <p className="mt-2 text-gray-600">Overview of all industrial washing machines in the system.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Add Machine'}
          </button>
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
      </div>

      {showAddForm && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Machine</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="machine-ip" className="block text-sm font-medium text-gray-700 mb-2">
                Machine IP Address
              </label>
              <input
                type="text"
                id="machine-ip"
                value={newMachineIp}
                onChange={(e) => setNewMachineIp(e.target.value)}
                placeholder="192.168.1.100"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addMachine}
                disabled={!newMachineIp.trim()}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Machine
              </button>
            </div>
          </div>
        </div>
      )}

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
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {machines.map((machine: WashingMachine) => (
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
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => removeMachine(machine.id)}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
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
