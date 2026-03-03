import { type TicketType } from "../registration/TicketCard"

export interface EventDetails {
  id: string
  name: string
  nameTC: string
  nameSC: string
  description: string
  descriptionTC: string
  descriptionSC: string
  startDate: Date
  endDate: Date
  venue: string
  venueTC: string
  venueSC: string
  bannerImageUrl?: string
  primaryColor: string
}

export const mockEventForRegistration: EventDetails = {
  id: "evt_wine_dine_2026",
  name: "Hong Kong Wine & Dine Festival 2026",
  nameTC: "香港美酒佳餚巡禮 2026",
  nameSC: "香港美酒佳肴巡礼 2026",
  description: "Join us for Hong Kong's premier culinary experience featuring world-class wines, gourmet cuisine, and exclusive tasting sessions with renowned sommeliers.",
  descriptionTC: "參加香港首屈一指的美食體驗，品嚐世界級美酒、美食，並與著名侍酒師進行獨家品酒會。",
  descriptionSC: "参加香港首屈一指的美食体验，品尝世界级美酒、美食，并与著名侍酒师进行独家品酒会。",
  startDate: new Date("2026-10-25T10:00:00"),
  endDate: new Date("2026-10-28T22:00:00"),
  venue: "Central Harbourfront Event Space",
  venueTC: "中環海濱活動空間",
  venueSC: "中环海滨活动空间",
  bannerImageUrl: undefined, // Will use Unsplash
  primaryColor: "#107DAC",
}

export const mockEventTickets: TicketType[] = [
  {
    id: "tkt_general_admission",
    name: "General Admission",
    description: "Access to all main festival areas, food stalls, and general wine tasting booths throughout the event.",
    colorHex: "#107DAC",
    scope: "event",
    available: 238,
    total: 500,
    price: 0,
  },
  {
    id: "tkt_vip_lounge",
    name: "VIP Lounge Access",
    description: "Exclusive access to the VIP lounge with premium wines, cocktails, and gourmet canapés. Includes general admission.",
    colorHex: "#F59E0B",
    scope: "event",
    available: 15,
    total: 100,
    price: 0,
  },
]

export const mockSubEventTickets: TicketType[] = [
  // Session 1: Oct 25, 2026
  {
    id: "tkt_red_wine_masterclass_oct25",
    name: "Red Wine Tasting Masterclass",
    description: "Led by Master Sommelier James Chen. Explore 6 premium Bordeaux wines from renowned châteaux.",
    colorHex: "#DC2626",
    scope: "sub-event",
    available: 8,
    total: 30,
    price: 0,
    sessionDate: new Date("2026-10-25"),
    sessionTime: "2:00 PM - 3:30 PM",
    parentTicketId: "tkt_general_admission",
  },
  {
    id: "tkt_white_wine_seminar_oct25",
    name: "White Wine & Seafood Pairing",
    description: "Discover the art of pairing white wines with fresh seafood. Featuring wines from Burgundy and the Loire Valley.",
    colorHex: "#FBBF24",
    scope: "sub-event",
    available: 45,
    total: 50,
    price: 0,
    sessionDate: new Date("2026-10-25"),
    sessionTime: "4:00 PM - 5:30 PM",
    parentTicketId: "tkt_general_admission",
  },
  
  // Session 2: Oct 26, 2026
  {
    id: "tkt_champagne_tasting_oct26",
    name: "Champagne & Sparkling Wine Celebration",
    description: "Toast to excellence with a selection of prestigious Champagnes and sparkling wines from around the world.",
    colorHex: "#8B5CF6",
    scope: "sub-event",
    available: 2,
    total: 40,
    price: 0,
    sessionDate: new Date("2026-10-26"),
    sessionTime: "3:00 PM - 4:30 PM",
    parentTicketId: "tkt_general_admission",
  },
  {
    id: "tkt_sake_intro_oct26",
    name: "Introduction to Premium Sake",
    description: "Explore the world of Japanese sake with expert guidance. Learn about different styles and brewing methods.",
    colorHex: "#06B6D4",
    scope: "sub-event",
    available: 22,
    total: 35,
    price: 0,
    sessionDate: new Date("2026-10-26"),
    sessionTime: "5:00 PM - 6:30 PM",
    parentTicketId: "tkt_general_admission",
  },

  // Session 3: Oct 27, 2026
  {
    id: "tkt_italian_wine_oct27",
    name: "Italian Wine Heritage Tour",
    description: "Journey through Italy's most celebrated wine regions from Tuscany to Piedmont with rare vintage tastings.",
    colorHex: "#10B981",
    scope: "sub-event",
    available: 0,
    total: 25,
    price: 0,
    sessionDate: new Date("2026-10-27"),
    sessionTime: "1:00 PM - 2:30 PM",
    parentTicketId: "tkt_general_admission",
  },
  {
    id: "tkt_cheese_wine_oct27",
    name: "Artisan Cheese & Wine Pairing",
    description: "Master the perfect pairings with European artisan cheeses and complementary wines selected by our experts.",
    colorHex: "#F97316",
    scope: "sub-event",
    available: 18,
    total: 30,
    price: 0,
    sessionDate: new Date("2026-10-27"),
    sessionTime: "3:00 PM - 4:30 PM",
    parentTicketId: "tkt_general_admission",
  },

  // VIP-only session
  {
    id: "tkt_collectors_tasting_oct27",
    name: "Collector's Rare Vintage Tasting",
    description: "An exclusive tasting of rare and aged wines from prestigious collections. VIP Lounge Access required.",
    colorHex: "#BE185D",
    scope: "sub-event",
    available: 12,
    total: 20,
    price: 0,
    sessionDate: new Date("2026-10-27"),
    sessionTime: "6:00 PM - 8:00 PM",
    parentTicketId: "tkt_vip_lounge",
  },
]

// Map ticket types with their max bring-along limits
export const ticketBringAlongLimits: Record<string, number> = {
  "tkt_general_admission": 3,
  "tkt_vip_lounge": 2,
}
