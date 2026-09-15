import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { formatWeekLabel, fromISODate, startOfWeek, toISODate } from "../utils/dateUtils";

interface TopBarProps {
  weekStart: Date;
  onWeekStartChange: (date: Date) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function TopBar({ weekStart, onWeekStartChange, viewMode, onViewModeChange }: TopBarProps) {
  const goToday = () => onWeekStartChange(startOfWeek(new Date()));
  const goPrev = () => onWeekStartChange(new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000));
  const goNext = () => onWeekStartChange(new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000));

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToday}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Hoy
        </button>

        <label className="relative flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <CalendarDays size={15} />
          {formatWeekLabel(weekStart)}
          <input
            type="date"
            value={toISODate(weekStart)}
            onChange={(e) => e.target.value && onWeekStartChange(startOfWeek(fromISODate(e.target.value)))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Seleccionar semana"
          />
        </label>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Semana anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Semana siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-slate-300 p-0.5">
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          aria-label="Vista calendario"
          className={`flex h-7 w-7 items-center justify-center rounded-md ${
            viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <LayoutGrid size={15} />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          aria-label="Vista lista"
          className={`flex h-7 w-7 items-center justify-center rounded-md ${
            viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <List size={15} />
        </button>
      </div>
    </div>
  );
}
