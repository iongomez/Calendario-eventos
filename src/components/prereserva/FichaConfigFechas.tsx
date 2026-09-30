import { AlertTriangle, X } from "lucide-react";
import { ROOMS } from "../../data/mockData";
import { dayName, fromISODate } from "../../utils/dateUtils";
import { ensureHorario, usageDayRange } from "./flowState";
import { useFlow } from "./FlowContext";
import type { DiaHorario } from "./flowTypes";
import { FooterBar, SecondaryButton, StepHeader, Switch } from "./ui";
import { useEffect } from "react";

export function FichaConfigFechas() {
  const { state, update, back, close } = useFlow();
  const room = ROOMS.find((r) => r.id === state.fichaRoomId);

  useEffect(() => {
    if (room) update((s) => ensureHorario(s, room));
    // Only needs to run once when the days available change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, state.fechaInicio, state.fechaFin, state.montaje, state.diasPrevios, state.diasPosteriores]);

  if (!room) return null;
  const days = usageDayRange(state);

  if (days.length === 0) {
    return (
      <>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <StepHeader onBack={back} onClose={close} title="Fechas y horas de uso" />
          <div className="mt-4 rounded-xl bg-slate-100 px-5 py-9 text-center">
            <AlertTriangle size={26} className="mx-auto mb-3 text-slate-400" />
            <h3 className="mb-1.5 text-sm font-semibold text-slate-800">Todavía no hay fechas de evento</h3>
            <p className="text-xs text-slate-500">
              Vuelve al paso "Escoge las fechas del evento" para definir cuándo se celebra, y aquí podrás afinar los
              horarios de {room.name}.
            </p>
          </div>
        </div>
        <FooterBar>
          <SecondaryButton onClick={back}>Volver</SecondaryButton>
        </FooterBar>
      </>
    );
  }

  // Derive the schedule during render: the effect above only persists it after the first paint,
  // so reading state.roomConfig directly would hand DayCard an undefined day and crash.
  const horario = ensureHorario(state, room).roomConfig[room.id].horario;

  function patchDia(date: string, patch: Partial<DiaHorario>) {
    update((prev) => {
      const s = ensureHorario(prev, room!);
      const cfg = s.roomConfig[room!.id];
      const dia = { ...cfg.horario[date], ...patch };
      return {
        ...s,
        roomConfig: { ...s.roomConfig, [room!.id]: { ...cfg, horario: { ...cfg.horario, [date]: dia } } },
        fichaConfigDirty: true,
      };
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} title="Fechas y horas de uso de la sala" />
        <div className="mt-4 flex flex-col gap-3">
          {days.map((date) => (
            <DayCard
              key={date}
              date={date}
              dia={horario[date]}
              esDesmontaje={date > (state.fechaFin || state.fechaInicio!)}
              onPatch={(patch) => patchDia(date, patch)}
            />
          ))}
        </div>
      </div>
      <FooterBar>
        <SecondaryButton onClick={back}>Volver</SecondaryButton>
      </FooterBar>
    </>
  );
}

function DayCard({
  date,
  dia,
  esDesmontaje,
  onPatch,
}: {
  date: string;
  dia: DiaHorario;
  esDesmontaje: boolean;
  onPatch: (patch: Partial<DiaHorario>) => void;
}) {
  const d = fromISODate(date);
  const label = `${dayName(d)[0]}${dayName(d).slice(1).toLowerCase()} - ${d.getDate()} de ${d.toLocaleDateString("es-ES", { month: "long" })}`;

  function addExtra() {
    if (esDesmontaje) {
      // After the event the room stays in use in the morning and the teardown takes the afternoon.
      onPatch({ inicio: "08:00", fin: "14:00", extra: [{ inicio: "14:00", fin: "20:00" }] });
      return;
    }
    const [h, m] = dia.fin.split(":").map(Number);
    const [h0, m0] = dia.inicio.split(":").map(Number);
    const startMin = h0 * 60 + m0;
    const endMin = h * 60 + m;
    let mid = Math.round((startMin + endMin) / 2 / 30) * 30;
    mid = Math.max(startMin + 30, Math.min(endMin - 30, mid));
    const midTime = `${String(Math.floor(mid / 60)).padStart(2, "0")}:${String(mid % 60).padStart(2, "0")}`;
    onPatch({ preSplitInicio: dia.inicio, extra: [{ inicio: dia.inicio, fin: midTime }], inicio: midTime });
  }
  function removeExtra() {
    onPatch({ extra: [], inicio: dia.preSplitInicio ?? dia.inicio, preSplitInicio: undefined });
  }

  return (
    <div className="rounded-xl border border-slate-200 p-3.5">
      <div className="mb-3.5 flex items-center justify-between text-sm font-bold text-slate-900">
        <span>{label}</span>
        <Switch on={dia.activo} onToggle={() => onPatch({ activo: !dia.activo })} />
      </div>

      {dia.activo && (
        <>
          {dia.extra.length > 0 && <span className="mb-2 block text-[11px] uppercase tracking-wide text-slate-400">Horario del evento</span>}
          <div className="mb-2.5 flex items-center gap-2.5">
            <input type="time" value={dia.inicio} onChange={(e) => onPatch({ inicio: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm" />
            <span className="text-slate-400">–</span>
            <input type="time" value={dia.fin} onChange={(e) => onPatch({ fin: e.target.value })} className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={dia.montaje}
                onChange={() => onPatch({ montaje: !dia.montaje, extra: dia.montaje ? [] : dia.extra })}
                className="h-[18px] w-[18px] accent-slate-900"
              />
              Montaje / Desmontaje
            </label>
            {dia.montaje && dia.extra.length === 0 && (
              <button type="button" onClick={addExtra} className="text-xs font-medium text-blue-600 hover:underline">
                Añadir horas
              </button>
            )}
          </div>
          {dia.montaje && dia.extra.length > 0 && (
            <div className="mt-2.5 rounded-lg bg-slate-100 p-3">
              <span className="mb-2 block text-[11px] uppercase tracking-wide text-slate-400">Horario de montaje / desmontaje</span>
              {dia.extra.map((ex, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <input
                    type="time"
                    value={ex.inicio}
                    onChange={(e) => {
                      const extra = [...dia.extra];
                      extra[i] = { ...extra[i], inicio: e.target.value };
                      onPatch({ extra });
                    }}
                    className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="time"
                    value={ex.fin}
                    onChange={(e) => {
                      const extra = [...dia.extra];
                      extra[i] = { ...extra[i], fin: e.target.value };
                      onPatch({ extra });
                    }}
                    className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm"
                  />
                  <button type="button" onClick={removeExtra} className="ml-auto text-red-500 hover:text-red-600">
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
