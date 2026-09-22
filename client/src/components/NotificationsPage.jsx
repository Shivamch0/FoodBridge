import { Bell, Check } from "lucide-react";
import { markNotificationRead } from "../api/notification.api.js";
import {
  acceptVolunteerRequest,
  rejectVolunteerRequest,
} from "../api/deliveryRequest.api.js";

export function NotificationsPage({
  notifications,
  onRead,
  onRefresh,
  role,
  loading,
}) {
  const read = async (notification) => {
    if (notification.readAt) return;
    await markNotificationRead(notification._id);
    onRead(notification._id);
  };

  const handleRequest = async (notification, action) => {
    if (action === "accept") await acceptVolunteerRequest(notification.request);
    else await rejectVolunteerRequest(notification.request);
    await onRefresh();
  };

  return (
    <div className="animate-rise space-y-6">
      <section className="panel">
        <div className="flex items-center gap-3">
          <span className="community-icon">
            <Bell size={19} />
          </span>
          <div>
            <p className="eyebrow">Your updates</p>
            <h2 className="font-display text-2xl tracking-[-0.035em]">
              Notifications
            </h2>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {loading && (
            <p className="text-sm text-[#718080]">Loading notifications...</p>
          )}
          {!loading && notifications.length === 0 && (
            <p className="text-sm text-[#718080]">You have no notifications.</p>
          )}
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition hover:bg-[#f7f5ef] ${notification.readAt ? "opacity-60" : "bg-[#f7f5ef]"}`}
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d97757]" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  {notification.message}
                </span>
                <span className="mt-1 block text-xs text-[#718080]">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </span>
              <div className="flex items-center gap-2">
                {role === "volunteer" &&
                notification.type === "volunteer_needed" &&
                notification.request ? (
                  <>
                    <button
                      className="button-primary"
                      onClick={() => handleRequest(notification, "accept")}
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      className="button-quiet"
                      onClick={() => handleRequest(notification, "reject")}
                    >
                      Reject
                    </button>
                  </>
                ) : !notification.readAt ? (
                  <button
                    className="icon-button"
                    onClick={() => read(notification)}
                    aria-label="Mark notification as read"
                  >
                    <Check size={16} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
