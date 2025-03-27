"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, Check, Clock, Calendar } from "lucide-react"

// Sample data
const students = [
  { id: "student-1", name: "Somchai Jaidee", avatar: "/placeholder.svg?height=64&width=64", level: "Intermediate" },
  { id: "student-2", name: "Malee Sooksai", avatar: "/placeholder.svg?height=64&width=64", level: "Beginner" },
  { id: "student-3", name: "Wichai Thongdee", avatar: "/placeholder.svg?height=64&width=64", level: "Advanced" },
  { id: "student-4", name: "Pranee Rakdee", avatar: "/placeholder.svg?height=64&width=64", level: "Intermediate" },
  { id: "student-5", name: "Somsak Deejai", avatar: "/placeholder.svg?height=64&width=64", level: "Beginner" },
]

const teachers = [
  {
    id: "teacher-1",
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Conversation",
    rating: 4.9,
  },
  {
    id: "teacher-2",
    name: "Prof. Michael Chen",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Grammar",
    rating: 4.7,
  },
  {
    id: "teacher-3",
    name: "Ms. Emily Parker",
    avatar: "/placeholder.svg?height=64&width=64",
    specialty: "Business English",
    rating: 4.8,
  },
]

const courses = [
  {
    id: "course-1",
    title: "Advanced English Conversation",
    code: "ENG-301",
    duration: "1 hour",
    totalSessions: 10,
    description: "Improve your conversational English skills with focus on fluency and natural expression.",
  },
  {
    id: "course-2",
    title: "Business English Essentials",
    code: "ENG-202",
    duration: "1 hour",
    totalSessions: 8,
    description: "Learn essential English skills for professional environments and business communication.",
  },
  {
    id: "course-3",
    title: "English Grammar Fundamentals",
    code: "ENG-101",
    duration: "1 hour",
    totalSessions: 12,
    description: "Master the fundamentals of English grammar with practical exercises and examples.",
  },
]

interface CourseSelectionProps {
  onComplete: (data: { students: any[]; teacher: any; course: any }) => void
}

export default function CourseSelection({ onComplete }: CourseSelectionProps) {
  const [activeTab, setActiveTab] = useState("students")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const handleStudentToggle = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId)
    setActiveTab("courses")
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
  }

  const handleComplete = () => {
    const selectedStudentObjects = students.filter((student) => selectedStudents.includes(student.id))
    const selectedTeacherObject = teachers.find((teacher) => teacher.id === selectedTeacher)
    const selectedCourseObject = courses.find((course) => course.id === selectedCourse)

    onComplete({
      students: selectedStudentObjects,
      teacher: selectedTeacherObject,
      course: selectedCourseObject,
    })
  }

  const canProceedToTeachers = selectedStudents.length > 0
  const canProceedToCourses = selectedTeacher !== null
  const canComplete = selectedCourse !== null

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Course Registration</CardTitle>
          <CardDescription>Select students, teacher, and course to schedule sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students">1. Select Students</TabsTrigger>
              <TabsTrigger value="teachers" disabled={!canProceedToTeachers}>
                2. Choose Teacher
              </TabsTrigger>
              <TabsTrigger value="courses" disabled={!canProceedToCourses}>
                3. Pick Course
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="mt-6">
              <h3 className="text-lg font-medium mb-4">Select one or more students</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedStudents.includes(student.id)
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <Label htmlFor={`student-${student.id}`} className="text-base font-medium">
                              {student.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{student.level} Level</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setActiveTab("teachers")} disabled={!canProceedToTeachers}>
                  Continue to Teacher Selection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="teachers" className="mt-6">
              <h3 className="text-lg font-medium mb-4">Choose a teacher</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTeacher === teacher.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleTeacherSelect(teacher.id)}
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-base font-medium">{teacher.name}</h4>
                        <p className="text-sm text-muted-foreground">Specialty: {teacher.specialty}</p>
                        <div className="flex items-center justify-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(teacher.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">{teacher.rating}</span>
                        </div>
                      </div>
                      {selectedTeacher === teacher.id && (
                        <div className="mt-2 text-primary">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("students")}>
                  Back to Students
                </Button>
                <Button onClick={() => setActiveTab("courses")} disabled={!canProceedToCourses}>
                  Continue to Course Selection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <h3 className="text-lg font-medium mb-4">Select a course</h3>
              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCourse === course.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleCourseSelect(course.id)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.code}</p>
                        </div>
                        {selectedCourse === course.id && (
                          <div className="text-primary">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {course.duration} per session
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {course.totalSessions} sessions
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("teachers")}>
                  Back to Teachers
                </Button>
                <Button onClick={handleComplete} disabled={!canComplete}>
                  Continue to Scheduling
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${selectedStudents.length > 0 ? "bg-green-500" : "bg-gray-300"}`}
            ></div>
            <span className="text-sm">Students ({selectedStudents.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${selectedTeacher ? "bg-green-500" : "bg-gray-300"}`}></div>
            <span className="text-sm">Teacher</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${selectedCourse ? "bg-green-500" : "bg-gray-300"}`}></div>
            <span className="text-sm">Course</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

