"use client";

import { PeriodConfig, Period } from "@/types/period";
import { Bell, Clock3, SlidersHorizontal, ToggleLeft, ToggleRight, Volume2 } from "lucide-react";

interface PeriodDisplayProps {
  currentPeriod: Period | null;
  currentTime: string;
  config: PeriodConfig | null;
  audioReady: boolean;
  onEnableAudio: () => Promise<void>;
  onToggleEnabled: () => void;
  onVolumeChange: (volume: number) => void;
}

export function PeriodDisplay({
  currentPeriod,
  currentTime,
  config,
  audioReady,
  onEnableAudio,
  onToggleEnabled,
  onVolumeChange,
}: PeriodDisplayProps) {
  if (!config) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white/80 p-10 text-center text-slate-500 shadow-[0_14px_34px_rgba(20,32,51,0.08)]">
        Carregando...
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#133b8f_0%,#1c63ff_55%,#53b9ff_100%)] p-6 text-white shadow-[0_24px_70px_rgba(20,32,51,0.18)] md:p-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-blue-50">
            <Bell size={15} />
            Visao geral
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-100/80">
              Horario atual
            </p>
            <p className="text-5xl font-semibold tracking-tight md:text-6xl">
              {currentTime || "--:--"}
            </p>
          </div>

          <div className="rounded-[26px] border border-white/18 bg-white/12 p-5 backdrop-blur-sm md:p-6">
            {currentPeriod ? (
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-100/80">
                  Periodo atual
                </p>
                <h2 className="text-2xl font-semibold md:text-3xl">{currentPeriod.name}</h2>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-sm text-blue-50">
                  <Clock3 size={15} />
                  {currentPeriod.startTime} {"->"} {currentPeriod.endTime}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-100/80">
                  Periodo atual
                </p>
                <h2 className="text-2xl font-semibold md:text-3xl">Nenhum periodo ativo</h2>
                <p className="text-sm text-blue-50/80">
                  O horario atual esta fora da faixa configurada para notificacao.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white/88 p-5 shadow-[0_14px_34px_rgba(20,32,51,0.08)] backdrop-blur-xl md:p-6">
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                {config.isEnabled ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Notificacoes</p>
                <p className="text-sm text-slate-500">
                  {config.isEnabled ? "Ativas e prontas para tocar" : "Pausadas temporariamente"}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleEnabled}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                config.isEnabled
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {config.isEnabled ? "Desativar" : "Ativar"}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                <Bell size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Audio do navegador</p>
                <p className="text-sm text-slate-500">
                  {audioReady ? "Pronto para tocar notificacoes" : "Clique para liberar o audio"}
                </p>
              </div>
            </div>

            <button
              onClick={() => void onEnableAudio()}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                audioReady
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {audioReady ? "Audio ativo" : "Ativar audio"}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                <Volume2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Volume</p>
                <p className="text-sm text-slate-500">Ajuste a intensidade do audio.</p>
              </div>
              <span className="ml-auto rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm">
                {config.volume}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={config.volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2 text-blue-700">
                <SlidersHorizontal size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900">Resumo rapido</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {config.isEnabled ? "Sistema ativo" : "Sistema inativo"}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Periodos
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {config.periods.length + config.fridayPeriods.length} configurados
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
