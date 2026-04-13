"use client";

import { Period } from "@/types/period";
import { useState, useRef } from "react";
import { Trash2, Plus, Save, Volume2 } from "lucide-react";
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
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={editedPeriod.name}
            onChange={(e) => setEditedPeriod({ ...editedPeriod, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Início</label>
            <input
              type="time"
              value={editedPeriod.startTime}
              onChange={(e) => setEditedPeriod({ ...editedPeriod, startTime: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fim</label>
            <input
              type="time"
              value={editedPeriod.endTime}
              onChange={(e) => setEditedPeriod({ ...editedPeriod, endTime: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Som de Notificação</label>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium"
            >
              Escolher Arquivo MP3
            </button>
            {editedPeriod.soundUrl && (
              <button
                onClick={handlePlaySound}
                disabled={isPlayingSound}
                className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md font-medium flex items-center gap-1"
              >
                <Volume2 size={16} /> Testar
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
            <p className="text-xs text-green-600">✓ Som configurado</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <Save size={18} /> Salvar
          </button>
          <button
            onClick={() => {
              setEditedPeriod(period);
              setIsEditing(false);
            }}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{period.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {period.startTime} → {period.endTime}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 size={20} />
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
    <div className="space-y-4">
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

      {showAddForm ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Período</label>
            <input
              type="text"
              placeholder="Ex: Aula, Intervalo, Recreio"
              value={newPeriod.name}
              onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário de Início</label>
              <input
                type="time"
                value={newPeriod.startTime}
                onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário de Fim</label>
              <input
                type="time"
                value={newPeriod.endTime}
                onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Som de Notificação</label>
            <div className="flex gap-2">
              <button
                onClick={() => newPeriodFileInputRef.current?.click()}
                className="flex-1 px-3 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium"
              >
                Escolher Arquivo MP3
              </button>
              {newPeriod.soundUrl && (
                <button
                  onClick={handlePlayNewSound}
                  disabled={isPlayingNewSound}
                  className="px-3 py-2 text-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-md font-medium flex items-center gap-1"
                >
                  <Volume2 size={16} /> Testar
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
              <p className="text-xs text-green-600">✓ Som configurado</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddPeriod}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Adicionar Período
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Novo Período
        </button>
      )}
    </div>
  );
}
