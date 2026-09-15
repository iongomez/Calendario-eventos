import type { EventStatus } from "../types";

export interface StatusStyle {
  label: string;
  dot: string;
  tagBg: string;
  tagText: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
}

export const STATUS_STYLES: Record<EventStatus, StatusStyle> = {
  "en-curso": {
    label: "En curso",
    dot: "bg-emerald-500",
    tagBg: "bg-emerald-600",
    tagText: "text-white",
    cardBg: "bg-blue-100",
    cardBorder: "border-blue-300",
    textColor: "text-slate-900",
  },
  futuro: {
    label: "Futuro",
    dot: "bg-blue-500",
    tagBg: "bg-blue-600",
    tagText: "text-white",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    textColor: "text-slate-900",
  },
  pasado: {
    label: "Pasado",
    dot: "bg-slate-400",
    tagBg: "bg-slate-400",
    tagText: "text-white",
    cardBg: "bg-slate-100",
    cardBorder: "border-slate-300",
    textColor: "text-slate-500",
  },
  anulado: {
    label: "Anulado",
    dot: "bg-red-500",
    tagBg: "bg-red-500",
    tagText: "text-white",
    cardBg: "bg-red-50",
    cardBorder: "border-red-200",
    textColor: "text-slate-500",
  },
  "pre-reserva": {
    label: "Pre-reserva",
    dot: "bg-sky-400",
    tagBg: "bg-sky-500",
    tagText: "text-white",
    cardBg: "bg-sky-50",
    cardBorder: "border-sky-300",
    textColor: "text-slate-900",
  },
};

export const STATUS_ORDER: EventStatus[] = [
  "en-curso",
  "futuro",
  "pasado",
  "pre-reserva",
  "anulado",
];
