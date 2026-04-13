"use client";

import { useEffect, useState, useRef } from "react";
import { Period, PeriodConfig } from "@/types/period";
import {
  getCurrentTimeString,
  isCurrentTimeBetween,
  didPeriodChange,
  playSound,
} from "@/lib/audioUtils";

const STORAGE_KEY = "periodConfig";
const DEFAULT_SOUND =
  "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";

export function usePeriodNotification() {
  const [config, setConfig] = useState<PeriodConfig | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const previousTimeRef = useRef<string | null>(null);
  const notificationPlayedRef = useRef<Set<string>>(new Set());

  // Load config from localStorage
  useEffect(() => {
    const loadConfig = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setConfig(JSON.parse(stored));
        } catch {
          initializeDefaultConfig();
        }
      } else {
        initializeDefaultConfig();
      }
    };

    loadConfig();
  }, []);

  const initializeDefaultConfig = () => {
    const defaultConfig: PeriodConfig = {
      periods: [
        { id: "1", name: "Período 1", startTime: "08:00", endTime: "09:30", soundUrl: DEFAULT_SOUND },
        { id: "2", name: "Período 2", startTime: "09:30", endTime: "11:00", soundUrl: DEFAULT_SOUND },
        { id: "3", name: "Intervalo", startTime: "11:00", endTime: "11:20", soundUrl: DEFAULT_SOUND },
        { id: "4", name: "Período 3", startTime: "11:20", endTime: "13:00", soundUrl: DEFAULT_SOUND },
      ],
      isEnabled: true,
      volume: 70,
    };
    setConfig(defaultConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
  };

  // Monitor time and check for period changes
  useEffect(() => {
    if (!config?.isEnabled) return;

    const intervalId = setInterval(async () => {
      const time = getCurrentTimeString();
      setCurrentTime(time);

      // Check if period changed
      if (didPeriodChange(previousTimeRef.current, time)) {
        // Find the period for the new time
        let newPeriod: Period | null = null;
        for (const period of config.periods) {
          if (isCurrentTimeBetween(period.startTime, period.endTime)) {
            newPeriod = period;
            break;
          }
        }

        // Only play sound if we actually entered a new period
        if (newPeriod && newPeriod.id !== currentPeriod?.id) {
          setCurrentPeriod(newPeriod);

          // Play notification sound
          if (newPeriod.soundUrl && !notificationPlayedRef.current.has(`${time}-${newPeriod.id}`)) {
            try {
              await playSound(newPeriod.soundUrl, config.volume);
              notificationPlayedRef.current.add(`${time}-${newPeriod.id}`);

              // Clear old entries to prevent memory leak
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
      } else if (!currentPeriod && config.periods.length > 0) {
        // Check current period on interval even if time didn't change
        for (const period of config.periods) {
          if (isCurrentTimeBetween(period.startTime, period.endTime)) {
            setCurrentPeriod(period);
            break;
          }
        }
      }

      previousTimeRef.current = time;
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [config, currentPeriod]);

  const saveConfig = (newConfig: PeriodConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  };

  const addPeriod = (period: Period) => {
    if (!config) return;
    const updated = {
      ...config,
      periods: [...config.periods, period],
    };
    saveConfig(updated);
  };

  const updatePeriod = (id: string, updates: Partial<Period>) => {
    if (!config) return;
    const updated = {
      ...config,
      periods: config.periods.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    saveConfig(updated);
  };

  const deletePeriod = (id: string) => {
    if (!config) return;
    const updated = {
      ...config,
      periods: config.periods.filter((p) => p.id !== id),
    };
    saveConfig(updated);
  };

  const toggleEnabled = () => {
    if (!config) return;
    const updated = {
      ...config,
      isEnabled: !config.isEnabled,
    };
    saveConfig(updated);
  };

  const updateVolume = (volume: number) => {
    if (!config) return;
    const updated = {
      ...config,
      volume: Math.min(Math.max(volume, 0), 100),
    };
    saveConfig(updated);
  };

  return {
    config,
    currentPeriod,
    currentTime,
    saveConfig,
    addPeriod,
    updatePeriod,
    deletePeriod,
    toggleEnabled,
    updateVolume,
  };
}
