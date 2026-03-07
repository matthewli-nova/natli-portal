import { cn } from "../ui/utils"

interface QuotaIndicatorProps {
  available: number
  total: number
  className?: string
}

export function QuotaIndicator({ available, total, className }: QuotaIndicatorProps) {
  const percentage = (available / total) * 100
  
  const getColorClass = () => {
    if (percentage > 50) return "text-green-600"
    if (percentage > 10) return "text-amber-600"
    return "text-red-600"
  }

  const getStatusLabel = () => {
    if (available === 0) return "Sold Out"
    if (percentage <= 10) return "Almost Full"
    return ""
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-medium", getColorClass())}>
          {available} of {total} remaining
        </span>
        {getStatusLabel() && (
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            percentage <= 10 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
          )}>
            {getStatusLabel()}
          </span>
        )}
      </div>
      {/* Optional: Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all",
            percentage > 50 ? "bg-green-500" : percentage > 10 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
