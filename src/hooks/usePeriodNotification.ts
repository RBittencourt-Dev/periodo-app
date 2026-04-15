"use client";

import { useEffect, useRef, useState } from "react";
import { Period, PeriodConfig } from "@/types/period";
import {
  didPeriodChange,
  getCurrentTimeString,
  isCurrentTimeBetween,
  playSound,
} from "@/lib/audioUtils";

const STORAGE_KEY = "periodConfig";
const CONFIG_VERSION = 5;
const FRIDAY_DEFAULTS_VERSION = 1;
const DEFAULT_SOUND = "/notification.mp3";

export type ScheduleType = "regular" | "friday";

const clonePeriods = (periods: Period[]): Period[] => periods.map((period) => ({ ...period }));

const defaultPeriods: Period[] = [
  { id: "1", name: "Manha Periodo 1 EFII/EM", startTime: "07:15", endTime: "07:16", soundUrl: DEFAULT_SOUND },
  { id: "2", name: "Manha Periodo 1 EFI", startTime: "07:25", endTime: "07:26", soundUrl: DEFAULT_SOUND },
  { id: "3", name: "Manha Periodo 2 EFII/EM", startTime: "08:05", endTime: "08:06", soundUrl: DEFAULT_SOUND },
  { id: "4", name: "Manha Periodo 2 EFI / Recreio 1o e 2o EFI", startTime: "08:15", endTime: "08:16", soundUrl: DEFAULT_SOUND },
  { id: "5", name: "Manha Periodo 3 EFII/EM", startTime: "08:55", endTime: "08:56", soundUrl: DEFAULT_SOUND },
  { id: "6", name: "Manha Recreio EFI 3o ao 5o", startTime: "09:05", endTime: "09:06", soundUrl: DEFAULT_SOUND },
  { id: "7", name: "Manha Periodo 3 EFI 3o ao 5o", startTime: "09:20", endTime: "09:21", soundUrl: DEFAULT_SOUND },
  { id: "8", name: "Manha Recreio EFII", startTime: "09:45", endTime: "09:46", soundUrl: DEFAULT_SOUND },
  { id: "9", name: "Manha Periodo 4 EFII", startTime: "10:00", endTime: "10:01", soundUrl: DEFAULT_SOUND },
  { id: "10", name: "Manha Periodo 4 EFI", startTime: "10:10", endTime: "10:11", soundUrl: DEFAULT_SOUND },
  { id: "11", name: "Manha Recreio EM", startTime: "10:35", endTime: "10:36", soundUrl: DEFAULT_SOUND },
  { id: "12", name: "Manha Periodo 5 EFII/EM", startTime: "10:50", endTime: "10:51", soundUrl: DEFAULT_SOUND },
  { id: "13", name: "Manha Periodo 5 EFI", startTime: "11:00", endTime: "11:01", soundUrl: DEFAULT_SOUND },
  { id: "14", name: "Manha Periodo 6 EM", startTime: "11:40", endTime: "11:41", soundUrl: DEFAULT_SOUND },
  { id: "15", name: "Manha Ultimo Periodo EFI", startTime: "11:50", endTime: "11:51", soundUrl: DEFAULT_SOUND },
  { id: "16", name: "Manha Ultimo Periodo EM", startTime: "12:30", endTime: "12:31", soundUrl: DEFAULT_SOUND },
  { id: "17", name: "Tarde Periodo 1 EFI/EFII", startTime: "13:10", endTime: "13:11", soundUrl: DEFAULT_SOUND },
  { id: "18", name: "Tarde Periodo 2 EFI/EFII", startTime: "14:00", endTime: "14:01", soundUrl: DEFAULT_SOUND },
  { id: "19", name: "Tarde Periodo 3 EFII / Recreio EFI", startTime: "14:50", endTime: "14:51", soundUrl: DEFAULT_SOUND },
  { id: "20", name: "Tarde Periodo 3 EFI", startTime: "15:05", endTime: "15:06", soundUrl: DEFAULT_SOUND },
  { id: "21", name: "Tarde Recreio EFII", startTime: "15:40", endTime: "15:41", soundUrl: DEFAULT_SOUND },
  { id: "22", name: "Tarde Periodo 4 EFI/EFII", startTime: "15:55", endTime: "15:56", soundUrl: DEFAULT_SOUND },
  { id: "23", name: "Tarde Periodo 5 EFI/EFII", startTime: "16:45", endTime: "16:46", soundUrl: DEFAULT_SOUND },
  { id: "24", name: "Tarde Ultimo Periodo", startTime: "17:35", endTime: "17:36", soundUrl: DEFAULT_SOUND },
];

