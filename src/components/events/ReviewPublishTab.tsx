"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import { cn } from "../ui/utils"
import { 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Clock
} from "lucide-react"
import { toast } from 'sonner'
import { type Session as TableSession } from "./SessionsTable"
import { type TicketType } from "./TicketTypesTable"
import { type StaffTicket } from "./StaffTicketsTable"

interface ReviewPublishTabProps {
  eventId: string
  eventData: {
    nameEn: string
    nameZhHant?: string
    nameZhHans?: string
    descriptionEn?: string
    descriptionZhHant?: string
    descriptionZhHans?: string
    category: string
    type?: string
    startAt: Date
    endAt: Date
    rsvpDeadline?: Date
    schedulePublishedDate?: Date
    venueEn: string
    venueZhHant?: string
    venueZhHans?: string
    addressEn?: string
    addressZhHant?: string
    addressZhHans?: string
    quota: number
    logoUrl?: string
    bannerUrl?: string
    eventPhotoUrls?: string[]
    primaryColour?: string
    secondaryColour?: string
  }
  sessions: TableSession[]
  ticketTypes: TicketType[]
  staffTickets: StaffTicket[]
  eventStatus: "draft" | "published" | "live" | "closed"
  onPublish?: () => Promise<void>
  onStatusChange?: (status: "live" | "closed") => void
}

interface ValidationError {
  rule: number
  message: string
  tab: "details" | "sessions" | "tickets" | "access"
}

interface SectionValidation {
  section: "details" | "sessions" | "tickets" | "access"
  isValid: boolean
  warnings: string[]
}

