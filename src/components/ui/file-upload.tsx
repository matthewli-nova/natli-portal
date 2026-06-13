"use client"

import * as React from "react"
import { UploadIcon, XIcon, ImageIcon } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./button"

interface FileUploadProps {
  className?: string
  value?: string // URL of uploaded file
  onFileChange?: (file: File | null, preview: string | null) => void
  onFileSelect?: (file: File | null) => void
  preview?: string | null
  accept?: string
  maxSize?: number // in bytes
  label?: string
  aspectRatio?: "square" | "landscape" | "wide"
}

export function FileUpload({
  className,
  value,
  onFileChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = "Upload Image",
  aspectRatio = "square",
}: FileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return "Please upload an image file"
    }
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onFileChange?.(file, result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileChange?.(null, null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-md border border-input bg-muted/20",
              aspectRatio === "square" ? "aspect-square w-full max-w-[200px]" : "aspect-[3/1] w-full"
            )}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClick}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <XIcon className="size-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={cn(
            "relative overflow-hidden rounded-md border-2 border-dashed cursor-pointer transition-colors",
            aspectRatio === "square" ? "aspect-square w-full max-w-[200px]" : "aspect-[3/1] w-full",
            isDragging 
              ? "border-lepos-cyan bg-lepos-cyan/5" 
              : "border-input bg-muted/5 hover:bg-muted/10 hover:border-muted-foreground/50"
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="rounded-full bg-muted/50 p-3">
              {isDragging ? (
                <UploadIcon className="size-6 text-lepos-cyan" />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragging ? "Drop image here" : label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
