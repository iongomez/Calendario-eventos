import { createContext, useContext } from "react";
import type { FlowScreen, FlowState } from "./flowTypes";

export interface FlowContextValue {
  state: FlowState;
  update: (updater: (s: FlowState) => FlowState) => void;
  nav: (screen: FlowScreen) => void;
  back: () => void;
  close: () => void;
}

export const FlowContext = createContext<FlowContextValue | null>(null);

export function useFlow(): FlowContextValue {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within <PreReservaFlow>");
  return ctx;
}