const fridayDefaultPeriods: Period[] = [
  { id: "1", name: "Manha Periodo 1 EFII/EM", startTime: "07:15", endTime: "07:16", soundUrl: DEFAULT_SOUND },
  { id: "2", name: "Manha Periodo 1 EFI", startTime: "07:25", endTime: "07:26", soundUrl: DEFAULT_SOUND },
  { id: "3", name: "Manha Periodo 2 EFII/EM", startTime: "08:05", endTime: "08:06", soundUrl: DEFAULT_SOUND },
  { id: "4", name: "Manha Periodo 2 EFI / Recreio 1o e 2o EFI", startTime: "08:15", endTime: "08:16", soundUrl: DEFAULT_SOUND },
  { id: "5", name: "Manha Periodo 3 EFII/EM", startTime: "08:55", endTime: "08:56", soundUrl: DEFAULT_SOUND },
  { id: "6", name: "Manha Recreio EFI 3o ao 5o", startTime: "09:05", endTime: "09:06", soundUrl: DEFAULT_SOUND },
  { id: "7", name: "Manha Periodo 3 EFI 3o ao 5o", startTime: "09:20", endTime: "09:21", soundUrl: DEFAULT_SOUND },
  { id: "8", name: "Manha Recreio EFII", startTime: "09:45", endTime: "09:46", soundUrl: DEFAULT_SOUND },
  { id: "9", name: "Manha Periodo 4 EFII", startTime: "10:00", endTime: "10:01", soundUrl: DEFAULT_SOUND },
  { id: "10", name: "Manha Periodo 4 EFI", startTime: "10:10", endTime: "10:11", soundUrl: DEFAULT_SOUND },
  { id: "11", name: "Manha Recreio EM", startTime: "10:35", endTime: "10:36", soundUrl: DEFAULT_SOUND },
  { id: "12", name: "Manha Periodo 5 EFII/EM", startTime: "10:50", endTime: "10:51", soundUrl: DEFAULT_SOUND },
  { id: "13", name: "Manha Periodo 5 EFI", startTime: "11:00", endTime: "11:01", soundUrl: DEFAULT_SOUND },
  { id: "14", name: "Manha Periodo 6 EM", startTime: "11:40", endTime: "11:41", soundUrl: DEFAULT_SOUND },
  { id: "15", name: "Manha Ultimo Periodo EFI", startTime: "11:50", endTime: "11:51", soundUrl: DEFAULT_SOUND },
  { id: "16", name: "Manha Ultimo Periodo EM", startTime: "12:30", endTime: "12:31", soundUrl: DEFAULT_SOUND },
  { id: "17", name: "Tarde Periodo 1 EFI/EFII", startTime: "13:10", endTime: "13:11", soundUrl: DEFAULT_SOUND },
  { id: "18", name: "Tarde Periodo 2 EFI/EFII", startTime: "13:50", endTime: "13:51", soundUrl: DEFAULT_SOUND },
  { id: "19", name: "Tarde Periodo 3 EFII / Recreio EFI", startTime: "14:30", endTime: "14:31", soundUrl: DEFAULT_SOUND },
  { id: "20", name: "Tarde Periodo 3 EFI", startTime: "14:45", endTime: "14:46", soundUrl: DEFAULT_SOUND },
  { id: "21", name: "Tarde Recreio EFII", startTime: "15:10", endTime: "15:11", soundUrl: DEFAULT_SOUND },
  { id: "22", name: "Tarde Periodo 4 EFI/EFII", startTime: "15:25", endTime: "15:26", soundUrl: DEFAULT_SOUND },
  { id: "23", name: "Tarde Periodo 5 EFI/EFII", startTime: "16:05", endTime: "16:06", soundUrl: DEFAULT_SOUND },
  { id: "24", name: "Tarde Ultimo Periodo", startTime: "16:45", endTime: "16:46", soundUrl: DEFAULT_SOUND },
];

const createDefaultConfig = (): PeriodConfig => ({
  version: CONFIG_VERSION,
  fridayDefaultsVersion: FRIDAY_DEFAULTS_VERSION,
  periods: clonePeriods(defaultPeriods),
  fridayPeriods: clonePeriods(fridayDefaultPeriods),
  isEnabled: true,
  volume: 100,
});

