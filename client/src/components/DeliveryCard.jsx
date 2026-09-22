import { ArrowUpRight } from "lucide-react";
import { StatusPill } from "./StatusPill";

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
