import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Bike,
  Box,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  HandHeart,
  LayoutDashboard,
  MapPin,
  Menu,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "donations", label: "Donations", icon: HandHeart },
  { id: "matching", label: "Matching hub", icon: Compass },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "community", label: "Community", icon: Users },
];

const donationRows = [
  {
    name: "Harvest table surplus",
    type: "Prepared meals",
    quantity: "84 meals",
    place: "Nehru Community Hall",
    time: "Today, 4:30 PM",
    status: "In matching",
    tone: "amber",
  },
  {
    name: "Morning bakery batch",
    type: "Baked goods",
    quantity: "32 kg",
    place: "Cedar & Grain Bakery",
    time: "Tomorrow, 8:00 AM",
    status: "Reserved",
    tone: "mint",
  },
  {
    name: "Fresh produce crates",
    type: "Vegetables",
    quantity: "14 crates",
    place: "Greenline Market",
    time: "Sep 24, 11:00 AM",
    status: "Completed",
    tone: "blue",
  },
  {
    name: "Conference lunch boxes",
    type: "Packed meals",
    quantity: "120 meals",
    place: "Westside Tech Park",
    time: "Sep 22, 2:00 PM",
    status: "Needs pickup",
    tone: "coral",
  },
];

const matches = [
  {
    name: "Asha Community Kitchen",
    kind: "Community kitchen",
    distance: "1.8 km away",
    need: "72 of 84 meals",
    transport: "Own transport",
    initials: "AC",
    color: "bg-[#1d6b5d]",
  },
  {
    name: "Hope Shelter Network",
    kind: "Shelter",
    distance: "3.4 km away",
    need: "40 meals",
    transport: "Volunteer needed",
    initials: "HS",
    color: "bg-[#d97757]",
  },
  {
    name: "Seva Food Circle",
    kind: "Gurudwara",
    distance: "4.7 km away",
    need: "Open capacity",
    transport: "Own transport",
    initials: "SF",
    color: "bg-[#284b63]",
  },
];

const deliveries = [
  {
    title: "Morning bakery batch",
    route: "Cedar & Grain â†’ Hope Shelter",
    person: "Maya Patel",
    status: "In transit",
    eta: "12 min",
    icon: Bike,
    tone: "mint",
  },
  {
    title: "Fresh produce crates",
    route: "Greenline Market â†’ Seva Food Circle",
    person: "Organization pickup",
    status: "Completed",
    eta: "Delivered 2h ago",
    icon: PackageCheck,
    tone: "blue",
  },
  {
    title: "Conference lunch boxes",
    route: "Westside Tech Park â†’ Asha Kitchen",
    person: "Volunteer needed",
    status: "Awaiting match",
    eta: "Sep 22 Â· 2:00 PM",
    icon: Clock3,
    tone: "coral",
  },
];

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [role, setRole] = useState("Donor workspace");
  const pageTitle = {
    overview: "Good afternoon, Anika",
    donations: "Your donations",
    matching: "Matching hub",
    deliveries: "Delivery control room",
    community: "The FoodBridge community",
  }[activePage];

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#172629]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="min-h-screen lg:pl-[268px]">
        <Topbar role={role} setRole={setRole} setMobileOpen={setMobileOpen} />
        <div className="mx-auto max-w-[1540px] px-5 pb-12 pt-6 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">
                {activePage === "overview"
                  ? "Tuesday, September 23, 2025"
                  : "FoodBridge operations"}
              </p>
              <h1 className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-[#172629] sm:text-5xl">
                {pageTitle}
              </h1>
            </div>
            <button
              className="button-primary self-start md:self-auto"
              onClick={() => setShowDonationForm(true)}
            >
              <Plus size={17} /> New donation
            </button>
          </div>
          {activePage === "overview" && (
            <Overview
              setActivePage={setActivePage}
              setShowDonationForm={setShowDonationForm}
            />
          )}
          {activePage === "donations" && (
            <Donations setShowDonationForm={setShowDonationForm} />
          )}
          {activePage === "matching" && <MatchingHub />}
          {activePage === "deliveries" && <Deliveries />}
          {activePage === "community" && <Community />}
        </div>
      </main>
      {showDonationForm && (
        <DonationModal onClose={() => setShowDonationForm(false)} />
      )}
    </div>
  );
}

