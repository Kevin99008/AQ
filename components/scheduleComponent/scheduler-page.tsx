"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
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
import { NotificationContainer, showNotification } from "@/components/notification"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

// แก้ไขโครงสร้างข้อมูล TimeSlot
interface TimeSlot {
  id: number | string
  date: string
  startTime: string
  endTime: string
  hour: number
  availableQuota: number
  courseId?: string
  courseName?: string
  category?: string
  isNewSlot?: boolean // เพิ่มฟิลด์เพื่อระบุว่าเป็น timeslot ที่สร้างใหม่หรือไม่
}

interface TimeSlotAttendances {
  id: number | string
  date: string
  startTime: string
  endTime: string
  hour: number
  availableQuota: number
  courseId?: string
  courseName?: string
  category?: string
  isNewSlot?: boolean // เพิ่มฟิลด์เพื่อระบุว่าเป็น timeslot ที่สร้างใหม่หรือไม่
  isSameCourse?: boolean
}

interface ApiResponse {
  course_timeslots: TimeSlot[] // timeslot ของคอร์สปัจจุบันที่สามารถลงทะเบียนได้
  other_category_timeslots: TimeSlot[] // timeslot ของคอร์สอื่นในหมวดหมู่เดียวกันที่มีการลงทะเบียนไปแล้ว
  student_attendances: {
    studentId: string
    timeslots: TimeSlotAttendances[] // timeslot ที่นักเรียนคนนี้ลงทะเบียนไปแล้ว
  }[]
}

// API Response type
export interface AttendanceResponse {
  message: string
  count: number
  attendance_ids: Attendance[]
}

// Attendance object type
export interface Attendance {
  id: number
  status: string
  type: string
  session: number
  student: number
  timeslot: number
  attendance_date: string
  start_time: string
  end_time: string
}

// ฟังก์ชันสำหรับโหลดข้อมูล timeslot จาก API
const fetchTimeSlots = async (courseId: string, studentIds: string[]) => {
  try {
    // ในสถานการณ์จริง คุณจะเรียก API ด้วย fetch หรือ axios
    // const response = await fetch(`/api/timeslots?courseId=${courseId}&studentIds=${studentIds.join(',')}`);
    // const data: ApiResponse = await response.json();
    const coursesResponse = await apiFetch<ApiResponse>("/api/new/courses/timeslot-selection/", "POST", {
      courseId: courseId,
      studentIds: studentIds,
    })
    if (coursesResponse !== TOKEN_EXPIRED) {
      return coursesResponse
    }
    // สำหรับตัวอย่าง เราจะใช้ข้อมูลจำลอง
    // const data: ApiResponse = {
    //   course_timeslots: generateTimeSlots(), // ใช้ฟังก์ชันที่มีอยู่เดิมเพื่อจำลองข้อมูล
    //   other_category_timeslots: [], // จะเติมข้อมูลจำลองในภายหลัง
    //   student_attendances: [], // จะเติมข้อมูลจำลองในภายหลัง
    // }

    // return data
  } catch (err: any) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error("Something went wrong")
    }
  }
}

// Change the time slots to start from 10 AM instead of 9 AM
const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Sample time slots with dates and availability count
// Update the generateTimeSlots function to start from 10 AM
const generateTimeSlots = () => {
  const today = new Date()
  const startDate = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday

  const slots: TimeSlot[] = []

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

          // สุ่มหมวดหมู่ระหว่าง Aquakids และ Playsound
          const category = Math.random() < 0.7 ? "Aquakids" : "Playsound"

          // กำหนด quota ตามหมวดหมู่
          const availableQuota = category === "Aquakids" ? 6 : 2

          // สร้าง id เป็นตัวเลขเพื่อจำลอง id จาก API
          const id = Math.floor(Math.random() * 1000) + 1

          slots.push({
            id,
            date: formattedDate,
            startTime,
            endTime,
            hour,
            availableQuota,
            category,
            courseId: "2", // สมมติว่าเป็นคอร์สที่ 2
            courseName: category === "Aquakids" ? "Advanced Aqua Training" : "Advanced Music Class",
            isNewSlot: false,
          })
        }
      }
    }
  }

  return slots
}

