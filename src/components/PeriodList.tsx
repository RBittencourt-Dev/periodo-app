"use client";

import { Period } from "@/types/period";
import { useRef, useState } from "react";
import { PencilLine, Plus, Save, Trash2, Volume2, X } from "lucide-react";
import { playSound } from "@/lib/audioUtils";

interface PeriodItemProps {
  period: Period;
  onUpdate: (updates: Partial<Period>) => void;
  onDelete: () => void;
}

function PeriodItem({ period, onUpdate, onDelete }: PeriodItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPeriod, setEditedPeriod] = useState(period);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleSave = () => {
    onUpdate(editedPeriod);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEditedPeriod({ ...editedPeriod, soundUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaySound = async () => {
    if (!editedPeriod.soundUrl) return;
    setIsPlayingSound(true);
    try {
      await playSound(editedPeriod.soundUrl, 70);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
    setIsPlayingSound(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-[26px] border border-blue-100 bg-blue-50/80 p-5 shadow-sm">
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome</label>
            <input
              type="text"
              value={editedPeriod.name}
              onChange={(e) => setEditedPeriod({ ...editedPeriod, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Inicio</label>
              <input
                type="time"
                value={editedPeriod.startTime}
                onChange={(e) => setEditedPeriod({ ...editedPeriod, startTime: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Fim</label>
              <input
                type="time"
                value={editedPeriod.endTime}
                onChange={(e) => setEditedPeriod({ ...editedPeriod, endTime: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Som de notificacao</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Escolher arquivo de audio
              </button>
              {editedPeriod.soundUrl && (
                <button
                  onClick={handlePlaySound}
                  disabled={isPlayingSound}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:bg-slate-300"
                >
                  <Volume2 size={16} />
                  Testar
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {editedPeriod.soundUrl && (
              <p className="mt-2 text-xs font-medium text-emerald-700">Audio configurado</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleSave}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Salvar
            </button>
            <button
              onClick={() => {
                setEditedPeriod(period);
                setIsEditing(false);
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{period.name}</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Periodo
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {period.startTime} {"->"} {period.endTime}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <PencilLine size={16} />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-2xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface PeriodListProps {
  periods: Period[];
  onAddPeriod: (period: Period) => void;
  onUpdatePeriod: (id: string, updates: Partial<Period>) => void;
  onDeletePeriod: (id: string) => void;
}

export function PeriodList({
  periods,
  onAddPeriod,
  onUpdatePeriod,
  onDeletePeriod,
}: PeriodListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    name: "",
    startTime: "08:00",
    endTime: "09:00",
    soundUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==",
  });
  const newPeriodFileInputRef = useRef<HTMLInputElement>(null);
  const [isPlayingNewSound, setIsPlayingNewSound] = useState(false);

  const handleAddPeriodFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setNewPeriod({ ...newPeriod, soundUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayNewSound = async () => {
    if (!newPeriod.soundUrl) return;
    setIsPlayingNewSound(true);
    try {
      await playSound(newPeriod.soundUrl, 70);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
    setIsPlayingNewSound(false);
  };

  const handleAddPeriod = () => {
    if (newPeriod.name && newPeriod.startTime && newPeriod.endTime) {
      onAddPeriod({
        id: Date.now().toString(),
        ...newPeriod,
      });

      setNewPeriod({
        name: "",
        startTime: "08:00",
        endTime: "09:00",
        soundUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==",
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-5">
      {periods.length > 0 ? (
        <div className="space-y-3">
          {periods.map((period) => (
            <PeriodItem
              key={period.id}
              period={period}
              onUpdate={(updates) => onUpdatePeriod(period.id, updates)}
              onDelete={() => onDeletePeriod(period.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
          Nenhum periodo cadastrado nesta grade.
        </div>
      )}

      {showAddForm ? (
        <div className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Nome do periodo</label>
              <input
                type="text"
                placeholder="Ex: Aula, intervalo, recreio"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Horario de inicio</label>
                <input
                  type="time"
                  value={newPeriod.startTime}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Horario de fim</label>
                <input
                  type="time"
                  value={newPeriod.endTime}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Som de notificacao</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => newPeriodFileInputRef.current?.click()}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Escolher arquivo de audio
                </button>
                {newPeriod.soundUrl && (
                  <button
                    onClick={handlePlayNewSound}
                    disabled={isPlayingNewSound}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:bg-slate-300"
                  >
                    <Volume2 size={16} />
                    Testar
                  </button>
                )}
              </div>

              <input
                ref={newPeriodFileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAddPeriodFileUpload}
                className="hidden"
              />

              {newPeriod.soundUrl && (
                <p className="mt-2 text-xs font-medium text-emerald-700">Audio configurado</p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleAddPeriod}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={16} />
                Adicionar periodo
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[22px] border border-dashed border-blue-300 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-900 transition hover:border-blue-400 hover:bg-blue-100"
        >
          <Plus size={18} />
          Novo periodo
        </button>
      )}
    </div>
  );
}
