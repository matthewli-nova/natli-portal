// Event data types and mock data based on FDR specification

export type EventStatus = "Draft" | "Published" | "Live" | "Closed"

export type EventCategory = 
  | "Conference"
  | "Exhibition" 
  | "Festival"
  | "Gala"
  | "Workshop"
  | "Seminar"
  | "Networking"
  | "Ceremony"
  | "Corporate"

export const eventTypesByCategory: Record<EventCategory, string[]> = {
  Conference: ["Summit", "Symposium", "Forum", "Congress"],
  Exhibition: ["Trade Show", "Expo", "Showcase", "Fair"],
  Festival: ["Food & Beverage", "Music", "Arts", "Cultural", "Seasonal"],
  Gala: ["Awards Ceremony", "Charity Dinner", "Annual Dinner", "Fundraiser"],
  Workshop: ["Training", "Masterclass", "Hackathon", "Bootcamp"],
  Seminar: ["Webinar", "Lecture", "Briefing", "Roundtable"],
  Networking: ["Mixer", "Reception", "Meet & Greet", "Business Matching"],
  Ceremony: ["Opening", "Closing", "Graduation", "Launch"],
  Corporate: ["AGM", "Board Meeting", "Town Hall", "Team Building"]
}

export interface MultilingualText {
  en: string
  tc?: string
  sc?: string
}

export interface B2BEvent {
  id: string
  name: MultilingualText
  description?: MultilingualText
  category: EventCategory
  type?: string
  startDateTime: Date
  endDateTime: Date
  venue: MultilingualText
  address?: MultilingualText
  quota: number
  rsvpDeadline?: Date
  logo?: string
  banner?: string
  primaryColor?: string
  status: EventStatus
  totalRegistered: number
  createdAt: Date
  updatedAt: Date
  // Optional fields used by event detail / list views
  schedulePublishedDate?: Date
  sessionCount?: number
  branding?: { logoUrl?: string; bannerUrl?: string; primaryColour?: string }
}

// Simplified event type for linking (used in registration wizard)
export interface EventForLinking {
  id: string
  name: string
  startDate: Date
  endDate: Date
  venue: string
}

// Simplified events for linking (used in wizard)
export const mockEventsForLinking: EventForLinking[] = [
  {
    id: "evt_wine_dine_2026",
    name: "Hong Kong Wine & Dine Festival 2026",
    startDate: new Date("2026-10-25T10:00:00"),
    endDate: new Date("2026-10-28T22:00:00"),
    venue: "Central Harbourfront Event Space",
  },
  {
    id: "b2evt_001",
    name: "RTIA Annual Summit 2026",
    startDate: new Date("2026-03-15T09:00:00"),
    endDate: new Date("2026-03-17T18:00:00"),
    venue: "Hong Kong Convention & Exhibition Centre",
  },
  {
    id: "b2evt_003",
    name: "HKIDEAS 2026 International Design Exhibition",
    startDate: new Date("2026-05-15T09:00:00"),
    endDate: new Date("2026-05-17T18:00:00"),
    venue: "Hong Kong Convention & Exhibition Centre",
  },
]

