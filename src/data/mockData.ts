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
  /** Only relevant when isSetup is true. Defaults to "full". */
  setupDuration?: "full" | "half";
}

function buildDays(specs: DaySpec[]): DailyCatering[] {
  return specs.map((s) => ({
    date: d(s.weekOffset, s.dayIndex),
    catering: s.catering ?? 0,
    overnight: s.overnight ?? 0,
    attendees: s.attendees ?? 0,
    isSetup: s.isSetup ?? false,
    setupDuration: s.isSetup ? (s.setupDuration ?? "full") : undefined,
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
  { id: "san-agustin", name: "San Agustín", address: "San Agustín del Guadalix, Madrid" },
  { id: "torre-iberdrola", name: "Torre Iberdrola", address: "Plaza Euskadi 5, Bilbao" },
];

const LAYOUTS_BY_TYPE: Record<string, string[]> = {
  Auditorio: ["Teatro / Grada", "Solo escenario", "En círculo"],
  "Sala de juntas": ["Mesa de juntas", "En U"],
  "Sala de reuniones": ["Mesa de reuniones"],
  Multiusos: ["Escuela", "En U", "Banquete"],
  Aula: ["Escuela", "Mesa de trabajo"],
  "Espacio exterior": ["Cóctel", "Libre"],
};
const AMENITIES_BY_TYPE: Record<string, string[]> = {
  Auditorio: ["Enchufes: 20", "Proyector: 1", "Pantalla: 1"],
  "Sala de juntas": ["Enchufes: 10", "Pantalla: 1"],
  "Sala de reuniones": ["Enchufes: 6", "Pantalla: 1"],
  Multiusos: ["Enchufes: 14", "Proyector: 1", "Pantalla: 1"],
  Aula: ["Enchufes: 12", "Proyector: 1", "Pizarra: 1"],
  "Espacio exterior": ["Enchufes: 8"],
};
const EXTRA_AMENITIES_BY_TYPE: Record<string, string[]> = {
  Auditorio: ["Equipo de sonido: 1", "Wifi", "Aire acond.", "Calefacción", "Micrófono inalámbrico", "Pizarra"],
  "Sala de juntas": ["Wifi", "Videoconferencia", "Aire acond."],
  "Sala de reuniones": ["Wifi"],
  Multiusos: ["Wifi", "Aire acond.", "Pizarra"],
  Aula: ["Wifi", "Aire acond."],
  "Espacio exterior": ["Wifi", "Toldo"],
};

function withRoomDetails(room: Omit<Room, "size" | "layouts" | "amenities" | "extraAmenities">): Room {
  return {
    ...room,
    size: Math.round(room.capacity * 2.4),
    layouts: LAYOUTS_BY_TYPE[room.type] ?? ["Libre"],
    amenities: AMENITIES_BY_TYPE[room.type] ?? [],
    extraAmenities: EXTRA_AMENITIES_BY_TYPE[room.type] ?? [],
  };
}

export const ROOMS: Room[] = [
  withRoomDetails({
    id: "room-auditorio",
    siteId: "san-agustin",
    code: "AUD-01",
    name: "Auditorio",
    capacity: 200,
    type: "Auditorio",
    singular: true,
    reservable: true,
    building: "Edificio 1, Planta 0",
    alert: "El equipo de sonido está en revisión. Avisa a Audiovisuales con antelación si lo necesitas el día del evento.",
  }),
  withRoomDetails({
    id: "room-magna",
    siteId: "san-agustin",
    code: "SM-01",
    name: "Sala Magna",
    capacity: 100,
    type: "Sala de juntas",
    singular: false,
    reservable: true,
    building: "Edificio 1, Planta 0",
  }),
  withRoomDetails({
    id: "room-1",
    siteId: "san-agustin",
    code: "S1-01",
    name: "Sala 1",
    capacity: 50,
    type: "Sala de juntas",
    singular: false,
    reservable: true,
    building: "Edificio 1, Planta 1",
  }),
  withRoomDetails({
    id: "room-2",
    siteId: "san-agustin",
    code: "S2-01",
    name: "Sala 2",
    capacity: 30,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
    building: "Edificio 1, Planta 1",
  }),
  withRoomDetails({
    id: "room-3",
    siteId: "san-agustin",
    code: "S3-01",
    name: "Sala 3",
    capacity: 20,
    type: "Sala de reuniones",
    singular: false,
    reservable: false,
    building: "Edificio 1, Planta 1",
  }),
  withRoomDetails({
    id: "room-4",
    siteId: "san-agustin",
    code: "S4-01",
    name: "Sala 4",
    capacity: 25,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
    building: "Edificio 2, Planta 0",
  }),
  withRoomDetails({
    id: "room-5",
    siteId: "san-agustin",
    code: "S5-01",
    name: "Sala 5",
    capacity: 25,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
    building: "Edificio 2, Planta 0",
  }),
  withRoomDetails({
    id: "room-6",
    siteId: "san-agustin",
    code: "S6-01",
    name: "Sala 6",
    capacity: 15,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
    building: "Edificio 2, Planta 0",
  }),
  withRoomDetails({
    id: "room-multiusos-a",
    siteId: "san-agustin",
    code: "MU-A1",
    name: "Multiusos A",
    capacity: 60,
    type: "Multiusos",
    singular: false,
    reservable: true,
    building: "Edificio 2, Planta 1",
  }),
  withRoomDetails({
    id: "room-multiusos-b",
    siteId: "san-agustin",
    code: "MU-B1",
    name: "Multiusos B",
    capacity: 60,
    type: "Multiusos",
    singular: false,
    reservable: true,
    building: "Edificio 2, Planta 1",
  }),
  withRoomDetails({
    id: "room-aula-1",
    siteId: "san-agustin",
    code: "AF-01",
    name: "Aula Formación 1",
    capacity: 40,
    type: "Aula",
    singular: false,
    reservable: true,
    building: "Edificio 3, Planta 0",
  }),
  withRoomDetails({
    id: "room-aula-2",
    siteId: "san-agustin",
    code: "AF-02",
    name: "Aula Formación 2",
    capacity: 40,
    type: "Aula",
    singular: false,
    reservable: true,
    building: "Edificio 3, Planta 0",
  }),
  withRoomDetails({
    id: "room-vip",
    siteId: "san-agustin",
    code: "VIP-01",
    name: "Sala VIP",
    capacity: 10,
    type: "Sala de reuniones",
    singular: true,
    reservable: true,
    building: "Edificio 1, Planta 2",
  }),
  withRoomDetails({
    id: "room-terraza",
    siteId: "san-agustin",
    code: "TE-01",
    name: "Terraza Exterior",
    capacity: 150,
    type: "Espacio exterior",
    singular: true,
    reservable: true,
    building: "Exterior",
  }),
  withRoomDetails({
    id: "room-ti-1",
    siteId: "torre-iberdrola",
    code: "TI-A1",
    name: "Sala Norte",
    capacity: 40,
    type: "Sala de reuniones",
    singular: false,
    reservable: true,
    building: "Planta 12",
  }),
  withRoomDetails({
    id: "room-ti-2",
    siteId: "torre-iberdrola",
    code: "TI-A2",
    name: "Sala Sur",
    capacity: 300,
    type: "Auditorio",
    singular: true,
    reservable: true,
    building: "Planta 1",
  }),
];

export interface Person {
  id: string;
  name: string;
}

export const GESTORES: Person[] = [
  { id: "U71655589J", name: "Gómez, Ion" },
  { id: "U3839933", name: "López, Pedro" },
  { id: "U55210012", name: "Fernández, Elena" },
];

export const PROMOTORES: Person[] = [
  { id: "U361682", name: "Montealegre, Patricia" },
  { id: "U220144", name: "Ibáñez, Carlos" },
  { id: "U330871", name: "Martín, Sofía" },
  { id: "U445920", name: "Ruiz, Marta" },
];

export const TIPOS_EVENTO = ["Formativo", "Corporativo", "Institucional"];

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

  // Caso: evento futuro multi-día (semana siguiente) — montaje de medio día y desmontaje de día completo
  makeEvent({
    id: "evt-6",
    roomId: "room-2",
    name: "Congreso Movilidad Eléctrica",
    promoter: "Diego Molina",
    managerEmail: "ana.perez@iberdrola.com",
    startTime: "09:00",
    endTime: "18:30",
    days: buildDays([
      { weekOffset: 1, dayIndex: 0, isSetup: true, setupDuration: "half" },
      { weekOffset: 1, dayIndex: 1, catering: 90, overnight: 40, attendees: 90 },
      { weekOffset: 1, dayIndex: 2, catering: 90, overnight: 40, attendees: 90 },
      { weekOffset: 1, dayIndex: 3, catering: 90, overnight: 40, attendees: 90 },
      { weekOffset: 1, dayIndex: 4, isSetup: true, setupDuration: "full" },
    ]),
  }),

  // Caso: evento pasado — con montaje de día completo el día antes
  makeEvent({
    id: "evt-7",
    roomId: "room-1",
    name: "Reunión Trimestral Q2",
    promoter: "Laura Fernández",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "11:00",
    endTime: "12:30",
    days: buildDays([
      { weekOffset: -1, dayIndex: 2, isSetup: true, setupDuration: "full" },
      { weekOffset: -1, dayIndex: 3, catering: 15, attendees: 15 },
    ]),
  }),

  // Caso: evento anulado — con montaje de medio día antes
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
      { weekOffset: -1, dayIndex: 0, isSetup: true, setupDuration: "half" },
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

  // Caso: montaje de medio día y desmontaje de día completo en la misma pastilla
  makeEvent({
    id: "evt-11",
    roomId: "room-2",
    name: "Feria de Innovación Digital",
    promoter: "Laura Cifuentes",
    managerEmail: "ana.perez@iberdrola.com",
    startTime: "09:00",
    endTime: "18:00",
    days: buildDays([
      { weekOffset: 0, dayIndex: 0, isSetup: true, setupDuration: "half" },
      { weekOffset: 0, dayIndex: 1, catering: 70, overnight: 20, attendees: 70 },
      { weekOffset: 0, dayIndex: 2, catering: 70, overnight: 20, attendees: 70 },
      { weekOffset: 0, dayIndex: 3, isSetup: true, setupDuration: "full" },
    ]),
  }),

  // Salas nuevas: un par de eventos para que la vista compacta no se vea vacía del todo
  makeEvent({
    id: "evt-12",
    roomId: "room-aula-1",
    name: "Formación Prevención de Riesgos",
    promoter: "Marcos Delgado",
    managerEmail: "ana.perez@iberdrola.com",
    startTime: "09:00",
    endTime: "14:00",
    days: buildDays([{ weekOffset: 0, dayIndex: 1, catering: 35, attendees: 35 }]),
  }),
  makeEvent({
    id: "evt-13",
    roomId: "room-multiusos-a",
    name: "Encuentro Proveedores",
    promoter: "Cristina Palomo",
    managerEmail: CURRENT_USER_EMAIL,
    startTime: "10:00",
    endTime: "19:00",
    days: buildDays([
      { weekOffset: 0, dayIndex: 3, catering: 55, attendees: 55 },
      { weekOffset: 0, dayIndex: 4, catering: 55, attendees: 55 },
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
