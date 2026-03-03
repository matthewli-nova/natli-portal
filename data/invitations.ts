export interface Invitation {
  id: string
  eventId: string
  eventName: string
  firstName: string
  lastName: string
  email: string
  salutation?: string
  title?: string
  organization?: string
  phoneCountryCode?: string
  phoneNumber?: string
  preferredLanguage: "EN" | "TC" | "SC"
  ticketTypes: Array<{
    id: string
    name: string
    colorHex: string
  }>
  invitationStatus: "pending" | "sent" | "opened" | "clicked" | "confirmed" | "declined" | "bounced"
  invitationChannel: "email" | "whatsapp" | "manual"
  lastSentDate?: Date
  representativeType?: "speaker" | "exhibitor" | "sponsor" | "attendee" | "media" | "vip"
  wechatId?: string
  tags?: string[]
  sendCount?: number
  companions?: Array<{
    firstName: string
    lastName: string
    email?: string
  }>
  notes?: string
  createdAt: Date
}

// Aggregated stats per event for the event list view
export interface InvitationEventSummary {
  eventId: string
  eventName: string
  eventStartDate: Date
  eventEndDate: Date
  eventVenue: string
  eventStatus: "Draft" | "Published" | "Live" | "Closed"
  eventCategory: string
  totalInvitations: number
  pending: number
  sent: number
  opened: number
  clicked: number
  confirmed: number
  declined: number
  bounced: number
}

