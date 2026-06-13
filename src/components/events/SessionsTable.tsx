"use client"

import * as React from "react"
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Save, X } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { DatePicker } from "../ui/date-picker"
import { TimePicker } from "../ui/time-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "../ui/badge"
import { toast } from 'sonner'

export interface Session {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  location: string
  locationEn?: string
  locationZhHant?: string
  locationZhHans?: string
  // Optional fields used by access-mapping / review views
  nameEn?: string
  accessType?: string
  capacity?: number
  parentSessionId?: string
  schedules?: Array<{ date: Date; startTime: string; endTime: string }>
}

export interface SubEvent {
  id: string
  name: string
  nameEn?: string
  nameZhHant?: string
  nameZhHans?: string
  sessions: Session[]
}

interface SessionsTableProps {
  subEvents: SubEvent[]
  onSubEventsChange: (subEvents: SubEvent[]) => void
}

export function SessionsTable({ subEvents, onSubEventsChange }: SessionsTableProps) {
  const [expandedSubEvents, setExpandedSubEvents] = React.useState<Set<string>>(new Set())
  const [editingSubEvent, setEditingSubEvent] = React.useState<string | null>(null)
  const [editingSession, setEditingSession] = React.useState<string | null>(null)
  const [editFormData, setEditFormData] = React.useState<Partial<SubEvent>>({})
  const [sessionFormData, setSessionFormData] = React.useState<Partial<Session>>({})

  // Main Event is always the first item
  const mainEvent = subEvents[0]
  const otherSubEvents = subEvents.slice(1)

  const toggleExpand = (subEventId: string) => {
    const newExpanded = new Set(expandedSubEvents)
    if (newExpanded.has(subEventId)) {
      newExpanded.delete(subEventId)
    } else {
      newExpanded.add(subEventId)
    }
    setExpandedSubEvents(newExpanded)
  }

  const startEditSubEvent = (subEvent: SubEvent) => {
    setEditingSubEvent(subEvent.id)
    setEditFormData({
      name: subEvent.name,
    })
  }

  const cancelEditSubEvent = () => {
    setEditingSubEvent(null)
    setEditFormData({})
  }

  const saveSubEvent = (subEventId: string) => {
    const updatedSubEvents = subEvents.map((s) =>
      s.id === subEventId
        ? { ...s, ...editFormData }
        : s
    )
    onSubEventsChange(updatedSubEvents)
    setEditingSubEvent(null)
    setEditFormData({})
    toast.success("Sub-event updated successfully")
  }

  const deleteSubEvent = (subEventId: string) => {
    const subEvent = subEvents.find((s) => s.id === subEventId)
    if (!subEvent) return

    // Check if sub-event has sessions
    if (subEvent.sessions.length > 0) {
      toast.error(`Cannot delete sub-event with ${subEvent.sessions.length} session(s). Please remove all sessions first.`)
      return
    }

    const updatedSubEvents = subEvents.filter((s) => s.id !== subEventId)
    onSubEventsChange(updatedSubEvents)
    toast.success("Sub-event deleted successfully")
  }

  const addNewSubEvent = () => {
    const newSubEvent: SubEvent = {
      id: `subevent-${Date.now()}`,
      name: "",
      sessions: [],
    }
    onSubEventsChange([...subEvents, newSubEvent])
    setEditingSubEvent(newSubEvent.id)
    setExpandedSubEvents(new Set([...expandedSubEvents, newSubEvent.id]))
    setEditFormData({
      name: "",
    })
  }

  const startAddSession = (subEventId: string) => {
    setEditingSession(`new-${subEventId}`)
    setSessionFormData({
      id: `session-${Date.now()}`,
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      location: "",
      locationEn: "",
      locationZhHant: "",
      locationZhHans: "",
    })
  }

  const startEditSession = (session: Session) => {
    setEditingSession(session.id)
    setSessionFormData({ ...session })
  }

  const cancelEditSession = () => {
    setEditingSession(null)
    setSessionFormData({})
  }

  const saveSession = (subEventId: string, isNew: boolean) => {
    // Validate required fields
    if (!sessionFormData.date || !sessionFormData.startTime || !sessionFormData.endTime) {
      toast.error("Please fill in all required session fields")
      return
    }

    const updatedSubEvents = subEvents.map((s) => {
      if (s.id === subEventId) {
        if (isNew) {
          return {
            ...s,
            sessions: [...s.sessions, sessionFormData as Session],
          }
        } else {
          return {
            ...s,
            sessions: s.sessions.map((sess) =>
              sess.id === sessionFormData.id ? (sessionFormData as Session) : sess
            ),
          }
        }
      }
      return s
    })

    onSubEventsChange(updatedSubEvents)
    setEditingSession(null)
    setSessionFormData({})
    toast.success(isNew ? "Session added successfully" : "Session updated successfully")
  }

  const deleteSession = (subEventId: string, sessionId: string) => {
    const updatedSubEvents = subEvents.map((s) => {
      if (s.id === subEventId) {
        return {
          ...s,
          sessions: s.sessions.filter((sess) => sess.id !== sessionId),
        }
      }
      return s
    })
    onSubEventsChange(updatedSubEvents)
    toast.success("Session deleted successfully")
  }

  // Session form component
  const SessionForm = ({ 
    session, 
    subEventId, 
    isNew 
  }: { 
    session?: Session
    subEventId: string
    isNew: boolean 
  }) => (
    <div className="space-y-3">
      <div className="text-sm font-semibold mb-2">{isNew ? "New Session" : "Edit Session"}</div>
      <div className="grid grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1 text-xs">
            Date <span className="text-destructive">*</span>
          </Label>
          <DatePicker
            value={sessionFormData.date}
            onChange={(date) =>
              setSessionFormData({ ...sessionFormData, date })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1 text-xs">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <TimePicker
            type="start"
            value={sessionFormData.startTime}
            onChange={(time) =>
              setSessionFormData({ ...sessionFormData, startTime: time })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1 text-xs">
            End Time <span className="text-destructive">*</span>
          </Label>
          <TimePicker
            type="end"
            value={sessionFormData.endTime}
            onChange={(time) =>
              setSessionFormData({ ...sessionFormData, endTime: time })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Specific Location</Label>
          <Input
            value={sessionFormData.location || ""}
            onChange={(e) =>
              setSessionFormData({
                ...sessionFormData,
                location: e.target.value,
              })
            }
            placeholder="Enter specific location"
            className="h-8"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={cancelEditSession}
          className="h-8"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => saveSession(subEventId, isNew)}
          className="h-8"
        >
          {isNew ? "Add Session" : "Save Session"}
        </Button>
      </div>
    </div>
  )

  // Session display component
  const SessionDisplay = ({ 
    session, 
    subEventId 
  }: { 
    session: Session
    subEventId: string 
  }) => (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Date</div>
          <div className="font-medium">{format(session.date, "LLL dd, y")}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Time</div>
          <div className="font-medium">
            {format(session.startTime, "HH:mm")} - {format(session.endTime, "HH:mm")}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-0.5">Specific Location</div>
          <div className="font-medium">{session.location || "-"}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startEditSession(session)}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteSession(subEventId, session.id)}
          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Section 1: Main Event Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Main Event Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Configure sessions for your main event
            </p>
          </div>
          <Button 
            onClick={() => mainEvent && startAddSession(mainEvent.id)} 
            size="sm" 
            className="gap-2"
            disabled={!mainEvent}
          >
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          {!mainEvent || mainEvent.sessions.length === 0 && editingSession !== `new-${mainEvent?.id}` ? (
            <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-md">
              No sessions yet. Click "Add Session" to create one.
            </div>
          ) : (
            <div className="space-y-2">
              {mainEvent.sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-md p-3 bg-background"
                >
                  {editingSession === session.id ? (
                    <SessionForm session={session} subEventId={mainEvent.id} isNew={false} />
                  ) : (
                    <SessionDisplay session={session} subEventId={mainEvent.id} />
                  )}
                </div>
              ))}

              {/* Add new session form for main event */}
              {mainEvent && editingSession === `new-${mainEvent.id}` && (
                <div className="border border-dashed rounded-md p-3 bg-background">
                  <SessionForm subEventId={mainEvent.id} isNew={true} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Sub-events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sub-events and Sub-events Sessions</h3>
            <p className="text-sm text-muted-foreground">
              Add and manage sub-events (workshops, side events, etc.)
            </p>
          </div>
          <Button onClick={addNewSubEvent} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sub-event
          </Button>
        </div>

        {otherSubEvents.length === 0 ? (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No sub-events yet. Click "Add Sub-event" to create one.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="font-semibold">Sub-event Name</TableHead>
                  <TableHead className="font-semibold w-[100px] text-center">Sessions</TableHead>
                  <TableHead className="font-semibold w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherSubEvents.map((subEvent) => (
                  <React.Fragment key={subEvent.id}>
                    <TableRow className="hover:bg-muted/20">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(subEvent.id)}
                          className="h-6 w-6 p-0"
                        >
                          {expandedSubEvents.has(subEvent.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="w-full">
                        {editingSubEvent === subEvent.id ? (
                          <Input
                            value={editFormData.name || ""}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, name: e.target.value })
                            }
                            placeholder="Enter sub-event name"
                            className="h-8 max-w-2xl"
                          />
                        ) : (
                          <span className="font-medium">{subEvent.name || <span className="text-muted-foreground italic">Untitled Sub-event</span>}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {subEvent.sessions.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingSubEvent === subEvent.id ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveSubEvent(subEvent.id)}
                              className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditSubEvent}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditSubEvent(subEvent)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSubEvent(subEvent.id)}
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded sessions for sub-event */}
                    {expandedSubEvents.has(subEvent.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/5 p-0">
                          <div className="p-4 pl-12 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-muted-foreground">Sessions</h4>
                              <Button
                                onClick={() => startAddSession(subEvent.id)}
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Add Session
                              </Button>
                            </div>

                            {subEvent.sessions.length === 0 && editingSession !== `new-${subEvent.id}` ? (
                              <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                                No sessions yet. Click "Add Session" to create one.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {subEvent.sessions.map((session) => (
                                  <div
                                    key={session.id}
                                    className="border rounded-md p-3 bg-background"
                                  >
                                    {editingSession === session.id ? (
                                      <SessionForm session={session} subEventId={subEvent.id} isNew={false} />
                                    ) : (
                                      <SessionDisplay session={session} subEventId={subEvent.id} />
                                    )}
                                  </div>
                                ))}

                                {/* Add new session form for sub-event */}
                                {editingSession === `new-${subEvent.id}` && (
                                  <div className="border border-dashed rounded-md p-3 bg-background">
                                    <SessionForm subEventId={subEvent.id} isNew={true} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}