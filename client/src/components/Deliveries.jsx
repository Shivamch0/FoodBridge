import { Bike, PackageCheck, Truck } from "lucide-react";
import { deliveries } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { DeliveryCard } from "./DeliveryCard";

export function Deliveries() {
  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Active routes"
          value="03"
          change="1 needs attention"
          icon={Truck}
          tone="coral"
        />
        <Metric
          label="In transit"
          value="01"
          change="ETA 12 minutes"
          icon={Bike}
          tone="mint"
        />
        <Metric
          label="Delivered this month"
          value="42"
          change="96% confirmed"
          icon={PackageCheck}
          tone="blue"
        />
      </div>
      <section className="panel">
        <SectionHeader eyebrow="Delivery board" title="Moving food forward" />
        <div className="mt-5 space-y-3">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.title} delivery={delivery} />
          ))}
        </div>
      </section>
    </div>
  );
}
