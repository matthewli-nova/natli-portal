"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card } from "../ui/card"
import { cn } from "../ui/utils"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable"
import {
  ArrowLeft,
  Copy,
  Upload,
  Code,
  FileText,
  Image,
  X,
  Globe,
  Mail,
  Send,
  Clock,
  Check,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react"
import { format } from "date-fns"

// ── Types ────────────────────────────────────────────────────────────────────

type EmailLang = "EN" | "TC" | "SC"

interface MultiLangString {
  EN: string
  TC: string
  SC: string
}

const LANG_LABELS: Record<EmailLang, string> = { EN: "EN", TC: "繁中", SC: "简中" }

function createMultiLang(en: string, tc: string = "", sc: string = ""): MultiLangString {
  return { EN: en, TC: tc, SC: sc }
}

// ── Shared LanguageTabs (same as registration editor) ────────────────────────

function LanguageTabs({ value, onChange }: { value: EmailLang; onChange: (v: EmailLang) => void }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-md p-0.5 gap-0.5">
      {(["EN", "TC", "SC"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={cn(
            "px-2.5 py-1 rounded text-xs font-medium transition-colors",
            value === lang ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  )
}

// ── Device Preview (same as registration editor) ─────────────────────────────

type DeviceCategory = "mobile" | "tablet" | "desktop"

interface DevicePreset {
  id: string
  label: string
  shortLabel: string
  width: number | null
  category: DeviceCategory
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: "iphone-se", label: "iPhone SE", shortLabel: "375", width: 375, category: "mobile" },
  { id: "iphone-13", label: "iPhone 13 / 14", shortLabel: "390", width: 390, category: "mobile" },
  { id: "iphone-15", label: "iPhone 15 / 16", shortLabel: "393", width: 393, category: "mobile" },
  { id: "iphone-16-pro", label: "iPhone 16 Pro", shortLabel: "402", width: 402, category: "mobile" },
  { id: "iphone-16-pro-max", label: "iPhone 16 Pro Max", shortLabel: "440", width: 440, category: "mobile" },
  { id: "galaxy-s25", label: "Galaxy S25", shortLabel: "360", width: 360, category: "mobile" },
  { id: "galaxy-s25-ultra", label: "Galaxy S25 Ultra", shortLabel: "412", width: 412, category: "mobile" },
  { id: "ipad-mini-7", label: "iPad Mini 7th", shortLabel: "744", width: 744, category: "tablet" },
  { id: "ipad-10th", label: "iPad 10th Gen", shortLabel: "820", width: 820, category: "tablet" },
  { id: "ipad-air-13", label: "iPad Air 13″ (M2)", shortLabel: "1024", width: 1024, category: "tablet" },
  { id: "surface-pro-11", label: "Surface Pro 11th Ed.", shortLabel: "912", width: 912, category: "tablet" },
  { id: "galaxy-tab-s9-ultra", label: "Galaxy Tab S9 Ultra", shortLabel: "960", width: 960, category: "tablet" },
  { id: "macbook-air-13", label: "MacBook Air 13″", shortLabel: "1280", width: 1280, category: "desktop" },
  { id: "desktop-fhd", label: "Full HD (1080p)", shortLabel: "1920", width: 1920, category: "desktop" },
  { id: "desktop-full", label: "Full Width", shortLabel: "100%", width: null, category: "desktop" },
]

const CATEGORY_ICON: Record<DeviceCategory, React.ReactNode> = {
  mobile: <Smartphone className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
}

const CATEGORY_LABEL: Record<DeviceCategory, string> = {
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
}

function DevicePreviewToolbar({
  selectedPresetId,
  onSelect,
}: {
  selectedPresetId: string
  onSelect: (preset: DevicePreset) => void
}) {
  const fallbackPreset = DEVICE_PRESETS.find((p) => p.id === "desktop-full") || DEVICE_PRESETS[DEVICE_PRESETS.length - 1]
  const selectedPreset = DEVICE_PRESETS.find((p) => p.id === selectedPresetId) || fallbackPreset
  const [openCategory, setOpenCategory] = React.useState<DeviceCategory | null>(null)

  return (
    <div className="flex items-center gap-1 bg-white border rounded-lg p-1 shadow-sm">
      {(["mobile", "tablet", "desktop"] as const).map((cat) => {
        const isActiveCategory = selectedPreset.category === cat
        const isOpen = openCategory === cat
        const catPresets = DEVICE_PRESETS.filter((p) => p.category === cat)

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
                <span className="ml-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/20">
                  {selectedPreset.shortLabel}
                </span>
              )}
              <svg
                className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenCategory(null)} />
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border rounded-lg shadow-lg py-1 min-w-[220px] max-h-[420px] overflow-y-auto">
                  {catPresets.map((preset) => (
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
                      <span
                        className={cn(
                          "text-[10px] tabular-nums px-1.5 py-0.5 rounded flex-shrink-0",
                          selectedPresetId === preset.id
                            ? "bg-[#107DAC]/15 text-[#107DAC]"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {preset.width ? `${preset.width}px` : "100%"}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })}

      <div className="ml-auto pl-2 border-l flex items-center gap-1">
        <span className="text-[10px] text-gray-400 tabular-nums">
          {selectedPreset.width ? `${selectedPreset.width}px` : "Auto"}
        </span>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

interface InvitationEmailEditorProps {
  eventName: string
  eventStartDate?: Date
  onSave: () => void
  onCancel: () => void
}

export function InvitationEmailEditor({
  eventName,
  eventStartDate,
  onSave,
  onCancel,
}: InvitationEmailEditorProps) {
  const [currentStep, setCurrentStep] = React.useState(1)

  // Editor modes
  const [invitationEditorMode, setInvitationEditorMode] = React.useState<"html" | "plaintext">("html")
  const [confirmationEditorMode, setConfirmationEditorMode] = React.useState<"html" | "plaintext">("html")

  // Lang selections
  const [invitationLang, setInvitationLang] = React.useState<EmailLang>("EN")
  const [confirmationLang, setConfirmationLang] = React.useState<EmailLang>("EN")

  // Image assets
  const [emailAssets, setEmailAssets] = React.useState({
    organizerLogo: "",
    eventBanner: { EN: "", TC: "", SC: "" } as MultiLangString,
    eventLogo: "",
  })

  // Footer text multilingual
  const [invitationFooter, setInvitationFooter] = React.useState<MultiLangString>(
    createMultiLang(
      "Nebulae Technology Limited\nUnit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong",
      "星雲科技有限公司\n香港荃灣白田壩街45號南豐紗廠601室",
      "星云科技有限公司\n香港荃湾白田坝街45号南丰纱厂601室"
    )
  )
  const [confirmationFooter, setConfirmationFooter] = React.useState<MultiLangString>(
    createMultiLang(
      "Nebulae Technology Limited\nUnit 601, The Mills, 45 Pak Tin Par Street, Tsuen Wan, Hong Kong",
      "星雲科技有限公司\n香港荃灣白田壩街45號南豐紗廠601室",
      "星云科技有限公司\n香港荃湾白田坝街45号南丰纱厂601室"
    )
  )

  // Invitation email state
  const [invitationEmail, setInvitationEmail] = React.useState({
    from: "event_invitation@lepos.ai",
    senderName: "",
    replyTo: "",
    cc: "",
    subject: createMultiLang(
      `You're Invited: ${eventName}`,
      `邀請函：${eventName}`,
      `邀请函：${eventName}`
    ),
    body: createMultiLang(
      getDefaultInvitationHtml(eventName, eventStartDate),
      "",
      ""
    ),
  })

  // Confirmation email state
  const [confirmationEmail, setConfirmationEmail] = React.useState({
    from: "event_confirmation@lepos.ai",
    senderName: "",
    replyTo: "",
    cc: "",
    subject: createMultiLang(
      `RSVP Confirmed: ${eventName}`,
      `出席確認：${eventName}`,
      `出席确认：${eventName}`
    ),
    body: createMultiLang(
      getDefaultConfirmationHtml(eventName, eventStartDate),
      "",
      ""
    ),
  })

  // Update helpers
  const updateInvitationLangField = (field: "subject" | "body", lang: EmailLang, value: string) => {
    setInvitationEmail((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }))
  }

  const updateConfirmationLangField = (field: "subject" | "body", lang: EmailLang, value: string) => {
    setConfirmationEmail((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }))
  }

  // Image upload handlers
  const handleImageUpload = (assetKey: "organizerLogo" | "eventLogo") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          setEmailAssets((prev) => ({ ...prev, [assetKey]: dataUrl }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleBannerUpload = (lang: EmailLang) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          setEmailAssets((prev) => ({
            ...prev,
            eventBanner: { ...prev.eventBanner, [lang]: dataUrl },
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeImageAsset = (assetKey: "organizerLogo" | "eventLogo") => {
    setEmailAssets((prev) => ({ ...prev, [assetKey]: "" }))
  }

  const removeBannerAsset = (lang: EmailLang) => {
    setEmailAssets((prev) => ({
      ...prev,
      eventBanner: { ...prev.eventBanner, [lang]: "" },
    }))
  }

  const htmlToPlainText = (html: string): string => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ""
  }

  // Device preview
  const [previewDeviceId, setPreviewDeviceId] = React.useState<string>("desktop-full")
  const activePreviewPreset = DEVICE_PRESETS.find((p) => p.id === previewDeviceId) || DEVICE_PRESETS[DEVICE_PRESETS.length - 1]

  // Test email
  const [testEmail, setTestEmail] = React.useState("")
  const [testEmailSent, setTestEmailSent] = React.useState(false)
  const [testEmailPreviewTab, setTestEmailPreviewTab] = React.useState<"invitation" | "confirmation">("invitation")
  const [testPreviewLang, setTestPreviewLang] = React.useState<EmailLang>("EN")
  const [isSending, setIsSending] = React.useState(false)

  // Timeline simulation types
  type TimelineStatus = "pending" | "in_progress" | "completed" | "failed"
  interface TimelineStep {
    key: string
    label: string
    detail?: string
    status: TimelineStatus
    timestamp?: string
  }
  interface TestEmailRecord {
    id: string
    emailType: "invitation" | "confirmation"
    email: string
    sentAt: string
    timeline: TimelineStep[]
  }
  const [testEmailRecords, setTestEmailRecords] = React.useState<TestEmailRecord[]>([])

  const simulateTimeline = (recordId: string) => {
    const now = new Date()
    const formatTime = (offset: number) => format(new Date(now.getTime() + offset), "HH:mm:ss")

    const steps: { key: string; label: string; detail: string; delay: number }[] = [
      { key: "command_send", label: "Send command received", detail: "Email queued for delivery", delay: 0 },
      { key: "queued", label: "Queued for delivery", detail: "Passed to mail server", delay: 800 },
      { key: "delivered", label: "Delivered to recipient", detail: "Accepted by recipient's mail server", delay: 2200 },
      { key: "opened", label: "Email opened", detail: "Recipient viewed the email", delay: 4500 },
    ]

    setTestEmailRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r
        return {
          ...r,
          timeline: steps.map((s, i) => ({
            key: s.key,
            label: s.label,
            detail: s.detail,
            status: i === 0 ? "completed" : "pending",
            timestamp: i === 0 ? formatTime(0) : undefined,
          })),
        }
      })
    )

    steps.slice(1).forEach((step, idx) => {
      setTimeout(() => {
        setTestEmailRecords((prev) =>
          prev.map((r) => {
            if (r.id !== recordId) return r
            return {
              ...r,
              timeline: r.timeline.map((t, i) => {
                if (i <= idx) return t
                if (i === idx + 1) return { ...t, status: "completed" as TimelineStatus, timestamp: formatTime(step.delay) }
                return t
              }),
            }
          })
        )
      }, step.delay)
    })
  }

  const handleSendTestEmails = () => {
    if (!testEmail || !testEmail.includes("@")) return
    setIsSending(true)
    setTestEmailSent(true)

    const createRecord = (type: "invitation" | "confirmation"): TestEmailRecord => ({
      id: `${type}_${Date.now()}`,
      emailType: type,
      email: testEmail,
      sentAt: format(new Date(), "HH:mm:ss"),
      timeline: [
        { key: "command_send", label: "Send command received", detail: "Initializing...", status: "in_progress" },
      ],
    })

    const invRecord = createRecord("invitation")
    const confRecord = createRecord("confirmation")
    setTestEmailRecords((prev) => [invRecord, confRecord, ...prev])

    setTimeout(() => {
      setIsSending(false)
      simulateTimeline(invRecord.id)
      simulateTimeline(confRecord.id)
    }, 600)
  }

  const handleSave = () => {
    onSave()
  }

  // ── Steps ──────────────────────────────────────────────────────────────────

  const steps = [
    { number: 1, title: "Setup Invitation Email", completed: currentStep > 1 },
    { number: 2, title: "Setup Confirmation Email", completed: currentStep > 2 },
    { number: 3, title: "Send Test Email", completed: false },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────

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
              <h1 className="text-xl font-semibold">Invitation Email Editor</h1>
              <p className="text-sm text-muted-foreground">{eventName}</p>
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
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
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
          ))}
        </div>
      </div>

      {/* Split View — Resizable */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
        {/* LEFT: Editor */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={65}>
          <div className="h-full bg-gray-50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* ─── STEP 1: Invitation Email Setup ─── */}
              {currentStep === 1 && (
                <>
                  {/* Email Config Grid 2×2 */}
                  <Card className="p-4 bg-white space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="inv-from" className="text-sm mb-2 block">From Email*</Label>
                        <Input id="inv-from" value={invitationEmail.from} readOnly className="bg-gray-50" />
                        <p className="text-xs text-muted-foreground mt-1">Default sender email address</p>
                      </div>
                      <div>
                        <Label htmlFor="inv-sender" className="text-sm mb-2 block">Sender Name*</Label>
                        <Input
                          id="inv-sender"
                          type="text"
                          value={invitationEmail.senderName}
                          onChange={(e) => setInvitationEmail({ ...invitationEmail, senderName: e.target.value })}
                          placeholder="Event Organizer"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="inv-reply" className="text-sm mb-2 block">Reply to Email</Label>
                        <Input
                          id="inv-reply"
                          type="email"
                          value={invitationEmail.replyTo}
                          onChange={(e) => setInvitationEmail({ ...invitationEmail, replyTo: e.target.value })}
                          placeholder="reply@example.com"
                          className="bg-white"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Replies will be sent to this email</p>
                      </div>
                      <div>
                        <Label htmlFor="inv-cc" className="text-sm mb-2 block">CC Email</Label>
                        <Input
                          id="inv-cc"
                          type="email"
                          value={invitationEmail.cc}
                          onChange={(e) => setInvitationEmail({ ...invitationEmail, cc: e.target.value })}
                          placeholder="cc@example.com"
                          className="bg-white"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Send a copy to this email address</p>
                      </div>
                    </div>
                  </Card>

                  {/* Subject */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">Email Subject</Label>
                      <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                    </div>
                    <Input
                      value={invitationEmail.subject[invitationLang]}
                      onChange={(e) => updateInvitationLangField("subject", invitationLang, e.target.value)}
                      placeholder={`Enter email subject (${LANG_LABELS[invitationLang]})...`}
                      className="bg-white"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Editing <span className="font-medium">{LANG_LABELS[invitationLang]}</span> version
                        {invitationEmail.subject[invitationLang] === "" && invitationLang !== "EN" && (
                          <span className="text-amber-600 ml-1">— empty, will fall back to EN</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Image Assets */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Email Image Assets</Label>
                    <Card className="p-4 bg-white space-y-4">
                      {/* Organizer Logo */}
                      <div>
                        <Label className="text-sm mb-2 block">Organizer Logo</Label>
                        <div className="flex items-center gap-3">
                          {emailAssets.organizerLogo ? (
                            <div className="relative w-[120px] h-[40px] border rounded overflow-hidden bg-gray-50">
                              <img src={emailAssets.organizerLogo} alt="Organizer Logo" className="w-full h-full object-contain" />
                              <button
                                onClick={() => removeImageAsset("organizerLogo")}
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
                          <Button variant="outline" size="sm" onClick={() => handleImageUpload("organizerLogo")}>
                            <Upload className="h-3 w-3 mr-1" />
                            {emailAssets.organizerLogo ? "Replace" : "Upload"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">120×40px recommended. Displayed in email header.</p>
                      </div>

                      {/* Event Banner */}
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
                            {!emailAssets.eventBanner[invitationLang] && invitationLang !== "EN" && emailAssets.eventBanner.EN && (
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
                                onClick={() => removeImageAsset("eventLogo")}
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
                          <Button variant="outline" size="sm" onClick={() => handleImageUpload("eventLogo")}>
                            <Upload className="h-3 w-3 mr-1" />
                            {emailAssets.eventLogo ? "Replace" : "Upload"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">72px wide. Displayed in email footer.</p>
                      </div>
                    </Card>
                  </div>

                  {/* Footer Text */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">Email Footer Text</Label>
                      <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                    </div>
                    <Textarea
                      value={invitationFooter[invitationLang]}
                      onChange={(e) => setInvitationFooter((prev) => ({ ...prev, [invitationLang]: e.target.value }))}
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

                  {/* Email Body */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Label className="text-base font-semibold">Email Body</Label>
                        <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                      </div>
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => setInvitationEditorMode("html")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            invitationEditorMode === "html" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          <Code className="h-3 w-3" />
                          HTML Code
                        </button>
                        <button
                          onClick={() => setInvitationEditorMode("plaintext")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            invitationEditorMode === "plaintext" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          <FileText className="h-3 w-3" />
                          Plain Text
                        </button>
                      </div>
                    </div>
                    {invitationEditorMode === "html" ? (
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono">HTML Source — {LANG_LABELS[invitationLang]}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(invitationEmail.body[invitationLang])}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                        <textarea
                          value={invitationEmail.body[invitationLang]}
                          onChange={(e) => updateInvitationLangField("body", invitationLang, e.target.value)}
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
                            onClick={() => navigator.clipboard.writeText(htmlToPlainText(invitationEmail.body[invitationLang]))}
                            className="text-xs text-muted-foreground hover:text-gray-900 flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy as Text
                          </button>
                        </div>
                        <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                          {invitationEmail.body[invitationLang] ? (
                            <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                              {htmlToPlainText(invitationEmail.body[invitationLang])}
                            </div>
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
                        Available placeholders: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{guest_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_date}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{rsvp_link}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{venue_name}}"}</code>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        More: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{salutation}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_time}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{venue_address}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{rsvp_deadline}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{organizer_email}}"}</code>
                      </p>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex justify-end pt-2">
                    <Button onClick={() => setCurrentStep(2)} className="bg-[#107DAC] hover:bg-[#0d6390]">
                      Next: Confirmation Email
                    </Button>
                  </div>
                </>
              )}

              {/* ─── STEP 2: Confirmation Email Setup ─── */}
              {currentStep === 2 && (
                <>
                  <Card className="p-4 bg-white space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="conf-from" className="text-sm mb-2 block">From Email*</Label>
                        <Input id="conf-from" value={confirmationEmail.from} readOnly className="bg-gray-50" />
                        <p className="text-xs text-muted-foreground mt-1">Default sender email address</p>
                      </div>
                      <div>
                        <Label htmlFor="conf-sender" className="text-sm mb-2 block">Sender Name*</Label>
                        <Input
                          id="conf-sender"
                          type="text"
                          value={confirmationEmail.senderName}
                          onChange={(e) => setConfirmationEmail({ ...confirmationEmail, senderName: e.target.value })}
                          placeholder="Event Organizer"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="conf-reply" className="text-sm mb-2 block">Reply to Email</Label>
                        <Input
                          id="conf-reply"
                          type="email"
                          value={confirmationEmail.replyTo}
                          onChange={(e) => setConfirmationEmail({ ...confirmationEmail, replyTo: e.target.value })}
                          placeholder="reply@example.com"
                          className="bg-white"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Replies will be sent to this email</p>
                      </div>
                      <div>
                        <Label htmlFor="conf-cc" className="text-sm mb-2 block">CC Email</Label>
                        <Input
                          id="conf-cc"
                          type="email"
                          value={confirmationEmail.cc}
                          onChange={(e) => setConfirmationEmail({ ...confirmationEmail, cc: e.target.value })}
                          placeholder="cc@example.com"
                          className="bg-white"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Send a copy to this email address</p>
                      </div>
                    </div>
                  </Card>

                  {/* Subject */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">Email Subject</Label>
                      <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                    </div>
                    <Input
                      value={confirmationEmail.subject[confirmationLang]}
                      onChange={(e) => updateConfirmationLangField("subject", confirmationLang, e.target.value)}
                      placeholder={`Enter email subject (${LANG_LABELS[confirmationLang]})...`}
                      className="bg-white"
                    />
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Editing <span className="font-medium">{LANG_LABELS[confirmationLang]}</span> version
                        {confirmationEmail.subject[confirmationLang] === "" && confirmationLang !== "EN" && (
                          <span className="text-amber-600 ml-1">— empty, will fall back to EN</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Image Assets */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Email Image Assets</Label>
                    <Card className="p-4 bg-white space-y-4">
                      <div>
                        <Label className="text-sm mb-2 block">Organizer Logo</Label>
                        <div className="flex items-center gap-3">
                          {emailAssets.organizerLogo ? (
                            <div className="relative w-[120px] h-[40px] border rounded overflow-hidden bg-gray-50">
                              <img src={emailAssets.organizerLogo} alt="Organizer Logo" className="w-full h-full object-contain" />
                              <button onClick={() => removeImageAsset("organizerLogo")} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-[120px] h-[40px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                              <Image className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleImageUpload("organizerLogo")}>
                            <Upload className="h-3 w-3 mr-1" />
                            {emailAssets.organizerLogo ? "Replace" : "Upload"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">120×40px recommended. Displayed in email header.</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Event Banner</Label>
                          <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                        </div>
                        <div className="space-y-2">
                          {emailAssets.eventBanner[confirmationLang] ? (
                            <div className="relative w-full h-[80px] border rounded overflow-hidden bg-gray-50">
                              <img src={emailAssets.eventBanner[confirmationLang]} alt={`Event Banner (${LANG_LABELS[confirmationLang]})`} className="w-full h-full object-cover" />
                              <button onClick={() => removeBannerAsset(confirmationLang)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-full h-[80px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                              <div className="text-center">
                                <Image className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs text-gray-400">536×200px ({LANG_LABELS[confirmationLang]})</span>
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
                            536×200px recommended. Upload separate banner for each language.
                            {!emailAssets.eventBanner[confirmationLang] && confirmationLang !== "EN" && emailAssets.eventBanner.EN && (
                              <span className="text-amber-600 ml-1">— will fall back to EN</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm mb-2 block">Footer Logo</Label>
                        <div className="flex items-center gap-3">
                          {emailAssets.eventLogo ? (
                            <div className="relative w-[72px] h-[32px] border rounded overflow-hidden bg-gray-50">
                              <img src={emailAssets.eventLogo} alt="Footer Logo" className="w-full h-full object-contain" />
                              <button onClick={() => removeImageAsset("eventLogo")} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-[72px] h-[32px] border-2 border-dashed rounded flex items-center justify-center bg-gray-50">
                              <Image className="h-3 w-3 text-gray-400" />
                            </div>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleImageUpload("eventLogo")}>
                            <Upload className="h-3 w-3 mr-1" />
                            {emailAssets.eventLogo ? "Replace" : "Upload"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">72px wide. Displayed in email footer.</p>
                      </div>
                    </Card>
                  </div>

                  {/* Footer Text */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">Email Footer Text</Label>
                      <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                    </div>
                    <Textarea
                      value={confirmationFooter[confirmationLang]}
                      onChange={(e) => setConfirmationFooter((prev) => ({ ...prev, [confirmationLang]: e.target.value }))}
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

                  {/* Email Body */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Label className="text-base font-semibold">Email Body</Label>
                        <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                      </div>
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => setConfirmationEditorMode("html")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            confirmationEditorMode === "html" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          <Code className="h-3 w-3" />
                          HTML Code
                        </button>
                        <button
                          onClick={() => setConfirmationEditorMode("plaintext")}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            confirmationEditorMode === "plaintext" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          <FileText className="h-3 w-3" />
                          Plain Text
                        </button>
                      </div>
                    </div>
                    {confirmationEditorMode === "html" ? (
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <div className="bg-gray-800 px-3 py-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono">HTML Source — {LANG_LABELS[confirmationLang]}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(confirmationEmail.body[confirmationLang])}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </div>
                        <textarea
                          value={confirmationEmail.body[confirmationLang]}
                          onChange={(e) => updateConfirmationLangField("body", confirmationLang, e.target.value)}
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
                            onClick={() => navigator.clipboard.writeText(htmlToPlainText(confirmationEmail.body[confirmationLang]))}
                            className="text-xs text-muted-foreground hover:text-gray-900 flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy as Text
                          </button>
                        </div>
                        <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                          {confirmationEmail.body[confirmationLang] ? (
                            <div className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                              {htmlToPlainText(confirmationEmail.body[confirmationLang])}
                            </div>
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
                        Available placeholders: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{guest_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{salutation}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_date}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{event_time}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{venue_name}}"}</code>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        More: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{registration_number}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{ticket_type_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{ticket_scope_label}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{confirmation_page_url}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{organizer_email}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{bring_along_name}}"}</code>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{"{{bring_along_registration_number}}"}</code>
                      </p>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button onClick={() => setCurrentStep(3)} className="bg-[#107DAC] hover:bg-[#0d6390]">
                      Next: Send Test Email
                    </Button>
                  </div>
                </>
              )}

              {/* ─── STEP 3: Test Email ─── */}
              {currentStep === 3 && (
                <>
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
                        <Label htmlFor="test-email" className="text-sm mb-1.5 block">Test Email Address</Label>
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
                            disabled={!testEmail || !testEmail.includes("@") || isSending}
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
                            <div className={cn(
                              "px-4 py-2.5 flex items-center justify-between",
                              record.emailType === "invitation"
                                ? "bg-blue-50 border-b border-blue-100"
                                : "bg-emerald-50 border-b border-emerald-100"
                            )}>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", record.emailType === "invitation" ? "bg-blue-500" : "bg-emerald-500")} />
                                <span className="text-sm font-medium">
                                  {record.emailType === "invitation" ? "Invitation Email" : "Confirmation Email"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{record.email}</span>
                                <span className="text-gray-300">|</span>
                                <span>{record.sentAt}</span>
                              </div>
                            </div>
                            <div className="px-4 py-3">
                              <div className="relative">
                                {record.timeline.map((step, idx) => {
                                  const isLast = idx === record.timeline.length - 1
                                  const StatusIcon = step.status === "completed" ? CheckCircle2
                                    : step.status === "in_progress" ? RotateCw
                                    : step.status === "failed" ? AlertCircle
                                    : Clock
                                  const iconColor = step.status === "completed" ? "text-green-500"
                                    : step.status === "in_progress" ? "text-[#107DAC] animate-spin"
                                    : step.status === "failed" ? "text-red-500"
                                    : "text-gray-300"
                                  const lineColor = step.status === "completed" ? "bg-green-300" : "bg-gray-200"
                                  return (
                                    <div key={step.key} className="flex items-start gap-3 relative">
                                      {!isLast && <div className={cn("absolute left-[9px] top-[22px] w-[2px] h-[calc(100%-4px)]", lineColor)} />}
                                      <div className="relative z-10 flex-shrink-0 mt-0.5">
                                        <StatusIcon className={cn("h-[18px] w-[18px]", iconColor)} />
                                      </div>
                                      <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                                        <div className="flex items-center justify-between">
                                          <span className={cn(
                                            "text-sm",
                                            step.status === "completed" ? "text-gray-900 font-medium" :
                                            step.status === "in_progress" ? "text-[#107DAC] font-medium" :
                                            "text-gray-400"
                                          )}>
                                            {step.label}
                                          </span>
                                          {step.timestamp && <span className="text-xs text-muted-foreground font-mono">{step.timestamp}</span>}
                                        </div>
                                        {step.detail && step.status !== "pending" && (
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

                  {/* Summary */}
                  <Card className="p-5 bg-white">
                    <h3 className="font-semibold text-base mb-3">Configuration Summary</h3>
                    <div className="space-y-3 text-sm">
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
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                    <Button onClick={handleSave} className="bg-[#107DAC] hover:bg-[#0d6390]">Complete</Button>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">LIVE PREVIEW</p>
              </div>

              {/* STEP 1: Invitation Email Preview */}
              {currentStep === 1 && (
                <div className="mx-auto">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <DevicePreviewToolbar selectedPresetId={previewDeviceId} onSelect={(p) => setPreviewDeviceId(p.id)} />
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <LanguageTabs value={invitationLang} onChange={setInvitationLang} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transition-all duration-300 ease-in-out w-full" style={{ maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : "100%" }}>
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
                            style={{ minHeight: "800px" }}
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

              {/* STEP 2: Confirmation Email Preview */}
              {currentStep === 2 && (
                <div className="mx-auto">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <DevicePreviewToolbar selectedPresetId={previewDeviceId} onSelect={(p) => setPreviewDeviceId(p.id)} />
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <LanguageTabs value={confirmationLang} onChange={setConfirmationLang} />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="transition-all duration-300 ease-in-out w-full" style={{ maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : "100%" }}>
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
                            style={{ minHeight: "800px" }}
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

              {/* STEP 3: Tabbed Email Preview */}
              {currentStep === 3 && (
                <div className="mx-auto">
                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <div className="flex items-center bg-white border rounded-lg p-1 shadow-sm">
                      <button
                        onClick={() => setTestEmailPreviewTab("invitation")}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          testEmailPreviewTab === "invitation" ? "bg-[#107DAC] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <Mail className="h-4 w-4" />
                        Invitation
                      </button>
                      <button
                        onClick={() => setTestEmailPreviewTab("confirmation")}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                          testEmailPreviewTab === "confirmation" ? "bg-[#107DAC] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Confirmation
                      </button>
                    </div>
                    <LanguageTabs value={testPreviewLang} onChange={setTestPreviewLang} />
                  </div>
                  <div className="mb-3">
                    <DevicePreviewToolbar selectedPresetId={previewDeviceId} onSelect={(p) => setPreviewDeviceId(p.id)} />
                  </div>
                  <div className="flex justify-center">
                    <div className="transition-all duration-300 ease-in-out w-full" style={{ maxWidth: activePreviewPreset.width ? `${activePreviewPreset.width}px` : "100%" }}>
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
                        <div className="bg-gray-100 border-b p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">From:</span>
                              <span className="text-gray-900">
                                {testEmailPreviewTab === "invitation"
                                  ? `${invitationEmail.senderName || "Event Organizer"} <${invitationEmail.from}>`
                                  : `${confirmationEmail.senderName || "Event Organizer"} <${confirmationEmail.from}>`}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">To:</span>
                              <span className="text-gray-900">{testEmail || "recipient@example.com"}</span>
                            </div>
                            <div className="flex items-start pt-2 border-t">
                              <span className="text-gray-600 font-medium w-24 flex-shrink-0">Subject:</span>
                              <span className="text-gray-900 font-semibold">
                                {testEmailPreviewTab === "invitation"
                                  ? (invitationEmail.subject[testPreviewLang] || invitationEmail.subject.EN)
                                  : (confirmationEmail.subject[testPreviewLang] || confirmationEmail.subject.EN)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#f0f4f8]">
                          {testEmailPreviewTab === "invitation" ? (
                            <iframe
                              key={`inv-${testPreviewLang}-${previewDeviceId}`}
                              srcDoc={invitationEmail.body[testPreviewLang] || invitationEmail.body.EN}
                              className="w-full border-0"
                              style={{ minHeight: "800px" }}
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
                              style={{ minHeight: "800px" }}
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

// ── Default HTML Templates ───────────────────────────────────────────────────

function getDefaultInvitationHtml(eventName: string, eventStartDate?: Date): string {
  const dateStr = eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Invited — ${eventName}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display:none; font-size:1px; color:#f0f4f8; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    {{salutation}} {{guest_name}}, you're invited to ${eventName}.
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- TOP BAR -->
          <tr>
            <td style="background-color:#00B5AD; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#fff; font-size:11px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase;">Event Invitation</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${dateStr}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- BANNER -->
          <tr>
            <td style="background-color:#fff; padding:24px 32px 0 32px;" class="mobile-padding">
              <img src="https://placehold.co/536x200/00B5AD/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px;" />
            </td>
          </tr>
          <!-- GREETING -->
          <tr>
            <td style="background-color:#fff; padding:28px 32px 8px 32px;" class="mobile-padding">
              <p style="margin:0 0 6px 0; font-size:14px; color:#00B5AD; font-weight:600; text-transform:uppercase;">You're Invited</p>
              <h1 style="margin:0 0 16px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;">Hello {{salutation}} {{guest_name}},</h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#444;">
                We're pleased to invite you to <strong style="color:#1a1a2e;">${eventName}</strong>.
                Your attendance has been personally requested and we've reserved your spot.
              </p>
            </td>
          </tr>
          <!-- EVENT DETAILS -->
          <tr>
            <td style="background-color:#fff; padding:0 32px 24px 32px;" class="mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px 0; font-size:11px; color:#888; text-transform:uppercase; font-weight:600;">Date</p>
                    <p style="margin:0 0 14px 0; font-size:14px; color:#1a1a2e; font-weight:500;">${dateStr}</p>
                    <p style="margin:0 0 4px 0; font-size:11px; color:#888; text-transform:uppercase; font-weight:600;">Venue</p>
                    <p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:500;">{{venue_name}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="background-color:#fff; padding:0 32px 32px 32px; text-align:center;" class="mobile-padding">
              <a href="{{rsvp_link}}" style="display:inline-block; background-color:#00B5AD; color:#fff; font-size:16px; font-weight:600; padding:14px 40px; border-radius:8px; text-decoration:none;">Confirm Your Attendance</a>
            </td>
          </tr>
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#f8fafb; padding:20px 32px; border-radius:0 0 12px 12px; text-align:center;" class="mobile-padding">
              <p style="margin:0; font-size:12px; color:#999; line-height:1.5;">
                {{organizer_name}}<br/>
                Questions? Contact us at <a href="mailto:{{organizer_email}}" style="color:#00B5AD;">{{organizer_email}}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function getDefaultConfirmationHtml(eventName: string, eventStartDate?: Date): string {
  const dateStr = eventStartDate ? format(eventStartDate, "MMMM d, yyyy") : "{{event_date}}"
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>RSVP Confirmed — ${eventName}</title>
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
    Your RSVP for ${eventName} is confirmed! Here's your QR code and event details.
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f0f4f8;" class="email-bg">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width:600px; width:100%;">
          <!-- SUCCESS TOP BAR -->
          <tr>
            <td style="background-color:#00B5AD; border-radius:12px 12px 0 0; padding:12px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="left" style="color:#ffffff; font-size:11px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase;">RSVP Confirmed</td>
                  <td align="right" style="color:rgba(255,255,255,0.8); font-size:11px;">${dateStr}</td>
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
              <img src="https://placehold.co/536x200/00B5AD/ffffff?text=${encodeURIComponent(eventName)}" alt="${eventName}" width="536" style="display:block; width:100%; max-width:536px; height:auto; border-radius:8px; object-fit:cover;" class="fluid" />
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
                        <td align="center" style="background-color:#e6f9f7; border-radius:50%; width:64px; height:64px; text-align:center; vertical-align:middle;">
                          <span style="font-size:32px; line-height:64px; color:#00B5AD;">&#10003;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;">
                    <h1 style="margin:0 0 8px 0; font-size:26px; line-height:1.25; color:#1a1a2e; font-weight:700;" class="text-dark">You're Confirmed!</h1>
                    <p style="margin:0; font-size:15px; line-height:1.5; color:#666666;" class="text-muted">
                      {{salutation}} {{guest_name}}, your attendance at <strong style="color:#1a1a2e;">${eventName}</strong> has been confirmed.
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
          <!-- EVENT DETAILS -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px; border:1px solid #e8ecf0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px 0; font-size:13px; color:#888888; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Event Details</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/star--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">EVENT</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${eventName}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/calendar--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">DATE</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">${dateStr}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:12px;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/clock--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">TIME</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{event_time}}</p></td></tr>
                      <tr><td width="32" valign="top" style="padding-right:12px; padding-bottom:0;"><img src="https://img.icons8.com/fluency-systems-regular/32/00B5AD/marker--v1.png" alt="" width="18" height="18" style="display:block;" /></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:11px; color:#888888; font-weight:600;">VENUE</p><p style="margin:2px 0 0 0; font-size:14px; color:#1a1a2e; font-weight:500;" class="text-dark">{{venue_name}}</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">{{venue_address}}</p></td></tr>
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
                  <td style="background-color:#f0faf9; border-radius:8px; border-left:4px solid #00B5AD; padding:14px 16px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td valign="middle"><p style="margin:0; font-size:15px; color:#1a1a2e; font-weight:600;" class="text-dark">{{ticket_type_name}}</p><p style="margin:3px 0 0 0; font-size:12px; color:#666666;">{{ticket_scope_label}}</p></td>
                        <td align="right" valign="middle" width="80"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="background-color:#00B5AD; border-radius:4px; padding:4px 10px;"><p style="margin:0; font-size:11px; color:#ffffff; font-weight:600; text-transform:uppercase;">{{ticket_scope_short}}</p></td></tr></table></td>
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
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#00B5AD; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">1</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Save your QR code</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Screenshot or bookmark this email for easy access</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:12px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#00B5AD; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">2</p></td></tr></table></td><td valign="top" style="padding-bottom:12px;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Arrive at the venue</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Head to the check-in desk at {{venue_name}}</p></td></tr>
                <tr><td width="36" valign="top" style="padding-bottom:0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="background-color:#00B5AD; border-radius:50%; width:28px; height:28px;"><p style="margin:0; font-size:13px; color:#ffffff; font-weight:700; line-height:28px;">3</p></td></tr></table></td><td valign="top" style="padding-bottom:0;"><p style="margin:0; font-size:14px; color:#1a1a2e; font-weight:600;" class="text-dark">Scan &amp; collect your badge</p><p style="margin:2px 0 0 0; font-size:13px; color:#666666;">Show your QR code at the entrance</p></td></tr>
              </table>
            </td>
          </tr>
          <!-- VIEW CONFIRMATION CTA -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 28px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td align="center"><a href="{{confirmation_page_url}}" target="_blank" style="display:inline-block; background-color:#f8fafb; color:#1a1a2e; font-size:14px; font-weight:600; text-decoration:none; padding:14px 36px; border-radius:8px; border:1px solid #d0d8e0;">View My Confirmation &rarr;</a></td></tr></table>
            </td>
          </tr>
          <!-- CONTACT / HELP -->
          <tr>
            <td style="background-color:#ffffff; padding:0 32px 24px 32px;" class="card-bg mobile-padding">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f8fafb; border-radius:8px;"><tr><td style="padding:16px 20px;"><p style="margin:0; font-size:13px; color:#666666; line-height:1.5;">Need to make changes? Contact the event organizer at <a href="mailto:{{organizer_email}}" style="color:#00B5AD; text-decoration:none; font-weight:500;">{{organizer_email}}</a></p></td></tr></table>
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
                <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.5;"><a href="https://www.lepos.ai" style="color:#00B5AD; text-decoration:none;">www.lepos.ai</a> &middot; <a href="mailto:sales@lepos.ai" style="color:#00B5AD; text-decoration:none;">sales@lepos.ai</a> &middot; +852 3180 7863</p>
              </td></tr></table>
            </td>
          </tr>
          <!-- BOTTOM SPACER -->
          <tr><td style="padding:16px 32px;" class="mobile-padding"><p style="margin:0; font-size:11px; color:#aaaaaa; text-align:center; line-height:1.5;">This confirmation was sent to <strong>{{guest_email}}</strong> for your RSVP at ${eventName}.<br>Confirmation #{{registration_number}}</p></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
