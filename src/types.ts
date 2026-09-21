export type EventStatus =
  | "en-curso"
  | "futuro"
  | "pasado"
  | "anulado"
  | "pre-reserva";

export interface Site {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  siteId: string;
  code: string;
  name: string;
  capacity: number;
  type: string;
  singular: boolean;
  reservable: boolean;
}

export interface DailyCatering {
  /** ISO date (yyyy-mm-dd) this catering/occupancy applies to */
  date: string;
  /** Total restauración count for the day (Comidas) — sites may offer very different service
   * types (café, agua ponentes, almuerzo...), so the calendar only tracks the combined total. */
  catering: number;
  /** Pernoctas (Hotel) */
  overnight: number;
  attendees: number;
  /** true if this date is a load-in/load-out day rather than the event itself */
  isSetup: boolean;
}

export interface CalendarEvent {
  id: string;
  roomId: string;
  name: string;
  promoter: string;
  managerEmail: string;
  status: EventStatus;
  /** ISO date (yyyy-mm-dd), first day the pill occupies (incl. setup) */
  startDate: string;
  /** ISO date (yyyy-mm-dd), last day the pill occupies (incl. teardown) */
  endDate: string;
  startTime: string;
  endTime: string;
  /** Per-day breakdown covering every date between startDate and endDate */
  days: DailyCatering[];
}

export interface DayAggregate {
  date: string;
  catering: number;
  overnight: number;
  attendees: number;
}