export function ReviewPublishTab({
  eventId,
  eventData,
  sessions,
  ticketTypes,
  staffTickets,
  eventStatus,
  onPublish,
  onStatusChange,
}: ReviewPublishTabProps) {
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([])
  const [sectionValidations, setSectionValidations] = React.useState<SectionValidation[]>([])
  const [showSuccess, setShowSuccess] = React.useState(false)

  // Generate registration URL based on event ID
  const registrationUrl = `https://events.lepos.co/event/${eventId}/register`

  // Run validation checks
  const runValidation = React.useCallback((): ValidationError[] => {
    const errors: ValidationError[] = []

    // Rule 1: Event name is not empty
    if (!eventData.nameEn?.trim()) {
      errors.push({
        rule: 1,
        message: "Event name is required.",
        tab: "details",
      })
    }

    // Rule 2: start_at and end_at are set and valid
    if (!eventData.startAt || !eventData.endAt || eventData.startAt > eventData.endAt) {
      errors.push({
        rule: 2,
        message: "Event dates are invalid or missing.",
        tab: "details",
      })
    }

    // Rule 3: start_at is in the future
    if (eventData.startAt && eventData.startAt <= new Date()) {
      errors.push({
        rule: 3,
        message: "Event start date must be a future date.",
        tab: "details",
      })
    }

    // Rule 4: Venue name is not empty
    if (!eventData.venueEn?.trim()) {
      errors.push({
        rule: 4,
        message: "Venue name is required.",
        tab: "details",
      })
    }

    // Rule 5: quota > 0
    if (!eventData.quota || eventData.quota <= 0) {
      errors.push({
        rule: 5,
        message: "Event quota must be greater than 0.",
        tab: "details",
      })
    }

    // Rule 6: At least one session exists
    if (sessions.length === 0) {
      errors.push({
        rule: 6,
        message: "At least one session must be configured.",
        tab: "sessions",
      })
    }

    // Rule 7: All admission_required sessions have at least one permitted ticket type
    const allSessionsTickets = ticketTypes.filter(t => t.accessScope === "all_sessions")
    const hasAllSessionsTicket = allSessionsTickets.length > 0

    sessions.forEach((session) => {
      if (session.accessType === "admission_required" && !hasAllSessionsTicket) {
        errors.push({
          rule: 7,
          message: `Session "${session.nameEn}" requires at least one permitted ticket type.`,
          tab: "access",
        })
      }
    })

    // Rule 8: At least one ticket type exists
    if (ticketTypes.length === 0) {
      errors.push({
        rule: 8,
        message: "At least one ticket type must be defined.",
        tab: "tickets",
      })
    }

    // Rule 9: All ticket type quotas >= 0 (quotas can be 0)
    ticketTypes.forEach((ticket) => {
      if (ticket.quota === undefined || ticket.quota === null || ticket.quota < 0) {
        errors.push({
          rule: 9,
          message: `Ticket type "${ticket.nameEn}" must have a valid quota (0 or greater).`,
          tab: "tickets",
        })
      }
    })

    // Rule 10: RSVP deadline validation
    if (eventData.rsvpDeadline) {
      const now = new Date()
      if (eventData.rsvpDeadline >= eventData.endAt || eventData.rsvpDeadline <= now) {
        errors.push({
          rule: 10,
          message: "RSVP deadline must be before the event end date and in the future.",
          tab: "details",
        })
      }
    }

    return errors
  }, [eventData, sessions, ticketTypes])

  // Run lightweight validation on mount and when data changes
  React.useEffect(() => {
    const errors = runValidation()
    
    // Group by section
    const sections: SectionValidation[] = [
      {
        section: "details",
        isValid: !errors.some(e => e.tab === "details"),
        warnings: errors.filter(e => e.tab === "details").map(e => e.message),
      },
      {
        section: "sessions",
        isValid: !errors.some(e => e.tab === "sessions"),
        warnings: errors.filter(e => e.tab === "sessions").map(e => e.message),
      },
      {
        section: "tickets",
        isValid: !errors.some(e => e.tab === "tickets"),
        warnings: errors.filter(e => e.tab === "tickets").map(e => e.message),
      },
      {
        section: "access",
        isValid: !errors.some(e => e.tab === "access"),
        warnings: errors.filter(e => e.tab === "access").map(e => e.message),
      },
    ]
    
    setSectionValidations(sections)
  }, [runValidation])

  const handlePublish = async () => {
    setIsPublishing(true)
    setValidationErrors([])
    
    try {
      // Run full validation
      const errors = runValidation()
      
      if (errors.length > 0) {
        setValidationErrors(errors)
        setIsPublishing(false)
        return
      }
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      await onPublish?.()
      
      setShowSuccess(true)
      toast.success("Event published successfully!")
    } catch (error) {
      toast.error("Unable to publish. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  const copyRegistrationUrl = () => {
    navigator.clipboard.writeText(registrationUrl)
    toast.success("Link copied to clipboard")
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(',', '')
  }

  const getSectionValidation = (section: string) => {
    return sectionValidations.find(s => s.section === section)
  }

  const SectionCard = ({ 
    title, 
    section,
    children 
  }: { 
    title: string
    section: "details" | "sessions" | "tickets" | "access"
    children: React.ReactNode 
  }) => {
    const validation = getSectionValidation(section)
    
    return (
      <div className="border rounded-lg bg-white">
        <div className="px-6 py-4 border-b flex items-center gap-3">
          <h3 className="font-semibold text-base">{title}</h3>
          {!validation?.isValid && (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    )
  }

  const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
      <div className="text-sm text-muted-foreground col-span-1">{label}</div>
      <div className="text-sm col-span-2">
        {value || <span className="text-muted-foreground">Not set</span>}
      </div>
    </div>
  )

  // Success State
  if (showSuccess || eventStatus !== "draft") {
    const statusConfig = {
      published: { label: "Published", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
      live: { label: "Live", color: "bg-green-500/10 text-green-700 border-green-200" },
      closed: { label: "Closed", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
    }
    
    const currentStatus = statusConfig[eventStatus as keyof typeof statusConfig] || statusConfig.published
    
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Event {currentStatus.label.toLowerCase()} successfully!</strong>
            {eventStatus === "published" && " Guests can now register."}
            {eventStatus === "live" && " Event is currently active."}
            {eventStatus === "closed" && " No further registrations are accepted."}
          </AlertDescription>
        </Alert>

        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">Event Status:</div>
            <Badge variant="outline" className={cn("text-sm", currentStatus.color)}>
              {currentStatus.label}
            </Badge>
          </div>
          
          {eventStatus === "published" && onStatusChange && (
            <Button onClick={() => onStatusChange("live")} size="sm" className="bg-[#107DAC] hover:bg-[#0d6390]">
              Start Event (Go Live)
            </Button>
          )}
          
          {eventStatus === "live" && onStatusChange && (
            <Button onClick={() => onStatusChange("closed")} size="sm" variant="outline">
              Close Event
            </Button>
          )}
        </div>

        {/* Registration URL */}
        {(eventStatus === "published" || eventStatus === "live") && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Form URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 p-3 border rounded-lg bg-muted/30 font-mono text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1">{registrationUrl}</span>
              </div>
              <Button onClick={copyRegistrationUrl} size="sm" variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>
        )}

        {eventStatus === "closed" && (
          <Alert>
            <AlertDescription>
              This event is closed. The registration URL is no longer active.
            </AlertDescription>
          </Alert>
        )}

        {/* Next Steps */}
        <div className="p-4 border rounded-lg bg-blue-50/50">
          <h4 className="font-medium mb-2">Next Steps</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Monitor registrations from the Event List</li>
            <li>• Share the registration URL with potential guests</li>
            <li>• Prepare for check-in on the event day</li>
          </ul>
        </div>
      </div>
    )
  }

  // Draft State - Review & Publish
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Review & Publish</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review your event configuration and publish to make it live
          </p>
        </div>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          {isPublishing ? "Publishing..." : "Publish Event"}
        </Button>
      </div>

      {/* Validation Error Summary */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <div className="font-semibold mb-3">
              {validationErrors.length} validation error{validationErrors.length !== 1 ? "s" : ""} — fix these before publishing
            </div>
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <div key={index} className="flex items-start justify-between gap-4 p-3 bg-background/50 rounded border">
                  <div className="flex-1 text-sm">
                    {error.message}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs shrink-0"
                    onClick={() => {
                      toast.info(`Navigate to ${error.tab} tab to fix this issue`)
                    }}
                  >
                    Go to {error.tab.charAt(0).toUpperCase() + error.tab.slice(1)}
                  </Button>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Event Details Section */}
      <SectionCard title="Event Details" section="details">
        <div className="space-y-0">
          <DetailRow label="Event Name (EN)" value={<span className="font-medium">{eventData.nameEn}</span>} />
          {eventData.nameZhHant && (
            <DetailRow label="Event Name (繁中)" value={eventData.nameZhHant} />
          )}
          {eventData.nameZhHans && (
            <DetailRow label="Event Name (简中)" value={eventData.nameZhHans} />
          )}
          {eventData.descriptionEn && (
            <DetailRow label="Description (EN)" value={
              <span className="text-xs line-clamp-2">{eventData.descriptionEn}</span>
            } />
          )}
          <DetailRow label="Category" value={eventData.category} />
          <DetailRow label="Type" value={eventData.type || <span className="text-muted-foreground">Not set</span>} />
          <DetailRow label="Start Date & Time" value={formatDateTime(eventData.startAt)} />
          <DetailRow label="End Date & Time" value={formatDateTime(eventData.endAt)} />
          <DetailRow label="RSVP Deadline" value={eventData.rsvpDeadline ? formatDateTime(eventData.rsvpDeadline) : "Not set"} />
          <DetailRow label="Schedule Published Date" value={eventData.schedulePublishedDate ? formatDateTime(eventData.schedulePublishedDate) : "Not set"} />
          <DetailRow label="Venue (EN)" value={eventData.venueEn} />
          {eventData.venueZhHant && (
            <DetailRow label="Venue (繁中)" value={eventData.venueZhHant} />
          )}
          {eventData.venueZhHans && (
            <DetailRow label="Venue (简中)" value={eventData.venueZhHans} />
          )}
          {eventData.addressEn && (
            <DetailRow label="Address (EN)" value={eventData.addressEn} />
          )}
          {eventData.addressZhHant && (
            <DetailRow label="Address (繁中)" value={eventData.addressZhHant} />
          )}
          {eventData.addressZhHans && (
            <DetailRow label="Address (简中)" value={eventData.addressZhHans} />
          )}
          <DetailRow label="Quota" value={<span className="font-mono">{eventData.quota}</span>} />
        </div>
      </SectionCard>

      {/* Branding Section */}
      <SectionCard title="Branding & Visual Assets" section="details">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Event Logo</div>
              {eventData.logoUrl ? (
                <div className="border rounded-lg p-4 bg-muted/20 flex items-center justify-center h-32">
                  <img src={eventData.logoUrl} alt="Event Logo" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-muted/20 flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No logo uploaded
                </div>
              )}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Event Banner</div>
              {eventData.bannerUrl ? (
                <div className="border rounded-lg p-4 bg-muted/20 flex items-center justify-center h-32">
                  <img src={eventData.bannerUrl} alt="Event Banner" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-muted/20 flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No banner uploaded
                </div>
              )}
            </div>
          </div>
          {eventData.eventPhotoUrls && eventData.eventPhotoUrls.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Event Photos ({eventData.eventPhotoUrls.length})</div>
              <div className="grid grid-cols-4 gap-2">
                {eventData.eventPhotoUrls.map((url, index) => (
                  <div key={index} className="border rounded-lg p-2 bg-muted/20 aspect-video flex items-center justify-center">
                    <img src={url} alt={`Event Photo ${index + 1}`} className="max-h-full max-w-full object-cover rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Primary Colour:</span>
              <div className="flex items-center gap-2">
                {eventData.primaryColour && (
                  <div 
                    className="h-6 w-6 rounded border"
                    style={{ backgroundColor: eventData.primaryColour }}
                  />
                )}
                <span className="text-sm font-mono">{eventData.primaryColour || "Not set"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Secondary Colour:</span>
              <div className="flex items-center gap-2">
                {eventData.secondaryColour && (
                  <div 
                    className="h-6 w-6 rounded border"
                    style={{ backgroundColor: eventData.secondaryColour }}
                  />
                )}
                <span className="text-sm font-mono">{eventData.secondaryColour || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Sessions Section */}
      <SectionCard title="Sessions" section="sessions">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-medium">No sessions configured</p>
            <p className="text-sm mt-1">Add sessions in the Sessions tab</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} across{" "}
              {new Set(sessions.map(s => s.schedules[0]?.date.toDateString())).size} date{new Set(sessions.map(s => s.schedules[0]?.date.toDateString())).size !== 1 ? "s" : ""}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Session</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Date</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Time</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Access Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => {
                    const schedule = session.schedules[0]
                    return (
                      <tr key={session.id} className={cn("border-b last:border-b-0", index % 2 === 0 && "bg-muted/10")}>
                        <td className="p-3 text-sm font-medium">{session.nameEn}</td>
                        <td className="p-3 text-sm">{formatDate(schedule?.date || new Date())}</td>
                        <td className="p-3 text-sm">{schedule?.startTime} – {schedule?.endTime}</td>
                        <td className="p-3">
                          <Badge 
                            variant={session.accessType === "admission_required" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {session.accessType === "admission_required" ? "Admission Required" : "Open to All"}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm font-mono">{session.capacity}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Ticket Types Section */}
      <SectionCard title="Public Guest Tickets" section="tickets">
        {ticketTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-medium">No ticket types configured</p>
            <p className="text-sm mt-1">Add ticket types in the Tickets tab</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {ticketTypes.length} public guest ticket type{ticketTypes.length !== 1 ? "s" : ""} configured
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Quota</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Registered</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Companions</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes.map((ticket, index) => (
                    <tr key={ticket.id} className={cn("border-b last:border-b-0", index % 2 === 0 && "bg-muted/10")}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: ticket.colorHex }}
                          />
                          <span className="text-sm font-medium">{ticket.nameEn}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm font-mono">{ticket.quota}</td>
                      <td className="p-3 text-sm font-mono text-muted-foreground">
                        {ticket.registeredCount || 0} / {ticket.quota}
                      </td>
                      <td className="p-3 text-sm font-mono">{ticket.maxBringAlongDefault}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Staff Tickets Section */}
      {staffTickets && staffTickets.length > 0 && (
        <SectionCard title="Organizer / Staff Tickets" section="tickets">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {staffTickets.length} staff ticket type{staffTickets.length !== 1 ? "s" : ""} configured
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Quota</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Registered</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Companions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffTickets.map((ticket, index) => (
                    <tr key={ticket.id} className={cn("border-b last:border-b-0", index % 2 === 0 && "bg-muted/10")}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: ticket.colorHex }}
                          />
                          <span className="text-sm font-medium">{ticket.nameEn}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm font-mono">{ticket.quota}</td>
                      <td className="p-3 text-sm font-mono text-muted-foreground">
                        {ticket.registeredCount || 0} / {ticket.quota}
                      </td>
                      <td className="p-3 text-sm font-mono">{ticket.maxBringAlongDefault}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Access Mapping Section */}
      <SectionCard title="Access Mapping" section="access">
        {sessions.length === 0 || ticketTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-medium">Configure sessions and ticket types first</p>
            <p className="text-sm mt-1">Access mapping will be available after setup</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Session-ticket type mappings control which tickets can access which sessions
            </div>
            {sessions.some(s => s.accessType === "admission_required") && 
             !ticketTypes.some(t => t.accessScope === "all_sessions") && (
              <Alert className="bg-orange-50 border-orange-200">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  All "Admission Required" sessions must have at least one ticket type assigned in the Access tab
                </AlertDescription>
              </Alert>
            )}
            <div className="text-sm">
              <div className="font-medium mb-2">Summary:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {sessions.filter(s => s.accessType === "open_to_all").length} session{sessions.filter(s => s.accessType === "open_to_all").length !== 1 ? "s" : ""} open to all</li>
                <li>• {sessions.filter(s => s.accessType === "admission_required").length} session{sessions.filter(s => s.accessType === "admission_required").length !== 1 ? "s" : ""} requiring admission</li>
                <li>• {ticketTypes.filter(t => t.accessScope === "all_sessions").length} ticket type{ticketTypes.filter(t => t.accessScope === "all_sessions").length !== 1 ? "s" : ""} with all-sessions access</li>
              </ul>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}