const getScheduleTypeForToday = (): ScheduleType => {
  const dayOfWeek = new Date().getDay();
  return dayOfWeek === 5 ? "friday" : "regular";
};

const getPeriodsForSchedule = (config: PeriodConfig, schedule: ScheduleType): Period[] =>
  schedule === "friday" ? config.fridayPeriods : config.periods;

export function usePeriodNotification() {
  const [config, setConfig] = useState<PeriodConfig>(createDefaultConfig);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const previousTimeRef = useRef<string | null>(null);
  const notificationPlayedRef = useRef<Set<string>>(new Set());

  const initializeDefaultConfig = () => {
    const defaultConfig = createDefaultConfig();
    setConfig(defaultConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
  };

  const getActivePeriods = (schedule: ScheduleType = getScheduleTypeForToday()) => {
    return getPeriodsForSchedule(config, schedule);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (!config.isEnabled) return;

    const intervalId = setInterval(async () => {
      const time = getCurrentTimeString();
      const activePeriods = getPeriodsForSchedule(config, getScheduleTypeForToday());
      setCurrentTime(time);

      if (didPeriodChange(previousTimeRef.current, time)) {
        let newPeriod: Period | null = null;
        for (const period of activePeriods) {
          if (isCurrentTimeBetween(period.startTime, period.endTime)) {
            newPeriod = period;
            break;
          }
        }

        if (newPeriod && newPeriod.id !== currentPeriod?.id) {
          setCurrentPeriod(newPeriod);

          if (newPeriod.soundUrl && !notificationPlayedRef.current.has(`${time}-${newPeriod.id}`)) {
            try {
              await playSound(newPeriod.soundUrl, config.volume);
              notificationPlayedRef.current.add(`${time}-${newPeriod.id}`);

              if (notificationPlayedRef.current.size > 100) {
                notificationPlayedRef.current.clear();
              }
            } catch (error) {
              console.error("Error playing sound:", error);
            }
          }
        } else if (!newPeriod) {
          setCurrentPeriod(null);
        }
      } else if (!currentPeriod && activePeriods.length > 0) {
        for (const period of activePeriods) {
          if (isCurrentTimeBetween(period.startTime, period.endTime)) {
            setCurrentPeriod(period);
            break;
          }
        }
      }

      previousTimeRef.current = time;
    }, 1000);

    return () => clearInterval(intervalId);
  }, [config, currentPeriod]);

  const saveConfig = (newConfig: PeriodConfig) => {
    const versionedConfig = {
      ...newConfig,
      version: CONFIG_VERSION,
      fridayDefaultsVersion: FRIDAY_DEFAULTS_VERSION,
    };

    setConfig(versionedConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versionedConfig));
  };

  const addPeriod = (period: Period, schedule: ScheduleType = "regular") => {
    const key = schedule === "friday" ? "fridayPeriods" : "periods";
    saveConfig({
      ...config,
      [key]: [...getPeriodsForSchedule(config, schedule), period],
    });
  };

  const updatePeriod = (
    id: string,
    updates: Partial<Period>,
    schedule: ScheduleType = "regular"
  ) => {
    const key = schedule === "friday" ? "fridayPeriods" : "periods";
    saveConfig({
      ...config,
      [key]: getPeriodsForSchedule(config, schedule).map((period) =>
        period.id === id ? { ...period, ...updates } : period
      ),
    });
  };

  const deletePeriod = (id: string, schedule: ScheduleType = "regular") => {
    const key = schedule === "friday" ? "fridayPeriods" : "periods";
    saveConfig({
      ...config,
      [key]: getPeriodsForSchedule(config, schedule).filter((period) => period.id !== id),
    });
  };

  const toggleEnabled = () => {
    saveConfig({
      ...config,
      isEnabled: !config.isEnabled,
    });
  };

  const updateVolume = (volume: number) => {
    saveConfig({
      ...config,
      volume: Math.min(Math.max(volume, 0), 100),
    });
  };

  return {
    config,
    currentPeriod,
    currentTime,
    getActivePeriods,
    getScheduleTypeForToday,
    saveConfig,
    addPeriod,
    updatePeriod,
    deletePeriod,
    toggleEnabled,
    updateVolume,
    resetToDefaults: initializeDefaultConfig,
  };
}
