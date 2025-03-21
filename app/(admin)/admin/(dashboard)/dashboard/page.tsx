"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatisticsOverview from "@/components/dashboard/StatisticsOverview"
import MembershipDistribution from "@/components/dashboard/MembershipDistribution"
import CoursePerformance from "@/components/dashboard/CoursePerformance"
import AttendanceLog from "@/components/dashboard/AttendanceLog"
import AttendanceHistory from "@/components/dashboard/AttendanceHistory"
import AttendanceHeatmap from "@/components/dashboard/AttendanceHeatmap"
import type { AttendanceRecord, StudentData, CourseData, PieChartData, StatisticsData } from "@/types/dashboard"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { useRouter } from "next/navigation"

export default function DashboardAdmin() {
  const [selectedGroup, setSelectedGroup] = useState<string>("All")
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null)
  const [countStudentData, setcountStudentData] = useState<StatisticsData>({
    totalStudent: 0,
    activeStudent: 0,
    inactiveStudent: 0,
    newStudents: 0,
  })
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    // Fetch data based on the selected group
    const fetchData = async () => {
      try {
        // Fetch statistics data
        const countStudentResponse = await apiFetch<StatisticsData>(`/api/static/count`)
        if (countStudentResponse !== TOKEN_EXPIRED) {
          setcountStudentData(countStudentResponse)
        }

        const attendanceResponse = await apiFetch<AttendanceRecord[]>(`/api/attendance-log/?sortNewestFirst=true`)
        if (attendanceResponse !== TOKEN_EXPIRED) {
          setAttendanceRecords(attendanceResponse) // Now passing an array
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [selectedGroup])

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              {selectedGroup}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuRadioGroup value={selectedGroup} onValueChange={setSelectedGroup}>
              <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="AquaKids">AquaKids</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Playsound">Playsound</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Other">Other</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Key Metrics Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 px-1">Key Metrics</h2>
        <div>
          <StatisticsOverview countStudentData={countStudentData}/>
        </div>
        <div className="mt-4">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Members {selectedGroup !== "All" && `- ${selectedGroup}`}
                </CardTitle>
                <CardDescription>Distribution and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <MembershipDistribution courseType={selectedGroup} />
              </CardContent>
            </Card>
          </div>
      </div>

      {/* Attendance Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Attendance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Recent Attendance</CardTitle>
              <CardDescription>Search and view latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceLog
                records={attendanceRecords}
                onSelectAttendance={setSelectedAttendance}
                sortNewestFirst={true}
                courseType={selectedGroup}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Attendance Patterns</CardTitle>
              <CardDescription>Weekly attendance heatmap</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <AttendanceHeatmap courseType={selectedGroup} />
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  )
}

