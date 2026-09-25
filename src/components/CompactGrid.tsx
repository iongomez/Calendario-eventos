import type { CalendarEvent, DailyCatering, Room } from "../types";
import { STATUS_STYLES } from "../utils/statusStyles";
import { dayName, formatDayNumber, isToday, toISODate } from "../utils/dateUtils";
import { Star } from "lucide-react";

interface CompactGridProps {
  weekDays: Date[];
  rooms: Room[];
  eventsByRoom: Map<string, CalendarEvent[]>;
  onOpenEvent: (event: CalendarEvent) => void;
  onOpenRoom: (room: Room) => void;
  onCreateEvent: (roomId: string, date: string) => void;
}

function findDayEntry(
  events: CalendarEvent[],
  iso: string,
): { event: CalendarEvent; day: DailyCatering } | null {
  for (const event of events) {
    if (iso < event.startDate || iso > event.endDate) continue;
    const day = event.days.find((d) => d.date === iso);
    if (day) return { event, day };
  }
  return null;
}

/**
 * Compact "at a glance" grid: every room as a thin row so many rooms fit on
 * screen at once, with a small coloured square per day instead of a full
 * event card — for scanning which room is free on a given date, not for
 * reading event detail (that's what the regular calendar view is for).
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
          return (
            <div key={room.id} className={`flex border-b border-slate-100 ${!room.reservable ? "opacity-50" : ""}`}>
              <button
                type="button"
                onClick={() => onOpenRoom(room)}
                className="flex w-48 shrink-0 items-center gap-1 border-r border-slate-200 px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="truncate">
                  {room.code} · {room.name}
                </span>
                {room.singular && <Star size={11} className="shrink-0 fill-amber-400 text-amber-400" />}
              </button>
              <div className="grid flex-1" style={{ gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
                {weekISOs.map((iso, i) => {
                  const found = findDayEntry(events, iso);
                  const today = isToday(weekDays[i]);
                  const canCreate = !found && room.reservable;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        if (found) onOpenEvent(found.event);
                        else if (canCreate) onCreateEvent(room.id, iso);
                      }}
                      disabled={!found && !canCreate}
                      title={found ? `${found.event.name} — ${found.event.promoter}` : "Sala libre"}
                      className={`flex h-8 items-center justify-center border-r border-slate-100 last:border-r-0 ${
                        today ? "bg-emerald-50/60" : ""
                      } ${canCreate ? "hover:bg-slate-100" : ""}`}
                    >
                      {found && (
                        <span
                          className={`h-3 w-3 rounded-[3px] ${STATUS_STYLES[found.event.status].dot} ${
                            found.day.isSetup ? "opacity-45" : ""
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
