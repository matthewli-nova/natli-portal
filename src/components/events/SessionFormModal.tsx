"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DateTimePicker } from "../ui/datetime-picker"
import { FileUpload } from "../ui/file-upload"
import { type Session, type AccessType } from "../data/b2b-events"
import { cn } from "../ui/utils"
import { toast } from 'sonner'
import { format, isWithinInterval, setHours, setMinutes } from "date-fns"

interface SessionFormData {
  nameEn: string
  nameTc: string
  nameSc: string
  descriptionEn: string
  descriptionTc: string
  descriptionSc: string
  sessionDate?: Date
  startTime?: Date
  endTime?: Date
  venueRoom: string
  accessType: AccessType | ""
  capacity: string
  // Sub-event specific fields
  additionalFee: string
  image?: File | null
  imagePreview?: string | null
}

interface SessionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventStartDate: Date
  eventEndDate: Date
  session?: Session | null // If editing
  parentSession?: Session | null // If adding sub-event
  onSave: (data: SessionFormData) => void
}

export function SessionFormModal({
  open,
  onOpenChange,
  eventStartDate,
  eventEndDate,
  session,
  parentSession,
  onSave
}: SessionFormModalProps) {
  const isEdit = !!session
  const isSubEvent = !!parentSession

  const [formData, setFormData] = React.useState<SessionFormData>({
    nameEn: session?.name.en || "",
    nameTc: session?.name.tc || "",
    nameSc: session?.name.sc || "",
    descriptionEn: session?.description?.en || "",
    descriptionTc: session?.description?.tc || "",
    descriptionSc: session?.description?.sc || "",
    sessionDate: session?.sessionDate,
    startTime: session?.startTime,
    endTime: session?.endTime,
    venueRoom: session?.venueRoom || "",
    accessType: session?.accessType || "",
    capacity: session?.capacity?.toString() || "",
    additionalFee: session?.additionalFee?.toString() || "",
    image: null,
    imagePreview: session?.imageUrl || null
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Language tabs
  const [nameLang, setNameLang] = React.useState("en")
  const [descriptionLang, setDescriptionLang] = React.useState("en")

  // Reset form when dialog opens/closes or session changes
  React.useEffect(() => {
    if (open) {
      setFormData({
        nameEn: session?.name.en || "",
        nameTc: session?.name.tc || "",
        nameSc: session?.name.sc || "",
        descriptionEn: session?.description?.en || "",
        descriptionTc: session?.description?.tc || "",
        descriptionSc: session?.description?.sc || "",
        sessionDate: session?.sessionDate,
        startTime: session?.startTime,
        endTime: session?.endTime,
        venueRoom: session?.venueRoom || "",
        accessType: session?.accessType || "",
        capacity: session?.capacity?.toString() || "",
        additionalFee: session?.additionalFee?.toString() || "",
        image: null,
        imagePreview: session?.imageUrl || null
      })
      setErrors({})
    }
  }, [open, session])

  const handleChange = (field: keyof SessionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required: Name (EN)
    if (!formData.nameEn.trim()) {
      newErrors.nameEn = "Session name (English) is required"
    } else if (formData.nameEn.length > 200) {
      newErrors.nameEn = "Session name must be 200 characters or less"
    }

    if (formData.nameTc.length > 200) {
      newErrors.nameTc = "Session name must be 200 characters or less"
    }

    if (formData.nameSc.length > 200) {
      newErrors.nameSc = "Session name must be 200 characters or less"
    }

    // Description character limits
    if (formData.descriptionEn.length > 5000) {
      newErrors.descriptionEn = "Description must be 5000 characters or less"
    }
    if (formData.descriptionTc.length > 5000) {
      newErrors.descriptionTc = "Description must be 5000 characters or less"
    }
    if (formData.descriptionSc.length > 5000) {
      newErrors.descriptionSc = "Description must be 5000 characters or less"
    }

    // Required: Session Date
    if (!formData.sessionDate) {
      newErrors.sessionDate = "Session date is required"
    } else {
      // Check if within event date range
      const dateInRange = isWithinInterval(formData.sessionDate, {
        start: eventStartDate,
        end: eventEndDate
      })
      if (!dateInRange) {
        newErrors.sessionDate = `Session date must be within ${format(eventStartDate, "dd MMM yyyy")} – ${format(eventEndDate, "dd MMM yyyy")}`
      }
    }

    // Required: Start Time
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required"
    }

    // Required: End Time
    if (!formData.endTime) {
      newErrors.endTime = "End time is required"
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "End time must be after start time"
    }

    // Required: Access Type
    if (!formData.accessType) {
      newErrors.accessType = "Access type is required"
    }

    // Required: Capacity
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = "Capacity must be greater than 0"
    }

    // Sub-event: Additional Fee validation
    if (isSubEvent && formData.additionalFee) {
      const fee = parseFloat(formData.additionalFee)
      if (isNaN(fee) || fee < 0) {
        newErrors.additionalFee = "Additional fee must be a valid number"
      }
    }

    // Top-level session: Additional fee should not be set
    if (!isSubEvent && formData.additionalFee && parseFloat(formData.additionalFee) > 0) {
      newErrors.additionalFee = "Additional fee is only valid on sub-event sessions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success(isEdit ? "Session updated successfully" : "Session added successfully")
      onSave(formData)
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to save session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCharacterCount = (text: string, max: number) => {
    const remaining = max - text.length
    const isNearLimit = remaining < max * 0.1
    const isOverLimit = remaining < 0

    return (
      <span className={cn(
        "text-xs",
        isOverLimit ? "text-destructive font-medium" :
        isNearLimit ? "text-orange-600" :
        "text-muted-foreground"
      )}>
        {text.length} / {max}
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit 
              ? (isSubEvent ? "Edit Sub-event" : "Edit Session")
              : (isSubEvent ? "Add Sub-event" : "Add Session")}
          </DialogTitle>
          <DialogDescription>
            {isSubEvent && parentSession && (
              <span className="text-sm">
                Sub-event under: <strong>{parentSession.name.en}</strong>
              </span>
            )}
            {!isSubEvent && (
              <span>
                {isEdit ? "Update session details" : "Add a new session to your event agenda"}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Basic Information</h3>

            {/* Session Name - Multilingual */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                Session Name <span className="text-destructive">*</span>
              </Label>
              <Tabs value={nameLang} onValueChange={setNameLang}>
                <TabsList className="h-8 bg-muted/50 p-0.5">
                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="mt-2">
                  <div className="flex flex-col gap-1.5">
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => handleChange("nameEn", e.target.value)}
                      placeholder="Enter session name in English"
                      className={cn(errors.nameEn && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.nameEn && (
                        <span className="text-xs text-destructive">{errors.nameEn}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.nameEn, 200)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tc" className="mt-2">
                  <div className="flex flex-col gap-1.5">
                    <Input
                      value={formData.nameTc}
                      onChange={(e) => handleChange("nameTc", e.target.value)}
                      placeholder="輸入繁體中文會議名稱（選填）"
                      className={cn(errors.nameTc && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.nameTc && (
                        <span className="text-xs text-destructive">{errors.nameTc}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.nameTc, 200)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sc" className="mt-2">
                  <div className="flex flex-col gap-1.5">
                    <Input
                      value={formData.nameSc}
                      onChange={(e) => handleChange("nameSc", e.target.value)}
                      placeholder="输入简体中文会议名称（选填）"
                      className={cn(errors.nameSc && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.nameSc && (
                        <span className="text-xs text-destructive">{errors.nameSc}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.nameSc, 200)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Description - Multilingual */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Tabs value={descriptionLang} onValueChange={setDescriptionLang}>
                <TabsList className="h-8 bg-muted/50 p-0.5">
                  <TabsTrigger value="en" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">EN</TabsTrigger>
                  <TabsTrigger value="tc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">繁</TabsTrigger>
                  <TabsTrigger value="sc" className="h-7 px-3 text-xs data-[state=active]:bg-[#023F59] data-[state=active]:text-white">簡</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="mt-3">
                  <div className="flex flex-col gap-1.5">
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => handleChange("descriptionEn", e.target.value)}
                      placeholder="Describe the session (optional)"
                      rows={4}
                      className={cn(errors.descriptionEn && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.descriptionEn && (
                        <span className="text-xs text-destructive">{errors.descriptionEn}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.descriptionEn, 5000)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="tc" className="mt-3">
                  <div className="flex flex-col gap-1.5">
                    <Textarea
                      value={formData.descriptionTc}
                      onChange={(e) => handleChange("descriptionTc", e.target.value)}
                      placeholder="輸入會議描述（選填）"
                      rows={4}
                      className={cn(errors.descriptionTc && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.descriptionTc && (
                        <span className="text-xs text-destructive">{errors.descriptionTc}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.descriptionTc, 5000)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="sc" className="mt-3">
                  <div className="flex flex-col gap-1.5">
                    <Textarea
                      value={formData.descriptionSc}
                      onChange={(e) => handleChange("descriptionSc", e.target.value)}
                      placeholder="输入会议描述（选填）"
                      rows={4}
                      className={cn(errors.descriptionSc && "border-destructive")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.descriptionSc && (
                        <span className="text-xs text-destructive">{errors.descriptionSc}</span>
                      )}
                      <div className="ml-auto">
                        {getCharacterCount(formData.descriptionSc, 5000)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Schedule</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Session Date <span className="text-destructive">*</span>
                </Label>
                <DateTimePicker
                  value={formData.sessionDate}
                  onChange={(date) => handleChange("sessionDate", date)}
                  placeholder="Select date"
                  mode="date"
                />
                {errors.sessionDate && (
                  <span className="text-xs text-destructive">{errors.sessionDate}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <DateTimePicker
                  value={formData.startTime}
                  onChange={(date) => handleChange("startTime", date)}
                  placeholder="Select time"
                />
                {errors.startTime && (
                  <span className="text-xs text-destructive">{errors.startTime}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  End Time <span className="text-destructive">*</span>
                </Label>
                <DateTimePicker
                  value={formData.endTime}
                  onChange={(date) => handleChange("endTime", date)}
                  placeholder="Select time"
                />
                {errors.endTime && (
                  <span className="text-xs text-destructive">{errors.endTime}</span>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Location</h3>

            <div className="space-y-2">
              <Label>Venue / Room</Label>
              <Input
                value={formData.venueRoom}
                onChange={(e) => handleChange("venueRoom", e.target.value)}
                placeholder="e.g., Hall 1, Room 201 (optional)"
                maxLength={100}
              />
              <span className="text-xs text-muted-foreground">
                Optional location information for this session
              </span>
            </div>
          </div>

          {/* Access & Capacity */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Access & Capacity</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Access Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.accessType}
                  onValueChange={(value) => handleChange("accessType", value as AccessType)}
                >
                  <SelectTrigger className={cn(errors.accessType && "border-destructive")}>
                    <SelectValue placeholder="Select access type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admission Required">Admission Required</SelectItem>
                    <SelectItem value="Open to All">Open to All</SelectItem>
                  </SelectContent>
                </Select>
                {errors.accessType && (
                  <span className="text-xs text-destructive">{errors.accessType}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Capacity <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="Maximum attendees"
                  className={cn(errors.capacity && "border-destructive")}
                />
                {errors.capacity && (
                  <span className="text-xs text-destructive">{errors.capacity}</span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-event Specific Fields */}
          {isSubEvent && (
            <>
              {/* Additional Fee */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Pricing</h3>

                <div className="space-y-2">
                  <Label>Additional Fee</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">HKD</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.additionalFee}
                      onChange={(e) => handleChange("additionalFee", e.target.value)}
                      placeholder="0.00"
                      className={cn(errors.additionalFee && "border-destructive", "flex-1")}
                    />
                  </div>
                  {errors.additionalFee && (
                    <span className="text-xs text-destructive">{errors.additionalFee}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Leave empty if included in the parent ticket price
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Media</h3>

                <div className="space-y-2">
                  <Label>Sub-event Image</Label>
                  <FileUpload
                    accept="image/png,image/jpeg"
                    maxSize={5 * 1024 * 1024} // 5MB
                    onFileSelect={(file) => {
                      handleChange("image", file)
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          handleChange("imagePreview", reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    preview={formData.imagePreview}
                    aspectRatio="wide"
                  />
                  <span className="text-xs text-muted-foreground">
                    Promotional image for this sub-event. PNG or JPG. Max 5MB.
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}