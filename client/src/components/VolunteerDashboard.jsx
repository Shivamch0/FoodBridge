import { CheckCircle2, HandHelping, MapPin, Power, X } from "lucide-react";
import { useState } from "react";
import {
  acceptVolunteerRequest,
  rejectVolunteerRequest,
} from "../api/deliveryRequest.api.js";

export function VolunteerDashboard({
  donations,
  requests,
  notifications = [],
  isAvailable,
  onAvailabilityChange,
  loading,
  onRefresh,
}) {
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [availabilityBusy, setAvailabilityBusy] = useState(false);
  const [availabilityState, setAvailabilityState] = useState(isAvailable);
  const notificationRequests = notifications
    .filter(
      (notification) =>
        notification.type === "volunteer_needed" && notification.request,
    )
    .map((notification) => ({
      _id: notification.request,
      donation: { foodName: notification.message },
      expiresAt: notification.createdAt,
    }));
  const requestIds = new Set(requests.map((request) => String(request._id)));
  const visibleRequests = [
    ...requests,
    ...notificationRequests.filter(
      (request) => !requestIds.has(String(request._id)),
    ),
  ];
  const accept = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await acceptVolunteerRequest(id);
      await onRefresh();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to accept this delivery.",
      );
    } finally {
      setBusyId("");
    }
  };
  const reject = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await rejectVolunteerRequest(id);
      await onRefresh();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to reject this delivery.",
      );
    } finally {
      setBusyId("");
    }
  };
  const toggleAvailability = async () => {
    const nextAvailability = !availabilityState;
    setAvailabilityBusy(true);
    setError("");
    setAvailabilityState(nextAvailability);
    try {
      const updatedUser = await onAvailabilityChange(nextAvailability);
      setAvailabilityState(Boolean(updatedUser.isAvailable));
    } catch (toggleError) {
      setAvailabilityState(!nextAvailability);
      setError(
        toggleError.response?.data?.message || "Unable to update availability.",
      );
    } finally {
      setAvailabilityBusy(false);
    }
  };
  return (
    <div className="animate-rise space-y-6">
      <section className="match-banner">
        <div>
          <p className="eyebrow text-[#a7d7c5]">Volunteer workspace</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
            Help move food forward.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c2d5cc]">
            See open delivery requests and accept a route that you can complete.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <HandHelping size={48} className="text-[#a7d7c5]" />
          <button
            className={`availability-toggle ${availabilityState ? "availability-toggle-on" : ""}`}
            onClick={toggleAvailability}
            disabled={availabilityBusy}
            aria-pressed={availabilityState}
          >
            <Power size={15} />{" "}
            {availabilityBusy
              ? "Updating..."
              : availabilityState
                ? "Available for deliveries"
                : "Unavailable for deliveries"}
          </button>
        </div>
      </section>
      <section className="panel">
        <p className="eyebrow">Open requests</p>
        <h2 className="font-display text-2xl tracking-[-0.035em]">
          Deliveries needing help
        </h2>
        <div className="mt-5 space-y-3">
          {loading && (
            <p className="text-sm text-[#718080]">
              Loading delivery requests...
            </p>
          )}
          {!loading && visibleRequests.length === 0 && (
            <p className="text-sm text-[#718080]">
              No open delivery requests right now.
            </p>
          )}
          {visibleRequests.map((request) => (
            <article key={request._id} className="delivery-card">
              <div className="delivery-icon delivery-mint">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {request.donation?.foodName || "Food pickup request"}
                </p>
                <p className="mt-1 text-xs text-[#718080]">
                  Expires{" "}
                  {request.expiresAt
                    ? new Date(request.expiresAt).toLocaleString()
                    : "soon"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="button-primary"
                  disabled={busyId === request._id}
                  onClick={() => accept(request._id)}
                >
                  {busyId === request._id ? (
                    "Working..."
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Accept
                    </>
                  )}
                </button>
                <button
                  className="button-quiet"
                  disabled={busyId === request._id}
                  onClick={() => reject(request._id)}
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
        {error && <p className="auth-error mt-4">{error}</p>}
      </section>
      <section className="panel">
        <p className="eyebrow">Nearby food</p>
        <h2 className="font-display text-2xl tracking-[-0.035em]">
          Active donations
        </h2>
        <p className="mt-2 text-sm text-[#718080]">
          These donations are available near your saved location. An
          organization must request one before a delivery can be accepted.
        </p>
        <div className="mt-5 space-y-3">
          {loading && (
            <p className="text-sm text-[#718080]">
              Loading nearby donations...
            </p>
          )}
          {!loading && donations.length === 0 && (
            <p className="text-sm text-[#718080]">
              No nearby active donations right now.
            </p>
          )}
          {donations.map((donation) => (
            <article key={donation._id} className="delivery-card">
              <div className="delivery-icon delivery-mint">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{donation.foodName}</p>
                <p className="mt-1 text-xs text-[#718080]">
                  {donation.foodType} · {donation.quantity} {donation.unit}
                </p>
                <p className="mt-1 text-xs text-[#718080]">
                  Available until{" "}
                  {new Date(donation.expiresAt).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
