import { HandHeart, ShieldCheck, Users } from "lucide-react";
import { CommunityStat } from "./CommunityStat";

export function Community() {
  return (
    <div className="animate-rise space-y-6">
      <section className="community-hero">
        <div className="relative z-10 max-w-lg">
          <p className="eyebrow text-[#ffe0a5]">People make the bridge</p>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">
            A network with a pulse.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#d0ddd7]">
            FoodBridge brings local kitchens, donors, organizations, and
            volunteers into one visible, generous loop.
          </p>
        </div>
        <div className="community-number">
          18<span>partner organizations</span>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        <CommunityStat
          icon={Users}
          number="64"
          label="active volunteers"
          text="People giving time this week"
        />
        <CommunityStat
          icon={ShieldCheck}
          number="18"
          label="trusted organizations"
          text="Verified places serving locally"
        />
        <CommunityStat
          icon={HandHeart}
          number="4.8k"
          label="meals redirected"
          text="A growing community impact"
        />
      </div>
    </div>
  );
}
