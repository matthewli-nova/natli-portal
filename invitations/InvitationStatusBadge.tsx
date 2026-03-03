import { Badge } from "../ui/badge"
import { cn } from "../ui/utils"

export type InvitationStatus = 
  | "pending" 
  | "sent" 
  | "opened" 
  | "clicked" 
  | "confirmed" 
  | "declined" 
  | "bounced"

interface InvitationStatusBadgeProps {
  status: InvitationStatus
  className?: string
}

const statusConfig: Record<InvitationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { 
    label: "Pending", 
    color: "text-gray-700", 
    bgColor: "bg-gray-100 border-gray-300" 
  },
  sent: { 
    label: "Sent", 
    color: "text-blue-700", 
    bgColor: "bg-blue-50 border-blue-200" 
  },
  opened: { 
    label: "Opened", 
    color: "text-teal-700", 
    bgColor: "bg-teal-50 border-teal-200" 
  },
  clicked: { 
    label: "Clicked", 
    color: "text-green-700", 
    bgColor: "bg-green-50 border-green-200" 
  },
  confirmed: { 
    label: "Confirmed", 
    color: "text-green-800", 
    bgColor: "bg-green-100 border-green-300" 
  },
  declined: { 
    label: "Declined", 
    color: "text-orange-700", 
    bgColor: "bg-orange-50 border-orange-200" 
  },
  bounced: { 
    label: "Bounced", 
    color: "text-red-700", 
    bgColor: "bg-red-50 border-red-200" 
  },
}

export function InvitationStatusBadge({ status, className }: InvitationStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border",
        config.color,
        config.bgColor,
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
