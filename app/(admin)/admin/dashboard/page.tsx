"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import StatisticsOverview from "@/components/dashboard/StatisticsOverview"
import MembershipPieChart from "@/components/dashboard/MembershipPieChart"
import NewStudentsBarChart from "@/components/dashboard/NewStudentsBarChart"
import NewCoursesBarChart from "@/components/dashboard/NewCoursesBarChart"
import AttendanceLog from "@/components/dashboard/AttendanceLog"
import AttendanceHistory from "@/components/dashboard/AttendanceHistory"

interface AttendanceRecord {
  id: number
  name: string
  timestamp: string
  course: string
}

export default function DashboardAdmin() {
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null)

  const attendanceRecords = [
    { id: 1, name: "John Doe", timestamp: "2025-01-18 10:00 AM", course: "Mathematics 101" },
    { id: 2, name: "Jane Smith", timestamp: "2025-01-18 10:15 AM", course: "Physics 202" },
    { id: 3, name: "Alice Johnson", timestamp: "2025-01-18 10:30 AM", course: "Chemistry 301" },
    { id: 4, name: "Bob Brown", timestamp: "2025-01-18 10:45 AM", course: "Biology 102" },
    { id: 5, name: "Charlie Davis", timestamp: "2025-01-18 11:00 AM", course: "English Literature 201" },
    { id: 6, name: "Eva White", timestamp: "2025-01-18 11:15 AM", course: "Computer Science 401" },
    { id: 7, name: "Frank Miller", timestamp: "2025-01-18 11:30 AM", course: "History 301" },
    { id: 8, name: "Grace Taylor", timestamp: "2025-01-18 11:45 AM", course: "Art 101" },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <StatisticsOverview />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <NewStudentsBarChart />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <NewCoursesBarChart />
        </div>
        <div className="md:col-span-2">
          <AttendanceLog records={attendanceRecords} onSelectAttendance={setSelectedAttendance} />
        </div>
        <div>
          <MembershipPieChart />
        </div>
      </div>
      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  )
}

