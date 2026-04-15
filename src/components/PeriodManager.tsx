"use client";

import { usePeriodNotification, type ScheduleType } from "@/hooks/usePeriodNotification";
import { PeriodDisplay } from "./PeriodDisplay";
import { PeriodList } from "./PeriodList";
import { BellRing, CalendarDays, Clock3 } from "lucide-react";
import { useState } from "react";

export function PeriodManager() {
  const {
    config,
    currentPeriod,
    currentTime,
    audioReady,
    getActivePeriods,
    addPeriod,
    updatePeriod,
    deletePeriod,
    enableAudio,
    toggleEnabled,
    updateVolume,
  } = usePeriodNotification();

  const [activeTab, setActiveTab] = useState<"overview" | "periods">("overview");
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType>("regular");

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[rgba(255,255,255,0.75)] p-6 shadow-[0_24px_70px_rgba(20,32,51,0.12)] backdrop-blur-xl md:p-8">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600/10 via-cyan-400/10 to-sky-500/5" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-900">
                  <BellRing size={16} />
                  Painel de notificacoes
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-500/25">
                      <Clock3 size={28} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                        Notificador de Periodos
                      </h1>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                        Acompanhe o horario atual, controle o volume e organize os periodos da semana
                        com uma interface mais clara para uso diario.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_14px_34px_rgba(20,32,51,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {config?.isEnabled ? "Sistema ativo" : "Sistema pausado"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-[0_14px_34px_rgba(20,32,51,0.08)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Grade visivel
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {selectedSchedule === "friday" ? "Sexta-feira" : "Segunda a quinta"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-inner shadow-slate-200/60">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    activeTab === "overview"
                      ? "bg-white text-slate-950 shadow-md"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setActiveTab("periods")}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    activeTab === "periods"
                      ? "bg-white text-slate-950 shadow-md"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Periodos
                </button>
              </div>

              {activeTab === "periods" && (
                <div className="inline-flex rounded-2xl border border-blue-100 bg-blue-50 p-1.5">
                  <button
                    onClick={() => setSelectedSchedule("regular")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      selectedSchedule === "regular"
                        ? "bg-white text-blue-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Segunda a quinta
                  </button>
                  <button
                    onClick={() => setSelectedSchedule("friday")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      selectedSchedule === "friday"
                        ? "bg-white text-blue-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sexta-feira
                  </button>
                </div>
              )}
            </div>

            {activeTab === "overview" && (
          <PeriodDisplay
            currentPeriod={currentPeriod}
            currentTime={currentTime}
            config={config}
            audioReady={audioReady}
            onEnableAudio={enableAudio}
            onToggleEnabled={toggleEnabled}
            onVolumeChange={updateVolume}
          />
            )}

            {activeTab === "periods" && (
              <section className="rounded-[28px] border border-slate-200 bg-[rgba(255,255,255,0.86)] p-5 shadow-[0_14px_34px_rgba(20,32,51,0.08)] md:p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Gerenciar periodos</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Organize a grade semanal e mantenha uma configuracao separada para a sexta-feira.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-950">
                    <CalendarDays size={16} />
                    {selectedSchedule === "friday"
                      ? "Editando horarios de sexta-feira"
                      : "Editando horarios de segunda a quinta"}
                  </div>
                </div>

                <PeriodList
                  periods={config ? getActivePeriods(selectedSchedule) : []}
                  onAddPeriod={(period) => addPeriod(period, selectedSchedule)}
                  onUpdatePeriod={(id, updates) => updatePeriod(id, updates, selectedSchedule)}
                  onDeletePeriod={(id) => deletePeriod(id, selectedSchedule)}
                />
              </section>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
