import { MapPin, Save } from "lucide-react";
import { useState } from "react";
import { updateCurrentUser } from "../api/auth.api.js";

const organizationTypes = [
  ["ngo", "NGO"],
  ["gurudwara", "Gurudwara"],
  ["temple", "Temple"],
  ["mosque", "Mosque"],
  ["church", "Church"],
  ["community_kitchen", "Community kitchen"],
  ["shelter", "Shelter"],
  ["orphanage", "Orphanage"],
  ["old_age_home", "Old age home"],
  ["other", "Other"],
];

export function ProfileSettings({ user, onUpdated }) {
  const [form, setForm] = useState({
    username: user?.username || "",
    phoneNumber: user?.phoneNumber || "",
    organizationName: user?.organizationName || "",
    organizationType: user?.organizationType || "",
    hasTransport: Boolean(user?.hasTransport),
    isAvailable: Boolean(user?.isAvailable),
    transportDetails: {
      vehicleType: user?.transportDetails?.vehicleType || "",
      capacity: user?.transportDetails?.capacity || "",
    },
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
    },
  });
  const [refreshLocation, setRefreshLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateNested = (section) => (event) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [event.target.name]: event.target.value,
      },
    }));
  };

  const getLocation = () => new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      () => reject(new Error("Location permission is required to update your location.")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const location = refreshLocation
        ? await getLocation().then(({ coords }) => ({
          type: "Point",
          coordinates: [coords.longitude, coords.latitude],
        }))
        : user?.location;
      const response = await updateCurrentUser({
        ...form,
        transportDetails: {
          ...form.transportDetails,
          capacity: form.transportDetails.capacity === "" ? undefined : Number(form.transportDetails.capacity),
        },
        location,
      });
      onUpdated(response.data);
      setRefreshLocation(false);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.response?.data?.message || saveError.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-rise space-y-6">
      <section className="panel">
        <p className="eyebrow">Account settings</p>
        <h2 className="mt-1 font-display text-2xl tracking-[-0.035em]">Update your profile</h2>
        <p className="mt-2 text-sm text-[#718080]">Keep your contact, address, transport, and matching details current.</p>
        <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={save}>
          <div className="sm:col-span-2">
            <p className="mb-3 text-sm font-bold">Basic details</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">Name<input className="field" name="username" value={form.username} onChange={update} required /></label>
              <label className="field-label">Phone number<input className="field" name="phoneNumber" value={form.phoneNumber} onChange={update} required /></label>
            </div>
          </div>

          {user?.role === "organization" && <div className="sm:col-span-2"><p className="mb-3 text-sm font-bold">Organization details</p><div className="grid gap-4 sm:grid-cols-2"><label className="field-label">Organization name<input className="field" name="organizationName" value={form.organizationName} onChange={update} required /></label><label className="field-label">Organization type<select className="field" name="organizationType" value={form.organizationType} onChange={update} required><option value="">Select type</option>{organizationTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div></div>}
          {(user?.role === "organization" || user?.role === "volunteer") && <div className="sm:col-span-2"><p className="mb-3 text-sm font-bold">Availability and transport</p><div className="grid gap-4 sm:grid-cols-2"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="hasTransport" checked={form.hasTransport} onChange={update} /> I have transport</label>{user?.role === "volunteer" && <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={update} /> Available for deliveries</label>}</div>{form.hasTransport && <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="field-label">Vehicle type<input className="field" name="vehicleType" value={form.transportDetails.vehicleType} onChange={updateNested("transportDetails")} placeholder="Van, car, bike" /></label><label className="field-label">Transport capacity<input className="field" name="capacity" type="number" min="1" value={form.transportDetails.capacity} onChange={updateNested("transportDetails")} placeholder="Number of meals" /></label></div>}</div>}

          <div className="sm:col-span-2"><p className="mb-3 text-sm font-bold"><MapPin size={15} className="mr-1 inline" />Address</p><div className="grid gap-4 sm:grid-cols-2"><label className="field-label sm:col-span-2">Street<input className="field" name="street" value={form.address.street} onChange={updateNested("address")} placeholder="Street and building" /></label><label className="field-label">City<input className="field" name="city" value={form.address.city} onChange={updateNested("address")} placeholder="City" /></label><label className="field-label">State<input className="field" name="state" value={form.address.state} onChange={updateNested("address")} placeholder="State" /></label><label className="field-label">Pincode<input className="field" name="pincode" value={form.address.pincode} onChange={updateNested("address")} placeholder="Pincode" /></label></div></div>

          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={refreshLocation} onChange={(event) => setRefreshLocation(event.target.checked)} /> Update map location from this device</label>
          {message && <p className="text-sm text-[#1d6b5d] sm:col-span-2">{message}</p>}
          {error && <p className="auth-error sm:col-span-2">{error}</p>}
          <button className="button-primary sm:col-span-2 sm:justify-self-start" disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save profile"}</button>
        </form>
      </section>
    </div>
  );
}