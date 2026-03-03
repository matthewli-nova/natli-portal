import { cn } from "../ui/utils"
import { Check } from "lucide-react"
import { QuotaIndicator } from "./QuotaIndicator"
import { Badge } from "../ui/badge"

export interface TicketType {
  id: string
  name: string
  description?: string
  colorHex: string
  scope: "event" | "sub-event"
  available: number
  total: number
  price?: number
  sessionDate?: Date
  sessionTime?: string
  parentTicketId?: string
}

interface TicketCardProps {
  ticket: TicketType
  selected: boolean
  onSelect: (ticketId: string) => void
  disabled?: boolean
  selectionType: "radio" | "checkbox"
  disabledReason?: string
}

export function TicketCard({ 
  ticket, 
  selected, 
  onSelect, 
  disabled = false,
  selectionType,
  disabledReason
}: TicketCardProps) {
  const isSoldOut = ticket.available === 0
  const isDisabled = disabled || isSoldOut

  return (
    <div
      onClick={() => !isDisabled && onSelect(ticket.id)}
      className={cn(
        "relative border-2 rounded-lg p-4 transition-all cursor-pointer",
        "hover:shadow-md",
        selected && "border-[#107DAC] bg-blue-50/50 shadow-md",
        !selected && !isDisabled && "border-gray-200 bg-white hover:border-gray-300",
        isDisabled && "opacity-50 cursor-not-allowed bg-gray-50"
      )}
      style={{
        borderLeftWidth: "6px",
        borderLeftColor: isDisabled ? "#d1d5db" : ticket.colorHex
      }}
    >
      {/* Selection Indicator */}
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5",
          selectionType === "radio" && "rounded-full",
          selectionType === "checkbox" && "rounded",
          selected ? "bg-[#107DAC] border-[#107DAC]" : "border-gray-300 bg-white"
        )}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">{ticket.name}</h3>
              {ticket.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
              )}
            </div>
            <Badge 
              variant="outline" 
              className="flex-shrink-0 text-xs"
            >
              {ticket.scope === "event" ? "Event" : "Session"}
            </Badge>
          </div>

          {/* Session Info */}
          {ticket.sessionDate && ticket.sessionTime && (
            <div className="text-xs text-muted-foreground mb-2">
              {ticket.sessionTime}
            </div>
          )}

          {/* Quota */}
          {!isSoldOut && (
            <QuotaIndicator 
              available={ticket.available} 
              total={ticket.total}
              className="mb-2"
            />
          )}

          {/* Price */}
          <div className="text-sm font-medium text-[#023F59]">
            {ticket.price !== undefined && ticket.price > 0 ? `$${ticket.price}` : "Free"}
          </div>

          {/* Disabled Reason */}
          {isDisabled && disabledReason && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
              {disabledReason}
            </div>
          )}
        </div>
      </div>

      {/* Sold Out Overlay */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
          <span className="text-lg font-bold text-gray-500">SOLD OUT</span>
        </div>
      )}
    </div>
  )
}
