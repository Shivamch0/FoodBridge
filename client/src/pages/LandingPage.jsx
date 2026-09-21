import {
  ArrowRight,
  HandHeart,
  MapPin,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { BrandMark } from "../components/BrandMark";

export function LandingPage({ onLogin, onSignup }) {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <BrandMark />
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#61716e] md:flex">
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Our impact</a>
          <a href="#community">Community</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="button-quiet" onClick={onLogin}>
            Sign in
          </button>
          <button className="button-primary" onClick={onSignup}>
            Join FoodBridge <ArrowRight size={16} />
          </button>
        </div>
      </nav>
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow text-[#d97757]">A better route for good food</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-[-0.06em] text-[#172629] sm:text-8xl">
            Good food should <em>keep moving.</em>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[#61716e]">
            FoodBridge connects surplus food with trusted local organizations
            and the volunteers who help it arrive in time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="button-primary px-5 py-3" onClick={onSignup}>
              Start sharing food <ArrowRight size={17} />
            </button>
            <button className="button-quiet px-5 py-3" onClick={onLogin}>
              Explore the network
            </button>
          </div>
          <div className="landing-trust">
            <div className="avatar-stack">
              <span>AS</span>
              <span>MK</span>
              <span>RP</span>
              <span>+1k</span>
            </div>
            <p>
              <strong>1,248 meals</strong> redirected this month
              <br />
              <span>by donors, organizations, and volunteers</span>
            </p>
          </div>
        </div>
        <div className="landing-visual">
          <div className="visual-sun" />
          <div className="visual-card visual-card-main">
            <div className="visual-label">
              <span className="pulse-dot" /> Live match
            </div>
            <div className="visual-meal">
              <span className="meal-icon">
                <HandHeart size={25} />
              </span>
              <div>
                <strong>84 prepared meals</strong>
                <span>Harvest table surplus</span>
              </div>
            </div>
            <div className="visual-route">
              <div className="route-point">
                <span>Donor</span>
                <b>Nehru Hall</b>
              </div>
              <div className="route-line">
                <span>2.4 km</span>
              </div>
              <div className="route-point align-right">
                <span>Organization</span>
                <b>Asha Kitchen</b>
              </div>
            </div>
            <div className="visual-footer">
              <span>
                <MapPin size={14} /> Matching nearby
              </span>
              <span className="visual-ready">Ready to move</span>
            </div>
          </div>
          <div className="floating-card floating-volunteer">
            <span className="floating-icon">
              <Truck size={17} />
            </span>
            <div>
              <strong>Maya is on the way</strong>
              <span>Pickup in 12 minutes</span>
            </div>
            <span className="online-dot" />
          </div>
          <div className="floating-card floating-impact">
            <span className="impact-number">4.8k</span>
            <span>
              meals redirected
              <br />
              across the city
            </span>
          </div>
        </div>
      </section>
      <section className="landing-strip" id="impact">
        <div>
          <span className="strip-number">18</span>
          <span>verified organizations</span>
        </div>
        <div>
          <span className="strip-number">64</span>
          <span>active volunteers</span>
        </div>
        <div>
          <span className="strip-number">94%</span>
          <span>successful deliveries</span>
        </div>
        <div className="strip-note">
          <ShieldCheck size={19} /> Built around trust, timing, and local
          action.
        </div>
      </section>
      <section className="landing-how" id="how-it-works">
        <div>
          <p className="eyebrow">The FoodBridge loop</p>
          <h2 className="mt-3 max-w-xl font-display text-5xl leading-none tracking-[-0.05em]">
            Three people. One simple movement.
          </h2>
        </div>
        <div className="how-grid">
          <HowStep
            number="01"
            icon={HandHeart}
            title="Share surplus"
            text="Tell us what is available, where it is, and when it needs to move."
          />
          <HowStep
            number="02"
            icon={MapPin}
            title="Find the fit"
            text="Our matching engine looks at distance, need, transport, and urgency."
          />
          <HowStep
            number="03"
            icon={Users}
            title="Move together"
            text="Organizations and volunteers coordinate one clear path to delivery."
          />
        </div>
      </section>
      <footer className="landing-footer" id="community">
        <BrandMark />
        <span>FoodBridge · Less waste, more welcome.</span>
      </footer>
    </main>
  );
}

function HowStep({ number, icon: Icon, title, text }) {
  return (
    <article className="how-step">
      <div className="flex items-center justify-between">
        <span className="how-number">{number}</span>
        <Icon size={25} className="text-[#d97757]" />
      </div>
      <h3 className="mt-10 font-display text-3xl tracking-[-0.04em]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#718080]">{text}</p>
    </article>
  );
}