// Mock data for invitations — spread across multiple events
export const mockInvitations: Invitation[] = [
  // ── RTIA Annual Summit 2026 (b2evt_001) ──
  {
    id: "inv_001",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@example.com",
    salutation: "Ms",
    title: "Marketing Director",
    organization: "TechRetail HK",
    phoneCountryCode: "+852",
    phoneNumber: "9123 4567",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
      { id: "tkt_002", name: "Workshop Pass", colorHex: "#DC2626" },
    ],
    invitationStatus: "clicked",
    invitationChannel: "email",
    lastSentDate: new Date("2026-03-15T10:30:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-02-20T10:00:00"),
  },
  {
    id: "inv_002",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "David",
    lastName: "Wong",
    email: "david.wong@corp.hk",
    salutation: "Mr",
    title: "CEO",
    organization: "Wong Holdings Ltd",
    phoneCountryCode: "+852",
    phoneNumber: "9876 5432",
    preferredLanguage: "TC",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "confirmed",
    invitationChannel: "email",
    lastSentDate: new Date("2026-03-14T14:20:00"),
    representativeType: "vip",
    sendCount: 1,
    companions: [
      { firstName: "Amy", lastName: "Wong", email: "amy.wong@corp.hk" },
    ],
    createdAt: new Date("2026-02-18T09:00:00"),
  },
  {
    id: "inv_003",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "Emily",
    lastName: "Lau",
    email: "emily.lau@company.com",
    preferredLanguage: "EN",
    title: "Journalist",
    organization: "SCMP",
    ticketTypes: [
      { id: "tkt_003", name: "VIP Lounge Access", colorHex: "#F59E0B" },
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "opened",
    invitationChannel: "email",
    lastSentDate: new Date("2026-03-16T09:15:00"),
    representativeType: "media",
    sendCount: 1,
    createdAt: new Date("2026-02-22T14:00:00"),
  },
  {
    id: "inv_004",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "Michael",
    lastName: "Lee",
    email: "michael.lee@tech.hk",
    salutation: "Dr",
    title: "CTO",
    organization: "InnoTech Asia",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "sent",
    invitationChannel: "email",
    lastSentDate: new Date("2026-03-17T11:00:00"),
    representativeType: "speaker",
    sendCount: 1,
    createdAt: new Date("2026-02-25T08:30:00"),
  },
  {
    id: "inv_005",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "Jessica",
    lastName: "Chan",
    email: "jessica.chan@business.com",
    preferredLanguage: "TC",
    organization: "Star Ventures",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "pending",
    invitationChannel: "email",
    representativeType: "attendee",
    sendCount: 0,
    createdAt: new Date("2026-02-28T10:00:00"),
  },
  {
    id: "inv_006",
    eventId: "b2evt_001",
    eventName: "RTIA Annual Summit 2026",
    firstName: "Thomas",
    lastName: "Ng",
    email: "thomas.ng@invalid",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "bounced",
    invitationChannel: "email",
    lastSentDate: new Date("2026-03-15T16:45:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-02-20T11:00:00"),
  },

  // ── HKIDEAS 2026 International Design Exhibition (b2evt_003) ──
  {
    id: "inv_007",
    eventId: "b2evt_003",
    eventName: "HKIDEAS 2026 International Design Exhibition",
    firstName: "Rachel",
    lastName: "Ho",
    email: "rachel.ho@sponsor.hk",
    salutation: "Ms",
    title: "Head of Partnerships",
    organization: "DesignCo International",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_003", name: "VIP Lounge Access", colorHex: "#F59E0B" },
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
      { id: "tkt_004", name: "Networking Dinner", colorHex: "#8B5CF6" },
    ],
    invitationStatus: "confirmed",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-16T13:30:00"),
    representativeType: "sponsor",
    sendCount: 1,
    companions: [
      { firstName: "James", lastName: "Ho" },
    ],
    createdAt: new Date("2026-04-01T09:00:00"),
  },
  {
    id: "inv_008",
    eventId: "b2evt_003",
    eventName: "HKIDEAS 2026 International Design Exhibition",
    firstName: "Kevin",
    lastName: "Tam",
    email: "kevin.tam@exhibitor.com",
    preferredLanguage: "SC",
    title: "Exhibition Manager",
    organization: "Tam & Associates",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "declined",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-15T08:00:00"),
    representativeType: "exhibitor",
    sendCount: 1,
    createdAt: new Date("2026-04-02T10:00:00"),
  },
  {
    id: "inv_009",
    eventId: "b2evt_003",
    eventName: "HKIDEAS 2026 International Design Exhibition",
    firstName: "Linda",
    lastName: "Yip",
    email: "linda.yip@design.hk",
    salutation: "Ms",
    title: "Creative Director",
    organization: "YipDesign Studio",
    preferredLanguage: "TC",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
      { id: "tkt_004", name: "Networking Dinner", colorHex: "#8B5CF6" },
    ],
    invitationStatus: "clicked",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-18T10:30:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-04-05T14:00:00"),
  },
  {
    id: "inv_010",
    eventId: "b2evt_003",
    eventName: "HKIDEAS 2026 International Design Exhibition",
    firstName: "Peter",
    lastName: "Fung",
    email: "peter.fung@architects.hk",
    salutation: "Mr",
    title: "Principal Architect",
    organization: "Fung Architects",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_003", name: "VIP Lounge Access", colorHex: "#F59E0B" },
    ],
    invitationStatus: "sent",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-20T09:00:00"),
    representativeType: "vip",
    sendCount: 1,
    createdAt: new Date("2026-04-08T11:00:00"),
  },
  {
    id: "inv_011",
    eventId: "b2evt_003",
    eventName: "HKIDEAS 2026 International Design Exhibition",
    firstName: "Wendy",
    lastName: "Tsang",
    email: "wendy.tsang@media.com",
    preferredLanguage: "TC",
    title: "Editor-in-Chief",
    organization: "Design Digest Asia",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "opened",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-19T14:45:00"),
    representativeType: "media",
    sendCount: 2,
    createdAt: new Date("2026-04-03T09:30:00"),
  },

  // ── Wine & Dine Festival 2026 (b2evt_002) — Draft, only pending ──
  {
    id: "inv_012",
    eventId: "b2evt_002",
    eventName: "Wine & Dine Festival 2026",
    firstName: "Andrew",
    lastName: "Lam",
    email: "andrew.lam@foodie.hk",
    salutation: "Mr",
    title: "Food Critic",
    organization: "HK Foodie Magazine",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "pending",
    invitationChannel: "email",
    representativeType: "media",
    sendCount: 0,
    createdAt: new Date("2026-08-01T10:00:00"),
  },
  {
    id: "inv_013",
    eventId: "b2evt_002",
    eventName: "Wine & Dine Festival 2026",
    firstName: "Grace",
    lastName: "Li",
    email: "grace.li@sommelier.com",
    salutation: "Ms",
    title: "Master Sommelier",
    organization: "Wine Academy Asia",
    preferredLanguage: "TC",
    ticketTypes: [
      { id: "tkt_003", name: "VIP Lounge Access", colorHex: "#F59E0B" },
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "pending",
    invitationChannel: "email",
    representativeType: "speaker",
    sendCount: 0,
    createdAt: new Date("2026-08-02T09:00:00"),
  },

  // ── Digital Marketing Masterclass (b2evt_005) ──
  {
    id: "inv_014",
    eventId: "b2evt_005",
    eventName: "Digital Marketing Masterclass",
    firstName: "Alex",
    lastName: "Chow",
    email: "alex.chow@digmark.hk",
    salutation: "Mr",
    title: "VP Marketing",
    organization: "DigiGrowth Ltd",
    preferredLanguage: "EN",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "confirmed",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-10T09:00:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-03-15T10:00:00"),
  },
  {
    id: "inv_015",
    eventId: "b2evt_005",
    eventName: "Digital Marketing Masterclass",
    firstName: "Natalie",
    lastName: "Kwok",
    email: "natalie.kwok@agency.com",
    preferredLanguage: "EN",
    title: "Account Director",
    organization: "Spark Agency",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "sent",
    invitationChannel: "email",
    lastSentDate: new Date("2026-04-12T11:30:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-03-18T14:00:00"),
  },
  {
    id: "inv_016",
    eventId: "b2evt_005",
    eventName: "Digital Marketing Masterclass",
    firstName: "Raymond",
    lastName: "Hui",
    email: "raymond.hui@startup.io",
    salutation: "Mr",
    preferredLanguage: "TC",
    title: "Founder",
    organization: "MarketPulse",
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", colorHex: "#107DAC" },
    ],
    invitationStatus: "opened",
    invitationChannel: "whatsapp",
    lastSentDate: new Date("2026-04-11T10:00:00"),
    representativeType: "attendee",
    sendCount: 1,
    createdAt: new Date("2026-03-20T09:00:00"),
  },
]

