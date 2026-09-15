import type { EventStatus } from "../types";
import { STATUS_STYLES } from "../utils/statusStyles";

export function StatusBadge({ status }: { status: EventStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.tagBg} ${style.tagText}`}
    >
      {style.label}
    </span>
  );
}
