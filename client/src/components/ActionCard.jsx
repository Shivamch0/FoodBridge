import { ArrowUpRight } from "lucide-react";

export function ActionCard({ icon: Icon, title, text, action, tone }) {
  return (
    <div className={`action-card action-${tone}`}>
      <div className="flex items-center gap-3">
        <span className="action-icon">
          <Icon size={17} />
        </span>
        <p className="text-sm font-bold leading-5">{title}</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#687674]">{text}</p>
      <button className="mt-4 text-xs font-bold text-[#315d53]">
        {action} <ArrowUpRight size={13} className="inline" />
      </button>
    </div>
  );
}
