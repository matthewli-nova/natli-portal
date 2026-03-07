"use client"

import * as React from "react"
import { Plus, Edit2, Trash2, Save, X, Star, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { ColourPicker } from "../ui/colour-picker"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { cn } from "../ui/utils"
import { toast } from 'sonner'

export interface StaffTicket {
  id: string
  nameEn: string
  nameZhHant?: string
  nameZhHans?: string
  descriptionEn?: string
  descriptionZhHant?: string
  descriptionZhHans?: string
  colorHex: string
  accessScope: "custom" | "all_sessions"
  quota: number
  registeredCount: number
  maxBringAlongDefault: number
  companionRegistrationType?: "free_entry" | "registered_ticket"
}

interface StaffTicketsTableProps {
  staffTickets: StaffTicket[]
  onStaffTicketsChange: (staffTickets: StaffTicket[]) => void
  isPublished?: boolean
}

export function StaffTicketsTable({ 
  staffTickets, 
  onStaffTicketsChange,
  isPublished = false 
}: StaffTicketsTableProps) {
  const [editingTicket, setEditingTicket] = React.useState<string | null>(null)
  const [editFormData, setEditFormData] = React.useState<Partial<StaffTicket>>({})
  const [expandedAdvanced, setExpandedAdvanced] = React.useState<Set<string>>(new Set())
  const [nameLang, setNameLang] = React.useState("en")
  const [descLang, setDescLang] = React.useState("en")

  const getTicketName = (ticket: StaffTicket) => {
    return ticket.nameEn || "Untitled Ticket"
  }

  const startEditTicket = (ticket: StaffTicket) => {
    setEditingTicket(ticket.id)
    setEditFormData({ ...ticket })
    setNameLang("en")
    setDescLang("en")
  }

  const startAddTicket = () => {
    const newTicket: StaffTicket = {
      id: `staff-ticket-${Date.now()}`,
      nameEn: "",
      colorHex: "#107DAC",
      accessScope: "all_sessions",
      quota: 0,
      registeredCount: 0,
      maxBringAlongDefault: 0,
    }
    onStaffTicketsChange([...staffTickets, newTicket])
    setEditingTicket(newTicket.id)
    setEditFormData({ ...newTicket })
    setNameLang("en")
    setDescLang("en")
  }

  const cancelEdit = () => {
    // If this is a new ticket with no name, remove it
    const ticket = staffTickets.find(t => t.id === editingTicket)
    if (ticket && !ticket.nameEn && ticket.registeredCount === 0) {
      onStaffTicketsChange(staffTickets.filter(t => t.id !== editingTicket))
    }
    setEditingTicket(null)
    setEditFormData({})
    setExpandedAdvanced(new Set())
  }

  const saveTicket = () => {
    // Validate required fields
    if (!editFormData.nameEn?.trim()) {
      toast.error("Staff ticket name (English) is required")
      return
    }

    if (!editFormData.colorHex) {
      toast.error("Color is required")
      return
    }

    // Quota is optional, but if provided must be >= 0
    if (editFormData.quota !== undefined && editFormData.quota !== null && editFormData.quota < 0) {
      toast.error("Quota cannot be negative")
      return
    }

    // Validate quota cannot be reduced below registered count
    if (isPublished && editFormData.quota! < editFormData.registeredCount!) {
      toast.error(`Quota cannot be less than ${editFormData.registeredCount} (current registrations)`)
      return
    }

    const updatedTickets = staffTickets.map(t => 
      t.id === editingTicket ? editFormData as StaffTicket : t
    )
    onStaffTicketsChange(updatedTickets)
    setEditingTicket(null)
    setEditFormData({})
    setExpandedAdvanced(new Set())
    toast.success("Staff ticket type saved successfully")
  }

  const deleteTicket = (ticketId: string) => {
    const ticket = staffTickets.find(t => t.id === ticketId)
    if (!ticket) return

    // Check if has registrations
    if (ticket.registeredCount > 0) {
      toast.error(`Cannot delete — ${ticket.registeredCount} registrations use this staff ticket type.`)
      return
    }

    onStaffTicketsChange(staffTickets.filter(t => t.id !== ticketId))
    toast.success("Staff ticket type deleted successfully")
  }

  const toggleAdvanced = (ticketId: string) => {
    const newExpanded = new Set(expandedAdvanced)
    if (newExpanded.has(ticketId)) {
      newExpanded.delete(ticketId)
    } else {
      newExpanded.add(ticketId)
    }
    setExpandedAdvanced(newExpanded)
  }

  const renderColorSwatch = (color: string, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-6 w-6"
    return (
      <div 
        className={cn("rounded-full border-2 border-border shrink-0", sizeClass)}
        style={{ backgroundColor: color }}
      />
    )
  }

  const renderTicketRow = (ticket: StaffTicket, isEditing: boolean) => {
    if (isEditing) {
      return (
        <>
          <TableRow className="bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500">
            <TableCell colSpan={4} className="p-0">
              <div className="p-4 space-y-4">
                <div className="text-sm font-semibold mb-3">
                  {ticket.nameEn ? "Edit Staff Ticket Type" : "New Staff Ticket Type"}
                </div>

                {/* Ticket Name & Colour Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Ticket Name */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      Ticket Name <span className="text-destructive">*</span>
                    </Label>
                    <Tabs value={nameLang} onValueChange={setNameLang}>
                      <TabsList className="h-8 bg-muted/50 p-0.5">
                        <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                        <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                        <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en" className="mt-2">
                        <Input
                          value={editFormData.nameEn || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, nameEn: e.target.value })}
                          placeholder="Enter staff ticket name in English"
                          maxLength={100}
                          className="h-9"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {editFormData.nameEn?.length || 0} / 100
                        </div>
                      </TabsContent>
                      <TabsContent value="tc" className="mt-2">
                        <Input
                          value={editFormData.nameZhHant || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, nameZhHant: e.target.value })}
                          placeholder="輸入繁體中文票券名稱（選填）"
                          maxLength={100}
                          className="h-9"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {editFormData.nameZhHant?.length || 0} / 100
                        </div>
                      </TabsContent>
                      <TabsContent value="sc" className="mt-2">
                        <Input
                          value={editFormData.nameZhHans || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, nameZhHans: e.target.value })}
                          placeholder="输入简体中文票券名称（选填）"
                          maxLength={100}
                          className="h-9"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {editFormData.nameZhHans?.length || 0} / 100
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Colour */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 text-xs">
                      Colour <span className="text-destructive">*</span>
                    </Label>
                    <ColourPicker
                      value={editFormData.colorHex || "#107DAC"}
                      onChange={(color) => setEditFormData({ ...editFormData, colorHex: color })}
                    />
                    <div className="text-xs text-muted-foreground">For badge printing</div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-xs">Description</Label>
                  <Tabs value={descLang} onValueChange={setDescLang}>
                    <TabsList className="h-8 bg-muted/50 p-0.5">
                      <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                      <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                      <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="mt-2">
                      <Textarea
                        value={editFormData.descriptionEn || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, descriptionEn: e.target.value })}
                        placeholder="Access privilege description"
                        maxLength={200}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {editFormData.descriptionEn?.length || 0} / 200
                      </div>
                    </TabsContent>
                    <TabsContent value="tc" className="mt-2">
                      <Textarea
                        value={editFormData.descriptionZhHant || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, descriptionZhHant: e.target.value })}
                        placeholder="輸入權限描述（選填）"
                        maxLength={200}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {editFormData.descriptionZhHant?.length || 0} / 200
                      </div>
                    </TabsContent>
                    <TabsContent value="sc" className="mt-2">
                      <Textarea
                        value={editFormData.descriptionZhHans || ""}
                        onChange={(e) => setEditFormData({ ...editFormData, descriptionZhHans: e.target.value })}
                        placeholder="输入权限描述（选填）"
                        maxLength={200}
                        rows={2}
                        className="resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {editFormData.descriptionZhHans?.length || 0} / 200
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Quota */}
                <div className="space-y-2">
                  <Label className="text-xs">
                    Quota (Optional)
                  </Label>
                  <Input
                    type="number"
                    min={editFormData.registeredCount || 0}
                    value={editFormData.quota ?? ""}
                    onChange={(e) => setEditFormData({ ...editFormData, quota: parseInt(e.target.value) || 0 })}
                    placeholder="Enter quota (0 or leave empty)"
                    className="h-9 max-w-xs"
                  />
                  {isPublished && editFormData.registeredCount! > 0 && (
                    <div className="text-xs text-orange-600">
                      Cannot be less than {editFormData.registeredCount} (current registrations)
                    </div>
                  )}
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-3">
                  <button
                    type="button"
                    onClick={() => toggleAdvanced(ticket.id)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {expandedAdvanced.has(ticket.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Advanced Settings
                  </button>
                  
                  {expandedAdvanced.has(ticket.id) && (
                    <div className="mt-3 space-y-4 pl-6">
                      {/* Max Bring-Along Default & Companion Registration Type */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Max Bring-Along Default</Label>
                          <Input
                            type="number"
                            min={0}
                            max={99}
                            value={editFormData.maxBringAlongDefault ?? 0}
                            onChange={(e) => {
                              const val = Math.min(99, Math.max(0, parseInt(e.target.value) || 0))
                              setEditFormData({ ...editFormData, maxBringAlongDefault: val })
                            }}
                            placeholder="0"
                            className="h-9"
                          />
                          <div className="text-xs text-muted-foreground">
                            Maximum companion registrations per primary registrant (0-99). 0 for no companions.
                          </div>
                        </div>

                        {/* Companion Registration Type - only shows when companions > 0 */}
                        {(editFormData.maxBringAlongDefault ?? 0) > 0 && (
                          <div className="space-y-2">
                            <Label className="text-xs">Companion Registration Type</Label>
                            <Select
                              value={editFormData.companionRegistrationType || "free_entry"}
                              onValueChange={(value: "free_entry" | "registered_ticket") => 
                                setEditFormData({ ...editFormData, companionRegistrationType: value })
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free_entry">
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">Free Entry</span>
                                    <span className="text-xs text-muted-foreground">Companions can enter freely without registration</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="registered_ticket">
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium">Individual Registration Required</span>
                                    <span className="text-xs text-muted-foreground">Each companion needs to register and will receive individual tickets</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="text-xs text-muted-foreground">
                              {editFormData.companionRegistrationType === "registered_ticket" 
                                ? "Individual tickets will be processed in Module [Companion Registration]" 
                                : "Companions will not receive individual tickets"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEdit}
                    className="h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveTicket}
                    className="h-9 gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Staff Ticket Type
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </>
      )
    }

    // Display mode
    return (
      <TableRow 
        className="hover:bg-muted/20"
        style={{ borderLeft: `4px solid ${ticket.colorHex}` }}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            {renderColorSwatch(ticket.colorHex, "md")}
            <div className="flex flex-col gap-1">
              <div className="font-medium">{getTicketName(ticket)}</div>
              {ticket.descriptionEn && (
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {ticket.descriptionEn}
                </div>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col gap-0.5">
            <div className="font-mono text-sm">
              {ticket.registeredCount} / {ticket.quota}
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  ticket.registeredCount / ticket.quota >= 0.9 ? "bg-orange-500" :
                  ticket.registeredCount / ticket.quota >= 0.7 ? "bg-amber-500" :
                  "bg-green-500"
                )}
                style={{ width: `${Math.min((ticket.registeredCount / ticket.quota) * 100, 100)}%` }}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center text-sm text-muted-foreground">
          {ticket.maxBringAlongDefault === 0 ? "—" : ticket.maxBringAlongDefault}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditTicket(ticket)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTicket(ticket.id)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={ticket.registeredCount > 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Organizer / Staff Tickets</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ticket types for event organizers, staff, and operators
          </p>
        </div>
        <Button 
          onClick={startAddTicket}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Staff Ticket Type
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold w-[120px] text-center">Registered</TableHead>
              <TableHead className="font-semibold w-[100px] text-center">Companions</TableHead>
              <TableHead className="font-semibold w-[90px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffTickets.length === 0 && !editingTicket ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No staff ticket types yet. Click "Add Staff Ticket Type" to create one.
                </TableCell>
              </TableRow>
            ) : (
              staffTickets.map((ticket) => (
                <React.Fragment key={ticket.id}>
                  {renderTicketRow(ticket, editingTicket === ticket.id)}
                </React.Fragment>
              ))
            )}
            {editingTicket && !staffTickets.find(t => t.id === editingTicket) && 
             renderTicketRow(editFormData as StaffTicket, true)}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}