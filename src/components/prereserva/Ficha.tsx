import { useState } from "react";
import { Building, Check, ChevronLeft, ChevronRight, Info, LayoutGrid, MapPin, Star, Users } from "lucide-react";
import { EVENTS, ROOMS, SITES } from "../../data/mockData";
import { formatMonthYear, getMonthWeeks, isSameMonth, toISODate } from "../../utils/dateUtils";
import { activeDayCount, computeRoomAvailability, getRoomConfig, roomConflicts, roomDayKind, usageDayRange } from "./flowState";
import { useFlow } from "./FlowContext";
import { ConfigRow, ConflictWarning, FooterBar, PrimaryButton, RulerIcon, SecondaryButton, StepHeader, Switch, ToggleRow } from "./ui";

const HALF_DAY_STRIPES = "[background-image:repeating-linear-gradient(135deg,#e2e8f0,#e2e8f0_2px,#fff_2px,#fff_4px)]";

const DOW = ["L", "M", "X", "J", "V", "S", "D"];

const DAY_KIND_STYLE: Record<string, string> = {
  "in-range": "bg-slate-900 text-white font-bold",
  margin: "bg-blue-200 text-slate-800 font-semibold",
  "other-event": "bg-slate-200 text-slate-400",
  "half-day-event":
    "bg-slate-100 text-slate-400 [background-image:repeating-linear-gradient(135deg,#e2e8f0,#e2e8f0_3px,transparent_3px,transparent_6px)]",
  free: "text-slate-700",
};

export function Ficha() {
  const { state, update, back, close } = useFlow();
  const room = ROOMS.find((r) => r.id === state.fichaRoomId);
  const [calendarMonth, setCalendarMonth] = useState(state.fichaCalendarMonth);
  if (!room) return null;

  const status = computeRoomAvailability(room, EVENTS, state);
  const disponible = status === "disponible";
  const yaAnadida = state.salasSeleccionadas.includes(room.id);
  const totalDias = usageDayRange(state);
  const sinDiasAsignados = totalDias.length > 0 && activeDayCount(state, room) === 0;

  function selectFromFicha() {
    update((s) => ({
      ...s,
      salasSeleccionadas: s.salasSeleccionadas.includes(room!.id) ? s.salasSeleccionadas : [...s.salasSeleccionadas, room!.id],
      salaPrincipalId: s.salaPrincipalId ?? room!.id,
    }));
    back();
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} title={room.name} />

        <div className="mt-5 flex justify-between rounded-xl bg-slate-100 p-4">
          <div>
            <b className="block text-xl leading-none">{room.capacity}</b>
            <span className="text-[11px] text-slate-500">Aforo total</span>
          </div>
          <div>
            <b className="block text-xl leading-none">{room.size}m²</b>
            <span className="text-[11px] text-slate-500">Tamaño total</span>
          </div>
          <div>
            <b className={`block text-sm leading-none ${disponible ? "text-emerald-700" : "text-slate-500"}`}>
              {disponible ? "✓ Disponible" : statusLabel(status)}
            </b>
          </div>
        </div>

        <div className="mt-4 flex gap-5 border-b border-slate-100">
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, fichaTab: "detalle" }))}
            className={`-mb-px border-b-2 pb-2.5 text-sm ${
              state.fichaTab === "detalle" ? "border-slate-900 font-semibold text-slate-900" : "border-transparent text-slate-400"
            }`}
          >
            Detalle
          </button>
          <button
            type="button"
            onClick={() => update((s) => ({ ...s, fichaTab: "config" }))}
            className={`-mb-px border-b-2 pb-2.5 text-sm ${
              state.fichaTab === "config" ? "border-slate-900 font-semibold text-slate-900" : "border-transparent text-slate-400"
            }`}
          >
            Configura la sala
          </button>
        </div>

        {state.fichaTab === "detalle" ? (
          <FichaDetalle
            room={room}
            disponible={disponible}
            status={status}
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
          />
        ) : (
          <FichaConfig room={room} />
        )}
      </div>
      <FooterBar>
        {yaAnadida
          ? state.fichaTab === "config" && state.fichaConfigDirty && (
              <PrimaryButton
                disabled={sinDiasAsignados}
                onClick={() => {
                  update((s) => ({ ...s, fichaConfigDirty: false }));
                  back();
                }}
              >
                Guardar cambios
              </PrimaryButton>
            )
          : disponible && <PrimaryButton onClick={selectFromFicha}>Seleccionar sala</PrimaryButton>}
        <SecondaryButton onClick={back}>Volver</SecondaryButton>
      </FooterBar>
    </>
  );
}

