"use client"

import * as React from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { cn } from "../ui/utils"

interface PhoneInputProps {
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (code: string) => void
  onPhoneNumberChange: (number: string) => void
  required?: boolean
  error?: string
  className?: string
}

const countryCodes = [
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
]

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  required = false,
  error,
  className
}: PhoneInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="phone">
        Phone {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Code" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                <span className="flex items-center gap-2">
                  <span>{item.flag}</span>
                  <span>{item.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id="phone"
          type="tel"
          placeholder="9123 4567"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className={cn("flex-1", error && "border-red-500")}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
