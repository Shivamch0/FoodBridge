import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export function AuthForm({ mode, onSubmit, error, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "donor",
    organizationName: "",
    organizationType: "community_kitchen",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const updateAddress = (event) =>
    setForm((current) => ({
      ...current,
      address: { ...current.address, [event.target.name]: event.target.value },
    }));

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Location is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          resolve({
            type: "Point",
            coordinates: [coords.longitude, coords.latitude],
          }),
        () =>
          reject(
            new Error(
              "Location permission is required to create your account.",
            ),
          ),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    });

  const submit = async (event) => {
    event.preventDefault();
    setLocationError("");

    if (!isSignup) {
      onSubmit(form);
      return;
    }

    setLocationLoading(true);
    try {
      const location = await getLocation();
      await onSubmit({ ...form, location });
    } catch (submitError) {
      setLocationError(submitError.message);
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={submit}>
      {isSignup && (
        <Field label="Your name" icon={UserRound}>
          <input
            className="auth-field"
            name="username"
            value={form.username}
            onChange={update}
            placeholder="Anika Sharma"
            required
            minLength={2}
          />
        </Field>
      )}
      <Field label="Email address" icon={Mail}>
        <input
          className="auth-field"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          placeholder="you@example.com"
          required
        />
      </Field>
      {isSignup && (
        <>
          <div className="auth-form-section">
            <p className="auth-section-title">
              <MapPin size={15} /> Permanent address
            </p>
            <div className="auth-address-grid">
              <input
                className="auth-field"
                name="street"
                value={form.address.street}
                onChange={updateAddress}
                placeholder="Street and building"
                required
              />
              <input
                className="auth-field"
                name="city"
                value={form.address.city}
                onChange={updateAddress}
                placeholder="City"
                required
              />
              <input
                className="auth-field"
                name="state"
                value={form.address.state}
                onChange={updateAddress}
                placeholder="State"
                required
              />
              <input
                className="auth-field"
                name="pincode"
                value={form.address.pincode}
                onChange={updateAddress}
                placeholder="Pincode"
                required
              />
            </div>
          </div>
          <Field label="Phone number">
            <input
              className="auth-field"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={update}
              placeholder="9876543210"
              required
            />
          </Field>
          <label className="auth-label">
            I am joining as
            <select
              className="auth-field"
              name="role"
              value={form.role}
              onChange={update}
            >
              <option value="donor">Food donor</option>
              <option value="organization">Organization</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </label>
        </>
      )}
      {isSignup && form.role === "organization" && (
        <>
          <Field label="Organization name">
            <input
              className="auth-field"
              name="organizationName"
              value={form.organizationName}
              onChange={update}
              placeholder="Asha Community Kitchen"
              required
            />
          </Field>
          <label className="auth-label">
            Organization type
            <select
              className="auth-field"
              name="organizationType"
              value={form.organizationType}
              onChange={update}
            >
              <option value="community_kitchen">Community kitchen</option>
              <option value="ngo">NGO</option>
              <option value="shelter">Shelter</option>
              <option value="gurudwara">Gurudwara</option>
              <option value="other">Other</option>
            </select>
          </label>
        </>
      )}
      <Field label="Password" icon={LockKeyhole}>
        <div className="relative">
          <input
            className="auth-field pr-11"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={update}
            placeholder={isSignup ? "At least 8 characters" : "Your password"}
            required
            minLength={isSignup ? 8 : undefined}
          />
          <button
            type="button"
            className="auth-eye"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </Field>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {locationError && (
        <p className="auth-error" role="alert">
          {locationError}
        </p>
      )}
      <button className="auth-submit" disabled={loading || locationLoading}>
        {loading || locationLoading ? (
          <LoaderCircle className="animate-spin" size={17} />
        ) : null}
        {isSignup ? "Create my account" : "Sign in to FoodBridge"}
      </button>
      {!isSignup && (
        <button type="button" className="auth-forgot">
          Forgot password?
        </button>
      )}
    </form>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="auth-label">
      {label}
      <div className="relative">
        {Icon && <Icon className="auth-field-icon" size={16} />}
        {children}
      </div>
    </label>
  );
}
