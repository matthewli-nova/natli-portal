"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { InvitationStatusBadge } from "./InvitationStatusBadge"
import { TicketTypeBadge } from "./TicketTypeBadge"
import { type Invitation } from "../data/invitations"
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  User,
  Send,
  RotateCcw,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react"
import { format } from "date-fns"

interface InvitationGuestDetailProps {
  invitation: Invitation
  onBack: () => void
}

export function InvitationGuestDetail({ invitation, onBack }: InvitationGuestDetailProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "—"
    return format(date, "dd MMM yyyy, hh:mm a")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-5 w-px bg-border" />
          <div>
            <h2 className="text-lg font-semibold">
              {invitation.salutation && `${invitation.salutation} `}
              {invitation.firstName} {invitation.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{invitation.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Resend
          </Button>
          <Button size="sm" className="gap-2 bg-[#107DAC] hover:bg-[#0d6390]">
            <Send className="h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info — left 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Contact Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  icon={<User className="h-4 w-4 text-muted-foreground" />}
                  label="Full Name"
                  value={`${invitation.salutation ? invitation.salutation + " " : ""}${invitation.firstName} ${invitation.lastName}`}
                />
                <InfoRow
                  icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                  label="Email"
                  value={invitation.email}
                />
                {invitation.title && (
                  <InfoRow
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                    label="Title"
                    value={invitation.title}
                  />
                )}
                {invitation.organization && (
                  <InfoRow
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                    label="Organization"
                    value={invitation.organization}
                  />
                )}
                {invitation.phoneNumber && (
                  <InfoRow
                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                    label="Phone"
                    value={`${invitation.phoneCountryCode || ""} ${invitation.phoneNumber}`}
                  />
                )}
                <InfoRow
                  icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                  label="Preferred Language"
                  value={
                    invitation.preferredLanguage === "EN"
                      ? "English"
                      : invitation.preferredLanguage === "TC"
                        ? "Traditional Chinese"
                        : "Simplified Chinese"
                  }
                />
                {invitation.wechatId && (
                  <InfoRow
                    icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                    label="WeChat ID"
                    value={invitation.wechatId}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Assigned Ticket Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {invitation.ticketTypes.map((ticket) => (
                  <TicketTypeBadge key={ticket.id} name={ticket.name} colorHex={ticket.colorHex} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Companions */}
          {invitation.companions && invitation.companions.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Companions ({invitation.companions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitation.companions.map((companion, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <div className="font-medium text-sm">
                          {companion.firstName} {companion.lastName}
                        </div>
                        {companion.email && (
                          <div className="text-xs text-muted-foreground">{companion.email}</div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Companion {idx + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar — right col */}
        <div className="flex flex-col gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Invitation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <InvitationStatusBadge status={invitation.invitationStatus} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Channel</span>
                <span className="text-sm capitalize font-medium">{invitation.invitationChannel}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Times Sent</span>
                <span className="text-sm font-medium">{invitation.sendCount || 0}</span>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Last Sent</span>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(invitation.lastSentDate)}
                </div>
              </div>
              {invitation.createdAt && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(invitation.createdAt)}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags & Role */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {invitation.representativeType && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Representative Type</span>
                  <Badge variant="secondary" className="capitalize">
                    {invitation.representativeType}
                  </Badge>
                </div>
              )}
              {invitation.tags && invitation.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Tags</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {invitation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {invitation.notes && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Notes</span>
                    <p className="text-sm">{invitation.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}
