"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Checkbox } from "../ui/checkbox"
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
import { Badge } from "../ui/badge"
import { InvitationStatusBadge } from "./InvitationStatusBadge"
import { TicketTypeBadge } from "./TicketTypeBadge"
import { type Invitation, mockInvitations } from "../data/invitations"
import {
  Search,
  Upload,
  Send,
  Download,
  Mail,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { cn } from "../ui/utils"
import { format } from "date-fns"

interface InvitationListProps {
  eventId: string
  eventName: string
  onBack: () => void
  onViewGuest: (invitation: Invitation) => void
  onEditEmail?: () => void
}

export function InvitationList({ eventId, eventName, onBack, onViewGuest, onEditEmail }: InvitationListProps) {
  // Filter invitations for this event
  const eventInvitations = React.useMemo(
    () => mockInvitations.filter((inv) => inv.eventId === eventId),
    [eventId]
  )

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [channelFilter, setChannelFilter] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(25)

  // Sorting state
  type SortColumn = "name" | "email" | "status" | "channel" | "lastSent"
  type SortDirection = "asc" | "desc"
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

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
  }

  // Filter invitations
  const filteredInvitations = React.useMemo(() => {
    let result = eventInvitations.filter((inv) => {
      const matchesSearch =
        searchQuery === "" ||
        inv.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.organization || "").toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || inv.invitationStatus === statusFilter

      const matchesChannel = channelFilter === "all" || inv.invitationChannel === channelFilter

      return matchesSearch && matchesStatus && matchesChannel
    })

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let cmp = 0
        switch (sortColumn) {
          case "name": cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`); break
          case "email": cmp = a.email.localeCompare(b.email); break
          case "status": cmp = a.invitationStatus.localeCompare(b.invitationStatus); break
          case "channel": cmp = a.invitationChannel.localeCompare(b.invitationChannel); break
          case "lastSent": cmp = (a.lastSentDate?.getTime() || 0) - (b.lastSentDate?.getTime() || 0); break
        }
        return sortDirection === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [eventInvitations, searchQuery, statusFilter, channelFilter, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredInvitations.length / pageSize)
  const paginatedInvitations = filteredInvitations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // Selection handlers
  const isAllSelected =
    paginatedInvitations.length > 0 && paginatedInvitations.every((inv) => selectedIds.has(inv.id))
  const isSomeSelected =
    paginatedInvitations.some((inv) => selectedIds.has(inv.id)) && !isAllSelected

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedInvitations.map((inv) => inv.id)))
    }
  }

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSendInvitations = () => {
  }

  const handleImportCSV = () => {
  }

  const handleExport = () => {
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not sent"
    return format(date, "dd MMM yyyy, hh:mm a")
  }

  // Empty state
  if (eventInvitations.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-5 w-px bg-border" />
          <div>
            <h2 className="text-lg font-semibold">{eventName}</h2>
            <p className="text-sm text-muted-foreground">Invitation Guest List</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No invitations yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Import a CSV file to get started with sending invitations to your guests
          </p>
          <Button onClick={handleImportCSV} className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="h-5 w-px bg-border" />
        <div>
          <h2 className="text-lg font-semibold">{eventName}</h2>
          <p className="text-sm text-muted-foreground">
            {eventInvitations.length} invitation{eventInvitations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats summary bar */}
      <div className="flex items-center gap-4 flex-wrap text-sm">
        {(
          [
            { label: "Pending", key: "pending", color: "text-gray-600" },
            { label: "Sent", key: "sent", color: "text-blue-600" },
            { label: "Opened", key: "opened", color: "text-teal-600" },
            { label: "Clicked", key: "clicked", color: "text-green-600" },
            { label: "Confirmed", key: "confirmed", color: "text-green-700" },
            { label: "Declined", key: "declined", color: "text-orange-600" },
            { label: "Bounced", key: "bounced", color: "text-red-600" },
          ] as const
        ).map(({ label, key, color }) => {
          const count = eventInvitations.filter((inv) => inv.invitationStatus === key).length
          if (count === 0) return null
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn("font-medium", color)}>{count}</span>
              <span className="text-muted-foreground">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or organization..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="bounced">Bounced</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={channelFilter}
          onValueChange={(value) => {
            setChannelFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handleImportCSV} className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={handleSendInvitations}
            disabled={selectedIds.size === 0}
            className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]"
          >
            <Send className="h-4 w-4" />
            Send {selectedIds.size > 0 && `(${selectedIds.size})`}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          {onEditEmail && (
            <Button
              size="sm"
              onClick={onEditEmail}
              className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]"
            >
              <Mail className="h-4 w-4" />
              Edit Email
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      {filteredInvitations.length !== eventInvitations.length && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredInvitations.length} of {eventInvitations.length} invitations
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={cn(isSomeSelected && "data-[state=checked]:bg-gray-400")}
                />
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:bg-muted/80 transition-colors" onClick={() => handleSort("name")}>
                <div className="flex items-center">Guest Name<SortIcon column="name" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:bg-muted/80 transition-colors" onClick={() => handleSort("email")}>
                <div className="flex items-center">Email<SortIcon column="email" /></div>
              </TableHead>
              <TableHead>Ticket Types</TableHead>
              <TableHead className="cursor-pointer select-none hover:bg-muted/80 transition-colors" onClick={() => handleSort("status")}>
                <div className="flex items-center">Status<SortIcon column="status" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:bg-muted/80 transition-colors" onClick={() => handleSort("channel")}>
                <div className="flex items-center">Channel<SortIcon column="channel" /></div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:bg-muted/80 transition-colors" onClick={() => handleSort("lastSent")}>
                <div className="flex items-center">Last Sent<SortIcon column="lastSent" /></div>
              </TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No invitations match your filters
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                      setChannelFilter("all")
                      setCurrentPage(1)
                    }}
                    className="ml-2"
                  >
                    Clear filters
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvitations.map((invitation) => (
                <TableRow
                  key={invitation.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onViewGuest(invitation)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(invitation.id)}
                      onCheckedChange={() => handleSelectOne(invitation.id)}
                      aria-label={`Select ${invitation.firstName} ${invitation.lastName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {invitation.salutation && `${invitation.salutation} `}
                    {invitation.firstName} {invitation.lastName}
                    {invitation.representativeType && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {invitation.representativeType}
                      </Badge>
                    )}
                    {invitation.organization && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {invitation.organization}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{invitation.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {invitation.ticketTypes.slice(0, 2).map((ticket) => (
                        <TicketTypeBadge
                          key={ticket.id}
                          name={ticket.name}
                          colorHex={ticket.colorHex}
                          className="text-xs"
                        />
                      ))}
                      {invitation.ticketTypes.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{invitation.ticketTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <InvitationStatusBadge status={invitation.invitationStatus} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{invitation.invitationChannel}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(invitation.lastSentDate)}
                    {invitation.sendCount && invitation.sendCount > 1 && (
                      <span className="ml-2 text-xs text-blue-600">
                        ({invitation.sendCount}x)
                      </span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Resend invitation"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View details"
                        onClick={() => onViewGuest(invitation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}