import type { LucideIcon } from "lucide-react";

interface CateringMetricProps {
  icon: LucideIcon;
  label: string;
  value: number;
  size?: "sm" | "xs";
}

/**
 * A single labelled restauración/alojamiento metric (icon + label + total),
 * reused everywhere a "Comidas"/"Restaurante" or "Pernoctas"/"Hotel" figure
 * appears — sites can offer very different catering services, so the
 * calendar only ever shows the combined total, never a per-service split.
 */
export function CateringMetric({ icon: Icon, label, value, size = "sm" }: CateringMetricProps) {
  const iconSize = size === "xs" ? 12 : 14;
  const textSize = size === "xs" ? "text-[11px]" : "text-xs";

  return (
    <span className={`flex items-center gap-1 ${textSize} text-slate-700`}>
      <Icon size={iconSize} strokeWidth={2} />
      {label}: <span className="font-semibold">{value}</span>
    </span>
  );
}
