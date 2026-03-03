"use client"

import * as React from "react"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Plus, X } from "lucide-react"
import { cn } from "../ui/utils"
import { toast } from "sonner@2.0.3"
import { type TicketType } from "./TicketTypesTable"
import { type StaffTicket } from "./StaffTicketsTable"

interface AccessArea {
  id: string
  name: string
  code: string
  isDefault: boolean
}

interface AccessPermission {
  ticketTypeId: string
  areaId: string
}

interface AccessAreaMatrixProps {
  ticketTypes: TicketType[]
  staffTickets: StaffTicket[]
  onPermissionsChange?: (permissions: AccessPermission[]) => void
}

const DEFAULT_ACCESS_AREAS: AccessArea[] = [
  { id: "area-event-space", name: "Event Space", code: "EVT", isDefault: true },
  { id: "area-vips-lounge", name: "VIPs Lounge", code: "VIP", isDefault: true },
  { id: "area-office", name: "Office", code: "OFF", isDefault: true },
  { id: "area-backstage", name: "Back Stage", code: "BST", isDefault: true },
  { id: "area-panel", name: "Panel", code: "PNL", isDefault: true },
]

export function AccessAreaMatrix({
  ticketTypes,
  staffTickets,
  onPermissionsChange,
}: AccessAreaMatrixProps) {
  const [accessAreas, setAccessAreas] = React.useState<AccessArea[]>(DEFAULT_ACCESS_AREAS)
  const [permissions, setPermissions] = React.useState<Set<string>>(new Set())
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [newAreaName, setNewAreaName] = React.useState("")
  const [newAreaCode, setNewAreaCode] = React.useState("")
  const [isAddingArea, setIsAddingArea] = React.useState(false)

  // Initialize default permissions
  React.useEffect(() => {
    const defaultPermissions = new Set<string>()
    
    // Set default permissions based on ticket type names
    const eventSpaceId = "area-event-space"
    const vipsLoungeId = "area-vips-lounge"
    const officeId = "area-office"
    const backstageId = "area-backstage"
    const panelId = "area-panel"
    
    // Helper to create permission key
    const makePermissionKey = (ticketTypeId: string, areaId: string) => {
      return `${ticketTypeId}::${areaId}`
    }
    
    // All ticket types get Event Space by default
    [...ticketTypes, ...staffTickets].forEach((ticket) => {
      defaultPermissions.add(makePermissionKey(ticket.id, eventSpaceId))
    })
    
    // VIP tickets get Event Space + VIPs Lounge
    ticketTypes.forEach((ticket) => {
      if (ticket.nameEn.toUpperCase().includes("VIP")) {
        defaultPermissions.add(makePermissionKey(ticket.id, vipsLoungeId))
      }
    })
    
    // AAA tickets get all space access
    ticketTypes.forEach((ticket) => {
      if (ticket.nameEn.toUpperCase().includes("AAA")) {
        defaultPermissions.add(makePermissionKey(ticket.id, vipsLoungeId))
        defaultPermissions.add(makePermissionKey(ticket.id, officeId))
        defaultPermissions.add(makePermissionKey(ticket.id, backstageId))
        defaultPermissions.add(makePermissionKey(ticket.id, panelId))
      }
    })
    
    // Organizer/Staff tickets
    staffTickets.forEach((ticket) => {
      if (ticket.nameEn.toUpperCase().includes("ORGANIZER")) {
        // Organizer gets Event Space + VIPs Lounge + Office
        defaultPermissions.add(makePermissionKey(ticket.id, vipsLoungeId))
        defaultPermissions.add(makePermissionKey(ticket.id, officeId))
      }
    })
    
    setPermissions(defaultPermissions)
  }, [ticketTypes, staffTickets, accessAreas])

  // Create permission key
  const getPermissionKey = (ticketTypeId: string, areaId: string): string => {
    return `${ticketTypeId}::${areaId}`
  }

  // Check if permission exists
  const hasPermission = (ticketTypeId: string, areaId: string): boolean => {
    return permissions.has(getPermissionKey(ticketTypeId, areaId))
  }

  // Toggle permission
  const togglePermission = (ticketTypeId: string, areaId: string) => {
    setPermissions((prev) => {
      const newPermissions = new Set(prev)
      const key = getPermissionKey(ticketTypeId, areaId)
      
      if (newPermissions.has(key)) {
        newPermissions.delete(key)
      } else {
        newPermissions.add(key)
      }
      
      return newPermissions
    })
    setHasUnsavedChanges(true)
  }

  // Check if an area is restricted for public tickets
  const isRestrictedForPublicTickets = (areaId: string): boolean => {
    return areaId === "area-office" || 
           areaId === "area-backstage" || 
           areaId === "area-panel"
  }

  // Add custom area
  const addCustomArea = () => {
    if (!newAreaName.trim() || !newAreaCode.trim()) {
      toast.error("Please enter an area name and code")
      return
    }

    const newArea: AccessArea = {
      id: `area-custom-${Date.now()}`,
      name: newAreaName.trim(),
      code: newAreaCode.trim(),
      isDefault: false,
    }

    setAccessAreas([...accessAreas, newArea])
    setNewAreaName("")
    setNewAreaCode("")
    setIsAddingArea(false)
    toast.success(`Access area "${newArea.name}" added`)
  }

  // Remove custom area
  const removeCustomArea = (areaId: string) => {
    const area = accessAreas.find(a => a.id === areaId)
    if (!area) return

    if (area.isDefault) {
      toast.error("Cannot remove default access areas")
      return
    }

    // Remove all permissions for this area
    setPermissions((prev) => {
      const newPermissions = new Set(prev)
      Array.from(newPermissions).forEach((key) => {
        if (key.endsWith(`::${areaId}`)) {
          newPermissions.delete(key)
        }
      })
      return newPermissions
    })

    setAccessAreas(accessAreas.filter(a => a.id !== areaId))
    setHasUnsavedChanges(true)
    toast.success(`Access area "${area.name}" removed`)
  }

  // Save permissions
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Convert Set to array format
      const permissionArray: AccessPermission[] = Array.from(permissions).map(
        (key) => {
          const [ticketTypeId, areaId] = key.split("::")
          return { ticketTypeId, areaId }
        }
      )
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      onPermissionsChange?.(permissionArray)
      setHasUnsavedChanges(false)
      toast.success("Access permissions updated")
    } catch (error) {
      toast.error("Failed to save access permissions. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to initial state
  const handleCancel = () => {
    setPermissions(new Set())
    setHasUnsavedChanges(false)
  }

  // Render color swatch
  const renderColorSwatch = (color: string) => {
    return (
      <div 
        className="h-3 w-3 rounded-full border shrink-0"
        style={{ backgroundColor: color }}
      />
    )
  }

  // Empty states
  if (ticketTypes.length === 0 && staffTickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-2">No ticket types configured</p>
        <p className="text-sm text-muted-foreground">
          Create ticket types first, then configure access permissions
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Access Area Permissions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure which ticket types can access specific areas of your event
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsAddingArea(true)}
        >
          <Plus className="h-4 w-4" />
          Add Custom Area
        </Button>
      </div>

      {/* Add Custom Area Input */}
      {isAddingArea && (
        <div className="p-4 border rounded-lg bg-blue-50/50 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="areaName" className="text-xs font-medium">
                Area Name
              </Label>
              <Input
                id="areaName"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Enter area name"
                maxLength={50}
                className="h-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCustomArea()
                  } else if (e.key === "Escape") {
                    setIsAddingArea(false)
                    setNewAreaName("")
                    setNewAreaCode("")
                  }
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaCode" className="text-xs font-medium">
                Area Code <span className="text-muted-foreground">(3 characters only, all caps)</span>
              </Label>
              <Input
                id="areaCode"
                value={newAreaCode}
                onChange={(e) => {
                  const uppercased = e.target.value.toUpperCase()
                  if (uppercased.length <= 3) {
                    setNewAreaCode(uppercased)
                  }
                }}
                placeholder="ABC"
                maxLength={3}
                className="h-9 uppercase"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCustomArea()
                  } else if (e.key === "Escape") {
                    setIsAddingArea(false)
                    setNewAreaName("")
                    setNewAreaCode("")
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingArea(false)
                setNewAreaName("")
                setNewAreaCode("")
              }}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={addCustomArea}
              className="h-9"
            >
              Add Area
            </Button>
          </div>
        </div>
      )}

      {/* Matrix Container */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-semibold sticky left-0 bg-muted/50 z-10 min-w-[280px]">
                  Ticket Type
                </th>
                {accessAreas.map((area) => (
                  <th
                    key={area.id}
                    className="text-center p-4 font-semibold min-w-[140px] relative group"
                  >
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                      <span className="text-sm">{area.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        ({area.code})
                      </span>
                      {!area.isDefault && (
                        <button
                          onClick={() => removeCustomArea(area.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 h-5 w-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center"
                          title="Remove custom area"
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Public Guest Tickets Section */}
              {ticketTypes.length > 0 && (
                <>
                  <tr className="bg-muted/30">
                    <td
                      colSpan={accessAreas.length + 1}
                      className="p-3 font-semibold text-sm sticky left-0 z-10 bg-muted/30"
                    >
                      PUBLIC GUEST TICKETS
                    </td>
                  </tr>
                  {ticketTypes.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          {renderColorSwatch(ticket.colorHex)}
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-sm">{ticket.nameEn}</span>
                            {ticket.ticketScope === "sub_event" && ticket.parentTicketTypeId && (
                              <span className="text-xs text-muted-foreground">Sub-event ticket</span>
                            )}
                          </div>
                        </div>
                      </td>
                      {accessAreas.map((area) => (
                        <td key={area.id} className="p-4 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={hasPermission(ticket.id, area.id)}
                              onCheckedChange={() => togglePermission(ticket.id, area.id)}
                              disabled={isRestrictedForPublicTickets(area.id)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {/* Organizer/Staff Tickets Section */}
              {staffTickets.length > 0 && (
                <>
                  <tr className="bg-muted/30">
                    <td
                      colSpan={accessAreas.length + 1}
                      className="p-3 font-semibold text-sm sticky left-0 z-10 bg-muted/30"
                    >
                      ORGANIZER / STAFF TICKETS
                    </td>
                  </tr>
                  {staffTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          {renderColorSwatch(ticket.colorHex)}
                          <span className="font-medium text-sm">{ticket.nameEn}</span>
                        </div>
                      </td>
                      {accessAreas.map((area) => (
                        <td key={area.id} className="p-4 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              checked={hasPermission(ticket.id, area.id)}
                              onCheckedChange={() => togglePermission(ticket.id, area.id)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
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