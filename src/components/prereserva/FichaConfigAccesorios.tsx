import { Check } from "lucide-react";
import { ROOMS } from "../../data/mockData";
import { getRoomConfig } from "./flowState";
import { useFlow } from "./FlowContext";
import { FooterBar, SecondaryButton, StepHeader } from "./ui";

export function FichaConfigAccesorios() {
  const { state, update, back, close } = useFlow();
  const room = ROOMS.find((r) => r.id === state.fichaRoomId);
  if (!room) return null;
  const cfg = getRoomConfig(state, room);
  const todos = [...(room.amenities ?? []), ...(room.extraAmenities ?? [])];

  function toggle(a: string) {
    update((s) => {
      const accesorios = cfg.accesorios.includes(a) ? cfg.accesorios.filter((x) => x !== a) : [...cfg.accesorios, a];
      return { ...s, roomConfig: { ...s.roomConfig, [room!.id]: { ...cfg, accesorios } }, fichaConfigDirty: true };
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <StepHeader onBack={back} onClose={close} title="Accesorios de la sala" />
        <p className="mb-3.5 mt-4 text-xs text-slate-400">Marca los accesorios disponibles en {room.name}.</p>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          {todos.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggle(a)}
              className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3 text-left last:border-b-0 hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-slate-800">{a}</span>
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-[5px] border-[1.5px] ${
                  cfg.accesorios.includes(a) ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
                }`}
              >
                {cfg.accesorios.includes(a) && <Check size={13} />}
              </span>
            </button>
          ))}
        </div>
      </div>
      <FooterBar>
        <SecondaryButton onClick={back}>Volver</SecondaryButton>
      </FooterBar>
    </>
  );
}
