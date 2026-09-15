import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

export function SelectChip({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`appearance-none rounded-full border border-slate-300 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none ${className}`}
      />
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
