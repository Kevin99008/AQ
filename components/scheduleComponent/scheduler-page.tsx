"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, parseISO } from "date-fns"
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Filter,
  Plus,
  X,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample teachers
const teachers = [
  {
    id: "teacher-1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Conversation",
    rating: 4.9,
  },
  {
    id: "teacher-2",
    name: "Prof. Michael Chen",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Grammar",
    rating: 4.7,
  },
  {
    id: "teacher-3",
    name: "Ms. Emily Parker",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Business English",
    rating: 4.8,
  },
]

// Time slots from 9 AM to 5 PM
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Sample time slots with dates and availability count
const generateTimeSlots = () => {
  const today = new Date()
  const startDate = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday

  const slots = []

  // Generate slots for 4 weeks
  for (let week = 0; week < 4; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(addWeeks(startDate, week), day)
      const formattedDate = format(currentDate, "yyyy-MM-dd")

      // Generate slots for each hour from 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        // Only create slots with 70% probability to have some empty spaces
        if (Math.random() < 0.7) {
          const startTime = `${hour.toString().padStart(2, "0")}:00`
          const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

          // Randomly assign 1-3 teachers to this slot
          const slotTeachers = []
          const teacherCount = Math.floor(Math.random() * 3) + 1
          const shuffledTeachers = [...teachers].sort(() => 0.5 - Math.random())

          for (let i = 0; i < teacherCount; i++) {
            if (shuffledTeachers[i]) {
              slotTeachers.push({
                ...shuffledTeachers[i],
                isPrimary: i === 0,
              })
            }
          }

          slots.push({
            id: `slot-${week}-${day}-${hour}`,
            date: formattedDate,
            startTime,
            endTime,
            hour,
            availableQuota: Math.floor(Math.random() * 5) + 1,
            teachers: slotTeachers,
          })
        }
      }
    }
  }

  return slots
}

interface SchedulerPageProps {
  students: any[]
  teacher: any
  course: any
  onBack: () => void
}

