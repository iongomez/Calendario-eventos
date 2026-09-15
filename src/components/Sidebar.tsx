import {
  CalendarDays,
  FileText,
  Flame,
  FolderKanban,
  HelpCircle,
  Home,
  LineChart,
  MapPin,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Inicio", icon: Home },
  { label: "Eventos", icon: FolderKanban },
  { label: "Calendario", icon: CalendarDays, active: true },
  { label: "Asistentes", icon: Users },
  { label: "Sedes", icon: MapPin },
  { label: "Estadísticas e informes", icon: LineChart },
  { label: "Documentos", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white">
      <div>
        <div className="flex items-center gap-2 px-4 py-5">
          <Flame size={22} className="text-slate-900" />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-slate-900">IBERDROLA</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Gestión de eventos</p>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 p-3">
        <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
          <HelpCircle size={16} />
          Ayuda y soporte
        </button>
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            IG
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">Ion Gómez</p>
            <p className="text-xs text-slate-400">Gestor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
