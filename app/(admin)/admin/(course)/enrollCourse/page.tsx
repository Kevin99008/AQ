"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StudentSelect from "@/components/dashboard/StudentSelect"
import CourseSelect from "@/components/dashboard/CourseSelect"

// Mock data for students and courses
const students = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "Diana Ross" },
]

const courses = [
  { id: 1, name: "Mathematics 101", description: "Basic arithmetic and algebra" },
  { id: 2, name: "Physics 201", description: "Mechanics and thermodynamics" },
  { id: 3, name: "Chemistry 301", description: "Organic chemistry fundamentals" },
  { id: 4, name: "Biology 102", description: "Introduction to cellular biology" },
]

export default function EnrollCoursePage() {
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEnroll = () => {
    if (selectedStudent && selectedCourse) {
      console.log(`Enrolling student ${selectedStudent} in course ${selectedCourse}`)
      // Here you would typically call an API to enroll the student
      alert("Student enrolled successfully!")
    } else {
      alert("Please select both a student and a course")
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Enroll Course</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentSelect students={students} selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent} />
          <div>
            <CourseSelect
              courses={filteredCourses}
              selectedCourse={selectedCourse}
              onSelectCourse={setSelectedCourse}
            />
          </div>
          <Button onClick={handleEnroll} className="w-full">
            Enroll Student
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

