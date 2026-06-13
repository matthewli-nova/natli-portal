"use client"

import * as React from "react"
import { cn } from "./utils"
import { Input } from "./input"
import { Label } from "./label"

interface ColourPickerProps {
  className?: string
  value?: string
  onValueChange?: (value: string) => void
  onChange?: (value: string) => void
  label?: string
  defaultValue?: string
}

export function ColourPicker({
  className,
  value = "",
  onValueChange,
  label = "Colour",
  defaultValue = "#00B5AD",
}: ColourPickerProps) {
  const [hexValue, setHexValue] = React.useState(value || defaultValue)
  const colorInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setHexValue(value || defaultValue)
  }, [value, defaultValue])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.trim()
    
    // Add # prefix if missing
    if (newValue && !newValue.startsWith('#')) {
      newValue = '#' + newValue
    }
    
    setHexValue(newValue)
    
    // Validate hex color format
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i
    if (hexRegex.test(newValue)) {
      onValueChange?.(newValue.toUpperCase())
    }
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase()
    setHexValue(newValue)
    onValueChange?.(newValue)
  }

  const handleSwatchClick = () => {
    colorInputRef.current?.click()
  }

  const displayColor = hexValue || defaultValue

  return (
    <div className={cn("grid gap-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-3">
        {/* Color swatch */}
        <button
          type="button"
          onClick={handleSwatchClick}
          className="relative size-9 rounded-md border-2 border-input overflow-hidden shrink-0 transition-all hover:border-lepos-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ backgroundColor: displayColor }}
          title="Click to open color picker"
        >
          <input
            ref={colorInputRef}
            type="color"
            value={displayColor}
            onChange={handleColorPickerChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </button>

        {/* Hex input */}
        <div className="flex-1">
          <Input
            type="text"
            value={hexValue}
            onChange={handleHexChange}
            placeholder="#000000"
            maxLength={7}
            className="font-mono uppercase"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Click the swatch to use color picker, or enter hex code
      </p>
    </div>
  )
}
