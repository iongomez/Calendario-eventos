import type { CalendarEvent } from "../types";
import { STATUS_STYLES } from "../utils/statusStyles";
import type { EventCell } from "../utils/eventLayout";

interface CompactEventBarProps {
  cell: EventCell;
  onOpen: (event: CalendarEvent) => void;
}

/**
 * Compact grid's event bar: the same continuous multi-day pill used by the
 * full calendar view (see EventPill), shrunk to a single thin row so many
 * rooms fit on screen — a solid block per event instead of a dot per day.
 */
export function CompactEventBar({ cell, onOpen }: CompactEventBarProps) {
  const { event, colStart, colSpan, clippedStart, clippedEnd, dates } = cell;
  const style = STATUS_STYLES[event.status];
  const isAnulado = event.status === "anulado";
  const isPreReserva = event.status === "pre-reserva";

  const setupFlags = dates.map((date) => Boolean(event.days.find((d) => d.date === date)?.isSetup));
  const mainIndices = setupFlags.reduce<number[]>((acc, isSetup, i) => {
    if (!isSetup) acc.push(i);
    return acc;
  }, []);
  const mainStart = mainIndices.length ? mainIndices[0] : 0;
  const mainEnd = mainIndices.length ? mainIndices[mainIndices.length - 1] : dates.length - 1;
  const nameLeftPct = (mainStart / dates.length) * 100;
  const nameWidthPct = ((mainEnd - mainStart + 1) / dates.length) * 100;

  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      title={`${event.name} — ${event.promoter}`}
      style={{ gridColumn: `${colStart} / span ${colSpan}`, gridRow: "1" }}
      className={`group relative h-7 self-center overflow-hidden border-2 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${style.tagBg} ${
        !clippedStart ? "rounded-l-md" : "rounded-l-none border-l-0"
      } ${!clippedEnd ? "rounded-r-md" : "rounded-r-none"} ${
        isPreReserva ? "border-dashed border-white/80" : "border-transparent"
      }`}
    >
      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${colSpan}, minmax(0,1fr))` }}>
        {dates.map((date, i) => (
          <div
            key={date}
            className={`flex items-center justify-center ${setupFlags[i] ? "bg-white/30" : ""} ${
              i > 0 ? "border-l border-white/20" : ""
            }`}
          >
            {setupFlags[i] && (
              <span className="truncate px-0.5 text-[8px] font-semibold uppercase tracking-tight text-white">
                {i === 0 ? "Montaje" : "Desm."}
              </span>
            )}
          </div>
        ))}
      </div>
      <span
        className="pointer-events-none absolute inset-y-0 flex items-center justify-center px-1.5"
        style={{ left: `${nameLeftPct}%`, width: `${nameWidthPct}%` }}
      >
        <span className={`truncate text-[11px] font-semibold text-white ${isAnulado ? "line-through decoration-2" : ""}`}>
          {event.name}
        </span>
      </span>
    </button>
  );
}
