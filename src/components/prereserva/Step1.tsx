import { useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { GESTORES, PROMOTORES, SITES, TIPOS_EVENTO } from "../../data/mockData";
import type { Person } from "../../data/mockData";
import { requiredFilledStep1, totalSteps } from "./flowState";
import { useFlow } from "./FlowContext";
import { Dropdown, FieldLabel, FooterBar, PrimaryButton, SectionTitle, StepHeader, TextInput, Textarea, ToggleRow } from "./ui";

function PersonChipField({
  label,
  placeholder,
  people,
  selected,
  multi,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  people: Person[];
  selected: Person[];
  multi: boolean;
  onAdd: (p: Person) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const available = people.filter((p) => !selected.find((s) => s.id === p.id));
  const filtered = query.trim()
    ? available.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))
    : available;

  const showInput = multi || selected.length === 0;

  return (
    <div className="mb-4">
      <FieldLabel>{label}</FieldLabel>
      <div
        ref={ref}
        onClick={() => setOpen(true)}
        className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5"
      >
        {selected.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5 rounded bg-slate-100 px-2 py-1 text-xs">
            {p.id} - <b className="font-semibold">{p.name}</b>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(p.id);
              }}
              className="text-slate-500 hover:text-slate-800"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {showInput && (
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={selected.length ? "" : placeholder}
            className="min-w-[100px] flex-1 border-none text-sm outline-none placeholder:text-slate-400"
          />
        )}
        <ChevronDown
          size={15}
          className={`ml-auto shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        />
      </div>
      {open && showInput && (
        <div className="relative">
          <div className="absolute left-0 right-0 top-1 z-30 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">Sin resultados</div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onAdd(p);
                    setQuery("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b border-slate-50 px-3 py-2.5 text-left last:border-b-0 hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{p.name}</span>
                    <span className="block text-xs text-slate-400">{p.id}</span>
                  </span>
                  {multi && <span className="h-[22px] w-[22px] shrink-0 rounded-[5px] border-[1.5px] border-slate-300" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Step1() {
  const { state, update, nav, close } = useFlow();
  const isPrereserva = state.flow === "prereserva";
  const site = SITES.find((s) => s.id === state.siteId);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onClose={close} step={`1 de ${totalSteps(state)}`} title="Completa los datos básicos" />

        <div className="mb-4 mt-5">
          <Dropdown
            value={isPrereserva ? "Pre-reserva" : "Nuevo evento"}
            placeholder="Selecciona"
            options={["Nuevo evento", "Pre-reserva"]}
            onSelect={(v) =>
              update((s) => ({
                ...s,
                flow: v === "Pre-reserva" ? "prereserva" : "nuevo",
                secciones: { ...s.secciones, espacios: v === "Pre-reserva" ? true : s.secciones.espacios },
              }))
            }
          />
        </div>

        <SectionTitle>Definición del evento</SectionTitle>

        <div className="mb-4">
          <FieldLabel>Nombre del evento</FieldLabel>
          <TextInput
            placeholder="Nombre del evento"
            value={state.nombreEvento}
            onChange={(e) => {
              const value = e.target.value;
              update((s) => ({ ...s, nombreEvento: value, nombreSenaletica: s.visualizarMismo ? value : s.nombreSenaletica }));
            }}
          />
          {isPrereserva && <p className="mt-1 text-xs text-slate-400">ID evento: 123456</p>}
        </div>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={state.visualizarMismo}
            onChange={() =>
              update((s) => ({
                ...s,
                visualizarMismo: !s.visualizarMismo,
                nombreSenaletica: !s.visualizarMismo ? s.nombreEvento : s.nombreSenaletica,
              }))
            }
            className="h-[18px] w-[18px] accent-slate-900"
          />
          Visualizar con el mismo nombre en pantallas
        </label>

        {!state.visualizarMismo && (
          <div className="mb-4">
            <FieldLabel>Nombre para la señalética</FieldLabel>
            <TextInput
              placeholder="Nombre para la señalética"
              value={state.nombreSenaletica}
              onChange={(e) => {
                const value = e.target.value;
                update((s) => ({ ...s, nombreSenaletica: value }));
              }}
            />
          </div>
        )}

        <div className="mb-4">
          <FieldLabel>Lugar del evento</FieldLabel>
          <Dropdown
            value={site?.name ?? ""}
            placeholder="Selecciona la ubicación"
            options={SITES.map((s) => s.name)}
            onSelect={(name) => {
              const picked = SITES.find((s) => s.name === name);
              if (picked) update((s) => ({ ...s, siteId: picked.id }));
            }}
          />
        </div>

        <div className="mb-4">
          <FieldLabel>Tipo de evento</FieldLabel>
          <Dropdown
            value={state.tipo}
            placeholder="Selecciona el tipo"
            options={TIPOS_EVENTO}
            onSelect={(tipo) => update((s) => ({ ...s, tipo, idFormativo: tipo !== "Formativo" ? "" : s.idFormativo }))}
          />
        </div>

        {state.tipo === "Formativo" && (
          <div className="mb-4">
            <FieldLabel>ID del evento formativo</FieldLabel>
            <TextInput
              placeholder="FORM00"
              value={state.idFormativo}
              onChange={(e) => {
                const value = e.target.value;
                update((s) => ({ ...s, idFormativo: value }));
              }}
            />
          </div>
        )}

        <SectionTitle>Asistencia al evento</SectionTitle>
        <div className="mb-4">
          <FieldLabel>Asistentes estimados</FieldLabel>
          <TextInput
            type="number"
            min={0}
            placeholder="0"
            value={state.asistentes}
            onChange={(e) => {
              const value = e.target.value;
              update((s) => ({ ...s, asistentes: value }));
            }}
          />
        </div>

        <SectionTitle>Asignar responsables</SectionTitle>
        <PersonChipField
          label="Gestor"
          placeholder="Buscar gestor..."
          people={GESTORES}
          selected={state.gestores}
          multi
          onAdd={(p) => update((s) => ({ ...s, gestores: [...s.gestores, p] }))}
          onRemove={(id) => update((s) => ({ ...s, gestores: s.gestores.filter((g) => g.id !== id) }))}
        />
        <PersonChipField
          label="Promotor del evento"
          placeholder="Buscar promotor..."
          people={PROMOTORES}
          selected={state.promotor ? [state.promotor] : []}
          multi={false}
          onAdd={(p) => update((s) => ({ ...s, promotor: p }))}
          onRemove={() => update((s) => ({ ...s, promotor: null }))}
        />

        <ToggleRow
          label="Presencia institucional"
          on={state.presenciaInstitucional}
          onToggle={() => update((s) => ({ ...s, presenciaInstitucional: !s.presenciaInstitucional }))}
        />
        <ToggleRow
          label="Añadir comentarios"
          on={state.comentarios}
          onToggle={() => update((s) => ({ ...s, comentarios: !s.comentarios }))}
          noBorder={state.comentarios}
        />
        {state.comentarios && (
          <div className="mt-2">
            <Textarea
              placeholder="Escribe aquí cualquier comentario adicional sobre el evento..."
              value={state.comentariosTexto}
              onChange={(e) => {
                const value = e.target.value;
                update((s) => ({ ...s, comentariosTexto: value }));
              }}
            />
          </div>
        )}
      </div>
      <FooterBar>
        <PrimaryButton disabled={!requiredFilledStep1(state)} onClick={() => nav("step2")}>
          Continuar
        </PrimaryButton>
      </FooterBar>
    </>
  );
}

