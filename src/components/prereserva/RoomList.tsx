import { Check, LayoutGrid, MapPin, Search, Star, Users } from "lucide-react";
import { EVENTS, ROOMS, SITES } from "../../data/mockData";
import type { Room } from "../../types";
import { fromISODate } from "../../utils/dateUtils";
import { computeRoomAvailability, roomConflicts } from "./flowState";
import { useFlow } from "./FlowContext";
import { ConflictWarning, DarkGreenButton, FooterBar, RulerIcon, SecondaryButton, StepHeader } from "./ui";

function statusLabel(status: ReturnType<typeof computeRoomAvailability>): string {
  if (status === "disponible") return "Disponible";
  if (status === "reservado") return "Reservado";
  return "No reservable";
}

export function RoomList() {
  const { state, update, back, nav, close } = useFlow();
  const site = SITES.find((s) => s.id === state.siteId);
  const asistentes = parseInt(state.asistentes || "0", 10);
  const q = state.roomListSearch.trim().toLowerCase();
  const filtered = ROOMS.filter((r) => r.siteId === state.siteId && r.name.toLowerCase().includes(q));

  function toggleSala(room: Room) {
    update((s) => {
      if (s.salasSeleccionadas.includes(room.id)) {
        const next = s.salasSeleccionadas.filter((x) => x !== room.id);
        return { ...s, salasSeleccionadas: next, salaPrincipalId: s.salaPrincipalId === room.id ? next[0] || null : s.salaPrincipalId };
      }
      return {
        ...s,
        salasSeleccionadas: [...s.salasSeleccionadas, room.id],
        salaPrincipalId: s.salaPrincipalId ?? room.id,
      };
    });
  }

  function openFicha(room: Room) {
    update((s) => ({ ...s, fichaRoomId: room.id, fichaDispExpanded: false, fichaAccesoriosExpanded: false, fichaTab: "detalle", fichaConfigDirty: false }));
    nav("ficha");
  }

  const fmt = (iso: string) => fromISODate(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const dateLabel = state.fechaInicio
    ? state.fechaFin && state.fechaFin !== state.fechaInicio
      ? `${fmt(state.fechaInicio)} – ${fmt(state.fechaFin)}`
      : fmt(state.fechaInicio)
    : "Sin fechas";

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} title="Seleccionar espacios y salas" />

        <div className="relative mt-4">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={state.roomListSearch}
            onChange={(e) => {
              const value = e.target.value;
              update((s) => ({ ...s, roomListSearch: value }));
            }}
            placeholder="Buscar sala"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600">
            <MapPin size={13} /> {site?.name}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600">
            <Users size={13} /> {asistentes || "—"}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-600">
            <LayoutGrid size={13} /> {dateLabel}
          </span>
        </div>

        <div className="mb-3 mt-3 border-b border-slate-100 pb-2.5 text-xs text-slate-400">
          {filtered.length} sala{filtered.length === 1 ? "" : "s"} encontrada{filtered.length === 1 ? "" : "s"}
        </div>

        {filtered.map((room) => {
          const status = computeRoomAvailability(room, EVENTS, state);
          const disponible = status === "disponible";
          const selected = state.salasSeleccionadas.includes(room.id);
          const capWarn = asistentes > 0 && room.capacity < asistentes;
          return (
            <div
              key={room.id}
              className={`mb-3 rounded-xl border p-3.5 transition-colors ${
                selected ? "border-blue-400 bg-blue-50" : disponible ? "border-slate-200" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className={`text-base font-bold ${disponible ? "text-slate-900" : "text-slate-400"}`}>{room.name}</p>
                  <div className="mt-1 flex items-center gap-3.5 text-xs">
                    <span className={`flex items-center gap-1 ${capWarn ? "font-semibold text-amber-600" : disponible ? "text-slate-600" : "text-slate-400"}`}>
                      <Users size={13} />
                      {room.capacity}
                    </span>
                    <span className={`flex items-center gap-1 ${disponible ? "text-slate-600" : "text-slate-400"}`}>
                      <RulerIcon size={13} />
                      {room.size}m²
                    </span>
                  </div>
                </div>
                {room.singular && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <Star size={12} fill="currentColor" />
                  </span>
                )}
              </div>
              <span
                className={`mt-2.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                  disponible ? "border-emerald-600 text-emerald-700" : "border-slate-300 bg-slate-100 text-slate-500"
                }`}
              >
                {disponible && <Check size={12} />}
                {statusLabel(status)}
              </span>
              <div className="mt-2.5 flex items-center justify-between">
                <button type="button" onClick={() => openFicha(room)} className="text-xs font-medium text-blue-600 underline hover:no-underline">
                  Ver sala
                </button>
                {/* A room preselected from the calendar can end up reserved once dates change: it must stay removable. */}
                <button
                  type="button"
                  disabled={!disponible && !selected}
                  onClick={() => (disponible || selected) && toggleSala(room)}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-[5px] border-[1.5px] ${
                    selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
                  } ${!disponible && !selected ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {selected && <Check size={13} />}
                </button>
              </div>
              {selected && <ConflictWarning events={roomConflicts(room, EVENTS, state)} className="mt-3" />}
            </div>
          );
        })}
      </div>
      <FooterBar>
        <DarkGreenButton disabled={state.salasSeleccionadas.length === 0} onClick={() => nav("espacios")}>
          Confirmar salas{state.salasSeleccionadas.length > 0 ? ` (${state.salasSeleccionadas.length})` : ""}
        </DarkGreenButton>
        <SecondaryButton onClick={back}>Volver</SecondaryButton>
      </FooterBar>
    </>
  );
}
