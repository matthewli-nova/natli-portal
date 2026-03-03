"use client"

import * as React from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { type Session } from "../data/b2b-events"
import { AlertTriangle, Trash2 } from "lucide-react"
import { toast } from 'sonner'

interface DeleteSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session | null
  subEventsCount?: number
  onConfirmDelete: (sessionId: string) => void
}

export function DeleteSessionDialog({
  open,
  onOpenChange,
  session,
  subEventsCount = 0,
  onConfirmDelete
}: DeleteSessionDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  if (!session) return null

  const hasAdmissions = session.admittedCount > 0
  const hasSubEvents = subEventsCount > 0
  const isBlocked = hasAdmissions || hasSubEvents

  const handleDelete = async () => {
    if (isBlocked) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success("Session deleted successfully")
      onConfirmDelete(session.id)
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to delete session. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Session</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {!isBlocked ? (
              <>
                Are you sure you want to delete <strong>{session.name.en}</strong>? 
                This action cannot be undone.
              </>
            ) : (
              <>Cannot delete this session</>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Blocking Reasons */}
        {isBlocked && (
          <div className="space-y-3">
            {hasAdmissions && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{session.admittedCount}</strong> attendee{session.admittedCount !== 1 ? 's have' : ' has'} been admitted to this session. 
                  You cannot delete a session with admitted attendees.
                </AlertDescription>
              </Alert>
            )}

            {hasSubEvents && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This session has <strong>{subEventsCount}</strong> sub-event{subEventsCount !== 1 ? 's' : ''}. 
                  Remove all sub-event sessions before deleting this session.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            {isBlocked ? "Close" : "Cancel"}
          </Button>
          {!isBlocked && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash2 className="size-4" />
              {isDeleting ? "Deleting..." : "Delete Session"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
