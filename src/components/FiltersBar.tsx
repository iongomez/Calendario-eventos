import { useState } from "react";
import { Filter, MoreVertical, Search, Sparkles } from "lucide-react";
import type { EventStatus, Site } from "../types";
import { STATUS_ORDER, STATUS_STYLES } from "../utils/statusStyles";

export type SortBy = "name" | "capacity" | "type";

interface FiltersBarProps {
  sites: Site[];
  siteId: string;
  onSiteChange: (siteId: string) => void;
  myEventsOnly: boolean;
  onMyEventsToggle: () => void;
  singularOnly: boolean;
  onSingularToggle: () => void;
  status: EventStatus | "todos";
  onStatusChange: (status: EventStatus | "todos") => void;
  roomSearch: string;
  onRoomSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  onExport: () => void;
}

const SORT_LABELS: Record<SortBy, string> = {
  name: "Nombre",
  capacity: "Aforo",
  type: "Tipo de sala",
};

export function FiltersBar({
  sites,
  siteId,
  onSiteChange,
  myEventsOnly,
  onMyEventsToggle,
  singularOnly,
  onSingularToggle,
  status,
  onStatusChange,
  roomSearch,
  onRoomSearchChange,
  sortBy,
  onSortByChange,
  onExport,
}: FiltersBarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
              advancedOpen ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter size={14} />
            Filtros
          </button>
          {advancedOpen && (
            <div className="absolute left-0 top-10 z-20 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Sparkles size={13} />
                Filtros avanzados
              </p>
              <p className="text-xs text-slate-400">
                Rango de fechas, promotor, tipo de sala y aforo mínimo — próximamente.
              </p>
            </div>
          )}
        </div>

        <select
          value={siteId}
          onChange={(e) => onSiteChange(e.target.value)}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onMyEventsToggle}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
            myEventsOnly ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Mis eventos
        </button>

        <button
          type="button"
          onClick={onSingularToggle}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
            singularOnly ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          ☆ Espacio singular
        </button>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as EventStatus | "todos")}
          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
        >
          <option value="todos">Estado</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_STYLES[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={roomSearch}
            onChange={(e) => onRoomSearchChange(e.target.value)}
            placeholder="Buscar sala"
            className="w-48 rounded-full border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Más opciones"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-52 rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg">
              <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Ordenar por
              </p>
              {(Object.keys(SORT_LABELS) as SortBy[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSortByChange(option);
                    setMenuOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm ${
                    sortBy === option ? "font-semibold text-blue-600" : "text-slate-700"
                  } hover:bg-slate-50`}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  onExport();
                  setMenuOpen(false);
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                Exportar…
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
