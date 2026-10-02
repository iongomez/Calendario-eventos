import type { CalendarEvent, Room } from "../types";
import { layoutRoomRow } from "../utils/eventLayout";
import { CompactEventBar } from "./CompactEventBar";
import { dayName, formatDayNumber, fromISODate, isToday, toISODate } from "../utils/dateUtils";
import { Star } from "lucide-react";

interface CompactGridProps {
  weekDays: Date[];
  rooms: Room[];
  eventsByRoom: Map<string, CalendarEvent[]>;
  onOpenEvent: (event: CalendarEvent) => void;
  onOpenRoom: (room: Room) => void;
  onCreateEvent: (roomId: string, date: string) => void;
}

/**
 * Compact "at a glance" grid: every room as a thin row so many rooms fit on
 * screen at once, with a continuous bar per multi-day event (same layout as
 * the full calendar view) instead of one dot per day — for scanning which
 * room is free on a given date without losing the event's name at a glance.
 */
export function CompactGrid({ weekDays, rooms, eventsByRoom, onOpenEvent, onOpenRoom, onCreateEvent }: CompactGridProps) {
  const weekISOs = weekDays.map(toISODate);

  return (
    <div>
      <div className="flex border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
        <div className="flex w-48 shrink-0 items-end border-r border-slate-200 px-3 py-2">Sala</div>
        <div className="grid flex-1" style={{ gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
          {weekDays.map((date, i) => {
            const today = isToday(date);
            return (
              <div
                key={weekISOs[i]}
                className={`flex flex-col items-center gap-0.5 border-r border-slate-200 py-1.5 last:border-r-0 ${
                  today ? "bg-emerald-50" : ""
                }`}
              >
                <span className={today ? "text-emerald-700" : ""}>{dayName(date)}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    today ? "bg-emerald-600 text-white" : "text-slate-700"
                  }`}
                >
                  {formatDayNumber(date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="px-4 py-16 text-center text-sm text-slate-400">
          No hay salas que coincidan con los filtros seleccionados.
        </div>
      ) : (
        rooms.map((room) => {
          const events = eventsByRoom.get(room.id) ?? [];
          const cells = layoutRoomRow(events, weekDays);
          return (
            <div key={room.id} className={`flex border-b border-slate-100 ${!room.reservable ? "opacity-50" : ""}`}>
              <button
                type="button"
                onClick={() => onOpenRoom(room)}
                className="flex h-10 w-48 shrink-0 items-center gap-1 border-r border-slate-200 px-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="truncate">
                  {room.code} · {room.name}
                </span>
                {room.singular && <Star size={11} className="shrink-0 fill-amber-400 text-amber-400" />}
              </button>
              <div className="relative grid h-10 flex-1" style={{ gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
                {cells.map((cell) =>
                  cell.type === "event" ? (
                    <CompactEventBar key={cell.key} cell={cell} onOpen={onOpenEvent} />
                  ) : (
                    <button
                      key={cell.key}
                      type="button"
                      style={{ gridColumn: `${cell.colStart} / span 1`, gridRow: "1" }}
                      onClick={() => room.reservable && onCreateEvent(room.id, cell.date)}
                      disabled={!room.reservable}
                      title="Sala libre"
                      className={`flex h-full items-center justify-center border-r border-slate-100 last:border-r-0 ${
                        isToday(fromISODate(cell.date)) ? "bg-emerald-50/60" : ""
                      } ${room.reservable ? "hover:bg-slate-100" : ""}`}
                    />
                  ),
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
