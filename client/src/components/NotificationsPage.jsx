import { Bell, Check } from "lucide-react";
import { markNotificationRead } from "../api/notification.api.js";

export function NotificationsPage({ notifications, onRead, loading }) {
  const read = async (notification) => {
    if (notification.readAt) return;
    await markNotificationRead(notification._id);
    onRead(notification._id);
  };

  return <div className="animate-rise space-y-6"><section className="panel"><div className="flex items-center gap-3"><span className="community-icon"><Bell size={19} /></span><div><p className="eyebrow">Your updates</p><h2 className="font-display text-2xl tracking-[-0.035em]">Notifications</h2></div></div><div className="mt-5 space-y-2">{loading && <p className="text-sm text-[#718080]">Loading notifications...</p>}{!loading && notifications.length === 0 && <p className="text-sm text-[#718080]">You have no notifications.</p>}{notifications.map((notification) => <button key={notification._id} className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition hover:bg-[#f7f5ef] ${notification.readAt ? "opacity-60" : "bg-[#f7f5ef]"}`} onClick={() => read(notification)}><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#d97757]" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{notification.message}</span><span className="mt-1 block text-xs text-[#718080]">{new Date(notification.createdAt).toLocaleString()}</span></span>{!notification.readAt && <Check size={16} className="text-[#1d6b5d]" />}</button>)}</div></section></div>;
}
