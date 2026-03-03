"use client"

import * as React from "react"
import { 
  PlusIcon, 
  SearchIcon, 
  MoreVertical, 
  Edit, 
  Copy, 
  XCircle, 
  Eye, 
  Trash2,
  AlertTriangle 
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "../ui/badge"
import { 
  mockEvents, 
  type B2BEvent, 
  type EventStatus, 
  type EventCategory,
  statusColors 
} from "../data/b2b-events"
import { format } from "date-fns"
import { cn } from "../ui/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Progress } from "../ui/progress"
import { Skeleton } from "../ui/skeleton"
import { toast } from "sonner@2.0.3"

interface EventsListProps {
  onCreateEvent?: () => void
  onEventClick?: (event: B2BEvent) => void
}

export function EventsList({ onCreateEvent, onEventClick }: EventsListProps) {
  const [events, setEvents] = React.useState<B2BEvent[]>(mockEvents)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(20)
  const [isLoading, setIsLoading] = React.useState(false)
  const [eventToClose, setEventToClose] = React.useState<B2BEvent | null>(null)
  const [isClosing, setIsClosing] = React.useState(false)

  // Simulate initial load
  React.useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.name.en.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || event.status === statusFilter
      const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [events, searchQuery, statusFilter, categoryFilter])

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const categories: EventCategory[] = [
    "Conference",
    "Exhibition",
    "Festival",
    "Gala",
    "Workshop",
    "Seminar",
    "Networking",
    "Ceremony",
    "Corporate"
  ]

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, categoryFilter, searchQuery])

  // Handle close event
  const handleCloseEvent = async () => {
    if (!eventToClose) return
    
    setIsClosing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update event status
    setEvents(prev => prev.map(e => 
      e.id === eventToClose.id 
        ? { ...e, status: "Closed" as EventStatus } 
        : e
    ))
    
    setIsClosing(false)
    setEventToClose(null)
    toast.success(`"${eventToClose.name.en}" has been closed`)
  }

  // Get quick actions based on event status
  const getQuickActions = (event: B2BEvent) => {
    const actions: Array<{
      label: string
      icon: React.ElementType
      onClick: () => void
      variant?: "default" | "destructive"
    }> = []

    switch (event.status) {
      case "Draft":
        actions.push(
          { 
            label: "Edit", 
            icon: Edit, 
            onClick: () => onEventClick?.(event) 
          },
          { 
            label: "Delete", 
            icon: Trash2, 
            onClick: () => toast.info("Delete functionality coming soon"),
            variant: "destructive"
          }
        )
        break
      case "Published":
        actions.push(
          { 
            label: "Edit", 
            icon: Edit, 
            onClick: () => onEventClick?.(event) 
          },
          { 
            label: "Copy Link", 
            icon: Copy, 
            onClick: () => {
              navigator.clipboard.writeText(`https://lepos.com/events/${event.id}`)
              toast.success("Registration link copied to clipboard")
            }
          },
          { 
            label: "Close Event", 
            icon: XCircle, 
            onClick: () => setEventToClose(event),
            variant: "destructive"
          }
        )
        break
      case "Live":
        actions.push(
          { 
            label: "Edit", 
            icon: Edit, 
            onClick: () => onEventClick?.(event) 
          },
          { 
            label: "Copy Link", 
            icon: Copy, 
            onClick: () => {
              navigator.clipboard.writeText(`https://lepos.com/events/${event.id}`)
              toast.success("Registration link copied to clipboard")
            }
          },
          { 
            label: "Close Event", 
            icon: XCircle, 
            onClick: () => setEventToClose(event),
            variant: "destructive"
          }
        )
        break
      case "Closed":
        actions.push(
          { 
            label: "View Only", 
            icon: Eye, 
            onClick: () => onEventClick?.(event) 
          }
        )
        break
    }

    return actions
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1136px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">List of Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your event portfolio
          </p>
        </div>
        <Button onClick={onCreateEvent} className="gap-2 ml-auto">
          <PlusIcon className="size-4" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status">
              {statusFilter === "all" ? (
                "All Status"
              ) : (
                <Badge
                  variant="outline"
                  className={cn(
                    "pointer-events-none",
                    statusColors[statusFilter as EventStatus]?.bg,
                    statusColors[statusFilter as EventStatus]?.text,
                    statusColors[statusFilter as EventStatus]?.border
                  )}
                >
                  {statusFilter}
                </Badge>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Draft">
              <Badge
                variant="outline"
                className={cn(
                  statusColors["Draft"].bg,
                  statusColors["Draft"].text,
                  statusColors["Draft"].border
                )}
              >
                Draft
              </Badge>
            </SelectItem>
            <SelectItem value="Published">
              <Badge
                variant="outline"
                className={cn(
                  statusColors["Published"].bg,
                  statusColors["Published"].text,
                  statusColors["Published"].border
                )}
              >
                Published
              </Badge>
            </SelectItem>
            <SelectItem value="Live">
              <Badge
                variant="outline"
                className={cn(
                  statusColors["Live"].bg,
                  statusColors["Live"].text,
                  statusColors["Live"].border
                )}
              >
                Live
              </Badge>
            </SelectItem>
            <SelectItem value="Closed">
              <Badge
                variant="outline"
                className={cn(
                  statusColors["Closed"].bg,
                  statusColors["Closed"].text,
                  statusColors["Closed"].border
                )}
              >
                Closed
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category">
              {categoryFilter === "all" ? (
                "All Categories"
              ) : (
                <Badge variant="outline" className="bg-muted/30 pointer-events-none">
                  {categoryFilter}
                </Badge>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <Badge variant="outline" className="bg-muted/30">
                  {cat}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Event Name</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Dates</TableHead>
              <TableHead className="text-center">Venue</TableHead>
              <TableHead className="text-center">Sessions</TableHead>
              <TableHead className="text-center">Registered</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                </TableRow>
              ))
            ) : paginatedEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    {events.length === 0 ? (
                      // No events at all
                      <>
                        <p className="text-sm font-medium">No events yet</p>
                        <p className="text-xs mb-2">Create your first event to get started</p>
                        <Button onClick={onCreateEvent} size="sm" className="gap-2">
                          <PlusIcon className="size-3" />
                          Create your first event
                        </Button>
                      </>
                    ) : (
                      // Filtered empty
                      <>
                        <p className="text-sm">No events match your filters</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("")
                            setStatusFilter("all")
                            setCategoryFilter("all")
                          }}
                        >
                          Clear filters
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedEvents.map((event) => {
                const registrationPercentage = (event.totalRegistered / event.quota) * 100
                const showProgress = event.status === "Published" || event.status === "Live"
                
                return (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer"
                    onClick={() => onEventClick?.(event)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{event.name.en}</div>
                        {event.type && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {event.type}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          statusColors[event.status].bg,
                          statusColors[event.status].text,
                          statusColors[event.status].border
                        )}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/30">
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm whitespace-nowrap">
                        {format(event.startDateTime, "d MMM")} –{" "}
                        {format(event.endDateTime, "d MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate max-w-[180px]" title={event.venue.en}>
                        {event.venue.en}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-sm font-medium">{event.sessionCount}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {event.status === "Draft" ? (
                        <span className="text-sm text-muted-foreground">—</span>
                      ) : (
                        <div className="space-y-1.5 min-w-[100px]">
                          <div className="text-sm">
                            <span className="font-medium">{event.totalRegistered}</span>
                            <span className="text-muted-foreground"> / {event.quota}</span>
                          </div>
                          {showProgress && (
                            <Progress 
                              value={registrationPercentage} 
                              className="h-1.5"
                            />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {getQuickActions(event).map((action, index) => (
                            <React.Fragment key={action.label}>
                              {index > 0 && action.variant === "destructive" && (
                                <DropdownMenuSeparator />
                              )}
                              <DropdownMenuItem
                                onClick={action.onClick}
                                className={cn(
                                  action.variant === "destructive" && "text-destructive focus:text-destructive"
                                )}
                              >
                                <action.icon className="mr-2 h-4 w-4" />
                                {action.label}
                              </DropdownMenuItem>
                            </React.Fragment>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && filteredEvents.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page:</span>
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground ml-4">
              {((currentPage - 1) * itemsPerPage) + 1}–
              {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of{" "}
              {filteredEvents.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="min-w-[36px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Close Event Confirmation Dialog */}
      <Dialog open={!!eventToClose} onOpenChange={() => setEventToClose(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>Close Event</DialogTitle>
            </div>
            <DialogDescription className="pt-4">
              Are you sure you want to close{" "}
              <span className="font-semibold text-foreground">
                "{eventToClose?.name.en}"
              </span>
              ?<br /><br />
              This action will prevent new registrations and mark the event as closed. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEventToClose(null)}
              disabled={isClosing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCloseEvent}
              disabled={isClosing}
            >
              {isClosing ? "Closing..." : "Close Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}