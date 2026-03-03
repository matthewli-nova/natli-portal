"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "./utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface DatePickerProps {
  className?: string
  date?: Date
  value?: Date
  onDateChange?: (date: Date | undefined) => void
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  className,
  date: dateProp,
  value: valueProp,
  onDateChange: onDateChangeProp,
  onChange: onChangeProp,
  placeholder = "Select date",
  disabled = false,
}: DatePickerProps) {
  const date = dateProp || valueProp
  const onDateChange = onDateChangeProp || onChangeProp

  const [open, setOpen] = React.useState(false)

  const handleSelect = (selected: Date | undefined) => {
    onDateChange?.(selected)
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
              !date && "text-muted-foreground"
            )}
          >
            <span>
              {date ? format(date, "LLL dd, y") : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
