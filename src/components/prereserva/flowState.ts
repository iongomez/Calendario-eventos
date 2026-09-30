import type { CalendarEvent, Room } from "../../types";
import { addDays, fromISODate, startOfWeek, toISODate } from "../../utils/dateUtils";
import type { DiaHorario, FlowState, RoomConfig } from "./flowTypes";

interface FreshStateParams {
  siteId: string;
  roomId?: string;
  date?: string;
}

export function freshState({ siteId, roomId, date }: FreshStateParams): FlowState {
  const month = date ? fromISODate(date) : new Date();
  return {
    flow: "prereserva",
    flowMenuOpen: false,
    lugarMenuOpen: false,
    tipoMenuOpen: false,
    nombreEvento: "",
    visualizarMismo: true,
    nombreSenaletica: "",
    siteId,
    tipo: "",
    idFormativo: "",
    asistentes: "",
    gestores: [],
    gestorSearchOpen: false,
    gestorQuery: "",
    promotor: null,
    promotorSearchOpen: false,
    promotorQuery: "",
    presenciaInstitucional: false,
    comentarios: false,
    comentariosTexto: "",
    fechaInicio: date ?? null,
    fechaFin: null,
    montaje: false,
    diasPrevios: 1,
    diasPosteriores: 1,
    // Pre-reserva always requires "Selección de espacios".
    secciones: { espacios: true, asistentes: false, servicios: false, facturas: false },
    salasSeleccionadas: roomId ? [roomId] : [],
    roomListSearch: "",
    fichaRoomId: null,
    fichaDispExpanded: false,
    fichaAccesoriosExpanded: false,
    fichaTab: "detalle",
    fichaConfigDirty: false,
    roomConfig: {},
    salaPrincipalId: roomId ?? null,
    stepCalendarMonth: new Date(month.getFullYear(), month.getMonth(), 1),
    fichaCalendarMonth: new Date(month.getFullYear(), month.getMonth(), 1),
  };
}

export function totalSteps(state: FlowState): number {
  return state.flow === "prereserva" ? 4 : 3;
}

export function requiredFilledStep1(state: FlowState): boolean {
  return (
    state.nombreEvento.trim() !== "" &&
    state.siteId !== "" &&
    state.tipo !== "" &&
    state.asistentes !== "" &&
    state.gestores.length > 0
  );
}

