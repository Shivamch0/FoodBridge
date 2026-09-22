import {
  Bell,
  ChevronDown,
  Compass,
  HandHeart,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
  X,
} from "lucide-react";
import { navItems } from "./dashboardData";

const icons = {
  overview: LayoutDashboard,
  donations: HandHeart,
  matching: Compass,
  deliveries: Truck,
  community: Users,
};

export function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
  user,
  notifications = [],
  onLogout,
}) {
  const roleItems =
    user?.role === "organization"
      ? [
          { id: "overview", label: "Nearby donations" },
          { id: "deliveries", label: "My deliveries" },
        ]
      : user?.role === "volunteer"
        ? [
            { id: "overview", label: "Open requests" },
            { id: "deliveries", label: "My deliveries" },
          ]
        : navItems;
  const items = [
    ...roleItems,
    { id: "notifications", label: "Notifications" },
    { id: "settings", label: "Settings" },
  ];
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
          <p className="mt-2 text-sm font-semibold">
            {user?.role || "user"} operations
          </p>
        </div>
        <nav className="mt-6 space-y-1">
          {items.map(({ id, label }) => {
            const Icon =
              id === "notifications"
                ? Bell
                : id === "settings"
                  ? Settings
                  : icons[id];
            return (
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
                {id === "notifications" &&
                  notifications.some(
                    (notification) => !notification.readAt,
                  ) && (
                    <span className="ml-auto rounded-full bg-[#e78a58] px-2 py-0.5 text-[10px] font-bold text-white">
                      {
                        notifications.filter(
                          (notification) => !notification.readAt,
                        ).length
                      }
                    </span>
                  )}
                {id === "matching" && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#e78a58]" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1">
          <div className="mt-5 flex items-center gap-3 border-t border-[#e4e6de] px-2 pt-5">
            <div className="avatar bg-[#f2be62] text-[#513d1d]">
              {user?.username?.slice(0, 2).toUpperCase() || "AS"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {user?.username || "FoodBridge user"}
              </p>
              <p className="truncate text-xs capitalize text-[#718080]">
                {user?.role || "donor"} workspace
              </p>
            </div>
            <ChevronDown size={15} className="ml-auto text-[#718080]" />
          </div>
          <button className="nav-item mt-2 text-[#b96650]" onClick={onLogout}>
            Sign out
          </button>
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