function statusLabel(status: ReturnType<typeof computeRoomAvailability>): string {
  if (status === "reservado") return "Reservado";
  return "No reservable";
}

function FichaDetalle({
  room,
  disponible,
  status,
  calendarMonth,
  setCalendarMonth,
}: {
  room: NonNullable<ReturnType<typeof ROOMS.find>>;
  disponible: boolean;
  status: ReturnType<typeof computeRoomAvailability>;
  calendarMonth: Date;
  setCalendarMonth: (d: Date) => void;
}) {
  const { state } = useFlow();
  const [dispExpanded, setDispExpanded] = useState(false);
  const [accesoriosExpanded, setAccesoriosExpanded] = useState(false);
  const weeks = getMonthWeeks(calendarMonth);
  const site = SITES.find((s) => s.id === room.siteId);

  return (
    <div className="pt-4">
      <h2 className="mb-2.5 mt-1 text-base font-bold text-slate-900">Información de la sala</h2>
      {room.singular && (
        <span className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs text-white">
          <Star size={12} fill="currentColor" /> Sala singular
        </span>
      )}
      {site?.address && <InfoRow icon={<MapPin size={15} />}>{site.address}</InfoRow>}
      <InfoRow icon={<Building size={15} />}>{room.building}</InfoRow>
      <InfoRow icon={<LayoutGrid size={15} />}>Tipo: {room.type}</InfoRow>
      <InfoRow icon={<RulerIcon size={15} />}>Tamaño: {room.size}m²</InfoRow>
      <InfoRow icon={<Users size={15} />}>Aforo (pax.): {room.capacity}</InfoRow>

      <h2 className="mb-2.5 mt-6 text-base font-bold text-slate-900">Disponibilidad de la sala</h2>
      <div
        className={`mb-3.5 flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-semibold ${
          disponible ? "text-emerald-700" : "text-slate-500"
        }`}
      >
        {disponible && <Check size={15} />}
        {disponible ? "Disponible" : statusLabel(status)}
      </div>

      <ConflictWarning events={roomConflicts(room, EVENTS, state)} className="mb-3.5" />

      {room.alert && (
        <div className="mb-3.5 flex gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-900">
          <Info size={15} className="mt-0.5 shrink-0" />
          {room.alert}
        </div>
      )}

      {dispExpanded ? (
        <>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between font-semibold">
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                aria-label="Mes anterior"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm">{formatMonthYear(calendarMonth)}</span>
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                aria-label="Mes siguiente"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {DOW.map((d) => (
                <div key={d} className="pb-1 text-[11px] font-medium uppercase text-slate-400">
                  {d}
                </div>
              ))}
              {weeks.flat().map((date) => {
                const iso = toISODate(date);
                const kind = roomDayKind(room, iso, EVENTS, state);
                const inMonth = isSameMonth(date, calendarMonth);
                return (
                  <div
                    key={iso}
                    className={`flex aspect-square items-center justify-center rounded-full text-sm ${DAY_KIND_STYLE[kind]} ${
                      !inMonth && kind === "free" ? "text-slate-300" : ""
                    }`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="my-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-slate-600">
            <Legend color="bg-slate-900" label="Evento actual" />
            <Legend color="bg-blue-200" label="Montaje / desmontaje" />
            <Legend color="bg-slate-200" label="Otros eventos" />
            <Legend color={`bg-slate-200 ${HALF_DAY_STRIPES}`} label="Montaje/Desmontaje medio día" />
          </div>
          <button type="button" onClick={() => setDispExpanded(false)} className="mb-1 text-sm font-medium text-blue-600 hover:underline">
            Ocultar disponibilidad
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setDispExpanded(true)} className="mb-1 text-sm font-medium text-blue-600 hover:underline">
          Ver disponibilidad
        </button>
      )}

      <h2 className="mb-2.5 mt-6 text-base font-bold text-slate-900">Distribuciones soportadas</h2>
      <div className="mb-1 flex flex-wrap gap-2">
        {(room.layouts ?? []).map((d) => (
          <span key={d} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs">
            {d}
          </span>
        ))}
      </div>

      <h2 className="mb-2.5 mt-6 text-base font-bold text-slate-900">Accesorios de la sala</h2>
      <div className="mb-1.5 flex flex-wrap gap-2">
        {(room.amenities ?? []).map((a) => (
          <span key={a} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs">
            {a}
          </span>
        ))}
        {accesoriosExpanded &&
          (room.extraAmenities ?? []).map((a) => (
            <span key={a} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs">
              {a}
            </span>
          ))}
      </div>
      {!accesoriosExpanded && (room.extraAmenities?.length ?? 0) > 0 && (
        <button type="button" onClick={() => setAccesoriosExpanded(true)} className="text-xs font-medium text-blue-600 hover:underline">
          +{room.extraAmenities!.length} accesorios
        </button>
      )}
    </div>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 text-sm text-slate-700">
      <span className="text-slate-400">{icon}</span>
      {children}
    </div>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <i className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function FichaConfig({ room }: { room: NonNullable<ReturnType<typeof ROOMS.find>> }) {
  const { state, update, nav } = useFlow();
  const cfg = getRoomConfig(state, room);
  const esPrincipal = state.salaPrincipalId === room.id;
  const totalDias = usageDayRange(state);
  const diasActivos = activeDayCount(state, room);
  const fechasSubtitle =
    totalDias.length === 0 ? "Define antes las fechas del evento" : diasActivos === 0 ? "No tienes días asignados" : `${diasActivos} día${diasActivos === 1 ? "" : "s"}`;

  return (
    <div className="pt-2">
      <ConfigRow label="Fechas de uso de la sala" hint={fechasSubtitle} onClick={() => nav("ficha-config-fechas")} />
      <ConfigRow label="Distribución de la sala" hint={cfg.distribucion || "Sin definir"} onClick={() => nav("ficha-config-distribucion")} />
      <ConfigRow label="Accesorios de la sala" hint={`${cfg.accesorios.length} accesorios`} onClick={() => nav("ficha-config-accesorios")} />
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-3.5">
        <p className="text-sm font-semibold text-slate-800">Es la sala principal</p>
        <Switch
          on={esPrincipal}
          onToggle={() => update((s) => ({ ...s, salaPrincipalId: s.salaPrincipalId === room.id ? null : room.id, fichaConfigDirty: true }))}
        />
      </div>
      <ToggleRow
        label="Observaciones"
        on={cfg.observacionesOn}
        onToggle={() =>
          update((s) => ({
            ...s,
            roomConfig: { ...s.roomConfig, [room.id]: { ...cfg, observacionesOn: !cfg.observacionesOn } },
            fichaConfigDirty: true,
          }))
        }
        noBorder={cfg.observacionesOn}
      />
      {cfg.observacionesOn && (
        <div className="mt-2">
          <textarea
            placeholder="Observaciones sobre esta sala..."
            value={cfg.observaciones}
            onChange={(e) => {
              const value = e.target.value;
              update((s) => ({
                ...s,
                roomConfig: { ...s.roomConfig, [room.id]: { ...getRoomConfig(s, room), observaciones: value } },
                fichaConfigDirty: true,
              }));
            }}
            className="min-h-[90px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
          />
        </div>
      )}
    </div>
  );
}
