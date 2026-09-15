import type { Room } from "../types";
import { Modal } from "./Modal";

export function RoomDetailStub({ room, onClose }: { room: Room; onClose: () => void }) {
  return (
    <Modal title="Detalle de la sala" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          {room.code} · {room.name}
        </h3>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <dt className="text-slate-400">Aforo</dt>
          <dd className="text-slate-700">{room.capacity} personas</dd>
          <dt className="text-slate-400">Tipo</dt>
          <dd className="text-slate-700">{room.type}</dd>
          <dt className="text-slate-400">Espacio singular</dt>
          <dd className="text-slate-700">{room.singular ? "Sí" : "No"}</dd>
          <dt className="text-slate-400">Reservable</dt>
          <dd className="text-slate-700">{room.reservable ? "Sí" : "No (en mantenimiento)"}</dd>
        </dl>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          La ficha completa de sala (equipamiento, planos, disposición) está fuera del alcance de este prototipo.
        </p>
      </div>
    </Modal>
  );
}
