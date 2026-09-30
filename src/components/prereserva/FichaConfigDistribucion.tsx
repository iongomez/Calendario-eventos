import { Check } from "lucide-react";
import { ROOMS } from "../../data/mockData";
import { getRoomConfig } from "./flowState";
import { useFlow } from "./FlowContext";
import { FooterBar, SecondaryButton, StepHeader } from "./ui";

export function FichaConfigDistribucion() {
  const { state, update, back, close } = useFlow();
  const room = ROOMS.find((r) => r.id === state.fichaRoomId);
  if (!room) return null;
  const cfg = getRoomConfig(state, room);

  function select(d: string) {
    update((s) => ({
      ...s,
      roomConfig: { ...s.roomConfig, [room!.id]: { ...cfg, distribucion: d } },
      fichaConfigDirty: true,
    }));
    back();
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
        <StepHeader onBack={back} onClose={close} title="Distribución de la sala" />
        <p className="mb-3.5 mt-4 text-xs text-slate-400">Elige cómo se dispondrá {room.name} para este evento.</p>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          {(room.layouts ?? []).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => select(d)}
              className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3.5 py-3 text-left last:border-b-0 hover:bg-slate-50"
            >
              <span className="text-sm font-semibold text-slate-800">{d}</span>
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-[5px] border-[1.5px] ${
                  cfg.distribucion === d ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
                }`}
              >
                {cfg.distribucion === d && <Check size={13} />}
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
