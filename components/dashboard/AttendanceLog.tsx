"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { AttendanceRecord } from "@/types/dashboard"

interface AttendanceLogProps {
  records: AttendanceRecord[]
  onSelectAttendance: (record: AttendanceRecord) => void
  compact?: boolean
  sortNewestFirst?: boolean
  courseType: string
}

const formatTimestamp = (timestamp: string) => {
  // Append "+07:00" to indicate Thai time (UTC+7)
  const thaiTimeTimestamp = `${timestamp}+07:00`;
  
  // Create a Date object with the adjusted timestamp
  const date = new Date(thaiTimeTimestamp);

  // Format date for Thai locale and timezone
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  });
};

export default function AttendanceLog({
  records,
  onSelectAttendance,
  compact = false,
  sortNewestFirst = true,
  courseType = "All"
}: AttendanceLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecords, setFilteredRecords] = useState(records)

  // Sort and filter records when records or search term changes
  useEffect(() => {
    let result = [...records]

    // 1. Sort first
    if (sortNewestFirst) {
      result = result.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }

    // 2. Apply courseType filter
    if (courseType !== "All") {
      result = result.filter(record => 
        record.courseType === courseType
      )
    }

    // 3. Then apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      result = result.filter(record =>
        record.name.toLowerCase().includes(term) ||
        record.course.toLowerCase().includes(term) ||
        record.timestamp.toLowerCase().includes(term) ||
        (record.courseType?.toLowerCase().includes(term))
      )
    }

    setFilteredRecords(result)
  }, [records, searchTerm, sortNewestFirst])

  // Function to get badge color based on course type
  const getBadgeColor = (courseType: string) => {
    switch (courseType) {
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

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, course, or time..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
          <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                {!compact && <TableHead className="hidden sm:table-cell">Course</TableHead>}
                {courseType && !compact && <TableHead className="hidden md:table-cell">Type</TableHead>}
                <TableHead>{compact ? "Time" : "Timestamp"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={compact ? 2 : courseType ? 4 : 3}
                    className="text-center text-muted-foreground py-6"
                  >
                    {searchTerm.trim() !== "" ? "No matching records found" : "No attendance records found"}
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
                    {!compact && <TableCell className="hidden sm:table-cell">{record.course}</TableCell>}
                    {courseType && !compact && (
                      <TableCell className="hidden md:table-cell">
                        {record.courseType && (
                          <Badge className={getBadgeColor(record.courseType)} variant="outline">
                            {record.courseType}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <span className="sm:hidden">{formatTimestamp(record.timestamp).split(",")[1]}</span>
                      <span className="hidden sm:inline">{formatTimestamp(record.timestamp)}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </div>

      {/* Show search results count when searching */}
      {searchTerm.trim() !== "" && (
        <div className="text-xs text-muted-foreground">
          Found {filteredRecords.length} {filteredRecords.length === 1 ? "record" : "records"} matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}

