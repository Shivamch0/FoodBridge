import { Bike, PackageCheck, Truck } from "lucide-react";
import { formatDate, statusTone } from "./dashboardData";
import { Metric } from "./Metric";
import { SectionHeader } from "./SectionHeader";
import { DeliveryCard } from "./DeliveryCard";

export function Deliveries({ deliveries, loading }) {
  const activeDeliveries = deliveries.filter(
    (delivery) =>
      !["delivered", "completed", "failed"].includes(delivery.status),
  );
  const toCard = (delivery) => ({
    title:
      delivery.donation?.foodName ||
      `Delivery ${delivery._id?.slice(-6) || "record"}`,
    route: `${delivery.deliveryMode || "Delivery"} assignment`,
    person:
      delivery.volunteer?.username ||
      delivery.organization?.organizationName ||
      delivery.volunteer ||
      delivery.organization ||
      "Assigned participant",
    status: delivery.status?.replaceAll("_", " "),
    eta: formatDate(delivery.assignedAt),
    icon:
      delivery.status === "in_transit"
        ? Bike
        : delivery.status === "completed" || delivery.status === "delivered"
          ? PackageCheck
          : Truck,
    tone: statusTone(delivery.status),
  });
  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Active routes"
          value={activeDeliveries.length}
          change="Current routes"
          icon={Truck}
          tone="coral"
        />
        <Metric
          label="In transit"
          value={
            deliveries.filter((delivery) => delivery.status === "in_transit")
              .length
          }
          change="In transit"
          icon={Bike}
          tone="mint"
        />
        <Metric
          label="Delivered this month"
          value={
            deliveries.filter((delivery) =>
              ["delivered", "completed"].includes(delivery.status),
            ).length
          }
          change="Completed routes"
          icon={PackageCheck}
          tone="blue"
        />
      </div>
      <section className="panel">
        <SectionHeader eyebrow="Delivery board" title="Moving food forward" />
        <div className="mt-5 space-y-3">
          {loading && (
            <p className="text-sm text-[#718080]">Loading deliveries...</p>
          )}
          {!loading && deliveries.length === 0 && (
            <p className="text-sm text-[#718080]">No deliveries found.</p>
          )}
          {!loading &&
            deliveries.map((delivery) => (
              <DeliveryCard key={delivery._id} delivery={toCard(delivery)} />
            ))}
        </div>
      </section>
    </div>
  );
}
