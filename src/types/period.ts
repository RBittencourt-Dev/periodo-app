export interface Period {
  id: string;
  name: string;
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
  soundUrl?: string; // URL or base64 encoded sound
}

export interface PeriodConfig {
  version?: number;
  fridayDefaultsVersion?: number;
  periods: Period[];
  fridayPeriods: Period[];
  isEnabled: boolean;
  volume: number; // 0-100
}