// ฟังก์ชันสำหรับตรวจสอบว่านักเรียนสามารถลงทะเบียนในคาบนี้ได้หรือไม่
const canStudentEnroll = (
  studentId: string,
  slot: TimeSlot,
  studentAttendances: { studentId: string; timeslots: TimeSlot[] }[],
) => {
  const studentAttendance = studentAttendances.find((attendance) => attendance.studentId === studentId)

  if (!studentAttendance) {
    return true // ถ้าไม่มีข้อมูลการลงทะเบียนของนักเรียนคนนี้ แสดงว่าลงทะเบียนได้
  }

  // ตรวจสอบว่านักเรียนมีคอร์สในคาบนี้อยู่แล้วหรือไม่
  const hasConflict = studentAttendance.timeslots.some(
    (attendedSlot) => attendedSlot.date === slot.date && attendedSlot.startTime === slot.startTime,
  )

  return !hasConflict
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

// ปรับปรุงโครงสร้าง pendingConfirmBookings
interface BookingItem {
  id?: number // ID จาก API (ถ้ามี)
  date: string
  startTime: string
  studentIds: string[]
  isNewSlot: boolean // เพิ่มฟิลด์เพื่อระบุว่าเป็น timeslot ที่สร้างใหม่หรือไม่
}

// ปรับปรุง state และการโหลดข้อมูล
export default function SchedulerPage({ students, teacher, course, onBack }: SchedulerPageProps) {
  // เพิ่ม state สำหรับเก็บข้อมูลจาก API
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedStudents, setSelectedStudents] = useState<string[]>(students.map((s) => s.id))
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string[]>>({})
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar")
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<TimeSlot | null>(null)
  const [pendingBookings, setPendingBookings] = useState<string[]>([])
  const [timeRange, setTimeRange] = useState<[number, number]>([10, 17])
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
  const [draggedSlot, setDraggedSlot] = useState<{ slotId: string; studentId: string } | null>(null)
  const [dropTargetStudent, setDropTargetStudent] = useState<string | null>(null)
  // เพิ่ม state สำหรับเก็บการจองที่รอการยืนยัน
  const [pendingConfirmBookings, setPendingConfirmBookings] = useState<BookingItem[]>([])
  const router = useRouter()
  const [teacherListOpen, setTeacherListOpen] = useState(false)
  const [recurringWeeks, setRecurringWeeks] = useState<number>(1)
  const [showRecurringOptions, setShowRecurringOptions] = useState<boolean>(false)
  // โหลดข้อมูลเมื่อคอมโพเนนต์ถูกโหลด
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // ในสถานการณ์จริง คุณจะเรียกใช้ fetchTimeSlots
        const data = await fetchTimeSlots(
          course.id,
          students.map((s) => s.id),
        )

        // สำหรับตัวอย่าง เราจะใช้ข้อมูลจำลอง
        // const courseTimeslots = generateTimeSlots()

        // // กำหนด category และ availableQuota ตามที่ต้องการ
        // courseTimeslots.forEach((slot) => {
        //   // กำหนด availableQuota ตาม category ของคอร์สที่เลือก
        //   if (course.category === "Aquakids" || !course.category) {
        //     slot.availableQuota = 6
        //   } else if (course.category === "Playsound") {
        //     slot.availableQuota = 2
        //   }
        // })

        // // จำลองข้อมูล other_category_timeslots
        // const otherCategoryTimeslots: TimeSlot[] = []
        // // สุ่มเลือก timeslot บางส่วนเพื่อจำลองว่าเป็น timeslot ที่มีการลงทะเบียนไปแล้ว
        // courseTimeslots.forEach((slot) => {
        //   if (Math.random() < 0.3) {
        //     // 30% ของ timeslot จะถูกใช้ในคอร์สอื่น
        //     otherCategoryTimeslots.push({
        //       ...slot,
        //       id: Math.floor(Math.random() * 1000) + 1000, // สร้าง id ใหม่
        //       courseId: `${Math.floor(Math.random() * 5) + 1}`,
        //       courseName: `Other Course ${Math.floor(Math.random() * 5) + 1}`,
        //     })
        //   }
        // })

        // // จำลองข้อมูล student_attendances
        // const studentAttendances = students.map((student) => {
        //   const attendedSlots: TimeSlot[] = []
        //   // สุ่มเลือก timeslot บางส่วนเพื่อจำลองว่านักเรียนได้ลงทะเบียนไปแล้ว
        //   courseTimeslots.forEach((slot) => {
        //     if (Math.random() < 0.1) {
        //       // 10% ของ timeslot จะถูกลงทะเบียนโดยนักเรียนแต่ละคน
        //       attendedSlots.push({
        //         ...slot,
        //         id: Math.floor(Math.random() * 1000) + 2000, // สร้าง id ใหม่
        //         courseId: Math.random() < 0.5 ? course.id : `${Math.floor(Math.random() * 5) + 1}`,
        //         courseName: Math.random() < 0.5 ? course.name : `Other Course ${Math.floor(Math.random() * 5) + 1}`,
        //       })
        //     }
        //   })

        //   return {
        //     studentId: student.id.toString(),
        //     timeslots: attendedSlots,
        //   }
        // })

        // const mockApiData: ApiResponse = {
        //   course_timeslots: courseTimeslots,
        //   other_category_timeslots: otherCategoryTimeslots,
        //   student_attendances: studentAttendances,
        // }
        if (data != undefined) {
          setApiData(data)
          setAvailableSlots(data.course_timeslots)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        showNotification({
          type: "error",
          message: "Failed to load timeslots",
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [course.id, course.category, students])

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

  // ปรับปรุงฟังก์ชันการกรองข้อมูล
  // Filter slots for the current week
  const currentWeekSlots = useMemo(() => {
    if (!apiData) return []

    const now = new Date()

    return availableSlots.filter((slot) => {
      const slotDate = parseISO(slot.date)
      const weekEnd = addDays(currentWeekStart, 6)
      const slotHour = Number.parseInt(slot.startTime.split(":")[0])
      const dayOfWeek = format(slotDate, "EEEE").toLowerCase()

      // กรองตามช่วงเวลาและวันที่เลือก
      const isInTimeRange = slotHour >= timeRange[0] && slotHour <= timeRange[1]
      const isSelectedDay = selectedDays.includes(dayOfWeek)

      // Check if this slot is in the past
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}:00`)
      const isPastSlot = slotDateTime < now

      // กรองตามความพร้อมใช้งาน
      let isAvailable = true

      const conflictWithOtherCourses = apiData.other_category_timeslots.some(
        (otherSlot) => otherSlot.date === slot.date && otherSlot.startTime === slot.startTime,
      )

      if (conflictWithOtherCourses) {
        isAvailable = false
      }

      return slotDate >= currentWeekStart && slotDate <= weekEnd && isInTimeRange && isSelectedDay && isAvailable
    })
  }, [apiData, availableSlots, currentWeekStart, timeRange, selectedDays, showOnlyAvailable, selectedStudents])

  const isStudentEnrolled = (studentId: string, date: string, startTime: string): boolean => {
    if (!apiData) return false

    const studentAttendance = apiData.student_attendances.find((attendance) => attendance.studentId === studentId)
    if (!studentAttendance) return false

    return studentAttendance.timeslots.some(
      (attendedSlot) =>
        attendedSlot.date === date && attendedSlot.startTime === startTime && attendedSlot.isSameCourse === true,
    )
  }

  const isStudentEnrolledOther = (studentId: string, date: string, startTime: string): boolean => {
    if (!apiData) return false

    const studentAttendance = apiData.student_attendances.find((attendance) => attendance.studentId === studentId)
    if (!studentAttendance) return false

    return studentAttendance.timeslots.some(
      (attendedSlot) =>
        attendedSlot.date === date && attendedSlot.startTime === startTime && attendedSlot.isSameCourse === false,
    )
  }
  // Group slots by date and hour
  const slotsByDateAndHour = useMemo(() => {
    return currentWeekSlots.reduce(
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
      {} as Record<string, Record<number, TimeSlot[]>>,
    )
  }, [currentWeekSlots])

  // Get students booked for a specific slot
  const getBookedStudents = (slotId: string | number) => {
    return selectedSlots[String(slotId)] || []
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

  // สร้าง timeslot ใหม่
  const createNewTimeSlot = (date: string, hour: number): TimeSlot => {
    const startTime = `${hour.toString().padStart(2, "0")}:00`
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`

    // กำหนด quota ตาม category ของคอร์สที่เลือก
    const availableQuota = course.category === "Playsound" ? 2 : 6

    return {
      id: `new-${date}-${hour}`,
      date,
      startTime,
      endTime,
      hour,
      availableQuota,
      category: course.category || "Aquakids",
      courseId: course.id,
      courseName: course.name,
      isNewSlot: true,
    }
  }

  // ตรวจสอบว่าช่องเวลานี้มีการจองในคอร์สอื่นหรือไม่
  const isTimeSlotBookedInOtherCourse = (date: string, hour: number) => {
    if (!apiData) return false

    const startTime = `${hour.toString().padStart(2, "0")}:00`

    return apiData.other_category_timeslots.some((slot) => slot.date === date && slot.startTime === startTime)
  }

  // ตรวจสอบว่าช่องเวลานี้มีใน course_timeslots หรือไม่
  const isTimeSlotInCourseTimeslots = (date: string, hour: number) => {
    if (!apiData) return false

    const startTime = `${hour.toString().padStart(2, "0")}:00`

    return apiData.course_timeslots.some((slot) => slot.date === date && slot.startTime === startTime)
  }

  // ค้นหา timeslot จาก date และ hour
  const findTimeSlot = (date: string, hour: number): TimeSlot | undefined => {
    if (!apiData) return undefined

    const startTime = `${hour.toString().padStart(2, "0")}:00`

    // ค้นหาใน course_timeslots ก่อน
    const courseSlot = apiData.course_timeslots.find((slot) => slot.date === date && slot.startTime === startTime)

    if (courseSlot) return courseSlot

    // ค้นหาใน availableSlots ที่เป็น timeslot ที่สร้างใหม่
    return availableSlots.find((slot) => slot.date === date && slot.startTime === startTime && slot.isNewSlot)
  }

  const getStudentConflictStatus = (date: string, startTime: string, apiData: ApiResponse | null) => {
    if (!apiData) return { hasConflict: false }

    const studentAttendance = apiData.student_attendances
    // .find((attendance) => attendance.studentId === studentId)

    if (!studentAttendance) return { hasConflict: false }

    // Find conflicting timeslot
    let isAvailable = true

    if (showOnlyAvailable && selectedStudents.length > 0) {

      for (const studentId of selectedStudents) {
        const studentAttendance = apiData.student_attendances.find((attendance) => attendance.studentId === studentId)

        if (studentAttendance) {
          const conflictingSlot = studentAttendance.timeslots.some((slot) => slot.date === date && slot.startTime === startTime)
          if (conflictingSlot) {
            isAvailable = false
            break
          }
        }

      }

      const timeslotFind = apiData.course_timeslots.find((timeslot) => timeslot.date === date && timeslot.startTime === startTime)
      if (timeslotFind) {
        isAvailable = isAvailable && timeslotFind.availableQuota >= selectedStudents.length
      }

    }

    if (!isAvailable) return { hasConflict: true }

    return { hasConflict: false }

  }

  // Open booking dialog
  const openBookingDialog = (slot: TimeSlot | null, date?: string, hour?: number) => {
    // Check if the date and time have passed
    if (slot) {
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}:00`)
      if (slotDateTime < new Date()) {
        showNotification({
          type: "error",
          message: "Cannot book past time",
          description: "You cannot book a time slot that has already passed.",
        })
        return
      }
    } else if (date && hour !== undefined) {
      const slotDateTime = new Date(`${date}T${hour.toString().padStart(2, "0")}:00:00`)
      if (slotDateTime < new Date()) {
        showNotification({
          type: "error",
          message: "Cannot book past time",
          description: "You cannot book a time slot that has already passed.",
        })
        return
      }
    }

    if (slot) {
      setSelectedSlotForBooking(slot)
    } else if (date && hour !== undefined) {
      // ตรวจสอบว่าช่องเวลานี้มีการจองในคอร์สอื่นหรือไม่
      if (isTimeSlotBookedInOtherCourse(date, hour)) {
        showNotification({
          type: "error",
          message: "Cannot book",
          description: "This time slot is already booked in another course.",
        })
        return
      }

      // ค้นหา timeslot ที่มีอยู่แล้ว
      const existingSlot = findTimeSlot(date, hour)

      if (existingSlot) {
        setSelectedSlotForBooking(existingSlot)
      } else {
        // สร้าง timeslot ใหม่
        const newSlot = createNewTimeSlot(date, hour)

        // เพิ่ม timeslot ใหม่เข้าไปใน availableSlots
        setAvailableSlots([...availableSlots, newSlot])

        setSelectedSlotForBooking(newSlot)
      }
    }

    // Reset recurring options
    setRecurringWeeks(1)
    setShowRecurringOptions(false)
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
  const bookSlotForStudent = (slotId: string | number, studentId: string) => {
    if (!apiData) return

    // ค้นหา timeslot ที่ต้องการจอง
    const slot = availableSlots.find((s) => String(s.id) === String(slotId))
    if (!slot) return

    // ตรวจสอบว่านักเรียนสามารถลงทะเบียนในคาบนี้ได้หรือไม่
    const canEnroll = canStudentEnroll(studentId, slot, apiData.student_attendances)

    if (!canEnroll) {
      showNotification({
        type: "error",
        message: "Cannot book",
        description: `This student already has another course at this time.`,
      })
      return
    }

    // ตรวจสอบว่า student ได้จองคาบนี้ไปแล้วหรือไม่
    const alreadyBooked = selectedSlots[String(slotId)]?.includes(studentId)

    if (!alreadyBooked) {
      // ตรวจสอบว่ามีที่นั่งเพียงพอหรือไม่
      if (slot.availableQuota < 1) {
        showNotification({
          type: "error",
          message: "No available quota",
          description: "This slot has no available quota.",
        })
        return
      }

      // Update the selected slots
      const updatedSelectedSlots = { ...selectedSlots }
      updatedSelectedSlots[String(slotId)] = [...(updatedSelectedSlots[String(slotId)] || []), studentId]

      // Update the available quota
      const updatedAvailableSlots = availableSlots.map((s) => {
        if (String(s.id) === String(slotId)) {
          return {
            ...s,
            availableQuota: Math.max(0, s.availableQuota - 1),
          }
        }
        return s
      })

      setAvailableSlots(updatedAvailableSlots)
      setSelectedSlots(updatedSelectedSlots)

      // Add to pending bookings
      if (!pendingBookings.includes(studentId)) {
        setPendingBookings([...pendingBookings, studentId])
      }

      // เพิ่มการจองลงใน pendingConfirmBookings
      const existingBookingIndex = pendingConfirmBookings.findIndex(
        (booking) => booking.date === slot.date && booking.startTime === slot.startTime,
      )

      if (existingBookingIndex !== -1) {
        // ถ้ามีการจองสำหรับ slot นี้อยู่แล้ว ให้เพิ่ม studentId เข้าไป
        const updatedPendingConfirmBookings = [...pendingConfirmBookings]
        updatedPendingConfirmBookings[existingBookingIndex] = {
          ...updatedPendingConfirmBookings[existingBookingIndex],
          studentIds: [...updatedPendingConfirmBookings[existingBookingIndex].studentIds, studentId],
        }
        setPendingConfirmBookings(updatedPendingConfirmBookings)
      } else {
        // ถ้ายังไม่มีการจองสำหรับ slot นี้ ให้สร้างรายการใหม่
        const isNewSlot = slot.isNewSlot || typeof slot.id === "string"

        const newBooking: BookingItem = {
          date: slot.date,
          startTime: slot.startTime,
          studentIds: [studentId],
          isNewSlot: isNewSlot,
        }

        // ถ้าเป็น timeslot ที่มีอยู่แล้วใน API และเป็นตัวเลข ให้เพิ่ม id
        if (!isNewSlot && typeof slot.id === "number") {
          newBooking.id = slot.id as number
        }

        setPendingConfirmBookings([...pendingConfirmBookings, newBooking])
      }

      // Show success message
      showNotification({
        type: "success",
        message: "Session booked",
        description: `Booked for ${students.find((s) => s.id === studentId)?.name}`,
      })
    }
  }

  // Book a slot for multiple students
  const bookSlotForMultipleStudents = (slotId: string | number, studentIds: string[]) => {
    if (!apiData) return

    // ค้นหา timeslot ที่ต้องการจอง
    const slot = availableSlots.find((s) => String(s.id) === String(slotId))
    if (!slot) return

    // ตรวจสอบว่ามีที่นั่งเพียงพอสำหรับนักเรียนทั้งหมดหรือไม่
    if (slot.availableQuota < studentIds.length) {
      showNotification({
        type: "error",
        message: "Insufficient quota",
        description: `Only ${slot.availableQuota} slots available for ${studentIds.length} students.`,
      })
      return
    }

    // กรองเฉพาะนักเรียนที่สามารถลงทะเบียนได้
    const eligibleStudentIds = studentIds.filter(
      (studentId) =>
        canStudentEnroll(studentId, slot, apiData.student_attendances) && !hasReachedMaxSessions(studentId),
    )

    if (eligibleStudentIds.length === 0) {
      showNotification({
        type: "error",
        message: "Cannot book",
        description: "None of the selected students can be enrolled in this timeslot.",
      })
      return
    }

    if (eligibleStudentIds.length < studentIds.length) {
      showNotification({
        type: "info",
        message: "Partial booking",
        description: `Only ${eligibleStudentIds.length} out of ${studentIds.length} students can be enrolled.`,
      })
      return
    }

    let newBookingsCount = 0
    const updatedSelectedSlots = { ...selectedSlots }

    eligibleStudentIds.forEach((studentId) => {
      // Check if student already has this slot booked
      const alreadyBooked = updatedSelectedSlots[String(slotId)]?.includes(studentId)

      if (!alreadyBooked) {
        if (!updatedSelectedSlots[String(slotId)]) {
          updatedSelectedSlots[String(slotId)] = []
        }
        updatedSelectedSlots[String(slotId)].push(studentId)
        newBookingsCount++
      }
    })

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((s) => {
      if (String(s.id) === String(slotId)) {
        return {
          ...s,
          availableQuota: Math.max(0, s.availableQuota - newBookingsCount),
        }
      }
      return s
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)
    setPendingBookings([]) // Clear pending bookings

    // เพิ่มการจองลงใน pendingConfirmBookings
    const existingBookingIndex = pendingConfirmBookings.findIndex(
      (booking) => booking.date === slot.date && booking.startTime === slot.startTime,
    )

    if (existingBookingIndex !== -1) {
      // ถ้ามีการจองสำหรับ slot นี้อยู่แล้ว ให้เพิ่ม studentIds เข้าไป
      const updatedPendingConfirmBookings = [...pendingConfirmBookings]
      const existingStudentIds = updatedPendingConfirmBookings[existingBookingIndex].studentIds
      const newStudentIds = eligibleStudentIds.filter((id) => !existingStudentIds.includes(id))

      updatedPendingConfirmBookings[existingBookingIndex] = {
        ...updatedPendingConfirmBookings[existingBookingIndex],
        studentIds: [...existingStudentIds, ...newStudentIds],
      }
      setPendingConfirmBookings(updatedPendingConfirmBookings)
    } else {
      // ถ้ายังไม่มีการจองสำหรับ slot นี้ ให้สร้างรายการใหม่
      const isNewSlot = slot.isNewSlot || typeof slot.id === "string"

      const newBooking: BookingItem = {
        date: slot.date,
        startTime: slot.startTime,
        studentIds: eligibleStudentIds,
        isNewSlot: isNewSlot,
      }

      // ถ้าเป็น timeslot ที่มีอยู่แล้วใน API และเป็นตัวเลข ให้เพิ่ม id
      if (!isNewSlot && typeof slot.id === "number") {
        newBooking.id = slot.id as number
      }

      setPendingConfirmBookings([...pendingConfirmBookings, newBooking])
    }

    // Close the booking dialog
    setSelectedSlotForBooking(null)

    // Show success message
    showNotification({
      type: "success",
      message: "Sessions booked",
      description: `Booked for ${newBookingsCount} student${newBookingsCount !== 1 ? "s" : ""}`,
    })
  }

  // Book recurring slots for multiple students
  const bookRecurringSlots = (slotId: string | number, studentIds: string[], weeks: number) => {
    if (!apiData || weeks <= 0) return

    // Get the original slot
    const originalSlot = availableSlots.find((s) => String(s.id) === String(slotId))
    if (!originalSlot) return

    // Book the first slot (current week)
    bookSlotForMultipleStudents(slotId, studentIds)

    // For each additional week, create and book slots
    const originalDate = parseISO(originalSlot.date)
    const hour = Number.parseInt(originalSlot.startTime.split(":")[0])

    // Create a copy of the current state to work with
    let updatedAvailableSlots = [...availableSlots]
    const updatedSelectedSlots = { ...selectedSlots }
    let updatedPendingConfirmBookings = [...pendingConfirmBookings]

    // Process future weeks
    for (let week = 1; week < weeks; week++) {
      const futureDate = addWeeks(originalDate, week)
      const futureDateStr = format(futureDate, "yyyy-MM-dd")

      // Skip if this time slot is booked in other course
      if (isTimeSlotBookedInOtherCourse(futureDateStr, hour)) {
        continue
      }

      // Find or create a slot for this future date
      let futureSlot = findTimeSlot(futureDateStr, hour)

      if (!futureSlot) {
        // Create a new slot
        futureSlot = createNewTimeSlot(futureDateStr, hour)
        // Add the new slot to our working copy
        updatedAvailableSlots = [...updatedAvailableSlots, futureSlot]
      }

      // Check which students can be booked in this slot
      const eligibleStudentIds = studentIds.filter(
        (studentId) =>
          canStudentEnroll(studentId, futureSlot!, apiData.student_attendances) && !hasReachedMaxSessions(studentId),
      )

      if (eligibleStudentIds.length > 0 && futureSlot.availableQuota >= eligibleStudentIds.length) {
        // Count new bookings
        let newBookingsCount = 0

        // Book each eligible student
        eligibleStudentIds.forEach((studentId) => {
          // Check if student already has this slot booked
          const alreadyBooked = updatedSelectedSlots[String(futureSlot!.id)]?.includes(studentId)

          if (!alreadyBooked) {
            // Initialize the array if it doesn't exist
            if (!updatedSelectedSlots[String(futureSlot!.id)]) {
              updatedSelectedSlots[String(futureSlot!.id)] = []
            }
            // Add the student to the slot
            updatedSelectedSlots[String(futureSlot!.id)].push(studentId)
            newBookingsCount++
          }
        })

        // Update the available quota for this slot
        updatedAvailableSlots = updatedAvailableSlots.map((s) => {
          if (String(s.id) === String(futureSlot!.id)) {
            return {
              ...s,
              availableQuota: Math.max(0, s.availableQuota - newBookingsCount),
            }
          }
          return s
        })

        // Add to pendingConfirmBookings
        const existingBookingIndex = updatedPendingConfirmBookings.findIndex(
          (booking) => booking.date === futureSlot!.date && booking.startTime === futureSlot!.startTime,
        )

        if (existingBookingIndex !== -1) {
          // If booking for this slot already exists, add the students
          const existingStudentIds = updatedPendingConfirmBookings[existingBookingIndex].studentIds
          const newStudentIds = eligibleStudentIds.filter((id) => !existingStudentIds.includes(id))

          updatedPendingConfirmBookings[existingBookingIndex] = {
            ...updatedPendingConfirmBookings[existingBookingIndex],
            studentIds: [...existingStudentIds, ...newStudentIds],
          }
        } else {
          // Create a new booking entry
          const isNewSlot = futureSlot.isNewSlot || typeof futureSlot.id === "string"

          const newBooking: BookingItem = {
            date: futureSlot.date,
            startTime: futureSlot.startTime,
            studentIds: eligibleStudentIds,
            isNewSlot: isNewSlot,
          }

          if (!isNewSlot && typeof futureSlot.id === "number") {
            newBooking.id = futureSlot.id
          }

          updatedPendingConfirmBookings = [...updatedPendingConfirmBookings, newBooking]
        }
      }
    }

    // Update all state at once after processing all weeks
    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)
    setPendingConfirmBookings(updatedPendingConfirmBookings)

    // Close the booking dialog
    setSelectedSlotForBooking(null)

    // Show success message
    showNotification({
      type: "success",
      message: "Recurring sessions booked",
      description: `Booked sessions for ${weeks} weeks`,
    })
  }

  // Remove a booking
  const removeBooking = (slotId: string | number, studentId: string) => {
    // Update the selected slots
    const updatedSelectedSlots = { ...selectedSlots }

    if (updatedSelectedSlots[String(slotId)]) {
      updatedSelectedSlots[String(slotId)] = updatedSelectedSlots[String(slotId)].filter((id) => id !== studentId)

      if (updatedSelectedSlots[String(slotId)].length === 0) {
        delete updatedSelectedSlots[String(slotId)]
      }
    }

    setSelectedSlots(updatedSelectedSlots)

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((slot) => {
      if (String(slot.id) === String(slotId)) {
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

    // ลบการจองออกจาก pendingConfirmBookings
    const slot = availableSlots.find((s) => String(s.id) === String(slotId))
    if (slot) {
      const existingBookingIndex = pendingConfirmBookings.findIndex(
        (booking) => booking.date === slot.date && booking.startTime === slot.startTime,
      )

      if (existingBookingIndex !== -1) {
        const updatedPendingConfirmBookings = [...pendingConfirmBookings]
        updatedPendingConfirmBookings[existingBookingIndex] = {
          ...updatedPendingConfirmBookings[existingBookingIndex],
          studentIds: updatedPendingConfirmBookings[existingBookingIndex].studentIds.filter((id) => id !== studentId),
        }

        // ถ้าไม่มีนักเรียนเหลืออยู่ในการจองนี้ ให้ลบรายการนี้ออก
        if (updatedPendingConfirmBookings[existingBookingIndex].studentIds.length === 0) {
          updatedPendingConfirmBookings.splice(existingBookingIndex, 1)
        }

        setPendingConfirmBookings(updatedPendingConfirmBookings)
      }
    }

    // Show success message
    showNotification({
      type: "success",
      message: "Booking removed",
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
      showNotification({
        type: "info",
        message: "No bookings to remove",
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
        const slotIndex = updatedAvailableSlots.findIndex((s) => String(s.id) === slotId)
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

    // ลบการจองออกจาก pendingConfirmBookings
    const updatedPendingConfirmBookings = pendingConfirmBookings
      .map((booking) => {
        if (booking.studentIds.includes(studentId)) {
          return {
            ...booking,
            studentIds: booking.studentIds.filter((id) => id !== studentId),
          }
        }
        return booking
      })
      .filter((booking) => booking.studentIds.length > 0)

    setPendingConfirmBookings(updatedPendingConfirmBookings)

    showNotification({
      type: "success",
      message: "All bookings removed",
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
      showNotification({
        type: "error",
        message: "Incomplete schedule",
        description: `${incompleteStudents.length} student(s) don't have all required sessions scheduled.`,
      })
      return
    }

    showNotification({
      type: "success",
      message: "Schedule saved",
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
    if (!apiData) return false

    // Find all slots booked for the student
    const studentSlots = Object.entries(selectedSlots)
      .filter(([_, studentIds]) => studentIds.includes(studentId))
      .map(([slotId]) => slotId)

    // Check if all slots have available quota
    return studentSlots.every((slotId) => {
      const slot = availableSlots.find((s) => String(s.id) === slotId)
      return slot !== undefined && slot.availableQuota > 0
    })
  }

  // Copy all slots from one student to another (mimic)
  const copyAllSlotsToStudent = (fromStudentId: string, toStudentId: string) => {
    if (!apiData) return

    // Find all slots booked for the source student
    const sourceStudentSlots = Object.entries(selectedSlots)
      .filter(([_, studentIds]) => studentIds.includes(fromStudentId))
      .map(([slotId]) => slotId)

    if (sourceStudentSlots.length === 0) {
      showNotification({
        type: "error",
        message: "No slots to copy",
        description: "The source student has no booked slots",
      })
      return
    }

    // Check if target student has enough room for all slots
    const targetStudentBookedCount = getStudentSessionCount(toStudentId)
    if (targetStudentBookedCount + sourceStudentSlots.length > enrichedCourse.totalSessions) {
      showNotification({
        type: "error",
        message: "Too many sessions",
        description: `Cannot copy all slots. ${students.find((s) => s.id === toStudentId)?.name} can only have ${
          enrichedCourse.totalSessions - targetStudentBookedCount
        } more sessions.`,
      })
      return
    }

    // ตรวจสอบว่า timeslot ที่จะ copy ไม่ตรงกับ timeslot ที่นักเรียนปลายทางมีอยู่แล้ว
    const targetStudentAttendance = apiData.student_attendances.find(
      (attendance) => attendance.studentId === toStudentId,
    )

    const slotsWithConflict: string[] = []

    if (targetStudentAttendance) {
      sourceStudentSlots.forEach((slotId) => {
        const slot = availableSlots.find((s) => String(s.id) === slotId)
        if (slot) {
          const hasConflict = targetStudentAttendance.timeslots.some(
            (attendedSlot) => attendedSlot.date === slot.date && attendedSlot.startTime === slot.startTime,
          )

          if (hasConflict) {
            slotsWithConflict.push(slotId)
          }
        }
      })
    }

    if (slotsWithConflict.length > 0) {
      showNotification({
        type: "error",
        message: "Conflicting slots",
        description: `Cannot copy all slots. ${students.find((s) => s.id === toStudentId)?.name} already has ${slotsWithConflict.length} conflicting sessions.`,
      })
      return
    }

    // Check if all slots have available quota
    const slotsWithoutQuota = sourceStudentSlots.filter((slotId) => {
      const slot = availableSlots.find((s) => String(s.id) === slotId)
      return !slot || slot.availableQuota < 1
    })

    if (slotsWithoutQuota.length > 0) {
      showNotification({
        type: "error",
        message: "Insufficient quota",
        description: `${slotsWithoutQuota.length} slots don't have available quota`,
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
      const slotIndex = updatedAvailableSlots.findIndex((s) => String(s.id) === slotId)
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

    showNotification({
      type: "success",
      message: "Schedule copied",
      description: `Copied ${copiedCount} slots to ${students.find((s) => s.id === toStudentId)?.name}`,
    })
  }

  // Handle drag start
  const handleDragStart = (slotId: string | number, studentId: string) => {
    setDraggedSlot({ slotId: String(slotId), studentId })
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
  const copySlotToStudent = (slotId: string | number, fromStudentId: string, toStudentId: string) => {
    if (!apiData) return

    // Check if the slot is already booked for the target student
    const alreadyBooked = selectedSlots[String(slotId)]?.includes(toStudentId)

    if (alreadyBooked) {
      showNotification({
        type: "info",
        message: "Already booked",
        description: `This slot is already booked for ${students.find((s) => s.id === toStudentId)?.name}`,
      })
      return
    }

    // Check if target student has reached max sessions
    if (hasReachedMaxSessions(toStudentId)) {
      showNotification({
        type: "error",
        message: "Maximum sessions reached",
        description: `${students.find((s) => s.id === toStudentId)?.name} already has the maximum number of sessions`,
      })
      return
    }

    // Check if the slot has available quota
    const slot = availableSlots.find((s) => String(s.id) === String(slotId))
    if (!slot || slot.availableQuota < 1) {
      showNotification({
        type: "error",
        message: "No available quota",
        description: "This slot has no available quota",
      })
      return
    }

    // ตรวจสอบว่า timeslot ที่จะ copy ไม่ตรงกับ timeslot ที่นักเรียนปลายทางมีอยู่แล้ว
    const targetStudentAttendance = apiData.student_attendances.find(
      (attendance) => attendance.studentId === toStudentId,
    )

    if (targetStudentAttendance) {
      const hasConflict = targetStudentAttendance.timeslots.some(
        (attendedSlot) => attendedSlot.date === slot.date && attendedSlot.startTime === slot.startTime,
      )

      if (hasConflict) {
        showNotification({
          type: "error",
          message: "Cannot copy",
          description: `This student already has another course at this time.`,
        })
        return
      }
    }

    // Book the slot for the target student
    const updatedSelectedSlots = { ...selectedSlots }
    updatedSelectedSlots[String(slotId)] = [...(updatedSelectedSlots[String(slotId)] || []), toStudentId]

    // Update the available quota
    const updatedAvailableSlots = availableSlots.map((s) => {
      if (String(s.id) === String(slotId)) {
        return {
          ...s,
          availableQuota: Math.max(0, s.availableQuota - 1),
        }
      }
      return s
    })

    setAvailableSlots(updatedAvailableSlots)
    setSelectedSlots(updatedSelectedSlots)

    showNotification({
      type: "success",
      message: "Slot copied",
      description: `Copied slot to ${students.find((s) => s.id === toStudentId)?.name}`,
    })
  }

  const openMimicDialog = (studentId: string) => {
    setMimicSourceStudent(studentId)
    setMimicDialogOpen(true)
  }

  // เพิ่มฟังก์ชันสำหรับส่งข้อมูลการจองทั้งหมดไปยังหลังบ้าน
  const confirmAllBookings = async () => {
    if (pendingConfirmBookings.length === 0) {
      showNotification({
        type: "info",
        message: "No bookings to confirm",
        description: "Please make some bookings first.",
      })
      return
    }

    setIsLoading(true)

    const incompleteStudents = selectedStudents.filter(
      (studentId) => getStudentSessionCount(studentId) < enrichedCourse.totalSessions,
    )

    if (incompleteStudents.length > 0) {
      showNotification({
        type: "error",
        message: "Incomplete schedule",
        description: `${incompleteStudents.length} student(s) don't have all required sessions scheduled.`,
      })
      return
    }

    showNotification({
      type: "success",
      message: "Schedule saved",
      description: "All sessions have been scheduled successfully.",
    })

    try {
      // ในสถานการณ์จริง คุณจะส่งข้อมูลไปยังหลังบ้าน
      // const response = await fetch('/api/confirm-bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json', 
      //   },
      //   body: JSON.stringify({
      //     bookings: pendingConfirmBookings,
      //     courseId: course.id
      //   }),
      // });
      // const data = await response.json();
      const response = await apiFetch<AttendanceResponse>("/api/new/courses/create-batch/", "POST", {
        course_id: course.id,
        bookings: pendingConfirmBookings,
      })
      if (response !== TOKEN_EXPIRED) {
        router.push(`/admin/all-course/attendances`)
      }
      // สำหรับตัวอย่าง เราจะจำลองการตอบกลับ
      // console.log("Confirming all bookings:", pendingConfirmBookings)

      // // รอสักครู่เพื่อจำลองการส่งข้อมูลไปยังหลังบ้าน
      // // await new Promise((resolve) => setTimeout(resolve, 1000))

      // // ล้างการจองที่รอการยืนยัน
      // setPendingConfirmBookings([])

      // showNotification({
      //   type: "success",
      //   message: "All bookings confirmed",
      //   description: `Successfully confirmed ${pendingConfirmBookings.length} bookings.`,
      // })
    } catch (error: any) {
      // console.error("Error confirming bookings:", error)
      if (error instanceof Error) {
        showNotification({
          type: "error",
          message: error.message,
          description: "Please try again later.",
        })
      }

      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  // แก้ไขส่วน Action Buttons
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Notification Container */}
      <NotificationContainer />

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
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setTeacherListOpen(true)
                        }}
                        className="text-sm text-muted-foreground"
                      >
                        +{enrichedCourse.teachers.length - 4} more teachers
                      </button>
                    </div>
                  )}
                  {enrichedCourse.teachers.length === 0 && (
                    <div className="text-muted-foreground">No Teacher registered</div>
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
                    {weekDays.map((day) => {
                      const isPastDate = new Date(day.formattedDate) < new Date(new Date().setHours(0, 0, 0, 0))
                      return (
                        <div
                          key={day.dayName}
                          className={`p-2 text-center border-r last:border-r-0 ${!selectedDays.includes(day.dayOfWeek)
                            ? "bg-gray-100"
                            : isPastDate
                              ? "bg-gray-200 opacity-60"
                              : ""
                            }`}
                        >
                          <div className="font-medium">{day.dayName}</div>
                          <div className="text-2xl">{day.dayNumber}</div>
                          <div className="text-xs text-muted-foreground">{day.monthName}</div>
                        </div>
                      )
                    })}
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
                    {weekDays.map((day) => {
                      const isPastDate = new Date(day.formattedDate) < new Date(new Date().setHours(0, 0, 0, 0))
                      return (
                        <div
                          key={day.dayName}
                          className={`border-r last:border-r-0 ${selectedDays.includes(day.dayOfWeek) ? "" : "bg-gray-100"
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

                              // ตรวจสอบว่าช่องเวลานี้มีการจองในคอร์สอื่นหรือไม่
                              const isBookedInOtherCourse = isTimeSlotBookedInOtherCourse(day.formattedDate, hour)

                              // ตรวจสอบว่าช่องเวลานี้มีใน course_timeslots หรือไม่
                              const isInCourseTimeslots = isTimeSlotInCourseTimeslots(day.formattedDate, hour)

                              // ค้นหา timeslot ที่มีอยู่แล้ว
                              const existingSlot = findTimeSlot(day.formattedDate, hour)

                              const conflicting = getStudentConflictStatus(day.formattedDate, `${hour.toString().padStart(2, "0")}:00`, apiData)
                              return (
                                showOnlyAvailable ? (
                                  <div key={`${day.formattedDate}-${hour}`} className="h-24 border-b last:border-b-0 p-1">
                                    {slotsForThisHour.length > 0 ? (
                                      <div className="h-full">
                                        {slotsForThisHour.map((slot) => {
                                          const bookedStudents = getBookedStudents(slot.id)
                                          const isFullyBooked = slot.availableQuota === 0

                                          let slotStyle = "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                                          if (isFullyBooked) {
                                            slotStyle = "bg-amber-50 border border-amber-200 hover:bg-amber-100"
                                          } else if (bookedStudents.length > 0) {
                                            if (bookedStudents.length === 1) {
                                              const color = studentColorMap[bookedStudents[0]]
                                              slotStyle = `${color.bg} ${color.border} ${color.hover}`
                                            } else {
                                              slotStyle = "bg-gradient-to-r from-green-100 to-blue-100 border border-blue-200 hover:opacity-90"
                                            }
                                          }

                                          return (
                                            <div
                                              key={slot.id}
                                              className={`p-2 rounded-md cursor-pointer text-sm h-full ${slotStyle}`}
                                              onClick={() => openBookingDialog(slot)}
                                            >
                                              <div className="font-medium text-center">{slot.startTime}</div>

                                              {bookedStudents.length > 0 && (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <div className="mt-1 flex flex-wrap justify-center">
                                                        {bookedStudents.length <= 3 ? (
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
                                    ) : isBookedInOtherCourse ? (
                                      <div className="h-full flex items-center justify-center bg-gray-100 rounded-md text-xs text-muted-foreground">
                                        Booked in other course
                                      </div>
                                    ) : (
                                      <div
                                        className={`h-full flex flex-col items-center justify-center text-xs text-muted-foreground border border-dashed border-gray-300 rounded-md ${isPastDate ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                                          }`}
                                        onClick={() => !isPastDate && openBookingDialog(null, day.formattedDate, hour)}
                                      >
                                        {isPastDate ? "Past date" : <span>Click to add</span>}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div key={`${day.formattedDate}-${hour}`} className="h-24 border-b last:border-b-0 p-1">
                                    {slotsForThisHour.length > 0 ? (
                                      <div className="h-full">
                                        {slotsForThisHour.map((slot) => {
                                          const bookedStudents = getBookedStudents(slot.id)
                                          const isFullyBooked = slot.availableQuota === 0

                                          let slotStyle = "bg-blue-50 border border-blue-200 hover:bg-blue-100"
                                          if (isFullyBooked) {
                                            slotStyle = "bg-amber-50 border border-amber-200 hover:bg-amber-100"
                                          } else if (bookedStudents.length > 0) {
                                            if (bookedStudents.length === 1) {
                                              const color = studentColorMap[bookedStudents[0]]
                                              slotStyle = `${color.bg} ${color.border} ${color.hover}`
                                            } else {
                                              slotStyle = "bg-gradient-to-r from-green-100 to-blue-100 border border-blue-200 hover:opacity-90"
                                            }
                                          }

                                          return (
                                            <div
                                              key={slot.id}
                                              className={`p-2 rounded-md cursor-pointer text-sm h-full ${slotStyle}`}
                                              onClick={() => openBookingDialog(slot)}
                                            >
                                              <div className="font-medium text-center">{slot.startTime}</div>

                                              {bookedStudents.length > 0 && (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <div className="mt-1 flex flex-wrap justify-center">
                                                        {bookedStudents.length <= 3 ? (
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
                                    ) : isBookedInOtherCourse ? (
                                      <div className="h-full flex items-center justify-center bg-gray-100 rounded-md text-xs text-muted-foreground">
                                        Booked in other course
                                      </div>
                                    ) : (
                                      <div
                                        className={`h-full flex flex-col items-center justify-center text-xs text-muted-foreground border border-dashed border-gray-300 rounded-md ${isPastDate ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
                                          }`}
                                        onClick={() => !isPastDate && openBookingDialog(null, day.formattedDate, hour)}
                                      >
                                        {isPastDate ? "Past date" : <span>Click to add</span>}
                                      </div>
                                    )}
                                  </div>
                                )
                              )
                            })}
                        </div>
                      )
                    })}
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
                          const slot = availableSlots.find((s) => String(s.id) === slotId)
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

            {pendingConfirmBookings.length > 0 && (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={confirmAllBookings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    Confirm All Bookings (
                    {pendingConfirmBookings.reduce((total, booking) => total + booking.studentIds.length, 0)})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={teacherListOpen} onOpenChange={setTeacherListOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Teacher for {course.name}</DialogTitle>
            <DialogDescription>
              {enrichedCourse.teachers.length} teacher{enrichedCourse.teachers.length !== 1 ? "s" : ""} registered
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {enrichedCourse.teachers.length > 0 ? (
              <div className="space-y-3">
                {enrichedCourse.teachers?.map((teacher: any) => (
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
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">No Teacher registered</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setTeacherListOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    const isBooked = selectedSlots[String(selectedSlotForBooking.id)]?.includes(studentId)
                    const isPendingBooking = pendingBookings.includes(studentId)
                    const isMaxed = hasReachedMaxSessions(studentId) && !isBooked && !isPendingBooking
                    const isAlreadyEnrolled = isStudentEnrolled(
                      studentId,
                      selectedSlotForBooking.date,
                      selectedSlotForBooking.startTime,
                    )
                    const isAlreadyEnrolledOther = isStudentEnrolledOther(
                      studentId,
                      selectedSlotForBooking.date,
                      selectedSlotForBooking.startTime,
                    )

                    return (
                      <div
                        key={studentId}
                        className={`flex items-center justify-between p-2 rounded-md ${isPendingBooking || isBooked || isAlreadyEnrolled ? color.bg : ""}`}
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

                        {isAlreadyEnrolled ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Already enrolled
                          </Badge>
                        ) : isBooked || isPendingBooking ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeBooking(selectedSlotForBooking.id, studentId)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        ) : isAlreadyEnrolledOther ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-xs text-amber-600 flex items-center">
                                  <AlertCircle className="h-4 w-4 mr-1" />
                                  Conflict with another class
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This student already has another class scheduled</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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

              {/* Recurring Options */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">Make this a recurring booking</span>
                    <Checkbox
                      checked={showRecurringOptions}
                      onCheckedChange={(checked) => setShowRecurringOptions(checked as boolean)}
                    />
                  </div>
                </div>

                {showRecurringOptions && (
                  <div className="mt-3 p-3 border rounded-md">
                    <Label htmlFor="recurring-weeks">Book for how many weeks?</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRecurringWeeks(Math.max(1, recurringWeeks - 1))}
                      >
                        -
                      </Button>
                      <div className="w-10 text-center font-medium">{recurringWeeks}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRecurringWeeks(Math.min(enrichedCourse.totalSessions, recurringWeeks + 1))}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This will book the same time slot for {recurringWeeks} consecutive weeks.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              {pendingBookings.length > 0 ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    {pendingBookings.length} student{pendingBookings.length !== 1 ? "s" : ""} selected
                  </div>
                  {showRecurringOptions && recurringWeeks > 1 ? (
                    <Button
                      className="w-full"
                      onClick={() => {
                        bookRecurringSlots(selectedSlotForBooking.id, pendingBookings, recurringWeeks)
                        setSelectedSlotForBooking(null)
                      }}
                      disabled={selectedSlotForBooking.availableQuota < pendingBookings.length}
                    >
                      Confirm Recurring Bookings ({recurringWeeks} weeks)
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => bookSlotForMultipleStudents(selectedSlotForBooking.id, pendingBookings)}
                      disabled={selectedSlotForBooking.availableQuota < pendingBookings.length}
                    >
                      Confirm Bookings
                    </Button>
                  )}
                </div>
              ) : (
                availableStudents.length > 0 &&
                selectedSlotForBooking.availableQuota > 0 && (
                  <>
                    {showRecurringOptions && recurringWeeks > 1 ? (
                      <Button
                        onClick={() => {
                          bookRecurringSlots(
                            selectedSlotForBooking.id,
                            availableStudents.map((s) => s.id),
                            recurringWeeks,
                          )
                          setSelectedSlotForBooking(null)
                        }}
                        disabled={selectedSlotForBooking.availableQuota < availableStudents.length}
                      >
                        Book recurring for all selected students ({recurringWeeks} weeks)
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          bookSlotForMultipleStudents(
                            selectedSlotForBooking.id,
                            availableStudents.map((s) => s.id),
                          )
                        }
                        disabled={selectedSlotForBooking.availableQuota < availableStudents.length}
                      >
                        Book for all selected students
                      </Button>
                    )}
                  </>
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
