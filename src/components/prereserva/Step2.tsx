import { eventDayKind, hasSelectedRoomConflicts, roomConflicts, totalSteps } from "./flowState";
import { useFlow } from "./FlowContext";
import { EVENTS, ROOMS } from "../../data/mockData";
import { Legend, MonthGrid } from "./MonthGrid";
import { ConflictWarning, FooterBar, PrimaryButton, StepHeader, Stepper, ToggleRow } from "./ui";

export function Step2() {
  const { state, update, nav, back, close } = useFlow();

  function clickDay(dateIso: string) {
    update((s) => {
      if (!s.fechaInicio || (s.fechaInicio && s.fechaFin)) {
        return { ...s, fechaInicio: dateIso, fechaFin: null };
      }
      if (dateIso >= s.fechaInicio) {
        return { ...s, fechaFin: dateIso };
      }
      return { ...s, fechaInicio: dateIso, fechaFin: null };
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} step={`2 de ${totalSteps(state)}`} title="Escoge las fechas del evento" />

        <div className="mt-5 rounded-xl border border-slate-200 p-4">
          <MonthGrid
            month={state.stepCalendarMonth}
            onMonthChange={(m) => update((s) => ({ ...s, stepCalendarMonth: m }))}
            kindFor={(iso) => eventDayKind(state, iso)}
            onDayClick={clickDay}
          />
          <Legend
            kinds={[
              { kind: "event", label: "Evento" },
              { kind: "margin", label: "Montaje / desmontaje" },
            ]}
          />
        </div>

        {state.salasSeleccionadas.map((id) => {
          const room = ROOMS.find((r) => r.id === id);
          return room ? (
            <ConflictWarning
              key={id}
              roomName={room.name}
              events={roomConflicts(room, EVENTS, state)}
              hint="Elige otras fechas para poder continuar."
              className="mt-3"
            />
          ) : null;
        })}

        <hr className="my-4 border-slate-100" />

        <ToggleRow
          label="Añadir días montaje y desmontaje"
          on={state.montaje}
          onToggle={() => update((s) => ({ ...s, montaje: !s.montaje }))}
          noBorder
        />

        {state.montaje && (
          <>
            <p className="-mt-1 mb-2 text-xs text-slate-400">
              Estos días se aplicarán a todas las reservas de salas por igual, luego podrás editar cada una de ellas
            </p>
            <div className="flex items-center justify-between border-b border-slate-100 py-2.5">
              <span className="text-sm text-slate-700">Días previos al evento</span>
              <Stepper value={state.diasPrevios} onChange={(v) => update((s) => ({ ...s, diasPrevios: v }))} />
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-700">Días posteriores al evento</span>
              <Stepper value={state.diasPosteriores} onChange={(v) => update((s) => ({ ...s, diasPosteriores: v }))} />
            </div>
          </>
        )}
      </div>
      <FooterBar>
        <PrimaryButton
          disabled={!state.fechaInicio || hasSelectedRoomConflicts(ROOMS, EVENTS, state)}
          onClick={() => nav("step3")}
        >
          Continuar
        </PrimaryButton>
      </FooterBar>
    </>
  );
}
