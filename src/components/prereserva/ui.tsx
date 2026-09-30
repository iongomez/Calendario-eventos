import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import type { CalendarEvent } from "../../types";

/** Horizontal ruler from the final design; lucide's Ruler is a diagonal one. */
export function RulerIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12h20" />
      <path d="M6 8v4M10 8v4M14 8v4M18 8v4" />
    </svg>
  );
}

export function Switch({
  on,
  onToggle,
  disabled,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={disabled ? undefined : onToggle}
      className={`relative h-[26px] w-11 shrink-0 rounded-full transition-colors ${on ? "bg-[#1A1A1A]" : "bg-[#D7D7D7]"} ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      {/* Explicit left/top: without them the knob takes the button's centred static position and slides out of the track. */}
      <span
        className={`absolute left-[3px] top-[3px] h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function ToggleRow({
  label,
  hint,
  on,
  onToggle,
  disabled,
  noBorder,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
  noBorder?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 py-3.5 ${noBorder ? "" : "border-b border-slate-100"}`}>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      <Switch on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium text-slate-500">{children}</label>;
}

export function SectionTitle({ children, tight }: { children: ReactNode; tight?: boolean }) {
  return <h2 className={`text-base font-bold text-slate-900 ${tight ? "mb-2.5 mt-1" : "mb-2.5 mt-6"}`}>{children}</h2>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-500"
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[90px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-500"
    />
  );
}

export function Dropdown({
  value,
  placeholder,
  options,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 px-3 py-2.5 text-left text-sm"
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>{value || placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 ${opt === value ? "font-semibold" : ""}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 5,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
      >
        <Minus size={14} />
      </button>
      <span className="w-4 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export function ConfigRow({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-3.5 text-left last:border-b-0"
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 text-slate-400" />
    </button>
  );
}

export function StepHeader({
  onBack,
  onClose,
  step,
  title,
}: {
  onBack?: () => void;
  onClose: () => void;
  step?: string;
  title?: string;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-6 border-b border-slate-100 bg-white px-6 pb-3 pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Volver"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100 disabled:cursor-default disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>
      {step && <p className="mt-1 text-xs text-slate-400">{step}</p>}
      {title && <h1 className="mt-1 text-xl font-bold text-slate-900">{title}</h1>}
    </div>
  );
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** Warns that the room already has other calendar events on the days this pre-reserva would use it. */
export function ConflictWarning({
  events,
  roomName,
  hint = "Cambia las fechas o quita esta sala para poder continuar.",
  className = "",
}: {
  events: CalendarEvent[];
  roomName?: string;
  hint?: string;
  className?: string;
}) {
  if (events.length === 0) return null;
  return (
    <div
      role="alert"
      className={`flex gap-2.5 rounded-lg border border-[#F5D9A0] bg-[#FFF6E9] px-3.5 py-3 text-xs leading-relaxed text-[#8A5200] ${className}`}
    >
      <AlertTriangle size={15} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">
          {roomName ? `${roomName} ya tiene` : "Ya hay"} {events.length === 1 ? "otro evento" : `${events.length} eventos`} en
          estas fechas
        </p>
        <ul className="mt-1">
          {events.map((e) => (
            <li key={e.id}>
              {e.name} · {e.startDate === e.endDate ? shortDate(e.startDate) : `${shortDate(e.startDate)} – ${shortDate(e.endDate)}`}
            </li>
          ))}
        </ul>
        <p className="mt-1">{hint}</p>
      </div>
    </div>
  );
}

export function FooterBar({ children }: { children: ReactNode }) {
  return <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-100 px-6 py-4">{children}</div>;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
    />
  );
}

export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg border border-slate-900 bg-white py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
    />
  );
}

export function DarkGreenButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-emerald-900 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
    />
  );
}
