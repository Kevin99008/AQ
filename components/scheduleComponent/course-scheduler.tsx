"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Calendar, Clock, Check, ChevronDown, ChevronUp, Save, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Days of the week with 3-letter abbreviations
const days = [
  { th: "อาท", en: "Sun", full: "sunday" },
  { th: "จัน", en: "Mon", full: "monday" },
  { th: "อัง", en: "Tue", full: "tuesday" },
  { th: "พุธ", en: "Wed", full: "wednesday" },
  { th: "พฤห", en: "Thu", full: "thursday" },
  { th: "ศุก", en: "Fri", full: "friday" },
  { th: "เสา", en: "Sat", full: "saturday" },
]

// Months for filtering
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Sample time slots with dates and availability count
const generateInitialTimeSlots = () => [
  {
    id: "slot-1",
    day: "wednesday",
    dayAbbr: "Wed",
    date: "26",
    month: "March",
    availableTimes: ["10:00", "11:00", "12:00"],
    availableCount: 2,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false },
    ],
  },
  {
    id: "slot-2",
    day: "monday",
    dayAbbr: "Mon",
    date: "24",
    month: "March",
    availableTimes: ["13:00", "14:00", "15:00"],
    availableCount: 3,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
    ],
  },
  {
    id: "slot-3",
    day: "friday",
    dayAbbr: "Fri",
    date: "28",
    month: "March",
    availableTimes: ["10:00", "11:00", "12:00"],
    availableCount: 1,
    teachers: [{ id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true }],
  },
  {
    id: "slot-4",
    day: "tuesday",
    dayAbbr: "Tue",
    date: "25",
    month: "March",
    availableTimes: ["14:00", "15:00", "16:00"],
    availableCount: 2,
    teachers: [
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
      { id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false },
    ],
  },
  {
    id: "slot-5",
    day: "thursday",
    dayAbbr: "Thu",
    date: "27",
    month: "March",
    availableTimes: ["11:00", "12:00", "13:00"],
    availableCount: 2,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false },
    ],
  },
  {
    id: "slot-6",
    day: "saturday",
    dayAbbr: "Sat",
    date: "29",
    month: "March",
    availableTimes: ["10:00", "11:00", "12:00"],
    availableCount: 1,
    teachers: [{ id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false }],
  },
  {
    id: "slot-7",
    day: "monday",
    dayAbbr: "Mon",
    date: "31",
    month: "March",
    availableTimes: ["14:00", "15:00", "16:00"],
    availableCount: 3,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
      { id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false },
    ],
  },
  {
    id: "slot-8",
    day: "wednesday",
    dayAbbr: "Wed",
    date: "2",
    month: "April",
    availableTimes: ["10:00", "11:00", "12:00"],
    availableCount: 2,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
    ],
  },
  {
    id: "slot-9",
    day: "friday",
    dayAbbr: "Fri",
    date: "4",
    month: "April",
    availableTimes: ["13:00", "14:00", "15:00"],
    availableCount: 1,
    teachers: [{ id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false }],
  },
  {
    id: "slot-10",
    day: "tuesday",
    dayAbbr: "Tue",
    date: "1",
    month: "April",
    availableTimes: ["10:00", "11:00", "12:00"],
    availableCount: 2,
    teachers: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true },
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
    ],
  },
  {
    id: "slot-11",
    day: "thursday",
    dayAbbr: "Thu",
    date: "3",
    month: "April",
    availableTimes: ["14:00", "15:00", "16:00"],
    availableCount: 3,
    teachers: [
      { id: "teacher-2", name: "Prof. Michael Chen", isPrimary: false },
      { id: "teacher-3", name: "Ms. Emily Parker", isPrimary: false },
    ],
  },
  {
    id: "slot-12",
    day: "saturday",
    dayAbbr: "Sat",
    date: "5",
    month: "April",
    availableTimes: ["11:00", "12:00", "13:00"],
    availableCount: 1,
    teachers: [{ id: "teacher-1", name: "Dr. Sarah Johnson", isPrimary: true }],
  },
]

