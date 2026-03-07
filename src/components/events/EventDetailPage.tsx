"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ArrowLeft, Copy, ExternalLink, Save, ChevronDown, AlertTriangle } from "lucide-react"
import { cn } from "../ui/utils"
import { toast } from 'sonner'
import { CreateEventForm } from "./CreateEventForm"
import { type B2BEvent, statusColors, type EventStatus } from "../data/b2b-events"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

interface EventDetailPageProps {
  event: B2BEvent
  onBack: () => void
  onUpdate?: (event: B2BEvent) => void
}

export function EventDetailPage({ event, onBack, onUpdate }: EventDetailPageProps) {
  const [isViewOnly, setIsViewOnly] = React.useState(event.status === "Closed")
  const [submitFormFn, setSubmitFormFn] = React.useState<(() => void) | null>(null)
  const [saveState, setSaveState] = React.useState({ isSubmitting: false, hasUnsavedChanges: false })
  const [currentStatus, setCurrentStatus] = React.useState<EventStatus>(event.status)
  const [showStatusDialog, setShowStatusDialog] = React.useState(false)
  const [pendingStatus, setPendingStatus] = React.useState<EventStatus | null>(null)
  
  // Generate registration URL based on event ID
  const registrationUrl = `https://events.lepos.co/event/${event.id}/register`
  
  const copyRegistrationUrl = () => {
    navigator.clipboard.writeText(registrationUrl)
    toast.success("Registration link copied to clipboard")
  }

  const handleStatusChangeRequest = (newStatus: EventStatus) => {
    if (newStatus === currentStatus) return
    setPendingStatus(newStatus)
    setShowStatusDialog(true)
  }

  const confirmStatusChange = () => {
    if (!pendingStatus) return
    
    setCurrentStatus(pendingStatus)
    setIsViewOnly(pendingStatus === "Closed")
    toast.success(`Event status changed to ${pendingStatus}`)
    
    if (onUpdate) {
      onUpdate({
        ...event,
        status: pendingStatus,
      })
    }
    
    setShowStatusDialog(false)
    setPendingStatus(null)
  }

  const cancelStatusChange = () => {
    setShowStatusDialog(false)
    setPendingStatus(null)
  }

  const allStatuses: EventStatus[] = ["Draft", "Published", "Live", "Closed"]

  const handleFormSubmit = (formData: any) => {
    // Update event logic here
    toast.success("Event updated successfully")
    if (onUpdate) {
      onUpdate({
        ...event,
        name: {
          en: formData.nameEn,
          tc: formData.nameTc,
          sc: formData.nameSc,
        },
        description: {
          en: formData.descriptionEn,
          tc: formData.descriptionTc,
          sc: formData.descriptionSc,
        },
        venue: {
          en: formData.venueEn,
          tc: formData.venueTc,
          sc: formData.venueSc,
        },
        address: {
          en: formData.addressEn,
          tc: formData.addressTc,
          sc: formData.addressSc,
        },
        category: formData.category,
        type: formData.type,
        startDateTime: formData.startDateTime || event.startDateTime,
        endDateTime: formData.endDateTime || event.endDateTime,
        quota: parseInt(formData.quota) || event.quota,
        rsvpDeadline: formData.rsvpDeadline,
        schedulePublishedDate: formData.schedulePublishedDate,
        branding: {
          logoUrl: formData.logoPreview || event.branding?.logoUrl,
          bannerUrl: formData.bannerPreview || event.branding?.bannerUrl,
          primaryColour: formData.primaryColour || event.branding?.primaryColour,
        },
      })
    }
  }

  return (
    <div className="flex flex-col w-full max-w-[1136px] mx-auto gap-6">
      {/* Header with Back Button and Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{event.name.en}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm px-3 py-1 cursor-pointer hover:bg-accent",
                        statusColors[currentStatus].bg,
                        statusColors[currentStatus].text,
                        statusColors[currentStatus].border
                      )}
                    >
                      {currentStatus}
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {allStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChangeRequest(status)}
                        className={cn(
                          currentStatus === status && "bg-accent"
                        )}
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs px-2 py-0.5",
                            statusColors[status].bg,
                            statusColors[status].text,
                            statusColors[status].border
                          )}
                        >
                          {status}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {event.type && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {event.type}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs font-normal">
                  {event.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isViewOnly && (
            <Button
              size="sm"
              onClick={() => submitFormFn?.()}
              disabled={saveState.isSubmitting || !saveState.hasUnsavedChanges}
              className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]"
            >
              <Save className="h-4 w-4" />
              {saveState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      {/* View-Only Notice for Closed Events */}
      {isViewOnly && (
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-muted-foreground" />
            <span className="font-medium">This event is closed and cannot be edited</span>
          </div>
        </div>
      )}

      {/* Event Form with all tabs */}
      <CreateEventForm
        isEdit={true}
        hideSaveButton={true}
        onSaveStateChange={setSaveState}
        onSubmitReady={(fn) => setSubmitFormFn(() => fn)}
        currentEventStatus={event.status}
        registrationUrl={registrationUrl}
        initialData={{
          nameEn: event.name.en,
          nameTc: event.name.tc,
          nameSc: event.name.sc,
          descriptionEn: event.description?.en,
          descriptionTc: event.description?.tc,
          descriptionSc: event.description?.sc,
          category: event.category,
          type: event.type,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          venueEn: event.venue.en,
          venueTc: event.venue.tc,
          venueSc: event.venue.sc,
          addressEn: event.address?.en,
          addressTc: event.address?.tc,
          addressSc: event.address?.sc,
          quota: event.quota.toString(),
          rsvpDeadline: event.rsvpDeadline,
          schedulePublishedDate: event.schedulePublishedDate,
          logoPreview: event.branding?.logoUrl,
          bannerPreview: event.branding?.bannerUrl,
          eventPhotos: [],
        }}
        onSubmit={handleFormSubmit}
        onCancel={onBack}
      />

      {/* Status Change Confirmation Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              </div>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </div>
            <DialogDescription className="pt-4 space-y-3">
              <p>
                You are about to change the event status from{" "}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5 mx-1",
                    statusColors[currentStatus].bg,
                    statusColors[currentStatus].text,
                    statusColors[currentStatus].border
                  )}
                >
                  {currentStatus}
                </Badge>
                {" "}to{" "}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-2 py-0.5 mx-1",
                    pendingStatus && statusColors[pendingStatus].bg,
                    pendingStatus && statusColors[pendingStatus].text,
                    pendingStatus && statusColors[pendingStatus].border
                  )}
                >
                  {pendingStatus}
                </Badge>
              </p>
              <p className="text-sm">
                {pendingStatus === "Published" && "This will make the event visible to the public and allow registrations."}
                {pendingStatus === "Live" && "This indicates the event is currently in progress."}
                {pendingStatus === "Draft" && "This will hide the event from the public and pause registrations."}
                {pendingStatus === "Closed" && "This will close the event and make it view-only. You will not be able to edit event details after this change."}
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={cancelStatusChange}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmStatusChange}
              className="bg-[#107DAC] hover:bg-[#0d6390]"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}