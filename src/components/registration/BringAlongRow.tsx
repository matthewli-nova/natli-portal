import * as React from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { cn } from "../ui/utils"

export interface BringAlongGuest {
  id: string
  firstName: string
  lastName: string
}

interface BringAlongRowProps {
  guest: BringAlongGuest
  onUpdate: (id: string, field: "firstName" | "lastName", value: string) => void
  onRemove: (id: string) => void
  error?: { firstName?: string; lastName?: string }
}

export function BringAlongRow({ guest, onUpdate, onRemove, error }: BringAlongRowProps) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Input
            placeholder="First Name"
            value={guest.firstName}
            onChange={(e) => onUpdate(guest.id, "firstName", e.target.value)}
            className={cn(error?.firstName && "border-red-500")}
          />
          {error?.firstName && (
            <p className="text-xs text-red-500">{error.firstName}</p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            placeholder="Last Name"
            value={guest.lastName}
            onChange={(e) => onUpdate(guest.id, "lastName", e.target.value)}
            className={cn(error?.lastName && "border-red-500")}
          />
          {error?.lastName && (
            <p className="text-xs text-red-500">{error.lastName}</p>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(guest.id)}
        className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
