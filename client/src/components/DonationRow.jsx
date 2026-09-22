import { ArrowUpRight, Box } from "lucide-react";
import { StatusPill } from "./StatusPill";

export function DonationRow({ row }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#f7f5ef]">
      <div className={`row-icon row-${row.tone}`}>
        <Box size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{row.name}</p>
        <p className="mt-1 truncate text-xs text-[#718080]">
          {row.quantity} · {row.place}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-xs font-semibold">{row.time}</p>
        <div className="mt-1">
          <StatusPill label={row.status} tone={row.tone} />
        </div>
      </div>
      <ArrowUpRight size={16} className="text-[#9ba6a0]" />
    </div>
  );
}
