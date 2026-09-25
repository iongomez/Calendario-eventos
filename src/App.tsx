import { useMemo, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { FiltersBar, type SortBy } from "./components/FiltersBar";
import { WeekGrid } from "./components/WeekGrid";
import { CompactGrid } from "./components/CompactGrid";
import { Legend } from "./components/Legend";
import { EventDetailStub } from "./components/EventDetailStub";
import { RoomDetailStub } from "./components/RoomDetailStub";
import { CreateEventModal } from "./components/CreateEventModal";
import { CURRENT_USER_EMAIL, EVENTS, ROOMS, SITES } from "./data/mockData";
import type { CalendarEvent, EventStatus, Room } from "./types";
import { computeDayAggregates } from "./utils/aggregates";
import { getWeekDays, startOfWeek } from "./utils/dateUtils";

interface CreateTarget {
  roomId: string;
  date: string;
}

export default function App() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [siteId, setSiteId] = useState(SITES[0].id);
  const [myEventsOnly, setMyEventsOnly] = useState(false);
  const [singularOnly, setSingularOnly] = useState(false);
  const [status, setStatus] = useState<EventStatus | "todos">("todos");
  const [roomSearch, setRoomSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [createTarget, setCreateTarget] = useState<CreateTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const roomsById = useMemo(() => new Map(ROOMS.map((r) => [r.id, r])), []);

  const siteEvents = useMemo(
    () => EVENTS.filter((e) => roomsById.get(e.roomId)?.siteId === siteId),
    [siteId, roomsById],
  );

  const filteredRooms = useMemo(() => {
    const rooms = ROOMS.filter(
      (r) =>
        r.siteId === siteId &&
        (!singularOnly || r.singular) &&
        r.name.toLowerCase().includes(roomSearch.toLowerCase().trim()),
    );
    const sorted = [...rooms].sort((a, b) => {
      if (sortBy === "capacity") return b.capacity - a.capacity;
      if (sortBy === "type") return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [siteId, singularOnly, roomSearch, sortBy]);

  const filteredEvents = useMemo(
    () =>
      siteEvents.filter(
        (e) => (!myEventsOnly || e.managerEmail === CURRENT_USER_EMAIL) && (status === "todos" || e.status === status),
      ),
    [siteEvents, myEventsOnly, status],
  );

  const eventsByRoom = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of filteredEvents) {
      const list = map.get(event.roomId) ?? [];
      list.push(event);
      map.set(event.roomId, list);
    }
    return map;
  }, [filteredEvents]);

  // Aggregates reflect the whole site's real occupancy for the week, independent
  // of "Mis eventos" / estado filters — restaurant & hotel still need real totals.
  // Cancelled events never count: they won't actually happen.
  const dayAggregates = useMemo(
    () => computeDayAggregates(siteEvents.filter((e) => e.status !== "anulado"), weekDays),
    [siteEvents, weekDays],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar weekStart={weekStart} onWeekStartChange={setWeekStart} viewMode={viewMode} onViewModeChange={setViewMode} />
        <FiltersBar
          sites={SITES}
          siteId={siteId}
          onSiteChange={setSiteId}
          myEventsOnly={myEventsOnly}
          onMyEventsToggle={() => setMyEventsOnly((v) => !v)}
          singularOnly={singularOnly}
          onSingularToggle={() => setSingularOnly((v) => !v)}
          status={status}
          onStatusChange={setStatus}
          roomSearch={roomSearch}
          onRoomSearchChange={setRoomSearch}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onExport={() => showToast("Exportar: función pendiente de definir (PDF o Excel).")}
        />

        <div className="flex-1 overflow-auto">
          {viewMode === "grid" ? (
            <WeekGrid
              weekDays={weekDays}
              rooms={filteredRooms}
              eventsByRoom={eventsByRoom}
              dayAggregates={dayAggregates}
              onOpenEvent={setSelectedEvent}
              onOpenRoom={setSelectedRoom}
              onCreateEvent={(roomId, date) => setCreateTarget({ roomId, date })}
            />
          ) : (
            <CompactGrid
              weekDays={weekDays}
              rooms={filteredRooms}
              eventsByRoom={eventsByRoom}
              onOpenEvent={setSelectedEvent}
              onOpenRoom={setSelectedRoom}
              onCreateEvent={(roomId, date) => setCreateTarget({ roomId, date })}
            />
          )}
        </div>

        <Legend />
      </div>

      {selectedEvent && (
        <EventDetailStub event={selectedEvent} room={roomsById.get(selectedEvent.roomId)} onClose={() => setSelectedEvent(null)} />
      )}
      {selectedRoom && <RoomDetailStub room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
      {createTarget && (
        <CreateEventModal
          room={roomsById.get(createTarget.roomId)!}
          date={createTarget.date}
          onClose={() => setCreateTarget(null)}
          onCreated={(name) => {
            setCreateTarget(null);
            showToast(`"${name}" — continuarías en la ficha del evento (fuera de alcance del prototipo).`);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
