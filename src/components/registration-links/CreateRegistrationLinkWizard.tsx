"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import { Card } from "../ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../ui/utils"
import { mockEventsForLinking } from "../data/b2b-events"
import { mockEventTickets, mockSubEventTickets } from "../data/registration-events"

interface WizardData {
  eventId: string
  ticketTypeId: string
  sessionIds: string[]
  allowCompanions: boolean
  maxCompanions: number
  companionDetailsLevel: 'names-only' | 'full-details'
  prefillCompanionNames: Array<{ firstName: string; lastName: string }>
}

interface CreateRegistrationLinkWizardProps {
  onComplete: (data: WizardData) => void
  onCancel: () => void
}

export function CreateRegistrationLinkWizard({ onComplete, onCancel }: CreateRegistrationLinkWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<1 | 2 | 3>(1)
  const [wizardData, setWizardData] = React.useState<WizardData>({
    eventId: "",
    ticketTypeId: "",
    sessionIds: [],
    allowCompanions: false,
    maxCompanions: 0,
    companionDetailsLevel: 'names-only',
    prefillCompanionNames: [],
  })

  // Get selected event and ticket
  const selectedEvent = mockEventsForLinking.find((e) => e.id === wizardData.eventId)
  const selectedTicket = mockEventTickets.find((t) => t.id === wizardData.ticketTypeId)

  // Filter sub-events by selected ticket
  const availableSubEvents = React.useMemo(() => {
    if (!wizardData.ticketTypeId) return []
    return mockSubEventTickets.filter((s) => s.parentTicketId === wizardData.ticketTypeId)
  }, [wizardData.ticketTypeId])

  // Validation
  const canProceedFromStep1 = wizardData.eventId !== ""
  const canProceedFromStep2 = wizardData.ticketTypeId !== ""
  const canComplete = canProceedFromStep1 && canProceedFromStep2

  const handleNext = () => {
    if (currentStep === 1 && canProceedFromStep1) setCurrentStep(2)
    else if (currentStep === 2 && canProceedFromStep2) setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2 | 3)
  }

  const handleComplete = () => {
    if (canComplete) {
      onComplete(wizardData)
    }
  }

  const toggleSession = (sessionId: string) => {
    setWizardData((prev) => ({
      ...prev,
      sessionIds: prev.sessionIds.includes(sessionId)
        ? prev.sessionIds.filter((id) => id !== sessionId)
        : [...prev.sessionIds, sessionId],
    }))
  }

  const addPrefillCompanion = () => {
    setWizardData((prev) => ({
      ...prev,
      prefillCompanionNames: [...prev.prefillCompanionNames, { firstName: "", lastName: "" }],
    }))
  }

  const updatePrefillCompanion = (index: number, field: 'firstName' | 'lastName', value: string) => {
    setWizardData((prev) => ({
      ...prev,
      prefillCompanionNames: prev.prefillCompanionNames.map((comp, i) =>
        i === index ? { ...comp, [field]: value } : comp
      ),
    }))
  }

  const removePrefillCompanion = (index: number) => {
    setWizardData((prev) => ({
      ...prev,
      prefillCompanionNames: prev.prefillCompanionNames.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors",
                  currentStep >= step
                    ? "bg-[#107DAC] text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2 transition-colors",
                    currentStep > step ? "bg-[#107DAC]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className={cn(currentStep === 1 ? "text-lepos-cyan-text font-medium" : "text-muted-foreground")}>
            Select Event
          </span>
          <span className={cn(currentStep === 2 ? "text-lepos-cyan-text font-medium" : "text-muted-foreground")}>
            Select Ticket
          </span>
          <span className={cn(currentStep === 3 ? "text-lepos-cyan-text font-medium" : "text-muted-foreground")}>
            Configure
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border rounded-lg p-6 mb-6 min-h-[400px]">
        {/* Step 1: Select Event */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Event</h2>
            <RadioGroup value={wizardData.eventId} onValueChange={(value) => setWizardData({ ...wizardData, eventId: value })}>
              <div className="space-y-3">
                {mockEventsForLinking.map((event) => (
                  <Card
                    key={event.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all border-2",
                      wizardData.eventId === event.id
                        ? "border-[#107DAC] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setWizardData({ ...wizardData, eventId: event.id })}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={event.id} id={event.id} />
                      <div className="flex-1">
                        <Label htmlFor={event.id} className="text-base font-semibold cursor-pointer">
                          {event.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{event.venue}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Select Ticket Type */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Ticket Type</h2>
            <RadioGroup value={wizardData.ticketTypeId} onValueChange={(value) => setWizardData({ ...wizardData, ticketTypeId: value })}>
              <div className="space-y-3">
                {mockEventTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all border-2",
                      wizardData.ticketTypeId === ticket.id
                        ? "border-[#107DAC] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setWizardData({ ...wizardData, ticketTypeId: ticket.id })}
                    style={{
                      borderLeftWidth: "6px",
                      borderLeftColor: wizardData.ticketTypeId === ticket.id ? ticket.colorHex : "#e5e7eb",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={ticket.id} id={ticket.id} />
                      <div className="flex-1">
                        <Label htmlFor={ticket.id} className="text-base font-semibold cursor-pointer">
                          {ticket.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Available: {ticket.available} / {ticket.total}</span>
                          <span>•</span>
                          <span>{ticket.price ? `$${ticket.price}` : 'Free'}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Configure Sessions & Companions */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Configure Registration Link</h2>

            {/* Sessions */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Apply to Sessions (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select which sub-event sessions this registration link will include
              </p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {availableSubEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No sessions available for this ticket type</p>
                ) : (
                  availableSubEvents.map((session) => (
                    <div key={session.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                      <Checkbox
                        id={session.id}
                        checked={wizardData.sessionIds.includes(session.id)}
                        onCheckedChange={() => toggleSession(session.id)}
                      />
                      <Label htmlFor={session.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{session.name}</div>
                        {session.sessionDate && session.sessionTime && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(session.sessionDate).toLocaleDateString()} · {session.sessionTime}
                          </div>
                        )}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Companions */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="allowCompanions"
                  checked={wizardData.allowCompanions}
                  onCheckedChange={(checked) =>
                    setWizardData({ ...wizardData, allowCompanions: checked as boolean })
                  }
                />
                <Label htmlFor="allowCompanions" className="text-base font-semibold cursor-pointer">
                  Allow Companions
                </Label>
              </div>

              {wizardData.allowCompanions && (
                <div className="space-y-4 ml-7">
                  {/* Max Companions */}
                  <div className="space-y-2">
                    <Label htmlFor="maxCompanions">Maximum Companions Allowed</Label>
                    <Input
                      id="maxCompanions"
                      type="number"
                      min="0"
                      max="10"
                      value={wizardData.maxCompanions}
                      onChange={(e) =>
                        setWizardData({ ...wizardData, maxCompanions: parseInt(e.target.value) || 0 })
                      }
                      className="w-32"
                    />
                  </div>

                  {/* Companion Details Level */}
                  <div className="space-y-2">
                    <Label>Companion Information Required</Label>
                    <RadioGroup
                      value={wizardData.companionDetailsLevel}
                      onValueChange={(value: 'names-only' | 'full-details') =>
                        setWizardData({ ...wizardData, companionDetailsLevel: value })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="names-only" id="names-only" />
                        <Label htmlFor="names-only" className="cursor-pointer">
                          First & Last Name Only
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="full-details" id="full-details" />
                        <Label htmlFor="full-details" className="cursor-pointer">
                          All Standard Fields (Email, Phone, etc.)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Pre-fill Companion Names */}
                  <div className="space-y-2">
                    <Label>Pre-fill Companion Names (Optional)</Label>
                    <div className="space-y-2">
                      {wizardData.prefillCompanionNames.map((companion, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="First Name"
                            value={companion.firstName}
                            onChange={(e) => updatePrefillCompanion(index, 'firstName', e.target.value)}
                          />
                          <Input
                            placeholder="Last Name"
                            value={companion.lastName}
                            onChange={(e) => updatePrefillCompanion(index, 'lastName', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePrefillCompanion(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPrefillCompanion}
                      >
                        + Add Companion
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={currentStep === 1 ? onCancel : handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={currentStep === 3 ? handleComplete : handleNext}
          disabled={
            (currentStep === 1 && !canProceedFromStep1) ||
            (currentStep === 2 && !canProceedFromStep2)
          }
          className="bg-[#107DAC] hover:bg-[#0d6390]"
        >
          {currentStep === 3 ? "Create & Edit Link" : "Next"}
          {currentStep < 3 && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
