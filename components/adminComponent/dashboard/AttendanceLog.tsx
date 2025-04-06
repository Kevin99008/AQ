"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, User, BookOpen, Clock } from "lucide-react"
import { format, addDays, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { fetchCategories } from "@/services/api" // Using the same API service
import type { AttendanceRecord } from "@/types/dashboard"

interface AttendanceLogProps {
  records: AttendanceRecord[]
  onSelectAttendance: (record: AttendanceRecord) => void
  compact?: boolean
  sortNewestFirst?: boolean
  category: string
}

type Category = {
  id: number | string
  categoryName: string
  color?: string
}

const formatTimestamp = (timestamp: string) => {
  // Append "+07:00" to indicate Thai time (UTC+7)
  const thaiTimeTimestamp = `${timestamp}+07:00`

  // Create a Date object with the adjusted timestamp
  const date = new Date(thaiTimeTimestamp)

  // Format date for Thai locale and timezone
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  })
}

// Helper function to check if a timestamp is on the same day as the selected date
const isSameDay = (timestamp: string, selectedDate: Date) => {
  const date = new Date(timestamp)
  return (
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear()
  )
}

// Get badge variant based on category
const getCategoryVariant = (category: string): "blue" | "purple" | "amber" | "secondary" => {
  switch (category.toLowerCase()) {
    case "aquakids":
      return "blue"
    case "playsound":
      return "purple"
    case "other":
      return "amber"
    default:
      return "secondary"
  }
}

export default function AttendanceLog({
  records,
  onSelectAttendance,
  compact = false,
  sortNewestFirst = true,
  category = "All",
}: AttendanceLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()) // Default to today
  const [filteredRecords, setFilteredRecords] = useState(records)
  const [dateFilterActive, setDateFilterActive] = useState(true) // Default to active
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const fetchedCategories = await fetchCategories() // Using the same function as CourseListPage
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Sort and filter records when records, search term, or selected date changes
  useEffect(() => {
    let result = [...records]

    // 1. Sort first
    if (sortNewestFirst) {
      result = result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

    // 2. Apply category filter
    if (category !== "All") {
      result = result.filter((record) => record.category === category)
    }

    // 3. Apply date filter if active
    if (dateFilterActive && selectedDate) {
      result = result.filter((record) => isSameDay(record.timestamp, selectedDate))
    }

    // 4. Then apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (record) =>
          record.name.toLowerCase().includes(term) ||
          record.course.toLowerCase().includes(term) ||
          record.timestamp.toLowerCase().includes(term) ||
          record.category?.toLowerCase().includes(term),
      )
    }

    setFilteredRecords(result)
  }, [records, searchTerm, sortNewestFirst, selectedDate, dateFilterActive, category])

  // Function to get badge color based on course type
  const getBadgeColor = (category: string) => {
    // Try to find the category in the fetched categories
    const foundCategory = categories.find((cat) => cat.categoryName.toLowerCase() === category.toLowerCase())

    if (foundCategory) {
      return `bg-${getCategoryVariant(foundCategory.categoryName)}-100 text-${getCategoryVariant(foundCategory.categoryName)}-800 hover:bg-${getCategoryVariant(foundCategory.categoryName)}-200`
    }

    // Fallback to default colors
    switch (category) {
      case "AquaKids":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Playsound":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "Other":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Toggle date filter
  const toggleDateFilter = () => {
    setDateFilterActive(!dateFilterActive)
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate((prevDate) => subDays(prevDate, 1))
    setDateFilterActive(true)
  }

  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate((prevDate) => addDays(prevDate, 1))
    setDateFilterActive(true)
  }

  // Format time for mobile display
  const formatTimeForMobile = (timestamp: string) => {
    const parts = formatTimestamp(timestamp).split(",")
    const datePart = parts[0] || ""
    const timePart = parts.length > 1 ? parts[1].trim() : ""
    return { date: datePart, time: timePart }
  }

  return (
    <div className="space-y-3">
      {/* Search input and date navigation */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, course, or time..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousDay}
            title="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant={dateFilterActive ? "default" : "outline"}
            className={cn("w-auto px-3 justify-center font-normal", !dateFilterActive && "text-muted-foreground")}
            onClick={toggleDateFilter}
          >
            {dateFilterActive ? format(selectedDate, "PPP") : "All dates"}
          </Button>

          <Button variant="outline" size="icon" onClick={goToNextDay} title="Next day">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="rounded-md border hidden sm:block">
        <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Name</TableHead>
                  {!compact && <TableHead>Course</TableHead>}
                  {category && !compact && <TableHead>Type</TableHead>}
                  <TableHead>{compact ? "Time" : "Timestamp"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={compact ? 2 : category ? 4 : 3}
                      className="text-center text-muted-foreground py-6"
                    >
                      {searchTerm.trim() !== ""
                        ? "No matching records found"
                        : dateFilterActive
                          ? `No records for ${format(selectedDate, "PP")}`
                          : "No attendance records found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onSelectAttendance(record)}
                    >
                      <TableCell className="font-medium">{record.name}</TableCell>
                      {!compact && <TableCell>{record.course}</TableCell>}
                      {category && !compact && (
                        <TableCell>
                          {record.category && (
                            <Badge className={getBadgeColor(record.category)} variant="outline">
                              {record.category}
                            </Badge>
                          )}
                        </TableCell>
                      )}
                      <TableCell>{formatTimestamp(record.timestamp)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Mobile Card View - Visible only on Mobile */}
      <div className="sm:hidden">
        <div className="space-y-3 overflow-y-auto max-h-[400px] pb-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {filteredRecords.length === 0 ? (
            <div className="text-center text-muted-foreground py-6 border rounded-md">
              {searchTerm.trim() !== ""
                ? "No matching records found"
                : dateFilterActive
                  ? `No records for ${format(selectedDate, "PP")}`
                  : "No attendance records found"}
            </div>
          ) : (
            filteredRecords.map((record) => {
              const { date, time } = formatTimeForMobile(record.timestamp)
              return (
                <Card
                  key={record.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectAttendance(record)}
                >
                  <CardContent className="p-4 grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <User className="h-3 w-3 mr-1" /> Name
                      </div>
                      <div className="font-medium">{record.name}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" /> Course
                      </div>
                      <div>{record.course}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Time
                      </div>
                      <div className="text-sm">
                        <div>{date}</div>
                        <div>{time}</div>
                      </div>
                    </div>

                    {record.category && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Type</div>
                        <Badge className={getBadgeColor(record.category)} variant="outline">
                          {record.category}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Show search results count when searching */}
      {searchTerm.trim() !== "" && (
        <div className="text-xs text-muted-foreground px-1">
          Found {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"} matching "{searchTerm}"
          {dateFilterActive && ` on ${format(selectedDate, "PP")}`}
        </div>
      )}
      {searchTerm.trim() === "" && dateFilterActive && (
        <div className="text-xs text-muted-foreground px-1">
          Showing {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"} for{" "}
          {format(selectedDate, "PP")}
        </div>
      )}
    </div>
  )
}

