import {
  Box,
  Clock3,
  HandHeart,
  Trash2,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cancelDonation } from "../api/donation.api.js";
import { donationToRow } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { StatusPill } from "./StatusPill";
import { LocationName } from "./LocationName";

function DonationTimer({ preparedAt, expiresAt }) {
  const [now, setNow] = useState(() => new Date(preparedAt).getTime());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
  const total = Math.max(
    1,
    new Date(expiresAt).getTime() - new Date(preparedAt).getTime(),
  );
  const elapsed = Math.min(
    total,
    Math.max(0, now - new Date(preparedAt).getTime()),
  );
  const percent = Math.min(100, Math.round((elapsed / total) * 100));
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return (
    <div className="mt-2 min-w-36">
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e5e7df]">
        <div
          className="h-full bg-[#d97757] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-[#718080]">
        {remaining ? `${hours}h ${minutes}m ${seconds}s remaining` : "Expired"}
      </p>
    </div>
  );
}

export function Donations({
  setShowDonationForm,
  donations,
  onCancel,
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
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="All donations"
          value={donations.length}
          change="From your account"
          icon={Box}
          tone="yellow"
        />
        <Metric
          label="Currently active"
          value={activeDonations.length}
          change="Current status"
          icon={Clock3}
          tone="coral"
        />
        <Metric
          label="Meals shared"
          value={mealsShared}
          change="Across all donations"
          icon={HandHeart}
          tone="mint"
        />
      </div>
      <section className="panel">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SectionHeader eyebrow="Donation ledger" title="All food shared" />
          <div className="flex gap-2">
            <button className="filter-button">
              <Search size={15} /> Search
            </button>
            <button className="filter-button">
              All statuses <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <tbody>
              {loading && (
                <tr>
                  <td className="py-4 text-sm text-[#718080]" colSpan="5">
                    Loading donations...
                  </td>
                </tr>
              )}
              {!loading && donations.length === 0 && (
                <tr>
                  <td className="py-4 text-sm text-[#718080]" colSpan="5">
                    No donations found.
                  </td>
                </tr>
              )}
              {!loading &&
                donations.map((donation) => {
                  const row = donationToRow(donation);
                  const canCancel = [
                    "available",
                    "searching",
                    "temporarily_reserved",
                  ].includes(donation.status);
                  return (
                    <tr
                      key={donation._id}
                      className="border-b border-[#edf0e8]"
                    >
                      <td className="py-4">
                        <p className="font-bold">{row.name}</p>
                        <p className="mt-1 text-xs text-[#718080]">
                          {row.type}
                        </p>
                      </td>
                      <td className="py-4 text-sm">{row.quantity}</td>
                      <td className="py-4 text-sm text-[#536363]">
                        <LocationName
                          coordinates={donation.pickupLocation?.coordinates}
                        />
                      </td>
                      <td className="py-4 text-sm text-[#536363]">
                        {row.time}
                      </td>
                      <td className="py-4">
                        <StatusPill label={row.status} tone={row.tone} />
                        {canCancel && (
                          <DonationTimer
                            preparedAt={donation.preparedAt}
                            expiresAt={donation.expiresAt}
                          />
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {canCancel && (
                          <button
                            className="icon-button text-[#b96650]"
                            title="Cancel donation"
                            onClick={async () => {
                              await cancelDonation(donation._id);
                              await onCancel();
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
      <button
        className="button-primary"
        onClick={() => setShowDonationForm(true)}
      >
        <Plus size={17} /> Add another donation
      </button>
    </div>
  );
}
