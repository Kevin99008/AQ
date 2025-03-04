"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberList from "@/components/dashboard/MemberList"
import MemberDetails from "@/components/dashboard/MemberDetails"

interface Member {
  id: number
  name: string
  phoneNumber: string
  role: string
}

export default function MemberListPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [teacherSearch, setTeacherSearch] = useState("")
  const [studentSearch, setStudentSearch] = useState("")

  const teachers = [
    { id: 1, name: "John Doe", phoneNumber: "555-123-4567", role: "teacher" },
    { id: 2, name: "Jane Smith", phoneNumber: "555-987-6543", role: "teacher" },
    { id: 3, name: "Alice Johnson", phoneNumber: "555-246-8013", role: "teacher" },
    { id: 4, name: "Bob Brown", phoneNumber: "555-135-7924", role: "teacher" },
    { id: 5, name: "Charlie Davis", phoneNumber: "555-369-1215", role: "teacher" },
    { id: 6, name: "Eva White", phoneNumber: "555-789-3456", role: "teacher" },
  ]

  const students = [
    { id: 7, name: "Frank Miller", phoneNumber: "555-456-7890", role: "student" },
    { id: 8, name: "Grace Taylor", phoneNumber: "555-890-1234", role: "student" },
    { id: 9, name: "Henry Wilson", phoneNumber: "555-567-2345", role: "student" },
    { id: 10, name: "Ivy Moore", phoneNumber: "555-901-3456", role: "student" },
    { id: 11, name: "Jack Thompson", phoneNumber: "555-678-4567", role: "student" },
    { id: 12, name: "Kate Anderson", phoneNumber: "555-234-5678", role: "student" },
    { id: 13, name: "Liam Harris", phoneNumber: "555-345-6789", role: "student" },
    { id: 14, name: "Mia Clark", phoneNumber: "555-789-0123", role: "student" },
  ]

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()),
  )

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Member List</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Input
            type="text"
            placeholder="Search teachers..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            className="mb-4"
          />
          <MemberList title="Teachers List" members={filteredTeachers} onSelectMember={setSelectedMember} />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Search students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="mb-4"
          />
          <MemberList title="Students List" members={filteredStudents} onSelectMember={setSelectedMember} />
        </div>
      </div>
      {selectedMember && <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  )
}

