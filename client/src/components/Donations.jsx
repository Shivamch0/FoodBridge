import {
  Box,
  Clock3,
  HandHeart,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { donationToRow } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { StatusPill } from "./StatusPill";

export function Donations({ setShowDonationForm, donations, loading }) {
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
                        {row.place}
                      </td>
                      <td className="py-4 text-sm text-[#536363]">
                        {row.time}
                      </td>
                      <td className="py-4">
                        <StatusPill label={row.status} tone={row.tone} />
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
