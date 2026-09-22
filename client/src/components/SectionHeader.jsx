import { ArrowUpRight } from "lucide-react";

export function SectionHeader({ eyebrow, title, action, onClick }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}
