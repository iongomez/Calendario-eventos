import type { CalendarEvent, Room } from "../types";
import { layoutRoomRow } from "../utils/eventLayout";
import { EventPill } from "./EventPill";
import { EmptyCellButton } from "./EmptyCellButton";
import { Building2, Star } from "lucide-react";

interface RoomRowProps {
  room: Room;
  events: CalendarEvent[];
  weekDays: Date[];
  onOpenEvent: (event: CalendarEvent) => void;
  onOpenRoom: (room: Room) => void;
  onCreateEvent: (roomId: string, date: string) => void;
}

export function RoomRow({ room, events, weekDays, onOpenEvent, onOpenRoom, onCreateEvent }: RoomRowProps) {
  const cells = layoutRoomRow(events, weekDays);

  return (
    <div className={`flex border-b border-slate-200 ${!room.reservable ? "opacity-50" : ""}`}>
      <div className="flex w-64 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center gap-1.5">
          <Building2 size={15} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-800">
            {room.code} · {room.name}
          </span>
          {room.singular && <Star size={13} className="fill-amber-400 text-amber-400" aria-label="Sala singular" />}
        </div>
        <p className="text-xs text-slate-500">Aforo: {room.capacity}</p>
        <p className="text-xs text-slate-500">Tipo: {room.type}</p>
        {!room.reservable && <p className="text-xs font-medium text-red-500">No reservable</p>}
        <button
          type="button"
          onClick={() => onOpenRoom(room)}
          className="mt-1 self-start text-xs font-medium text-blue-600 hover:underline"
        >
          Ver sala
        </button>
      </div>
      <div className="relative grid flex-1" style={{ gridTemplateColumns: "repeat(7, minmax(140px, 1fr))" }}>
        {cells.map((cell) =>
          cell.type === "event" ? (
            <EventPill key={cell.key} cell={cell} onOpen={onOpenEvent} />
          ) : room.reservable ? (
            <EmptyCellButton
              key={cell.key}
              cell={cell}
              onCreate={(date) => onCreateEvent(room.id, date)}
            />
          ) : (
            <div
              key={cell.key}
              style={{ gridColumn: `${cell.colStart + 1} / span 1` }}
              className="min-h-[92px] border-r border-slate-100 last:border-r-0"
            />
          ),
        )}
      </div>
    </div>
  );
}
