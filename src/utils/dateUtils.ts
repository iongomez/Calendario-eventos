const DAY_NAMES = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Monday of the week containing `date` */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0 = Sunday
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7);
}

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatMonthYear(date: Date): string {
  const month = MONTH_NAMES[date.getMonth()];
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

const MONTH_ABBR3 = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

/** Just the month(s)/year the visible week falls in, e.g. "Sep 2026" or "Sep - Oct 2026". */
export function formatWeekMonthPill(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startMonth = MONTH_ABBR3[weekStart.getMonth()];
  const endMonth = MONTH_ABBR3[weekEnd.getMonth()];
  const startYear = weekStart.getFullYear();
  const endYear = weekEnd.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear}`;
  }
  if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear}`;
  }
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
}

/** Just "Semana NN" — the year lives in the month pill next to it. */
export function formatWeekNumberLabel(weekStart: Date): string {
  const week = getISOWeekNumber(weekStart);
  return `Semana ${String(week).padStart(2, "0")}`;
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Every calendar week (Mon-Sun) needed to fully display `monthDate`'s month. */
export function getMonthWeeks(monthDate: Date): Date[][] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const weeks: Date[][] = [];
  let weekStart = startOfWeek(firstOfMonth);
  while (weekStart <= lastOfMonth) {
    weeks.push(getWeekDays(weekStart));
    weekStart = addDays(weekStart, 7);
  }
  return weeks;
}

export function dayName(date: Date): string {
  const dow = date.getDay();
  return DAY_NAMES[dow === 0 ? 6 : dow - 1];
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function formatDayNumber(date: Date): string {
  return String(date.getDate()).padStart(2, "0");
}
