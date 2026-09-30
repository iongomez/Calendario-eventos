import { Check } from "lucide-react";
import { ROOMS, SITES } from "../../data/mockData";
import { fromISODate } from "../../utils/dateUtils";
import { useFlow } from "./FlowContext";
import { FooterBar, PrimaryButton, SecondaryButton, StepHeader } from "./ui";

export function Completion() {
  const { state, close } = useFlow();
  const salaPrincipal = state.salaPrincipalId ? ROOMS.find((r) => r.id === state.salaPrincipalId) : null;
  const site = SITES.find((s) => s.id === state.siteId);
  const isPrereserva = state.flow === "prereserva";

  const fechas = state.fechaInicio
    ? state.fechaFin && state.fechaFin !== state.fechaInicio
      ? `${fromISODate(state.fechaInicio).toLocaleDateString("es-ES")} – ${fromISODate(state.fechaFin).toLocaleDateString("es-ES")}`
      : fromISODate(state.fechaInicio).toLocaleDateString("es-ES")
    : "—";

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
        <StepHeader onClose={close} />
        <div className="px-1 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Check size={30} className="text-emerald-600" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2 text-xl font-bold text-slate-900">{isPrereserva ? "Pre-reserva creada" : "Evento creado"}</h1>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Ya puedes seguir editando cualquier sección desde la ficha del evento.
          </p>
          <div className="rounded-xl border border-slate-200 p-4 text-left">
            <SummaryLine label="Nombre" value={state.nombreEvento || "—"} />
            <SummaryLine label="Tipo" value={`${isPrereserva ? "Pre-reserva" : "Nuevo evento"} · ${state.tipo || "—"}`} />
            <SummaryLine label="Lugar" value={site?.name ?? "—"} />
            <SummaryLine label="Fechas" value={fechas} />
            <SummaryLine label="Gestor(es)" value={state.gestores.map((g) => g.name).join(", ") || "—"} last={!salaPrincipal} />
            {salaPrincipal !== undefined && <SummaryLine label="Sala principal" value={salaPrincipal ? salaPrincipal.name : "Sin asignar"} last />}
          </div>
        </div>
      </div>
      <FooterBar>
        <PrimaryButton onClick={close}>Visualizar evento</PrimaryButton>
        <SecondaryButton onClick={close}>Ver todos los eventos</SecondaryButton>
      </FooterBar>
    </>
  );
}

function SummaryLine({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 py-2 text-xs ${last ? "" : "border-b border-slate-100"}`}>
      <span className="shrink-0 text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-700">{value}</span>
    </div>
  );
}
