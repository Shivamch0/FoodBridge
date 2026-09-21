import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export function AuthForm({ mode, onSubmit, error, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "donor",
    organizationName: "",
    organizationType: "community_kitchen",
  });
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
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
      <button className="auth-submit" disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" size={17} /> : null}
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
