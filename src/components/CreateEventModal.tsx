import { useState } from "react";
import type { Room } from "../types";
import { Modal } from "./Modal";
import { fromISODate } from "../utils/dateUtils";

interface CreateEventModalProps {
  room: Room;
  date: string;
  onClose: () => void;
  onCreated: (name: string) => void;
}

export function CreateEventModal({ room, date, onClose, onCreated }: CreateEventModalProps) {
  const [name, setName] = useState("");

  return (
    <Modal
      title="Nuevo evento"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!name.trim()}
            onClick={() => onCreated(name.trim())}
            className="rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar a la ficha
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium text-slate-500">Nombre del evento</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Jornada de Innovación"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Sala</span>
            <span className="rounded-md bg-slate-50 px-3 py-2 text-slate-700">
              {room.code} · {room.name}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Fecha</span>
            <span className="rounded-md bg-slate-50 px-3 py-2 text-slate-700">
              {fromISODate(date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Prototipo: este paso solo prerellena sala y fecha. El resto de la creación (horario, manutención,
          pernocta) se completa en la ficha del evento, fuera de alcance aquí.
        </p>
      </div>
    </Modal>
  );
}
