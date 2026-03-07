"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Alert, AlertDescription } from "../ui/alert"
import { TicketCard, type TicketType } from "./TicketCard"
import { PhoneInput } from "./PhoneInput"
import { BringAlongRow, type BringAlongGuest } from "./BringAlongRow"
import { 
  mockEventForRegistration, 
  mockEventTickets, 
  mockSubEventTickets,
  ticketBringAlongLimits 
} from "../data/registration-events"
import { Calendar, MapPin, Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "../ui/utils"

interface RegistrationFormData {
  salutation: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  preferredLanguage: string
  wechatId: string
  representativeType: string
}

interface FormErrors {
  [key: string]: string
}

export function RegistrationPage() {
  const [selectedEventTicket, setSelectedEventTicket] = React.useState<string>("")
  const [selectedSubEventTickets, setSelectedSubEventTickets] = React.useState<Set<string>>(new Set())
  const [formData, setFormData] = React.useState<RegistrationFormData>({
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+852",
    phoneNumber: "",
    preferredLanguage: "en",
    wechatId: "",
    representativeType: "",
  })
  const [bringAlongGuests, setBringAlongGuests] = React.useState<BringAlongGuest[]>([])
  const [formErrors, setFormErrors] = React.useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [duplicateEmailWarning, setDuplicateEmailWarning] = React.useState(false)
  const [systemError, setSystemError] = React.useState("")

  // Get max bring-along limit for selected ticket
  const maxBringAlong = selectedEventTicket ? ticketBringAlongLimits[selectedEventTicket] || 0 : 0

  // Group sub-event tickets by date
  const groupedSubEventTickets = React.useMemo(() => {
    const groups: Record<string, TicketType[]> = {}
    mockSubEventTickets.forEach((ticket) => {
      if (ticket.sessionDate) {
        const dateKey = format(ticket.sessionDate, "yyyy-MM-dd")
        if (!groups[dateKey]) {
          groups[dateKey] = []
        }
        groups[dateKey].push(ticket)
      }
    })
    return groups
  }, [])

  const handleEventTicketSelect = (ticketId: string) => {
    if (selectedEventTicket === ticketId) {
      setSelectedEventTicket("")
      setSelectedSubEventTickets(new Set())
    } else {
      setSelectedEventTicket(ticketId)
      // Clear sub-event selections that don't match the new parent
      const validSubEvents = new Set(
        Array.from(selectedSubEventTickets).filter(
          (subTicketId) => {
            const ticket = mockSubEventTickets.find((t) => t.id === subTicketId)
            return ticket?.parentTicketId === ticketId
          }
        )
      )
      setSelectedSubEventTickets(validSubEvents)
    }
  }

  const handleSubEventTicketSelect = (ticketId: string) => {
    const newSelection = new Set(selectedSubEventTickets)
    if (newSelection.has(ticketId)) {
      newSelection.delete(ticketId)
    } else {
      newSelection.add(ticketId)
    }
    setSelectedSubEventTickets(newSelection)
  }

  const handleAddCompanion = () => {
    if (bringAlongGuests.length < maxBringAlong) {
      setBringAlongGuests([
        ...bringAlongGuests,
        { id: `guest_${Date.now()}`, firstName: "", lastName: "" }
      ])
    }
  }

  const handleUpdateCompanion = (id: string, field: "firstName" | "lastName", value: string) => {
    setBringAlongGuests(
      bringAlongGuests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    )
  }

  const handleRemoveCompanion = (id: string) => {
    setBringAlongGuests(bringAlongGuests.filter((guest) => guest.id !== id))
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!selectedEventTicket) {
      errors.tickets = "Please select an event ticket"
    }

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Validate bring-along guests
    bringAlongGuests.forEach((guest, index) => {
      if (!guest.firstName.trim()) {
        errors[`bringAlong_${guest.id}_firstName`] = "Required"
      }
      if (!guest.lastName.trim()) {
        errors[`bringAlong_${guest.id}_lastName`] = "Required"
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSystemError("")
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]')
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // TODO: Navigate to confirmation page
        eventTicket: selectedEventTicket,
        subEventTickets: Array.from(selectedSubEventTickets),
        formData,
        bringAlongGuests,
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Header */}
      <div className="relative bg-gradient-to-br from-[#023F59] to-[#107DAC] text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">{mockEventForRegistration.name}</h1>
          <p className="text-lg text-white/90 mb-6 max-w-3xl">
            {mockEventForRegistration.description}
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {format(mockEventForRegistration.startDate, "dd MMM")} – {format(mockEventForRegistration.endDate, "dd MMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{mockEventForRegistration.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-8">
        {/* System Error */}
        {systemError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{systemError}</AlertDescription>
          </Alert>
        )}

        {/* Ticket Selection - Event Level */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Select Your Ticket</h2>
          <p className="text-muted-foreground mb-4">Choose one event ticket to get started</p>
          
          {formErrors.tickets && (
            <Alert variant="destructive" className="mb-4" data-error="true">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formErrors.tickets}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {mockEventTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                selected={selectedEventTicket === ticket.id}
                onSelect={handleEventTicketSelect}
                selectionType="radio"
              />
            ))}
          </div>
        </section>

        {/* Ticket Selection - Sub Events */}
        {selectedEventTicket && (
          <section className="mb-10 animate-in slide-in-from-top duration-300">
            <h2 className="text-2xl font-bold mb-2">Add Session Tickets (Optional)</h2>
            <p className="text-muted-foreground mb-4">
              Select additional session tickets to enhance your experience
            </p>

            <div className="space-y-6">
              {Object.entries(groupedSubEventTickets).map(([dateKey, tickets]) => {
                const date = new Date(dateKey)
                return (
                  <div key={dateKey}>
                    <h3 className="font-semibold text-lg mb-3 text-[#023F59]">
                      {format(date, "EEEE, dd MMMM yyyy")}
                    </h3>
                    <div className="space-y-3">
                      {tickets.map((ticket) => {
                        const isParentSelected = ticket.parentTicketId === selectedEventTicket
                        return (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            selected={selectedSubEventTickets.has(ticket.id)}
                            onSelect={handleSubEventTicketSelect}
                            selectionType="checkbox"
                            disabled={!isParentSelected}
                            disabledReason={
                              !isParentSelected
                                ? `Requires ${mockEventTickets.find((t) => t.id === ticket.parentTicketId)?.name}`
                                : undefined
                            }
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Personal Details */}
        <section className="mb-10 bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Your Details</h2>

          <div className="grid gap-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salutation">Salutation</Label>
                <Select
                  value={formData.salutation}
                  onValueChange={(value) => setFormData({ ...formData, salutation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                    <SelectItem value="Prof">Prof</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={cn(formErrors.firstName && "border-red-500")}
                  data-error={!!formErrors.firstName}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={cn(formErrors.lastName && "border-red-500")}
                  data-error={!!formErrors.lastName}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(formErrors.email && "border-red-500")}
                data-error={!!formErrors.email}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
              {duplicateEmailWarning && (
                <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This email is already registered for this event. You can still proceed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <PhoneInput
              countryCode={formData.phoneCountryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(code) => setFormData({ ...formData, phoneCountryCode: code })}
              onPhoneNumberChange={(number) => setFormData({ ...formData, phoneNumber: number })}
            />

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh_tw">繁體中文</SelectItem>
                    <SelectItem value="zh_sc">简体中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wechatId">WeChat ID</Label>
                <Input
                  id="wechatId"
                  placeholder="your_wechat_id"
                  value={formData.wechatId}
                  onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="representativeType">Representative Type</Label>
              <Select
                value={formData.representativeType}
                onValueChange={(value) => setFormData({ ...formData, representativeType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speaker">Speaker</SelectItem>
                  <SelectItem value="exhibitor">Exhibitor</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="attendee">Attendee</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Bring-Along Section */}
        {selectedEventTicket && maxBringAlong > 0 && (
          <section className="mb-10 bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Bring Companions (Optional)</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You can bring up to {maxBringAlong} companion{maxBringAlong > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {bringAlongGuests.length} of {maxBringAlong} added
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {bringAlongGuests.map((guest) => (
                <BringAlongRow
                  key={guest.id}
                  guest={guest}
                  onUpdate={handleUpdateCompanion}
                  onRemove={handleRemoveCompanion}
                  error={{
                    firstName: formErrors[`bringAlong_${guest.id}_firstName`],
                    lastName: formErrors[`bringAlong_${guest.id}_lastName`],
                  }}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddCompanion}
              disabled={bringAlongGuests.length >= maxBringAlong}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Companion
            </Button>
          </section>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="min-w-[200px] bg-[#107DAC] hover:bg-[#0d6390]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