/** Every ISO date the event's rooms are in use, including montaje/desmontaje margin days. */
export function usageDayRange(state: FlowState): string[] {
  if (!state.fechaInicio) return [];
  const start = fromISODate(state.fechaInicio);
  const end = fromISODate(state.fechaFin || state.fechaInicio);
  const pre = state.montaje ? state.diasPrevios : 0;
  const post = state.montaje ? state.diasPosteriores : 0;
  const days: string[] = [];
  let cursor = addDays(start, -pre);
  const last = addDays(end, post);
  while (cursor <= last) {
    days.push(toISODate(cursor));
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function emptyRoomConfig(room: Room): RoomConfig {
  return {
    distribucion: room.layouts?.[0] ?? "",
    accesorios: [...(room.amenities ?? [])],
    observaciones: "",
    observacionesOn: false,
    horario: {},
  };
}

export function getRoomConfig(state: FlowState, room: Room): RoomConfig {
  return state.roomConfig[room.id] ?? emptyRoomConfig(room);
}

function defaultDiaHorario(date: string, state: FlowState): DiaHorario {
  const start = state.fechaInicio!;
  const end = state.fechaFin || state.fechaInicio!;
  const esMargen = date < start || date > end;
  return {
    activo: true,
    inicio: "08:00",
    fin: esMargen ? "14:00" : "20:00",
    montaje: esMargen,
    extra: [],
  };
}

/** Materialises a horario entry for every day in usageDayRange, preserving any that already exist. */
export function ensureHorario(state: FlowState, room: Room): FlowState {
  const cfg = getRoomConfig(state, room);
  const horario = { ...cfg.horario };
  let changed = false;
  for (const date of usageDayRange(state)) {
    if (!horario[date]) {
      horario[date] = defaultDiaHorario(date, state);
      changed = true;
    }
  }
  if (!changed && state.roomConfig[room.id]) return state;
  return {
    ...state,
    roomConfig: { ...state.roomConfig, [room.id]: { ...cfg, horario } },
  };
}

export function activeDayCount(state: FlowState, room: Room): number {
  const totalDays = usageDayRange(state);
  const horario = state.roomConfig[room.id]?.horario;
  if (!horario) return totalDays.length;
  return totalDays.filter((date) => !horario[date] || horario[date].activo).length;
}

export type RoomAvailability = "disponible" | "reservado" | "no_reservable";

/**
 * Calendar events (excluding cancelled ones) that overlap the days this pre-reserva would occupy
 * the room, montaje/desmontaje margin days included — same span the calendar draws for each pill.
 */
export function roomConflicts(room: Room, events: CalendarEvent[], state: FlowState): CalendarEvent[] {
  // Days the room is switched off in its own schedule don't book it, so they can't clash.
  const horario = state.roomConfig[room.id]?.horario;
  const days = usageDayRange(state).filter((d) => !horario?.[d] || horario[d].activo);
  if (days.length === 0) return [];
  return events.filter(
    (e) => e.roomId === room.id && e.status !== "anulado" && days.some((d) => d >= e.startDate && d <= e.endDate),
  );
}

/** True when any room already in the pre-reserva clashes with another event; blocks moving forward. */
export function hasSelectedRoomConflicts(rooms: Room[], events: CalendarEvent[], state: FlowState): boolean {
  return state.salasSeleccionadas.some((id) => {
    const room = rooms.find((r) => r.id === id);
    return room !== undefined && roomConflicts(room, events, state).length > 0;
  });
}

/** How a day looks in the "Escoge las fechas" calendar. */
export function eventDayKind(state: FlowState, iso: string): "free" | "event" | "margin" {
  if (!state.fechaInicio) return "free";
  const start = state.fechaInicio;
  const end = state.fechaFin || state.fechaInicio;
  if (iso >= start && iso <= end) return "event";
  if (state.montaje) {
    const marginStart = toISODate(addDays(fromISODate(start), -state.diasPrevios));
    const marginEnd = toISODate(addDays(fromISODate(end), state.diasPosteriores));
    if ((iso >= marginStart && iso < start) || (iso > end && iso <= marginEnd)) return "margin";
  }
  return "free";
}

/** Real availability, checked against the app's actual bookings. */
export function computeRoomAvailability(room: Room, events: CalendarEvent[], state: FlowState): RoomAvailability {
  if (!room.reservable) return "no_reservable";
  return roomConflicts(room, events, state).length > 0 ? "reservado" : "disponible";
}

/** Day classification for a room's own "ver disponibilidad" calendar. */
export type RoomDayKind = "free" | "event" | "margin" | "other-event" | "half-day-event";

export function roomDayKind(
  room: Room,
  date: string,
  events: CalendarEvent[],
  state: FlowState,
): RoomDayKind {
  for (const event of events) {
    if (event.roomId !== room.id || event.status === "anulado") continue;
    if (date < event.startDate || date > event.endDate) continue;
    const day = event.days.find((d) => d.date === date);
    if (day?.isSetup && day.setupDuration === "half") return "half-day-event";
    return "other-event";
  }
  const horario = state.roomConfig[room.id]?.horario?.[date];
  if (horario) return horario.activo ? (horario.montaje ? "margin" : "event") : "free";
  // Fall back to the event's own general date range until the room has its own schedule.
  if (state.fechaInicio) {
    const start = state.fechaInicio;
    const end = state.fechaFin || state.fechaInicio;
    if (date >= start && date <= end) return "event";
    if (state.montaje) {
      const marginStart = toISODate(addDays(fromISODate(start), -state.diasPrevios));
      const marginEnd = toISODate(addDays(fromISODate(end), state.diasPosteriores));
      if (date >= marginStart && date < start) return "margin";
      if (date > end && date <= marginEnd) return "margin";
    }
  }
  return "free";
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function weekStartFor(date: Date): Date {
  return startOfWeek(date);
}
