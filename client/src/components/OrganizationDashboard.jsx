import { Building2, HandHeart, MapPin, Send, Truck, X } from "lucide-react";
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
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState("volunteer");
  const requestDonation = async () => {
    setBusyId(selectedDonation._id);
    setError("");
    try {
      await createDeliveryRequest({
        donationId: selectedDonation._id,
        deliveryMode,
      });
      await onRefresh();
      setSelectedDonation(null);
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
                onClick={() => {
                  setError("");
                  setDeliveryMode("volunteer");
                  setSelectedDonation(donation);
                }}
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
      {selectedDonation && (
        <div className="modal-backdrop">
          <div className="modal-card animate-rise">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Delivery preference</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">
                  How should this food reach you?
                </h2>
                <p className="mt-2 text-sm text-[#718080]">
                  Choose who will transport {selectedDonation.foodName}.
                </p>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedDonation(null)}
                aria-label="Close delivery preference"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className={`delivery-choice ${deliveryMode === "organization" ? "delivery-choice-active" : ""}`}
                onClick={() => setDeliveryMode("organization")}
              >
                <Truck size={19} />
                <span>
                  <strong>Our organization will transport</strong>
                  <small>Use the transport saved in Settings.</small>
                </span>
              </button>
              <button
                type="button"
                className={`delivery-choice ${deliveryMode === "volunteer" ? "delivery-choice-active" : ""}`}
                onClick={() => setDeliveryMode("volunteer")}
              >
                <HandHeart size={19} />
                <span>
                  <strong>We need a volunteer</strong>
                  <small>Notify an available volunteer.</small>
                </span>
              </button>
            </div>
            {error && <p className="auth-error mt-4">{error}</p>}
            <div className="mt-7 flex justify-end gap-3">
              <button
                className="button-quiet"
                onClick={() => setSelectedDonation(null)}
              >
                Cancel
              </button>
              <button
                className="button-primary"
                disabled={busyId === selectedDonation._id}
                onClick={requestDonation}
              >
                <Send size={15} />{" "}
                {busyId === selectedDonation._id
                  ? "Requesting..."
                  : "Confirm request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