// Helper to compute event summaries from invitation data
export function getInvitationEventSummaries(): InvitationEventSummary[] {
  const eventMap = new Map<string, InvitationEventSummary>()

  // Pre-populate with known events (from b2b-events mock data)
  const knownEvents: Array<{
    id: string
    name: string
    startDate: Date
    endDate: Date
    venue: string
    status: "Draft" | "Published" | "Live" | "Closed"
    category: string
  }> = [
    {
      id: "b2evt_001",
      name: "RTIA Annual Summit 2026",
      startDate: new Date("2026-03-15T09:00:00"),
      endDate: new Date("2026-03-17T18:00:00"),
      venue: "Hong Kong Convention & Exhibition Centre",
      status: "Published",
      category: "Conference",
    },
    {
      id: "b2evt_002",
      name: "Wine & Dine Festival 2026",
      startDate: new Date("2026-10-28T11:00:00"),
      endDate: new Date("2026-11-01T22:00:00"),
      venue: "Central Harbourfront",
      status: "Draft",
      category: "Festival",
    },
    {
      id: "b2evt_003",
      name: "HKIDEAS 2026 International Design Exhibition",
      startDate: new Date("2026-05-15T09:00:00"),
      endDate: new Date("2026-05-17T18:00:00"),
      venue: "Hong Kong Convention & Exhibition Centre",
      status: "Live",
      category: "Exhibition",
    },
    {
      id: "b2evt_005",
      name: "Digital Marketing Masterclass",
      startDate: new Date("2026-04-20T09:00:00"),
      endDate: new Date("2026-04-21T17:00:00"),
      venue: "Cyberport",
      status: "Published",
      category: "Workshop",
    },
  ]

  for (const evt of knownEvents) {
    eventMap.set(evt.id, {
      eventId: evt.id,
      eventName: evt.name,
      eventStartDate: evt.startDate,
      eventEndDate: evt.endDate,
      eventVenue: evt.venue,
      eventStatus: evt.status,
      eventCategory: evt.category,
      totalInvitations: 0,
      pending: 0,
      sent: 0,
      opened: 0,
      clicked: 0,
      confirmed: 0,
      declined: 0,
      bounced: 0,
    })
  }

  for (const inv of mockInvitations) {
    const summary = eventMap.get(inv.eventId)
    if (summary) {
      summary.totalInvitations++
      summary[inv.invitationStatus]++
    }
  }

  return Array.from(eventMap.values())
}
