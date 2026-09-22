import { ArrowUpRight, HandHeart, Truck } from "lucide-react";

export function MatchCard({ match, index }) {
  return (
    <div className="match-card">
      <div className={`avatar ${match.color} text-white`}>{match.initials}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold">{match.name}</p>
          {index === 0 && <span className="best-tag">Best fit</span>}
        </div>
        <p className="mt-1 text-xs text-[#718080]">
          {match.kind} · {match.distance}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="mini-tag">
            <HandHeart size={12} /> {match.need}
          </span>
          <span className="mini-tag">
            <Truck size={12} /> {match.transport}
          </span>
        </div>
      </div>
      <button className="icon-button">
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
