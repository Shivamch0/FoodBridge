import { useState } from "react";
import { Plus } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Overview } from "./Overview";
import { Donations } from "./Donations";
import { MatchingHub } from "./MatchingHub";
import { Deliveries } from "./Deliveries";
import { Community } from "./Community";
import { DonationModal } from "./DonationModal";

export function DashboardPage({ user, onLogout }) {
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
        user={user}
        onLogout={onLogout}
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
