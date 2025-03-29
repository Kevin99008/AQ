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

interface StatusConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: any
  onConfirm: () => void
}

export function StatusConfirmDialog({ open, onOpenChange, teacher, onConfirm }: StatusConfirmDialogProps) {
  const newStatus = teacher?.status === "active" ? "inactive" : "active"

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Teacher Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to change {teacher?.name}'s status from{" "}
            <span className="font-medium">{teacher?.status}</span> to <span className="font-medium">{newStatus}</span>?
            {newStatus === "inactive" && (
              <p className="mt-2 text-destructive">
                This will prevent the teacher from accessing the system and they will no longer appear in active teacher
                lists.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

