import { useState } from "react";
import { FlowContext } from "./FlowContext";
import { freshState } from "./flowState";
import type { FlowScreen, FlowState } from "./flowTypes";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Espacios } from "./Espacios";
import { RoomList } from "./RoomList";
import { Ficha } from "./Ficha";
import { FichaConfigFechas } from "./FichaConfigFechas";
import { FichaConfigDistribucion } from "./FichaConfigDistribucion";
import { FichaConfigAccesorios } from "./FichaConfigAccesorios";
import { Completion } from "./Completion";

interface PreReservaFlowProps {
  siteId: string;
  roomId?: string;
  date?: string;
  onClose: () => void;
  onCompleted: (summary: { nombreEvento: string; flow: FlowState["flow"] }) => void;
}

const SCREENS: Record<FlowScreen, React.ComponentType> = {
  step1: Step1,
  step2: Step2,
  step3: Step3,
  espacios: Espacios,
  "room-list": RoomList,
  ficha: Ficha,
  "ficha-config-fechas": FichaConfigFechas,
  "ficha-config-distribucion": FichaConfigDistribucion,
  "ficha-config-accesorios": FichaConfigAccesorios,
  completion: Completion,
};

export function PreReservaFlow({ siteId, roomId, date, onClose, onCompleted }: PreReservaFlowProps) {
  const [state, setState] = useState<FlowState>(() => freshState({ siteId, roomId, date }));
  const [history, setHistory] = useState<FlowScreen[]>(["step1"]);

  const nav = (screen: FlowScreen) => setHistory((h) => [...h, screen]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const update = (updater: (s: FlowState) => FlowState) => setState(updater);

  const current = history[history.length - 1];

  // The completion screen's buttons close the panel; report what was created
  // so the calendar can show a confirmation toast, same as the old stub modal.
  const close = () => {
    if (current === "completion") {
      onCompleted({ nombreEvento: state.nombreEvento, flow: state.flow });
    }
    onClose();
  };

  const Screen = SCREENS[current];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Cerrar sin guardar" onClick={onClose} className="absolute inset-0 bg-slate-900/40" />
      <div className="relative flex h-full w-[480px] flex-col bg-white shadow-2xl">
        <FlowContext.Provider value={{ state, update, nav, back, close }}>
          <Screen />
        </FlowContext.Provider>
      </div>
    </div>
  );
}
