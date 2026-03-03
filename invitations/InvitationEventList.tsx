"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Search, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  type InvitationEventSummary,
  getInvitationEventSummaries,
} from "../data/invitations"
import { cn } from "../ui/utils"
import { format } from "date-fns"

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Draft: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-muted-foreground/20",
  },
  Published: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Live: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  Closed: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  },
}

type SortColumn = "name" | "status" | "dates" | "venue" | "total" | "confirmed" | "pending" | "responseRate"
type SortDirection = "asc" | "desc"

function SortIcon({ column, sortColumn, sortDirection }: { column: SortColumn; sortColumn: SortColumn | null; sortDirection: SortDirection }) {
  if (sortColumn !== column) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
  return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
}

interface InvitationEventListProps {
  onSelectEvent: (summary: InvitationEventSummary) => void
}

export function InvitationEventList({ onSelectEvent }: InvitationEventListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [sortColumn, setSortColumn] = React.useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc")
      else { setSortColumn(null); setSortDirection("asc") }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const summaries = React.useMemo(() => getInvitationEventSummaries(), [])

  const filteredAndSortedSummaries = React.useMemo(() => {
    let result = summaries.filter((s) => {
      const matchSearch =
        searchQuery === "" ||
        s.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.eventVenue.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === "all" || s.eventStatus === statusFilter
      return matchSearch && matchStatus
    })

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let cmp = 0
        const getResponseRate = (s: InvitationEventSummary) =>
          s.totalInvitations > 0 ? (s.confirmed + s.declined) / s.totalInvitations : 0

        switch (sortColumn) {
          case "name": cmp = a.eventName.localeCompare(b.eventName); break
          case "status": cmp = a.eventStatus.localeCompare(b.eventStatus); break
          case "dates": cmp = a.eventStartDate.getTime() - b.eventStartDate.getTime(); break
          case "venue": cmp = a.eventVenue.localeCompare(b.eventVenue); break
          case "total": cmp = a.totalInvitations - b.totalInvitations; break
          case "confirmed": cmp = a.confirmed - b.confirmed; break
          case "pending": cmp = (a.pending + a.sent) - (b.pending + b.sent); break
          case "responseRate": cmp = getResponseRate(a) - getResponseRate(b); break
        }
        return sortDirection === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [summaries, searchQuery, statusFilter, sortColumn, sortDirection])

  const SortableHeader = ({ column, children, className }: { column: SortColumn; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={cn("cursor-pointer select-none hover:bg-muted/50 transition-colors", className)}
      onClick={() => handleSort(column)}
    >
      <div className={cn("flex items-center gap-0.5", className?.includes("text-center") && "justify-center")}>
        {children}
        <SortIcon column={column} sortColumn={sortColumn} sortDirection={sortDirection} />
      </div>
    </TableHead>
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Select an Event</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose an event to manage its invitations
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status">
              {statusFilter === "all" ? (
                "All Status"
              ) : (
                <Badge
                  variant="outline"
                  className={cn(
                    "pointer-events-none",
                    statusColors[statusFilter]?.bg,
                    statusColors[statusFilter]?.text,
                    statusColors[statusFilter]?.border
                  )}
                >
                  {statusFilter}
                </Badge>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(["Draft", "Published", "Live", "Closed"] as const).map((s) => (
              <SelectItem key={s} value={s}>
                <Badge
                  variant="outline"
                  className={cn(
                    statusColors[s].bg,
                    statusColors[s].text,
                    statusColors[s].border
                  )}
                >
                  {s}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name" className="w-[260px]">Event Name</SortableHeader>
              <SortableHeader column="status" className="text-center">Status</SortableHeader>
              <SortableHeader column="dates" className="text-center">Dates</SortableHeader>
              <SortableHeader column="venue" className="text-center">Venue</SortableHeader>
              <SortableHeader column="total" className="text-center">Total</SortableHeader>
              <SortableHeader column="confirmed" className="text-center">Confirmed</SortableHeader>
              <SortableHeader column="pending" className="text-center">Pending</SortableHeader>
              <SortableHeader column="responseRate" className="text-center">Response Rate</SortableHeader>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedSummaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "No events match your filters"
                    : "No events with invitations yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedSummaries.map((summary) => {
                const responded = summary.confirmed + summary.declined
                const responseRate =
                  summary.totalInvitations > 0
                    ? Math.round((responded / summary.totalInvitations) * 100)
                    : 0

                return (
                  <TableRow
                    key={summary.eventId}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelectEvent(summary)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{summary.eventName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {summary.eventCategory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          statusColors[summary.eventStatus]?.bg,
                          statusColors[summary.eventStatus]?.text,
                          statusColors[summary.eventStatus]?.border
                        )}
                      >
                        {summary.eventStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm whitespace-nowrap">
                        {format(summary.eventStartDate, "d MMM")} –{" "}
                        {format(summary.eventEndDate, "d MMM yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm truncate max-w-[160px] mx-auto" title={summary.eventVenue}>
                        {summary.eventVenue}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {summary.totalInvitations}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-green-600">{summary.confirmed}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-amber-600">
                        {summary.pending + summary.sent}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1.5 min-w-[80px]">
                        <div className="text-sm font-medium">{responseRate}%</div>
                        <Progress value={responseRate} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {filteredAndSortedSummaries.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedSummaries.length} event{filteredAndSortedSummaries.length !== 1 ? "s" : ""} with invitations
        </div>
      )}
    </div>
  )
}
