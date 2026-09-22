export const navItems = [
  { id: "overview", label: "Overview" },
  { id: "donations", label: "Donations" },
  { id: "matching", label: "Matching hub" },
  { id: "deliveries", label: "Deliveries" },
  { id: "community", label: "Community" },
];

export const statusTone = (status = "") => {
  if (["delivered", "completed", "confirmed"].includes(status)) return "mint";
  if (["cancelled", "expired", "failed"].includes(status)) return "coral";
  if (["temporarily_reserved", "searching", "assigned"].includes(status)) return "amber";
  return "blue";
};

export const formatDate = (value) => {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
};

export const donationToRow = (donation) => ({
  id: donation._id,
  name: donation.foodName,
  type: donation.foodType,
  quantity: `${donation.quantity} ${donation.unit}`,
  place: donation.pickupLocation?.coordinates?.join(", ") || "Location unavailable",
  time: formatDate(donation.expiresAt),
  status: donation.status?.replaceAll("_", " "),
  tone: statusTone(donation.status),
});
