export type FlowType = "nuevo" | "prereserva";

export type FlowScreen =
  | "step1"
  | "step2"
  | "step3"
  | "espacios"
  | "room-list"
  | "ficha"
  | "ficha-config-fechas"
  | "ficha-config-distribucion"
  | "ficha-config-accesorios"
  | "completion";

export interface DiaHorario {
  activo: boolean;
  inicio: string;
  fin: string;
  montaje: boolean;
  extra: { inicio: string; fin: string }[];
  /** Remembers the pre-split "inicio" so removing the montaje split can restore it. */
  preSplitInicio?: string;
}

export interface RoomConfig {
  distribucion: string;
  accesorios: string[];
  observaciones: string;
  observacionesOn: boolean;
  /** Keyed by ISO date */
  horario: Record<string, DiaHorario>;
}

export interface Person {
  id: string;
  name: string;
}

export interface Secciones {
  espacios: boolean;
  asistentes: boolean;
  servicios: boolean;
  facturas: boolean;
}

export interface FlowState {
  flow: FlowType;
  flowMenuOpen: boolean;
  lugarMenuOpen: boolean;
  tipoMenuOpen: boolean;
  nombreEvento: string;
  visualizarMismo: boolean;
  nombreSenaletica: string;
  siteId: string;
  tipo: string;
  idFormativo: string;
  asistentes: string;
  gestores: Person[];
  gestorSearchOpen: boolean;
  gestorQuery: string;
  promotor: Person | null;
  promotorSearchOpen: boolean;
  promotorQuery: string;
  presenciaInstitucional: boolean;
  comentarios: boolean;
  comentariosTexto: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  montaje: boolean;
  diasPrevios: number;
  diasPosteriores: number;
  secciones: Secciones;
  salasSeleccionadas: string[];
  roomListSearch: string;
  fichaRoomId: string | null;
  fichaDispExpanded: boolean;
  fichaAccesoriosExpanded: boolean;
  fichaTab: "detalle" | "config";
  fichaConfigDirty: boolean;
  roomConfig: Record<string, RoomConfig>;
  salaPrincipalId: string | null;
  stepCalendarMonth: Date;
  fichaCalendarMonth: Date;
}
