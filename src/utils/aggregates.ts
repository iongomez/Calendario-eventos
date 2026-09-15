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
    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;
    let overnight = 0;
    let attendees = 0;

    for (const event of events) {
      const entry = event.days.find((d) => d.date === iso);
      if (entry && !entry.isSetup) {
        breakfast += entry.breakfast;
        lunch += entry.lunch;
        dinner += entry.dinner;
        overnight += entry.overnight;
        attendees += entry.attendees;
      }
    }

    return { date: iso, breakfast, lunch, dinner, overnight, attendees };
  });
}
