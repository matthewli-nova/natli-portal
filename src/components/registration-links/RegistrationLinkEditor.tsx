"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Card } from "../ui/card"
import { Calendar } from "../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../ui/utils"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable"
import { Calendar as CalendarIcon, Copy, Check, Upload, ArrowLeft, CalendarDays, MapPin, GripVertical, Plus, Trash2, Code, FileText, Image, X, Globe, Mail, Send, Clock, CheckCircle2, AlertCircle, RotateCw, Smartphone, Tablet, Monitor, Ticket, Users } from "lucide-react"
import { format } from "date-fns"
import { type RegistrationLink } from "../data/registration-links"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { mockEventsForLinking } from "../data/b2b-events"
import { mockEventTickets, mockSubEventTickets } from "../data/registration-events"
import { getDefaultRegistrationFormHtml } from "./default-registration-form"

type EmailLang = 'EN' | 'TC' | 'SC'

interface MultiLangString {
  EN: string
  TC: string
  SC: string
}

const LANG_LABELS: Record<EmailLang, string> = { EN: 'EN', TC: '繁中', SC: '简中' }

function LanguageTabs({ value, onChange }: { value: EmailLang; onChange: (v: EmailLang) => void }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-md p-0.5 gap-0.5">
      {(['EN', 'TC', 'SC'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={cn(
            "px-2.5 py-1 rounded text-xs font-medium transition-colors",
            value === lang
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  )
}

function createMultiLang(en: string, tc: string = '', sc: string = ''): MultiLangString {
  return { EN: en, TC: tc, SC: sc }
}

// ── Responsive Preview Device Presets ──────────────────────────────────────
type DeviceCategory = 'mobile' | 'tablet' | 'desktop'

interface DevicePreset {
  id: string
  label: string
  shortLabel: string
  width: number | null // null = 100%
  category: DeviceCategory
}

const DEVICE_PRESETS: DevicePreset[] = [
  // ── Mobile · Apple iPhone ─────────────────────────────────
  { id: 'iphone-se',           label: 'iPhone SE',                   shortLabel: '375', width: 375, category: 'mobile' },
  { id: 'iphone-12-mini',     label: 'iPhone 12 Mini',              shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'iphone-13',          label: 'iPhone 13 / 14',              shortLabel: '390', width: 390, category: 'mobile' },
  { id: 'iphone-14-plus',     label: 'iPhone 14 Plus',              shortLabel: '428', width: 428, category: 'mobile' },
  { id: 'iphone-14-pro',      label: 'iPhone 14 Pro',               shortLabel: '393', width: 393, category: 'mobile' },
  { id: 'iphone-14-pro-max',  label: 'iPhone 14 Pro Max',           shortLabel: '430', width: 430, category: 'mobile' },
  { id: 'iphone-15',          label: 'iPhone 15 / 16',              shortLabel: '393', width: 393, category: 'mobile' },
  { id: 'iphone-15-plus',     label: 'iPhone 15 Plus / 16 Plus',    shortLabel: '430', width: 430, category: 'mobile' },
  { id: 'iphone-15-pro-max',  label: 'iPhone 15 Pro Max',           shortLabel: '430', width: 430, category: 'mobile' },
  { id: 'iphone-16-pro',      label: 'iPhone 16 Pro',               shortLabel: '402', width: 402, category: 'mobile' },
  { id: 'iphone-16-pro-max',  label: 'iPhone 16 Pro Max',           shortLabel: '440', width: 440, category: 'mobile' },
  { id: 'iphone-17',          label: 'iPhone 17',                   shortLabel: '393', width: 393, category: 'mobile' },
  { id: 'iphone-17-air',      label: 'iPhone 17 Air',               shortLabel: '393', width: 393, category: 'mobile' },
  { id: 'iphone-17-pro',      label: 'iPhone 17 Pro',               shortLabel: '402', width: 402, category: 'mobile' },
  { id: 'iphone-17-pro-max',  label: 'iPhone 17 Pro Max',           shortLabel: '440', width: 440, category: 'mobile' },
  // ── Mobile · Samsung Galaxy ───────────────────────────────
  { id: 'galaxy-s23',          label: 'Galaxy S23',                  shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'galaxy-s23-plus',     label: 'Galaxy S23+',                 shortLabel: '384', width: 384, category: 'mobile' },
  { id: 'galaxy-s23-ultra',    label: 'Galaxy S23 Ultra',            shortLabel: '384', width: 384, category: 'mobile' },
  { id: 'galaxy-s24',          label: 'Galaxy S24',                  shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'galaxy-s24-plus',     label: 'Galaxy S24+',                 shortLabel: '384', width: 384, category: 'mobile' },
  { id: 'galaxy-s24-ultra',    label: 'Galaxy S24 Ultra',            shortLabel: '384', width: 384, category: 'mobile' },
  { id: 'galaxy-s25',          label: 'Galaxy S25',                  shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'galaxy-s25-plus',     label: 'Galaxy S25+',                 shortLabel: '384', width: 384, category: 'mobile' },
  { id: 'galaxy-s25-ultra',    label: 'Galaxy S25 Ultra',            shortLabel: '412', width: 412, category: 'mobile' },
  { id: 'galaxy-z-fold5',      label: 'Galaxy Z Fold5 (Cover)',      shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'galaxy-z-fold5-open', label: 'Galaxy Z Fold5 (Inner)',      shortLabel: '600', width: 600, category: 'mobile' },
  { id: 'galaxy-z-flip5',      label: 'Galaxy Z Flip5',              shortLabel: '360', width: 360, category: 'mobile' },
  { id: 'galaxy-a54',          label: 'Galaxy A54 / A55',            shortLabel: '412', width: 412, category: 'mobile' },

  // ── Tablet · Apple iPad ───────────────────────────────────
  { id: 'ipad-mini-6',   label: 'iPad Mini 6th',            shortLabel: '744',  width: 744,  category: 'tablet' },
  { id: 'ipad-mini-7',   label: 'iPad Mini 7th',            shortLabel: '744',  width: 744,  category: 'tablet' },
  { id: 'ipad-10th',     label: 'iPad 10th Gen',            shortLabel: '820',  width: 820,  category: 'tablet' },
  { id: 'ipad-air-11',   label: 'iPad Air 11″ (M2)',        shortLabel: '820',  width: 820,  category: 'tablet' },
  { id: 'ipad-air-13',   label: 'iPad Air 13″ (M2)',        shortLabel: '1024', width: 1024, category: 'tablet' },
  { id: 'ipad-pro-11',   label: 'iPad Pro 11″ (M4)',        shortLabel: '834',  width: 834,  category: 'tablet' },
  { id: 'ipad-pro-13',   label: 'iPad Pro 13″ (M4)',        shortLabel: '1024', width: 1024, category: 'tablet' },
  // ── Tablet · Microsoft Surface ──────────────────────���─────
  { id: 'surface-go-4',    label: 'Surface Go 4',             shortLabel: '768',  width: 768,  category: 'tablet' },
  { id: 'surface-pro-8',   label: 'Surface Pro 8',            shortLabel: '912',  width: 912,  category: 'tablet' },
  { id: 'surface-pro-9',   label: 'Surface Pro 9',            shortLabel: '912',  width: 912,  category: 'tablet' },
  { id: 'surface-pro-10',  label: 'Surface Pro 10',           shortLabel: '912',  width: 912,  category: 'tablet' },
  { id: 'surface-pro-11',  label: 'Surface Pro 11th Ed.',     shortLabel: '912',  width: 912,  category: 'tablet' },
  // ── Tablet · Samsung Galaxy Tab ───────────────────────────
  { id: 'galaxy-tab-a8',       label: 'Galaxy Tab A8',          shortLabel: '800',  width: 800,  category: 'tablet' },
  { id: 'galaxy-tab-s8',       label: 'Galaxy Tab S8',          shortLabel: '800',  width: 800,  category: 'tablet' },
  { id: 'galaxy-tab-s8-plus',  label: 'Galaxy Tab S8+',         shortLabel: '834',  width: 834,  category: 'tablet' },
  { id: 'galaxy-tab-s8-ultra', label: 'Galaxy Tab S8 Ultra',    shortLabel: '960',  width: 960,  category: 'tablet' },
  { id: 'galaxy-tab-s9',       label: 'Galaxy Tab S9',          shortLabel: '800',  width: 800,  category: 'tablet' },
  { id: 'galaxy-tab-s9-plus',  label: 'Galaxy Tab S9+',         shortLabel: '834',  width: 834,  category: 'tablet' },
  { id: 'galaxy-tab-s9-ultra', label: 'Galaxy Tab S9 Ultra',    shortLabel: '960',  width: 960,  category: 'tablet' },
  { id: 'galaxy-tab-s10-ultra',label: 'Galaxy Tab S10 Ultra',   shortLabel: '960',  width: 960,  category: 'tablet' },
  // ── Tablet · Android Other ────────────────────────────────
  { id: 'pixel-tablet',    label: 'Pixel Tablet',              shortLabel: '834',  width: 834,  category: 'tablet' },
  { id: 'lenovo-tab-p12',  label: 'Lenovo Tab P12 Pro',        shortLabel: '960',  width: 960,  category: 'tablet' },
  { id: 'xiaomi-pad-6',    label: 'Xiaomi Pad 6',              shortLabel: '800',  width: 800,  category: 'tablet' },

  // ── Desktop · MacBook ─────────────────────────────────────
  { id: 'macbook-air-13',  label: 'MacBook Air 13″',           shortLabel: '1280', width: 1280, category: 'desktop' },
  { id: 'macbook-air-15',  label: 'MacBook Air 15″',           shortLabel: '1440', width: 1440, category: 'desktop' },
  { id: 'macbook-pro-14',  label: 'MacBook Pro 14″',           shortLabel: '1512', width: 1512, category: 'desktop' },
  { id: 'macbook-pro-16',  label: 'MacBook Pro 16″',           shortLabel: '1728', width: 1728, category: 'desktop' },
  // ── Desktop · Standard Resolutions ────────────────────────
  { id: 'desktop-hd',      label: 'HD (720p)',                  shortLabel: '1280', width: 1280, category: 'desktop' },
  { id: 'desktop-fhd',     label: 'Full HD (1080p)',            shortLabel: '1920', width: 1920, category: 'desktop' },
  { id: 'desktop-qhd',     label: 'QHD (1440p)',                shortLabel: '2560', width: 2560, category: 'desktop' },
  { id: 'desktop-4k',      label: '4K UHD (2160p)',             shortLabel: '3840', width: 3840, category: 'desktop' },
  { id: 'desktop-full',    label: 'Full Width',                 shortLabel: '100%', width: null, category: 'desktop' },
]

const CATEGORY_ICON: Record<DeviceCategory, React.ReactNode> = {
  mobile: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
}

const CATEGORY_LABEL: Record<DeviceCategory, string> = {
  mobile: 'Mobile',
  tablet: 'Tablet',
  desktop: 'Desktop',
}

// Sub-group labels for dropdown section headers
const DEVICE_SUBGROUPS: Record<DeviceCategory, { label: string; ids: string[] }[]> = {
  mobile: [
    { label: 'Apple iPhone', ids: ['iphone-se','iphone-12-mini','iphone-13','iphone-14-plus','iphone-14-pro','iphone-14-pro-max','iphone-15','iphone-15-plus','iphone-15-pro-max','iphone-16-pro','iphone-16-pro-max','iphone-17','iphone-17-air','iphone-17-pro','iphone-17-pro-max'] },
    { label: 'Samsung Galaxy', ids: ['galaxy-s23','galaxy-s23-plus','galaxy-s23-ultra','galaxy-s24','galaxy-s24-plus','galaxy-s24-ultra','galaxy-s25','galaxy-s25-plus','galaxy-s25-ultra','galaxy-z-fold5','galaxy-z-fold5-open','galaxy-z-flip5','galaxy-a54'] },
  ],
  tablet: [
    { label: 'Apple iPad', ids: ['ipad-mini-6','ipad-mini-7','ipad-10th','ipad-air-11','ipad-air-13','ipad-pro-11','ipad-pro-13'] },
    { label: 'Microsoft Surface', ids: ['surface-go-4','surface-pro-8','surface-pro-9','surface-pro-10','surface-pro-11'] },
    { label: 'Samsung Galaxy Tab', ids: ['galaxy-tab-a8','galaxy-tab-s8','galaxy-tab-s8-plus','galaxy-tab-s8-ultra','galaxy-tab-s9','galaxy-tab-s9-plus','galaxy-tab-s9-ultra','galaxy-tab-s10-ultra'] },
    { label: 'Android Other', ids: ['pixel-tablet','lenovo-tab-p12','xiaomi-pad-6'] },
  ],
  desktop: [
    { label: 'Apple MacBook', ids: ['macbook-air-13','macbook-air-15','macbook-pro-14','macbook-pro-16'] },
    { label: 'Standard Resolutions', ids: ['desktop-hd','desktop-fhd','desktop-qhd','desktop-4k','desktop-full'] },
  ],
}

function DevicePreviewToolbar({
  selectedPresetId,
  onSelect,
}: {
  selectedPresetId: string
  onSelect: (preset: DevicePreset) => void
}) {
  const fallbackPreset = DEVICE_PRESETS.find(p => p.id === 'desktop-full') || DEVICE_PRESETS[DEVICE_PRESETS.length - 1]
  const selectedPreset = DEVICE_PRESETS.find(p => p.id === selectedPresetId) || fallbackPreset
  const [openCategory, setOpenCategory] = React.useState<DeviceCategory | null>(null)

  return (
    <div className="flex items-center gap-1 bg-white border rounded-lg p-1 shadow-sm">
      {(['mobile', 'tablet', 'desktop'] as const).map(cat => {
        const isActiveCategory = selectedPreset.category === cat
        const isOpen = openCategory === cat

        return (
          <div key={cat} className="relative">
            <button
              onClick={() => setOpenCategory(isOpen ? null : cat)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                isActiveCategory
                  ? "bg-[#107DAC] text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
              title={CATEGORY_LABEL[cat]}
            >
              {CATEGORY_ICON[cat]}
              <span className="hidden sm:inline">{CATEGORY_LABEL[cat]}</span>
              {isActiveCategory && (
                <span className={cn(
                  "ml-0.5 px-1.5 py-0.5 rounded text-[10px]",
                  "bg-white/20"
                )}>
                  {selectedPreset.shortLabel}
                </span>
              )}
              <svg className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenCategory(null)} />
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border rounded-lg shadow-lg py-1 min-w-[220px] max-h-[420px] overflow-y-auto">
                  {(DEVICE_SUBGROUPS[cat] || []).map((group, gi) => (
                    <div key={group.label}>
                      {gi > 0 && <div className="border-t my-1 mx-2" />}
                      <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold z-10">
                        {group.label}
                      </div>
                      {group.ids.map(id => {
                        const preset = DEVICE_PRESETS.find(p => p.id === id)
                        if (!preset) return null
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              onSelect(preset)
                              setOpenCategory(null)
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors",
                              selectedPresetId === preset.id
                                ? "bg-[#107DAC]/10 text-[#107DAC] font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <span className="truncate mr-2">{preset.label}</span>
                            <span className={cn(
                              "text-[10px] tabular-nums px-1.5 py-0.5 rounded flex-shrink-0",
                              selectedPresetId === preset.id
                                ? "bg-[#107DAC]/15 text-[#107DAC]"
                                : "bg-gray-100 text-gray-500"
                            )}>
                              {preset.width ? `${preset.width}px` : '100%'}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}

      {/* Current dimension indicator */}
      <div className="ml-auto pl-2 border-l flex items-center gap-1">
        <span className="text-[10px] text-gray-400 tabular-nums">
          {selectedPreset.width ? `${selectedPreset.width}px` : 'Auto'}
        </span>
      </div>
    </div>
  )
}

interface EditorConfig {
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
  fieldTypes: {
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
  bannerImageUrl?: string
  description: string
  signatory?: string
  footer?: string
  activationDate?: Date
  expiryDate?: Date
  linkQuota: number
}

interface CustomQuestion {
  id: string
  label: string
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox'
  required: boolean
}

interface RegistrationLinkEditorProps {
  link?: RegistrationLink
  eventName: string
  eventStartDate?: Date
  eventEndDate?: Date
  eventVenue?: string
  ticketTypeName: string
  ticketTypeColor: string
  sessionNames: string[]
  onSave: (config: EditorConfig) => void
  onCancel: () => void
}

export function RegistrationLinkEditor({
  link,
  eventName: propEventName,
  eventStartDate: propEventStartDate,
  eventEndDate: propEventEndDate,
  eventVenue: propEventVenue,
  ticketTypeName: propTicketTypeName,
  ticketTypeColor: propTicketTypeColor,
  sessionNames: propSessionNames,
  onSave,
  onCancel,
}: RegistrationLinkEditorProps) {
  // ── Step 1 & 2: Event/Ticket/Session selection state ─────────────────
  const [selectedEventId, setSelectedEventId] = React.useState<string>(link?.eventId || "")
  const [selectedTicketId, setSelectedTicketId] = React.useState<string>("")
  const [allowCompanions, setAllowCompanions] = React.useState(false)
  const [maxCompanions, setMaxCompanions] = React.useState(0)
  const [companionDetailsLevel, setCompanionDetailsLevel] = React.useState<'names-only' | 'full-details'>('names-only')

  // Derived event/ticket values
  const selectedEvent = mockEventsForLinking.find(e => e.id === selectedEventId)
  const selectedTicket = mockEventTickets.find(t => t.id === selectedTicketId)
  const availableSubEventsForTicket = React.useMemo(() => {
    if (!selectedTicketId) return []
    return mockSubEventTickets.filter(s => s.parentTicketId === selectedTicketId)
  }, [selectedTicketId])

  // Use props (from existing link) or derive from selection
  const eventName = propEventName || selectedEvent?.name || ""
  const eventStartDate = propEventStartDate || selectedEvent?.startDate
  const eventEndDate = propEventEndDate || selectedEvent?.endDate
  const eventVenue = propEventVenue || selectedEvent?.venue || ""
  const ticketTypeName = propTicketTypeName || selectedTicket?.name || ""
  const ticketTypeColor = propTicketTypeColor || selectedTicket?.colorHex || "#107DAC"

  // Step validation
  const canProceedFromStep1 = selectedEventId !== "" && selectedTicketId !== ""
  const canProceedFromStep2 = true // sessions are optional

  const [currentStep, setCurrentStep] = React.useState(link ? 3 : 1)
  const [config, setConfig] = React.useState<EditorConfig>({
    visibleFields: link?.config.visibleFields || {
      salutation: true,
      title: true,
      organization: true,
      phone: true,
      wechatId: true,
      representativeType: false,
      referenceNo: false,
      tags: false,
    },
    requiredFields: link?.config.requiredFields || {
      firstName: true,
      lastName: true,
      email: true,
      salutation: false,
      title: false,
      organization: false,
      phone: false,
      wechatId: false,
      representativeType: false,
      referenceNo: false,
      tags: false,
    },
    fieldTypes: link?.config.fieldTypes || {
      firstName: 'text',
      lastName: 'text',
      email: 'email',
      salutation: 'text',
      title: 'text',
      organization: 'text',
      phone: 'text',
      wechatId: 'text',
      representativeType: 'text',
      referenceNo: 'text',
      tags: 'text',
    },
    fieldLabels: link?.config.fieldLabels || {
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
    bannerImageUrl: link?.config.bannerImageUrl,
    description: link?.config.description || "",
    signatory: link?.config.signatory || "",
    footer: link?.config.footer || "",
    activationDate: link?.config.activationDate,
    expiryDate: link?.config.expiryDate,
    linkQuota: link?.config.linkQuota || 100,
  })

  const [selectedSessions, setSelectedSessions] = React.useState<string[]>(link?.sessionIds || [])
  const [customQuestions, setCustomQuestions] = React.useState<CustomQuestion[]>([])
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  // Derive sessionNames after selectedSessions is declared
  const sessionNames = (propSessionNames && propSessionNames.length > 0)
    ? propSessionNames
    : selectedSessions.map(id => {
        const s = mockSubEventTickets.find(sub => sub.id === id) || availableSubEventsForTicket.find(sub => sub.id === id)
        return s?.name
      }).filter(Boolean) as string[]

  // Email editor mode: 'html' | 'plaintext'
  const [invitationEditorMode, setInvitationEditorMode] = React.useState<'html' | 'plaintext'>('html')
  const [confirmationEditorMode, setConfirmationEditorMode] = React.useState<'html' | 'plaintext'>('html')
  const [registrationEditorMode, setRegistrationEditorMode] = React.useState<'html' | 'plaintext'>('html')

  // Multilingual language selection
  const [invitationLang, setInvitationLang] = React.useState<EmailLang>('EN')
  const [confirmationLang, setConfirmationLang] = React.useState<EmailLang>('EN')
  const [registrationLang, setRegistrationLang] = React.useState<EmailLang>('EN')

  // Email image assets (event banner is multilingual)
  const [emailAssets, setEmailAssets] = React.useState({
    organizerLogo: '',
    eventBanner: { EN: '', TC: '', SC: '' } as MultiLangString,
    eventLogo: '',
  })

  // Multilingual email footer text
  const [invitationFooter, setInvitationFooter] = React.useState<MultiLangString>(
    createMultiLang(
      'Nebulae Technology Limited\nUnit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong',
      '星雲科技有限公司\n香港荃灣白田壩街45號南豐紗廠601室',
      '星云科技有限公司\n香港荃湾白田坝街45号南丰纱厂601室'
    )
  )
  const [confirmationFooter, setConfirmationFooter] = React.useState<MultiLangString>(
    createMultiLang(
      'Nebulae Technology Limited\nUnit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong',
      '星雲科技有限公司\n香港荃灣白田壩街45號南豐紗廠601室',
      '星云科技有限公司\n香港荃湾白田坝街45号南丰纱厂601室'
    )
  )

  // Image upload handler (simulated)
  const handleImageUpload = (assetKey: 'organizerLogo' | 'eventLogo') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          setEmailAssets(prev => ({ ...prev, [assetKey]: dataUrl }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  // Multilingual banner upload
  const handleBannerUpload = (lang: EmailLang) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          setEmailAssets(prev => ({
            ...prev,
            eventBanner: { ...prev.eventBanner, [lang]: dataUrl }
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeImageAsset = (assetKey: 'organizerLogo' | 'eventLogo') => {
    setEmailAssets(prev => ({ ...prev, [assetKey]: '' }))
  }

  const removeBannerAsset = (lang: EmailLang) => {
    setEmailAssets(prev => ({
      ...prev,
      eventBanner: { ...prev.eventBanner, [lang]: '' }
    }))
  }

  // Convert HTML to plain text
  const htmlToPlainText = (html: string): string => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
  }

  // Define field order for drag and drop
  const [fieldOrder, setFieldOrder] = React.useState([
    'salutation',
    'firstName',
    'lastName',
    'email',
    'title',
    'organization',
    'phone',
    'wechatId',
    'representativeType',
    'referenceNo',
    'tags',
  ])

  const [invitationEmail, setInvitationEmail] = React.useState({
    from: 'event_invitation@lepos.ai',
    senderName: '',
    replyTo: '',
    cc: '',
    subject: createMultiLang(
      `You're Invited: ${eventName}`,
      `邀請函：${eventName}`,
      `邀请函：${eventName}`
    ),
    body: createMultiLang(`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <title>You're Invited — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    {{salutation}} {{guest_name}}, you're invited to ${eventName}. Confirm your attendance today.
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">

          <!-- TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase;">
                    Event Invitation
                  </td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">
                    ${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%">
                    <img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" />
                  </td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">Powered by</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 6px 0; font-size:14px; color:#107DAC; font-weight:600; letter-spacing:0.3px; text-transform:uppercase;">
                You're Invited
              </p>
              <h1 style="margin:0 0 16px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">
                Hello {{salutation}} {{guest_name}},
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#444444;" class="text-muted">
                We're pleased to invite you to <strong style="color:#1a1a2e;">${eventName}</strong>. 
                Your attendance has been personally requested and we've reserved your spot.
              </p>
            </td>
          </tr>

          <!-- EVENT DETAILS CARD -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;">
                          <img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/calendar--v1.png" alt="" width="20" height="20" style="display:block;" />
                        </td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Date</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;">
                          <img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/clock--v1.png" alt="" width="20" height="20" style="display:block;" />
                        </td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Time</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:0;">
                          <img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/marker--v1.png" alt="" width="20" height="20" style="display:block;" />
                        </td>
                        <td valign="top" style="padding-bottom:0;">
                          <p style="margin:0; font-size:11px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Venue</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p>
                          <p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- PRE-ASSIGNED TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 10px 0; font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">
                Your Reserved Tickets
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#e8f6fc; border-radius:6px; border-left:6px solid ${ticketTypeColor};">
                      <tr>
                        <td style="padding:10px 16px;">
                          <p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p>
                          <p style="margin:2px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}} · {{ticket_session_info}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RSVP DEADLINE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fffbe6; border-radius:6px; border:1px solid #ffe58f;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0; font-size:13px; color:#876800; line-height:1.5;">
                      &#9200; <strong>RSVP Deadline:</strong> Please confirm your attendance before <strong>{{rsvp_deadline}}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 32px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{rsvp_link}}" target="_blank" style="display:inline-block; background-color:#107DAC; color:#ffffff; font-size:16px; font-weight:700; text-decoration:none; padding:16px 48px; border-radius:8px; border:1px solid #0d6390; letter-spacing:0.3px;">
                      Confirm My Attendance
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:12px;">
                    <p style="margin:0; font-size:12px; color:#999999; line-height:1.5;">
                      Or copy this link: <a href="{{rsvp_link}}" style="color:#107DAC; text-decoration:underline; word-break:break-all;">{{rsvp_link}}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ADDITIONAL MESSAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <p style="margin:0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">
                {{custom_message}}
              </p>
              <p style="margin:16px 0 0 0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">
                If you have any questions, please contact us at <a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none;">{{organizer_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                    <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">
                      Powered by <strong style="color:#666666;">Lepōs</strong> — The One Behind Greatest Events
                    </p>
                    <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">
                      Nebulae Technology Limited
                    </p>
                    <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">
                      Unit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong
                    </p>
                    <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;">
                      <a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a>
                      &nbsp;·&nbsp;
                      +852 3180 7863
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BOTTOM SPACER -->
          <tr>
            <td style="padding:16px 32px;" class="mobile-padding">
              <p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">
                This invitation was sent to <strong>{{guest_email}}</strong> on behalf of {{organizer_name}}.
                <br>If you received this email by mistake, please disregard it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
      // ── TC (繁體中文) ──────────────────────────────────────────────────
      `<!DOCTYPE html>
<html lang="zh-Hant" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <title>活動邀請函 — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    {{salutation}} {{guest_name}}，誠邀閣下出席 ${eventName}，請即確認出席。
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px;">活動邀請函</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%">
                    <img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" />
                  </td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">技術支援</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>
          <!-- GREETING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 6px 0; font-size:14px; color:#107DAC; font-weight:600; letter-spacing:0.3px;">誠意邀請</p>
              <h1 style="margin:0 0 16px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">{{salutation}} {{guest_name}}，您好！</h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#444444;" class="text-muted">
                我們誠意邀請閣下出席 <strong style="color:#1a1a2e;">${eventName}</strong>。您的蒞臨將為活動增添光彩，我們已為您預留席位。
              </p>
            </td>
          </tr>
          <!-- EVENT DETAILS CARD -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/calendar--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">日期</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/clock--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">時間</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/marker--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:0;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">地點</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p>
                          <p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- PRE-ASSIGNED TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 10px 0; font-size:12px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的預留票券</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#e8f6fc; border-radius:6px; border-left:6px solid ${ticketTypeColor};">
                      <tr>
                        <td style="padding:10px 16px;">
                          <p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p>
                          <p style="margin:2px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}} · {{ticket_session_info}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- RSVP DEADLINE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fffbe6; border-radius:6px; border:1px solid #ffe58f;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0; font-size:13px; color:#876800; line-height:1.5;">
                      &#9200; <strong>回覆截止日期：</strong>請於 <strong>{{rsvp_deadline}}</strong> 前確認出席
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA BUTTON -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 32px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{rsvp_link}}" target="_blank" style="display:inline-block; background-color:#107DAC; color:#ffffff; font-size:16px; font-weight:700; text-decoration:none; padding:16px 48px; border-radius:8px; border:1px solid #0d6390; letter-spacing:0.3px;">確認出席</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:12px;">
                    <p style="margin:0; font-size:12px; color:#999999; line-height:1.5;">
                      或複製此連結：<a href="{{rsvp_link}}" style="color:#107DAC; text-decoration:underline; word-break:break-all;">{{rsvp_link}}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- ADDITIONAL MESSAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <p style="margin:0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">{{custom_message}}</p>
              <p style="margin:16px 0 0 0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">
                如有任何查詢，請聯繫我們：<a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none;">{{organizer_email}}</a>。
              </p>
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center">
                <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">技術支援 <strong style="color:#666666;">Lepōs</strong> — 成就每場精彩盛事</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">星雲科技有限公司</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">香港荃灣白田壩街45號南豐紗廠601室</p>
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">此邀請函已發送至 <strong>{{guest_email}}</strong>，由 {{organizer_name}} 代為發出。<br>如閣下並非預定收件人，請忽略此電郵。</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      // ── SC (简体中文) ──────────────────────────────────────────────────
      `<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <title>活动邀请函 — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', 'Microsoft YaHei', sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    {{salutation}} {{guest_name}}，诚邀您出席 ${eventName}，请即确认参加。
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px;">活动邀请函</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%">
                    <img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" />
                  </td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">技术支持</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>
          <!-- GREETING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 6px 0; font-size:14px; color:#107DAC; font-weight:600; letter-spacing:0.3px;">诚意邀请</p>
              <h1 style="margin:0 0 16px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">{{salutation}} {{guest_name}}，您好！</h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#444444;" class="text-muted">
                我们诚意邀请您出席 <strong style="color:#1a1a2e;">${eventName}</strong>。您的莅临将为活动增添光彩，我们已为您预留席位。
              </p>
            </td>
          </tr>
          <!-- EVENT DETAILS CARD -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/calendar--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">日期</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:14px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/clock--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:14px;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">时间</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/marker--v1.png" alt="" width="20" height="20" style="display:block;" /></td>
                        <td valign="top" style="padding-bottom:0;">
                          <p style="margin:0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">地点</p>
                          <p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p>
                          <p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- PRE-ASSIGNED TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 10px 0; font-size:12px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的预留票券</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#e8f6fc; border-radius:6px; border-left:6px solid ${ticketTypeColor};">
                      <tr>
                        <td style="padding:10px 16px;">
                          <p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p>
                          <p style="margin:2px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}} · {{ticket_session_info}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- RSVP DEADLINE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#fffbe6; border-radius:6px; border:1px solid #ffe58f;">
                <tr>
                  <td style="padding:12px 16px;">
                    <p style="margin:0; font-size:13px; color:#876800; line-height:1.5;">
                      &#9200; <strong>回复截止日期：</strong>请于 <strong>{{rsvp_deadline}}</strong> 前确认参加
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA BUTTON -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 32px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="{{rsvp_link}}" target="_blank" style="display:inline-block; background-color:#107DAC; color:#ffffff; font-size:16px; font-weight:700; text-decoration:none; padding:16px 48px; border-radius:8px; border:1px solid #0d6390; letter-spacing:0.3px;">确认参加</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:12px;">
                    <p style="margin:0; font-size:12px; color:#999999; line-height:1.5;">
                      或复制此链接：<a href="{{rsvp_link}}" style="color:#107DAC; text-decoration:underline; word-break:break-all;">{{rsvp_link}}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- ADDITIONAL MESSAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <p style="margin:0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">{{custom_message}}</p>
              <p style="margin:16px 0 0 0; font-size:14px; line-height:1.6; color:#444444;" class="text-muted">
                如有任何疑问，请联系我们：<a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none;">{{organizer_email}}</a>。
              </p>
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center">
                <img src="https://lepos.ai/logo-dark.png" alt="Lepōs" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">技术支持 <strong style="color:#666666;">Lepōs</strong> — 成就每场精彩盛事</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">星云科技有限公司</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">香港荃湾白田坝街45号南丰纱厂601室</p>
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">此邀请函已发送至 <strong>{{guest_email}}</strong>，由 {{organizer_name}} 代为发出。<br>如您并非预定收件人，请忽略此邮件。</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    ),
  })

  // Helper to update multilingual email fields
  const updateInvitationLangField = (field: 'subject' | 'body', lang: EmailLang, value: string) => {
    setInvitationEmail(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }))
  }

  const updateConfirmationLangField = (field: 'subject' | 'body', lang: EmailLang, value: string) => {
    setConfirmationEmail(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }))
  }

  const [confirmationEmail, setConfirmationEmail] = React.useState({
    from: 'event_confirmation@lepos.ai',
    senderName: '',
    replyTo: '',
    cc: '',
    subject: createMultiLang(
      `Registration Confirmed: ${eventName}`,
      `報名確認：${eventName}`,
      `报名确认：${eventName}`
    ),
    body: createMultiLang(`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Registration Confirmed — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
      .qr-bg { background-color: #ffffff !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
      .qr-img { width: 200px !important; height: 200px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    You're registered for ${eventName}! Here's your QR code and ticket details.
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- SUCCESS TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase;">Registration Confirmed</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{registration_date}}"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%">
                    <img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" />
                  </td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">Powered by</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>
          <!-- SUCCESS HEADING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="background-color:#e8f6fc; border-radius:50%; width:64px; height:64px; text-align:center; vertical-align:middle;">
                          <span style="font-size:32px; line-height:64px; color:#107DAC;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0 0 8px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">You're Registered!</h1>
                    <p style="margin:0; font-size:15px; line-height:1.5; color:#666666;" class="text-muted">
                      {{salutation}} {{guest_name}}, your registration for <strong style="color:#1a1a2e;">${eventName}</strong> is confirmed.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- QR CODE SECTION -->
          <tr>
            <td style="background-color:#ffffff; padding:24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafb; border-radius:12px; border:2px dashed #d0d8e0;">
                      <tr>
                        <td align="center" style="padding:24px 32px;" class="qr-bg">
                          <p style="margin:0 0 8px 0; font-size:11px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Your Entry QR Code</p>
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{registration_number}}&bgcolor=f8fafb&color=1a1a2e" alt="QR Code" width="200" height="200" style="display:block; width:200px; height:200px; margin:0 auto;" class="qr-img" />
                          <p style="margin:12px 0 0 0; font-size:18px; color:#1a1a2e; font-weight:700; font-family:'Courier New', Courier, monospace; letter-spacing:2px;" class="text-dark">{{registration_number}}</p>
                          <p style="margin:4px 0 0 0; font-size:11px; color:#999999;">Present this code at the event entrance</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- REGISTRATION DETAILS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0; font-size:13px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Event Details</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/star--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">EVENT</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventName}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/calendar--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">DATE</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/clock--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">TIME</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/marker--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">VENUE</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- YOUR TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Your Tickets</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                <tr>
                  <td style="background-color:#e8f6fc; border-radius:8px; border-left:6px solid ${ticketTypeColor}; padding:14px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="middle"><p style="margin:0; font-size:15px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p><p style="margin:3px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}}</p></td>
                        <td align="right" valign="middle" width="80"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="background-color:${ticketTypeColor}; border-radius:4px; padding:4px 10px;"><p style="margin:0; font-size:11px; color:#ffffff; font-weight:600; text-transform:uppercase;">{{ticket_scope_short}}</p></td></tr></table></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BRING-ALONG COMPANIONS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Your Companions</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr><td style="padding:12px 16px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td valign="middle"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{bring_along_name}}</p></td><td align="right" valign="middle"><p style="margin:0; font-size:12px; color:#999999; font-family:'Courier New', Courier, monospace;">{{bring_along_registration_number}}</p></td></tr></table></td></tr>
              </table>
              <p style="margin:8px 0 0 0; font-size:12px; color:#999999;">Each companion has their own QR code for entry.</p>
            </td>
          </tr>
          <!-- WHAT'S NEXT -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">What's Next</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">1</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Save your QR code</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Screenshot or bookmark this email for easy access</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">2</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Arrive at the venue</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Head to the registration desk at ${eventVenue || "the venue"}</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">3</p></td></tr></table></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Scan &amp; collect your badge</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Show your QR code at the entrance</p></td></tr>
              </table>
            </td>
          </tr>
          <!-- VIEW REGISTRATION CTA -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center"><a href="{{confirmation_page_url}}" target="_blank" style="display:inline-block; background-color:#f8fafb; color:#1a1a2e; font-size:14px; font-weight:600; text-decoration:none; padding:14px 36px; border-radius:8px; border:1px solid #d0d8e0;">View My Registration &rarr;</a></td></tr></table>
            </td>
          </tr>
          <!-- CONTACT / HELP -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px;"><tr><td style="padding:16px 20px;"><p style="margin:0; font-size:13px; color:#666666; line-height:1.5;">Need to make changes? Contact the event organizer at <a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none; font-weight:500;">{{organizer_email}}</a></p></td></tr></table>
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center">
                <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">Powered by <strong style="color:#666666;">Lepos</strong> — The One Behind Greatest Events</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">Nebulae Technology Limited</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">Unit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong</p>
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">This confirmation was sent to <strong>{{guest_email}}</strong> for your registration at ${eventName}.<br>Registration #{{registration_number}}</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      // ── TC (繁體中文) ──────────────────────────────────────────────────
      `<!DOCTYPE html>
<html lang="zh-Hant" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>報名確認 — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
      .qr-bg { background-color: #ffffff !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
      .qr-img { width: 200px !important; height: 200px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    您已成功報名 ${eventName}！以下是您的 QR Code 及票券詳情。
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- SUCCESS TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px;">報名確認</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{registration_date}}"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%"><img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" /></td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">技術支援</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>
          <!-- SUCCESS HEADING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#e8f6fc; border-radius:50%; width:64px; height:64px; text-align:center; vertical-align:middle;"><span style="font-size:32px; line-height:64px; color:#107DAC;">&#10003;</span></td></tr></table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0 0 8px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">報名成功！</h1>
                    <p style="margin:0; font-size:15px; line-height:1.5; color:#666666;" class="text-muted">
                      {{salutation}} {{guest_name}}，您已成功報名參加 <strong style="color:#1a1a2e;">${eventName}</strong>。
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- QR CODE SECTION -->
          <tr>
            <td style="background-color:#ffffff; padding:24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafb; border-radius:12px; border:2px dashed #d0d8e0;">
                      <tr>
                        <td align="center" style="padding:24px 32px;" class="qr-bg">
                          <p style="margin:0 0 8px 0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的入場 QR Code</p>
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{registration_number}}&bgcolor=f8fafb&color=1a1a2e" alt="QR Code" width="200" height="200" style="display:block; width:200px; height:200px; margin:0 auto;" class="qr-img" />
                          <p style="margin:12px 0 0 0; font-size:18px; color:#1a1a2e; font-weight:700; font-family:'Courier New', Courier, monospace; letter-spacing:2px;" class="text-dark">{{registration_number}}</p>
                          <p style="margin:4px 0 0 0; font-size:11px; color:#999999;">請於活動入口出示此 QR Code</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- REGISTRATION DETAILS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">活動詳情</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/star--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">活動</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventName}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/calendar--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">日期</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/clock--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">時間</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/107DAC/marker--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">地點</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- YOUR TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的票券</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                <tr>
                  <td style="background-color:#f0faf9; border-radius:8px; border-left:4px solid ${ticketTypeColor}; padding:14px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="middle"><p style="margin:0; font-size:15px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p><p style="margin:3px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}}</p></td>
                        <td align="right" valign="middle" width="80"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="background-color:${ticketTypeColor}; border-radius:4px; padding:4px 10px;"><p style="margin:0; font-size:11px; color:#ffffff; font-weight:600;">{{ticket_scope_short}}</p></td></tr></table></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BRING-ALONG COMPANIONS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的同行人</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr><td style="padding:12px 16px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td valign="middle"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{bring_along_name}}</p></td><td align="right" valign="middle"><p style="margin:0; font-size:12px; color:#999999; font-family:'Courier New', Courier, monospace;">{{bring_along_registration_number}}</p></td></tr></table></td></tr>
              </table>
              <p style="margin:8px 0 0 0; font-size:12px; color:#999999;">每位同行人均擁有獨立 QR Code 入場。</p>
            </td>
          </tr>
          <!-- WHAT'S NEXT -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">後續步驟</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">1</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">儲存您的 QR Code</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">截圖或收藏此電郵以便查閱</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">2</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">抵達活動場地</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">前往 ${eventVenue || "場地"} 的登記處</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">3</p></td></tr></table></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">掃碼領取入場證</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">於入口出示您的 QR Code</p></td></tr>
              </table>
            </td>
          </tr>
          <!-- VIEW REGISTRATION CTA -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center"><a href="{{confirmation_page_url}}" target="_blank" style="display:inline-block; background-color:#f8fafb; color:#1a1a2e; font-size:14px; font-weight:600; text-decoration:none; padding:14px 36px; border-radius:8px; border:1px solid #d0d8e0;">查看我的報名 &rarr;</a></td></tr></table>
            </td>
          </tr>
          <!-- CONTACT / HELP -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px;"><tr><td style="padding:16px 20px;"><p style="margin:0; font-size:13px; color:#666666; line-height:1.5;">需要更改報名資料？請聯繫活動主辦方：<a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none; font-weight:500;">{{organizer_email}}</a></p></td></tr></table>
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center">
                <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">技術支援 <strong style="color:#666666;">Lepos</strong> — 成就每場精彩盛事</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">星雲科技有限公司</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">香港荃灣白田壩街45號南豐紗廠601室</p>
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">此確認函已發送至 <strong>{{guest_email}}</strong>，確認您已報名參加 ${eventName}。<br>報名編號 #{{registration_number}}</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      // ── SC (简体中文) ──────────────────────────────────────────────────
      `<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>报名确认 — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    @media (prefers-color-scheme: dark) {
      .email-bg { background-color: #1a1a2e !important; }
      .card-bg { background-color: #16213e !important; }
      .text-dark { color: #e0e0e0 !important; }
      .text-muted { color: #a0a0a0 !important; }
      .qr-bg { background-color: #ffffff !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid { width: 100% !important; max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-center { text-align: center !important; }
      .qr-img { width: 200px !important; height: 200px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans SC', 'Microsoft YaHei', sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    您已成功报名 ${eventName}！以下是您的二维码及票券详情。
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- SUCCESS TOP BAR -->
          <tr>
            <td style="background-color:#107DAC; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px;">报名确认</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{registration_date}}"}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- LOGO HEADER -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 16px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" valign="middle" width="50%"><img src="https://lepos.ai/logo-dark.png" alt="{{organizer_name}}" width="120" style="display:block; width:120px; max-width:120px; height:auto;" /></td>
                  <td align="right" valign="middle" width="50%">
                    <span style="font-size:10px; color:#999999; vertical-align:middle;">技术支持</span>
                    <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="48" style="display:inline-block; width:48px; height:auto; vertical-align:middle; margin-left:4px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER IMAGE -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding">
              <img src="https://placehold.co/536x200/107DAC/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
            </td>
          </tr>
          <!-- SUCCESS HEADING -->
          <tr>
            <td style="background-color:#ffffff; padding:28px 32px 8px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#e8f6fc; border-radius:50%; width:64px; height:64px; text-align:center; vertical-align:middle;"><span style="font-size:32px; line-height:64px; color:#107DAC;">&#10003;</span></td></tr></table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0 0 8px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">报名成功！</h1>
                    <p style="margin:0; font-size:15px; line-height:1.5; color:#666666;" class="text-muted">
                      {{salutation}} {{guest_name}}，您已成功报名参加 <strong style="color:#1a1a2e;">${eventName}</strong>。
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- QR CODE SECTION -->
          <tr>
            <td style="background-color:#ffffff; padding:24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafb; border-radius:12px; border:2px dashed #d0d8e0;">
                      <tr>
                        <td align="center" style="padding:24px 32px;" class="qr-bg">
                          <p style="margin:0 0 8px 0; font-size:11px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的入场二维码</p>
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{registration_number}}&bgcolor=f8fafb&color=1a1a2e" alt="QR Code" width="200" height="200" style="display:block; width:200px; height:200px; margin:0 auto;" class="qr-img" />
                          <p style="margin:12px 0 0 0; font-size:18px; color:#1a1a2e; font-weight:700; font-family:'Courier New', Courier, monospace; letter-spacing:2px;" class="text-dark">{{registration_number}}</p>
                          <p style="margin:4px 0 0 0; font-size:11px; color:#999999;">请于活动入口出示此二维码</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- REGISTRATION DETAILS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">活动详情</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/star--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">活动</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventName}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/calendar--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">日期</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/clock--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">时间</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/marker--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">地点</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventVenue || "{{venue_name}}"}</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- YOUR TICKETS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的票券</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:8px;">
                <tr>
                  <td style="background-color:#f0faf9; border-radius:8px; border-left:4px solid ${ticketTypeColor}; padding:14px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="middle"><p style="margin:0; font-size:15px; color:#1a1a2e; font-weight:600;" class="text-dark">${ticketTypeName}</p><p style="margin:3px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}}</p></td>
                        <td align="right" valign="middle" width="80"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="background-color:${ticketTypeColor}; border-radius:4px; padding:4px 10px;"><p style="margin:0; font-size:11px; color:#ffffff; font-weight:600;">{{ticket_scope_short}}</p></td></tr></table></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BRING-ALONG COMPANIONS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">您的同行人</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr><td style="padding:12px 16px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td valign="middle"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{bring_along_name}}</p></td><td align="right" valign="middle"><p style="margin:0; font-size:12px; color:#999999; font-family:'Courier New', Courier, monospace;">{{bring_along_registration_number}}</p></td></tr></table></td></tr>
              </table>
              <p style="margin:8px 0 0 0; font-size:12px; color:#999999;">每位同行人均有独立二维码入场。</p>
            </td>
          </tr>
          <!-- WHAT'S NEXT -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <p style="margin:0 0 12px 0; font-size:13px; color:#888888; letter-spacing:0.5px; font-weight:600;">后续步骤</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">1</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">保存您的二维码</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">截图或收藏此邮件以便查阅</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">2</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">抵达活动场地</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">前往 ${eventVenue || "场地"} 的签到处</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#107DAC; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">3</p></td></tr></table></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">扫码领取入场证</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">在入口出示您的二维码</p></td></tr>
              </table>
            </td>
          </tr>
          <!-- VIEW REGISTRATION CTA -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center"><a href="{{confirmation_page_url}}" target="_blank" style="display:inline-block; background-color:#f8fafb; color:#1a1a2e; font-size:14px; font-weight:600; text-decoration:none; padding:14px 36px; border-radius:8px; border:1px solid #d0d8e0;">查看我的报名 &rarr;</a></td></tr></table>
            </td>
          </tr>
          <!-- CONTACT / HELP -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px;"><tr><td style="padding:16px 20px;"><p style="margin:0; font-size:13px; color:#666666; line-height:1.5;">需要更改报名信息？请联系活动主办方：<a href="mailto:{{organizer_email}}" style="color:#107DAC; text-decoration:none; font-weight:500;">{{organizer_email}}</a></p></td></tr></table>
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="background-color:#ffffff; padding:0 32px;" class="card-bg mobile-padding"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="border-top:1px solid #e8ecf0; height:1px; font-size:1px; line-height:1px;">&nbsp;</td></tr></table></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#ffffff; border-radius:0 0 12px 12px; padding:24px 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center">
                <img src="https://lepos.ai/logo-dark.png" alt="Lepos" width="72" style="display:block; width:72px; height:auto; margin-bottom:12px;" />
                <p style="margin:0 0 4px 0; font-size:12px; color:#999999; line-height:1.5;">技术支持 <strong style="color:#666666;">Lepos</strong> — 成就每场精彩盛事</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">星云科技有限公司</p>
                <p style="margin:0 0 4px 0; font-size:11px; color:#bbbbbb; line-height:1.5;">香港荃湾白田坝街45号南丰纱厂601室</p>
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#107DAC; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#107DAC; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">此确认函已发送至 <strong>{{guest_email}}</strong>，确认您已报名参加 ${eventName}。<br>报名编号 #{{registration_number}}</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    ),
  })



  // Registration Form HTML (multilingual)
  const defaultRegistrationFormHtml = getDefaultRegistrationFormHtml({
    eventName,
    ticketTypeName,
    ticketTypeColor,
    allowCompanions,
    maxCompanions,
    companionDetailsLevel,
  })

  const [registrationFormHtml, setRegistrationFormHtml] = React.useState<MultiLangString>({
    EN: defaultRegistrationFormHtml,
    TC: '',
    SC: '',
  })

  const updateRegistrationFormLang = (lang: EmailLang, value: string) => {
    setRegistrationFormHtml(prev => ({ ...prev, [lang]: value }))
  }

  // Regenerate registration form HTML when companion settings change
  React.useEffect(() => {
    const newHtml = getDefaultRegistrationFormHtml({
      eventName,
      ticketTypeName,
      ticketTypeColor,
      allowCompanions,
      maxCompanions,
      companionDetailsLevel,
    })
    setRegistrationFormHtml(prev => ({
      ...prev,
      EN: newHtml,
    }))
  }, [allowCompanions, maxCompanions, companionDetailsLevel, eventName, ticketTypeName, ticketTypeColor])

  const [testEmail, setTestEmail] = React.useState("")
  const [testEmailSent, setTestEmailSent] = React.useState(false)
  const [testEmailPreviewTab, setTestEmailPreviewTab] = React.useState<'invitation' | 'confirmation'>('invitation')
  const [testPreviewLang, setTestPreviewLang] = React.useState<EmailLang>('EN')
  const [previewDeviceId, setPreviewDeviceId] = React.useState<string>('desktop-full')
  const activePreviewPreset = DEVICE_PRESETS.find(p => p.id === previewDeviceId) || DEVICE_PRESETS[DEVICE_PRESETS.length - 1]

  // Test email timeline simulation
  type TimelineStatus = 'pending' | 'in_progress' | 'completed' | 'failed'
  interface TimelineStep {
    key: string
    label: string
    status: TimelineStatus
    timestamp?: string
    detail?: string
  }
  interface TestEmailRecord {
    id: string
    email: string
    emailType: 'invitation' | 'confirmation'
    sentAt: string
    timeline: TimelineStep[]
  }
  const [testEmailRecords, setTestEmailRecords] = React.useState<TestEmailRecord[]>([])
  const [isSending, setIsSending] = React.useState(false)

  const simulateTimeline = (recordId: string) => {
    const now = new Date()
    const steps: { delay: number; key: string; status: TimelineStatus; detail: string }[] = [
      { delay: 0, key: 'command_send', status: 'completed', detail: 'API command accepted' },
      { delay: 1200, key: 'message_send', status: 'completed', detail: 'Email dispatched to SMTP relay' },
      { delay: 3500, key: 'message_delivered', status: 'completed', detail: 'Delivered to recipient mailbox' },
      { delay: 7000, key: 'message_opened', status: 'completed', detail: 'Recipient opened the email' },
    ]

    // Set command_send immediately
    setTestEmailRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r
      return {
        ...r,
        timeline: r.timeline.map((s, i) =>
          i === 0 ? { ...s, status: 'completed' as TimelineStatus, timestamp: new Date(now.getTime()).toLocaleTimeString(), detail: steps[0].detail }
          : i === 1 ? { ...s, status: 'in_progress' as TimelineStatus }
          : s
        ),
      }
    }))

    steps.slice(1).forEach((step, idx) => {
      setTimeout(() => {
        setTestEmailRecords(prev => prev.map(r => {
          if (r.id !== recordId) return r
          return {
            ...r,
            timeline: r.timeline.map((s, i) => {
              if (i === idx + 1) return { ...s, status: 'completed' as TimelineStatus, timestamp: new Date(now.getTime() + step.delay).toLocaleTimeString(), detail: step.detail }
              if (i === idx + 2) return { ...s, status: 'in_progress' as TimelineStatus }
              return s
            }),
          }
        }))
      }, step.delay)
    })
  }

  const handleSendTestEmails = () => {
    if (!testEmail || !testEmail.includes('@')) return
    setIsSending(true)
    setTestEmailSent(true)

    const createRecord = (type: 'invitation' | 'confirmation'): TestEmailRecord => ({
      id: `${type}_${Date.now()}`,
      email: testEmail,
      emailType: type,
      sentAt: new Date().toLocaleTimeString(),
      timeline: [
        { key: 'command_send', label: 'Command Send', status: 'pending' as TimelineStatus },
        { key: 'message_send', label: 'Message Send', status: 'pending' as TimelineStatus },
        { key: 'message_delivered', label: 'Message Delivered', status: 'pending' as TimelineStatus },
        { key: 'message_opened', label: 'Message Opened', status: 'pending' as TimelineStatus },
      ],
    })

    const invRecord = createRecord('invitation')
    const confRecord = createRecord('confirmation')

    setTestEmailRecords(prev => [invRecord, confRecord, ...prev])

    setTimeout(() => {
      setIsSending(false)
      simulateTimeline(invRecord.id)
      simulateTimeline(confRecord.id)
    }, 600)
  }

  const [linkCopied, setLinkCopied] = React.useState(false)
  const generatedLink = link?.linkUrl || "https://events.lepos.ai/event-slug/register/ABC123"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleSave = () => {
    onSave(config)
  }

  // Old handleSendTestEmail replaced by handleSendTestEmails above

  const updateFieldLabel = (field: keyof EditorConfig['fieldLabels'], value: string) => {
    setConfig({
      ...config,
      fieldLabels: { ...config.fieldLabels, [field]: value },
    })
  }

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: `custom_${Date.now()}`,
      label: 'New Question',
      type: 'text',
      required: false,
    }
    setCustomQuestions([...customQuestions, newQuestion])
    setFieldOrder([...fieldOrder, newQuestion.id])
  }

  const updateCustomQuestion = (id: string, updates: Partial<CustomQuestion>) => {
    setCustomQuestions(customQuestions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteCustomQuestion = (id: string) => {
    setCustomQuestions(customQuestions.filter(q => q.id !== id))
    setFieldOrder(fieldOrder.filter(f => f !== id))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newOrder = [...fieldOrder]
    const draggedItem = newOrder[draggedIndex]
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(index, 0, draggedItem)

    setFieldOrder(newOrder)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const toggleSession = (sessionId: string) => {
    setSelectedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    )
  }

  const steps = [
    { number: 1, title: 'Select Event & Ticket', completed: currentStep > 1 },
    { number: 2, title: 'Sessions & Sub-events', completed: currentStep > 2 },
    { number: 3, title: 'Setup Registration Form', completed: currentStep > 3 },
    { number: 4, title: 'Setup Invitation Email', completed: currentStep > 4 },
    { number: 5, title: 'Setup Confirmation Email', completed: currentStep > 5 },
    { number: 6, title: 'Send Test Email', completed: false },
  ]

  const getFieldLabel = (fieldKey: string) => {
    const labels: Record<string, string> = {
      salutation: 'Salutation',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      title: 'Title',
      organization: 'Organization',
      phone: 'Phone',
      wechatId: 'WeChat ID',
      representativeType: 'Rep. Type',
      referenceNo: 'Reference No',
      tags: 'Tags',
    }
    return labels[fieldKey] || fieldKey
  }

  const isFieldVisible = (fieldKey: string) => {
    if (fieldKey === 'firstName' || fieldKey === 'lastName' || fieldKey === 'email') {
      return true
    }
    return config.visibleFields[fieldKey as keyof typeof config.visibleFields]
  }

  const isFieldRequired = (fieldKey: string) => {
    return config.requiredFields[fieldKey as keyof typeof config.requiredFields]
  }

  const renderFormField = (fieldKey: string, index: number) => {
    const isCustom = fieldKey.startsWith('custom_')
    const customQuestion = isCustom ? customQuestions.find(q => q.id === fieldKey) : null
    const isCoreField = ['firstName', 'lastName', 'email'].includes(fieldKey)
    const isVisible = isFieldVisible(fieldKey)

    if (!isVisible && !isCoreField && !isCustom) return null

    return (
      <div
        key={fieldKey}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={cn(
          "grid gap-3 items-center p-3 bg-white border rounded-lg grid-cols-[auto_120px_1fr_120px_auto_auto]",
          draggedIndex === index && "opacity-50"
        )}
      >
        {/* Drag Handle */}
        <div className="cursor-move text-gray-400">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Visibility Checkbox / Field Name */}
        <div className="flex items-center gap-2">
          {!isCoreField && !isCustom && (
            <Checkbox
              checked={isVisible}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  visibleFields: { ...config.visibleFields, [fieldKey]: checked as boolean },
                })
              }
            />
          )}
          <span className="text-sm text-muted-foreground">
            {isCustom ? customQuestion?.label : getFieldLabel(fieldKey)}
          </span>
        </div>

        {/* Label Input */}
        {isCustom ? (
          <Input
            value={customQuestion?.label || ''}
            onChange={(e) => updateCustomQuestion(fieldKey, { label: e.target.value })}
            className="h-8 text-sm"
            placeholder="Question text"
          />
        ) : (
          <Input
            value={config.fieldLabels[fieldKey as keyof typeof config.fieldLabels] || ''}
            onChange={(e) => updateFieldLabel(fieldKey as keyof EditorConfig['fieldLabels'], e.target.value)}
            disabled={!isVisible && !isCoreField}
            className="h-8 text-sm"
          />
        )}

        {/* Field Type Selector (All Fields) */}
        {isCustom ? (
          <Select
            value={customQuestion?.type}
            onValueChange={(value) => updateCustomQuestion(fieldKey, { type: value as CustomQuestion['type'] })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="textarea">Textarea</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={config.fieldTypes[fieldKey as keyof typeof config.fieldTypes] || 'text'}
            onValueChange={(value) => 
              setConfig({
                ...config,
                fieldTypes: { ...config.fieldTypes, [fieldKey]: value },
              })
            }
            disabled={!isVisible && !isCoreField}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="textarea">Textarea</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Required Checkbox */}
        <div className="flex items-center gap-2 min-w-[88px]">
          <Checkbox
            checked={isCustom ? customQuestion?.required : isFieldRequired(fieldKey)}
            disabled={!isVisible && !isCoreField}
            onCheckedChange={(checked) => {
              if (isCustom) {
                updateCustomQuestion(fieldKey, { required: checked as boolean })
              } else {
                setConfig({
                  ...config,
                  requiredFields: { ...config.requiredFields, [fieldKey]: checked as boolean },
                })
              }
            }}
          />
          <Label className="cursor-pointer text-xs text-muted-foreground">Required</Label>
        </div>

        {/* Actions */}
        {isCustom && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteCustomQuestion(fieldKey)}
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {!isCustom && <div className="w-8"></div>}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Registration Link Editor</h1>
              <p className="text-sm text-muted-foreground">
                {eventName && ticketTypeName ? `${eventName} · ${ticketTypeName}` : eventName || 'New Registration Link'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#107DAC] hover:bg-[#0d6390]">
              Complete
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {steps.map((step) => {
            // Only allow navigating to a step if all previous steps' prerequisites are met
            const canNavigate =
              step.number <= currentStep || // can always go back
              (step.number === 2 && canProceedFromStep1) ||
              (step.number === 3 && canProceedFromStep1 && canProceedFromStep2) ||
              (step.number >= 4 && canProceedFromStep1 && canProceedFromStep2) ||
              step.completed // already completed steps are always accessible

            return (
            <button
              key={step.number}
              onClick={() => canNavigate && setCurrentStep(step.number)}
              disabled={!canNavigate}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                !canNavigate && "opacity-50 cursor-not-allowed",
                currentStep === step.number
                  ? "bg-[#107DAC] text-white"
                  : step.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold",
                  currentStep === step.number
                    ? "bg-white text-[#107DAC]"
                    : step.completed
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {step.completed ? "✓" : step.number}
              </div>
              {step.title}
            </button>
            )
          })}
        </div>
      </div>

      {/* Split View — Resizable */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* LEFT: Editor */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={65}>
          <div className="h-full bg-gray-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* STEP 1: Select Event & Ticket Type + Companions */}
            {currentStep === 1 && (
              <>
                {/* Select Event */}
                <Card className="p-4 bg-white space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-4 w-4 text-[#107DAC]" />
                    <Label className="text-base font-semibold">Select Event</Label>
                  </div>
                  <RadioGroup value={selectedEventId} onValueChange={(value) => { setSelectedEventId(value); setSelectedTicketId(""); }}>
                    <div className="space-y-3">
                      {mockEventsForLinking.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "p-4 cursor-pointer transition-all border-2 rounded-lg",
                            selectedEventId === event.id
                              ? "border-[#107DAC] bg-blue-50/50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => { setSelectedEventId(event.id); setSelectedTicketId(""); }}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={event.id} id={`evt-${event.id}`} />
                            <div className="flex-1">
                              <Label htmlFor={`evt-${event.id}`} className="text-sm font-semibold cursor-pointer">
                                {event.name}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(event.startDate, "MMM d, yyyy")} - {format(event.endDate, "MMM d, yyyy")}
                              </p>
                              <p className="text-xs text-muted-foreground">{event.venue}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </Card>

                {/* Select Ticket Type */}
                {selectedEventId && (
                  <Card className="p-4 bg-white space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="h-4 w-4 text-[#107DAC]" />
                      <Label className="text-base font-semibold">Select Ticket Type</Label>
                    </div>
                    <RadioGroup value={selectedTicketId} onValueChange={setSelectedTicketId}>
                      <div className="space-y-3">
                        {mockEventTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className={cn(
                              "p-4 cursor-pointer transition-all border-2 rounded-lg",
                              selectedTicketId === ticket.id
                                ? "border-[#107DAC] bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                            onClick={() => setSelectedTicketId(ticket.id)}
                            style={{
                              borderLeftWidth: "6px",
                              borderLeftColor: selectedTicketId === ticket.id ? ticket.colorHex : "#e5e7eb",
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={ticket.id} id={`tkt-${ticket.id}`} />
                              <div className="flex-1">
                                <Label htmlFor={`tkt-${ticket.id}`} className="text-sm font-semibold cursor-pointer">
                                  {ticket.name}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">{ticket.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Available: {ticket.available} / {ticket.total}</span>
                                  <span>·</span>
                                  <span>{ticket.price ? `$${ticket.price}` : 'Free'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </Card>
                )}

                {/* Action bar */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedFromStep1}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Next: Sessions & Sub-events
                  </Button>
                </div>
              </>
            )}

            {/* STEP 2: Apply to Sessions & Sub-events */}
            {currentStep === 2 && (
              <>
                <Card className="p-4 bg-white space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-4 w-4 text-[#107DAC]" />
                    <Label className="text-base font-semibold">Apply to Sessions (Optional)</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select which sub-event sessions this registration link will include
                  </p>
                  {availableSubEventsForTicket.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">
                      No sessions available for the selected ticket type "{ticketTypeName}".
                      <br />You can proceed to the next step.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {availableSubEventsForTicket.map((session) => (
                        <div key={session.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Checkbox
                            id={`sub-${session.id}`}
                            checked={selectedSessions.includes(session.id)}
                            onCheckedChange={() => toggleSession(session.id)}
                          />
                          <Label htmlFor={`sub-${session.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium text-sm">{session.name}</div>
                            {session.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{session.description}</p>
                            )}
                            {session.sessionDate && session.sessionTime && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {format(session.sessionDate, "MMM d, yyyy")} · {session.sessionTime}
                              </div>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>Available: {session.available} / {session.total}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Summary of selections */}
                <Card className="p-4 bg-blue-50/60 border-[#107DAC]/20 space-y-2">
                  <p className="text-xs font-semibold text-[#107DAC] uppercase tracking-wider">Selection Summary</p>
                  <div className="text-sm space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 flex-shrink-0">Event:</span>
                      <span className="font-medium">{eventName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 flex-shrink-0">Ticket:</span>
                      <span className="font-medium">{ticketTypeName}</span>
                    </div>
                    {selectedSessions.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground w-16 flex-shrink-0">Sessions:</span>
                        <span className="font-medium">{selectedSessions.length} selected</span>
                      </div>
                    )}
                    {allowCompanions && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground w-16 flex-shrink-0">Companions:</span>
                        <span className="font-medium">Up to {maxCompanions} ({companionDetailsLevel === 'full-details' ? 'Full Details' : 'Names Only'})</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Action bar */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Next: Registration Form
                  </Button>
                </div>
              </>
            )}

            {/* STEP 3: Registration Form Setup */}
            {currentStep === 3 && (
              <>
                {/* Registration Link & Schedule Config */}
                <Card className="p-4 bg-white space-y-4">
                  {/* Row 1: Registration Link URL */}
                  <div>
                    <Label className="text-sm mb-2 block">Registration Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="flex-1 font-mono text-xs bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="flex-shrink-0"
                      >
                        {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share this link with your guests
                    </p>
                  </div>

                  {/* Row 2: Activation Date & Expiry Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activation-date" className="text-sm mb-2 block">
                        Activation Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !config.activationDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {config.activationDate ? (
                              format(config.activationDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={config.activationDate}
                            onSelect={(date) => setConfig({ ...config, activationDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="expiry-date" className="text-sm mb-2 block">
                        Expiry Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !config.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {config.expiryDate ? (
                              format(config.expiryDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={config.expiryDate}
                            onSelect={(date) => setConfig({ ...config, expiryDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Row 3: Link Quota & Companion Toggle */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="link-quota" className="text-sm mb-2 block">
                        Link Quota
                      </Label>
                      <Input
                        id="link-quota"
                        type="number"
                        min="1"
                        value={config.linkQuota}
                        onChange={(e) => setConfig({ ...config, linkQuota: parseInt(e.target.value) || 0 })}
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Max registrations for this link
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">
                        Companions
                      </Label>
                      <div className="flex items-center gap-3 h-9">
                        <Checkbox
                          id="allowCompanions"
                          checked={allowCompanions}
                          onCheckedChange={(checked) => setAllowCompanions(checked as boolean)}
                        />
                        <Label htmlFor="allowCompanions" className="text-sm cursor-pointer">
                          Allow Bring-Along
                        </Label>
                      </div>
                      {allowCompanions && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="maxCompanions" className="text-xs text-muted-foreground whitespace-nowrap">Max:</Label>
                            <Input
                              id="maxCompanions"
                              type="number"
                              min="0"
                              max="10"
                              value={maxCompanions}
                              onChange={(e) => setMaxCompanions(parseInt(e.target.value) || 0)}
                              className="w-20 h-8"
                            />
                          </div>
                          <RadioGroup
                            value={companionDetailsLevel}
                            onValueChange={(value: 'names-only' | 'full-details') => setCompanionDetailsLevel(value)}
                            className="space-y-1"
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="names-only" id="names-only" />
                              <Label htmlFor="names-only" className="text-xs cursor-pointer">Names Only</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="full-details" id="full-details" />
                              <Label htmlFor="full-details" className="text-xs cursor-pointer">Full Details</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Form Fields */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Form Fields</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCustomQuestion}
                      className="h-8"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Custom Question
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {fieldOrder.map((fieldKey, index) => renderFormField(fieldKey, index))}
                  </div>
                  {fieldOrder.includes('phone') && (
                    <div className="mt-2 ml-14 pl-[120px]">
                      <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center p-3 bg-gray-50 border border-dashed rounded-lg">
                        <Input
                          value={config.fieldLabels.areaCode}
                          onChange={(e) => updateFieldLabel('areaCode', e.target.value)}
                          disabled={!config.visibleFields.phone}
                          className="h-8 text-sm"
                          placeholder="Area Code Label"
                        />
                        <span className="text-xs text-muted-foreground min-w-[88px]">Sub-field</span>
                        <div className="w-8"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Page Body - Multilingual HTML/Plain Text Editor */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Label className="text-base font-semibold">
                        Registration Page
                      </Label>
                      <LanguageTabs value={registrationLang} onChange={setRegistrationLang} />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setRegistrationEditorMode('html')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          registrationEditorMode === 'html'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Code className="h-3 w-3" />
                        HTML Code
                      </button>
                      <button
                        onClick={() => setRegistrationEditorMode('plaintext')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          registrationEditorMode === 'plaintext'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <FileText className="h-3 w-3" />
                        Plain Text
                      </button>
                    </div>
                  </div>
                  {registrationEditorMode === 'html' ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-mono">HTML Source — {LANG_LABELS[registrationLang]}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(registrationFormHtml[registrationLang] || registrationFormHtml.EN)
                            }}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={registrationFormHtml[registrationLang]}
                        onChange={(e) => updateRegistrationFormLang(registrationLang, e.target.value)}
                        className="w-full min-h-[500px] p-4 font-mono text-xs leading-relaxed bg-gray-900 text-green-400 resize-y focus:outline-none"
                        spellCheck={false}
                        style={{ tabSize: 2 }}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 border-b px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Plain Text Preview — {LANG_LABELS[registrationLang]}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(htmlToPlainText(registrationFormHtml[registrationLang] || registrationFormHtml.EN))
                          }}
                          className="text-xs text-muted-foreground hover:text-gray-900 flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy as Text
                        </button>
                      </div>
                      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                        {(registrationFormHtml[registrationLang] || registrationFormHtml.EN) ? (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{htmlToPlainText(registrationFormHtml[registrationLang] || registrationFormHtml.EN)}</div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-sm">No content for {LANG_LABELS[registrationLang]} yet</p>
                            <p className="text-xs mt-1">Switch to HTML Code mode to add content</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Available placeholders: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_date}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_description}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{venue_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{rsvp_deadline}}'}</code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Field labels: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{label_salutation}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{label_first_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{label_last_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{label_email}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{label_phone}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{max_companions}}'}</code>
                    </p>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Next: Invitation Email
                  </Button>
                </div>
              </>
            )}

            {/* STEP 4: Invitation Email Setup */}
            {currentStep === 4 && (
              <>
                <Card className="p-4 bg-white space-y-4">
                  {/* Row 1: From Email & Sender Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invitation-from" className="text-sm mb-2 block">
                        From Email*
                      </Label>
                      <Input
                        id="invitation-from"
                        value={invitationEmail.from}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default sender email address
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="invitation-sender-name" className="text-sm mb-2 block">
                        Sender Name*
                      </Label>
                      <Input
                        id="invitation-sender-name"
                        type="text"
                        value={invitationEmail.senderName}
                        onChange={(e) => setInvitationEmail({ ...invitationEmail, senderName: e.target.value })}
                        placeholder="Event Organizer"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 2: Reply-To Email & CC Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invitation-reply-to" className="text-sm mb-2 block">
                        Reply to Email
                      </Label>
                      <Input
                        id="invitation-reply-to"
                        type="email"
                        value={invitationEmail.replyTo}
                        onChange={(e) => setInvitationEmail({ ...invitationEmail, replyTo: e.target.value })}
                        placeholder="reply@example.com"
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Replies will be sent to this email
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="invitation-cc" className="text-sm mb-2 block">
                        CC Email
                      </Label>
                      <Input
                        id="invitation-cc"
                        type="email"
                        value={invitationEmail.cc}
                        onChange={(e) => setInvitationEmail({ ...invitationEmail, cc: e.target.value })}
                        placeholder="cc@example.com"
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Send a copy to this email address
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Email Subject with Language Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="invitation-subject" className="text-base font-semibold">
                      Email Subject
                    </Label>
                    <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                  </div>
                  <Input
                    id="invitation-subject"
                    value={invitationEmail.subject[invitationLang]}
                    onChange={(e) => updateInvitationLangField('subject', invitationLang, e.target.value)}
                    placeholder={`Enter email subject (${LANG_LABELS[invitationLang]})...`}
                    className="bg-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Editing <span className="font-medium">{LANG_LABELS[invitationLang]}</span> version
                      {invitationEmail.subject[invitationLang] === '' && invitationLang !== 'EN' && (
                        <span className="text-amber-600 ml-1">— empty, will fall back to EN</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Email Image Assets */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Email Image Assets
                  </Label>
                  <Card className="p-4 bg-white space-y-4">
                    {/* Organizer Logo */}
                    <div>
                      <Label className="text-sm mb-2 block">Organizer Logo</Label>
                      <div className="flex items-center gap-3">
                        {emailAssets.organizerLogo ? (
                          <div className="relative w-[120px] h-[40px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.organizerLogo} alt="Organizer Logo" className="w-full h-full object-contain" />
                            <button
                              onClick={() => removeImageAsset('organizerLogo')}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-[120px] h-[40px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <Image className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleImageUpload('organizerLogo')}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.organizerLogo ? 'Replace' : 'Upload'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">120×40px recommended. Displayed in email header.</p>
                    </div>

                    {/* Event Banner - Multilingual */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Event Banner</Label>
                        <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                      </div>
                      <div className="space-y-2">
                        {emailAssets.eventBanner[invitationLang] ? (
                          <div className="relative w-full h-[80px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.eventBanner[invitationLang]} alt={`Event Banner (${LANG_LABELS[invitationLang]})`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeBannerAsset(invitationLang)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-[80px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <Image className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                              <span className="text-xs text-gray-400">536×200px ({LANG_LABELS[invitationLang]})</span>
                            </div>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleBannerUpload(invitationLang)}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.eventBanner[invitationLang] ? `Replace Banner (${LANG_LABELS[invitationLang]})` : `Upload Banner (${LANG_LABELS[invitationLang]})`}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          536×200px recommended. Upload separate banner for each language.
                          {!emailAssets.eventBanner[invitationLang] && invitationLang !== 'EN' && emailAssets.eventBanner.EN && (
                            <span className="text-amber-600 ml-1">— will fall back to EN</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Footer Logo */}
                    <div>
                      <Label className="text-sm mb-2 block">Footer Logo</Label>
                      <div className="flex items-center gap-3">
                        {emailAssets.eventLogo ? (
                          <div className="relative w-[72px] h-[32px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.eventLogo} alt="Footer Logo" className="w-full h-full object-contain" />
                            <button
                              onClick={() => removeImageAsset('eventLogo')}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-[72px] h-[32px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <Image className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleImageUpload('eventLogo')}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.eventLogo ? 'Replace' : 'Upload'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">72px wide. Displayed in email footer.</p>
                    </div>
                  </Card>
                </div>

                {/* Email Footer Text - Multilingual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">
                      Email Footer Text
                    </Label>
                    <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                  </div>
                  <Textarea
                    value={invitationFooter[invitationLang]}
                    onChange={(e) => setInvitationFooter(prev => ({ ...prev, [invitationLang]: e.target.value }))}
                    placeholder={`Enter footer text (${LANG_LABELS[invitationLang]})...`}
                    rows={3}
                    className="bg-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Footer text for <span className="font-medium">{LANG_LABELS[invitationLang]}</span> version
                    </p>
                  </div>
                </div>

                {/* Email Body - Multilingual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="invitation-body" className="text-base font-semibold">
                        Email Body
                      </Label>
                      <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setInvitationEditorMode('html')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          invitationEditorMode === 'html'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Code className="h-3 w-3" />
                        HTML Code
                      </button>
                      <button
                        onClick={() => setInvitationEditorMode('plaintext')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          invitationEditorMode === 'plaintext'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <FileText className="h-3 w-3" />
                        Plain Text
                      </button>
                    </div>
                  </div>
                  {invitationEditorMode === 'html' ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-mono">HTML Source — {LANG_LABELS[invitationLang]}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(invitationEmail.body[invitationLang])
                            }}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={invitationEmail.body[invitationLang]}
                        onChange={(e) => updateInvitationLangField('body', invitationLang, e.target.value)}
                        className="w-full min-h-[500px] p-4 font-mono text-xs leading-relaxed bg-gray-900 text-green-400 resize-y focus:outline-none"
                        spellCheck={false}
                        style={{ tabSize: 2 }}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 border-b px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Plain Text Preview — {LANG_LABELS[invitationLang]}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(htmlToPlainText(invitationEmail.body[invitationLang]))
                          }}
                          className="text-xs text-muted-foreground hover:text-gray-900 flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy as Text
                        </button>
                      </div>
                      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                        {invitationEmail.body[invitationLang] ? (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{htmlToPlainText(invitationEmail.body[invitationLang])}</div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-sm">No content for {LANG_LABELS[invitationLang]} yet</p>
                            <p className="text-xs mt-1">Switch to HTML Code mode to add content</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Available placeholders: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{guest_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_date}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{rsvp_link}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{venue_name}}'}</code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      More: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{salutation}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_time}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{venue_address}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{rsvp_deadline}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{organizer_email}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{custom_message}}'}</code>
                    </p>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(5)}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Next: Confirmation Email
                  </Button>
                </div>
              </>
            )}

            {/* STEP 5: Confirmation Email Setup */}
            {currentStep === 5 && (
              <>
                <Card className="p-4 bg-white space-y-4">
                  {/* Row 1: From Email & Sender Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confirmation-from" className="text-sm mb-2 block">
                        From Email*
                      </Label>
                      <Input
                        id="confirmation-from"
                        value={confirmationEmail.from}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default sender email address
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmation-sender-name" className="text-sm mb-2 block">
                        Sender Name*
                      </Label>
                      <Input
                        id="confirmation-sender-name"
                        type="text"
                        value={confirmationEmail.senderName}
                        onChange={(e) => setConfirmationEmail({ ...confirmationEmail, senderName: e.target.value })}
                        placeholder="Event Organizer"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 2: Reply-To Email & CC Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confirmation-reply-to" className="text-sm mb-2 block">
                        Reply to Email
                      </Label>
                      <Input
                        id="confirmation-reply-to"
                        type="email"
                        value={confirmationEmail.replyTo}
                        onChange={(e) => setConfirmationEmail({ ...confirmationEmail, replyTo: e.target.value })}
                        placeholder="reply@example.com"
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Replies will be sent to this email
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="confirmation-cc" className="text-sm mb-2 block">
                        CC Email
                      </Label>
                      <Input
                        id="confirmation-cc"
                        type="email"
                        value={confirmationEmail.cc}
                        onChange={(e) => setConfirmationEmail({ ...confirmationEmail, cc: e.target.value })}
                        placeholder="cc@example.com"
                        className="bg-white"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Send a copy to this email address
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Email Subject with Language Tabs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="confirmation-subject" className="text-base font-semibold">
                      Email Subject
                    </Label>
                    <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                  </div>
                  <Input
                    id="confirmation-subject"
                    value={confirmationEmail.subject[confirmationLang]}
                    onChange={(e) => updateConfirmationLangField('subject', confirmationLang, e.target.value)}
                    placeholder={`Enter email subject (${LANG_LABELS[confirmationLang]})...`}
                    className="bg-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Editing <span className="font-medium">{LANG_LABELS[confirmationLang]}</span> version
                      {confirmationEmail.subject[confirmationLang] === '' && confirmationLang !== 'EN' && (
                        <span className="text-amber-600 ml-1">— empty, will fall back to EN</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Email Image Assets */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Email Image Assets
                  </Label>
                  <Card className="p-4 bg-white space-y-4">
                    {/* Organizer Logo */}
                    <div>
                      <Label className="text-sm mb-2 block">Organizer Logo</Label>
                      <div className="flex items-center gap-3">
                        {emailAssets.organizerLogo ? (
                          <div className="relative w-[120px] h-[40px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.organizerLogo} alt="Organizer Logo" className="w-full h-full object-contain" />
                            <button
                              onClick={() => removeImageAsset('organizerLogo')}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-[120px] h-[40px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <Image className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleImageUpload('organizerLogo')}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.organizerLogo ? 'Replace' : 'Upload'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">120x40px recommended. Displayed in email header.</p>
                    </div>

                    {/* Event Banner - Multilingual */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm">Event Banner</Label>
                        <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                      </div>
                      <div className="space-y-2">
                        {emailAssets.eventBanner[confirmationLang] ? (
                          <div className="relative w-full h-[80px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.eventBanner[confirmationLang]} alt={`Event Banner (${LANG_LABELS[confirmationLang]})`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeBannerAsset(confirmationLang)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-[80px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <Image className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                              <span className="text-xs text-gray-400">536x200px ({LANG_LABELS[confirmationLang]})</span>
                            </div>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleBannerUpload(confirmationLang)}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.eventBanner[confirmationLang] ? `Replace Banner (${LANG_LABELS[confirmationLang]})` : `Upload Banner (${LANG_LABELS[confirmationLang]})`}
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          536x200px recommended. Upload separate banner for each language.
                          {!emailAssets.eventBanner[confirmationLang] && confirmationLang !== 'EN' && emailAssets.eventBanner.EN && (
                            <span className="text-amber-600 ml-1">— will fall back to EN</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Footer Logo */}
                    <div>
                      <Label className="text-sm mb-2 block">Footer Logo</Label>
                      <div className="flex items-center gap-3">
                        {emailAssets.eventLogo ? (
                          <div className="relative w-[72px] h-[32px] border rounded overflow-hidden bg-gray-50">
                            <img src={emailAssets.eventLogo} alt="Footer Logo" className="w-full h-full object-contain" />
                            <button
                              onClick={() => removeImageAsset('eventLogo')}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-[72px] h-[32px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                            <Image className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleImageUpload('eventLogo')}>
                          <Upload className="h-3 w-3 mr-1" />
                          {emailAssets.eventLogo ? 'Replace' : 'Upload'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">72px wide. Displayed in email footer.</p>
                    </div>
                  </Card>
                </div>

                {/* Email Footer Text - Multilingual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">
                      Email Footer Text
                    </Label>
                    <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                  </div>
                  <Textarea
                    value={confirmationFooter[confirmationLang]}
                    onChange={(e) => setConfirmationFooter(prev => ({ ...prev, [confirmationLang]: e.target.value }))}
                    placeholder={`Enter footer text (${LANG_LABELS[confirmationLang]})...`}
                    rows={3}
                    className="bg-white"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Globe className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Footer text for <span className="font-medium">{LANG_LABELS[confirmationLang]}</span> version
                    </p>
                  </div>
                </div>

                {/* Email Body - Multilingual */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="confirmation-body" className="text-base font-semibold">
                        Email Body
                      </Label>
                      <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                      <button
                        onClick={() => setConfirmationEditorMode('html')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          confirmationEditorMode === 'html'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Code className="h-3 w-3" />
                        HTML Code
                      </button>
                      <button
                        onClick={() => setConfirmationEditorMode('plaintext')}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          confirmationEditorMode === 'plaintext'
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <FileText className="h-3 w-3" />
                        Plain Text
                      </button>
                    </div>
                  </div>
                  {confirmationEditorMode === 'html' ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-mono">HTML Source — {LANG_LABELS[confirmationLang]}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(confirmationEmail.body[confirmationLang])
                            }}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={confirmationEmail.body[confirmationLang]}
                        onChange={(e) => updateConfirmationLangField('body', confirmationLang, e.target.value)}
                        className="w-full min-h-[500px] p-4 font-mono text-xs leading-relaxed bg-gray-900 text-green-400 resize-y focus:outline-none"
                        spellCheck={false}
                        style={{ tabSize: 2 }}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="bg-gray-50 border-b px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Plain Text Preview — {LANG_LABELS[confirmationLang]}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(htmlToPlainText(confirmationEmail.body[confirmationLang]))
                          }}
                          className="text-xs text-muted-foreground hover:text-gray-900 flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy as Text
                        </button>
                      </div>
                      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                        {confirmationEmail.body[confirmationLang] ? (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{htmlToPlainText(confirmationEmail.body[confirmationLang])}</div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                            <FileText className="h-8 w-8 mb-2 opacity-40" />
                            <p className="text-sm">No content for {LANG_LABELS[confirmationLang]} yet</p>
                            <p className="text-xs mt-1">Switch to HTML Code mode to add content</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Available placeholders: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{guest_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{salutation}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_date}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{event_time}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{venue_name}}'}</code>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      More: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{registration_number}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{ticket_type_name}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{ticket_scope_label}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{confirmation_page_url}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{organizer_email}}'}</code> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{'{{bring_along_name}}'}</code>
                    </p>
                  </div>
                </div>

                {/* Action bar */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(4)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(6)}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Next: Send Test Email
                  </Button>
                </div>
              </>
            )}

            {/* STEP 6: Test Email */}
            {currentStep === 6 && (
              <>
                {/* Send Test Email Card */}
                <Card className="p-5 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 text-[#107DAC]" />
                    <h3 className="font-semibold text-base">Send Test Email</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Both invitation and confirmation emails will be sent to the test address below.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-email" className="text-sm mb-1.5 block">
                        Test Email Address
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="test-email"
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendTestEmails}
                          disabled={!testEmail || !testEmail.includes('@') || isSending}
                          className="bg-[#107DAC] hover:bg-[#0d6390] px-5"
                        >
                          {isSending ? (
                            <><RotateCw className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                          ) : (
                            <><Send className="h-4 w-4 mr-2" />Send Test</>
                          )}
                        </Button>
                      </div>
                    </div>

                    {testEmailSent && testEmailRecords.length === 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">Test emails sent successfully.</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Delivery Timeline */}
                {testEmailRecords.length > 0 && (
                  <Card className="p-5 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#107DAC]" />
                        <h3 className="font-semibold text-base">Delivery Timeline</h3>
                      </div>
                      <span className="text-xs text-muted-foreground">{testEmailRecords.length} email(s) tracked</span>
                    </div>

                    <div className="space-y-4">
                      {testEmailRecords.map((record) => (
                        <div key={record.id} className="border rounded-lg overflow-hidden">
                          {/* Record Header */}
                          <div className={cn(
                            "px-4 py-2.5 flex items-center justify-between",
                            record.emailType === 'invitation'
                              ? "bg-blue-50 border-b border-blue-100"
                              : "bg-emerald-50 border-b border-emerald-100"
                          )}>
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                record.emailType === 'invitation' ? "bg-blue-500" : "bg-emerald-500"
                              )} />
                              <span className="text-sm font-medium">
                                {record.emailType === 'invitation' ? 'Invitation Email' : 'Confirmation Email'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{record.email}</span>
                              <span className="text-gray-300">|</span>
                              <span>{record.sentAt}</span>
                            </div>
                          </div>

                          {/* Timeline Steps */}
                          <div className="px-4 py-3">
                            <div className="relative">
                              {record.timeline.map((step, idx) => {
                                const isLast = idx === record.timeline.length - 1
                                const StatusIcon = step.status === 'completed' ? CheckCircle2
                                  : step.status === 'in_progress' ? RotateCw
                                  : step.status === 'failed' ? AlertCircle
                                  : Clock

                                const iconColor = step.status === 'completed' ? 'text-green-500'
                                  : step.status === 'in_progress' ? 'text-[#107DAC] animate-spin'
                                  : step.status === 'failed' ? 'text-red-500'
                                  : 'text-gray-300'

                                const lineColor = step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'

                                return (
                                  <div key={step.key} className="flex items-start gap-3 relative">
                                    {/* Vertical line connector */}
                                    {!isLast && (
                                      <div className={cn("absolute left-[9px] top-[22px] w-[2px] h-[calc(100%-4px)]", lineColor)} />
                                    )}
                                    {/* Status icon */}
                                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                                      <StatusIcon className={cn("h-[18px] w-[18px]", iconColor)} />
                                    </div>
                                    {/* Step info */}
                                    <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                                      <div className="flex items-center justify-between">
                                        <span className={cn(
                                          "text-sm",
                                          step.status === 'completed' ? "text-gray-900 font-medium" :
                                          step.status === 'in_progress' ? "text-[#107DAC] font-medium" :
                                          "text-gray-400"
                                        )}>
                                          {step.label}
                                        </span>
                                        {step.timestamp && (
                                          <span className="text-xs text-muted-foreground font-mono">{step.timestamp}</span>
                                        )}
                                      </div>
                                      {step.detail && step.status !== 'pending' && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Summary Card */}
                <Card className="p-5 bg-white">
                  <h3 className="font-semibold text-base mb-3">Configuration Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Registration Form</p>
                        <p className="text-muted-foreground text-xs">
                          {Object.values(config.visibleFields).filter(Boolean).length + 3} fields, {customQuestions.length} custom questions, quota: {config.linkQuota}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Invitation Email</p>
                        <p className="text-muted-foreground text-xs">{invitationEmail.subject.EN}</p>
                        <p className="text-muted-foreground text-xs">From: {invitationEmail.from}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Confirmation Email</p>
                        <p className="text-muted-foreground text-xs">{confirmationEmail.subject.EN}</p>
                        <p className="text-muted-foreground text-xs">From: {confirmationEmail.from}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Action bar */}
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setCurrentStep(5)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-[#107DAC] hover:bg-[#0d6390]"
                  >
                    Complete
                  </Button>
                </div>
              </>
            )}
          </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT: Live Preview */}
        <ResizablePanel defaultSize={60} minSize={35} maxSize={75}>
          <div className="h-full bg-gray-50 overflow-y-auto">
          <div className="p-8">
            <div className="mb-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                LIVE PREVIEW
              </p>
            </div>
            
            {/* STEP 1 & 2: Event/Ticket/Session Selection Preview */}
            {(currentStep === 1 || currentStep === 2) && (
              <div className="max-w-lg mx-auto space-y-4">
                {/* Event Card */}
                {selectedEvent ? (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#023F59] via-[#107DAC] to-[#31D7DB] text-white p-6">
                      <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-2">Selected Event</p>
                      <h2 className="text-xl font-bold mb-2">{selectedEvent.name}</h2>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-white/70" />
                          <span className="text-white/90">
                            {format(selectedEvent.startDate, "MMM d, yyyy")} - {format(selectedEvent.endDate, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-white/70" />
                          <span className="text-white/90">{selectedEvent.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket */}
                    {selectedTicket && (
                      <div className="p-5 border-b">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Ticket Type</p>
                        <div
                          className="border-l-4 rounded-lg p-4 bg-gray-50"
                          style={{ borderLeftColor: selectedTicket.colorHex }}
                        >
                          <div className="font-semibold text-gray-900">{selectedTicket.name}</div>
                          <p className="text-xs text-muted-foreground mt-1">{selectedTicket.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span>{selectedTicket.available} / {selectedTicket.total} available</span>
                            <span>·</span>
                            <span>{selectedTicket.price ? `$${selectedTicket.price}` : 'Free'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sessions */}
                    {currentStep === 2 && selectedSessions.length > 0 && (
                      <div className="p-5 border-b">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Selected Sessions</p>
                        <div className="space-y-2">
                          {selectedSessions.map(sid => {
                            const session = mockSubEventTickets.find(s => s.id === sid) || availableSubEventsForTicket.find(s => s.id === sid)
                            if (!session) return null
                            return (
                              <div key={sid} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium">{session.name}</div>
                                  {session.sessionDate && session.sessionTime && (
                                    <div className="text-xs text-muted-foreground">{format(session.sessionDate, "MMM d, yyyy")} · {session.sessionTime}</div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Companions */}
                    {allowCompanions && (
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Companions</p>
                        <div className="text-sm text-gray-700">
                          Up to <span className="font-semibold">{maxCompanions}</span> companion{maxCompanions !== 1 ? 's' : ''} allowed
                          <span className="text-muted-foreground ml-1">
                            ({companionDetailsLevel === 'names-only' ? 'Names only' : 'Full details'})
                          </span>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">
                      Select an event from the left panel to preview details
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Registration Form Preview */}
            {currentStep === 3 && (
              <div className="mx-auto">
                {/* Toolbar row: Device Selector + Language */}
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <DevicePreviewToolbar
                    selectedPresetId={previewDeviceId}
                    onSelect={(p) => setPreviewDeviceId(p.id)}
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <LanguageTabs value={registrationLang} onChange={setRegistrationLang} />
                  </div>
                </div>
                {/* Preview container with responsive width */}
                <div className="flex justify-center">
                  <div
                    className="transition-all duration-300 ease-in-out w-full"
                    style={{
                      maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : '100%',
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                      <div className="bg-[#f0f4f8]">
                        <iframe
                          key={`reg-preview-${previewDeviceId}-${registrationLang}-${fieldOrder.join(',')}-${JSON.stringify(config.visibleFields)}-${JSON.stringify(config.requiredFields)}-${JSON.stringify(config.fieldLabels)}-${customQuestions.map(q => q.id + q.label).join(',')}-${selectedTicketId}-${selectedSessions.join(',')}-${allowCompanions}-${maxCompanions}-${companionDetailsLevel}`}
                          srcDoc={(() => {
                            const rawHtml = registrationFormHtml[registrationLang] || registrationFormHtml.EN
                            if (!rawHtml) return ''
                            const placeholderMap: Record<string, string> = {
                              '{{event_name}}': eventName || 'Hong Kong Wine & Dine Festival 2026',
                              '{{event_description}}': 'Join us for an unforgettable celebration of world-class wines, gourmet cuisine, and live entertainment at the Victoria Harbour waterfront.',
                              '{{event_date}}': eventStartDate ? format(eventStartDate, 'EEEE, d MMMM yyyy') : 'Fri 25 – Sun 27 Oct 2026',
                              '{{venue_name}}': eventVenue || 'Central Harbourfront Event Space',
                              '{{rsvp_deadline}}': eventStartDate ? format(new Date(eventStartDate.getTime() - 14 * 86400000), 'd MMMM yyyy') : '11 Oct 2026',
                            }
                            let html = rawHtml
                            for (const [placeholder, value] of Object.entries(placeholderMap)) {
                              html = html.split(placeholder).join(value)
                            }

                            // --- Dynamically rebuild "Ticket Selection" from selected ticket + sessions ---
                            const tktStep1Lbl = registrationLang === 'TC' ? '步驟 1' : registrationLang === 'SC' ? '步骤 1' : 'Step 1'
                            const tktSecTitle = registrationLang === 'TC' ? '選擇門票' : registrationLang === 'SC' ? '选择门票' : 'Choose Your Ticket'
                            const tktSecSubtitle = registrationLang === 'TC' ? '選擇一張活動門票以開始。' : registrationLang === 'SC' ? '选择一张活动门票以开始。' : 'Select one event ticket to get started.'
                            const tktAdmLbl = registrationLang === 'TC' ? '活動入場' : registrationLang === 'SC' ? '活动入场' : 'Event Admission'
                            const tktAddSessionsLbl = registrationLang === 'TC' ? '新增場次（選填）' : registrationLang === 'SC' ? '添加场次（选填）' : 'Add Sessions (optional)'
                            const tktFreeLbl = registrationLang === 'TC' ? '免費' : registrationLang === 'SC' ? '免费' : 'Free'
                            const tktName = ticketTypeName || 'General Admission'
                            const tktColor = ticketTypeColor || '#107DAC'
                            const tktDesc = selectedTicket?.description || 'Full access to the event grounds and main stage'
                            const tktAvail = selectedTicket?.available ?? 238
                            const tktTotal = selectedTicket?.total ?? 500

                            // Build sub-events cards
                            let subEventsHtml = ''
                            if (availableSubEventsForTicket.length > 0) {
                              subEventsHtml += `<div class="sub-events visible">\n`
                              subEventsHtml += `  <div class="sub-event-divider">${tktAddSessionsLbl}</div>\n`
                              for (const sess of availableSubEventsForTicket) {
                                const isSel = selectedSessions.includes(sess.id)
                                const sessDate = sess.sessionDate ? format(sess.sessionDate, 'EEE d MMM') : ''
                                const sessTime = sess.sessionTime || ''
                                const sessQuotaLow = (sess.available ?? 0) <= 10 && (sess.available ?? 0) > 0
                                const sessSoldOut = (sess.available ?? 0) === 0
                                subEventsHtml += `<div class="ticket-card${isSel ? ' selected' : ''}${sessSoldOut ? ' disabled' : ''}" data-type="sub">\n`
                                subEventsHtml += `  <div class="ticket-check"></div>\n`
                                subEventsHtml += `  <div class="ticket-info">\n`
                                subEventsHtml += `    <div class="ticket-name"><span class="ticket-colour-dot" style="background:${sess.colorHex}"></span>${sess.name}</div>\n`
                                subEventsHtml += `    <p class="ticket-desc">${sessDate}${sessDate && sessTime ? ' &middot; ' : ''}${sessTime}</p>\n`
                                subEventsHtml += `    <div class="ticket-meta"><span class="ticket-badge free">${tktFreeLbl}</span>`
                                if (sessSoldOut) {
                                  subEventsHtml += `<span class="ticket-quota sold-out">Sold Out</span>`
                                } else {
                                  subEventsHtml += `<span class="ticket-quota${sessQuotaLow ? ' low' : ''}">${sess.available} of ${sess.total} remaining</span>`
                                }
                                subEventsHtml += `</div>\n`
                                subEventsHtml += `  </div>\n</div>\n`
                              }
                              subEventsHtml += `</div>\n`
                            }

                            const quotaLow = tktAvail <= 20 && tktAvail > 0
                            const newTicketSection = `<!-- TICKET SELECTION -->\n    <div class="section">\n      <div class="section-header">\n        <p class="section-label">${tktStep1Lbl}</p>\n        <h2 class="section-title">${tktSecTitle}</h2>\n        <p class="section-subtitle">${tktSecSubtitle}</p>\n      </div>\n      <div class="section-body">\n        <div class="ticket-group-label">${tktAdmLbl}</div>\n        <div class="ticket-card selected" data-type="event">\n          <div class="ticket-radio"></div>\n          <div class="ticket-info">\n            <div class="ticket-name"><span class="ticket-colour-dot" style="background:${tktColor}"></span>${tktName}</div>\n            <p class="ticket-desc">${tktDesc}</p>\n            <div class="ticket-meta"><span class="ticket-badge free">${tktFreeLbl}</span><span class="ticket-quota${quotaLow ? ' low' : ''}">${tktAvail} of ${tktTotal} remaining</span></div>\n          </div>\n        </div>\n        ${subEventsHtml}\n      </div>\n    </div>`

                            // Replace existing TICKET SELECTION section
                            const tsStart = html.indexOf('<!-- TICKET SELECTION -->')
                            if (tsStart !== -1) {
                              let tsEnd = html.length
                              const ydMarker = html.indexOf('<!-- YOUR DETAILS -->', tsStart + 24)
                              if (ydMarker !== -1 && ydMarker < tsEnd) tsEnd = ydMarker
                              html = html.substring(0, tsStart) + newTicketSection + '\n\n    ' + html.substring(tsEnd)
                            }

                            // --- Dynamically rebuild "Your Details" from fieldOrder ---
                            const coreFields = ['firstName', 'lastName', 'email']
                            const visibleOrderedFields = fieldOrder.filter((fk: string) => {
                              if (coreFields.includes(fk)) return true
                              if (fk.startsWith('custom_')) return true
                              return config.visibleFields[fk as keyof typeof config.visibleFields]
                            })
                            const isReq = (fk: string) => {
                              if (coreFields.includes(fk)) return true
                              return config.requiredFields[fk as keyof typeof config.requiredFields] || false
                            }
                            const getLabel = (fk: string) => {
                              const cq = fk.startsWith('custom_') ? customQuestions.find(q => q.id === fk) : null
                              if (cq) return cq.label
                              return config.fieldLabels[fk as keyof typeof config.fieldLabels] || fk
                            }
                            const reqSpan = (fk: string) => isReq(fk)
                              ? '<span class="required">*</span>'
                              : '<span class="optional">optional</span>'
                            const fph: Record<string, string> = {
                              salutation: '', firstName: 'e.g. Sarah', lastName: 'e.g. Chen',
                              email: 'e.g. sarah.chen@example.com', title: 'e.g. Director of Marketing',
                              organization: 'e.g. Hong Kong Tourism Board', phone: 'e.g. 9123 4567', wechatId: 'e.g. sarah_wx',
                            }
                            const fit: Record<string, string> = { email: 'email', phone: 'tel' }
                            const renderField = (fk: string): string => {
                              const label = getLabel(fk); const req = reqSpan(fk)
                              if (fk === 'salutation') return `<div class="form-group"><label>${label} ${req}</label><select class="form-input form-select"><option value="">Select</option><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option><option>Prof</option></select></div>`
                              if (fk === 'phone') return `<div class="form-group"><label>${label} ${req}</label><div class="phone-group"><select class="form-input form-select"><option>+852</option><option>+86</option><option>+60</option><option>+66</option><option>+65</option><option>+81</option><option>+82</option><option>+886</option><option>+44</option><option>+1</option></select><input type="tel" class="form-input" placeholder="${fph[fk] || ''}"></div></div>`
                              return `<div class="form-group"><label>${label} ${req}</label><input type="${fit[fk] || 'text'}" class="form-input" placeholder="${fph[fk] || ''}"${isReq(fk) ? ' required' : ''}></div>`
                            }
                            const fullW = ['email', 'organization', 'phone']
                            let fHtml = ''
                            let fi = 0
                            while (fi < visibleOrderedFields.length) {
                              const fk = visibleOrderedFields[fi]
                              if (fullW.includes(fk) || fk.startsWith('custom_')) {
                                fHtml += `<div class="form-row full">${renderField(fk)}</div>\n`
                                fi++
                              } else {
                                const nk = fi + 1 < visibleOrderedFields.length ? visibleOrderedFields[fi + 1] : null
                                if (nk && !fullW.includes(nk) && !nk.startsWith('custom_')) {
                                  fHtml += `<div class="form-row">${renderField(fk)}${renderField(nk)}</div>\n`
                                  fi += 2
                                } else {
                                  fHtml += `<div class="form-row full">${renderField(fk)}</div>\n`
                                  fi++
                                }
                              }
                            }
                            const plLabel = registrationLang === 'TC' ? '語言偏好' : registrationLang === 'SC' ? '语言偏好' : 'Preferred Language'
                            fHtml += `<div class="form-row full"><div class="form-group"><label>${plLabel} <span class="optional">optional</span></label><select class="form-input form-select"><option value="en">English</option><option value="zh_tw">繁體中文</option><option value="zh_sc">简体中文</option></select></div></div>\n`
                            const stepLbl = registrationLang === 'TC' ? '步驟 2' : registrationLang === 'SC' ? '步骤 2' : 'Step 2'
                            const secTitle = registrationLang === 'TC' ? '您的資料' : registrationLang === 'SC' ? '您的资料' : 'Your Details'
                            const newSection = `<!-- YOUR DETAILS -->\n    <div class="section">\n      <div class="section-header">\n        <p class="section-label">${stepLbl}</p>\n        <h2 class="section-title">${secTitle}</h2>\n      </div>\n      <div class="section-body">\n        ${fHtml}\n      </div>\n    </div>`
                            const ds = html.indexOf('<!-- YOUR DETAILS -->')
                            if (ds !== -1) {
                              let ns = html.length
                              for (const m of ['<!-- COMPANIONS -->', '<!-- SUBMIT -->']) { const idx = html.indexOf(m, ds + 21); if (idx !== -1 && idx < ns) ns = idx }
                              const as2 = html.indexOf('<div class="section">', ds + 21)
                              if (as2 !== -1) { const nd = html.indexOf('<div class="section">', as2 + 21); if (nd !== -1 && nd < ns) ns = nd }
                              html = html.substring(0, ds) + newSection + '\n\n    ' + html.substring(ns)
                            }
                            // Replace any remaining label placeholders
                            for (const [p, v] of Object.entries({
                              '{{label_salutation}}': getLabel('salutation'), '{{label_title}}': getLabel('title'),
                              '{{label_first_name}}': getLabel('firstName'), '{{label_last_name}}': getLabel('lastName'),
                              '{{label_email}}': getLabel('email'), '{{label_organization}}': getLabel('organization'),
                              '{{label_phone}}': getLabel('phone'), '{{label_wechat_id}}': getLabel('wechatId'),
                              '{{label_preferred_language}}': plLabel,
                            })) { html = html.split(p).join(v) }
                            return html
                          })()}
                          className="w-full border-0"
                          style={{ minHeight: '800px' }}
                          title="Registration Form Preview"
                          sandbox="allow-same-origin"
                          onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement
                            if (iframe.contentDocument) {
                              const height = iframe.contentDocument.documentElement.scrollHeight
                              iframe.style.height = `${Math.max(height + 40, 800)}px`
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Invitation Email Preview */}
            {currentStep === 4 && (
              <div className="mx-auto">
                {/* Toolbar row: Device Selector + Language */}
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <DevicePreviewToolbar
                    selectedPresetId={previewDeviceId}
                    onSelect={(p) => setPreviewDeviceId(p.id)}
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                  </div>
                </div>
                {/* Preview container with responsive width */}
                <div className="flex justify-center">
                  <div
                    className="transition-all duration-300 ease-in-out w-full"
                    style={{
                      maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : '100%',
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                      <div className="bg-gray-100 border-b p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">From:</span>
                            <span className="text-gray-900">{invitationEmail.from}</span>
                          </div>
                          {invitationEmail.replyTo && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">Reply-To:</span>
                              <span className="text-gray-900">{invitationEmail.replyTo}</span>
                            </div>
                          )}
                          {invitationEmail.cc && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">CC:</span>
                              <span className="text-gray-900">{invitationEmail.cc}</span>
                            </div>
                          )}
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">To:</span>
                            <span className="text-gray-900">recipient@example.com</span>
                          </div>
                          <div className="flex items-start pt-2 border-t">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">Subject:</span>
                            <span className="text-gray-900 font-semibold">{invitationEmail.subject[invitationLang] || invitationEmail.subject.EN}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#f0f4f8]">
                        <iframe
                          key={`inv-preview-${previewDeviceId}-${invitationLang}`}
                          srcDoc={invitationEmail.body[invitationLang] || invitationEmail.body.EN}
                          className="w-full border-0"
                          style={{ minHeight: '800px' }}
                          title="Invitation Email Preview"
                          sandbox="allow-same-origin"
                          onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement
                            if (iframe.contentDocument) {
                              const height = iframe.contentDocument.documentElement.scrollHeight
                              iframe.style.height = `${Math.max(height + 40, 800)}px`
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Confirmation Email Preview */}
            {currentStep === 5 && (
              <div className="mx-auto">
                {/* Toolbar row: Device Selector + Language */}
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <DevicePreviewToolbar
                    selectedPresetId={previewDeviceId}
                    onSelect={(p) => setPreviewDeviceId(p.id)}
                  />
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                  </div>
                </div>
                {/* Preview container with responsive width */}
                <div className="flex justify-center">
                  <div
                    className="transition-all duration-300 ease-in-out w-full"
                    style={{
                      maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : '100%',
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                      <div className="bg-gray-100 border-b p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">From:</span>
                            <span className="text-gray-900">{confirmationEmail.from}</span>
                          </div>
                          {confirmationEmail.replyTo && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">Reply-To:</span>
                              <span className="text-gray-900">{confirmationEmail.replyTo}</span>
                            </div>
                          )}
                          {confirmationEmail.cc && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">CC:</span>
                              <span className="text-gray-900">{confirmationEmail.cc}</span>
                            </div>
                          )}
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">To:</span>
                            <span className="text-gray-900">recipient@example.com</span>
                          </div>
                          <div className="flex items-start pt-2 border-t">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">Subject:</span>
                            <span className="text-gray-900 font-semibold">{confirmationEmail.subject[confirmationLang] || confirmationEmail.subject.EN}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#f0f4f8]">
                        <iframe
                          key={`conf-preview-${previewDeviceId}-${confirmationLang}`}
                          srcDoc={confirmationEmail.body[confirmationLang] || confirmationEmail.body.EN}
                          className="w-full border-0"
                          style={{ minHeight: '800px' }}
                          title="Confirmation Email Preview"
                          sandbox="allow-same-origin"
                          onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement
                            if (iframe.contentDocument) {
                              const height = iframe.contentDocument.documentElement.scrollHeight
                              iframe.style.height = `${Math.max(height + 40, 800)}px`
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Tabbed Email Preview */}
            {currentStep === 6 && (
              <div className="mx-auto">
                {/* Row 1: Email type tabs + Language */}
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <div className="flex items-center bg-white border rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setTestEmailPreviewTab('invitation')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        testEmailPreviewTab === 'invitation'
                          ? "bg-[#107DAC] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <Mail className="h-4 w-4" />
                      Invitation
                    </button>
                    <button
                      onClick={() => setTestEmailPreviewTab('confirmation')}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        testEmailPreviewTab === 'confirmation'
                          ? "bg-[#107DAC] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirmation
                    </button>
                  </div>
                  <LanguageTabs value={testPreviewLang} onChange={setTestPreviewLang} />
                </div>
                {/* Row 2: Device selector */}
                <div className="mb-3">
                  <DevicePreviewToolbar
                    selectedPresetId={previewDeviceId}
                    onSelect={(p) => setPreviewDeviceId(p.id)}
                  />
                </div>

                {/* Preview container with responsive width */}
                <div className="flex justify-center">
                  <div
                    className="transition-all duration-300 ease-in-out w-full"
                    style={{
                      maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : '100%',
                    }}
                  >
                    {/* Email Preview Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                      {/* Email envelope header */}
                      <div className="bg-gray-100 border-b p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">From:</span>
                            <span className="text-gray-900">
                              {testEmailPreviewTab === 'invitation'
                                ? `${invitationEmail.senderName || 'Event Organizer'} <${invitationEmail.from}>`
                                : `${confirmationEmail.senderName || 'Event Organizer'} <${confirmationEmail.from}>`}
                            </span>
                          </div>
                          {((testEmailPreviewTab === 'invitation' && invitationEmail.replyTo) ||
                            (testEmailPreviewTab === 'confirmation' && confirmationEmail.replyTo)) && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">Reply-To:</span>
                              <span className="text-gray-900">
                                {testEmailPreviewTab === 'invitation' ? invitationEmail.replyTo : confirmationEmail.replyTo}
                              </span>
                            </div>
                          )}
                          {((testEmailPreviewTab === 'invitation' && invitationEmail.cc) ||
                            (testEmailPreviewTab === 'confirmation' && confirmationEmail.cc)) && (
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">CC:</span>
                              <span className="text-gray-900">
                                {testEmailPreviewTab === 'invitation' ? invitationEmail.cc : confirmationEmail.cc}
                              </span>
                            </div>
                          )}
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">To:</span>
                            <span className="text-gray-900">{testEmail || 'recipient@example.com'}</span>
                          </div>
                          <div className="flex items-start pt-2 border-t">
                            <span className="text-gray-600 font-medium w-24 flex-shrink-0">Subject:</span>
                            <span className="text-gray-900 font-semibold">
                              {testEmailPreviewTab === 'invitation'
                                ? (invitationEmail.subject[testPreviewLang] || invitationEmail.subject.EN)
                                : (confirmationEmail.subject[testPreviewLang] || confirmationEmail.subject.EN)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Email body iframe */}
                      <div className="bg-[#f0f4f8]">
                        {testEmailPreviewTab === 'invitation' ? (
                          <iframe
                            key={`inv-${testPreviewLang}-${previewDeviceId}`}
                            srcDoc={invitationEmail.body[testPreviewLang] || invitationEmail.body.EN}
                            className="w-full border-0"
                            style={{ minHeight: '800px' }}
                            title="Invitation Email Preview"
                            sandbox="allow-same-origin"
                            onLoad={(e) => {
                              const iframe = e.target as HTMLIFrameElement
                              if (iframe.contentDocument) {
                                const height = iframe.contentDocument.documentElement.scrollHeight
                                iframe.style.height = `${Math.max(height + 40, 800)}px`
                              }
                            }}
                          />
                        ) : (
                          <iframe
                            key={`conf-${testPreviewLang}-${previewDeviceId}`}
                            srcDoc={confirmationEmail.body[testPreviewLang] || confirmationEmail.body.EN}
                            className="w-full border-0"
                            style={{ minHeight: '800px' }}
                            title="Confirmation Email Preview"
                            sandbox="allow-same-origin"
                            onLoad={(e) => {
                              const iframe = e.target as HTMLIFrameElement
                              if (iframe.contentDocument) {
                                const height = iframe.contentDocument.documentElement.scrollHeight
                                iframe.style.height = `${Math.max(height + 40, 800)}px`
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}