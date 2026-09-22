import { matches } from "./dashboardData";
import { SectionHeader } from "./SectionHeader";
import { MatchCard } from "./MatchCard";

export function MatchingHub() {
  return (
    <div className="animate-rise space-y-6">
      <section className="match-banner">
        <div>
          <p className="eyebrow text-[#a7d7c5]">Progressive matching</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
            The right food, the right place.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c2d5cc]">
            Your current donation is being matched in expanding circles.
            FoodBridge prioritizes distance, transport, and urgency.
          </p>
        </div>
        <div className="radius-display">
          <span className="text-4xl font-bold">2.4</span>
          <span className="text-xs text-[#acd4c5]">km radius</span>
        </div>
      </section>
      <section className="panel">
        <SectionHeader eyebrow="Best matches" title="3 organizations nearby" />
        <div className="mt-4 space-y-3">
          {matches.map((match, index) => (
            <MatchCard key={match.name} match={match} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
