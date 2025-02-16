"use client"

import { useState } from "react"
import StatisticsOverview from "@/components/dashboard/StatisticsOverview"
import MembershipPieChart from "@/components/dashboard/MembershipPieChart"
import NewStudentsBarChart from "@/components/dashboard/NewStudentsBarChart"
import AttendanceLog from "@/components/dashboard/AttendanceLog"
import MemberList from "@/components/dashboard/MemberList"
import MemberDetails from "@/components/dashboard/MemberDetails"
import AttendanceHistory from "@/components/dashboard/AttendanceHistory"

interface AttendanceRecord {
    id: number;
    name: string;
    timestamp: string;
  }
  
  interface Member {
    id: number;
    name: string;
    phoneNumber: string;
    role: string;
  }
  
  export default function DashboardAdmin() {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null); // Updated type
  
  const attendanceRecords = [
    { id: 1, name: "John Doe", timestamp: "2025-01-18 10:00 AM" },
    { id: 2, name: "Jane Smith", timestamp: "2025-01-18 10:15 AM" },
    { id: 3, name: "Alice Johnson", timestamp: "2025-01-18 10:30 AM" },
    { id: 4, name: "Bob Brown", timestamp: "2025-01-18 10:45 AM" },
    { id: 5, name: "Charlie Davis", timestamp: "2025-01-18 11:00 AM" },
    { id: 6, name: "Eva White", timestamp: "2025-01-18 11:15 AM" },
    { id: 7, name: "Frank Miller", timestamp: "2025-01-18 11:30 AM" },
    { id: 8, name: "Grace Taylor", timestamp: "2025-01-18 11:45 AM" },
  ]

  const teachers = [
    { id: 1, name: "John Doe", phoneNumber: "555-123-4567", role: "teacher" },
    { id: 2, name: "Jane Smith", phoneNumber: "555-987-6543", role: "teacher" },
    { id: 3, name: "Alice Johnson", phoneNumber: "555-246-8013", role: "teacher" },
    { id: 4, name: "Bob Brown", phoneNumber: "555-135-7924", role: "teacher" },
    { id: 5, name: "Charlie Davis", phoneNumber: "555-369-1215", role: "teacher" },
    { id: 6, name: "Eva White", phoneNumber: "555-789-3456", role: "teacher" },
  ];
  
  const students = [
    { id: 7, name: "Frank Miller", phoneNumber: "555-456-7890", role: "student" },
    { id: 8, name: "Grace Taylor", phoneNumber: "555-890-1234", role: "student" },
    { id: 9, name: "Henry Wilson", phoneNumber: "555-567-2345", role: "student" },
    { id: 10, name: "Ivy Moore", phoneNumber: "555-901-3456", role: "student" },
    { id: 11, name: "Jack Thompson", phoneNumber: "555-678-4567", role: "student" },
    { id: 12, name: "Kate Anderson", phoneNumber: "555-234-5678", role: "student" },
    { id: 13, name: "Liam Harris", phoneNumber: "555-345-6789", role: "student" },
    { id: 14, name: "Mia Clark", phoneNumber: "555-789-0123", role: "student" },
  ];
  

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <StatisticsOverview />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <NewStudentsBarChart />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <MembershipPieChart />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <AttendanceLog records={attendanceRecords} onSelectAttendance={setSelectedAttendance} />
        </div>
        <div className="md:col-span-1 lg:col-span-1">
          <MemberList title="Teachers" members={teachers} onSelectMember={setSelectedMember} />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <MemberList title="Students" members={students} onSelectMember={setSelectedMember} />
        </div>
      </div>

      {selectedMember && <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}

      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  )
}

