"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  const [currentMonth, setCurrentMonth] = useState(date || new Date())
  const [showDayDetail, setShowDayDetail] = useState<string | null>(null)

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
    setDate(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
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

  // Check if date is today
  const isToday = (dateString: string) => {
    const today = formatDateToString(new Date())
    return dateString === today
  }

  // Render calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
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
          className={cn("p-2 border border-border/50 min-h-[100px] relative", isToday(dateString) && "bg-muted/50")}
        >
          <div className="text-right mb-1">
            <span
              className={cn(
                "inline-block w-7 h-7 rounded-full text-center leading-7",
                isToday(dateString) && "bg-primary text-primary-foreground",
              )}
            >
              {day}
            </span>
          </div>
          <div className="space-y-1 max-h-[80px] overflow-y-auto">
            {classesForDay.slice(0, 2).map((cls) => (
              <div
                key={cls.id}
                className={cn("text-xs p-1 rounded cursor-pointer text-white", cls.color)}
                onClick={() => onSelectClass(cls)}
              >
                <div className="font-medium truncate">{cls.title}</div>
                <div>{formatTime(cls.startTime)}</div>
              </div>
            ))}
            {classesForDay.length > 2 && (
              <div
                className="text-xs p-1 rounded cursor-pointer bg-secondary text-secondary-foreground text-center"
                onClick={() => {
                  // Show the first class but indicate there are more
                  onSelectClass(classesForDay[0])
                  setShowDayDetail(dateString)
                }}
              >
                +{classesForDay.length - 2} more classes
              </div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  const closeDayDetail = () => setShowDayDetail(null)

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-background">{renderCalendar()}</div>
      {showDayDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeDayDetail}>
          <div
            className="bg-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {new Date(showDayDetail).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeDayDetail}>
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {getClassesForDate(showDayDetail).map((cls) => (
                <div
                  key={cls.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    onSelectClass(cls)
                    closeDayDetail()
                  }}
                >
                  <div className={cn("w-full h-1 rounded-full mb-2", cls.color)}></div>
                  <div className="font-medium">{cls.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                  </div>
                  <div className="text-sm">Instructor: {cls.instructor}</div>
                  <div className="text-sm">Student: {cls.student}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

