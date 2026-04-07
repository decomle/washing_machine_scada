export interface MachineData {
  id: string;
  status: 'active' | 'intake' | 'warning' | 'draining' | 'idle';
  doors: 'open' | 'closed';
  motors: {
    speed: number;
    run_time: number;
    wait_time: number;
    work_time: number;
    remain_time: number;
  };
  heats: {
    configured_heat: number;
    current_heat: number;
    heat_type: string;
    heat_speed: number;
    status: 'heating' | 'idle';
  };
  waters: {
    configured_volume: number;
    actual_volume: number;
    status: string;
  };
}