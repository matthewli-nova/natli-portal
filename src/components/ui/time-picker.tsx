"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Clock } from "lucide-react"

import { cn } from "./utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface TimePickerProps {
  className?: string
  time?: Date
  value?: Date
  onTimeChange?: (time: Date | undefined) => void
  onChange?: (time: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  type?: "start" | "end" // New prop to determine which presets to show
}

export function TimePicker({
  className,
  time: timeProp,
  value: valueProp,
  onTimeChange: onTimeChangeProp,
  onChange: onChangeProp,
  placeholder = "Select time",
  disabled = false,
  type = "start", // Default to start time presets
}: TimePickerProps) {
  const time = timeProp || valueProp
  const onTimeChange = onTimeChangeProp || onChangeProp

  const [open, setOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState<string>("")

  // Update input when time changes
  React.useEffect(() => {
    if (time) {
      setTimeValue(format(time, "HH:mm"))
    } else {
      setTimeValue("")
    }
  }, [time])

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTimeValue(value)
    
    if (value) {
      const [hours, minutes] = value.split(":").map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date()
        newDate.setHours(hours, minutes, 0, 0)
        onTimeChange?.(newDate)
      }
    }
  }

  const handleApply = () => {
    setOpen(false)
  }

  // Generate time presets based on type
  const timePresets = React.useMemo(() => {
    if (type === "end") {
      // End time: 0000 to 2300 (on the hour)
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0")
        return { label: `${hour}00`, value: `${hour}:00` }
      })
    } else {
      // Start time: 0000 to 2300 (on the hour)
      return Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0")
        return { label: `${hour}00`, value: `${hour}:00` }
      })
    }
  }, [type])

  const selectPreset = (value: string) => {
    setTimeValue(value)
    const [hours, minutes] = value.split(":").map(Number)
    const newDate = new Date()
    newDate.setHours(hours, minutes, 0, 0)
    onTimeChange?.(newDate)
    setOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-9 font-normal text-left shadow-none hover:bg-input-background hover:text-foreground",
              !time && "text-muted-foreground"
            )}
          >
            <span>
              {time ? format(time, "HH:mm") : placeholder}
            </span>
            <Clock className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={timeValue}
                onChange={handleTimeInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Quick Select</label>
              <div className="grid grid-cols-5 gap-2">
                {timePresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="outline"
                    size="sm"
                    onClick={() => selectPreset(preset.value)}
                    className={cn(
                      "h-8 text-xs",
                      timeValue === preset.value && "bg-accent border-accent-foreground"
                    )}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border flex justify-end gap-3 bg-muted/5 px-[14px] pt-[10px] pb-[14px]">
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              className="min-w-[100px] h-9"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}