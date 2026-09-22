import { HandHeart, ShieldCheck, Users } from "lucide-react";
import { CommunityStat } from "./CommunityStat";

export function Community({ donations, deliveries, deliveryRequests }) {
  const completedDeliveries = deliveries.filter((delivery) =>
    ["delivered", "completed"].includes(delivery.status),
  ).length;
  const activeVolunteers = new Set(
    deliveries
      .map((delivery) => delivery.volunteer?._id || delivery.volunteer)
      .filter(Boolean),
  ).size;
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
          {
            new Set(
              deliveries
                .map(
                  (delivery) =>
                    delivery.organization?._id || delivery.organization,
                )
                .filter(Boolean),
            ).size
          }
          <span>connected organizations</span>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        <CommunityStat
          icon={Users}
          number={activeVolunteers}
          label="active volunteers"
          text="People giving time this week"
        />
        <CommunityStat
          icon={ShieldCheck}
          number={
            new Set(
              deliveryRequests
                .map((request) => request.requester?._id || request.requester)
                .filter(Boolean),
            ).size
          }
          label="requesting organizations"
          text="Organizations using the network"
        />
        <CommunityStat
          icon={HandHeart}
          number={completedDeliveries}
          label="completed deliveries"
          text={`${donations.length} donations currently tracked`}
        />
      </div>
    </div>
  );
}
