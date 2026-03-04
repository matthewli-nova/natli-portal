"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

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

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [open, setOpen] = React.useState(false)
  const [pendingDate, setPendingDate] = React.useState<DateRange | undefined>(date)
  const [fromDate, setFromDate] = React.useState<string>("")
  const [toDate, setToDate] = React.useState<string>("")

  // Sync pending value when popover opens or date changes
  React.useEffect(() => {
    if (open) {
      setPendingDate(date)
    }
  }, [open, date])

  // Update inputs when pendingDate changes
  React.useEffect(() => {
    if (pendingDate?.from) {
      setFromDate(format(pendingDate.from, "yyyy-MM-dd"))
    } else {
      setFromDate("")
    }
    if (pendingDate?.to) {
      setToDate(format(pendingDate.to, "yyyy-MM-dd"))
    } else {
      setToDate("")
    }
  }, [pendingDate])

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value)
    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
    if (isValid(parsedDate)) {
      setPendingDate({ from: parsedDate, to: pendingDate?.to })
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value)
    const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
    if (isValid(parsedDate)) {
      setPendingDate({ from: pendingDate?.from, to: parsedDate })
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

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost" 
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-9 font-normal text-left shadow-none hover:bg-input-background hover:text-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <div className="p-4 gap-4 flex flex-col">
                            <div className="flex gap-2">
                <div className="grid gap-1.5 flex-1">
                  <Label htmlFor="from">From</Label>
                  <div className="relative">
                    <Input
                      id="from"
                      type="date"
                      value={fromDate}
                      onChange={handleFromChange}
                      className="w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50 pointer-events-none" />
                  </div>
                </div>
                <div className="grid gap-1.5 flex-1">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                    <Input
                      id="to"
                      type="date"
                      value={toDate}
                      onChange={handleToChange}
                      className="w-full pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50 pointer-events-none" />
                  </div>
                </div>
              </div>
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={pendingDate?.from}
                selected={pendingDate}
                onSelect={setPendingDate}
                numberOfMonths={2}
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
        </PopoverContent>
      </Popover>
    </div>
  )
}
