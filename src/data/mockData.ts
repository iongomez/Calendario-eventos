import type { CalendarEvent, DailyCatering, EventStatus, Room, Site } from "../types";
import { addDays, startOfWeek, toISODate } from "../utils/dateUtils";

export const CURRENT_USER_EMAIL = "iongomez@gmail.com";

const today = new Date();
const curWeekStart = startOfWeek(today);

/** ISO date for `dayIndex` (0=Mon..6=Sun) of the week `weekOffset` weeks from the current week. */
function d(weekOffset: number, dayIndex: number): string {
  return toISODate(addDays(curWeekStart, weekOffset * 7 + dayIndex));
}

function deriveStatus(
  startDate: string,
  endDate: string,
  override?: "anulado" | "pre-reserva",
): EventStatus {
  if (override) return override;
  const todayISO = toISODate(today);
  if (todayISO < startDate) return "futuro";
  if (todayISO > endDate) return "pasado";
  return "en-curso";
}

interface DaySpec {
  weekOffset: number;
  dayIndex: number;
  catering?: number;
  overnight?: number;
  attendees?: number;
  isSetup?: boolean;
}

function buildDays(specs: DaySpec[]): DailyCatering[] {
  return specs.map((s) => ({
    date: d(s.weekOffset, s.dayIndex),
    catering: s.catering ?? 0,
    overnight: s.overnight ?? 0,
    attendees: s.attendees ?? 0,
    isSetup: s.isSetup ?? false,
  }));
}

function makeEvent(params: {
  id: string;
  roomId: string;
  name: string;
  promoter: string;
  managerEmail: string;
  startTime: string;
  endTime: string;
  days: DailyCatering[];
  override?: "anulado" | "pre-reserva";
}): CalendarEvent {
  const startDate = params.days[0].date;
  const endDate = params.days[params.days.length - 1].date;
  return {
    id: params.id,
    roomId: params.roomId,
    name: params.name,
    promoter: params.promoter,
    managerEmail: params.managerEmail,
    status: deriveStatus(startDate, endDate, params.override),
    startDate,
    endDate,
    startTime: params.startTime,
    endTime: params.endTime,
    days: params.days,
  };
}

export const SITES: Site[] = [
  { id: "san-agustin", name: "San Agustín" },
  { id: "torre-iberdrola", name: "Torre Iberdrola" },
];

export const ROOMS: Room[] = [
  {
    id: "room-auditorio",
    siteId: "san-agustin",
    code: "AUD-01",
    name: "Auditorio",
    capacity: 200,
    type: "Auditorio",
    singular: true,
    reservable: true,
  },
  {
    id: "room-magna",
    siteId: "san-agustin",
    code: "SM-01",
    name: "Sala Magna",
    capacity: 100,
    type: "Sala de juntas",
    singular: false,
    reservable: true,
  },
  {
    id: "room-1",
    siteId: "san-agustin",
    code: "S1-01",
    name: "Sala 1",
    capacity: 50,
    type: "Sala de juntas",
    singular: false,
    reservable: true,
  },
  {
    id: "room-2",
    siteId: "san-agustin",
    code: "S2-01",
    name: "Sala 2",
    capacity: 30,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
  },
  {
    id: "room-3",
    siteId: "san-agustin",
    code: "S3-01",
    name: "Sala 3",
    capacity: 20,
    type: "Sala de reuniones",
    singular: false,
    reservable: false,
  },
  {
    id: "room-ti-1",
    siteId: "torre-iberdrola",
    code: "TI-A1",
    name: "Sala Norte",
    capacity: 40,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
  },
  {
    id: "room-ti-2",
    siteId: "torre-iberdrola",
    code: "TI-A2",
    name: "Sala Sur",
    capacity: 300,
    type: "Auditorio",
    singular: true,
    reservable: true,
  },
];

