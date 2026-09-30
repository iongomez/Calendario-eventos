import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatMonthYear, fromISODate, getMonthWeeks, isSameMonth, isToday, toISODate } from "../../utils/dateUtils";

export type DayKind = "free" | "event" | "margin" | "other-event" | "half-day-event";

const DOW = ["L", "M", "X", "J", "V", "S", "D"];

// Colours from the prototype: --link blue for the event, #BFD3FA for montaje/desmontaje.
const BAND: Record<Exclude<DayKind, "free">, string> = {
  event: "bg-[#1B63E9] text-white font-bold",
  margin: "bg-[#BFD3FA] text-slate-900 font-semibold",
  "other-event": "bg-[#E4E4E4] text-[#9c9c9c]",
  "half-day-event":
    "bg-[#E4E4E4] text-[#9c9c9c] [background-image:repeating-linear-gradient(135deg,#E4E4E4,#E4E4E4_3px,#fff_3px,#fff_6px)]",
};

/** Kinds that visually belong to the same run: the pre-reserva itself vs. other bookings. */
function group(kind: DayKind): "own" | "other" | null {
  if (kind === "event" || kind === "margin") return "own";
  if (kind === "other-event" || kind === "half-day-event") return "other";
  return null;
}

const LEGEND_SWATCH: Record<Exclude<DayKind, "free">, string> = {
  event: "bg-[#1B63E9]",
  margin: "bg-[#BFD3FA]",
  "other-event": "bg-[#E4E4E4]",
  "half-day-event": BAND["half-day-event"],
};

/**
 * Month calendar where consecutive days of the same run are drawn as one continuous band
 * (rounded only at the run's ends and at week edges) instead of one circle per day.
 */
export function MonthGrid({
  month,
  onMonthChange,
  kindFor,
  onDayClick,
}: {
  month: Date;
  onMonthChange: (month: Date) => void;
  kindFor: (iso: string) => DayKind;
  onDayClick?: (iso: string) => void;
}) {
  const weeks = getMonthWeeks(month);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-semibold">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm">{formatMonthYear(month)}</span>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {DOW.map((d) => (
          <div key={d} className="pb-1 text-[11px] font-medium uppercase text-slate-400">
            {d}
          </div>
        ))}
        {weeks.flat().map((date, i) => {
          const iso = toISODate(date);
          const kind = kindFor(iso);
          const g = group(kind);
          const col = i % 7;
          const prevJoined = g !== null && col > 0 && group(kindFor(toISODate(addDays(fromISODate(iso), -1)))) === g;
          const nextJoined = g !== null && col < 6 && group(kindFor(toISODate(addDays(fromISODate(iso), 1)))) === g;
          const inMonth = isSameMonth(date, month);
          const band =
            kind === "free"
              ? `${inMonth ? "text-slate-800" : "text-slate-300"} ${onDayClick ? "rounded-full hover:bg-slate-100" : ""}`
              : `${BAND[kind]} ${prevJoined ? "" : "rounded-l-full"} ${nextJoined ? "" : "rounded-r-full"}`;
          const Cell = onDayClick ? "button" : "div";
          return (
            <Cell
              key={iso}
              {...(onDayClick ? { type: "button" as const, onClick: () => onDayClick(iso) } : {})}
              className={`flex h-10 items-center justify-center text-sm ${band}`}
            >
              <span className={isToday(date) && kind === "free" ? "underline decoration-2 underline-offset-2" : ""}>
                {date.getDate()}
              </span>
            </Cell>
          );
        })}
      </div>
    </div>
  );
}

export function Legend({ kinds }: { kinds: { kind: Exclude<DayKind, "free">; label: string }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 text-xs text-slate-600">
      {kinds.map(({ kind, label }) => (
        <span key={kind} className="flex items-center gap-1.5">
          <i className={`inline-block h-2.5 w-2.5 rounded-full ${LEGEND_SWATCH[kind]}`} />
          {label}
        </span>
      ))}
    </div>
  );
}
