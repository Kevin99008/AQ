"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberList from "@/components/dashboard/MemberList"
import MemberDetails from "@/components/dashboard/MemberDetails"

interface Member {
  id: number
  name: string
  contact: string
  role: string
}

export default function MemberListPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [teacherSearch, setTeacherSearch] = useState("")
  const [studentSearch, setStudentSearch] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [teachers, setTeachers] = useState<Member[]>([])
  const [students, setStudents] = useState<Member[]>([])
  const [users, setUsers] = useState<Member[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, studentsRes, usersRes] = await Promise.all([
          fetch("http://localhost:8000/api/teachers/"),
          fetch("http://localhost:8000/api/students/"),
          fetch("http://localhost:8000/api/user/list/"),
        ])
  
        const [teachersData, studentsData, usersData] = await Promise.all([
          teachersRes.json(),
          studentsRes.json(),
          usersRes.json(),
        ])
  
        setTeachers(teachersData)
        setStudents(studentsData)
        setUsers(usersData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }
  
    fetchData()
  }, [])
  

const filteredTeachers = teachers.filter(
  (teacher) => teacher.name && teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
)

const filteredStudents = students.filter(
  (student) => student.name && student.name.toLowerCase().includes(studentSearch.toLowerCase())
)

const filteredUsers = users.filter(
  (user) => user.name && user.name.toLowerCase().includes(userSearch.toLowerCase())
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
        <div>
        <Input
          type="text"
          placeholder="Search members..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="mb-4"
        />
        <MemberList title="Members List" members={filteredUsers} onSelectMember={setSelectedMember} />
      </div>
      </div>
      {selectedMember && <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  )
}
