"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import { cn } from "../ui/utils"
import { Info, AlertTriangle } from "lucide-react"
import { type Session as TableSession } from "./SessionsTable"
import { type TicketType } from "./TicketTypesTable"
import { toast } from "sonner@2.0.3"

interface SessionTicketMapping {
  sessionId: string
  ticketTypeIds: string[]
}

interface AccessMappingMatrixProps {
  sessions: TableSession[]
  ticketTypes: TicketType[]
  onMappingChange?: (mappings: SessionTicketMapping[]) => void
}

export function AccessMappingMatrix({
  sessions,
  ticketTypes,
  onMappingChange,
}: AccessMappingMatrixProps) {
  // Filter out "all_sessions" ticket types from the matrix
  const assignableTicketTypes = ticketTypes.filter(
    (ticket) => ticket.accessScope !== "all_sessions"
  )

  // Get ticket types with "all_sessions" access for the info banner
  const allSessionsTickets = ticketTypes.filter(
    (ticket) => ticket.accessScope === "all_sessions"
  )

  // Initialize mappings state - using a Map for efficient lookup
  const [mappings, setMappings] = React.useState<Map<string, Set<string>>>(
    new Map()
  )

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Group sessions by date
  const sessionsByDate = React.useMemo(() => {
    const grouped = new Map<string, TableSession[]>()
    
    sessions.forEach((session) => {
      // Use the first schedule's date as the session date
      const date = session.schedules[0]?.date || "No Date"
      const dateKey = date instanceof Date ? date.toDateString() : date
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(session)
    })
    
    return Array.from(grouped.entries()).sort((a, b) => {
      // Sort by date
      if (a[0] === "No Date") return 1
      if (b[0] === "No Date") return -1
      return new Date(a[0]).getTime() - new Date(b[0]).getTime()
    })
  }, [sessions])

  // Check if a session has admission required but no assigned tickets
  const hasWarning = (session: TableSession): boolean => {
    if (session.accessType !== "admission_required") return false
    
    const assignedTickets = mappings.get(session.id)
    return !assignedTickets || assignedTickets.size === 0
  }

  // Toggle checkbox
  const handleToggle = (sessionId: string, ticketTypeId: string) => {
    setMappings((prev) => {
      const newMappings = new Map(prev)
      const sessionTickets = newMappings.get(sessionId) || new Set<string>()
      
      if (sessionTickets.has(ticketTypeId)) {
        sessionTickets.delete(ticketTypeId)
      } else {
        sessionTickets.add(ticketTypeId)
      }
      
      newMappings.set(sessionId, sessionTickets)
      return newMappings
    })
    setHasUnsavedChanges(true)
  }

  // Check if checkbox is checked
  const isChecked = (sessionId: string, ticketTypeId: string): boolean => {
    const sessionTickets = mappings.get(sessionId)
    return sessionTickets ? sessionTickets.has(ticketTypeId) : false
  }

  // Save mappings
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Convert Map to array format
      const mappingArray: SessionTicketMapping[] = Array.from(mappings.entries()).map(
        ([sessionId, ticketTypeIds]) => ({
          sessionId,
          ticketTypeIds: Array.from(ticketTypeIds),
        })
      )
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      onMappingChange?.(mappingArray)
      setHasUnsavedChanges(false)
      toast.success("Access mapping updated")
    } catch (error) {
      toast.error("Failed to save access mapping. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to initial state
  const handleCancel = () => {
    // Reset mappings to empty state
    setMappings(new Map())
    setHasUnsavedChanges(false)
  }

  // Format date for display
  const formatDate = (dateStr: string): string => {
    if (dateStr === "No Date") return dateStr
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Empty states
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-2">No sessions configured</p>
        <p className="text-sm text-muted-foreground">
          Add sessions first, then assign ticket types
        </p>
      </div>
    )
  }

  if (assignableTicketTypes.length === 0 && allSessionsTickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-2">No ticket types configured</p>
        <p className="text-sm text-muted-foreground">
          Create ticket types first, then assign them to sessions
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* All Sessions Access Info Banner */}
      {allSessionsTickets.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {allSessionsTickets.map((ticket, index) => (
              <span key={ticket.id}>
                <strong>{ticket.nameEn}</strong>
                {index < allSessionsTickets.length - 1 ? ", " : " "}
              </span>
            ))}
            {allSessionsTickets.length === 1 ? "has" : "have"} All Sessions access
            — {allSessionsTickets.length === 1 ? "it grants" : "they grant"} entry
            to every session automatically
          </AlertDescription>
        </Alert>
      )}

      {/* Matrix Container */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium sticky left-0 bg-muted/50 z-10 min-w-[300px]">
                  Session
                </th>
                {assignableTicketTypes.map((ticket) => (
                  <th
                    key={ticket.id}
                    className="text-center p-4 font-medium min-w-[140px]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: ticket.colorHex }}
                        />
                        <span className="text-sm">{ticket.nameEn}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {ticket.ticketScope === "event" ? "Event" : "Sub-event"}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessionsByDate.map(([dateKey, dateSessions]) => (
                <React.Fragment key={dateKey}>
                  {/* Date Header Row */}
                  <tr className="bg-muted/30">
                    <td
                      colSpan={assignableTicketTypes.length + 1}
                      className="p-3 font-medium text-sm sticky left-0 z-10 bg-muted/30"
                    >
                      {formatDate(dateKey)}
                    </td>
                  </tr>
                  
                  {/* Session Rows */}
                  {dateSessions.map((session) => {
                    const schedule = session.schedules[0]
                    const timeRange = schedule
                      ? `${schedule.startTime} – ${schedule.endTime}`
                      : "No time"
                    
                    return (
                      <tr
                        key={session.id}
                        className="border-b hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-4 sticky left-0 bg-background z-10">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              {session.parentSessionId && (
                                <span className="text-muted-foreground">↳</span>
                              )}
                              <span className="font-medium">{session.nameEn}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{timeRange}</span>
                              <Badge
                                variant={
                                  session.accessType === "admission_required"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {session.accessType === "admission_required"
                                  ? "Admission Required"
                                  : "Open to All"}
                              </Badge>
                              {hasWarning(session) && (
                                <div className="flex items-center gap-1 text-orange-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span className="text-xs">Required</span>
                                </div>
                              )}
                            </div>
                            {session.accessType === "open_to_all" && (
                              <span className="text-xs text-muted-foreground italic">
                                Mapping optional — not enforced at scan time
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {assignableTicketTypes.map((ticket) => (
                          <td key={ticket.id} className="p-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={isChecked(session.id, ticket.id)}
                                onCheckedChange={() =>
                                  handleToggle(session.id, ticket.id)
                                }
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
        <div className="text-sm text-muted-foreground">
          {hasUnsavedChanges
            ? "You have unsaved changes"
            : "All changes saved"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={!hasUnsavedChanges || isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
