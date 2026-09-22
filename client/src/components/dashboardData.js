import { Bike, Clock3, PackageCheck } from "lucide-react";

export const navItems = [
  { id: "overview", label: "Overview" },
  { id: "donations", label: "Donations" },
  { id: "matching", label: "Matching hub" },
  { id: "deliveries", label: "Deliveries" },
  { id: "community", label: "Community" },
];

export const donationRows = [
  { name: "Harvest table surplus", type: "Prepared meals", quantity: "84 meals", place: "Nehru Community Hall", time: "Today, 4:30 PM", status: "In matching", tone: "amber" },
  { name: "Morning bakery batch", type: "Baked goods", quantity: "32 kg", place: "Cedar & Grain Bakery", time: "Tomorrow, 8:00 AM", status: "Reserved", tone: "mint" },
  { name: "Fresh produce crates", type: "Vegetables", quantity: "14 crates", place: "Greenline Market", time: "Sep 24, 11:00 AM", status: "Completed", tone: "blue" },
  { name: "Conference lunch boxes", type: "Packed meals", quantity: "120 meals", place: "Westside Tech Park", time: "Sep 22, 2:00 PM", status: "Needs pickup", tone: "coral" },
];

export const matches = [
  { name: "Asha Community Kitchen", kind: "Community kitchen", distance: "1.8 km away", need: "72 of 84 meals", transport: "Own transport", initials: "AC", color: "bg-[#1d6b5d]" },
  { name: "Hope Shelter Network", kind: "Shelter", distance: "3.4 km away", need: "40 meals", transport: "Volunteer needed", initials: "HS", color: "bg-[#d97757]" },
  { name: "Seva Food Circle", kind: "Gurudwara", distance: "4.7 km away", need: "Open capacity", transport: "Own transport", initials: "SF", color: "bg-[#284b63]" },
];

export const deliveries = [
  { title: "Morning bakery batch", route: "Cedar & Grain → Hope Shelter", person: "Maya Patel", status: "In transit", eta: "12 min", icon: Bike, tone: "mint" },
  { title: "Fresh produce crates", route: "Greenline Market → Seva Food Circle", person: "Organization pickup", status: "Completed", eta: "Delivered 2h ago", icon: PackageCheck, tone: "blue" },
  { title: "Conference lunch boxes", route: "Westside Tech Park → Asha Kitchen", person: "Volunteer needed", status: "Awaiting match", eta: "Sep 22 · 2:00 PM", icon: Clock3, tone: "coral" },
];
