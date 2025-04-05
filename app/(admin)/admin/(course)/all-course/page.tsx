"use client"

import { useState } from "react"
import SchedulerPage from "@/components/scheduleComponent/scheduler-page"
import CoursesPage from "@/components/courses-page"
import StudentSelection from "@/components/student-selection"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [selectedData, setSelectedData] = useState<{
    students: any[]
    teacher: any | null
    course: any | null
  } | null>(null)

  const [view, setView] = useState<"courses" | "student-selection" | "scheduler">("courses")
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)

  const handleCourseEnroll = (course: any) => {
    setSelectedCourse(course)
    setView("student-selection")
  }

  const handleStudentSelection = (students: any[]) => {
    setSelectedData({
      students,
      teacher: null, // We're not selecting teachers anymore
      course: selectedCourse,
    })
    setView("scheduler")
  }

  const handleBackToCoursesPage = () => {
    setView("courses")
    setSelectedCourse(null)
    setSelectedData(null)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {view === "courses" && <CoursesPage onEnroll={handleCourseEnroll} />}

      {view === "student-selection" && selectedCourse && (
        <StudentSelection
          course={selectedCourse}
          onComplete={handleStudentSelection}
          onBack={handleBackToCoursesPage}
        />
      )}

      {view === "scheduler" && selectedData && (
        <SchedulerPage
          students={selectedData.students}
          teacher={selectedData.teacher}
          course={selectedData.course}
          onBack={handleBackToCoursesPage}
        />
      )}
      <Toaster />
    </main>
  )
}

