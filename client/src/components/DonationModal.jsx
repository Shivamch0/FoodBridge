import { Check, HandHeart, MapPin, Truck, X } from "lucide-react";
import { useState } from "react";
import { createDonation } from "../api/donation.api.js";

export function DonationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    foodName: "",
    foodType: "",
    description: "",
    quantity: "",
    unit: "Meals",
    preparedAt: "",
    expiresAt: "",
    pickupLocation: "",
    deliveryPreference: "organization_or_volunteer",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (!navigator.geolocation)
        throw new Error("Location is not supported by this browser.");
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          resolve,
          () =>
            reject(
              new Error(
                "Location permission is required to create a donation.",
              ),
            ),
          { enableHighAccuracy: true, timeout: 10000 },
        ),
      );
      await createDonation({
        ...form,
        quantity: Number(form.quantity),
        preparedAt: new Date(form.preparedAt).toISOString(),
        expiresAt: new Date(form.expiresAt).toISOString(),
        pickupLocation: {
          type: "Point",
          coordinates: [position.coords.longitude, position.coords.latitude],
        },
      });
      await onCreated?.();
      onClose();
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Unable to create donation.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card animate-rise">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">New contribution</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">
              Share what you have.
            </h2>
            <p className="mt-2 text-sm text-[#718080]">
              We’ll find the closest verified organization.
            </p>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close donation form"
          >
            <X size={18} />
          </button>
        </div>
        <form
          className="modal-form mt-7 grid gap-4 sm:grid-cols-2"
          onSubmit={submit}
        >
          <label className="field-label sm:col-span-2">
            Food name
            <input
              className="field"
              name="foodName"
              value={form.foodName}
              onChange={update}
              placeholder="e.g. Conference lunch boxes"
              required
            />
          </label>
          <label className="field-label">
            Food type
            <input
              className="field"
              name="foodType"
              value={form.foodType}
              onChange={update}
              placeholder="Prepared meals"
              required
            />
          </label>
          <label className="field-label sm:col-span-2">
            Description
            <textarea
              className="field min-h-20 resize-y"
              name="description"
              value={form.description}
              onChange={update}
              placeholder="Add details about the food, packaging, or serving instructions"
              rows="3"
            />
          </label>
          <label className="field-label">
            Quantity
            <input
              className="field"
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={update}
              placeholder="120"
              required
            />
          </label>
          <label className="field-label">
            Unit
            <select
              className="field"
              name="unit"
              value={form.unit}
              onChange={update}
            >
              <option>Meals</option>
              <option>Kg</option>
              <option>Crates</option>
            </select>
          </label>
          <label className="field-label">
            Prepared at
            <input
              className="field"
              name="preparedAt"
              type="datetime-local"
              value={form.preparedAt}
              onChange={update}
              required
            />
          </label>
          <label className="field-label">
            Expires at
            <input
              className="field"
              name="expiresAt"
              type="datetime-local"
              value={form.expiresAt}
              onChange={update}
              required
            />
          </label>
          <label className="field-label sm:col-span-2">
            Pickup location (current device location)
            <div className="relative">
              <MapPin className="field-icon" size={17} />
              <input
                className="field pl-10"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={update}
                placeholder="Location label"
              />
            </div>
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="field-label">
              How should this donation be delivered?
            </legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <label
                className={`delivery-choice ${form.deliveryPreference === "self_delivery" ? "delivery-choice-active" : ""}`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="deliveryPreference"
                  value="self_delivery"
                  checked={form.deliveryPreference === "self_delivery"}
                  onChange={update}
                />
                <Truck size={19} />
                <span>
                  <strong>I will deliver it</strong>
                  <small>I can transport this donation myself.</small>
                </span>
              </label>
              <label
                className={`delivery-choice ${form.deliveryPreference === "organization_or_volunteer" ? "delivery-choice-active" : ""}`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="deliveryPreference"
                  value="organization_or_volunteer"
                  checked={
                    form.deliveryPreference === "organization_or_volunteer"
                  }
                  onChange={update}
                />
                <HandHeart size={19} />
                <span>
                  <strong>Organization or volunteer</strong>
                  <small>Let the network coordinate delivery.</small>
                </span>
              </label>
            </div>
          </fieldset>
          {error && (
            <p className="auth-error sm:col-span-2" role="alert">
              {error}
            </p>
          )}
          <div className="mt-7 flex justify-end gap-3 sm:col-span-2">
            <button type="button" className="button-quiet" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={saving}>
              {saving ? (
                "Creating..."
              ) : (
                <>
                  <Check size={16} /> Create donation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
