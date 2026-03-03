"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DateTimePicker } from "../ui/datetime-picker"
import { FileUpload } from "../ui/file-upload"
import { ColourPicker } from "../ui/colour-picker"
import { Badge } from "../ui/badge"
import { 
  type EventCategory, 
  type MultilingualText,
  eventTypesByCategory,
  statusColors 
} from "../data/b2b-events"
import { cn } from "../ui/utils"
import { toast } from 'sonner'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { LeposLogo } from "../LeposLogo"
import { AlertTriangle, ArrowLeft, Save, X, Plus, ExternalLink, Copy } from "lucide-react"
import { SessionsTable, type SubEvent } from "./SessionsTable"
import { TicketTypesTable, type TicketType } from "./TicketTypesTable"
import { StaffTicketsTable, type StaffTicket } from "./StaffTicketsTable"
import { AccessAreaMatrix } from "./AccessAreaMatrix"
import { ReviewPublishTab } from "./ReviewPublishTab"
import { type Session, mockSessions } from "../data/b2b-events"

interface EventFormData {
  nameEn: string
  nameTc: string
  nameSc: string
  descriptionEn: string
  descriptionTc: string
  descriptionSc: string
  category: EventCategory | ""
  type: string
  startDateTime?: Date
  endDateTime?: Date
  venueEn: string
  venueTc: string
  venueSc: string
  addressEn: string
  addressTc: string
  addressSc: string
  quota: string
  rsvpDeadline?: Date
  schedulePublishedDate?: Date
  logo?: File | null
  logoPreview?: string | null
  banner?: File | null
  bannerPreview?: string | null
  eventPhotos: Array<{ file: File | null; preview: string | null }>
}

interface CreateEventFormProps {
  onCancel?: () => void
  onSubmit?: (data: EventFormData) => void
  initialData?: Partial<EventFormData>
  isEdit?: boolean
  hideSaveButton?: boolean
  onSaveStateChange?: (state: { isSubmitting: boolean; hasUnsavedChanges: boolean }) => void
  onSubmitReady?: (submitFn: () => void) => void
  currentEventStatus?: string
  registrationUrl?: string
}

