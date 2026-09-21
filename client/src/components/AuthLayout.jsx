import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function AuthLayout({
  children,
  title,
  eyebrow,
  alternate,
  onAlternate,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-story">
        <div className="auth-story-top">
          <BrandMark />
        </div>
        <div className="auth-story-copy">
          <p className="eyebrow text-[#f5d17b]">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#c9dad3]">
            A practical bridge between surplus food, trusted organizations, and
            the people who make pickup possible.
          </p>
          <div className="auth-proof">
            <span className="auth-proof-icon">
              <Users size={17} />
            </span>
            <div>
              <strong>1,248 meals</strong>
              <span>redirected by the network this month</span>
            </div>
            <ArrowUpRight size={17} />
          </div>
        </div>
        <div className="auth-route">
          <MapPin size={15} />
          <span>Local food, local hands, real impact.</span>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <BrandMark />
          </div>
          {children}
          <button className="auth-alternate" onClick={onAlternate}>
            {alternate}
          </button>
          <p className="mt-8 text-center text-xs text-[#89948f]">
            By continuing, you agree to help keep the FoodBridge network safe
            and respectful.
          </p>
        </div>
      </section>
    </main>
  );
}
