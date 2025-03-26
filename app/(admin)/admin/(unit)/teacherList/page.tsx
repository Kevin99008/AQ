"use client"

import { useEffect, useState } from "react"
import { TeacherSearch } from "@/components/adminComponent/teacherList/teacher-search"
import { TeacherList } from "@/components/adminComponent/teacherList/teacher-list"
import { TeacherDetails } from "@/components/adminComponent/teacherList/teacher-details"
import type { Teacher } from "@/types/teacher"
import { fetchTeachers, fetchTeacher } from "@/services/api"
import { toast } from "react-toastify"

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null) // No teacher selected by default
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Fetch all teachers
  const loadTeachers = async () => {
    try {
      setIsLoading(true)
      const data = await fetchTeachers()
      setTeachers(data)
    } catch (error) {
      toast.error("Failed to load teachers. Please refresh the page.")
      console.error("Failed to fetch teachers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch all teachers on initial load
  useEffect(() => {
    loadTeachers()
  }, [])

  // Handle selecting a teacher
  const handleSelectTeacher = async (teacher: Teacher) => {
    try {
      // Fetch the full teacher data with sessions
      const teacherData = await fetchTeacher(teacher.id)
      setSelectedTeacher(teacherData)

      // Update the teacher in the teachers array
      setTeachers((prevTeachers) => prevTeachers.map((t) => (t.id === teacherData.id ? teacherData : t)))
    } catch (error) {
      toast.error("Failed to load teacher details.")
      console.error("Failed to fetch teacher details:", error)
    }
  }

  // Handle refreshing teacher data after adding a session
  const handleSessionAdded = async () => {
    if (selectedTeacher) {
      try {
        const updatedTeacher = await fetchTeacher(selectedTeacher.id)
        setSelectedTeacher(updatedTeacher)

        // Update the teacher in the teachers array
        setTeachers((prevTeachers) => prevTeachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t)))
      } catch (error) {
        toast.error("Failed to refresh teacher data.")
        console.error("Failed to refresh teacher data:", error)
      }
    }
  }

  // Handle teacher created event
  const handleTeacherCreated = () => {
    loadTeachers()
  }

  return (
    <div className="relative">
      {/* Content hidden on mobile */}
      <div className="hidden md:block">
        <div className="flex h-screen flex-col md:flex-row">
          {/* Left side - Teacher list with search */}
          <div className="w-full border-r md:w-1/3 lg:w-1/4">
            <h1 className="text-2xl font-bold">Teacher List</h1>
            <TeacherSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onTeacherCreated={handleTeacherCreated}
            />
            {isLoading ? (
              <div className="flex justify-center items-center h-[calc(100vh-73px)]">
                <p className="text-muted-foreground">Loading teachers...</p>
              </div>
            ) : (
              <TeacherList
                teachers={filteredTeachers}
                selectedTeacher={selectedTeacher}
                onSelectTeacher={handleSelectTeacher}
              />
            )}
          </div>

          {/* Right side - Teacher details */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Loading teacher details...</p>
              </div>
            ) : selectedTeacher === null ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Select a teacher to view details</p>
              </div>
            ) : (
              <TeacherDetails teacher={selectedTeacher} onSessionAdded={handleSessionAdded} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile view - Message to switch to desktop mode */}
      <div className="md:hidden flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Please switch to Desktop Mode</h2>
          <p className="mt-4 text-lg">This page is best viewed on a desktop browser.</p>
        </div>
      </div>
    </div>
  )
}

