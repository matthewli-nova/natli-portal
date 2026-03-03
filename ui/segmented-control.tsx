import * as React from "react"
import { cn } from "./utils"

interface SegmentedControlProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string | any) => void
  className?: string
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn("flex bg-input-background border border-border rounded-md p-1 h-9", className)}>
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "px-3 flex-1 flex items-center justify-center text-xs font-semibold rounded-sm transition-all cursor-pointer focus:outline-none select-none",
              isActive
                ? "bg-lepos-cyan text-lepos-dark-brand shadow-sm"
                : "text-slate-500 hover:text-lepos-dark-brand hover:bg-slate-200/50"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
