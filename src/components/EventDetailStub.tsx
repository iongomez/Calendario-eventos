import type { CalendarEvent, Room } from "../types";
import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { CateringMetric } from "./CateringIcons";
import { fromISODate } from "../utils/dateUtils";
import { BedDouble, UtensilsCrossed } from "lucide-react";

interface EventDetailStubProps {
  event: CalendarEvent;
  room: Room | undefined;
  onClose: () => void;
}

export function EventDetailStub({ event, room, onClose }: EventDetailStubProps) {
  return (
    <Modal title="Detalle del evento" onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-base font-semibold text-slate-900 ${event.status === "anulado" ? "line-through" : ""}`}>
            {event.name}
          </h3>
          <StatusBadge status={event.status} />
        </div>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <dt className="text-slate-400">Promotor</dt>
          <dd className="text-slate-700">{event.promoter}</dd>
          <dt className="text-slate-400">Sala</dt>
          <dd className="text-slate-700">{room ? `${room.code} · ${room.name}` : "—"}</dd>
          <dt className="text-slate-400">Fechas</dt>
          <dd className="text-slate-700">
            {fromISODate(event.startDate).toLocaleDateString("es-ES")} – {fromISODate(event.endDate).toLocaleDateString("es-ES")}
          </dd>
          <dt className="text-slate-400">Horario</dt>
          <dd className="text-slate-700">
            {event.startTime} – {event.endTime}
          </dd>
        </dl>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Manutención por día</p>
          <div className="flex flex-col gap-1.5">
            {event.days.map((day) => (
              <div key={day.date} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-xs">
                <span className="font-medium text-slate-600">
                  {fromISODate(day.date).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short" })}
                  {day.isSetup && <span className="ml-1.5 text-slate-400">(montaje/desmontaje)</span>}
                </span>
                <span className="flex items-center gap-3">
                  <CateringMetric icon={UtensilsCrossed} label="Comidas" value={day.catering} size="xs" />
                  <CateringMetric icon={BedDouble} label="Pernoctas" value={day.overnight} size="xs" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          La edición completa de este evento se realiza en su ficha, fuera del alcance de este prototipo de
          calendario.
        </p>
      </div>
    </Modal>
  );
}
