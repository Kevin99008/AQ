"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface TeacherDetailsDialogProps {
  teacher: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherDetailsDialog({ teacher, open, onOpenChange }: TeacherDetailsDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={teacher.avatar} alt={teacher.name} />
            <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <DialogTitle className="text-xl">{teacher.name}</DialogTitle>
          <DialogDescription>{teacher.specialty}</DialogDescription>
          <Badge variant={teacher.status === "active" ? "green" : "secondary"} className="mt-2">
            {teacher.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <div>{teacher.email}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <div>{teacher.phone}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
            <div>{teacher.category}</div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <div className="capitalize">{teacher.status}</div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:flex-1">
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              router.push(`/admin/teacher-details/${teacher.id}`)
            }}
            className="sm:flex-1"
          >
            View Full Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

