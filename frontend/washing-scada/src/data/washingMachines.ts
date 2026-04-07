export const washingMachinesData = [
  {
    "id": "WM-101",
    "status": "active",
    "doors": "closed",
    "motors": {
      "speed": 1200,
      "run_time": 60,
      "wait_time": 0,
      "work_time": 45,
      "remain_time": 15
    },
    "heats": {
      "configured_heat": 60,
      "current_heat": 58,
      "heat_type": "Steam",
      "heat_speed": 1.2,
      "status": "heating"
    },
    "waters": {
      "configured_volume": 80,
      "actual_volume": 80,
      "status": "stable"
    }
  },
  {
    "id": "WM-102",
    "status": "intake",
    "doors": "closed",
    "motors": {
      "speed": 400,
      "run_time": 45,
      "wait_time": 10,
      "work_time": 5,
      "remain_time": 40
    },
    "heats": {
      "configured_heat": 40,
      "current_heat": 28,
      "heat_type": "Electric",
      "heat_speed": 0.8,
      "status": "idle"
    },
    "waters": {
      "configured_volume": 120,
      "actual_volume": 45,
      "status": "water intake"
    }
  },
  {
    "id": "WM-103",
    "status": "warning",
    "doors": "open",
    "motors": {
      "speed": 0,
      "run_time": 90,
      "wait_time": 30,
      "work_time": 60,
      "remain_time": 30
    },
    "heats": {
      "configured_heat": 75,
      "current_heat": 72,
      "heat_type": "Steam",
      "heat_speed": 2.0,
      "status": "idle"
    },
    "waters": {
      "configured_volume": 100,
      "actual_volume": 100,
      "status": "stable"
    }
  },
  {
    "id": "WM-104",
    "status": "draining",
    "doors": "closed",
    "motors": {
      "speed": 800,
      "run_time": 30,
      "wait_time": 5,
      "work_time": 28,
      "remain_time": 2
    },
    "heats": {
      "configured_heat": 30,
      "current_heat": 32,
      "heat_type": "Electric",
      "heat_speed": 0.5,
      "status": "idle"
    },
    "waters": {
      "configured_volume": 60,
      "actual_volume": 12,
      "status": "drain"
    }
  },
  {
    "id": "WM-105",
    "status": "idle",
    "doors": "closed",
    "motors": {
      "speed": 0,
      "run_time": 0,
      "wait_time": 0,
      "work_time": 0,
      "remain_time": 0
    },
    "heats": {
      "configured_heat": 0,
      "current_heat": 24,
      "heat_type": "None",
      "heat_speed": 0,
      "status": "idle"
    },
    "waters": {
      "configured_volume": 0,
      "actual_volume": 0,
      "status": "stable"
    }
  }
];

export type WashingMachine = typeof washingMachinesData[0];