export const EVENTS: CalendarEvent[] = [
  // Caso: evento de 2 días, sin montaje/desmontaje
  makeEvent({
    id: "evt-1",
    roomId: "room-auditorio",
    name: "Convención Anual Iberdrola",
    promoter: "Patricia Montealegre",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "09:00",
    endTime: "19:00",
    days: buildDays([
      { weekOffset: 0, dayIndex: 1, catering: 300, overnight: 50, attendees: 100 },
      { weekOffset: 0, dayIndex: 2, catering: 300, overnight: 50, attendees: 100 },
    ]),
  }),

  // Caso: evento con montaje y desmontaje (días de carga en los extremos, rayados)
  makeEvent({
    id: "evt-2",
    roomId: "room-magna",
    name: "Lanzamiento Producto X",
    promoter: "Carlos Ibáñez",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "10:00",
    endTime: "20:00",
    days: buildDays([
      { weekOffset: 0, dayIndex: 0, isSetup: true },
      { weekOffset: 0, dayIndex: 1, catering: 120, attendees: 60 },
      { weekOffset: 0, dayIndex: 2, catering: 120, attendees: 60 },
      { weekOffset: 0, dayIndex: 3, isSetup: true },
    ]),
  }),

  // Caso: evento de 1 día + manutención sin pernocta
  makeEvent({
    id: "evt-3",
    roomId: "room-1",
    name: "Comité de Dirección",
    promoter: "Ruth García",
    managerEmail: "ana.perez@iberdrola.com",
    startTime: "08:00",
    endTime: "13:00",
    days: buildDays([{ weekOffset: 0, dayIndex: 2, catering: 40, attendees: 20 }]),
  }),

  // Caso: pre-reserva
  makeEvent({
    id: "evt-4",
    roomId: "room-2",
    name: "Jornada Sostenibilidad",
    promoter: "Marta Ruiz",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "09:30",
    endTime: "14:00",
    override: "pre-reserva",
    days: buildDays([{ weekOffset: 0, dayIndex: 4, catering: 30, attendees: 30 }]),
  }),

  // Caso: evento futuro (1 día, semana siguiente)
  makeEvent({
    id: "evt-5",
    roomId: "room-auditorio",
    name: "Foro Innovación Energética",
    promoter: "Elena Castro",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "09:00",
    endTime: "18:00",
    days: buildDays([{ weekOffset: 1, dayIndex: 2, catering: 450, overnight: 180, attendees: 180 }]),
  }),

  // Caso: evento futuro multi-día (semana siguiente), sin montaje/desmontaje
  makeEvent({
    id: "evt-6",
    roomId: "room-2",
    name: "Congreso Movilidad Eléctrica",
    promoter: "Diego Molina",
    managerEmail: "ana.perez@iberdrola.com",
    startTime: "09:00",
    endTime: "18:30",
    days: buildDays([
      { weekOffset: 1, dayIndex: 1, catering: 90, overnight: 40, attendees: 90 },
      { weekOffset: 1, dayIndex: 2, catering: 90, overnight: 40, attendees: 90 },
      { weekOffset: 1, dayIndex: 3, catering: 90, overnight: 40, attendees: 90 },
    ]),
  }),

  // Caso: evento pasado
  makeEvent({
    id: "evt-7",
    roomId: "room-1",
    name: "Reunión Trimestral Q2",
    promoter: "Laura Fernández",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "11:00",
    endTime: "12:30",
    days: buildDays([{ weekOffset: -1, dayIndex: 3, catering: 15, attendees: 15 }]),
  }),

  // Caso: evento anulado
  makeEvent({
    id: "evt-8",
    roomId: "room-magna",
    name: "Feria de Empleo",
    promoter: "Javier Soto",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "09:00",
    endTime: "17:00",
    override: "anulado",
    days: buildDays([
      { weekOffset: -1, dayIndex: 1, catering: 40, attendees: 40 },
      { weekOffset: -1, dayIndex: 2, catering: 40, attendees: 40 },
    ]),
  }),

  // Caso: pastilla recortada por el límite de semana (empieza el sábado anterior, termina el martes de esta semana)
  makeEvent({
    id: "evt-9",
    roomId: "room-1",
    name: "Retiro Estratégico Directivos",
    promoter: "Sofía Martín",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "09:00",
    endTime: "17:00",
    days: buildDays([
      { weekOffset: -1, dayIndex: 5, catering: 90, overnight: 30, attendees: 30 },
      { weekOffset: -1, dayIndex: 6, catering: 90, overnight: 30, attendees: 30 },
      { weekOffset: 0, dayIndex: 0, catering: 90, overnight: 30, attendees: 30 },
      { weekOffset: 0, dayIndex: 1, catering: 90, overnight: 30, attendees: 30 },
    ]),
  }),

  // Torre Iberdrola: un evento para que el filtro de sede tenga contenido real
  makeEvent({
    id: "evt-10",
    roomId: "room-ti-1",
    name: "Reunión Comité Norte",
    promoter: "Iñigo Etxeberria",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "10:00",
    endTime: "11:00",
    days: buildDays([{ weekOffset: 0, dayIndex: 2, catering: 10, attendees: 10 }]),
  }),
];
