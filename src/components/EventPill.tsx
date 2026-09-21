import type { CalendarEvent } from "../types";
import { CateringMetric } from "./CateringIcons";
import { StatusBadge } from "./StatusBadge";
import { STATUS_STYLES } from "../utils/statusStyles";
import { BedDouble, UtensilsCrossed, Users } from "lucide-react";
import type { EventCell } from "../utils/eventLayout";

interface EventPillProps {
  cell: EventCell;
  onOpen: (event: CalendarEvent) => void;
}

export function EventPill({ cell, onOpen }: EventPillProps) {
  const { event, colStart, colSpan, clippedStart, clippedEnd, dates } = cell;
  const style = STATUS_STYLES[event.status];
  const isAnulado = event.status === "anulado";
  const isPreReserva = event.status === "pre-reserva";

  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      title={`${event.name} — ${event.promoter}`}
      style={{ gridColumn: `${colStart} / span ${colSpan}`, gridRow: "1" }}
      className={`group relative grid overflow-hidden border text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${style.cardBg} ${style.cardBorder} ${
        !clippedStart ? "rounded-l-lg" : "rounded-l-none border-l-0"
      } ${!clippedEnd ? "rounded-r-lg" : "rounded-r-none"} ${
        isPreReserva ? "border-dashed" : "border-solid"
      }`}
      data-testid={`event-pill-${event.id}`}
    >
      {!clippedStart && (
        <span aria-hidden="true" className={`absolute inset-y-0 left-0 z-10 w-1.5 ${style.tagBg}`} />
      )}
      <div
        className="grid h-full"
        style={{ gridTemplateColumns: `repeat(${colSpan}, minmax(0,1fr))` }}
      >
        {dates.map((date, segmentIndex) => {
          const dayEntry = event.days.find((d) => d.date === date);
          const isStripedSegment = segmentIndex === 0 && !clippedStart;
          return (
            <div
              key={date}
              className={`flex min-h-[92px] flex-col gap-1 py-1.5 pr-2 ${
                isStripedSegment ? "pl-3.5" : "pl-2"
              } ${segmentIndex > 0 ? "border-l border-black/10" : ""} ${
                dayEntry?.isSetup ? "diagonal-stripes" : ""
              }`}
            >
              {dayEntry?.isSetup ? (
                <span className="m-auto text-center text-[10px] font-medium text-slate-500">
                  {segmentIndex === 0 ? "Montaje" : "Desmontaje"}
                </span>
              ) : (
                <>
                  <StatusBadge status={event.status} />
                  <p
                    className={`text-xs font-semibold leading-tight ${style.textColor} ${
                      isAnulado ? "line-through decoration-2" : ""
                    }`}
                  >
                    {event.name}
                  </p>
                  <p className="text-[11px] text-slate-600">{event.promoter}</p>
                  {dayEntry && dayEntry.attendees > 0 && (
                    <p className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                      <Users size={12} />
                      {dayEntry.attendees}
                    </p>
                  )}
                  {dayEntry && dayEntry.catering > 0 && (
                    <CateringMetric icon={UtensilsCrossed} label="Comidas" value={dayEntry.catering} size="xs" />
                  )}
                  {dayEntry && dayEntry.overnight > 0 && (
                    <CateringMetric icon={BedDouble} label="Pernoctas" value={dayEntry.overnight} size="xs" />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
}
