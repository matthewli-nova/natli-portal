"use client"

import * as React from "react"
import { RegistrationLinkList } from "./RegistrationLinkList"
import { RegistrationLinkEditor } from "./RegistrationLinkEditor"
import { type RegistrationLink } from "../data/registration-links"
import { mockEventsForLinking } from "../data/b2b-events"
import { toast } from 'sonner'

type ViewMode = 'list' | 'editor'

export function RegistrationLinkManager() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('list')
  const [selectedLink, setSelectedLink] = React.useState<RegistrationLink | null>(null)

  const handleCreateLink = () => {
    setSelectedLink(null)
    setViewMode('editor')
  }

  const handleEditLink = (link: RegistrationLink) => {
    setSelectedLink(link)
    setViewMode('editor')
  }

  const handleEditorSave = (config: any) => {
    console.log("Saving registration link:", config)
    toast.success("Registration link saved successfully!")
    setViewMode('list')
    setSelectedLink(null)
  }

  const handleEditorCancel = () => {
    setViewMode('list')
    setSelectedLink(null)
  }

  // Get context data for editor (only when editing an existing link)
  const getEditorContext = () => {
    if (selectedLink) {
      const event = mockEventsForLinking.find((e) => e.id === selectedLink.eventId)
      return {
        eventName: selectedLink.eventName,
        eventStartDate: event?.startDate,
        eventEndDate: event?.endDate,
        eventVenue: event?.venue,
        ticketTypeName: selectedLink.ticketTypeName,
        ticketTypeColor: selectedLink.ticketTypeColor,
        sessionNames: selectedLink.sessionNames,
      }
    }

    // New link — editor handles event/ticket selection internally (Steps 1 & 2)
    return {
      eventName: "",
      eventStartDate: undefined,
      eventEndDate: undefined,
      eventVenue: "",
      ticketTypeName: "",
      ticketTypeColor: "#107DAC",
      sessionNames: [],
    }
  }

  return (
    <>
      {viewMode === 'list' && (
        <RegistrationLinkList
          onCreateLink={handleCreateLink}
          onEditLink={handleEditLink}
        />
      )}

      {viewMode === 'editor' && (
        <div className="fixed inset-0 z-50 bg-white">
          <RegistrationLinkEditor
            link={selectedLink || undefined}
            {...getEditorContext()}
            onSave={handleEditorSave}
            onCancel={handleEditorCancel}
          />
        </div>
      )}
    </>
  )
}