export function CreateEventForm({ onCancel, onSubmit, initialData, isEdit = false, hideSaveButton = false, onSaveStateChange, onSubmitReady, currentEventStatus, registrationUrl }: CreateEventFormProps) {
  const [formData, setFormData] = React.useState<EventFormData>({
    nameEn: initialData?.nameEn || "",
    nameTc: initialData?.nameTc || "",
    nameSc: initialData?.nameSc || "",
    descriptionEn: initialData?.descriptionEn || "",
    descriptionTc: initialData?.descriptionTc || "",
    descriptionSc: initialData?.descriptionSc || "",
    category: initialData?.category || "",
    type: initialData?.type || "",
    venueEn: initialData?.venueEn || "",
    venueTc: initialData?.venueTc || "",
    venueSc: initialData?.venueSc || "",
    addressEn: initialData?.addressEn || "",
    addressTc: initialData?.addressTc || "",
    addressSc: initialData?.addressSc || "",
    quota: initialData?.quota || "",
    startDateTime: initialData?.startDateTime,
    endDateTime: initialData?.endDateTime,
    rsvpDeadline: initialData?.rsvpDeadline,
    schedulePublishedDate: initialData?.schedulePublishedDate,
    logo: initialData?.logo,
    logoPreview: initialData?.logoPreview,
    banner: initialData?.banner,
    bannerPreview: initialData?.bannerPreview,
    eventPhotos: initialData?.eventPhotos || [],
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [openSections, setOpenSections] = React.useState<string[]>(["basic"])
  const [activeTab, setActiveTab] = React.useState("details")
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false)
  const [initialFormData] = React.useState<EventFormData>(JSON.parse(JSON.stringify(formData)))

  // Language tabs states for each multilingual section
  const [basicInfoLang, setBasicInfoLang] = React.useState("en")
  const [venueLang, setVenueLang] = React.useState("en")
  const [addressLang, setAddressLang] = React.useState("en")
  const [descriptionLang, setDescriptionLang] = React.useState("en")

  // Session management state
  const [sessions, setSessions] = React.useState<TableSession[]>([])

  // Ticket types state with pre-populated sample data
  const [ticketTypes, setTicketTypes] = React.useState<TicketType[]>([
    {
      id: "ticket-1",
      nameEn: "General Admission",
      nameZhHant: "普通入場",
      descriptionEn: "Standard access to all public sessions",
      colorHex: "#4CAF50",
      ticketScope: "event",
      accessScope: "custom",
      quota: 0,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
    {
      id: "ticket-2",
      nameEn: "Concessionary",
      nameZhHant: "優惠票",
      descriptionEn: "Discounted rate for students and seniors",
      colorHex: "#2196F3",
      ticketScope: "event",
      accessScope: "custom",
      quota: 0,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
    {
      id: "ticket-3",
      nameEn: "VIP",
      nameZhHant: "貴賓",
      descriptionEn: "Full access to all sessions including exclusive content",
      colorHex: "#FFD700",
      ticketScope: "event",
      accessScope: "all_sessions",
      quota: 0,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
  ])

  // Staff tickets state with pre-populated default data
  const [staffTickets, setStaffTickets] = React.useState<StaffTicket[]>([
    {
      id: "staff-1",
      nameEn: "AAA",
      nameZhHant: "AAA",
      descriptionEn: "Full administrative access",
      colorHex: "#023F59",
      accessScope: "all_sessions",
      quota: 10,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
    {
      id: "staff-2",
      nameEn: "Organizer",
      nameZhHant: "主辦方",
      descriptionEn: "Event organization and management staff",
      colorHex: "#107DAC",
      accessScope: "all_sessions",
      quota: 50,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
    {
      id: "staff-3",
      nameEn: "Exhibitor / Merchant",
      nameZhHant: "參展商 / 商戶",
      descriptionEn: "Exhibitors and merchant partners",
      colorHex: "#31D7DB",
      accessScope: "custom",
      quota: 100,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
    {
      id: "staff-4",
      nameEn: "Guest / Speaker",
      nameZhHant: "嘉賓 / 講者",
      descriptionEn: "Event speakers and special guests",
      colorHex: "#9C27B0",
      accessScope: "custom",
      quota: 30,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    },
  ])

  // Sub-events management state - initialize with Main Event
  const [subEvents, setSubEvents] = React.useState<SubEvent[]>([
    {
      id: "main-event",
      name: "Main Event",
      sessions: [],
    }
  ])

  // Event status management
  const [eventStatus, setEventStatus] = React.useState<"draft" | "published" | "live" | "closed">("draft")

  // Generate event ID (in real app, this would come from backend)
  const eventId = React.useMemo(() => `evt_${Date.now()}`, [])

  const handlePublish = async () => {
    // Publish logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEventStatus("published")
  }

  const handleStatusChange = (status: "live" | "closed") => {
    setEventStatus(status)
    toast.success(`Event status changed to ${status}`)
  }

  // Track unsaved changes
  React.useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)
    setHasUnsavedChanges(hasChanges)
  }, [formData, initialFormData])

  // Notify parent of save state changes
  React.useEffect(() => {
    if (onSaveStateChange) {
      onSaveStateChange({ isSubmitting, hasUnsavedChanges })
    }
  }, [isSubmitting, hasUnsavedChanges, onSaveStateChange])

  // Expose submit function to parent
  React.useEffect(() => {
    if (onSubmitReady) {
      onSubmitReady(() => handleSubmit())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => {
      // Reset type when category changes
      if (field === "category" && value !== prev.category) {
        return { ...prev, [field]: value, type: "" }
      }
      return { ...prev, [field]: value }
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.nameEn.trim()) {
      newErrors.nameEn = "Event name (English) is required"
    } else if (formData.nameEn.length > 200) {
      newErrors.nameEn = "Event name must be 200 characters or less"
    }

    if (formData.nameTc.length > 200) {
      newErrors.nameTc = "Event name must be 200 characters or less"
    }

    if (formData.nameSc.length > 200) {
      newErrors.nameSc = "Event name must be 200 characters or less"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.type) {
      newErrors.type = "Event type is required"
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = "Start date & time is required"
    }

    if (!formData.endDateTime) {
      newErrors.endDateTime = "End date & time is required"
    } else if (formData.startDateTime && formData.endDateTime < formData.startDateTime) {
      newErrors.endDateTime = "End date must be after start date"
    }

    if (!formData.venueEn.trim()) {
      newErrors.venueEn = "Venue name (English) is required"
    } else if (formData.venueEn.length > 200) {
      newErrors.venueEn = "Venue name must be 200 characters or less"
    }

    if (formData.venueTc.length > 200) {
      newErrors.venueTc = "Venue name must be 200 characters or less"
    }

    if (formData.venueSc.length > 200) {
      newErrors.venueSc = "Venue name must be 200 characters or less"
    }

    if (formData.addressEn.length > 300) {
      newErrors.addressEn = "Address must be 300 characters or less"
    }

    if (formData.addressTc.length > 300) {
      newErrors.addressTc = "Address must be 300 characters or less"
    }

    if (formData.addressSc.length > 300) {
      newErrors.addressSc = "Address must be 300 characters or less"
    }

    if (!formData.quota || parseInt(formData.quota) <= 0) {
      newErrors.quota = "Quota must be greater than 0"
    }

    // Character limits
    if (formData.descriptionEn.length > 5000) {
      newErrors.descriptionEn = "Description must be 5000 characters or less"
    }
    if (formData.descriptionTc.length > 5000) {
      newErrors.descriptionTc = "Description must be 5000 characters or less"
    }
    if (formData.descriptionSc.length > 5000) {
      newErrors.descriptionSc = "Description must be 5000 characters or less"
    }

    // RSVP deadline validation
    if (formData.rsvpDeadline && formData.endDateTime && formData.rsvpDeadline >= formData.endDateTime) {
      newErrors.rsvpDeadline = "RSVP deadline must be before event end date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    // Only validate if we're on the details tab or explicitly submitting
    if (activeTab !== "details") {
      toast.error("Please complete the event details first")
      setActiveTab("details")
      return
    }
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success(isEdit ? "Event updated successfully" : "Event created successfully")
      setHasUnsavedChanges(false)
      onSubmit?.(formData)
    } catch (error) {
      toast.error(isEdit ? "Failed to update event. Please try again." : "Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      onCancel?.()
    }
  }

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false)
    setHasUnsavedChanges(false)
    onCancel?.()
  }

  const getCharacterCount = (text: string, max: number) => {
    const remaining = max - text.length
    const isNearLimit = remaining < max * 0.1
    const isOverLimit = remaining < 0
    
    return (
      <span className={cn(
        "text-xs",
        isOverLimit ? "text-destructive font-medium" : 
        isNearLimit ? "text-orange-600" : 
        "text-muted-foreground"
      )}>
        {text.length} / {max}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="w-full max-w-[1136px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-semibold">
                {formData.nameEn || (isEdit ? "Edit Event" : "Create New Event")}
              </h1>
            </div>
            
            {!hideSaveButton && (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasUnsavedChanges}
                className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Event Header */}
      <div className="border-b bg-background">
        <div className="w-full max-w-[1136px] mx-auto px-6">
          
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b bg-background">
        <div className="w-full max-w-[1136px] mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 border-0">
              <TabsTrigger 
                value="details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >
                Branding
              </TabsTrigger>
              <TabsTrigger 
                value="sessions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >Sessions & Sub-Event</TabsTrigger>
              <TabsTrigger 
                value="tickets" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >Ticket Types</TabsTrigger>
              <TabsTrigger 
                value="access" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >
                Access
              </TabsTrigger>
              <TabsTrigger 
                value="review" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#107DAC] data-[state=active]:bg-transparent data-[state=active]:text-[#107DAC] bg-transparent px-6 text-base"
              >
                Review & Publish
              </TabsTrigger>
            </TabsList>

            {/* Details Tab Content */}
            <TabsContent value="details" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8">
                {/* Registration URL for Published/Live Events */}
                {currentEventStatus && (currentEventStatus === "Published" || currentEventStatus === "Live") && registrationUrl && (
                  <div className="p-4 border rounded-lg bg-blue-50/50 mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-2">Registration Form URL</div>
                        <div className="flex items-center gap-2 p-2 bg-white border rounded font-mono text-sm">
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                          <a 
                            href={registrationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 truncate text-blue-600 hover:underline"
                          >
                            {registrationUrl}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 shrink-0"
                            onClick={() => {
                              try {
                                // Fallback method for copying text when Clipboard API is blocked
                                const textArea = document.createElement('textarea')
                                textArea.value = registrationUrl
                                textArea.style.position = 'fixed'
                                textArea.style.left = '-999999px'
                                document.body.appendChild(textArea)
                                textArea.select()
                                document.execCommand('copy')
                                document.body.removeChild(textArea)
                                toast.success("Link copied to clipboard")
                              } catch (err) {
                                toast.error("Failed to copy link")
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Collapsible Form Sections */}
                  <Accordion 
                    type="multiple" 
                    value={openSections} 
                    onValueChange={setOpenSections}
                    className="border rounded-lg bg-white"
                  >
                    {/* Section 1: Basic Information */}
                    <AccordionItem value="basic" className="border-b last:border-b-0">
                      <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="text-left">
                            <h3 className="font-semibold text-base">Basic Information</h3>
                            <p className="text-sm text-muted-foreground font-normal mt-0.5">
                              Event name, category, and type
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="flex flex-col gap-6">
                          {/* Event Name - Multilingual Tabs */}
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-1 text-sm font-medium">
                                Event Name <span className="text-destructive">*</span>
                              </Label>
                              <Tabs value={basicInfoLang} onValueChange={setBasicInfoLang}>
                                <TabsList className="h-8 bg-muted/50 p-0.5">
                                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                            <Tabs value={basicInfoLang} onValueChange={setBasicInfoLang}>
                              <TabsContent value="en" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="nameEn"
                                    value={formData.nameEn}
                                    onChange={(e) => handleChange("nameEn", e.target.value)}
                                    placeholder="Enter event name in English"
                                    className={cn(errors.nameEn && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.nameEn && (
                                      <span className="text-xs text-destructive">{errors.nameEn}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.nameEn, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="tc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="nameTc"
                                    value={formData.nameTc}
                                    onChange={(e) => handleChange("nameTc", e.target.value)}
                                    placeholder="輸入繁體中文活動名稱（選填）"
                                    className={cn(errors.nameTc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.nameTc && (
                                      <span className="text-xs text-destructive">{errors.nameTc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.nameTc, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="sc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="nameSc"
                                    value={formData.nameSc}
                                    onChange={(e) => handleChange("nameSc", e.target.value)}
                                    placeholder="输入简体中文活动名称（选填）"
                                    className={cn(errors.nameSc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.nameSc && (
                                      <span className="text-xs text-destructive">{errors.nameSc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.nameSc, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>

                          {/* Category and Type */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="category" className="flex items-center gap-1 text-sm font-medium">
                                Category <span className="text-destructive">*</span>
                              </Label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) => handleChange("category", value as EventCategory)}
                              >
                                <SelectTrigger 
                                  id="category"
                                  className={cn(errors.category && "border-destructive")}
                                >
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Conference">
                                    <Badge variant="default" className="font-normal">Conference</Badge>
                                  </SelectItem>
                                  <SelectItem value="Exhibition">
                                    <Badge variant="default" className="font-normal">Exhibition</Badge>
                                  </SelectItem>
                                  <SelectItem value="Festival">
                                    <Badge variant="default" className="font-normal">Festival</Badge>
                                  </SelectItem>
                                  <SelectItem value="Gala">
                                    <Badge variant="default" className="font-normal">Gala</Badge>
                                  </SelectItem>
                                  <SelectItem value="Workshop">
                                    <Badge variant="default" className="font-normal">Workshop</Badge>
                                  </SelectItem>
                                  <SelectItem value="Seminar">
                                    <Badge variant="default" className="font-normal">Seminar</Badge>
                                  </SelectItem>
                                  <SelectItem value="Networking">
                                    <Badge variant="default" className="font-normal">Networking</Badge>
                                  </SelectItem>
                                  <SelectItem value="Ceremony">
                                    <Badge variant="default" className="font-normal">Ceremony</Badge>
                                  </SelectItem>
                                  <SelectItem value="Corporate">
                                    <Badge variant="default" className="font-normal">Corporate</Badge>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.category && (
                                <span className="text-xs text-destructive">{errors.category}</span>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="type" className="flex items-center gap-1 text-sm font-medium">
                                Event Type <span className="text-destructive">*</span>
                              </Label>
                              <Select
                                value={formData.type}
                                onValueChange={(value) => handleChange("type", value)}
                                disabled={!formData.category}
                              >
                                <SelectTrigger id="type">
                                  <SelectValue placeholder={formData.category ? "Select type" : "Select category first"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {formData.category && eventTypesByCategory[formData.category]?.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      <Badge variant="outline" className="font-normal">{type}</Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.type && (
                                <span className="text-xs text-destructive">{errors.type}</span>
                              )}
                            </div>
                          </div>

                          {/* Description - Multilingual Tabs */}
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Event Description</Label>
                              <Tabs value={descriptionLang} onValueChange={setDescriptionLang}>
                                <TabsList className="h-8 bg-muted/50 p-0.5">
                                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                            <Tabs value={descriptionLang} onValueChange={setDescriptionLang}>
                              <TabsContent value="en" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Textarea
                                    id="descriptionEn"
                                    value={formData.descriptionEn}
                                    onChange={(e) => handleChange("descriptionEn", e.target.value)}
                                    placeholder="Describe your event in English (optional)"
                                    rows={6}
                                    className={cn(errors.descriptionEn && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.descriptionEn && (
                                      <span className="text-xs text-destructive">{errors.descriptionEn}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.descriptionEn, 5000)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="tc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Textarea
                                    id="descriptionTc"
                                    value={formData.descriptionTc}
                                    onChange={(e) => handleChange("descriptionTc", e.target.value)}
                                    placeholder="輸入繁體中文活動描述（選填）"
                                    rows={6}
                                    className={cn(errors.descriptionTc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.descriptionTc && (
                                      <span className="text-xs text-destructive">{errors.descriptionTc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.descriptionTc, 5000)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="sc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Textarea
                                    id="descriptionSc"
                                    value={formData.descriptionSc}
                                    onChange={(e) => handleChange("descriptionSc", e.target.value)}
                                    placeholder="输入简体中文活动描述（选填）"
                                    rows={6}
                                    className={cn(errors.descriptionSc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.descriptionSc && (
                                      <span className="text-xs text-destructive">{errors.descriptionSc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.descriptionSc, 5000)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                            <span className="text-xs text-muted-foreground">
                              This description will be displayed on the event registration page
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 2: Schedule */}
                    <AccordionItem value="schedule" className="border-b last:border-b-0">
                      <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                        <div className="text-left">
                          <h3 className="font-semibold text-base">Schedule</h3>
                          <p className="text-sm text-muted-foreground font-normal mt-0.5">
                            Event dates, times, and RSVP deadline
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="flex flex-col gap-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="startDateTime" className="flex items-center gap-1 text-sm font-medium">
                                Start Date & Time <span className="text-destructive">*</span>
                              </Label>
                              <DateTimePicker
                                value={formData.startDateTime}
                                onChange={(date) => handleChange("startDateTime", date)}
                              />
                              {errors.startDateTime && (
                                <span className="text-xs text-destructive">{errors.startDateTime}</span>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="endDateTime" className="flex items-center gap-1 text-sm font-medium">
                                End Date & Time <span className="text-destructive">*</span>
                              </Label>
                              <DateTimePicker
                                value={formData.endDateTime}
                                onChange={(date) => handleChange("endDateTime", date)}
                              />
                              {errors.endDateTime && (
                                <span className="text-xs text-destructive">{errors.endDateTime}</span>
                              )}
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="rsvpDeadline" className="text-sm font-medium">RSVP Deadline</Label>
                              <DateTimePicker
                                value={formData.rsvpDeadline}
                                onChange={(date) => handleChange("rsvpDeadline", date)}
                              />
                              {errors.rsvpDeadline && (
                                <span className="text-xs text-destructive">{errors.rsvpDeadline}</span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                Optional - Leave empty if no RSVP deadline
                              </span>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Label htmlFor="schedulePublishedDate" className="text-sm font-medium">Schedule Published Date</Label>
                              <DateTimePicker
                                value={formData.schedulePublishedDate}
                                onChange={(date) => handleChange("schedulePublishedDate", date)}
                              />
                              {errors.schedulePublishedDate && (
                                <span className="text-xs text-destructive">{errors.schedulePublishedDate}</span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                When the event schedule will be made public
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Section 3: Location */}
                    <AccordionItem value="location" className="border-b last:border-b-0">
                      <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/30">
                        <div className="text-left">
                          <h3 className="font-semibold text-base">Location</h3>
                          <p className="text-sm text-muted-foreground font-normal mt-0.5">
                            Venue name and address
                          </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2">
                        <div className="flex flex-col gap-6">
                          {/* Venue - Multilingual Tabs */}
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center gap-1 text-sm font-medium">
                                Venue <span className="text-destructive">*</span>
                              </Label>
                              <Tabs value={venueLang} onValueChange={setVenueLang}>
                                <TabsList className="h-8 bg-muted/50 p-0.5">
                                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                            <Tabs value={venueLang} onValueChange={setVenueLang}>
                              <TabsContent value="en" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="venueEn"
                                    value={formData.venueEn}
                                    onChange={(e) => handleChange("venueEn", e.target.value)}
                                    placeholder="Enter venue name in English"
                                    className={cn(errors.venueEn && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.venueEn && (
                                      <span className="text-xs text-destructive">{errors.venueEn}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.venueEn, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="tc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="venueTc"
                                    value={formData.venueTc}
                                    onChange={(e) => handleChange("venueTc", e.target.value)}
                                    placeholder="輸入繁體中文場地名稱（選填）"
                                    className={cn(errors.venueTc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.venueTc && (
                                      <span className="text-xs text-destructive">{errors.venueTc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.venueTc, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="sc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="venueSc"
                                    value={formData.venueSc}
                                    onChange={(e) => handleChange("venueSc", e.target.value)}
                                    placeholder="输入简体中文场地名称（选填）"
                                    className={cn(errors.venueSc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.venueSc && (
                                      <span className="text-xs text-destructive">{errors.venueSc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.venueSc, 200)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>

                          {/* Address - Multilingual Tabs */}
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium">Address</Label>
                              <Tabs value={addressLang} onValueChange={setAddressLang}>
                                <TabsList className="h-8 bg-muted/50 p-0.5">
                                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                                </TabsList>
                              </Tabs>
                            </div>
                            <Tabs value={addressLang} onValueChange={setAddressLang}>
                              <TabsContent value="en" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="addressEn"
                                    value={formData.addressEn}
                                    onChange={(e) => handleChange("addressEn", e.target.value)}
                                    placeholder="Enter full address (optional)"
                                    className={cn(errors.addressEn && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.addressEn && (
                                      <span className="text-xs text-destructive">{errors.addressEn}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.addressEn, 300)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="tc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="addressTc"
                                    value={formData.addressTc}
                                    onChange={(e) => handleChange("addressTc", e.target.value)}
                                    placeholder="輸入完整地址（選填）"
                                    className={cn(errors.addressTc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.addressTc && (
                                      <span className="text-xs text-destructive">{errors.addressTc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.addressTc, 300)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="sc" className="mt-3">
                                <div className="flex flex-col gap-1.5">
                                  <Input
                                    id="addressSc"
                                    value={formData.addressSc}
                                    onChange={(e) => handleChange("addressSc", e.target.value)}
                                    placeholder="输入完整地址（选填）"
                                    className={cn(errors.addressSc && "border-destructive")}
                                  />
                                  <div className="flex items-center justify-between">
                                    {errors.addressSc && (
                                      <span className="text-xs text-destructive">{errors.addressSc}</span>
                                    )}
                                    <div className="ml-auto">
                                      {getCharacterCount(formData.addressSc, 300)}
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </form>
              </div>
            </TabsContent>

            {/* Branding Tab */}
            <TabsContent value="branding" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8">
                <div className="border rounded-lg bg-white">
                  <div className="px-6 py-6 flex flex-col gap-6">
                    {/* Logo Upload */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Event Logo</Label>
                      <FileUpload
                        accept="image/png,image/jpeg,image/svg+xml"
                        maxSize={2 * 1024 * 1024} // 2MB
                        onFileSelect={(file) => {
                          handleChange("logo", file)
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              handleChange("logoPreview", reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        preview={formData.logoPreview}
                        aspectRatio="square"
                      />
                      <span className="text-xs text-muted-foreground">
                        Square image recommended (400×400px). PNG, JPG, or SVG. Max 2MB.
                        {!formData.logo && " Using Lepōs default logo."}
                      </span>
                    </div>

                    {/* Banner Upload */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Event Banner</Label>
                      <FileUpload
                        accept="image/png,image/jpeg"
                        maxSize={5 * 1024 * 1024} // 5MB
                        onFileSelect={(file) => {
                          handleChange("banner", file)
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              handleChange("bannerPreview", reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        preview={formData.bannerPreview}
                        aspectRatio="wide"
                      />
                      <span className="text-xs text-muted-foreground">
                        Wide image recommended (1200×400px). PNG or JPG. Max 5MB.
                        {!formData.banner && " Using Lepōs default banner."}
                      </span>
                    </div>

                    {/* Event Photos */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium">Event Photos</Label>
                      <div className="grid grid-cols-5 gap-3">
                        {[0, 1, 2, 3, 4].map((index) => {
                          const photo = formData.eventPhotos[index]
                          return (
                            <div key={index} className="relative aspect-square">
                              {photo?.preview ? (
                                <div className="relative w-full h-full group">
                                  <img
                                    src={photo.preview}
                                    alt={`Event photo ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      const newPhotos = [...formData.eventPhotos]
                                      newPhotos[index] = { file: null, preview: null }
                                      handleChange("eventPhotos", newPhotos.filter(p => p.file || p.preview))
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#023F59] hover:bg-muted/50 transition-colors">
                                  <Plus className="h-8 w-8 text-muted-foreground" />
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/png,image/jpeg"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        if (file.size > 5 * 1024 * 1024) {
                                          toast.error("File size must be less than 5MB")
                                          return
                                        }
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                          const newPhotos = [...formData.eventPhotos]
                                          newPhotos[index] = { file, preview: reader.result as string }
                                          handleChange("eventPhotos", newPhotos)
                                        }
                                        reader.readAsDataURL(file)
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Optional - Add up to 5 reference photos for your event. PNG or JPG. Max 5MB each.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8">
                <SessionsTable
                  subEvents={subEvents}
                  onSubEventsChange={setSubEvents}
                />
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8 space-y-8">
                <TicketTypesTable
                  ticketTypes={ticketTypes}
                  onTicketTypesChange={setTicketTypes}
                />
                
                <StaffTicketsTable
                  staffTickets={staffTickets}
                  onStaffTicketsChange={setStaffTickets}
                />
              </div>
            </TabsContent>

            {/* Access Tab */}
            <TabsContent value="access" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8">
                <AccessAreaMatrix
                  ticketTypes={ticketTypes}
                  staffTickets={staffTickets}
                />
              </div>
            </TabsContent>

            {/* Review & Publish Tab */}
            <TabsContent value="review" className="mt-0">
              <div className="w-full max-w-[1136px] mx-auto px-6 py-8">
                <ReviewPublishTab
                  eventId={eventId}
                  eventData={{
                    nameEn: formData.nameEn,
                    nameZhHant: formData.nameTc,
                    nameZhHans: formData.nameSc,
                    descriptionEn: formData.descriptionEn,
                    descriptionZhHant: formData.descriptionTc,
                    descriptionZhHans: formData.descriptionSc,
                    category: formData.category as string,
                    type: formData.type,
                    startAt: formData.startDateTime || new Date(),
                    endAt: formData.endDateTime || new Date(),
                    rsvpDeadline: formData.rsvpDeadline,
                    schedulePublishedDate: formData.schedulePublishedDate,
                    venueEn: formData.venueEn,
                    venueZhHant: formData.venueTc,
                    venueZhHans: formData.venueSc,
                    addressEn: formData.addressEn,
                    addressZhHant: formData.addressTc,
                    addressZhHans: formData.addressSc,
                    quota: parseInt(formData.quota) || 0,
                    logoUrl: formData.logoPreview || undefined,
                    bannerUrl: formData.bannerPreview || undefined,
                    eventPhotoUrls: formData.eventPhotos.filter(p => p.preview).map(p => p.preview!),
                    primaryColour: formData.primaryColour,
                    secondaryColour: formData.secondaryColour,
                  }}
                  sessions={sessions}
                  ticketTypes={ticketTypes}
                  staffTickets={staffTickets}
                  eventStatus={eventStatus}
                  onPublish={handlePublish}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 dark:bg-orange-950 p-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <DialogTitle>Unsaved Changes</DialogTitle>
            </div>
            <DialogDescription className="pt-4">
              You have unsaved changes to this event. Are you sure you want to leave? 
              All changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowUnsavedDialog(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="destructive"
              onClick={handleDiscardChanges}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}