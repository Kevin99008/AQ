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
import EnrollmentTrends from "@/components/dashboard/EnrollmentTrends"
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
  const [studentData, setStudentData] = useState<StudentData[]>([])
  const [courseData, setCourseData] = useState<CourseData[]>([])
  const [countStudentData, setcountStudentData] = useState<StatisticsData>({
    totalStudent: 0,
    activeStudent: 0,
    inactiveStudent: 0,
    newStudents: 0,
  })
  const [pieChartData, setPieData] = useState<PieChartData[]>([
    { name: "Teacher", value: 0 },
    { name: "Student", value: 0 },
  ])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const { push } = useRouter()

  useEffect(() => {
    // Fetch data based on the selected group
    const fetchData = async () => {
      try {
        // Fetch statistics data
        const countStudentResponse = await apiFetch<StatisticsData>(`/api/static/count`)
        if (countStudentResponse !== TOKEN_EXPIRED) {
          setcountStudentData(countStudentResponse)
        }

        // Fetch pie chart data
        const pieChartResponse = await apiFetch<PieChartData[]>(`/api/static/pie`)
        if (pieChartResponse !== TOKEN_EXPIRED) {
          setPieData(pieChartResponse)
        }

        const attendanceResponse = await apiFetch<AttendanceRecord[]>(`/api/attendance-log/?sortNewestFirst=true`)
        if (attendanceResponse !== TOKEN_EXPIRED) {
          setAttendanceRecords(attendanceResponse) // Now passing an array
        }
        // Get mock data for the selected group
        // const fetchedStudentData = getMockDataByGroup(selectedGroup, "studentData")
        // setStudentData(fetchedStudentData)

        // const fetchedCourseData = getMockDataByGroup(selectedGroup, "courseData")
        // setCourseData(fetchedCourseData)

        // const fetchedAttendanceRecords = getMockDataByGroup(selectedGroup, "attendanceRecords")
        // setAttendanceRecords(fetchedAttendanceRecords)
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
        <StatisticsOverview countStudentData={countStudentData}/>
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

      {/* Enrollment & Membership Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Enrollment & Member</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Enrollment Trends</CardTitle>
                <CardDescription>New and returning students over time</CardDescription>
              </CardHeader>
              <CardContent>
                <EnrollmentTrends data={studentData} />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Member Distribution</CardTitle>
                <CardDescription>Teacher vs Student ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <MembershipDistribution data={pieChartData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Course Performance Section */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Course Performance</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Course Analytics</CardTitle>
            <CardDescription>Course offerings, attendance rates, and capacity utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <CoursePerformance data={courseData} />
          </CardContent>
        </Card>
      </div> */}

      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  )
}

