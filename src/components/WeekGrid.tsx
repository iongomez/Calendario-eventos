import type { CalendarEvent, DayAggregate, Room } from "../types";
import { DayHeaderCell } from "./DayHeaderCell";
import { RoomRow } from "./RoomRow";

interface WeekGridProps {
  weekDays: Date[];
  rooms: Room[];
  eventsByRoom: Map<string, CalendarEvent[]>;
  dayAggregates: DayAggregate[];
  onOpenEvent: (event: CalendarEvent) => void;
  onOpenRoom: (room: Room) => void;
  onCreateEvent: (roomId: string, date: string) => void;
}

export function WeekGrid({
  weekDays,
  rooms,
  eventsByRoom,
  dayAggregates,
  onOpenEvent,
  onOpenRoom,
  onCreateEvent,
}: WeekGridProps) {
  return (
    <div>
      <div className="flex border-b border-slate-200 bg-slate-50">
        <div className="w-64 shrink-0 border-r border-slate-200" />
        <div className="grid flex-1" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
          {dayAggregates.map((aggregate) => (
            <DayHeaderCell key={aggregate.date} aggregate={aggregate} />
          ))}
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="px-4 py-16 text-center text-sm text-slate-400">
          No hay salas que coincidan con los filtros seleccionados.
        </div>
      ) : (
        rooms.map((room) => (
          <RoomRow
            key={room.id}
            room={room}
            events={eventsByRoom.get(room.id) ?? []}
            weekDays={weekDays}
            onOpenEvent={onOpenEvent}
            onOpenRoom={onOpenRoom}
            onCreateEvent={onCreateEvent}
          />
        ))
      )}
    </div>
  );
}
