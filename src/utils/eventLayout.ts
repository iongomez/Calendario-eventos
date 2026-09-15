import type { CalendarEvent } from "../types";
import { toISODate } from "./dateUtils";

export interface EventCell {
  type: "event";
  key: string;
  event: CalendarEvent;
  colStart: number; // 1-based day index within the week (1 = Monday)
  colSpan: number;
  clippedStart: boolean; // pill continues before this week
  clippedEnd: boolean; // pill continues after this week
  dates: string[]; // ISO date for each column this cell covers, left to right
}

export interface EmptyCell {
  type: "empty";
  key: string;
  colStart: number;
  colSpan: 1;
  date: string;
}

export type RoomRowCell = EventCell | EmptyCell;

/**
 * Lays out a room's events for the visible week as a set of grid cells.
 * A multi-day event becomes ONE cell spanning multiple columns (a continuous
 * pill) instead of one cell per day. Days not covered by any event become
 * empty cells (for the hover "+" affordance).
 */
export function layoutRoomRow(
  events: CalendarEvent[],
  weekDays: Date[],
): RoomRowCell[] {
  const weekStartISO = toISODate(weekDays[0]);
  const weekEndISO = toISODate(weekDays[6]);
  const weekISOs = weekDays.map(toISODate);
  const occupied = new Array(7).fill(false);
  const cells: RoomRowCell[] = [];

  const relevant = events
    .filter((e) => e.endDate >= weekStartISO && e.startDate <= weekEndISO)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  for (const event of relevant) {
    const clippedStart = event.startDate < weekStartISO;
    const clippedEnd = event.endDate > weekEndISO;
    const segStartISO = clippedStart ? weekStartISO : event.startDate;
    const segEndISO = clippedEnd ? weekEndISO : event.endDate;
    const colStart = weekISOs.indexOf(segStartISO) + 1;
    const colEnd = weekISOs.indexOf(segEndISO) + 1;
    if (colStart < 1 || colEnd < colStart) continue;
    const colSpan = colEnd - colStart + 1;
    for (let i = colStart; i <= colEnd; i++) occupied[i - 1] = true;
    cells.push({
      type: "event",
      key: event.id,
      event,
      colStart,
      colSpan,
      clippedStart,
      clippedEnd,
      dates: weekISOs.slice(colStart - 1, colEnd),
    });
  }

  for (let i = 0; i < 7; i++) {
    if (!occupied[i]) {
      cells.push({
        type: "empty",
        key: `empty-${weekISOs[i]}`,
        colStart: i + 1,
        colSpan: 1,
        date: weekISOs[i],
      });
    }
  }

  return cells;
}
