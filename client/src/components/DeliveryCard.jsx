import { ArrowUpRight } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { LocationName } from "./LocationName";

export function DeliveryCard({ delivery }) {
  const Icon = delivery.icon;
  return (
    <div className="delivery-card">
      <div className={`delivery-icon delivery-${delivery.tone}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">{delivery.title}</p>
          <StatusPill label={delivery.status} tone={delivery.tone} />
        </div>
        <p className="mt-1 text-xs text-[#718080]">{delivery.route}</p>
        <p className="mt-3 text-xs font-semibold text-[#536363]">
          {delivery.person}
        </p>
        {(delivery.organization || delivery.volunteer) && (
          <div className="mt-2 space-y-1 text-xs text-[#718080]">
            {delivery.organization?.location?.coordinates && (
              <p>
                Organization location:{" "}
                <LocationName
                  coordinates={delivery.organization.location.coordinates}
                />
              </p>
            )}
            {delivery.organization && (
              <p>
                Organization:{" "}
                {delivery.organization.organizationName ||
                  delivery.organization.username}{" "}
                · {delivery.organization.phoneNumber || "Contact available"}
              </p>
            )}
            {delivery.volunteer && (
              <p>
                Volunteer: {delivery.volunteer.username} ·{" "}
                {delivery.volunteer.phoneNumber || "Contact available"}
                {delivery.volunteer.location?.coordinates ? (
                  <>
                    {" "}
                    ·{" "}
                    <LocationName
                      coordinates={delivery.volunteer.location.coordinates}
                    />
                  </>
                ) : (
                  ""
                )}
              </p>
            )}
            {delivery.donation?.donor && (
              <p>
                Donor: {delivery.donation.donor.username} ·{" "}
                {delivery.donation.donor.phoneNumber || "Contact available"}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-bold">{delivery.eta}</p>
        <p className="mt-1 text-xs text-[#87918e]">next update</p>
      </div>
      <button className="icon-button">
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
