"use client";

import { usePeriodNotification } from "@/hooks/usePeriodNotification";
import { PeriodDisplay } from "./PeriodDisplay";
import { PeriodList } from "./PeriodList";
import { Clock } from "lucide-react";
import { useState } from "react";

export function PeriodManager() {
  const {
    config,
    currentPeriod,
    currentTime,
    addPeriod,
    updatePeriod,
    deletePeriod,
    toggleEnabled,
    updateVolume,
  } = usePeriodNotification();

  const [activeTab, setActiveTab] = useState<"overview" | "periods">("overview");

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Clock className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Notificador de Períodos</h1>
          </div>
          <p className="text-gray-600">Receba notificações de áudio em mudanças de período</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab("periods")}
            className={`flex-1 py-3 px-4 font-medium rounded-lg transition-colors ${
              activeTab === "periods"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Períodos
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <PeriodDisplay
            currentPeriod={currentPeriod}
            currentTime={currentTime}
            config={config}
            onToggleEnabled={toggleEnabled}
            onVolumeChange={updateVolume}
          />
        )}

        {activeTab === "periods" && (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Períodos</h2>
            <PeriodList
              periods={config?.periods || []}
              onAddPeriod={addPeriod}
              onUpdatePeriod={updatePeriod}
              onDeletePeriod={deletePeriod}
            />
          </div>
        )}
      </div>
    </div>
  );
}
