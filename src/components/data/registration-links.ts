export interface RegistrationLink {
  id: string
  eventId: string
  eventName: string
  ticketTypeId: string
  ticketTypeName: string
  ticketTypeColor: string
  sessionIds: string[]
  sessionNames: string[]
  
  // Statistics
  stats: {
    opened: number
    registered: number
    declined: number
    totalAttendees: number // includes companions
  }
  
  // Configuration
  config: {
    allowCompanions: boolean
    maxCompanions: number
    companionDetailsLevel: 'names-only' | 'full-details'
    prefillCompanionNames?: Array<{ firstName: string; lastName: string }>
    fieldTypes?: {
      firstName: string
      lastName: string
      email: string
      salutation: string
      title: string
      organization: string
      phone: string
      wechatId: string
      representativeType: string
      referenceNo: string
      tags: string
    }
    
    // Field visibility
    visibleFields: {
      salutation: boolean
      title: boolean
      organization: boolean
      phone: boolean
      wechatId: boolean
      representativeType: boolean
      referenceNo: boolean
      tags: boolean
    }
    
    // Field required status
    requiredFields: {
      firstName: boolean
      lastName: boolean
      email: boolean
      salutation: boolean
      title: boolean
      organization: boolean
      phone: boolean
      wechatId: boolean
      representativeType: boolean
      referenceNo: boolean
      tags: boolean
    }
    
    // Field labels (customizable)
    fieldLabels: {
      salutation: string
      firstName: string
      lastName: string
      email: string
      title: string
      organization: string
      phone: string
      areaCode: string
      wechatId: string
      representativeType: string
      referenceNo: string
      tags: string
      preferredLanguage: string
    }
    
    // Content
    bannerImageUrl?: string
    description: string
    signatory?: string
    footer?: string
    
    // Schedule
    activationDate?: Date
    expiryDate?: Date
    
    // Quota
    linkQuota: number // separate from ticket quota
    quotaUsed: number
  }
  
  // Link details
  linkUrl: string
  status: 'draft' | 'active' | 'expired' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export const mockRegistrationLinks: RegistrationLink[] = [
  {
    id: 'reglink_001',
    eventId: 'evt_wine_dine_2026',
    eventName: 'Hong Kong Wine & Dine Festival 2026',
    ticketTypeId: 'tkt_general_admission',
    ticketTypeName: 'General Admission',
    ticketTypeColor: '#107DAC',
    sessionIds: ['tkt_red_wine_masterclass_oct25', 'tkt_white_wine_seminar_oct25'],
    sessionNames: ['Red Wine Tasting Masterclass', 'White Wine & Seafood Pairing'],
    stats: {
      opened: 156,
      registered: 89,
      declined: 12,
      totalAttendees: 142, // 89 + 53 companions
    },
    config: {
      allowCompanions: true,
      maxCompanions: 3,
      companionDetailsLevel: 'names-only',
      visibleFields: {
        salutation: true,
        title: true,
        organization: true,
        phone: true,
        wechatId: true,
        representativeType: true,
        referenceNo: false,
        tags: true,
      },
      requiredFields: {
        firstName: true,
        lastName: true,
        email: true,
        salutation: false,
        title: false,
        organization: false,
        phone: true,
        wechatId: false,
        representativeType: false,
        referenceNo: false,
        tags: false,
      },
      fieldLabels: {
        salutation: 'Salutation',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        title: 'Title',
        organization: 'Organization',
        phone: 'Phone Number',
        areaCode: 'Area Code',
        wechatId: 'WeChat ID',
        representativeType: 'Representative Type',
        referenceNo: 'Reference No',
        tags: 'Tags',
        preferredLanguage: 'Preferred Language',
      },
      description: 'Join us for an unforgettable wine tasting experience at Hong Kong\'s premier culinary festival.',
      signatory: 'Hong Kong Tourism Board',
      footer: 'For inquiries, contact events@hktb.com',
      activationDate: new Date('2026-09-01T00:00:00'),
      expiryDate: new Date('2026-10-24T23:59:59'),
      linkQuota: 150,
      quotaUsed: 89,
    },
    linkUrl: 'https://events.lepos.co/wine-dine-2026/register/A1B2C3',
    status: 'active',
    createdAt: new Date('2026-08-15T10:00:00'),
    updatedAt: new Date('2026-09-20T15:30:00'),
  },
  {
    id: 'reglink_002',
    eventId: 'evt_wine_dine_2026',
    eventName: 'Hong Kong Wine & Dine Festival 2026',
    ticketTypeId: 'tkt_vip_lounge',
    ticketTypeName: 'VIP Lounge Access',
    ticketTypeColor: '#F59E0B',
    sessionIds: ['tkt_collectors_tasting_oct27'],
    sessionNames: ["Collector's Rare Vintage Tasting"],
    stats: {
      opened: 45,
      registered: 28,
      declined: 5,
      totalAttendees: 45, // 28 + 17 companions
    },
    config: {
      allowCompanions: true,
      maxCompanions: 2,
      companionDetailsLevel: 'full-details',
      visibleFields: {
        salutation: true,
        title: true,
        organization: true,
        phone: true,
        wechatId: true,
        representativeType: true,
        referenceNo: false,
        tags: true,
      },
      requiredFields: {
        firstName: true,
        lastName: true,
        email: true,
        salutation: false,
        title: false,
        organization: false,
        phone: true,
        wechatId: false,
        representativeType: false,
        referenceNo: false,
        tags: false,
      },
      fieldLabels: {
        salutation: 'Salutation',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        title: 'Title',
        organization: 'Organization',
        phone: 'Phone Number',
        areaCode: 'Area Code',
        wechatId: 'WeChat ID',
        representativeType: 'Representative Type',
        referenceNo: 'Reference No',
        tags: 'Tags',
        preferredLanguage: 'Preferred Language',
      },
      bannerImageUrl: undefined,
      description: 'Exclusive VIP experience with rare vintage tastings and gourmet canapés in our premium lounge.',
      signatory: 'VIP Concierge Team',
      footer: 'VIP Hotline: +852 1234 5678',
      activationDate: new Date('2026-09-01T00:00:00'),
      expiryDate: new Date('2026-10-24T23:59:59'),
      linkQuota: 50,
      quotaUsed: 28,
    },
    linkUrl: 'https://events.lepos.co/wine-dine-2026/register/VIP789',
    status: 'active',
    createdAt: new Date('2026-08-15T10:30:00'),
    updatedAt: new Date('2026-09-18T14:20:00'),
  },
  {
    id: 'reglink_003',
    eventId: 'evt_wine_dine_2026',
    eventName: 'Hong Kong Wine & Dine Festival 2026',
    ticketTypeId: 'tkt_general_admission',
    ticketTypeName: 'General Admission',
    ticketTypeColor: '#107DAC',
    sessionIds: ['tkt_champagne_tasting_oct26', 'tkt_sake_intro_oct26'],
    sessionNames: ['Champagne & Sparkling Wine Celebration', 'Introduction to Premium Sake'],
    stats: {
      opened: 0,
      registered: 0,
      declined: 0,
      totalAttendees: 0,
    },
    config: {
      allowCompanions: false,
      maxCompanions: 0,
      companionDetailsLevel: 'names-only',
      visibleFields: {
        salutation: false,
        title: false,
        organization: false,
        phone: true,
        wechatId: false,
        representativeType: false,
        referenceNo: false,
        tags: false,
      },
      requiredFields: {
        firstName: true,
        lastName: true,
        email: true,
        salutation: false,
        title: false,
        organization: false,
        phone: true,
        wechatId: false,
        representativeType: false,
        referenceNo: false,
        tags: false,
      },
      fieldLabels: {
        salutation: 'Salutation',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        title: 'Title',
        organization: 'Organization',
        phone: 'Phone Number',
        areaCode: 'Area Code',
        wechatId: 'WeChat ID',
        representativeType: 'Representative Type',
        referenceNo: 'Reference No',
        tags: 'Tags',
        preferredLanguage: 'Preferred Language',
      },
      description: 'Special invitation for Oct 26 sessions only.',
      footer: 'Limited availability',
      linkQuota: 30,
      quotaUsed: 0,
    },
    linkUrl: 'https://events.lepos.co/wine-dine-2026/register/OCT26X',
    status: 'draft',
    createdAt: new Date('2026-09-22T09:00:00'),
    updatedAt: new Date('2026-09-22T09:00:00'),
  },
]