export default function SchedulerPage({ students, teacher, course, onBack }: SchedulerPageProps) {
  const [availableSlots, setAvailableSlots] = useState(generateTimeSlots())
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedStudents, setSelectedStudents] = useState<string[]>(students.map((s) => s.id))
  const [selectedSlots, setSelectedSlots] = useState<Record<string, { slotId: string; teacherId: string }[]>>({})
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true)
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<any>(null)
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState<string>("")

  // Initialize selected slots for each student
  useEffect(() => {
    const initialSelectedSlots: Record<string, { slotId: string; teacherId: string }[]> = {}
    students.forEach((student) => {
      initialSelectedSlots[student.id] = []
    })
    setSelectedSlots(initialSelectedSlots)
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
    }
  })

  // Filter slots for the current week
  const currentWeekSlots = availableSlots.filter((slot) => {
    const slotDate = parseISO(slot.date)
    const weekEnd = addDays(currentWeekStart, 6)

    return slotDate >= currentWeekStart && slotDate <= weekEnd
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

  // Check if a slot is already booked for any selected student
  const isSlotBooked = (slotId: string) => {
    return selectedStudents.some((studentId) => selectedSlots[studentId]?.some((booking) => booking.slotId === slotId))
  }

  // Get the teacher booked for a specific slot and student
  const getBookedTeacher = (slotId: string, studentId: string) => {
    const booking = selectedSlots[studentId]?.find((b) => b.slotId === slotId)
    if (booking) {
      return teachers.find((t) => t.id === booking.teacherId)
    }
    return null
  }

  // Count how many sessions each student has booked
  const getStudentSessionCount = (studentId: string) => {
    return selectedSlots[studentId]?.length || 0
  }

  // Check if a student has reached the maximum number of sessions
  const hasReachedMaxSessions = (studentId: string) => {
    return getStudentSessionCount(studentId) >= course.totalSessions
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

  // Open booking dialog
  const openBookingDialog = (slot: any) => {
    setSelectedSlotForBooking(slot)
    // Default to the first teacher in the slot
    if (slot.teachers.length > 0) {
      setSelectedTeacherForBooking(slot.teachers[0].id)
    } else {
      setSelectedTeacherForBooking("")
    }
  }

  // Book a slot for selected students
  const bookSlot = (slotId: string, teacherId: string, studentIds: string[]) => {
    // Update the selected slots
    const updatedSelectedSlots = { ...selectedSlots }

    studentIds.forEach((studentId) => {
      if (!hasReachedMaxSessions(studentId)) {
        updatedSelectedSlots[studentId] = [...(updatedSelectedSlots[studentId] || []), { slotId, teacherId }]
      }
    })

    setSelectedSlots(updatedSelectedSlots)

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          availableQuota: slot.availableQuota - studentIds.length,
        }
      }
      return slot
    })

    setAvailableSlots(updatedAvailableSlots)

    // Show success message
    toast({
      title: "Session booked",
      description: `Booked for ${studentIds.length} student${studentIds.length > 1 ? "s" : ""}`,
    })

    // Close the booking dialog
    setSelectedSlotForBooking(null)
  }

  // Remove a booking
  const removeBooking = (slotId: string, studentId: string) => {
    // Update the selected slots
    const updatedSelectedSlots = { ...selectedSlots }
    updatedSelectedSlots[studentId] = updatedSelectedSlots[studentId].filter((booking) => booking.slotId !== slotId)
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

    // Show success message
    toast({
      title: "Booking removed",
      description: "The session has been removed from the schedule",
    })
  }

  // Save the schedule
  const saveSchedule = () => {
    // Check if all selected students have the required number of sessions
    const incompleteStudents = selectedStudents.filter(
      (studentId) => getStudentSessionCount(studentId) < course.totalSessions,
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

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.code}</p>
            <div className="flex items-center mt-2 gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.duration} per session
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {course.totalSessions} sessions total
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground">Teacher</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{teacher.name}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={teacher.avatar} />
                <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Student Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudentSelection(student.id)}
                  />
                  <Label htmlFor={`student-${student.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{student.name}</span>
                  </Label>
                </div>
                <div className="flex items-center">
                  <Badge variant={hasReachedMaxSessions(student.id) ? "default" : "outline"}>
                    {getStudentSessionCount(student.id)}/{course.totalSessions}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium">Show only available slots</span>
              <Checkbox
                checked={showOnlyAvailable}
                onCheckedChange={(checked) => setShowOnlyAvailable(checked as boolean)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>Customize your view with these filters</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Time of Day</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start">
                        Morning
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Afternoon
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Evening
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <Button key={day} variant="outline" size="sm">
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Teachers</Label>
                    <div className="space-y-2">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center space-x-2">
                          <Checkbox id={`filter-${teacher.id}`} />
                          <Label htmlFor={`filter-${teacher.id}`}>{teacher.name}</Label>
                        </div>
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

              <div className="flex items-center gap-2">
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
                      <div key={day.dayName} className="p-2 text-center border-r last:border-r-0">
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
                      {timeSlots.map((time, index) => (
                        <div key={time} className="h-24 border-b last:border-b-0 flex items-center justify-center">
                          <span className="text-sm font-medium">{time}</span>
                        </div>
                      ))}
                    </div>

                    {/* Days columns */}
                    {weekDays.map((day) => (
                      <div key={day.dayName} className="border-r last:border-r-0">
                        {timeSlots.map((time, hourIndex) => {
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
                                  {filteredSlots.map((slot) => (
                                    <div
                                      key={slot.id}
                                      className={`
                                        p-2 rounded-md cursor-pointer text-sm h-full
                                        ${
                                          isSlotBooked(slot.id)
                                            ? "bg-green-100 border border-green-300 hover:bg-green-200"
                                            : slot.availableQuota < selectedStudents.length
                                              ? "bg-gray-100 border border-gray-300 opacity-60"
                                              : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                                        }
                                      `}
                                      onClick={() => openBookingDialog(slot)}
                                    >
                                      <div className="font-medium">
                                        {slot.startTime} - {slot.endTime}
                                      </div>

                                      {/* Show available teachers */}
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {slot.teachers.map((slotTeacher: any) => (
                                          <Badge key={slotTeacher.id} variant="outline" className="text-xs">
                                            {slotTeacher.name.split(" ")[0]}
                                          </Badge>
                                        ))}
                                      </div>

                                      <div className="mt-1 flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs">
                                          {slot.availableQuota} left
                                        </Badge>

                                        {isSlotBooked(slot.id) && (
                                          <div className="flex items-center text-xs text-green-700">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Booked
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
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
                      const studentBookings = selectedSlots[studentId] || []

                      return (
                        <div key={studentId} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted p-3 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student?.avatar} />
                                <AvatarFallback>{student?.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student?.name}</span>
                            </div>
                            <Badge>
                              {getStudentSessionCount(studentId)}/{course.totalSessions} sessions
                            </Badge>
                          </div>

                          {studentBookings.length > 0 ? (
                            <div className="divide-y">
                              {studentBookings.map((booking) => {
                                const slot = availableSlots.find((s) => s.id === booking.slotId)
                                const bookedTeacher = teachers.find((t) => t.id === booking.teacherId)

                                if (!slot || !bookedTeacher) return null

                                return (
                                  <div key={booking.slotId} className="p-3 flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">
                                        {format(parseISO(slot.date), "EEEE, MMMM d, yyyy")}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {slot.startTime} - {slot.endTime} • {bookedTeacher.name}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeBooking(booking.slotId, studentId)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="p-6 text-center text-muted-foreground">
                              No sessions booked for this student
                            </div>
                          )}
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
              {/* Teacher Selection */}
              <div className="mb-6">
                <Label className="text-base font-medium mb-2 block">Select Teacher</Label>
                <RadioGroup value={selectedTeacherForBooking} onValueChange={setSelectedTeacherForBooking}>
                  <div className="space-y-3">
                    {selectedSlotForBooking.teachers.map((slotTeacher: any) => (
                      <div key={slotTeacher.id} className="flex items-center space-x-2 border rounded-md p-2">
                        <RadioGroupItem value={slotTeacher.id} id={`teacher-${slotTeacher.id}`} />
                        <Label htmlFor={`teacher-${slotTeacher.id}`} className="flex items-center gap-2 cursor-pointer">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={slotTeacher.avatar} />
                            <AvatarFallback>{slotTeacher.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{slotTeacher.name}</div>
                            <div className="text-xs text-muted-foreground">{slotTeacher.specialty}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Student Selection */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Select students for this session</span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedStudents.map((studentId) => {
                    const student = students.find((s) => s.id === studentId)
                    const isBooked = selectedSlots[studentId]?.some(
                      (booking) => booking.slotId === selectedSlotForBooking.id,
                    )
                    const isMaxed = hasReachedMaxSessions(studentId) && !isBooked

                    return (
                      <div key={studentId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student?.avatar} />
                            <AvatarFallback>{student?.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{student?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {getStudentSessionCount(studentId)}/{course.totalSessions} sessions
                            </div>
                          </div>
                        </div>

                        {isBooked ? (
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
                            onClick={() => bookSlot(selectedSlotForBooking.id, selectedTeacherForBooking, [studentId])}
                            disabled={selectedSlotForBooking.availableQuota < 1 || !selectedTeacherForBooking}
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
              {availableStudents.length > 0 &&
                selectedSlotForBooking.availableQuota >= availableStudents.length &&
                selectedTeacherForBooking && (
                  <Button
                    onClick={() =>
                      bookSlot(
                        selectedSlotForBooking.id,
                        selectedTeacherForBooking,
                        availableStudents.map((s) => s.id),
                      )
                    }
                  >
                    Book for all selected students
                  </Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

