"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import { CheckCircle2, Download, Calendar, Mail } from "lucide-react"
import { format } from "date-fns"
import QRCode from "qrcode"

interface ConfirmationData {
  registrationNumber: string
  guestName: string
  salutation?: string
  email: string
  eventName: string
  eventDates: string
  venue: string
  eventTicket: {
    name: string
    colorHex: string
  }
  subEventTickets: Array<{
    name: string
    colorHex: string
    sessionDate?: string
    sessionTime?: string
  }>
  bringAlongCompanions?: Array<{
    name: string
    registrationNumber: string
  }>
}

interface ConfirmationPageProps {
  data?: ConfirmationData
}

// Mock data for demonstration
const mockConfirmationData: ConfirmationData = {
  registrationNumber: "A1B2C3D4E5F6G7H8",
  guestName: "Sarah Chen",
  salutation: "Dr",
  email: "sarah.chen@example.com",
  eventName: "Hong Kong Wine & Dine Festival 2026",
  eventDates: "25–28 Oct 2026",
  venue: "Central Harbourfront Event Space",
  eventTicket: {
    name: "General Admission",
    colorHex: "#107DAC",
  },
  subEventTickets: [
    {
      name: "Red Wine Tasting Masterclass",
      colorHex: "#DC2626",
      sessionDate: "25 Oct 2026",
      sessionTime: "2:00 PM - 3:30 PM",
    },
    {
      name: "White Wine & Seafood Pairing",
      colorHex: "#FBBF24",
      sessionDate: "25 Oct 2026",
      sessionTime: "4:00 PM - 5:30 PM",
    },
  ],
  bringAlongCompanions: [
    {
      name: "James Chen",
      registrationNumber: "A9Z8Y7X6W5V4U3T2",
    },
  ],
}

export function ConfirmationPage({ data = mockConfirmationData }: ConfirmationPageProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("")

  React.useEffect(() => {
    // Generate QR code from registration number
    QRCode.toDataURL(data.registrationNumber, {
      width: 300,
      margin: 2,
      color: {
        dark: "#023F59",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR code generation failed:", err))
  }, [data.registrationNumber])

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `${data.registrationNumber}_ticket.png`
      link.click()
    }
  }

  const handleAddToCalendar = () => {
    // TODO: Generate .ics file
    console.log("Add to calendar")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">You're Registered!</h1>
          <p className="text-lg text-muted-foreground">
            Your registration has been confirmed
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white border rounded-lg p-8 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Your Event Ticket</h2>
          {qrCodeUrl ? (
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img src={qrCodeUrl} alt="Registration QR Code" className="w-[300px] h-[300px]" />
            </div>
          ) : (
            <div className="w-[300px] h-[300px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Generating QR code...</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-4 font-mono">
            {data.registrationNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Show this QR code at the event entrance
          </p>

          <div className="flex gap-2 justify-center mt-6">
            <Button variant="outline" onClick={handleDownloadQR} disabled={!qrCodeUrl}>
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <Button variant="outline" onClick={handleAddToCalendar}>
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>

        {/* Registration Summary */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Registration Summary</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Guest Name</p>
              <p className="font-medium">
                {data.salutation && `${data.salutation} `}
                {data.guestName}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Event</p>
              <p className="font-medium">{data.eventName}</p>
              <p className="text-sm text-muted-foreground mt-1">{data.eventDates}</p>
              <p className="text-sm text-muted-foreground">{data.venue}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Tickets</p>
              <div className="space-y-2">
                {/* Event Ticket */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: data.eventTicket.colorHex }}
                  />
                  <span className="font-medium">{data.eventTicket.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Event
                  </Badge>
                </div>

                {/* Sub-Event Tickets */}
                {data.subEventTickets.map((ticket, index) => (
                  <div key={index} className="flex items-start gap-2 pl-5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: ticket.colorHex }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ticket.name}</p>
                      {ticket.sessionDate && ticket.sessionTime && (
                        <p className="text-xs text-muted-foreground">
                          {ticket.sessionDate} · {ticket.sessionTime}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Session
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Bring-Along Companions */}
            {data.bringAlongCompanions && data.bringAlongCompanions.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Companions ({data.bringAlongCompanions.length})
                </p>
                <div className="space-y-2">
                  {data.bringAlongCompanions.map((companion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <span className="font-medium">{companion.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {companion.registrationNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <Alert className="bg-blue-50 border-blue-200">
          <Mail className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            A confirmation email has been sent to <strong>{data.email}</strong>
          </AlertDescription>
        </Alert>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            You can return to this page anytime using the link in your confirmation email.
          </p>
          <p className="mt-2">
            For questions, please contact the event organizer.
          </p>
        </div>
      </div>
    </div>
  )
}
