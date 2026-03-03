import { ShoppingBag, DollarSign, Users, Bell } from "lucide-react";

// Store Statistics
export const storeStats = [
  {
    label: "Total Sales",
    value: "$12,345.00",
    change: "+12%",
    trend: "up",
    icon: DollarSign
  },
  {
    label: "Total Orders",
    value: "1,234",
    change: "+5%",
    trend: "up",
    icon: ShoppingBag
  },
  {
    label: "Active Users",
    value: "56",
    change: "-2%",
    trend: "down",
    icon: Users
  },
  {
    label: "Pending Alerts",
    value: "3",
    change: "0%",
    trend: "neutral",
    icon: Bell
  }
];
