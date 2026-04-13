"use client";

import { PeriodConfig, Period } from "@/types/period";
import { Volume2, ToggleLeft, ToggleRight } from "lucide-react";

interface PeriodDisplayProps {
  currentPeriod: Period | null;
  currentTime: string;
  config: PeriodConfig | null;
  onToggleEnabled: () => void;
  onVolumeChange: (volume: number) => void;
}

export function PeriodDisplay({
  currentPeriod,
  currentTime,
  config,
  onToggleEnabled,
  onVolumeChange,
}: PeriodDisplayProps) {
  if (!config) {
    return <div className="text-center py-8 text-gray-500">Carregando...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg p-8 space-y-6">
      {/* Current Time */}
      <div className="text-center">
        <p className="text-sm font-medium opacity-90">Horário Atual</p>
        <p className="text-5xl font-bold">{currentTime || "--:--"}</p>
      </div>

      {/* Current Period */}
      <div className="bg-blue-500 bg-opacity-50 rounded-lg p-6 text-center">
        {currentPeriod ? (
          <>
            <p className="text-sm font-medium opacity-90">Período Atual</p>
            <p className="text-3xl font-bold">{currentPeriod.name}</p>
            <p className="text-sm opacity-75 mt-2">
              {currentPeriod.startTime} → {currentPeriod.endTime}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium opacity-90">Nenhum período ativo</p>
            <p className="text-lg opacity-75">Fora do horário de funcionamento</p>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between bg-blue-500 bg-opacity-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {config.isEnabled ? (
              <ToggleRight size={24} />
            ) : (
              <ToggleLeft size={24} />
            )}
            <span className="font-medium">
              {config.isEnabled ? "Notificações Ativas" : "Notificações Inativas"}
            </span>
          </div>
          <button
            onClick={onToggleEnabled}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              config.isEnabled
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {config.isEnabled ? "Desativar" : "Ativar"}
          </button>
        </div>

        {/* Volume Control */}
        <div className="bg-blue-500 bg-opacity-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Volume2 size={20} />
            <span className="font-medium">Volume</span>
            <span className="ml-auto text-sm">{config.volume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={config.volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer accent-blue-200"
          />
        </div>
      </div>

      {/* Status Badge */}
      <div className="text-center">
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          config.isEnabled
            ? "bg-green-500 bg-opacity-20 text-green-100"
            : "bg-red-500 bg-opacity-20 text-red-100"
        }`}>
          {config.isEnabled ? "✓ Sistema Ativo" : "✗ Sistema Inativo"}
        </div>
      </div>
    </div>
  );
}