// Mock data based on sample data from FDR Section 4.1
export const mockEvents: B2BEvent[] = [
  {
    id: "b2evt_001",
    name: {
      en: "RTIA Annual Summit 2026",
      tc: "RTIA 年度峰會 2026",
      sc: "RTIA 年度峰会 2026"
    },
    description: {
      en: "Join industry leaders and innovators for the premier retail technology summit in Asia.",
      tc: "與業界領袖和創新者一同參加亞洲首屈一指的零售科技峰會。",
      sc: "与业界领袖和创新者一同参加亚洲首屈一指的零售科技峰会。"
    },
    category: "Conference",
    type: "Summit",
    startDateTime: new Date("2026-03-15T09:00:00"),
    endDateTime: new Date("2026-03-17T18:00:00"),
    venue: {
      en: "Hong Kong Convention & Exhibition Centre",
      tc: "香港會議展覽中心",
      sc: "香港会议展览中心"
    },
    address: {
      en: "1 Expo Drive, Wan Chai, Hong Kong",
      tc: "香港灣仔博覽道1號",
      sc: "香港湾仔博览道1号"
    },
    quota: 500,
    rsvpDeadline: new Date("2026-03-10T23:59:00"),
    primaryColor: "#107DAC",
    status: "Published",
    totalRegistered: 342,
    createdAt: new Date("2026-01-15T10:00:00"),
    updatedAt: new Date("2026-02-20T14:30:00")
  },
  {
    id: "b2evt_002",
    name: {
      en: "Wine & Dine Festival 2026",
      tc: "美酒佳餚節 2026",
      sc: "美酒佳肴节 2026"
    },
    description: {
      en: "Experience the finest wines and culinary delights from around the world.",
      tc: "體驗來自世界各地的頂級美酒和美食。",
      sc: "体验来自世界各地的顶级美酒和美食。"
    },
    category: "Festival",
    type: "Food & Beverage",
    startDateTime: new Date("2026-10-28T11:00:00"),
    endDateTime: new Date("2026-11-01T22:00:00"),
    venue: {
      en: "Central Harbourfront",
      tc: "中環海濱",
      sc: "中环海滨"
    },
    quota: 2000,
    status: "Draft",
    totalRegistered: 0,
    createdAt: new Date("2026-02-10T09:15:00"),
    updatedAt: new Date("2026-02-10T09:15:00")
  },
  {
    id: "b2evt_003",
    name: {
      en: "HKIDEAS 2026 International Design Exhibition",
      tc: "HKIDEAS 2026 國際設計展",
      sc: "HKIDEAS 2026 国际设计展"
    },
    description: {
      en: "Asia's premier design exhibition showcasing innovative products, sustainable materials, and emerging design talent from across the region. Features 200+ exhibitors, live demonstrations, and keynote sessions from industry leaders.",
      tc: "亞洲首屈一指的設計展覽，展示創新產品、可持續材料及區內新興設計人才。設有逾200個參展商、現場示範及業界領袖主題演講。",
      sc: "亚洲首屈一指的设计展览，展示创新产品、可持续材料及区内新兴设计人才。设有逾200个参展商、现场示范及业界领袖主题演讲。"
    },
    category: "Exhibition",
    type: "Expo",
    startDateTime: new Date("2026-05-15T09:00:00"),
    endDateTime: new Date("2026-05-17T18:00:00"),
    venue: {
      en: "Hong Kong Convention & Exhibition Centre",
      tc: "香港會議展覽中心",
      sc: "香港会议展览中心"
    },
    address: {
      en: "1 Expo Drive, Wan Chai, Hong Kong",
      tc: "香港灣仔博覽道1號",
      sc: "香港湾仔博览道1号"
    },
    quota: 500,
    rsvpDeadline: new Date("2026-05-10T23:59:00"),
    primaryColor: "#00B5AD",
    status: "Live",
    totalRegistered: 487,
    createdAt: new Date("2025-12-01T08:00:00"),
    updatedAt: new Date("2026-02-26T16:45:00")
  },
  {
    id: "b2evt_004",
    name: {
      en: "Tech Innovation Awards Gala 2025",
      tc: "科技創新大獎晚宴 2025",
      sc: "科技创新大奖晚宴 2025"
    },
    category: "Gala",
    type: "Awards Ceremony",
    startDateTime: new Date("2025-12-10T18:30:00"),
    endDateTime: new Date("2025-12-10T23:00:00"),
    venue: {
      en: "The Ritz-Carlton Hong Kong",
      tc: "香港麗思卡爾頓酒店",
      sc: "香港丽思卡尔顿酒店"
    },
    quota: 300,
    status: "Closed",
    totalRegistered: 295,
    createdAt: new Date("2025-09-01T10:00:00"),
    updatedAt: new Date("2025-12-11T09:00:00")
  },
  {
    id: "b2evt_005",
    name: {
      en: "Digital Marketing Masterclass",
      tc: "數碼營銷大師班",
      sc: "数码营销大师班"
    },
    description: {
      en: "Intensive two-day workshop covering the latest digital marketing strategies and tools.",
      tc: "為期兩天的密集工作坊，涵蓋最新的數碼營銷策略和工具。",
      sc: "为期两天的密集工作坊，涵盖最新的数码营销策略和工具。"
    },
    category: "Workshop",
    type: "Masterclass",
    startDateTime: new Date("2026-04-20T09:00:00"),
    endDateTime: new Date("2026-04-21T17:00:00"),
    venue: {
      en: "Cyberport",
      tc: "數碼港",
      sc: "数码港"
    },
    quota: 50,
    rsvpDeadline: new Date("2026-04-15T23:59:00"),
    status: "Published",
    totalRegistered: 38,
    createdAt: new Date("2026-02-01T11:00:00"),
    updatedAt: new Date("2026-02-25T10:30:00")
  }
]

