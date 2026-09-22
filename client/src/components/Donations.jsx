import {
  Box,
  Clock3,
  HandHeart,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { donationRows } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { StatusPill } from "./StatusPill";

export function Donations({ setShowDonationForm }) {
  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="All donations"
          value="24"
          change="This quarter"
          icon={Box}
          tone="yellow"
        />
        <Metric
          label="Currently active"
          value="08"
          change="2 need action"
          icon={Clock3}
          tone="coral"
        />
        <Metric
          label="Meals shared"
          value="1,248"
          change="+18.6% vs last month"
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
              {donationRows.map((row) => (
                <tr key={row.name} className="border-b border-[#edf0e8]">
                  <td className="py-4">
                    <p className="font-bold">{row.name}</p>
                    <p className="mt-1 text-xs text-[#718080]">{row.type}</p>
                  </td>
                  <td className="py-4 text-sm">{row.quantity}</td>
                  <td className="py-4 text-sm text-[#536363]">{row.place}</td>
                  <td className="py-4 text-sm text-[#536363]">{row.time}</td>
                  <td className="py-4">
                    <StatusPill label={row.status} tone={row.tone} />
                  </td>
                </tr>
              ))}
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
