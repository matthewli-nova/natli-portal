import { Badge } from "../ui/badge"
import { cn } from "../ui/utils"

interface TicketTypeBadgeProps {
  name: string
  colorHex?: string
  className?: string
}

export function TicketTypeBadge({ name, colorHex = "#107DAC", className }: TicketTypeBadgeProps) {
  // Convert hex to RGB for background with opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 16, g: 125, b: 172 } // fallback to #107DAC
  }

  const rgb = hexToRgb(colorHex)
  const bgColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
  const borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", className)}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: colorHex,
      }}
    >
      {name}
    </Badge>
  )
}
