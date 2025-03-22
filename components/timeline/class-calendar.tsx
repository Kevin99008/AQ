"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, CalendarIcon, Clock, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ClassData {
  id: number
  title: string
  date: string // Format: "YYYY-MM-DD"
  startTime: string // Format: "HH:MM:SS"
  endTime: string
  instructor: string
  student: string
  color: string
}

interface ClassCalendarProps {
  classes: ClassData[]
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  onSelectClass: (classData: ClassData) => void
}

export function ClassCalendar({ classes, date, setDate, onSelectClass }: ClassCalendarProps) {
  const [currentDate, setCurrentDate] = useState(date || new Date())
  const [showDayDetail, setShowDayDetail] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"month" | "day">("month")

  // Get dates for the current week
  function getWeekDates(date: Date): Date[] {
    const result = []
    // Get the first day of the week (Sunday)
    const firstDay = new Date(date)
    const day = firstDay.getDay()
    firstDay.setDate(firstDay.getDate() - day)

    // Get all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(firstDay)
      newDate.setDate(firstDay.getDate() + i)
      result.push(newDate)
    }
    return result
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Navigate to previous period (month/week/day)
  const prevPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
    setDate(newDate)
  }

  // Navigate to next period (month/week/day)
  const nextPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
    setDate(newDate)
  }

  // Format date to YYYY-MM-DD
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Get classes for a specific date
  const getClassesForDate = (dateString: string) => {
    return classes.filter((cls) => cls.date === dateString)
  }

  // Format time from "HH:MM:SS" to "HH:MM AM/PM"
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Parse time from "HH:MM:SS" to minutes since midnight
  const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Check if date is today
  const isToday = (dateString: string) => {
    const today = formatDateToString(new Date())
    return dateString === today
  }

  // Group classes by start time
  const groupClassesByStartTime = (classes: ClassData[]) => {
    const groups: Record<string, ClassData[]> = {}

    classes.forEach((cls) => {
      if (!groups[cls.startTime]) {
        groups[cls.startTime] = []
      }
      groups[cls.startTime].push(cls)
    })

    return groups
  }

  // Render month view calendar
  const renderMonthCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center font-medium py-2">
          {weekdays[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-border/50 bg-muted/30"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = formatDateToString(date)
      const classesForDay = getClassesForDate(dateString)

      days.push(
        <div
          key={`day-${day}`}
          className={cn(
            "p-2 border border-border/50 min-h-[80px] relative cursor-pointer",
            isToday(dateString) && "bg-muted/50",
          )}
          onClick={() => {
            // Switch to day view when clicking on a day
            const newDate = new Date(year, month, day)
            setCurrentDate(newDate)
            setDate(newDate)
            setViewMode("day")
          }}
        >
          <div className="text-right mb-1">
            <span
              className={cn(
                "inline-block w-6 h-6 rounded-full text-center leading-6 text-sm",
                isToday(dateString) && "bg-primary text-primary-foreground",
              )}
            >
              {day}
            </span>
          </div>
          <div className="space-y-1 max-h-[60px] overflow-y-auto">
            {classesForDay.slice(0, 2).map((cls) => (
              <div
                key={cls.id}
                className={cn("text-xs p-1 rounded cursor-pointer text-white", cls.color)}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectClass(cls)
                }}
              >
                <div className="font-medium truncate">{cls.title}</div>
                <div>{formatTime(cls.startTime)}</div>
              </div>
            ))}
            {classesForDay.length > 2 && (
              <div
                className="text-xs p-1 rounded cursor-pointer bg-secondary text-secondary-foreground text-center"
                onClick={(e) => {
                  e.stopPropagation()
                  // Show the first class but indicate there are more
                  onSelectClass(classesForDay[0])
                  setShowDayDetail(dateString)
                }}
              >
                +{classesForDay.length - 2} more
              </div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  // Render day view calendar
  const renderDayCalendar = () => {
    const dateString = formatDateToString(currentDate)
    const classesForDay = getClassesForDate(dateString)

    // Create time slots from 9am to 6pm
    const startHour = 9 // 9am
    const endHour = 18 // 6pm
    const timeSlots = []

    for (let hour = startHour; hour <= endHour; hour++) {
      const hourFormatted = hour % 12 || 12
      const ampm = hour >= 12 ? "PM" : "AM"
      const timeLabel = `${hourFormatted}:00 ${ampm}`
      const hourMinutes = hour * 60

      // Find classes that overlap with this hour
      const hourClasses = classesForDay.filter((cls) => {
        const startMinutes = parseTimeToMinutes(cls.startTime)
        const endMinutes = parseTimeToMinutes(cls.endTime)

        // Check if class overlaps with this hour
        return (
          (startMinutes < (hour + 1) * 60 && endMinutes > hour * 60) || // Class spans this hour
          (startMinutes >= hour * 60 && startMinutes < (hour + 1) * 60) // Class starts in this hour
        )
      })

      // Group classes by start time
      const classesByStartTime = groupClassesByStartTime(hourClasses)

      // Calculate the height based on number of classes (min 60px, plus 40px per additional class)
      const totalClasses = Object.values(classesByStartTime).reduce((sum, classes) => sum + classes.length, 0)
      const slotHeight = Math.max(60, 60 + (totalClasses > 1 ? (totalClasses - 1) * 40 : 0))

      timeSlots.push(
        <div key={`hour-${hour}`} className="flex border-b border-border/50" style={{ minHeight: `${slotHeight}px` }}>
          <div className="w-16 p-2 text-xs text-muted-foreground border-r border-border/50 flex items-start">
            {timeLabel}
          </div>
          <div className="flex-1 p-1">
            <div className="flex flex-col space-y-1">
              {Object.entries(classesByStartTime).map(([startTime, classes]) => (
                <div key={startTime} className="flex flex-col space-y-1">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className={cn("rounded px-2 py-1 text-white cursor-pointer", cls.color)}
                      style={{ minHeight: "36px" }}
                      onClick={() => onSelectClass(cls)}
                    >
                      <div className="text-xs font-medium truncate">{cls.title}</div>
                      <div className="text-xs truncate">
                        {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>,
      )
    }

    return timeSlots
  }

  const closeDayDetail = () => setShowDayDetail(null)

  // Get title for current view
  const getViewTitle = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })
    } else {
      return currentDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden w-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="text-base font-semibold">{getViewTitle()}</h2>
        <div className="flex items-center space-x-2">
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "month" | "day")}
            className="mr-2"
          >
            <TabsList className="h-8">
              <TabsTrigger value="month" className="text-xs px-2 py-1 h-7">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                Month
              </TabsTrigger>
              <TabsTrigger value="day" className="text-xs px-2 py-1 h-7">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "month" && <div className="grid grid-cols-7 bg-background">{renderMonthCalendar()}</div>}

      {viewMode === "day" && <div className="bg-background overflow-y-auto max-h-[600px]">{renderDayCalendar()}</div>}

      {showDayDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeDayDetail}>
          <div
            className="bg-background rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                {new Date(showDayDetail).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeDayDetail}>
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {getClassesForDate(showDayDetail).map((cls) => (
                <div
                  key={cls.id}
                  className="p-2 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    onSelectClass(cls)
                    closeDayDetail()
                  }}
                >
                  <div className={cn("w-full h-1 rounded-full mb-2", cls.color)}></div>
                  <div className="font-medium text-sm">{cls.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                  </div>
                  <div className="text-xs">Instructor: {cls.instructor}</div>
                  <div className="text-xs">Student: {cls.student}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