// Status badge color mappings
export const statusColors: Record<EventStatus, { bg: string; text: string; border: string }> = {
  Draft: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-muted-foreground/20"
  },
  Published: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  Live: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800"
  },
  Closed: {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-500",
    border: "border-gray-200 dark:border-gray-800"
  }
}

// Session types and data
export type AccessType = "Admission Required" | "Open to All"

export interface Session {
  id: string
  eventId: string
  name: MultilingualText
  description?: MultilingualText
  sessionDate: Date
  startTime: Date
  endTime: Date
  venueRoom?: string
  accessType: AccessType
  capacity: number
  admittedCount: number
  depth: 0 | 1 // 0 = top-level, 1 = sub-event
  parentSessionId?: string
  additionalFee?: number // Only for sub-events (depth=1)
  imageUrl?: string // Only for sub-events
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Access type badge color mappings
export const accessTypeBadgeColors: Record<AccessType, { bg: string; text: string; border: string }> = {
  "Admission Required": {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  "Open to All": {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-muted-foreground/20"
  }
}

// Mock session data based on FDR Section 4.1
export const mockSessions: Session[] = [
  // RTIA Annual Summit 2026 sessions
  {
    id: "sess_001",
    eventId: "b2evt_001",
    name: {
      en: "Opening Keynote",
      tc: "開幕主題演講",
      sc: "开幕主题演讲"
    },
    description: {
      en: "Industry leaders share their vision for the future of retail technology.",
      tc: "業界領袖分享零售科技的未來願景。",
      sc: "业界领袖分享零售科技的未来愿景。"
    },
    sessionDate: new Date("2026-03-15"),
    startTime: new Date("2026-03-15T09:00:00"),
    endTime: new Date("2026-03-15T10:30:00"),
    venueRoom: "Hall 1",
    accessType: "Open to All",
    capacity: 500,
    admittedCount: 342,
    depth: 0,
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2026-02-01T10:00:00"),
    updatedAt: new Date("2026-02-01T10:00:00")
  },
  {
    id: "sess_002",
    eventId: "b2evt_001",
    name: {
      en: "Workshop: Digital Transformation",
      tc: "工作坊：數位轉型",
      sc: "工作坊：数字转型"
    },
    description: {
      en: "Hands-on workshop exploring practical strategies for digital transformation in retail.",
      tc: "探索零售業數位轉型實用策略的實作工作坊。",
      sc: "探索零售业数字转型实用策略的实作工作坊。"
    },
    sessionDate: new Date("2026-03-15"),
    startTime: new Date("2026-03-15T11:00:00"),
    endTime: new Date("2026-03-15T12:30:00"),
    venueRoom: "Room 201",
    accessType: "Admission Required",
    capacity: 80,
    admittedCount: 65,
    depth: 0,
    sortOrder: 2,
    isActive: true,
    createdAt: new Date("2026-02-01T10:00:00"),
    updatedAt: new Date("2026-02-01T10:00:00")
  },
  {
    id: "sess_003",
    eventId: "b2evt_001",
    name: {
      en: "Panel Discussion: AI in Retail",
      tc: "專題討論：零售業中的人工智能",
      sc: "专题讨论：零售业中的人工智能"
    },
    sessionDate: new Date("2026-03-16"),
    startTime: new Date("2026-03-16T14:00:00"),
    endTime: new Date("2026-03-16T15:30:00"),
    venueRoom: "Hall 2",
    accessType: "Open to All",
    capacity: 300,
    admittedCount: 210,
    depth: 0,
    sortOrder: 3,
    isActive: true,
    createdAt: new Date("2026-02-01T10:00:00"),
    updatedAt: new Date("2026-02-01T10:00:00")
  },
  // Wine & Dine Festival 2026 sessions with sub-events
  {
    id: "sess_004",
    eventId: "b2evt_002",
    name: {
      en: "Wine Tasting Pavilion",
      tc: "品酒展館",
      sc: "品酒展馆"
    },
    description: {
      en: "Explore premium wines from around the world with expert sommeliers.",
      tc: "與專業侍酒師一起探索來自世界各地的優質葡萄酒。",
      sc: "与专业侍酒师一起探索来自世界各地的优质葡萄酒。"
    },
    sessionDate: new Date("2026-10-28"),
    startTime: new Date("2026-10-28T13:00:00"),
    endTime: new Date("2026-10-28T18:00:00"),
    venueRoom: "Pavilion A",
    accessType: "Admission Required",
    capacity: 200,
    admittedCount: 0,
    depth: 0,
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2026-02-10T09:30:00"),
    updatedAt: new Date("2026-02-10T09:30:00")
  },
  {
    id: "sess_005",
    eventId: "b2evt_002",
    name: {
      en: "Red Wine Masterclass",
      tc: "紅酒大師班",
      sc: "红酒大师班"
    },
    description: {
      en: "Deep dive into the world of red wines with professional tasting techniques.",
      tc: "透過專業品酒技巧深入探索紅酒世界。",
      sc: "透过专业品酒技巧深入探索红酒世界。"
    },
    sessionDate: new Date("2026-10-28"),
    startTime: new Date("2026-10-28T14:00:00"),
    endTime: new Date("2026-10-28T15:30:00"),
    accessType: "Admission Required",
    capacity: 30,
    admittedCount: 0,
    depth: 1,
    parentSessionId: "sess_004",
    additionalFee: 200.00,
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2026-02-10T09:35:00"),
    updatedAt: new Date("2026-02-10T09:35:00")
  },
  {
    id: "sess_006",
    eventId: "b2evt_002",
    name: {
      en: "White Wine Masterclass",
      tc: "白酒大師班",
      sc: "白酒大师班"
    },
    description: {
      en: "Discover the elegance and complexity of white wines from renowned regions.",
      tc: "探索來自著名產區的白葡萄酒的優雅與複雜性。",
      sc: "探索来自著名产区的白葡萄酒的优雅与复杂性。"
    },
    sessionDate: new Date("2026-10-28"),
    startTime: new Date("2026-10-28T16:00:00"),
    endTime: new Date("2026-10-28T17:30:00"),
    accessType: "Admission Required",
    capacity: 30,
    admittedCount: 0,
    depth: 1,
    parentSessionId: "sess_004",
    additionalFee: 200.00,
    imageUrl: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400",
    sortOrder: 2,
    isActive: true,
    createdAt: new Date("2026-02-10T09:36:00"),
    updatedAt: new Date("2026-02-10T09:36:00")
  },
  {
    id: "sess_007",
    eventId: "b2evt_002",
    name: {
      en: "Chef's Table Experience",
      tc: "主廚餐桌體驗",
      sc: "主厨餐桌体验"
    },
    description: {
      en: "Intimate dining experience with Michelin-starred chefs.",
      tc: "與米芝蓮星級廚師的私密用餐體驗。",
      sc: "与米其林星级厨师的私密用餐体验。"
    },
    sessionDate: new Date("2026-10-29"),
    startTime: new Date("2026-10-29T19:00:00"),
    endTime: new Date("2026-10-29T22:00:00"),
    venueRoom: "Private Dining Room",
    accessType: "Admission Required",
    capacity: 20,
    admittedCount: 0,
    depth: 0,
    sortOrder: 2,
    isActive: true,
    createdAt: new Date("2026-02-10T09:37:00"),
    updatedAt: new Date("2026-02-10T09:37:00")
  }
]