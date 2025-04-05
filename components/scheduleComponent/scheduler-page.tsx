"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from "date-fns"
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
  ArrowLeft,
  Filter,
  Plus,
  X,
  Trash2,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"

// Change the time slots to start from 10 AM instead of 9 AM
const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Sample time slots with dates and availability count
// Update the generateTimeSlots function to start from 10 AM
const generateTimeSlots = () => {
  const today = new Date()
  const startDate = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday

  const slots = []

  // Generate slots for 4 weeks
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(addWeeks(startDate, week), day)
      const formattedDate = format(currentDate, "yyyy-MM-dd")

      // Generate slots for each hour from 10 AM to 5 PM
      for (let hour = 10; hour < 17; hour++) {
        // Only create slots with 70% probability to have some empty spaces
        if (Math.random() < 0.7) {
          const startTime = `${hour.toString().padStart(2, "0")}:00`
          const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

          slots.push({
            id: `slot-${week}-${day}-${hour}`,
            date: formattedDate,
            startTime,
            endTime,
            hour,
            availableQuota: Math.floor(Math.random() * 5) + 1,
          })
        }
      }
    }
  }

  return slots
}

// Default course metadata (for fields not in API)
const defaultCourseMetadata = {
  duration: "1 hour",
  code: "COURSE",
}

interface SchedulerPageProps {
  students: any[]
  teacher: any
  course: any
  onBack: () => void
}

const studentColors = [
  {
    bg: "bg-red-50",
    border: "border-red-200",
    hover: "hover:bg-red-100",
    text: "text-red-700",
  },
  {
    bg: "bg-green-50",
    border: "border-green-200",
    hover: "hover:bg-green-100",
    text: "text-green-700",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    hover: "hover:bg-blue-100",
    text: "text-blue-700",
  },
  {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    hover: "hover:bg-yellow-100",
    text: "text-yellow-700",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    hover: "hover:bg-purple-100",
    text: "text-purple-700",
  },
  {
    bg: "bg-orange-50",
    border: "border-orange-200",
    hover: "hover:bg-orange-100",
    text: "text-orange-700",
  },
]