interface CourseSchedulerProps {
  students: any[]
  teacher: any
  course: any
  onBack: () => void
}

export default function CourseScheduler({ students, teacher, course, onBack }: CourseSchedulerProps) {
  const [availableSlots, setAvailableSlots] = useState(generateInitialTimeSlots())
  const [selectedMonth, setSelectedMonth] = useState("March")
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null)
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({})
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id)
  const [selectedStudents, setSelectedStudents] = useState<string[]>(students.map((s) => s.id))
  const [studentSessions, setStudentSessions] = useState<Record<string, any>>({})
  const [isDraft, setIsDraft] = useState(false)

  // Initialize student sessions
  useEffect(() => {
    const initialSessions: Record<string, any> = {}
    students.forEach((student) => {
      initialSessions[student.id] = {
        sessions: {
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
        },
        selectedTimes: {},
        sessionCount: 0,
      }
    })
    setStudentSessions(initialSessions)
  }, [students])

  // Filter slots by month
  const filteredSlots = availableSlots.filter((slot) => slot.month === selectedMonth && slot.availableCount > 0)

  // Get active student data
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0]
  const activeStudentSessions = studentSessions[activeStudentId]?.sessions || {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  }
  const activeStudentSelectedTimes = studentSessions[activeStudentId]?.selectedTimes || {}
  const activeStudentSessionCount = studentSessions[activeStudentId]?.sessionCount || 0

  // Calculate progress
  const remainingSlots = course.totalSessions - activeStudentSessionCount
  const progressPercentage = (activeStudentSessionCount / course.totalSessions) * 100

  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside a droppable area
    if (!destination) return

    // Same location, no change needed
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Get the slot being dragged
    const slotId = result.draggableId

    // Handle dragging from available slots to calendar
    if (source.droppableId === "available-slots" && destination.droppableId !== "available-slots") {
      const slot = availableSlots.find((s) => s.id === slotId)
      if (!slot) return

      // Only allow dropping in the matching day lane
      if (destination.droppableId !== slot.day) {
        toast({
          title: "Invalid placement",
          description: `This slot can only be placed in the ${slot.dayAbbr} column.`,
          variant: "destructive",
        })
        return
      }

      // Check if time is selected
      if (!selectedTimes[slotId]) {
        toast({
          title: "Time not selected",
          description: "Please select a time for this slot before adding it to the calendar.",
          variant: "destructive",
        })
        return
      }

      // Check if we've reached the maximum number of slots for this student
      if (activeStudentSessionCount >= course.totalSessions) {
        toast({
          title: "Maximum sessions reached",
          description: `${activeStudent.name} already has ${course.totalSessions} sessions scheduled.`,
          variant: "destructive",
        })
        return
      }

      // Apply to all selected students
      const updatedStudentSessions = { ...studentSessions }
      const updatedAvailableSlots = [...availableSlots]
      const slotIndex = updatedAvailableSlots.findIndex((s) => s.id === slotId)

      // Create a unique session ID for each student
      selectedStudents.forEach((studentId) => {
        const student = updatedStudentSessions[studentId]

        // Skip if student already has max sessions
        if (student.sessionCount >= course.totalSessions) {
          toast({
            title: `Skipped ${students.find((s) => s.id === studentId)?.name}`,
            description: "This student already has the maximum number of sessions.",
          })
          return
        }

        // Create a unique copy of the slot for this student
        const sessionNumber = student.sessionCount + 1
        const uniqueSlotId = `${slotId}-${studentId}-${sessionNumber}`
        const slotCopy = {
          ...slot,
          id: uniqueSlotId,
          originalId: slotId,
          sessionNumber,
          time: selectedTimes[slotId],
        }

        // Add to student's sessions
        updatedStudentSessions[studentId] = {
          ...student,
          sessions: {
            ...student.sessions,
            [destination.droppableId]: [...student.sessions[destination.droppableId], slotCopy],
          },
          selectedTimes: {
            ...student.selectedTimes,
            [uniqueSlotId]: selectedTimes[slotId],
          },
          sessionCount: student.sessionCount + 1,
        }
      })

      // Decrement the available count for the slot
      if (slotIndex !== -1) {
        updatedAvailableSlots[slotIndex] = {
          ...updatedAvailableSlots[slotIndex],
          availableCount: updatedAvailableSlots[slotIndex].availableCount - 1,
        }
      }

      // Update state
      setStudentSessions(updatedStudentSessions)
      setAvailableSlots(updatedAvailableSlots)

      // Clear the selected time for this slot
      const newSelectedTimes = { ...selectedTimes }
      delete newSelectedTimes[slotId]
      setSelectedTimes(newSelectedTimes)
    }
    // Handle dragging from calendar back to available slots
    else if (source.droppableId !== "available-slots" && destination.droppableId === "available-slots") {
      // Get the session from the student's calendar
      const session = activeStudentSessions[source.droppableId][source.index]
      if (!session) return

      // Update student sessions
      const updatedStudentSessions = { ...studentSessions }
      updatedStudentSessions[activeStudentId] = {
        ...updatedStudentSessions[activeStudentId],
        sessions: {
          ...updatedStudentSessions[activeStudentId].sessions,
          [source.droppableId]: updatedStudentSessions[activeStudentId].sessions[source.droppableId].filter(
            (_, i) => i !== source.index,
          ),
        },
        sessionCount: updatedStudentSessions[activeStudentId].sessionCount - 1,
      }

      // Increment the available count for the original slot
      const originalSlotId = session.originalId
      const updatedAvailableSlots = [...availableSlots]
      const slotIndex = updatedAvailableSlots.findIndex((s) => s.id === originalSlotId)

      if (slotIndex !== -1) {
        updatedAvailableSlots[slotIndex] = {
          ...updatedAvailableSlots[slotIndex],
          availableCount: updatedAvailableSlots[slotIndex].availableCount + 1,
        }
      }

      // Update state
      setStudentSessions(updatedStudentSessions)
      setAvailableSlots(updatedAvailableSlots)
    }
  }

  const toggleExpandSlot = (slotId: string) => {
    if (expandedSlot === slotId) {
      setExpandedSlot(null)
    } else {
      setExpandedSlot(slotId)
    }
  }

  const selectTime = (slotId: string, time: string) => {
    setSelectedTimes({
      ...selectedTimes,
      [slotId]: time,
    })
    setExpandedSlot(null) // Close the expanded view after selection
  }

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const saveAsDraft = () => {
    setIsDraft(true)
    toast({
      title: "Schedule saved as draft",
      description: "Your schedule has been saved as a draft and can be modified later.",
    })
  }

  const confirmSchedule = () => {
    // Check if all students have the required number of sessions
    const incompleteStudents = students.filter(
      (student) => studentSessions[student.id]?.sessionCount < course.totalSessions,
    )

    if (incompleteStudents.length > 0) {
      toast({
        title: "Incomplete schedules",
        description: `${incompleteStudents.length} students don't have all ${course.totalSessions} sessions scheduled.`,
        variant: "destructive",
        action: <ToastAction altText="Continue anyway">Continue anyway</ToastAction>,
      })
      return
    }

    toast({
      title: "Schedule confirmed",
      description: "All student schedules have been confirmed successfully.",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Course Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                  {isDraft && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Draft
                    </Badge>
                  )}
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
              <div className="h-10 border-l mx-2"></div>
              <Select value={activeStudentId} onValueChange={setActiveStudentId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {student.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Session Selection Progress for {activeStudent.name}</h2>
          <span className="text-sm font-medium">
            {activeStudentSessionCount}/{course.totalSessions} sessions
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        {remainingSlots > 0 ? (
          <p className="text-sm text-muted-foreground mt-1">
            Please select {remainingSlots} more session{remainingSlots !== 1 ? "s" : ""}
          </p>
        ) : (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <Check className="h-4 w-4" /> All sessions selected
          </p>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Modify Sessions Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-light text-gray-600">
              <span className="font-medium">Modify</span> SESSIONS
            </h1>
            <div className="flex gap-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weekly Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day.full} className="flex flex-col border border-gray-200">
                <div className="p-2 text-center uppercase text-sm font-medium text-gray-600 border-b border-gray-200">
                  {day.en}
                </div>
                <Droppable droppableId={day.full}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[300px] p-2 flex flex-col gap-2"
                    >
                      {activeStudentSessions[day.full].map((session: any, index: number) => (
                        <Draggable key={session.id} draggableId={session.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-full"
                            >
                              <Card className="bg-white shadow-sm hover:shadow transition-shadow overflow-hidden">
                                <div className="h-7 bg-green-600 w-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">{session.time}</span>
                                </div>
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="bg-primary/10">
                                        #{session.sessionNumber}
                                      </Badge>
                                      <span className="font-medium">
                                        {session.date} {session.month}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">Duration: 1 hour</div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Time Slots</h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Apply to Students */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Apply selected time slots to:</h3>
            <div className="flex flex-wrap gap-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => toggleStudentSelection(student.id)}
                  />
                  <Label htmlFor={`student-${student.id}`} className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {student.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Legend */}
          <div className="mb-4 flex items-center gap-4">
            <div className="text-sm font-medium">Teachers:</div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">Current Teacher</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm">Primary Teachers</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="text-sm">Other Teachers</span>
            </div>
          </div>

          {/* Time Slot Lanes */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((day) => (
              <div
                key={`header-${day.full}`}
                className="p-2 text-center uppercase text-sm font-medium text-gray-600 border-b border-gray-200"
              >
                {day.en}
              </div>
            ))}
          </div>

          <Droppable droppableId="available-slots" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-7 gap-1 min-h-[200px]"
              >
                {days.map((day) => (
                  <div key={`lane-${day.full}`} className="flex flex-col gap-2 p-2 bg-gray-50 rounded-md">
                    {filteredSlots
                      .filter((slot) => slot.day === day.full)
                      .map((slot, index) => (
                        <Draggable key={slot.id} draggableId={slot.id} index={index + day.en.charCodeAt(0) * 100}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-full"
                            >
                              <Card
                                className={`bg-white shadow-sm hover:shadow transition-shadow cursor-pointer overflow-hidden ${expandedSlot === slot.id ? "ring-2 ring-primary" : ""}`}
                                onClick={() => toggleExpandSlot(slot.id)}
                              >
                                {selectedTimes[slot.id] ? (
                                  <div className="h-7 bg-green-600 w-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">{selectedTimes[slot.id]}</span>
                                  </div>
                                ) : null}
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {slot.date} {slot.month}
                                      </span>
                                      <div className="flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                        {slot.availableCount}
                                      </div>
                                    </div>
                                    {!selectedTimes[slot.id] &&
                                      (expandedSlot === slot.id ? (
                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ))}
                                  </div>

                                  {/* Teacher indicators */}
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {slot.teachers.map((slotTeacher) => (
                                      <Badge
                                        key={slotTeacher.id}
                                        variant="outline"
                                        className={`text-xs ${
                                          slotTeacher.id === teacher.id
                                            ? "bg-primary/10 text-primary border-primary/30"
                                            : slotTeacher.isPrimary
                                              ? "bg-blue-50 text-blue-700 border-blue-200"
                                              : "bg-purple-50 text-purple-700 border-purple-200"
                                        }`}
                                      >
                                        {slotTeacher.name.split(" ")[0]}
                                      </Badge>
                                    ))}
                                  </div>

                                  {expandedSlot === slot.id && (
                                    <div className="mt-3 flex flex-col gap-2">
                                      {slot.availableTimes.map((time) => (
                                        <Button
                                          key={time}
                                          variant="outline"
                                          size="sm"
                                          className="w-full justify-center"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            selectTime(slot.id, time)
                                          }}
                                        >
                                          {time}
                                        </Button>
                                      ))}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" size="lg" onClick={saveAsDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button size="lg" onClick={confirmSchedule}>
            <Check className="mr-2 h-4 w-4" />
            Confirm Schedule
          </Button>
        </div>
      </DragDropContext>
    </div>
  )
}

