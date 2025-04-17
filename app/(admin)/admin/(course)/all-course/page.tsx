"use client"

import { useState } from "react"
import SchedulerPage from "@/components/scheduleComponent/scheduler-page"
import CoursesPage from "@/components/courses-page"
import StudentSelection from "@/components/student-selection"
import AttendanceReceiptPage from "@/components/scheduleComponent/confirm-page"
import { Toaster } from "@/components/ui/toaster"
import { ApiReceiptResponse } from "@/types/receipt"

export default function Home() {
  const [selectedData, setSelectedData] = useState<{
    students: any[]
    teacher: any | null
    course: any | null
  } | null>(null)

  const [view, setView] = useState<"courses" | "student-selection" | "scheduler" | "confirm-success">("courses")
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null)
  const [confirmData, setConfirmData] = useState<ApiReceiptResponse | null>(null)
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


  const handleConfirm = (response: ApiReceiptResponse) => {
    setView("confirm-success")
    setConfirmData(response)
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
          onConfirm={handleConfirm}
        />
      )}

      {view === "confirm-success" && confirmData && (
        <AttendanceReceiptPage response={confirmData} />
      )}
      <Toaster />
    </main>
  )
}