function Sidebar({ activePage, setActivePage, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col border-r border-[#dfe3d8] bg-[#fbfaf6] px-5 py-6 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <button
            className="flex items-center gap-3"
            onClick={() => setActivePage("overview")}
          >
            <span className="brand-mark">
              <HandHeart size={21} strokeWidth={2.5} />
            </span>
            <span className="font-display text-[1.45rem] tracking-[-0.04em]">
              FoodBridge
            </span>
          </button>
          <button
            className="icon-button lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-12 px-2">
          <p className="eyebrow">Workspace</p>
          <p className="mt-2 text-sm font-semibold">Donor operations</p>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                setMobileOpen(false);
              }}
              className={`nav-item ${activePage === id ? "nav-item-active" : ""}`}
            >
              <Icon size={18} />
              {label}
              {id === "matching" && (
                <span className="ml-auto h-2 w-2 rounded-full bg-[#e78a58]" />
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <button className="nav-item">
            <Bell size={18} />
            Notifications
            <span className="ml-auto rounded-full bg-[#e78a58] px-2 py-0.5 text-[10px] font-bold text-white">
              4
            </span>
          </button>
          <button className="nav-item">
            <Settings size={18} />
            Settings
          </button>
          <div className="mt-5 flex items-center gap-3 border-t border-[#e4e6de] px-2 pt-5">
            <div className="avatar bg-[#f2be62] text-[#513d1d]">AS</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Anika Sharma</p>
              <p className="truncate text-xs text-[#718080]">
                Cedar & Grain Bakery
              </p>
            </div>
            <ChevronDown size={15} className="ml-auto text-[#718080]" />
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-[#172629]/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
    </>
  );
}

function Topbar({ role, setRole, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#e0e3da]/80 bg-[#f5f2ea]/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          className="icon-button lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 text-sm text-[#718080] sm:flex">
          <span>Operations</span>
          <span>/</span>
          <span className="font-semibold text-[#172629]">Today</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="icon-button" aria-label="Search">
          <Search size={18} />
        </button>
        <button className="icon-button relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#d97757]" />
        </button>
        <div className="hidden h-7 w-px bg-[#dfe3d8] sm:block" />
        <button
          className="role-switch"
          onClick={() =>
            setRole(
              role === "Donor workspace"
                ? "Organization workspace"
                : "Donor workspace",
            )
          }
        >
          <span className="hidden sm:inline">{role}</span>
          <span className="sm:hidden">Donor</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

function Overview({ setActivePage, setShowDonationForm }) {
  return (
    <div className="space-y-6 animate-rise">
      <section className="hero-panel">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-[#ffe0a5]">
            <Sparkles size={16} /> Your impact, in motion
          </div>
          <h2 className="mt-5 max-w-lg font-display text-4xl leading-[0.96] tracking-[-0.045em] text-[#fffdf6] sm:text-5xl">
            Every meal finds a way forward.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#c1d1cb]">
            You have helped redirect{" "}
            <strong className="text-white">1,248 meals</strong> this month. The
            local network is moving quickly today.
          </p>
          <button
            className="button-light mt-7"
            onClick={() => setShowDonationForm(true)}
          >
            Share surplus <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="hero-orbit">
          <div className="orbit-center">
            <HandHeart size={25} />
          </div>
          <div className="orbit-dot orbit-dot-one">
            <MapPin size={15} />
          </div>
          <div className="orbit-dot orbit-dot-two">
            <Truck size={15} />
          </div>
          <div className="orbit-dot orbit-dot-three">
            <Users size={15} />
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Meals redirected"
          value="1,248"
          change="+18.6%"
          icon={HandHeart}
          tone="yellow"
        />
        <Metric
          label="Active matches"
          value="08"
          change="03 need action"
          icon={Compass}
          tone="mint"
        />
        <Metric
          label="Success rate"
          value="94.2%"
          change="Last 30 days"
          icon={ShieldCheck}
          tone="blue"
        />
        <Metric
          label="Network reach"
          value="12.4 km"
          change="Across 18 partners"
          icon={MapPin}
          tone="coral"
        />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <section className="panel overflow-hidden">
          <SectionHeader
            eyebrow="Live pulse"
            title="Your active donations"
            action="View all"
            onClick={() => setActivePage("donations")}
          />
          <div className="mt-5 space-y-1">
            {donationRows.slice(0, 3).map((row) => (
              <DonationRow key={row.name} row={row} />
            ))}
          </div>
        </section>
        <section className="panel">
          <SectionHeader
            eyebrow="Network view"
            title="Todayâ€™s reach"
            action="Open map"
            onClick={() => setActivePage("matching")}
          />
          <div className="map-card mt-5">
            <div className="map-grid" />
            <div className="map-route route-one" />
            <div className="map-route route-two" />
            <div className="map-pin pin-one">
              <MapPin size={15} />
            </div>
            <div className="map-pin pin-two">
              <MapPin size={15} />
            </div>
            <div className="map-pin pin-three">
              <MapPin size={15} />
            </div>
            <div className="map-label">
              <span className="h-2 w-2 rounded-full bg-[#e78a58]" /> 8 active
              routes
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-[#718080]">connected partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold">06</p>
              <p className="text-xs text-[#718080]">volunteers moving</p>
            </div>
            <div>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-xs text-[#718080]">on-time rate</p>
            </div>
          </div>
        </section>
      </div>
      <section className="panel">
        <SectionHeader
          eyebrow="Needs your attention"
          title="A little help goes a long way"
        />
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <ActionCard
            icon={Truck}
            title="1 pickup needs a volunteer"
            text="Conference lunch boxes Â· 2:00 PM"
            action="Find a volunteer"
            tone="coral"
          />
          <ActionCard
            icon={Clock3}
            title="2 donations expire soon"
            text="Review before the 6 hour window closes"
            action="Review timing"
            tone="yellow"
          />
          <ActionCard
            icon={Users}
            title="Welcome a new partner"
            text="3 organizations are nearby today"
            action="Explore network"
            tone="mint"
          />
        </div>
      </section>
    </div>
  );
}

function Donations({ setShowDonationForm }) {
  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="All donations"
          value="24"
          change="This quarter"
          icon={Box}
          tone="yellow"
        />
        <Metric
          label="Currently active"
          value="08"
          change="2 need action"
          icon={Clock3}
          tone="coral"
        />
        <Metric
          label="Meals shared"
          value="1,248"
          change="+18.6% vs last month"
          icon={HandHeart}
          tone="mint"
        />
      </div>
      <section className="panel">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SectionHeader eyebrow="Donation ledger" title="All food shared" />
          <div className="flex gap-2">
            <button className="filter-button">
              <Search size={15} /> Search
            </button>
            <button className="filter-button">
              All statuses <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#e5e7df] text-[11px] uppercase tracking-[0.12em] text-[#87918e]">
                <th className="pb-3 font-bold">Donation</th>
                <th className="pb-3 font-bold">Quantity</th>
                <th className="pb-3 font-bold">Pickup point</th>
                <th className="pb-3 font-bold">Window</th>
                <th className="pb-3 font-bold">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {donationRows.map((row) => (
                <tr
                  key={row.name}
                  className="border-b border-[#edf0e8] last:border-0"
                >
                  <td className="py-4">
                    <p className="font-bold">{row.name}</p>
                    <p className="mt-1 text-xs text-[#718080]">{row.type}</p>
                  </td>
                  <td className="py-4 text-sm">{row.quantity}</td>
                  <td className="py-4 text-sm text-[#536363]">{row.place}</td>
                  <td className="py-4 text-sm text-[#536363]">{row.time}</td>
                  <td className="py-4">
                    <StatusPill label={row.status} tone={row.tone} />
                  </td>
                  <td className="py-4 text-right">
                    <button className="icon-button">
                      <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <button
        className="button-primary"
        onClick={() => setShowDonationForm(true)}
      >
        <Plus size={17} /> Add another donation
      </button>
    </div>
  );
}

function MatchingHub() {
  return (
    <div className="animate-rise space-y-6">
      <section className="match-banner">
        <div>
          <p className="eyebrow text-[#a7d7c5]">Progressive matching</p>
          <h2 className="mt-2 font-display text-4xl tracking-[-0.04em] text-white">
            The right food, the right place.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c2d5cc]">
            Your current donation is being matched in expanding circles.
            FoodBridge prioritizes distance, transport, and urgency.
          </p>
        </div>
        <div className="radius-display">
          <span className="text-4xl font-bold">2.4</span>
          <span className="text-xs text-[#acd4c5]">km radius</span>
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <section className="panel">
          <SectionHeader
            eyebrow="Best matches"
            title="3 organizations nearby"
          />
          <div className="mt-4 space-y-3">
            {matches.map((match, index) => (
              <MatchCard key={match.name} match={match} index={index} />
            ))}
          </div>
        </section>
        <section className="panel">
          <SectionHeader
            eyebrow="Live geography"
            title="Asha Kitchen donation"
            action="Expand map"
          />
          <div className="large-map mt-5">
            <div className="map-grid" />
            <div className="large-radius" />
            <div className="map-pin center-pin">
              <MapPin size={18} />
            </div>
            {matches.map((match, index) => (
              <div
                key={match.name}
                className={`map-pin match-pin match-pin-${index}`}
              >
                <MapPin size={14} />
              </div>
            ))}
            <div className="map-label">
              <span className="h-2 w-2 rounded-full bg-[#76c7a9]" /> Matching
              within 5 km
            </div>
          </div>
          <div className="mt-4 flex items-center gap-5 text-xs text-[#718080]">
            <span className="flex items-center gap-2">
              <i className="legend-dot bg-[#e78a58]" />
              Donation
            </span>
            <span className="flex items-center gap-2">
              <i className="legend-dot bg-[#76c7a9]" />
              Organization
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
function Deliveries() {
  return (
    <div className="animate-rise space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Active routes"
          value="03"
          change="1 needs attention"
          icon={Truck}
          tone="coral"
        />
        <Metric
          label="In transit"
          value="01"
          change="ETA 12 minutes"
          icon={Bike}
          tone="mint"
        />
        <Metric
          label="Delivered this month"
          value="42"
          change="96% confirmed"
          icon={PackageCheck}
          tone="blue"
        />
      </div>
      <section className="panel">
        <SectionHeader eyebrow="Delivery board" title="Moving food forward" />
        <div className="mt-5 space-y-3">
          {deliveries.map((delivery) => (
            <DeliveryCard key={delivery.title} delivery={delivery} />
          ))}
        </div>
      </section>
    </div>
  );
}
function Community() {
  return (
    <div className="animate-rise space-y-6">
      <section className="community-hero">
        <div className="relative z-10 max-w-lg">
          <p className="eyebrow text-[#ffe0a5]">People make the bridge</p>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] text-white sm:text-5xl">
            A network with a pulse.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#d0ddd7]">
            FoodBridge brings local kitchens, donors, organizations, and
            volunteers into one visible, generous loop.
          </p>
        </div>
        <div className="community-number">
          18<span>partner organizations</span>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        <CommunityStat
          icon={Users}
          number="64"
          label="active volunteers"
          text="People giving time this week"
        />
        <CommunityStat
          icon={ShieldCheck}
          number="18"
          label="trusted organizations"
          text="Verified places serving locally"
        />
        <CommunityStat
          icon={HandHeart}
          number="4.8k"
          label="meals redirected"
          text="A growing community impact"
        />
      </div>
    </div>
  );
}
function DonationModal({ onClose }) {
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
              Weâ€™ll find the closest verified organization.
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
function Metric({ label, value, change, icon: Icon, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon tone-${tone}`}>
        <Icon size={18} />
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-bold tracking-[-0.04em]">{value}</p>
          <p className="mt-1 text-xs text-[#718080]">{label}</p>
        </div>
        <span className={`metric-change change-${tone}`}>{change}</span>
      </div>
    </div>
  );
}
function SectionHeader({ eyebrow, title, action, onClick }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl tracking-[-0.035em]">
          {title}
        </h2>
      </div>
      {action && (
        <button className="text-button" onClick={onClick}>
          {action}
          <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
}
function StatusPill({ label, tone }) {
  return (
    <span className={`status-pill status-${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
function DonationRow({ row }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#f7f5ef]">
      <div className={`row-icon row-${row.tone}`}>
        <Box size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{row.name}</p>
        <p className="mt-1 truncate text-xs text-[#718080]">
          {row.quantity} Â· {row.place}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-xs font-semibold">{row.time}</p>
        <div className="mt-1">
          <StatusPill label={row.status} tone={row.tone} />
        </div>
      </div>
      <ArrowUpRight size={16} className="text-[#9ba6a0]" />
    </div>
  );
}
function ActionCard({ icon: Icon, title, text, action, tone }) {
  return (
    <div className={`action-card action-${tone}`}>
      <div className="flex items-center gap-3">
        <span className="action-icon">
          <Icon size={17} />
        </span>
        <p className="text-sm font-bold leading-5">{title}</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#687674]">{text}</p>
      <button className="mt-4 text-xs font-bold text-[#315d53]">
        {action} <ArrowUpRight size={13} className="inline" />
      </button>
    </div>
  );
}
function MatchCard({ match, index }) {
  return (
    <div className="match-card">
      <div className={`avatar ${match.color} text-white`}>{match.initials}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold">{match.name}</p>
          {index === 0 && <span className="best-tag">Best fit</span>}
        </div>
        <p className="mt-1 text-xs text-[#718080]">
          {match.kind} Â· {match.distance}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="mini-tag">
            <HandHeart size={12} /> {match.need}
          </span>
          <span className="mini-tag">
            <Truck size={12} /> {match.transport}
          </span>
        </div>
      </div>
      <button className="icon-button">
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
function DeliveryCard({ delivery }) {
  const Icon = delivery.icon;
  return (
    <div className="delivery-card">
      <div className={`delivery-icon delivery-${delivery.tone}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">{delivery.title}</p>
          <StatusPill label={delivery.status} tone={delivery.tone} />
        </div>
        <p className="mt-1 text-xs text-[#718080]">{delivery.route}</p>
        <p className="mt-3 text-xs font-semibold text-[#536363]">
          {delivery.person}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-bold">{delivery.eta}</p>
        <p className="mt-1 text-xs text-[#87918e]">next update</p>
      </div>
      <button className="icon-button">
        <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
function CommunityStat({ icon: Icon, number, label, text }) {
  return (
    <div className="panel">
      <div className="community-icon">
        <Icon size={19} />
      </div>
      <p className="mt-5 text-4xl font-bold tracking-[-0.05em]">{number}</p>
      <p className="mt-1 font-bold">{label}</p>
      <p className="mt-3 text-sm leading-5 text-[#718080]">{text}</p>
    </div>
  );
}

export default App;
