import { totalSteps } from "./flowState";
import { useFlow } from "./FlowContext";
import { FooterBar, PrimaryButton, StepHeader, ToggleRow } from "./ui";
import type { Secciones } from "./flowTypes";

export function Step3() {
  const { state, update, nav, back, close } = useFlow();
  const isPrereserva = state.flow === "prereserva";

  function toggleSeccion(key: keyof Secciones) {
    update((s) => ({ ...s, secciones: { ...s.secciones, [key]: !s.secciones[key] } }));
  }

  function continuar() {
    if (isPrereserva || state.secciones.espacios) {
      update((s) => ({ ...s, secciones: { ...s.secciones, espacios: true } }));
      nav("espacios");
    } else {
      nav("completion");
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} step={`3 de ${totalSteps(state)}`} title="¿Qué más quieres completar ahora?" />

        <p className="mt-4 mb-3 text-xs text-slate-400">
          Elige las secciones que quieras rellenar ya. Las que no marques se guardan vacías y las podrás editar después
          desde la ficha.
        </p>

        <div className="rounded-xl border border-slate-200 px-4">
          <ToggleRow
            label="Selección de espacios"
            hint="Sala, aforo y disposición del evento"
            on={state.secciones.espacios}
            onToggle={() => toggleSeccion("espacios")}
            disabled={isPrereserva}
          />
          <ToggleRow
            label="Asistentes, manutención y hospedaje"
            hint="Lista de asistentes, comidas y habitaciones"
            on={state.secciones.asistentes}
            onToggle={() => toggleSeccion("asistentes")}
          />
          <ToggleRow
            label="Servicios del evento"
            hint="Áreas implicadas y servicios especiales"
            on={state.secciones.servicios}
            onToggle={() => toggleSeccion("servicios")}
          />
          <ToggleRow
            label="Facturas y documentos"
            hint="Datos de facturación y adjuntos"
            on={state.secciones.facturas}
            onToggle={() => toggleSeccion("facturas")}
            noBorder
          />
        </div>
        {isPrereserva && <p className="mt-2.5 text-xs text-slate-400">En una pre-reserva, la selección de espacios es obligatoria.</p>}
      </div>
      <FooterBar>
        {/* Without "Selección de espacios" this is the last step before the summary. */}
        <PrimaryButton onClick={continuar}>{isPrereserva || state.secciones.espacios ? "Continuar" : "Finalizar"}</PrimaryButton>
      </FooterBar>
    </>
  );
}
