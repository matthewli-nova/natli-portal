"use client"

import * as React from "react"
import { InvitationEventList } from "./InvitationEventList"
import { InvitationList } from "./InvitationList"
import { InvitationGuestDetail } from "./InvitationGuestDetail"
import { InvitationEmailEditor } from "./InvitationEmailEditor"
import { type InvitationEventSummary, type Invitation } from "../data/invitations"
import { toast } from 'sonner'

type ViewMode = "events" | "invitations" | "guest-detail" | "email-editor"

export function InvitationManager() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("events")
  const [selectedEvent, setSelectedEvent] = React.useState<InvitationEventSummary | null>(null)
  const [selectedGuest, setSelectedGuest] = React.useState<Invitation | null>(null)

  const handleSelectEvent = (summary: InvitationEventSummary) => {
    setSelectedEvent(summary)
    setViewMode("invitations")
  }

  const handleBackToEvents = () => {
    setSelectedEvent(null)
    setSelectedGuest(null)
    setViewMode("events")
  }

  const handleViewGuest = (invitation: Invitation) => {
    setSelectedGuest(invitation)
    setViewMode("guest-detail")
  }

  const handleBackToInvitations = () => {
    setSelectedGuest(null)
    setViewMode("invitations")
  }

  const handleOpenEmailEditor = () => {
    setViewMode("email-editor")
  }

  const handleEmailEditorSave = () => {
    toast.success("Invitation email templates saved successfully!")
    setViewMode("invitations")
  }

  const handleEmailEditorCancel = () => {
    setViewMode("invitations")
  }

  return (
    <>
      {viewMode === "events" && (
        <InvitationEventList onSelectEvent={handleSelectEvent} />
      )}

      {viewMode === "invitations" && selectedEvent && (
        <InvitationList
          eventId={selectedEvent.eventId}
          eventName={selectedEvent.eventName}
          onBack={handleBackToEvents}
          onViewGuest={handleViewGuest}
          onEditEmail={handleOpenEmailEditor}
        />
      )}

      {viewMode === "guest-detail" && selectedGuest && (
        <InvitationGuestDetail
          invitation={selectedGuest}
          onBack={handleBackToInvitations}
        />
      )}

      {viewMode === "email-editor" && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-white">
          <InvitationEmailEditor
            eventName={selectedEvent.eventName}
            eventStartDate={selectedEvent.eventStartDate}
            onSave={handleEmailEditorSave}
            onCancel={handleEmailEditorCancel}
          />
        </div>
      )}
    </>
  )
}
