"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { StepIndicator } from "@/components/dashboard/step-indicator"
import type { User, Student } from "@/types/user"
import type { Course } from "@/types/course"
import { fetchUsers, fetchUser, fetchCourses, enrollStudentInCourse } from "@/services/api"

export default function EnrollmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = ["Select Parent", "Select Student", "Select Course", "Confirm Enrollment"]

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (user.role?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),
  )

  // Fetch users and courses on initial load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [usersData, coursesData] = await Promise.all([fetchUsers(), fetchCourses()])
        setUsers(usersData)
        setCourses(coursesData)
      } catch (error) {
        toast.error("Failed to load data. Please refresh the page.")
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle user selection
  const handleUserSelect = async (user: User) => {
    try {
      // Fetch the full user data with students
      const userData = await fetchUser(user.id)
      setSelectedUser(userData)
      setCurrentStep(1) // Move to student selection step
    } catch (error) {
      toast.error("Failed to load user details.")
      console.error("Failed to fetch user details:", error)
    }
  }

  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student)
    setCurrentStep(2) // Move to course selection step
  }

  // Handle course selection
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setCurrentStep(3) // Move to confirmation step
  }

  // Handle enrollment submission
  const handleEnrollment = async () => {
    if (!selectedStudent || !selectedCourse) return

    try {
      setIsSubmitting(true)

      const result = await enrollStudentInCourse(selectedStudent.id, selectedCourse.id)

      toast.success(result.message)

      // Reset form and go back to first step
      setSelectedUser(null)
      setSelectedStudent(null)
      setSelectedCourse(null)
      setCurrentStep(0)

      // Optionally redirect to another page
      // router.push('/students')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to enroll student in course.")
      }
      console.error("Enrollment error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Course Enrollment</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <Card className="w-full max-w-3xl mx-auto">
        {currentStep === 0 && (
          <>
            <CardHeader>
              <CardTitle>Select Parent</CardTitle>
              <CardDescription>Choose the parent of the student you want to enroll</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search parents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <Avatar>
                        <AvatarImage src={user.avatar || ""} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="text-sm">{user.students?.length || 0} students</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No parents found</p>
                )}
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 1 && selectedUser && (
          <>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>Choose which student to enroll in a course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar || ""} alt={selectedUser.username} />
                    <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.username}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                  </div>
                </div>
              </div>

              {selectedUser.students.length > 0 ? (
                <RadioGroup className="space-y-3">
                  {selectedUser.students.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={student.id.toString()}
                        id={`student-${student.id}`}
                        onClick={() => handleStudentSelect(student)}
                      />
                      <Label
                        htmlFor={`student-${student.id}`}
                        className="flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Born: {new Date(student.birthdate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{student.sessions.length} courses</Badge>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No students found for this parent. Please add a student first.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && selectedStudent && (
          <>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to enroll the student in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                  <div>
                    <p className="font-medium">{selectedStudent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Born: {new Date(selectedStudent.birthdate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{course.name}</h3>
                      <Badge>{course.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Category: {course.category}</span>
                      <span>•</span>
                      <span>Duration: {course.duration}</span>
                      <span>•</span>
                      <span>Starts: {new Date(course.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 3 && selectedUser && selectedStudent && selectedCourse && (
          <>
            <CardHeader>
              <CardTitle>Confirm Enrollment</CardTitle>
              <CardDescription>Review and confirm course enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Parent</h3>
                  <p>{selectedUser.username}</p>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Student</h3>
                  <p>{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Born: {new Date(selectedStudent.birthdate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Course</h3>
                  <p>{selectedCourse.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                    <span>Category: {selectedCourse.category}</span>
                    <span>•</span>
                    <span>Level: {selectedCourse.level}</span>
                    <span>•</span>
                    <span>Duration: {selectedCourse.duration}</span>
                    <span>•</span>
                    <span>Starts: {new Date(selectedCourse.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Current Courses</h3>
                  {selectedStudent.sessions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedStudent.sessions.map((session, index) => (
                        <Badge key={index} variant="secondary">
                          {session.courseName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No courses enrolled</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleEnrollment} disabled={isSubmitting}>
                {isSubmitting ? "Enrolling..." : "Confirm Enrollment"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

