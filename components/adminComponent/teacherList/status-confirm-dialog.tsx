"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { updateTeacherStatus } from "@/services/api" // Import the function to update teacher status

interface StatusConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: any
  onConfirm: () => void
}

export function StatusConfirmDialog({ open, onOpenChange, teacher, onConfirm }: StatusConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const newStatus = teacher?.status === "active" ? "inactive" : "active"

  const handleConfirm = async () => {
    setLoading(true)
    setError(null) // Reset any previous error state

    try {
      // Call the function to update teacher status
      await updateTeacherStatus(teacher.id, newStatus)
      onConfirm() // Close the dialog after the status update
    } catch (error) {
      setError("Failed to update teacher status") // Handle error (display a message to user)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Teacher Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change {teacher?.name}'s status from{" "}
            <span className="font-medium">{teacher?.status}</span> to <span className="font-medium">{newStatus}</span>?
          </AlertDialogDescription>
          {newStatus === "inactive" && (
            <div className="mt-2 text-destructive text-sm">
              This will prevent the teacher from accessing the system and they will no longer appear in active teacher
              lists.
            </div>
          )}
        </AlertDialogHeader>
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error} {/* Display error message if status update fails */}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
