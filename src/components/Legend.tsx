import { BedDouble, Coffee, Soup, UtensilsCrossed } from "lucide-react";
import { STATUS_ORDER, STATUS_STYLES } from "../utils/statusStyles";

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
      {STATUS_ORDER.map((status) => (
        <span key={status} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].dot}`} />
          {STATUS_STYLES[status].label}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm diagonal-stripes-gray border border-slate-300" />
        Montaje / desmontaje
      </span>
      <span className="mx-1 h-4 border-l border-slate-200" />
      <span className="flex items-center gap-1">
        <Coffee size={13} /> Desayuno
      </span>
      <span className="flex items-center gap-1">
        <UtensilsCrossed size={13} /> Comida
      </span>
      <span className="flex items-center gap-1">
        <Soup size={13} /> Cena
      </span>
      <span className="flex items-center gap-1">
        <BedDouble size={13} /> Pernocta
      </span>
    </div>
  );
}
