"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Plus, Search, MoreVertical, Copy, Edit, Archive, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { type RegistrationLink, mockRegistrationLinks } from "../data/registration-links"
import { cn } from "../ui/utils"
import { toast } from 'sonner'

type SortColumn = "event" | "ticketType" | "opened" | "registered" | "declined" | "totalAttendees" | "status"
type SortDirection = "asc" | "desc"

function SortIcon({ column, sortColumn, sortDirection }: { column: SortColumn; sortColumn: SortColumn | null; sortDirection: SortDirection }) {
  if (sortColumn !== column) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
  return sortDirection === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
}

interface RegistrationLinkListProps {
  onCreateLink: () => void
  onEditLink: (link: RegistrationLink) => void
}

export function RegistrationLinkList({ onCreateLink, onEditLink }: RegistrationLinkListProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [links, setLinks] = React.useState<RegistrationLink[]>(mockRegistrationLinks)
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

  const filteredLinks = React.useMemo(() => {
    let result = links
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (link) =>
          link.eventName.toLowerCase().includes(query) ||
          link.ticketTypeName.toLowerCase().includes(query) ||
          link.linkUrl.toLowerCase().includes(query)
      )
    }

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let cmp = 0
        switch (sortColumn) {
          case "event": cmp = a.eventName.localeCompare(b.eventName); break
          case "ticketType": cmp = a.ticketTypeName.localeCompare(b.ticketTypeName); break
          case "opened": cmp = a.stats.opened - b.stats.opened; break
          case "registered": cmp = a.stats.registered - b.stats.registered; break
          case "declined": cmp = a.stats.declined - b.stats.declined; break
          case "totalAttendees": cmp = a.stats.totalAttendees - b.stats.totalAttendees; break
          case "status": cmp = a.status.localeCompare(b.status); break
        }
        return sortDirection === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [links, searchQuery, sortColumn, sortDirection])

  const handleCopyLink = (linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl)
    toast.success("Link copied to clipboard!")
  }

  const getStatusBadge = (status: RegistrationLink['status']) => {
    const variants: Record<RegistrationLink['status'], { label: string; className: string }> = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
      active: { label: "Active", className: "bg-green-100 text-green-700" },
      expired: { label: "Expired", className: "bg-red-100 text-red-700" },
      archived: { label: "Archived", className: "bg-gray-100 text-gray-500" },
    }
    
    const variant = variants[status]
    return (
      <Badge variant="outline" className={cn("font-medium", variant.className)}>
        {variant.label}
      </Badge>
    )
  }

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
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registration links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreateLink} className="bg-[#107DAC] hover:bg-[#0d6390]">
          <Plus className="h-4 w-4 mr-2" />
          Create Registration Link
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="event">Event</SortableHeader>
              <SortableHeader column="ticketType">Ticket Type</SortableHeader>
              <TableHead>Sessions</TableHead>
              <SortableHeader column="opened" className="text-center">Opened</SortableHeader>
              <SortableHeader column="registered" className="text-center">Registered</SortableHeader>
              <SortableHeader column="declined" className="text-center">Declined</SortableHeader>
              <SortableHeader column="totalAttendees" className="text-center">Total Attendees</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  {searchQuery ? "No registration links found" : "No registration links yet"}
                </TableCell>
              </TableRow>
            ) : (
              filteredLinks.map((link) => (
                <TableRow key={link.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">{link.eventName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: link.ticketTypeColor }}
                      />
                      <span>{link.ticketTypeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {link.sessionNames.length === 0 ? (
                        <span className="text-muted-foreground">All sessions</span>
                      ) : (
                        <>
                          <div>{link.sessionNames[0]}</div>
                          {link.sessionNames.length > 1 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              +{link.sessionNames.length - 1} more
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {link.stats.opened}
                  </TableCell>
                  <TableCell className="text-center font-medium text-green-600">
                    {link.stats.registered}
                  </TableCell>
                  <TableCell className="text-center font-medium text-red-600">
                    {link.stats.declined}
                  </TableCell>
                  <TableCell className="text-center font-medium text-[#107DAC]">
                    {link.stats.totalAttendees}
                  </TableCell>
                  <TableCell>{getStatusBadge(link.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditLink(link)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(link.linkUrl)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(link.linkUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {filteredLinks.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredLinks.length} registration link{filteredLinks.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
