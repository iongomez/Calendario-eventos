import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatMonthYear, getMonthWeeks, isSameMonth, isToday, toISODate } from "../../utils/dateUtils";
import { totalSteps } from "./flowState";
import { useFlow } from "./FlowContext";
import { FooterBar, PrimaryButton, StepHeader, Stepper, ToggleRow } from "./ui";

const DOW = ["L", "M", "X", "J", "V", "S", "D"];

export function Step2() {
  const { state, update, nav, back, close } = useFlow();
  const weeks = getMonthWeeks(state.stepCalendarMonth);

  const start = state.fechaInicio;
  const end = state.fechaFin ?? state.fechaInicio;

  function dayClassFor(dateIso: string, inMonth: boolean): string {
    const base = "flex aspect-square items-center justify-center rounded-full text-sm cursor-pointer";
    if (start && dateIso >= start && dateIso <= (end as string)) {
      return `${base} bg-slate-900 font-bold text-white`;
    }
    if (state.montaje && start) {
      const marginStart = toISODate(addDays(new Date(start), -state.diasPrevios));
      const marginEnd = toISODate(addDays(new Date(end as string), state.diasPosteriores));
      if ((dateIso >= marginStart && dateIso < start) || (dateIso > (end as string) && dateIso <= marginEnd)) {
        return `${base} bg-blue-200 font-semibold text-slate-800`;
      }
    }
    return `${base} ${inMonth ? "text-slate-800" : "text-slate-300"} hover:bg-slate-100`;
  }

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
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
        <StepHeader onBack={back} onClose={close} step={`2 de ${totalSteps(state)}`} title="Escoge las fechas del evento" />

        <div className="mt-5 rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between font-semibold">
            <button
              type="button"
              onClick={() =>
                update((s) => ({
                  ...s,
                  stepCalendarMonth: new Date(s.stepCalendarMonth.getFullYear(), s.stepCalendarMonth.getMonth() - 1, 1),
                }))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm">{formatMonthYear(state.stepCalendarMonth)}</span>
            <button
              type="button"
              onClick={() =>
                update((s) => ({
                  ...s,
                  stepCalendarMonth: new Date(s.stepCalendarMonth.getFullYear(), s.stepCalendarMonth.getMonth() + 1, 1),
                }))
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <ChevronRight size={18} />
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
              const inMonth = isSameMonth(date, state.stepCalendarMonth);
              return (
                <button key={iso} type="button" onClick={() => clickDay(iso)} className={dayClassFor(iso, inMonth)}>
                  <span className={isToday(date) && start !== iso ? "underline decoration-2 underline-offset-2" : ""}>
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900" />
              Evento
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-full bg-blue-200" />
              Montaje / desmontaje
            </span>
          </div>
        </div>

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
        <PrimaryButton disabled={!state.fechaInicio} onClick={() => nav("step3")}>
          Continuar
        </PrimaryButton>
      </FooterBar>
    </>
  );
}
