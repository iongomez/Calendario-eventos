import type { DayAggregate } from "../types";
import { dayName, formatDayNumber, fromISODate, isToday } from "../utils/dateUtils";
import { BedDouble, UtensilsCrossed, Users } from "lucide-react";

export function DayHeaderCell({ aggregate }: { aggregate: DayAggregate }) {
  const date = fromISODate(aggregate.date);
  const today = isToday(date);

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

      {aggregate.catering > 0 && <AggregateCard icon={UtensilsCrossed} label="Restaurante" value={aggregate.catering} />}
      {aggregate.overnight > 0 && <AggregateCard icon={BedDouble} label="Hotel" value={aggregate.overnight} />}
    </div>
  );
}

function AggregateCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UtensilsCrossed;
  label: string;
  value: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-300/70 bg-slate-200/70 pl-3 pr-2 py-1.5">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-slate-400" />
      <p className="flex items-center gap-1.5 text-xs text-slate-700">
        <Icon size={14} />
        <span className="font-semibold">
          {label}: {value}
        </span>
      </p>
    </div>
  );
}
