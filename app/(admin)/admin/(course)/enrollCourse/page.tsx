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
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { StepIndicator } from "@/components/dashboard/step-indicator"
import type { StudentRaw, User } from "@/types/user"
import type { CourseRaw } from "@/types/course"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"


export default function EnrollmentPage() {
  const { push } = useRouter();
  const [currentStep, setCurrentStep] = useState(0)
  const [users, setUsers] = useState<StudentRaw[]>([])
  const [courses, setCourses] = useState<CourseRaw[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentRaw | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CourseRaw | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCourseQuery, setSearchCourseQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState(new Date())
  const [price, setPrice] = useState(10)
  const [time, setTime] = useState('00:00');

  const steps = ["Select Student", "Select Course", "Confirm Enrollment"]
  // const [users, setUsers] = useState<User[]>([])
  // Filter users based on search query
  const filteredStudent = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),

  )

  const filteredCourse = courses.filter(
    (course) =>
      (course.courseName?.toLowerCase() || "").includes((searchCourseQuery || "").toLowerCase()),

  )

  // Fetch users and courses on initial load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        const studentsData = await apiFetch<StudentRaw[]>('/api/studentsreforge');
        if (studentsData !== TOKEN_EXPIRED) {
          setUsers(studentsData);  // Set data only if the token is not expired
        }

        const coursesData = await apiFetch<CourseRaw[]>('/api/courses/');
        if (coursesData !== TOKEN_EXPIRED) {
          setCourses(coursesData);  // Set data only if the token is not expired
        }

      } catch (err: any) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong");
        }
      }
      finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])


  // Handle student selection
  const handleStudentSelect = (student: StudentRaw) => {
    setSelectedStudent(student)
    setCurrentStep(1) // Move to course selection step
  }

  // Handle course selection
  const handleCourseSelect = (course: CourseRaw) => {
    setSelectedCourse(course)
    setCurrentStep(2) // Move to confirmation step
  }

  // Handle enrollment submission
  const handleEnrollment = async () => {
    if (!selectedStudent || !selectedCourse) return

    try {
      setIsSubmitting(true)

      const amount = price;
      const formattedDate = encodeURIComponent(date.toISOString());
      const studentId = selectedStudent.id
      const courseId = selectedCourse.id
      const url = `/admin/enrollCourse/payment?amount=${amount}&date=${formattedDate}&studentId=${studentId}&courseId=${courseId}`;
      push(url);

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
              <CardTitle>Select Student</CardTitle>
              <CardDescription>Choose which student to enroll in a course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <RadioGroup className="space-y-3">
                {filteredStudent.map((student) => (
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
                          Username: {student.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Born: {new Date(student.birthdate).toLocaleDateString()}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 1 && selectedStudent && (
          <>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to enroll the student in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchCourseQuery}
                    onChange={(e) => setSearchCourseQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredCourse.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{course.courseName}</h3>
                      <Badge>{course.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Category: {course.description}</span>
                      <span>•</span>
                      <span>Level: {course.level}</span>
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

        {currentStep === 2 && selectedStudent && selectedCourse && (
          <>
            <CardHeader>
              <CardTitle>Confirm Enrollment</CardTitle>
              <CardDescription>Review and confirm course enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Student</h3>
                  <p>{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Born: {new Date(selectedStudent.birthdate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Course</h3>
                  <p>{selectedCourse.courseName}</p>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                    <span>Quota: {selectedCourse.quota}</span>
                    <span>•</span>
                    <span>Level: {selectedCourse.level}</span>
                  </div>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Start Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)}
                        className="!opacity-100 bg-background bg-white"
                        classNames={{
                          // Override any specific classes here
                          day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white",
                          // Add more overrides as needed
                        }} 
                        />
                    </PopoverContent>
                  </Popover>

                  <h3 className="font-medium mb-1">Time</h3>
                   
                   
                 
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Price</h3>
                  <div className="mt-1">
                    <Label htmlFor="credit-quantity" className="sr-only">
                      Credits
                    </Label>
                    <Input
                      id="credit-quantity"
                      type="number"
                      min={10}
                      max={99999}
                      value={price === 0 ? '' : price} 
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                        setPrice(isNaN(value) ? 0 : value) // Ensure we never set NaN
                      }}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Enter price for payment </p>
                  </div>
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

