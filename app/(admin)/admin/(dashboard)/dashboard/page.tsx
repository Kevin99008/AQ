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
import AttendanceHistory from "@/components/adminComponent/dashboard/AttendanceHistory"
import AttendanceHeatmap from "@/components/adminComponent/dashboard/AttendanceHeatmap"
import type { AttendanceRecord, StatisticsData } from "@/types/dashboard"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import CategoryEnrollmentChart from "@/components/adminComponent/dashboard/CategoryEnrollmentChart"

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

  // Update the categories state type and handling
  const [categories, setCategories] = useState<Array<{ id: string | number; categoryName: string }>>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  // Update the fetchCategories function to handle category objects
  const fetchCategories = async () => {
    try {
      const response = await apiFetch<Array<{ id: string | number; categoryName: string }>>("/api/categories")
      if (response !== TOKEN_EXPIRED) {
        return response
      }
      throw new Error("Failed to fetch categories")
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  // Add useEffect to load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories() // Fetch categories
        setCategories(fetchedCategories)
      } catch (error) {
        setCategoryError("Failed to load categories")
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

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
        <CardTitle className="text-md font-medium">Enrollment & Population</CardTitle>
        <div className="flex flex-col sm:flex-row mt-4 space-y-4 sm:space-x-4 sm:space-y-0 ">
          <div className="w-full sm:w-1/2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Enrollment of each group</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryEnrollmentChart />
              </CardContent>
            </Card>
          </div>
          <div className="w-full sm:w-1/2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">Student Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsOverview countStudentData={countStudentData} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-400 h-[1px] mt-2"></div>

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
                  {loadingCategories ? (
                    <DropdownMenuRadioItem value="loading" disabled>
                      Loading categories...
                    </DropdownMenuRadioItem>
                  ) : categoryError ? (
                    <DropdownMenuRadioItem value="error" disabled>
                      {categoryError}
                    </DropdownMenuRadioItem>
                  ) : (
                    categories.map((category) => (
                      <DropdownMenuRadioItem key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </DropdownMenuRadioItem>
                    ))
                  )}
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
                  <MembershipDistribution category={selectedGroup} />
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
                  <AttendanceHeatmap category={selectedGroup} />
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

