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
import { donationToRow } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { DonationRow } from "./DonationRow";
import { ActionCard } from "./ActionCard";

export function Overview({
  setActivePage,
  setShowDonationForm,
  donations,
  deliveryRequests,
  loading,
}) {
  const activeDonations = donations.filter(
    (donation) =>
      !["cancelled", "expired", "completed"].includes(donation.status),
  );
  const mealsShared = donations.reduce(
    (total, donation) => total + Number(donation.quantity || 0),
    0,
  );
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
            Your food donations help connect surplus with nearby organizations.
            The local network is moving quickly today.
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
          label="Total donations"
          value={donations.length}
          change="From your account"
          icon={HandHeart}
          tone="yellow"
        />
        <Metric
          label="Active donations"
          value={activeDonations.length}
          change="Current status"
          icon={Compass}
          tone="mint"
        />
        <Metric
          label="Meals shared"
          value={mealsShared}
          change="Across all donations"
          icon={ShieldCheck}
          tone="blue"
        />
        <Metric
          label="Delivery requests"
          value={deliveryRequests.length}
          change="From the network"
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
          {loading && (
            <p className="p-2 text-sm text-[#718080]">Loading donations...</p>
          )}
          {!loading && donations.length === 0 && (
            <p className="p-2 text-sm text-[#718080]">No donations found.</p>
          )}
          {!loading &&
            donations
              .slice(0, 3)
              .map((donation) => (
                <DonationRow key={donation._id} row={donationToRow(donation)} />
              ))}
        </div>
      </section>
      <section className="panel">
        <SectionHeader
          eyebrow="Needs your attention"
          title="A little help goes a long way"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {deliveryRequests.length === 0 && (
            <p className="text-sm text-[#718080]">
              No delivery requests found.
            </p>
          )}
          {deliveryRequests.slice(0, 3).map((request) => (
            <ActionCard
              key={request._id}
              icon={Truck}
              title={`Delivery request: ${request.status || "pending"}`}
              text={
                request.donation?.foodName ||
                "A donation needs delivery coordination."
              }
              action="Open deliveries"
              tone="coral"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
