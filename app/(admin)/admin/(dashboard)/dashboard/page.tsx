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
import StatisticsOverview from "@/components/adminComponent/dashboard/StatisticsOverview"
import MembershipDistribution from "@/components/adminComponent/dashboard/MembershipDistribution"
import AttendanceLog from "@/components/adminComponent/dashboard/AttendanceLog"
import AttendanceHistory from "@/components/adminComponent/dashboard/AttendanceHistory"
import AttendanceHeatmap from "@/components/adminComponent/dashboard/AttendanceHeatmap"
import type { AttendanceRecord, StudentData, CourseData, PieChartData, StatisticsData } from "@/types/dashboard"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import CourseTypeEnrollmentChart from "@/components/adminComponent/dashboard/CourseTypeEnrollmentChart"

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
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="mb-6">      
        <CardTitle className="text-md font-medium">Enrollment & Student amount</CardTitle>
          <div className="flex flex-col sm:flex-row mt-4 space-y-4 sm:space-x-4 sm:space-y-0">
            <div className="w-full sm:w-1/2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">
                    Enrollment of each group
                  </CardTitle>
                  <CardDescription>Enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseTypeEnrollmentChart />
                </CardContent>
              </Card>
            </div>
            <div className="w-full sm:w-1/2">
              <StatisticsOverview countStudentData={countStudentData} />
            </div>
          </div>

  <div className="bg-gray-200 h-[1px] mt-2"></div>

  <div className="mt-2">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <CardTitle className="text-xl font-medium">Ratio & Heatmap</CardTitle>
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

    <div className="flex flex-col sm:flex-row justify-between mt-4 space-x-0 sm:space-x-4">
      <div className="flex-1 mb-4 sm:mb-0">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">
              Member {selectedGroup !== "All" && `- ${selectedGroup}`}
            </CardTitle>
            <CardDescription>Student & Teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <MembershipDistribution courseType={selectedGroup} />
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <Card className="h-full">
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
  </div>
</div>
      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  )
}

