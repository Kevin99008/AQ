"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AttendanceRecord } from "@/types/dashboard"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface RecentAttendanceRecord {
  timestamp: string
  relativeTime: string
  status: string
}

interface AttendanceHistoryProps {
  record: AttendanceRecord
  onClose: () => void
}

export default function AttendanceHistory({ record, onClose }: AttendanceHistoryProps) {
  // Function to get badge color based on course type
  const getBadgeColor = (courseType: string) => {
    switch (courseType) {
      case "AquaKids":
        return "bg-blue-100 text-blue-800"
      case "Playsound":
        return "bg-purple-100 text-purple-800"
      case "Other":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // State for recent attendance data
  const [recentAttendance, setRecentAttendance] = useState<RecentAttendanceRecord[]>([])

  // Fetch recent attendance data from API
  useEffect(() => {
    const fetchRecentAttendance = async () => {
      try {
        const response = await fetch(`https://aqtech-production.up.railway.app/api/attendance-recent/?studentId=${record.studentId}`)
        const data = await response.json()
        setRecentAttendance(data)
      } catch (error) {
        console.error("Error fetching recent attendance:", error)
      }
    }

    fetchRecentAttendance()
  }, [record.studentId])

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Attendance Details
            <DialogClose asChild>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Name:</div>
            <div className="text-sm">{record.name}</div>

            <div className="text-sm font-medium">Student Id:</div>
            <div className="text-sm">{record.studentId}</div>

            <div className="text-sm font-medium">Course:</div>
            <div className="text-sm">{record.course}</div>

            {record.courseType && (
              <>
                <div className="text-sm font-medium">Type:</div>
                <div className="text-sm">
                  <Badge className={getBadgeColor(record.courseType)} variant="outline">
                    {record.courseType}
                  </Badge>
                </div>
              </>
            )}

            <div className="text-sm font-medium">Time:</div>
            <div className="text-sm">{record.timestamp}</div>
          </div>

          {/* Display recent attendance history */}
          <div className="rounded-md bg-muted p-4">
            <h4 className="mb-2 text-sm font-medium">Recent Attendance</h4>
            <ul className="space-y-2 text-sm">
              {recentAttendance.map((attendance) => (
                <li key={attendance.timestamp} className="flex justify-between">
                  <span className="text-muted-foreground">{attendance.relativeTime}</span>
                  <span>{attendance.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
