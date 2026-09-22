import {
  ArrowUpRight,
  Compass,
  HandHeart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { donationRows } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { DonationRow } from "./DonationRow";
import { ActionCard } from "./ActionCard";

export function Overview({ setActivePage, setShowDonationForm }) {
  return (
    <div className="space-y-6 animate-rise">
      <section className="hero-panel">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-[#ffe0a5]">
            <Sparkles size={16} /> Your impact, in motion
          </div>
          <h2 className="mt-5 max-w-lg font-display text-4xl leading-[0.96] tracking-[-0.045em] text-[#fffdf6] sm:text-5xl">
            Every meal finds a way forward.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#c1d1cb]">
            You have helped redirect{" "}
            <strong className="text-white">1,248 meals</strong> this month. The
            local network is moving quickly today.
          </p>
          <button
            className="button-light mt-7"
            onClick={() => setShowDonationForm(true)}
          >
            Share surplus <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="hero-orbit">
          <div className="orbit-center">
            <HandHeart size={25} />
          </div>
          <div className="orbit-dot orbit-dot-one">
            <MapPin size={15} />
          </div>
          <div className="orbit-dot orbit-dot-two">
            <Truck size={15} />
          </div>
          <div className="orbit-dot orbit-dot-three">
            <Users size={15} />
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Meals redirected"
          value="1,248"
          change="+18.6%"
          icon={HandHeart}
          tone="yellow"
        />
        <Metric
          label="Active matches"
          value="08"
          change="03 need action"
          icon={Compass}
          tone="mint"
        />
        <Metric
          label="Success rate"
          value="94.2%"
          change="Last 30 days"
          icon={ShieldCheck}
          tone="blue"
        />
        <Metric
          label="Network reach"
          value="12.4 km"
          change="Across 18 partners"
          icon={MapPin}
          tone="coral"
        />
      </div>
      <section className="panel">
        <SectionHeader
          eyebrow="Live pulse"
          title="Your active donations"
          action="View all"
          onClick={() => setActivePage("donations")}
        />
        <div className="mt-5 space-y-1">
          {donationRows.slice(0, 3).map((row) => (
            <DonationRow key={row.name} row={row} />
          ))}
        </div>
      </section>
      <section className="panel">
        <SectionHeader
          eyebrow="Needs your attention"
          title="A little help goes a long way"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <ActionCard
            icon={Truck}
            title="1 pickup needs a volunteer"
            text="Conference lunch boxes · 2:00 PM"
            action="Find a volunteer"
            tone="coral"
          />
          <ActionCard
            icon={Compass}
            title="2 donations expire soon"
            text="Review before the 6 hour window closes"
            action="Review timing"
            tone="yellow"
          />
          <ActionCard
            icon={Users}
            title="Welcome a new partner"
            text="3 organizations are nearby today"
            action="Explore network"
            tone="mint"
          />
        </div>
      </section>
    </div>
  );
}
