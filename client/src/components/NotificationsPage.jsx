import { Bell, Check, MapPin, X } from "lucide-react";
import { useState } from "react";
import { markNotificationRead } from "../api/notification.api.js";
import { LocationName } from "./LocationName";
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
  const [selectedDonation, setSelectedDonation] = useState(null);
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
                {notification.donation && (
                  <button
                    className="mt-2 text-xs font-bold text-[#315d53]"
                    onClick={() => setSelectedDonation(notification.donation)}
                  >
                    View donation details
                  </button>
                )}
                <span className="mt-1 block text-xs text-[#718080]">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                {notification.donation?.pickupLocation?.coordinates && (
                  <span className="mt-1 block text-xs text-[#718080]">
                    Pickup:{" "}
                    <LocationName
                      coordinates={
                        notification.donation.pickupLocation.coordinates
                      }
                    />
                  </span>
                )}
                {notification.donation?.donor && (
                  <span className="mt-1 block text-xs text-[#718080]">
                    Donor: {notification.donation.donor.username} ·{" "}
                    {notification.donation.donor.phoneNumber ||
                      "Contact available"}
                  </span>
                )}
                {notification.assignment?.organization && (
                  <span className="mt-1 block text-xs text-[#718080]">
                    Organization:{" "}
                    {notification.assignment.organization.organizationName ||
                      notification.assignment.organization}
                  </span>
                )}
                {notification.assignment?.volunteer && (
                  <span className="mt-1 block text-xs text-[#718080]">
                    Volunteer:{" "}
                    {notification.assignment.volunteer.username ||
                      notification.assignment.volunteer}
                  </span>
                )}
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
      {selectedDonation && (
        <div className="modal-backdrop">
          <div className="modal-card animate-rise">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Donation details</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.04em]">
                  {selectedDonation.foodName}
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSelectedDonation(null)}
                aria-label="Close donation details"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-[#536363]">
              <p>
                <strong>Food type:</strong> {selectedDonation.foodType}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedDonation.quantity}{" "}
                {selectedDonation.unit}
              </p>
              <p>
                <strong>Expires:</strong>{" "}
                {new Date(selectedDonation.expiresAt).toLocaleString()}
              </p>
              {selectedDonation.description && (
                <p>
                  <strong>Description:</strong> {selectedDonation.description}
                </p>
              )}
              {selectedDonation.pickupLocation?.coordinates && (
                <p>
                  <MapPin size={15} className="mr-1 inline" />
                  <strong>Pickup:</strong>{" "}
                  <LocationName
                    coordinates={selectedDonation.pickupLocation.coordinates}
                  />
                </p>
              )}
              {selectedDonation.donor && (
                <p>
                  <strong>Donor:</strong> {selectedDonation.donor.username} ·{" "}
                  {selectedDonation.donor.phoneNumber || "Contact available"}
                </p>
              )}
            </div>
            <div className="mt-7 flex justify-end">
              <button
                className="button-quiet"
                onClick={() => setSelectedDonation(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
