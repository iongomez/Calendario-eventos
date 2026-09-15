import type { DayAggregate } from "../types";
import { dayName, formatDayNumber, fromISODate, isToday } from "../utils/dateUtils";
import { BedDouble, Coffee, Moon, Users, UtensilsCrossed } from "lucide-react";

export function DayHeaderCell({ aggregate }: { aggregate: DayAggregate }) {
  const date = fromISODate(aggregate.date);
  const today = isToday(date);
  const hasCatering = aggregate.breakfast + aggregate.lunch + aggregate.dinner > 0;
  const hasOvernight = aggregate.overnight > 0;

  return (
    <div className={`flex flex-col items-stretch gap-1.5 px-2 py-2 ${today ? "bg-emerald-50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <span className={`text-[11px] font-semibold tracking-wide ${today ? "text-emerald-700" : "text-slate-500"}`}>
          {dayName(date)}
        </span>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
            today ? "bg-emerald-600 text-white" : "text-slate-700"
          }`}
        >
          {formatDayNumber(date)}
        </span>
      </div>

      {aggregate.attendees > 0 && (
        <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <Users size={13} />
          {aggregate.attendees} asistentes
        </span>
      )}

      {hasCatering && (
        <div className="group relative flex flex-col gap-1 rounded-md border border-slate-300/70 bg-slate-200/70 px-2 py-1.5">
          <p className="text-xs font-semibold text-slate-700">Restaurante</p>
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <span className="flex items-center gap-0.5">
              <Coffee size={14} />
              {aggregate.breakfast}
            </span>
            <span className="flex items-center gap-0.5">
              <UtensilsCrossed size={14} />
              {aggregate.lunch}
            </span>
            <span className="flex items-center gap-0.5">
              <Moon size={14} />
              {aggregate.dinner}
            </span>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 w-40 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Restaurante</p>
            <div className="flex flex-col gap-1">
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <Coffee size={13} />
                  Desayuno
                </span>
                <span className="font-semibold">{aggregate.breakfast}</span>
              </span>
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed size={13} />
                  Comida
                </span>
                <span className="font-semibold">{aggregate.lunch}</span>
              </span>
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <Moon size={13} />
                  Cena
                </span>
                <span className="font-semibold">{aggregate.dinner}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {hasOvernight && (
        <div className="rounded-md border border-slate-300/70 bg-slate-200/70 px-2 py-1.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <BedDouble size={14} />
            Hotel: {aggregate.overnight}
          </p>
        </div>
      )}
    </div>
  );
}