export default function SchedulerPage({ students, teacher, course, onBack }: SchedulerPageProps) {
  const [availableSlots, setAvailableSlots] = useState(generateTimeSlots())
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedStudents, setSelectedStudents] = useState<string[]>(students.map((s) => s.id))
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({}) // slotId -> studentIds
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<any>(null)
  const [pendingBookings, setPendingBookings] = useState<string[]>([]) // Track students pending booking in dialog
  // Update the timeRange state to start from 10 AM
  const [timeRange, setTimeRange] = useState<[number, number]>([10, 17]) // 10 AM to 5 PM
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ])
  const [mimicDialogOpen, setMimicDialogOpen] = useState(false)
  const [mimicSourceStudent, setMimicSourceStudent] = useState<string | null>(null)

  // State for drag and drop
  const [draggedSlot, setDraggedSlot] = useState<{ slotId: string; studentId: string } | null>(null)
  const [dropTargetStudent, setDropTargetStudent] = useState<string | null>(null)

  // Ensure course has the necessary metadata
  const enrichedCourse = {
    ...defaultCourseMetadata,
    ...course,
    totalSessions: course.quota, // Use quota as totalSessions
  }

  // Assign colors to students
  const studentColorMap = useMemo(() => {
    const colorMap: Record<string, (typeof studentColors)[0]> = {}
    students.forEach((student, index) => {
      colorMap[student.id] = studentColors[index % studentColors.length]
    })
    return colorMap
  }, [students])

  // Generate days for the current week
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStart, i)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      monthName: format(date, "MMM"),
      formattedDate: format(date, "yyyy-MM-dd"),
      dayOfWeek: format(date, "EEEE").toLowerCase() as
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday",
    }
  })

  // Filter slots for the current week
  const currentWeekSlots = availableSlots.filter((slot) => {
    const slotDate = parseISO(slot.date)
    const weekEnd = addDays(currentWeekStart, 6)
    const slotHour = Number.parseInt(slot.startTime.split(":")[0])
    const dayOfWeek = format(slotDate, "EEEE").toLowerCase()

    return (
      slotDate >= currentWeekStart &&
      slotDate <= weekEnd &&
      slotHour >= timeRange[0] &&
      slotHour <= timeRange[1] &&
      selectedDays.includes(dayOfWeek)
    )
  })

  // Group slots by date and hour
  const slotsByDateAndHour = currentWeekSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = {}
      }
      if (!acc[slot.date][slot.hour]) {
        acc[slot.date][slot.hour] = []
      }
      acc[slot.date][slot.hour].push(slot)
      return acc
    },
    {} as Record<string, Record<number, any[]>>,
  )

  // Get students booked for a specific slot
  const getBookedStudents = (slotId: string) => {
    return selectedSlots[slotId] || []
  }

  // Count how many sessions each student has booked
  const getStudentSessionCount = (studentId: string) => {
    return Object.values(selectedSlots).reduce((count, studentIds) => {
      return count + (studentIds.includes(studentId) ? 1 : 0)
    }, 0)
  }

  // Check if a student has reached the maximum number of sessions
  const hasReachedMaxSessions = (studentId: string) => {
    return getStudentSessionCount(studentId) >= enrichedCourse.totalSessions
  }

  // Get all students who haven't reached max sessions
  const availableStudents = students.filter(
    (student) => !hasReachedMaxSessions(student.id) && selectedStudents.includes(student.id),
  )

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  // Toggle day selection
  const toggleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        // Prevent deselecting all days
        setSelectedDays(selectedDays.filter((d) => d !== day))
      }
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  // Open booking dialog
  const openBookingDialog = (slot: any) => {
    setSelectedSlotForBooking(slot)
    setPendingBookings([]) // Reset pending bookings
  }

  // Toggle a student in pending bookings
  const togglePendingBooking = (studentId: string) => {
    if (pendingBookings.includes(studentId)) {
      setPendingBookings(pendingBookings.filter((id) => id !== studentId))
    } else {
      setPendingBookings([...pendingBookings, studentId])
    }
  }

  // Book a slot for a single student (without closing dialog)
  const bookSlotForStudent = (slotId: string, studentId: string) => {
    // Check if student already has this slot booked
    const alreadyBooked = selectedSlots[slotId]?.includes(studentId)

    if (!alreadyBooked) {
      // Update the selected slots
      const updatedSelectedSlots = { ...selectedSlots }
      updatedSelectedSlots[slotId] = [...(updatedSelectedSlots[slotId] || []), studentId]

      // Update the available quota
      const updatedAvailableSlots = availableSlots.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            availableQuota: Math.max(0, slot.availableQuota - 1),
          }
        }
        return slot
      })

      setAvailableSlots(updatedAvailableSlots)
      setSelectedSlots(updatedSelectedSlots)

      // Add to pending bookings
      if (!pendingBookings.includes(studentId)) {
        setPendingBookings([...pendingBookings, studentId])
      }

      // Show success message
      toast({
        title: "Session booked",
        description: `Booked for ${students.find((s) => s.id === studentId)?.name}`,
      })
    }
  }

  // Book a slot for multiple students
  const bookSlotForMultipleStudents = (slotId: string, studentIds: string[]) => {
    let newBookingsCount = 0
    const updatedSelectedSlots = { ...selectedSlots }

    studentIds.forEach((studentId) => {
      // Check if student already has this slot booked
      const alreadyBooked = updatedSelectedSlots[slotId]?.includes(studentId)

      if (!alreadyBooked && !hasReachedMaxSessions(studentId)) {
        if (!updatedSelectedSlots[slotId]) {
          updatedSelectedSlots[slotId] = []
        }
        updatedSelectedSlots[slotId].push(studentId)
        newBookingsCount++
      }
    })

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          availableQuota: Math.max(0, slot.availableQuota - newBookingsCount),
        }
      }
      return slot
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)
    setPendingBookings([]) // Clear pending bookings

    // Close the booking dialog
    setSelectedSlotForBooking(null)

    // Show success message
    toast({
      title: "Sessions booked",
      description: `Booked for ${newBookingsCount} student${newBookingsCount !== 1 ? "s" : ""}`,
    })
  }

  // Remove a booking
  const removeBooking = (slotId: string, studentId: string) => {
    // Update the selected slots
    const updatedSelectedSlots = { ...selectedSlots }

    if (updatedSelectedSlots[slotId]) {
      updatedSelectedSlots[slotId] = updatedSelectedSlots[slotId].filter((id) => id !== studentId)

      if (updatedSelectedSlots[slotId].length === 0) {
        delete updatedSelectedSlots[slotId]
      }
    }

    setSelectedSlots(updatedSelectedSlots)

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          availableQuota: slot.availableQuota + 1,
        }
      }
      return slot
    })

    setAvailableSlots(updatedAvailableSlots)

    // Remove from pending bookings if in dialog
    if (pendingBookings.includes(studentId)) {
      setPendingBookings(pendingBookings.filter((id) => id !== studentId))
    }

    // Show success message
    toast({
      title: "Booking removed",
      description: "The session has been removed from the schedule",
    })
  }

  // Remove all bookings for a specific student
  const removeAllBookingsForStudent = (studentId: string) => {
    // Find all slots booked for this student
    const studentSlots = Object.entries(selectedSlots)
      .filter(([_, studentIds]) => studentIds.includes(studentId))
      .map(([slotId]) => slotId)

    if (studentSlots.length === 0) {
      toast({
        title: "No bookings to remove",
        description: "This student has no booked sessions",
      })
      return
    }

    // Update the selected slots
    const updatedSelectedSlots = { ...selectedSlots }

    // Update the available quota
    const updatedAvailableSlots = [...availableSlots]

    studentSlots.forEach((slotId) => {
      // Remove student from this slot
      if (updatedSelectedSlots[slotId]) {
        updatedSelectedSlots[slotId] = updatedSelectedSlots[slotId].filter((id) => id !== studentId)

        if (updatedSelectedSlots[slotId].length === 0) {
          delete updatedSelectedSlots[slotId]
        }

        // Update quota
        const slotIndex = updatedAvailableSlots.findIndex((s) => s.id === slotId)
        if (slotIndex !== -1) {
          updatedAvailableSlots[slotIndex] = {
            ...updatedAvailableSlots[slotIndex],
            availableQuota: updatedAvailableSlots[slotIndex].availableQuota + 1,
          }
        }
      }
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)

    toast({
      title: "All bookings removed",
      description: `Removed ${studentSlots.length} sessions for ${students.find((s) => s.id === studentId)?.name}`,
    })
  }

  // Save the schedule
  const saveSchedule = () => {
    // Check if all selected students have the required number of sessions
    const incompleteStudents = selectedStudents.filter(
      (studentId) => getStudentSessionCount(studentId) < enrichedCourse.totalSessions,
    )

    if (incompleteStudents.length > 0) {
      toast({
        title: "Incomplete schedule",
        description: `${incompleteStudents.length} student(s) don't have all required sessions scheduled.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Schedule saved",
      description: "All sessions have been scheduled successfully.",
    })
  }

  // Format time range for display
  const formatTimeRange = () => {
    const formatHour = (hour: number) => {
      const period = hour < 12 ? "AM" : "PM"
      const displayHour = hour <= 12 ? hour : hour - 12
      return `${displayHour}:00 ${period}`
    }
    return `${formatHour(timeRange[0])} - ${formatHour(timeRange[1])}`
  }

  // Check if all slots for a student have available quota
  const checkAllSlotsHaveQuota = (studentId: string) => {
    // Find all slots booked for the student
    const studentSlots = Object.entries(selectedSlots)
      .filter(([_, studentIds]) => studentIds.includes(studentId))
      .map(([slotId]) => slotId)

    // Check if all slots have available quota
    return studentSlots.every((slotId) => {
      const slot = availableSlots.find((s) => s.id === slotId)
      return slot !== undefined && slot.availableQuota > 0
    })
  }

  // Open mimic dialog
  const openMimicDialog = (studentId: string) => {
    setMimicSourceStudent(studentId)
    setMimicDialogOpen(true)
  }

  // Copy all slots from one student to another (mimic)
  const copyAllSlotsToStudent = (fromStudentId: string, toStudentId: string) => {
    // Find all slots booked for the source student
    const sourceStudentSlots = Object.entries(selectedSlots)
      .filter(([_, studentIds]) => studentIds.includes(fromStudentId))
      .map(([slotId]) => slotId)

    if (sourceStudentSlots.length === 0) {
      toast({
        title: "No slots to copy",
        description: "The source student has no booked slots",
        variant: "destructive",
      })
      return
    }

    // Check if target student has enough room for all slots
    const targetStudentBookedCount = getStudentSessionCount(toStudentId)
    if (targetStudentBookedCount + sourceStudentSlots.length > enrichedCourse.totalSessions) {
      toast({
        title: "Too many sessions",
        description: `Cannot copy all slots. ${students.find((s) => s.id === toStudentId)?.name} can only have ${enrichedCourse.totalSessions - targetStudentBookedCount} more sessions.`,
        variant: "destructive",
      })
      return
    }

    // Check if all slots have available quota
    const slotsWithoutQuota = sourceStudentSlots.filter((slotId) => {
      const slot = availableSlots.find((s) => s.id === slotId)
      return !slot || slot.availableQuota < 1
    })

    if (slotsWithoutQuota.length > 0) {
      toast({
        title: "Insufficient quota",
        description: `${slotsWithoutQuota.length} slots don't have available quota`,
        variant: "destructive",
      })
      return
    }

    // Copy all slots
    let copiedCount = 0
    const updatedSelectedSlots = { ...selectedSlots }
    const updatedAvailableSlots = [...availableSlots]

    sourceStudentSlots.forEach((slotId) => {
      // Skip if already booked
      if (updatedSelectedSlots[slotId]?.includes(toStudentId)) {
        return
      }

      // Book the slot
      updatedSelectedSlots[slotId] = [...(updatedSelectedSlots[slotId] || []), toStudentId]

      // Update quota
      const slotIndex = updatedAvailableSlots.findIndex((s) => s.id === slotId)
      if (slotIndex !== -1) {
        updatedAvailableSlots[slotIndex] = {
          ...updatedAvailableSlots[slotIndex],
          availableQuota: Math.max(0, updatedAvailableSlots[slotIndex].availableQuota - 1),
        }
      }

      copiedCount++
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)
    setMimicDialogOpen(false)

    toast({
      title: "Schedule copied",
      description: `Copied ${copiedCount} slots to ${students.find((s) => s.id === toStudentId)?.name}`,
    })
  }

  // Handle drag start
  const handleDragStart = (slotId: string, studentId: string) => {
    setDraggedSlot({ slotId, studentId })
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, studentId: string) => {
    e.preventDefault()
    setDropTargetStudent(studentId)
  }

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedSlot(null)
    setDropTargetStudent(null)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, toStudentId: string) => {
    e.preventDefault()

    if (draggedSlot && draggedSlot.studentId !== toStudentId) {
      copySlotToStudent(draggedSlot.slotId, draggedSlot.studentId, toStudentId)
    }

    setDraggedSlot(null)
    setDropTargetStudent(null)
  }

  // Copy a specific slot from one student to another
  const copySlotToStudent = (slotId: string, fromStudentId: string, toStudentId: string) => {
    // Check if the slot is already booked for the target student
    const alreadyBooked = selectedSlots[slotId]?.includes(toStudentId)

    if (alreadyBooked) {
      toast({
        title: "Already booked",
        description: `This slot is already booked for ${students.find((s) => s.id === toStudentId)?.name}`,
      })
      return
    }

    // Check if target student has reached max sessions
    if (hasReachedMaxSessions(toStudentId)) {
      toast({
        title: "Maximum sessions reached",
        description: `${students.find((s) => s.id === toStudentId)?.name} already has the maximum number of sessions`,
        variant: "destructive",
      })
      return
    }

    // Check if the slot has available quota
    const slot = availableSlots.find((s) => s.id === slotId)
    if (!slot || slot.availableQuota < 1) {
      toast({
        title: "No available quota",
        description: "This slot has no available quota",
        variant: "destructive",
      })
      return
    }

    // Book the slot for the target student
    const updatedSelectedSlots = { ...selectedSlots }
    updatedSelectedSlots[slotId] = [...(updatedSelectedSlots[slotId] || []), toStudentId]

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((s) => {
      if (s.id === slotId) {
        return {
          ...s,
          availableQuota: Math.max(0, s.availableQuota - 1),
        }
      }
      return s
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)

    toast({
      title: "Slot copied",
      description: `Copied slot to ${students.find((s) => s.id === toStudentId)?.name}`,
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{enrichedCourse.name}</h1>
            <p className="text-muted-foreground">{enrichedCourse.code}</p>
            <div className="flex items-center mt-2 gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {enrichedCourse.duration} per session
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {enrichedCourse.totalSessions} sessions total
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Section */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">Course Details</h2>
                <p className="text-muted-foreground mb-4">{enrichedCourse.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p>{enrichedCourse.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                    <p>₹{enrichedCourse.price}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                    <p>{enrichedCourse.duration} per session</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Sessions</h3>
                    <p>{enrichedCourse.totalSessions} sessions</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Quota</h3>
                    <p>{enrichedCourse.quota} students</p>
                  </div>
                  {enrichedCourse.type === "restricted" && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Age Restriction</h3>
                      <p>
                        {enrichedCourse.min_age !== null
                          ? `${Math.floor((enrichedCourse.min_age || 0) / 12)} years`
                          : "N/A"}{" "}
                        -
                        {enrichedCourse.max_age !== null
                          ? `${Math.floor((enrichedCourse.max_age || 0) / 12)} years`
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Teachers</h3>
                <div className="space-y-3">
                  {enrichedCourse.teachers?.slice(0, 4).map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center gap-3 p-2 rounded-md border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.status === "active" ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {enrichedCourse.teachers && enrichedCourse.teachers.length > 4 && (
                    <div className="p-2 rounded-md border text-center">
                      <p className="text-sm text-muted-foreground">
                        +{enrichedCourse.teachers.length - 4} more teachers
                      </p>
                    </div>
                  )}
                  {!enrichedCourse.teachers && teacher && (
                    <div className="flex items-center gap-3 p-2 rounded-md border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">Teacher</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Student Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.map((student) => {
              const color = studentColorMap[student.id]

              return (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                    />
                    <Label htmlFor={`student-${student.id}`} className="flex items-center gap-2 cursor-pointer">
                      <Avatar className={`h-8 w-8 ${color.border}`}>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className={color.bg}>{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span>{student.name}</span>
                        <div className={`h-2 w-2 rounded-full inline-block ml-2 ${color.bg}`}></div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={hasReachedMaxSessions(student.id) ? "default" : "outline"}>
                      {getStudentSessionCount(student.id)}/{enrichedCourse.totalSessions}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">
                Show only slots with enough capacity for {selectedStudents.length} students
              </span>
              <Checkbox
                checked={showOnlyAvailable}
                onCheckedChange={(checked) => setShowOnlyAvailable(checked as boolean)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>Customize your view with these filters</SheetDescription>
                </SheetHeader>

                <div className="py-4 space-y-6">
                  <div className="space-y-4">
                    <Label>Time Range: {formatTimeRange()}</Label>
                    <Slider
                      defaultValue={timeRange}
                      min={7}
                      max={20}
                      step={1}
                      onValueChange={(value) => setTimeRange(value as [number, number])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>7:00 AM</span>
                      <span>8:00 PM</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "monday", label: "Mon" },
                        { id: "tuesday", label: "Tue" },
                        { id: "wednesday", label: "Wed" },
                        { id: "thursday", label: "Thu" },
                        { id: "friday", label: "Fri" },
                        { id: "saturday", label: "Sat" },
                        { id: "sunday", label: "Sun" },
                      ].map((day) => (
                        <Button
                          key={day.id}
                          variant={selectedDays.includes(day.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDaySelection(day.id)}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </CardFooter>
        </Card>

        {/* Right Content - Calendar and Bookings */}
        <div className="lg:col-span-3 space-y-6">
          {/* View Tabs */}
          <Tabs defaultValue="calendar" onValueChange={(value) => setActiveView(value as "calendar" | "list")}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
                </span>
                <Button variant="outline" size="sm" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-2 text-center border-r"></div>
                    {weekDays.map((day) => (
                      <div
                        key={day.dayName}
                        className={`p-2 text-center border-r last:border-r-0 ${
                          selectedDays.includes(day.dayOfWeek) ? "" : "bg-gray-100 opacity-50"
                        }`}
                      >
                        <div className="font-medium">{day.dayName}</div>
                        <div className="text-2xl">{day.dayNumber}</div>
                        <div className="text-xs text-muted-foreground">{day.monthName}</div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Body - Time Grid */}
                  <div className="grid grid-cols-8">
                    {/* Time labels */}
                    <div className="border-r">
                      {timeSlots
                        .filter((time) => {
                          const hour = Number.parseInt(time.split(":")[0])
                          return hour >= timeRange[0] && hour <= timeRange[1]
                        })
                        .map((time) => (
                          <div key={time} className="h-24 border-b last:border-b-0 flex items-center justify-center">
                            <span className="text-sm font-medium">{time}</span>
                          </div>
                        ))}
                    </div>

                    {/* Days columns */}
                    {weekDays.map((day) => (
                      <div
                        key={day.dayName}
                        className={`border-r last:border-r-0 ${
                          selectedDays.includes(day.dayOfWeek) ? "" : "bg-gray-100"
                        }`}
                      >
                        {timeSlots
                          .filter((time) => {
                            const hour = Number.parseInt(time.split(":")[0])
                            return hour >= timeRange[0] && hour <= timeRange[1]
                          })
                          .map((time) => {
                            const hour = Number.parseInt(time.split(":")[0])
                            const slotsForThisHour = slotsByDateAndHour[day.formattedDate]?.[hour] || []

                            // Filter slots based on availability if showOnlyAvailable is true
                            const filteredSlots = showOnlyAvailable
                              ? slotsForThisHour.filter((slot) => slot.availableQuota >= selectedStudents.length)
                              : slotsForThisHour

                            return (
                              <div key={`${day.formattedDate}-${hour}`} className="h-24 border-b last:border-b-0 p-1">
                                {filteredSlots.length > 0 ? (
                                  <div className="h-full">
                                    {filteredSlots.map((slot) => {
                                      const bookedStudents = getBookedStudents(slot.id)
                                      const isFullyBooked = slot.availableQuota === 0

                                      // Determine slot style based on booked students
                                      let slotStyle = "bg-blue-50 border border-blue-200 hover:bg-blue-100"

                                      if (isFullyBooked) {
                                        slotStyle = "bg-amber-50 border border-amber-200 hover:bg-amber-100"
                                      } else if (bookedStudents.length > 0) {
                                        // If only one student is booked, use their color
                                        if (bookedStudents.length === 1) {
                                          const color = studentColorMap[bookedStudents[0]]
                                          slotStyle = `${color.bg} ${color.border} ${color.hover}`
                                        } else {
                                          // For multiple students, use a gradient or pattern
                                          slotStyle =
                                            "bg-gradient-to-r from-green-100 to-blue-100 border border-blue-200 hover:opacity-90"
                                        }
                                      }

                                      return (
                                        <div
                                          key={slot.id}
                                          className={`p-2 rounded-md cursor-pointer text-sm h-full ${slotStyle}`}
                                          onClick={() => openBookingDialog(slot)}
                                        >
                                          <div className="font-medium text-center">{slot.startTime}</div>

                                          {/* Booked students indicators - improved for many students */}
                                          {bookedStudents.length > 0 && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <div className="mt-1 flex flex-wrap justify-center">
                                                    {bookedStudents.length <= 3 ? (
                                                      // Show all avatars if 3 or fewer students
                                                      bookedStudents.map((studentId) => {
                                                        const student = students.find((s) => s.id === studentId)
                                                        const color = studentColorMap[studentId]
                                                        return (
                                                          <div
                                                            key={studentId}
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}
                                                          >
                                                            {student?.name.substring(0, 1)}
                                                          </div>
                                                        )
                                                      })
                                                    ) : (
                                                      // Show first 2 avatars + count for more than 3 students
                                                      <>
                                                        {bookedStudents.slice(0, 2).map((studentId) => {
                                                          const student = students.find((s) => s.id === studentId)
                                                          const color = studentColorMap[studentId]
                                                          return (
                                                            <div
                                                              key={studentId}
                                                              className={`w-6 h-6 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}
                                                            >
                                                              {student?.name.substring(0, 1)}
                                                            </div>
                                                          )
                                                        })}
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                                                          +{bookedStudents.length - 2}
                                                        </div>
                                                      </>
                                                    )}
                                                  </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p className="font-medium">Booked students:</p>
                                                  <ul className="mt-1 text-sm">
                                                    {bookedStudents.map((studentId) => {
                                                      const student = students.find((s) => s.id === studentId)
                                                      return <li key={studentId}>{student?.name}</li>
                                                    })}
                                                  </ul>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}

                                          <div className="mt-1 flex justify-center">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${isFullyBooked ? "bg-amber-50 text-amber-700" : ""}`}
                                            >
                                              {slot.availableQuota} left
                                            </Badge>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                                    No slots
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {selectedStudents.map((studentId) => {
                      const student = students.find((s) => s.id === studentId)
                      const color = studentColorMap[studentId]

                      // Find all slots booked for this student
                      const studentBookings = Object.entries(selectedSlots)
                        .filter(([_, studentIds]) => studentIds.includes(studentId))
                        .map(([slotId]) => {
                          const slot = availableSlots.find((s) => s.id === slotId)
                          return slot
                        })
                        .filter(Boolean)
                        .sort((a, b) => {
                          if (!a || !b) return 0
                          if (a.date !== b.date) return a.date.localeCompare(b.date)
                          return a.startTime.localeCompare(b.startTime)
                        })

                      // Check if all slots have available quota for mimic
                      const allSlotsHaveQuota = checkAllSlotsHaveQuota(studentId)

                      return (
                        <div
                          key={studentId}
                          className={`border rounded-lg overflow-hidden ${
                            dropTargetStudent === studentId ? "ring-2 ring-primary" : ""
                          }`}
                          onDragOver={(e) => handleDragOver(e, studentId)}
                          onDragLeave={() => setDropTargetStudent(null)}
                          onDrop={(e) => handleDrop(e, studentId)}
                        >
                          <div className={`p-3 flex justify-between items-center ${color.bg}`}>
                            <div className="flex items-center gap-2">
                              <Avatar className={`h-8 w-8 ${color.border}`}>
                                <AvatarImage src={student?.avatar} />
                                <AvatarFallback>{student?.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge>
                                {getStudentSessionCount(studentId)}/{enrichedCourse.totalSessions} sessions
                              </Badge>

                              {studentBookings.length > 0 && (
                                <div className="flex items-center gap-2">
                                  {allSlotsHaveQuota && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => openMimicDialog(studentId)}
                                    >
                                      <Copy className="h-4 w-4 mr-1" />
                                      Mimic
                                    </Button>
                                  )}

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeAllBookingsForStudent(studentId)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove All
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {studentBookings.map((slot) => {
                            if (!slot) return null
                            return (
                              <div
                                key={slot.id}
                                className="p-3 flex justify-between items-center"
                                draggable
                                onDragStart={() => handleDragStart(slot.id, studentId)}
                                onDragEnd={handleDragEnd}
                              >
                                <div>
                                  <div className="font-medium">{format(parseISO(slot.date), "EEEE, MMMM d, yyyy")}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {slot.startTime} - {slot.endTime}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {slot.availableQuota} left
                                  </Badge>
                                  <Button variant="ghost" size="sm" onClick={() => removeBooking(slot.id, studentId)}>
                                    <X className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={saveSchedule}>Save Schedule</Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      {selectedSlotForBooking && (
        <Dialog open={!!selectedSlotForBooking} onOpenChange={(open) => !open && setSelectedSlotForBooking(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Session</DialogTitle>
              <DialogDescription>
                {format(parseISO(selectedSlotForBooking.date), "EEEE, MMMM d, yyyy")} •{" "}
                {selectedSlotForBooking.startTime} - {selectedSlotForBooking.endTime}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Student Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Select students for this session</span>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedStudents.map((studentId) => {
                    const student = students.find((s) => s.id === studentId)
                    const color = studentColorMap[studentId]
                    const isBooked = selectedSlots[selectedSlotForBooking.id]?.includes(studentId)
                    const isPendingBooking = pendingBookings.includes(studentId)
                    const isMaxed = hasReachedMaxSessions(studentId) && !isBooked && !isPendingBooking

                    return (
                      <div
                        key={studentId}
                        className={`flex items-center justify-between p-2 rounded-md ${isPendingBooking || isBooked ? color.bg : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className={`h-8 w-8 ${color.border}`}>
                            <AvatarImage src={student?.avatar} />
                            <AvatarFallback>{student?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{student?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {getStudentSessionCount(studentId)}/{enrichedCourse.totalSessions} sessions
                            </div>
                          </div>
                        </div>

                        {isBooked || isPendingBooking ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeBooking(selectedSlotForBooking.id, studentId)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        ) : isMaxed ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-xs text-amber-600 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Max sessions reached
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This student already has the maximum number of sessions scheduled</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => bookSlotForStudent(selectedSlotForBooking.id, studentId)}
                            disabled={selectedSlotForBooking.availableQuota < 1}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              {pendingBookings.length > 0 ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    {pendingBookings.length} student{pendingBookings.length !== 1 ? "s" : ""} selected
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => bookSlotForMultipleStudents(selectedSlotForBooking.id, pendingBookings)}
                  >
                    Confirm Bookings
                  </Button>
                </div>
              ) : (
                availableStudents.length > 0 &&
                selectedSlotForBooking.availableQuota >= availableStudents.length && (
                  <Button
                    onClick={() =>
                      bookSlotForMultipleStudents(
                        selectedSlotForBooking.id,
                        availableStudents.map((s) => s.id),
                      )
                    }
                  >
                    Book for all selected students
                  </Button>
                )
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Mimic Dialog */}
      <Dialog open={mimicDialogOpen} onOpenChange={setMimicDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mimic Schedule</DialogTitle>
            <DialogDescription>Select a student to copy all slots to</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {selectedStudents
                .filter((id) => id !== mimicSourceStudent && !hasReachedMaxSessions(id))
                .map((studentId) => {
                  const student = students.find((s) => s.id === studentId)
                  const color = studentColorMap[studentId]

                  return (
                    <div
                      key={studentId}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (mimicSourceStudent) {
                          copyAllSlotsToStudent(mimicSourceStudent, studentId)
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className={`h-8 w-8 ${color.border}`}>
                          <AvatarImage src={student?.avatar} />
                          <AvatarFallback>{student?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{student?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {getStudentSessionCount(studentId)}/{enrichedCourse.totalSessions} sessions
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  )
                })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMimicDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

