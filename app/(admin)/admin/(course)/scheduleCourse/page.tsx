"use client"

import { useState } from "react"
import CourseScheduler from "@/components/scheduleComponent/course-scheduler"
import CourseSelection from "@/components/scheduleComponent/course-selection"
import SchedulerPage from "@/components/scheduleComponent/scheduler-page"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [selectedData, setSelectedData] = useState<{
    students: any[]
    teacher: any | null
    course: any | null
  } | null>(null)

  return (
    <main className="min-h-screen bg-gray-50">
      {!selectedData ? (
        <CourseSelection onComplete={setSelectedData} />
      ) : (
        <SchedulerPage
          students={selectedData.students}
          teacher={selectedData.teacher}
          course={selectedData.course}
          onBack={() => setSelectedData(null)}
        />
      )}
      <Toaster />
    </main>
  )
}

