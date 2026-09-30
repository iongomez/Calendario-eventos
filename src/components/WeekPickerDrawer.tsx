import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  formatMonthYear,
  getISOWeekNumber,
  getMonthWeeks,
  isSameMonth,
  isToday,
  startOfWeek,
  toISODate,
} from "../utils/dateUtils";

const DAY_HEADS = ["L", "M", "X", "J", "V", "S", "D"];

interface WeekPickerDrawerProps {
  initialWeekStart: Date;
  onClose: () => void;
  onSelect: (weekStart: Date) => void;
}

export function WeekPickerDrawer({ initialWeekStart, onClose, onSelect }: WeekPickerDrawerProps) {
  const [viewMonth, setViewMonth] = useState(() => new Date(initialWeekStart.getFullYear(), initialWeekStart.getMonth(), 1));
  const [staged, setStaged] = useState(initialWeekStart);

  const weeks = getMonthWeeks(viewMonth);
  const stagedISO = toISODate(staged);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar sin aplicar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />

      <div className="relative flex h-full w-[380px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Volver"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <h2 className="text-xl font-bold text-slate-900">Selecciona la semana</h2>
          <p className="mb-5 mt-1 text-sm text-slate-500">Semana {getISOWeekNumber(staged)}</p>

          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              aria-label="Mes anterior"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-base font-semibold text-slate-900">{formatMonthYear(viewMonth)}</span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              aria-label="Mes siguiente"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex text-center text-xs font-medium text-slate-400">
            {DAY_HEADS.map((d, i) => (
              <span key={i} className="flex-1 py-1.5">
                {d}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-0.5">
            {weeks.map((week) => {
              const weekStart = week[0];
              const weekISO = toISODate(weekStart);
              const isStaged = weekISO === stagedISO;

              return (
                <button
                  key={weekISO}
                  type="button"
                  onClick={() => setStaged(weekStart)}
                  className={`flex rounded-full ${isStaged ? "bg-blue-600" : "hover:bg-blue-50"}`}
                >
                  {week.map((day) => {
                    const inMonth = isSameMonth(day, viewMonth);
                    const today = isToday(day) && !isStaged;
                    return (
                      <span
                        key={toISODate(day)}
                        className={`flex-1 py-2.5 text-center text-sm ${
                          isStaged
                            ? "font-bold text-white"
                            : inMonth
                              ? "text-slate-800"
                              : "text-slate-300"
                        } ${today ? "font-bold text-emerald-600" : ""}`}
                      >
                        {day.getDate()}
                      </span>
                    );
                  })}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={() => onSelect(startOfWeek(staged))}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Seleccionar semana
          </button>
        </div>
      </div>
    </div>
  );
}
