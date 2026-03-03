"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Alert, AlertDescription } from "../ui/alert"
import { 
  type Session, 
  type AccessType,
  accessTypeBadgeColors 
} from "../data/b2b-events"
import { cn } from "../ui/utils"
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import { format } from "date-fns"

interface SessionsListProps {
  eventId: string
  eventQuota: number
  eventStartDate: Date
  eventEndDate: Date
  onAddSession: () => void
  onEditSession: (session: Session) => void
  onDeleteSession: (session: Session) => void
  onAddSubEvent: (parentSession: Session) => void
}

export function SessionsList({
  eventId,
  eventQuota,
  eventStartDate,
  eventEndDate,
  onAddSession,
  onEditSession,
  onDeleteSession,
  onAddSubEvent
}: SessionsListProps) {
  // Mock sessions - in real app, fetch by eventId
  const [sessions, setSessions] = React.useState<Session[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading sessions
    const timer = setTimeout(() => {
      // In real app: fetch sessions by eventId from API
      // For now, use empty array to show empty state
      setSessions([])
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [eventId])

  // Group sessions by date and sort
  const groupedSessions = React.useMemo(() => {
    const groups = new Map<string, { date: Date; sessions: Session[] }>()
    
    // Filter top-level sessions and group by date
    const topLevelSessions = sessions.filter(s => s.depth === 0 && s.isActive)
    
    topLevelSessions.forEach(session => {
      const dateKey = format(session.sessionDate, "yyyy-MM-dd")
      if (!groups.has(dateKey)) {
        groups.set(dateKey, { date: session.sessionDate, sessions: [] })
      }
      groups.get(dateKey)!.sessions.push(session)
    })
    
    // Sort sessions within each group by startTime
    groups.forEach(group => {
      group.sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    })
    
    // Convert to array and sort by date
    return Array.from(groups.values()).sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    )
  }, [sessions])

  // Get sub-events for a parent session
  const getSubEvents = (parentId: string): Session[] => {
    return sessions
      .filter(s => s.parentSessionId === parentId && s.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  // Calculate total capacity
  const totalCapacity = React.useMemo(() => {
    return sessions
      .filter(s => s.isActive && s.depth === 0)
      .reduce((sum, s) => sum + s.capacity, 0)
  }, [sessions])

  const showCapacityWarning = totalCapacity > eventQuota

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4" />
              <div className="space-y-3">
                <div className="h-16 bg-muted animate-pulse rounded" />
                <div className="h-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (sessions.length === 0 || groupedSessions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sessions</h2>
            <p className="text-sm text-muted-foreground">
              Build your event agenda by adding sessions
            </p>
          </div>
          <Button onClick={onAddSession} className="gap-2">
            <Plus className="size-4" />
            Add Session
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Calendar className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No sessions yet</h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
            Add your first session to start building the agenda. Sessions help organize your event by date and time.
          </p>
          <Button onClick={onAddSession} size="lg" className="gap-2">
            <Plus className="size-4" />
            Add Session
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sessions</h2>
          <p className="text-sm text-muted-foreground">
            {sessions.filter(s => s.depth === 0 && s.isActive).length} session{sessions.filter(s => s.depth === 0 && s.isActive).length !== 1 ? 's' : ''} across {groupedSessions.length} day{groupedSessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onAddSession} className="gap-2">
          <Plus className="size-4" />
          Add Session
        </Button>
      </div>

      {/* Capacity Warning */}
      {showCapacityWarning && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Total session capacity ({totalCapacity}) exceeds event quota ({eventQuota}). 
            This won't block saving, but you may want to review.
          </AlertDescription>
        </Alert>
      )}

      {/* Sessions grouped by date */}
      <div className="space-y-6">
        {groupedSessions.map(({ date, sessions: dateSessions }) => (
          <div key={format(date, "yyyy-MM-dd")} className="space-y-3">
            {/* Sticky Date Header */}
            <div className="sticky top-0 z-10 bg-background py-2 border-b">
              <h3 className="font-medium text-base">
                {format(date, "dd MMM yyyy")}
              </h3>
            </div>

            {/* Session Cards */}
            <div className="space-y-2">
              {dateSessions.map(session => (
                <div key={session.id}>
                  {/* Main Session Card */}
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Main Content */}
                      <div className="flex-1 space-y-3">
                        {/* Session Name and Badges */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-base mb-2">
                              {session.name.en}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "gap-1",
                                  accessTypeBadgeColors[session.accessType].bg,
                                  accessTypeBadgeColors[session.accessType].text,
                                  accessTypeBadgeColors[session.accessType].border
                                )}
                              >
                                {session.accessType}
                              </Badge>
                              {getSubEvents(session.id).length > 0 && (
                                <Badge variant="outline" className="gap-1">
                                  <Sparkles className="size-3" />
                                  {getSubEvents(session.id).length} sub-event{getSubEvents(session.id).length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Kebab Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditSession(session)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onAddSubEvent(session)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Sub-event
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onDeleteSession(session)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Session Details */}
                        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4" />
                            <span>
                              {format(session.startTime, "HH:mm")} – {format(session.endTime, "HH:mm")}
                            </span>
                          </div>
                          {session.venueRoom && (
                            <div className="flex items-center gap-2">
                              <MapPin className="size-4" />
                              <span>{session.venueRoom}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>
                              {session.admittedCount} / {session.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-event Cards (Nested) */}
                  {getSubEvents(session.id).map(subEvent => (
                    <div
                      key={subEvent.id}
                      className="ml-8 mt-2 border-l-2 border-primary/20"
                    >
                      <div className="pl-6 pr-4 py-3 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Sub-event Image Thumbnail */}
                          {subEvent.imageUrl && (
                            <img
                              src={subEvent.imageUrl}
                              alt={subEvent.name.en}
                              className="w-16 h-16 rounded object-cover"
                            />
                          )}

                          {/* Main Content */}
                          <div className="flex-1 space-y-2">
                            {/* Sub-event Name and Fee */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm mb-1">
                                  {subEvent.name.en}
                                </h5>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "gap-1 text-xs",
                                      accessTypeBadgeColors[subEvent.accessType].bg,
                                      accessTypeBadgeColors[subEvent.accessType].text,
                                      accessTypeBadgeColors[subEvent.accessType].border
                                    )}
                                  >
                                    {subEvent.accessType}
                                  </Badge>
                                  {subEvent.additionalFee && subEvent.additionalFee > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      HKD {subEvent.additionalFee.toFixed(2)}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Kebab Menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEditSession(subEvent)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => onDeleteSession(subEvent)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Sub-event Details */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="size-3" />
                                <span>
                                  {format(subEvent.startTime, "HH:mm")} – {format(subEvent.endTime, "HH:mm")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="size-3" />
                                <span>
                                  {subEvent.admittedCount} / {subEvent.capacity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
