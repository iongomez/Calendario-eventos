import { BedDouble, Coffee, Soup, UtensilsCrossed } from "lucide-react";

interface CateringSummaryProps {
  breakfast: number;
  lunch: number;
  dinner: number;
  overnight: number;
  size?: "sm" | "xs";
  tone?: "event" | "aggregate";
}

/**
 * Same icon, same order, everywhere (event cards, day header, room list) —
 * keeps the "mismo orden de iconos" consistency requirement from the PRD.
 * A metric is only rendered when > 0, except in "aggregate" tone (day header),
 * where all metrics are always shown for a stable summary format.
 */
export function CateringSummary({
  breakfast,
  lunch,
  dinner,
  overnight,
  size = "sm",
  tone = "event",
}: CateringSummaryProps) {
  const iconSize = size === "xs" ? 12 : 14;
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";
  const showAll = tone === "aggregate";

  const items: Array<{ key: string; Icon: typeof Coffee; value: number }> = [
    { key: "breakfast", Icon: Coffee, value: breakfast },
    { key: "lunch", Icon: UtensilsCrossed, value: lunch },
    { key: "dinner", Icon: Soup, value: dinner },
  ];

  return (
    <div className={`flex items-center gap-2 ${textSize}`}>
      {items.map(({ key, Icon, value }) =>
        showAll || value > 0 ? (
          <span key={key} className="flex items-center gap-0.5">
            <Icon size={iconSize} strokeWidth={2} />
            {value}
          </span>
        ) : null,
      )}
      {(showAll || overnight > 0) && (
        <span className="flex items-center gap-0.5">
          <BedDouble size={iconSize} strokeWidth={2} />
          {overnight}
        </span>
      )}
    </div>
  );
}
