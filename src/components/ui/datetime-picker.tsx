"use client"

import * as React from "react"
import { format, parse, isValid, set } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "./utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Input } from "./input"
import { Label } from "./label"

interface DateTimePickerProps {
  className?: string
  date?: Date
  value?: Date // Support both naming conventions
  onDateChange?: (date: Date | undefined) => void
  onChange?: (date: Date | undefined) => void // Support both naming conventions
  placeholder?: string
  mode?: "datetime" | "date" // Add mode support
}

export function DateTimePicker({
  className,
  date: dateProp,
  value: valueProp,
  onDateChange: onDateChangeProp,
  onChange: onChangeProp,
  placeholder = "Pick a date and time",
  mode = "datetime",
}: DateTimePickerProps) {
  // Support both prop names
  const date = dateProp || valueProp
  const onDateChange = onDateChangeProp || onChangeProp

  const [open, setOpen] = React.useState(false)
  const [pendingDate, setPendingDate] = React.useState<Date | undefined>(date)
  const [dateValue, setDateValue] = React.useState<string>("")
  const [timeValue, setTimeValue] = React.useState<string>("")

  // Sync pending value when popover opens or date changes
  React.useEffect(() => {
    if (open) {
      setPendingDate(date)
      // Set initial values when opening
      if (date) {
        setDateValue(format(date, "yyyy-MM-dd"))
        setTimeValue(format(date, "HH:mm"))
      } else {
        // Set to current date/time as default
        const now = new Date()
        const defaultDate = set(now, { hours: 9, minutes: 0, seconds: 0 })
        setPendingDate(defaultDate)
        setDateValue(format(defaultDate, "yyyy-MM-dd"))
        setTimeValue(format(defaultDate, "HH:mm"))
      }
    }
  }, [open, date])

  // Update inputs when pendingDate changes
  React.useEffect(() => {
    if (pendingDate) {
      setDateValue(format(pendingDate, "yyyy-MM-dd"))
      setTimeValue(format(pendingDate, "HH:mm"))
    } else {
      setDateValue("")
      setTimeValue("")
    }
  }, [pendingDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateValue(e.target.value)
    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
    if (isValid(parsedDate)) {
      const newDate = set(parsedDate, {
        hours: pendingDate?.getHours() || 0,
        minutes: pendingDate?.getMinutes() || 0,
      })
      setPendingDate(newDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value)
    const [hours, minutes] = e.target.value.split(":").map(Number)
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = set(pendingDate || new Date(), {
        hours,
        minutes,
      })
      setPendingDate(newDate)
    }
  }

  const handleCalendarSelect = (selected: Date | undefined) => {
    if (selected) {
      const newDate = set(selected, {
        hours: pendingDate?.getHours() || 9,
        minutes: pendingDate?.getMinutes() || 0,
      })
      setPendingDate(newDate)
    }
  }

  const handleApply = () => {
    onDateChange?.(pendingDate)
    setOpen(false)
  }

  const handleCancel = () => {
    setPendingDate(date)
    setOpen(false)
  }

  // Preset shortcuts
  const presets = [
    {
      label: "Today",
      getValue: () => set(new Date(), { hours: 9, minutes: 0, seconds: 0 })
    },
    {
      label: "Tomorrow",
      getValue: () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return set(tomorrow, { hours: 9, minutes: 0, seconds: 0 })
      }
    },
    {
      label: "1 Week",
      getValue: () => {
        const week = new Date()
        week.setDate(week.getDate() + 7)
        return set(week, { hours: 9, minutes: 0, seconds: 0 })
      }
    },
    {
      label: "2 Weeks",
      getValue: () => {
        const twoWeeks = new Date()
        twoWeeks.setDate(twoWeeks.getDate() + 14)
        return set(twoWeeks, { hours: 9, minutes: 0, seconds: 0 })
      }
    },
    {
      label: "1 Month",
      getValue: () => {
        const month = new Date()
        month.setMonth(month.getMonth() + 1)
        return set(month, { hours: 9, minutes: 0, seconds: 0 })
      }
    },
    {
      label: "3 Months",
      getValue: () => {
        const threeMonths = new Date()
        threeMonths.setMonth(threeMonths.getMonth() + 3)
        return set(threeMonths, { hours: 9, minutes: 0, seconds: 0 })
      }
    }
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-9 font-normal text-left shadow-none hover:bg-input-background hover:text-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {date ? (
                format(date, "LLL dd, y, HH:mm")
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset shortcuts panel */}
            <div className="border-r bg-muted/5 p-3 min-w-[140px]">
              <div className="flex flex-col gap-1">
                {presets.map((preset) => {
                  const presetDate = preset.getValue()
                  const isSelected = pendingDate && 
                    format(pendingDate, "yyyy-MM-dd") === format(presetDate, "yyyy-MM-dd")
                  
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setPendingDate(presetDate)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm rounded-md text-left hover:bg-accent/10 transition-colors",
                        isSelected && "bg-accent/20 font-medium"
                      )}
                    >
                      <span>{preset.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(presetDate, "MM-dd")}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Calendar and time picker panel */}
            <div className="flex flex-col">
              <div className="p-4 gap-4 flex flex-col">
                <div className="flex gap-2">
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Input
                        id="date"
                        type="date"
                        value={dateValue}
                        onChange={handleDateChange}
                        className="w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid gap-1.5 w-[120px]">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={timeValue}
                      onChange={handleTimeChange}
                      className="w-full"
                    />
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={pendingDate}
                  onSelect={handleCalendarSelect}
                  initialFocus
                />
              </div>
              <div className="border-t border-border flex justify-end gap-3 bg-muted/5 px-[14px] pt-[10px] pb-[14px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground h-9"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleApply}
                  className="min-w-[100px] h-9"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}