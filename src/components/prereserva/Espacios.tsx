import { AlertTriangle, Plus, Settings, Star, Trash2, Users } from "lucide-react";
import { EVENTS, ROOMS } from "../../data/mockData";
import { roomConflicts, totalSteps } from "./flowState";
import { useFlow } from "./FlowContext";
import { ConflictWarning, FooterBar, PrimaryButton, RulerIcon, StepHeader } from "./ui";

export function Espacios() {
  const { state, update, nav, back, close } = useFlow();
  const isPrereserva = state.flow === "prereserva";
  const stepNum = isPrereserva ? 4 : 3;
  const salas = state.salasSeleccionadas.map((id) => ROOMS.find((r) => r.id === id)).filter((r) => r !== undefined);

  function removeSala(id: string) {
    update((s) => ({
      ...s,
      salasSeleccionadas: s.salasSeleccionadas.filter((x) => x !== id),
      salaPrincipalId: s.salaPrincipalId === id ? s.salasSeleccionadas.filter((x) => x !== id)[0] || null : s.salaPrincipalId,
    }));
  }

  function openFicha(id: string) {
    update((s) => ({ ...s, fichaRoomId: id, fichaDispExpanded: false, fichaAccesoriosExpanded: false, fichaTab: "config", fichaConfigDirty: false }));
    nav("ficha");
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} step={`${stepNum} de ${totalSteps(state)}`} title="Espacios y salas" />

        <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-100 px-4 py-2.5">
          <span className="text-sm text-slate-600">
            {salas.length} añadida{salas.length === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={() => nav("room-list")}
            className="flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            <Plus size={13} /> Añadir
          </button>
        </div>

        {salas.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-100 px-5 py-9 text-center">
            <AlertTriangle size={26} className="mx-auto mb-3 text-slate-400" />
            <h3 className="mb-1.5 text-sm font-semibold text-slate-800">No has añadido ninguna sala</h3>
            <p className="mb-3.5 text-xs text-slate-500">Todavía no se han añadido ningún espacio o sala al evento</p>
            <button type="button" onClick={() => nav("room-list")} className="text-sm font-medium text-blue-600 hover:underline">
              + Añadir
            </button>
          </div>
        ) : (
          salas.map((room) => (
            <div key={room.id} className="mt-3 rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-bold text-slate-900">{room.name}</p>
                  <div className="mt-1 flex items-center gap-3.5 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      {room.capacity}
                    </span>
                    <span className="flex items-center gap-1">
                      <RulerIcon size={13} />
                      {room.size}m²
                    </span>
                  </div>
                  {state.salaPrincipalId === room.id && (
                    <span className="mt-1.5 inline-block rounded-full border border-slate-900 px-2.5 py-0.5 text-[11px]">
                      Sala principal
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2.5">
                  {room.singular && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                      <Star size={12} fill="currentColor" />
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <button type="button" title="Configurar sala" onClick={() => openFicha(room.id)} className="text-blue-600 hover:text-blue-700">
                      <Settings size={18} />
                    </button>
                    <button type="button" title="Quitar" onClick={() => removeSala(room.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <ConflictWarning events={roomConflicts(room, EVENTS, state)} className="mt-3" />
            </div>
          ))
        )}
      </div>
      <FooterBar>
        <PrimaryButton disabled={salas.length === 0} onClick={() => nav("completion")}>
          Continuar
        </PrimaryButton>
      </FooterBar>
    </>
  );
}
