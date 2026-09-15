import { Plus } from "lucide-react";
import type { EmptyCell } from "../utils/eventLayout";

interface EmptyCellButtonProps {
  cell: EmptyCell;
  onCreate: (date: string) => void;
}

export function EmptyCellButton({ cell, onCreate }: EmptyCellButtonProps) {
  return (
    <div
      style={{ gridColumn: `${cell.colStart} / span 1`, gridRow: "1" }}
      className="group flex min-h-[92px] items-center justify-center border-r border-slate-100 last:border-r-0"
    >
      <button
        type="button"
        onClick={() => onCreate(cell.date)}
        aria-label="Crear evento"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 opacity-0 transition-opacity hover:border-blue-400 hover:text-blue-500 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
