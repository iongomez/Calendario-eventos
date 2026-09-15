import type { CalendarEvent, Room } from "../types";
import { StatusBadge } from "./StatusBadge";
import { fromISODate } from "../utils/dateUtils";

interface ListViewProps {
  events: CalendarEvent[];
  roomsById: Map<string, Room>;
  onOpenEvent: (event: CalendarEvent) => void;
}

export function ListView({ events, roomsById, onOpenEvent }: ListViewProps) {
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (sorted.length === 0) {
    return <div className="px-4 py-16 text-center text-sm text-slate-400">No hay eventos que coincidan con los filtros seleccionados.</div>;
  }

  return (
    <table className="w-full min-w-[900px] text-left text-sm">
      <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
        <tr>
          <th className="px-4 py-2.5 font-medium">Estado</th>
          <th className="px-4 py-2.5 font-medium">Evento</th>
          <th className="px-4 py-2.5 font-medium">Sala</th>
          <th className="px-4 py-2.5 font-medium">Promotor</th>
          <th className="px-4 py-2.5 font-medium">Fechas</th>
          <th className="px-4 py-2.5 font-medium">Horario</th>
          <th className="px-4 py-2.5 font-medium">Asistentes</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((event) => {
          const room = roomsById.get(event.roomId);
          const maxAttendees = Math.max(...event.days.map((d) => d.attendees));
          return (
            <tr
              key={event.id}
              onClick={() => onOpenEvent(event)}
              className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-2.5">
                <StatusBadge status={event.status} />
              </td>
              <td className={`px-4 py-2.5 font-medium text-slate-800 ${event.status === "anulado" ? "line-through" : ""}`}>
                {event.name}
              </td>
              <td className="px-4 py-2.5 text-slate-600">{room ? `${room.code} · ${room.name}` : "—"}</td>
              <td className="px-4 py-2.5 text-slate-600">{event.promoter}</td>
              <td className="px-4 py-2.5 text-slate-600">
                {fromISODate(event.startDate).toLocaleDateString("es-ES")} – {fromISODate(event.endDate).toLocaleDateString("es-ES")}
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {event.startTime} – {event.endTime}
              </td>
              <td className="px-4 py-2.5 text-slate-600">{maxAttendees}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
