import type { CalendarEvent, DayAggregate } from "../types";
import { toISODate } from "./dateUtils";

/**
 * Sums catering/occupancy across every event of a site (all rooms), per day.
 * Setup/teardown days don't count towards the totals — nobody is being fed yet.
 */
export function computeDayAggregates(
  events: CalendarEvent[],
  weekDays: Date[],
): DayAggregate[] {
  return weekDays.map((day) => {
    const iso = toISODate(day);
    let catering = 0;
    let overnight = 0;
    let attendees = 0;

    for (const event of events) {
      const entry = event.days.find((d) => d.date === iso);
      if (entry && !entry.isSetup) {
        catering += entry.catering;
        overnight += entry.overnight;
        attendees += entry.attendees;
      }
    }

    return { date: iso, catering, overnight, attendees };
  });
}
