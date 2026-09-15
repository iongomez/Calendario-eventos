import type { DayAggregate } from "../types";
import { CateringSummary } from "./CateringIcons";
import { dayName, formatDayNumber, fromISODate, isToday } from "../utils/dateUtils";
import { Users } from "lucide-react";

export function DayHeaderCell({ aggregate }: { aggregate: DayAggregate }) {
  const date = fromISODate(aggregate.date);
  const today = isToday(date);
  const hasActivity =
    aggregate.breakfast + aggregate.lunch + aggregate.dinner + aggregate.overnight + aggregate.attendees > 0;

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
      {hasActivity && (
        <div className="flex flex-col gap-1 rounded-md bg-slate-100 px-2 py-1.5 text-slate-700">
          <CateringSummary
            breakfast={aggregate.breakfast}
            lunch={aggregate.lunch}
            dinner={aggregate.dinner}
            overnight={aggregate.overnight}
            tone="aggregate"
          />
          <span className="flex items-center gap-1 text-xs font-medium">
            <Users size={14} />
            {aggregate.attendees} asistentes
          </span>
        </div>
      )}
    </div>
  );
}
