import { Check, MapPin, X } from "lucide-react";

export function DonationModal({ onClose }) {
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
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="field-label sm:col-span-2">
            Food name
            <input
              className="field"
              placeholder="e.g. Conference lunch boxes"
            />
          </label>
          <label className="field-label">
            Quantity
            <input className="field" placeholder="120" />
          </label>
          <label className="field-label">
            Unit
            <select className="field">
              <option>Meals</option>
              <option>Kg</option>
              <option>Crates</option>
            </select>
          </label>
          <label className="field-label">
            Pickup date
            <input className="field" type="date" />
          </label>
          <label className="field-label">
            Pickup time
            <input className="field" type="time" />
          </label>
          <label className="field-label sm:col-span-2">
            Pickup location
            <div className="relative">
              <MapPin className="field-icon" size={17} />
              <input className="field pl-10" placeholder="Search an address" />
            </div>
          </label>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button className="button-quiet" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={onClose}>
            <Check size={16} /> Create donation
          </button>
        </div>
      </div>
    </div>
  );
}
