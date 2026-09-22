import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { listDeliveries } from "../api/delivery.api.js";
import { listDeliveryRequests } from "../api/deliveryRequest.api.js";
import { listDonations } from "../api/donation.api.js";
import { listNotifications } from "../api/notification.api.js";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Overview } from "./Overview";
import { Donations } from "./Donations";
import { MatchingHub } from "./MatchingHub";
import { Deliveries } from "./Deliveries";
import { Community } from "./Community";
import { DonationModal } from "./DonationModal";
import { NotificationsPage } from "./NotificationsPage";
import { ProfileSettings } from "./ProfileSettings";
import { OrganizationDashboard } from "./OrganizationDashboard";
import { VolunteerDashboard } from "./VolunteerDashboard";

export function DashboardPage({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user);
  const [activePage, setActivePage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    donations: [],
    deliveries: [],
    deliveryRequests: [],
    notifications: [],
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const loadDashboardData = async () => {
    setDataLoading(true);
    setDataError("");
    const results = await Promise.allSettled([
      listDonations(),
      listDeliveries(),
      listDeliveryRequests(),
      listNotifications(),
    ]);
    const [donations, deliveries, deliveryRequests, notifications] = results;
    setDashboardData({
      donations:
        donations.status === "fulfilled" ? donations.value.data || [] : [],
      deliveries:
        deliveries.status === "fulfilled" ? deliveries.value.data || [] : [],
      deliveryRequests:
        deliveryRequests.status === "fulfilled"
          ? deliveryRequests.value.data || []
          : [],
      notifications:
        notifications.status === "fulfilled"
          ? notifications.value.data || []
          : [],
    });
    if (results.some((result) => result.status === "rejected")) {
      setDataError("Some dashboard data could not be loaded.");
    }
    setDataLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(loadDashboardData);
  }, []);
  const pageTitle = {
    overview: currentUser?.role === "organization" ? "Organization workspace" : currentUser?.role === "volunteer" ? "Volunteer workspace" : `Good afternoon, ${currentUser?.username || "there"}`,
    donations: "Your donations",
    matching: "Matching hub",
    deliveries: "Delivery control room",
    community: "The FoodBridge community",
    notifications: "Notifications",
    settings: "Profile settings",
  }[activePage];
  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#172629]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={currentUser}
        notifications={dashboardData.notifications}
        onLogout={onLogout}
      />
      <main className="min-h-screen lg:pl-[268px]">
        <Topbar role={`${currentUser?.role || "user"} workspace`} setMobileOpen={setMobileOpen} />
        <div className="mx-auto max-w-[1540px] px-5 pb-12 pt-6 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">FoodBridge operations</p>
              <h1 className="mt-2 font-display text-4xl leading-none tracking-[-0.04em] text-[#172629] sm:text-5xl">
                {pageTitle}
              </h1>
            </div>
            {currentUser?.role === "donor" && <button className="button-primary self-start md:self-auto" onClick={() => setShowDonationForm(true)}><Plus size={17} /> New donation</button>}
          </div>
          {currentUser?.role === "organization" && activePage === "overview" && (
            <OrganizationDashboard donations={dashboardData.donations} requests={dashboardData.deliveryRequests} loading={dataLoading} onRefresh={loadDashboardData} />
          )}
          {currentUser?.role === "volunteer" && activePage === "overview" && (
            <VolunteerDashboard requests={dashboardData.deliveryRequests} loading={dataLoading} onRefresh={loadDashboardData} />
          )}
          {currentUser?.role === "donor" && activePage === "overview" && (
            <Overview
              setActivePage={setActivePage}
              setShowDonationForm={setShowDonationForm}
              donations={dashboardData.donations}
              deliveryRequests={dashboardData.deliveryRequests}
              loading={dataLoading}
            />
          )}
          {currentUser?.role === "donor" && activePage === "donations" && (
            <Donations
              setShowDonationForm={setShowDonationForm}
              donations={dashboardData.donations}
              loading={dataLoading}
            />
          )}
          {currentUser?.role === "donor" && activePage === "matching" && (
            <MatchingHub donations={dashboardData.donations} />
          )}
          {activePage === "deliveries" && (
            <Deliveries
              deliveries={dashboardData.deliveries}
              loading={dataLoading}
            />
          )}
          {activePage === "community" && (
            <Community
              donations={dashboardData.donations}
              deliveries={dashboardData.deliveries}
              deliveryRequests={dashboardData.deliveryRequests}
            />
          )}
          {activePage === "notifications" && <NotificationsPage notifications={dashboardData.notifications} loading={dataLoading} onRead={(id) => setDashboardData((current) => ({ ...current, notifications: current.notifications.map((notification) => notification._id === id ? { ...notification, readAt: new Date().toISOString() } : notification) }))} />}
          {activePage === "settings" && <ProfileSettings user={currentUser} onUpdated={setCurrentUser} />}
          {dataError && (
            <p className="mt-4 text-sm text-[#b96650]">{dataError}</p>
          )}
        </div>
      </main>
      {showDonationForm && (
        <DonationModal
          onClose={() => setShowDonationForm(false)}
          onCreated={loadDashboardData}
        />
      )}
    </div>
  );
}
