import { Building2, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { createDeliveryRequest } from "../api/deliveryRequest.api.js";

export function OrganizationDashboard({
  donations,
  requests,
  loading,
  onRefresh,
}) {
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const requestDonation = async (donationId) => {
    setBusyId(donationId);
    setError("");
    try {
      await createDeliveryRequest({ donationId });
      await onRefresh();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to request this donation.",
      );
    } finally {
      setBusyId("");
    }
  };
  const requested = new Set(
    requests.map((request) => request.donation?._id || request.donation),
  );
  return (
    <div className="animate-rise space-y-6">
      <section className="match-banner">
        <div>
          <p className="eyebrow text-[#a7d7c5]">Organization workspace</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
            Find food nearby.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c2d5cc]">
            Browse available donations and request the food your organization
            can distribute.
          </p>
        </div>
        <Building2 size={48} className="text-[#a7d7c5]" />
      </section>
      <section className="panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Available now</p>
            <h2 className="font-display text-2xl tracking-[-0.035em]">
              Nearby donations
            </h2>
          </div>
          <MapPin size={20} className="text-[#d97757]" />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {loading && (
            <p className="text-sm text-[#718080]">
              Loading available donations...
            </p>
          )}
          {!loading && donations.length === 0 && (
            <p className="text-sm text-[#718080]">
              No donations are currently available.
            </p>
          )}
          {donations.map((donation) => (
            <article key={donation._id} className="match-card">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{donation.foodName}</p>
                <p className="mt-1 text-xs text-[#718080]">
                  {donation.foodType} · {donation.quantity} {donation.unit}
                </p>
                <p className="mt-2 text-xs text-[#718080]">
                  Expires {new Date(donation.expiresAt).toLocaleString()}
                </p>
              </div>
              <button
                className="button-primary"
                disabled={
                  busyId === donation._id || requested.has(donation._id)
                }
                onClick={() => requestDonation(donation._id)}
              >
                {requested.has(donation._id) ? (
                  "Requested"
                ) : busyId === donation._id ? (
                  "Requesting..."
                ) : (
                  <>
                    <Send size={14} /> Request
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
        {error && <p className="auth-error mt-4">{error}</p>}
      </section>
    </div>
  );
}
