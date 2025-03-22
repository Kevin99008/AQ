"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { StepIndicator } from "@/components/dashboard/step-indicator"
import type { StudentRaw, TeacherRaw } from "@/types/user"
import type { CoursePriceRaw, ClassRaw, AttendanceRaw } from "@/types/course"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassCalendar } from "@/components/timeline/class-calendar"
import { Droplets, Music, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2 } from "lucide-react"

// Available time slots
const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

const typeConfig: Record<
  string,
  {
    color: string
    bgColor: string
    icon: React.ReactNode
  }
> = {
  AquaKids: {
    color: "bg-blue-500 text-white",
    bgColor: "border-blue-400",
    icon: <Droplets className="h-4 w-4" />,
  },
  Playsound: {
    color: "bg-orange-500 text-white",
    bgColor: "border-orange-400",
    icon: <Music className="h-4 w-4" />,
  },
  Other: {
    color: "bg-pink-500 text-white",
    bgColor: "border-pink-400",
    icon: <Sparkles className="h-4 w-4" />,
  },
}

export default function EnrollmentPage() {
  const { push } = useRouter();
  const [currentStep, setCurrentStep] = useState(0)
  const [users, setUsers] = useState<StudentRaw[]>([])
  const [courses, setCourses] = useState<CoursePriceRaw[]>([])
  const [teachers, setTeachers] = useState<TeacherRaw[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentRaw | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CoursePriceRaw | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRaw | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCourseQuery, setSearchCourseQuery] = useState("")
  const [searchTeacherQuery, setSearchTeacherQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [date, setDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date())
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["AquaKids", "Playsound", "Other"])
  const [classes, setClasses] = useState<ClassRaw[]>([])

  const steps = ["Select Student", "Select Course", "Select Teacher", "Select Time", "Confirm"]
  // const [users, setUsers] = useState<User[]>([])
  // Filter users based on search query
  const filteredStudent = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),

  )

  const filteredCourse = courses.filter(
    (course) =>
      (course.courseName?.toLowerCase() || "").includes((searchCourseQuery || "").toLowerCase()) &&
      selectedTypes.includes(course.type),

  )

  const filteredTeacger = teachers.filter(
    (teacher) =>
      (teacher.name?.toLowerCase() || "").includes((searchTeacherQuery || "").toLowerCase()) ||
      (teacher.username?.toLowerCase() || "").includes((searchTeacherQuery || "").toLowerCase()),
  )

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const typeMap: Record<number, CoursePriceRaw["type"]> = {
    1: "AquaKids",
    2: "Playsound",
    3: "Other",
  };

  function transformCourseResponse(response: any): CoursePriceRaw {
    return {
      id: response.id,
      courseName: response.courseName,
      description: response.description,
      type: typeMap[response.type] || "Other", // Default to "Other" if unknown
      quota: response.quota,
      price: response.price,
    };
  }

  // Fetch users and courses on initial load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        const studentsData = await apiFetch<StudentRaw[]>('/api/studentsreforge');
        if (studentsData !== TOKEN_EXPIRED) {
          setUsers(studentsData);  // Set data only if the token is not expired
        }

        const coursesData = await apiFetch<CoursePriceRaw[]>('/api/courses-price/');
        if (coursesData !== TOKEN_EXPIRED) {
          const transformedCourses = coursesData.map(transformCourseResponse);
          setCourses(transformedCourses);  // Set data only if the token is not expired
        }

        const teachersData = await apiFetch<TeacherRaw[]>('/api/teachersreforge/');
        if (teachersData !== TOKEN_EXPIRED) {
          setTeachers(teachersData);  // Set data only if the token is not expired
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
  const handleCourseSelect = (course: CoursePriceRaw) => {
    setSelectedCourse(course)
    setCurrentStep(2) // Move to confirmation step
  }

  function transformClassResponse(response: AttendanceRaw): ClassRaw {
    return {
      id: response.id,
      title: response.course_name,
      date: response.attendance_date,  // Assuming `session_date` is the correct field in the response
      startTime: response.start_time,  // Assuming `start_time` is the correct field in the response
      endTime: response.end_time,  // Assuming `end_time` is the correct field in the response
      instructor: response.teacher_name,  // Assuming `teacher_name` is the correct field in the response
      student: response.student_name,
      color: response.is_owner ? "bg-green-500" : 'bg-gray-500',  // Set color based on is_owner
    };
  }

  const handlerTeacherSelect = async (teacher: TeacherRaw) => {
    setSelectedTeacher(teacher)
    if (!selectedStudent || !selectedCourse) return
    try {
      const classData = await apiFetch<AttendanceRaw[]>(`/api/attendacne-buy/?student_id=${selectedStudent.id}&course_id=${selectedCourse.id}`);
      if (classData !== TOKEN_EXPIRED) {
        const transformedClasses = classData.map(transformClassResponse);
        setClasses(transformedClasses);  // Set data only if the token is not expired
      }
      setCurrentStep(3)
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  function transformNewResponse(response: AttendanceRaw): ClassRaw {
    return {
      id: response.id,
      title: response.course_name,
      date: response.attendance_date,  // Assuming `session_date` is the correct field in the response
      startTime: response.start_time,  // Assuming `start_time` is the correct field in the response
      endTime: response.end_time,  // Assuming `end_time` is the correct field in the response
      instructor: response.teacher_name,  // Assuming `teacher_name` is the correct field in the response
      student: response.student_name,
      color: "bg-yellow-500"  // Set color based on is_owner
    };
  }

  const handleValidateTimeline = async () => {
    if (!selectedStudent || !selectedCourse) return
    if (selectedTime === "") {
      toast.error("Please select time for session")
      return
    }

    const bangkokOffset = 7 * 60;
    const selecteddate = new Date(date.getTime() + bangkokOffset * 60 * 1000);
    const formattedDate = encodeURIComponent(selecteddate.toISOString());
    try {
      setIsValidating(true)

      const classData = await apiFetch<AttendanceRaw[]>(`/api/handle-timeline/`, "POST", {
        student_id: selectedStudent.id,
        course_id: selectedCourse.id,
        date: formattedDate,
        start_time: selectedTime,
      });
      if (classData !== TOKEN_EXPIRED) {
        setIsConfirm(true)
        const transformedClasses = classData.map(transformNewResponse);
        setClasses(prevClasses => {
          // Create a Set to store composite keys for existing entries
          const existingEntries = new Set(
            prevClasses.map((cls: any) =>
              cls.id !== 0 ? cls.id : `${cls.student_id}-${cls.course_id}-${cls.start_time}`
            )
          );

          // Filter out new classes that already exist in prevClasses
          const uniqueClasses = transformedClasses.filter((cls: any) => {
            // If the id is 0, compare by student_id, course_id, and start_time
            const uniqueKey = cls.id !== 0 ? cls.id : `${cls.student_id}-${cls.course_id}-${cls.start_time}`;
            return !existingEntries.has(uniqueKey);
          });

          // Add unique classes to the state
          return [...prevClasses, ...uniqueClasses];
        });

      }

      // setCurrentStep(4)
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsValidating(false)
    }
  }

  const handleAfterValidate = () => {
    setCurrentStep(4) // Move to confirmation step
  }

  // Handle enrollment submission
  const handleEnrollment = async () => {
    if (!selectedStudent || !selectedCourse || !selectedTeacher) return
    if (selectedTime === "") {
      toast.error("Please select time for session")
      return
    }
    try {
      setIsSubmitting(true)

      const amount = selectedCourse.price;
      const studentId = selectedStudent.id
      const courseId = selectedCourse.id
      const teacherId = selectedTeacher.id
      const courseName = selectedCourse.courseName
      const bangkokOffset = 7 * 60;
      const selecteddate = new Date(date.getTime() + bangkokOffset * 60 * 1000);
      const formattedDate = encodeURIComponent(selecteddate.toISOString());
      const time = selectedTime
      const url = `/admin/enrollCourse/payment?amount=${amount}&date=${formattedDate}&studentId=${studentId}&courseId=${courseId}&teacherId=${teacherId}&time=${time}&courseName=${courseName}`;
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
    if (currentStep === 4) {
      setCurrentStep(0)
      setIsConfirm(false)
    } else {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1)
        setIsConfirm(false)
      }
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

      <Card className="w-full mx-auto">
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
                <div className="space-y-3 max-h-[400px] overflow-y-auto ">
                  {filteredStudent.map((student) => (
                    <div key={student.id} className="flex items-center space-x-2 ">
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
                </div>
              </RadioGroup>

            </CardContent>
          </>
        )}

        {currentStep === 1 && selectedStudent && (
          <>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to enroll the student in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchCourseQuery}
                    onChange={(e) => setSearchCourseQuery(e.target.value)}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={selectedTypes.includes("AquaKids")}
                      onCheckedChange={() => toggleType("AquaKids")}
                    >
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600">AquaKids</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedTypes.includes("Playsound")}
                      onCheckedChange={() => toggleType("Playsound")}
                    >
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-600">Playsound</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedTypes.includes("Other")}
                      onCheckedChange={() => toggleType("Other")}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-pink-500" />
                        <span className="text-pink-600">Other</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto ">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCourse.map((course) => {
                    // Get config for this course type or use default
                    const config = typeConfig[course.type] || typeConfig["Other"]

                    return (
                      <Card key={course.id} className={cn("overflow-hidden border-t-4 hover:shadow-lg", config.bgColor)} onClick={() => handleCourseSelect(course)}>
                        <div className="relative">
                          {/* Price tag without hover effect */}
                          <div className="absolute right-0 top-0 z-10">
                            <div className="relative">
                              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white font-bold px-4 py-2 rounded-bl-lg shadow-md">
                                ฿{typeof course.price === "number" ? course.price.toFixed(2) : course.price}
                              </div>
                              <div className="absolute -bottom-2 -left-2 h-2 w-2 bg-slate-900 clip-corner"></div>
                            </div>
                          </div>

                          <CardHeader className="pb-0 pt-6">
                            <div className="flex items-center gap-2">
                              {config.icon}
                              <h3 className="text-lg font-semibold">{course.courseName}</h3>
                            </div>
                          </CardHeader>
                        </div>

                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={cn("flex items-center gap-1 border-0", config.color)}>
                              {config.icon}
                              <span>{course.type}</span>
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
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
              <CardTitle>Select Teacher</CardTitle>
              <CardDescription>Choose which teacher to enroll in a course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchTeacherQuery}
                    onChange={(e) => setSearchTeacherQuery(e.target.value)}
                  />
                </div>
              </div>

              <RadioGroup className="space-y-3">
              <div className="space-y-3 max-h-[400px] overflow-y-auto ">
                {filteredTeacger.map((teacher) => (
                  <div key={teacher.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={teacher.id.toString()}
                      id={`student-${teacher.id}`}
                      onClick={() => handlerTeacherSelect(teacher)}
                    />
                    <Label
                      htmlFor={`student-${teacher.id}`}
                      className="flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Username: {teacher.username}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
                </div>
              </RadioGroup>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 3 && selectedStudent && selectedCourse && selectedTeacher && (
          <>
            <div className="container mx-auto py-10">
              <h1 className="text-3xl font-bold mb-8">Class Calendar</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <ClassCalendar classes={classes} date={calendarDate} setDate={setCalendarDate} onSelectClass={setSelectedClass} />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Class Details</CardTitle>
                      <CardDescription>
                        {selectedClass ? "View selected class information" : "Select a class to view details"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedClass ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg">{selectedClass.title}</h3>
                            <p className="text-muted-foreground">
                              {new Date(selectedClass.date).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Start Time</p>
                              <p>{formatTime(selectedClass.startTime)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">End Time</p>
                              <p>{formatTime(selectedClass.endTime)}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Instructor</p>
                            <p>{selectedClass.instructor}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Student</p>
                            <p>{selectedClass.student}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No class selected</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card className="mt-8">
                    <CardContent>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Select a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)}
                            className="rounded-md border"
                            classNames={{
                              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                              day_disabled: "text-muted-foreground opacity-50",
                              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                              day_hidden: "invisible",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            }}
                          />
                        </PopoverContent>
                      </Popover>

                      <div className="space-y-2">
                        <Label>Select Time</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger id="time-select">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {timeSlots.map((time, index) => (
                              <SelectItem className="hover:bg-gray-200" key={index} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    {isConfirm && (
                      <Button className="w-full mt-4" onClick={handleAfterValidate} disabled={isValidating}>
                        Confirm Class Time
                      </Button>
                    )}
                    {!isConfirm && (
                      <Button className="w-full mt-4" onClick={handleValidateTimeline} disabled={isValidating}>
                        {isValidating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          "Course Validation"
                        )}
                      </Button>
                    )}
                  </Card>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 4 && selectedStudent && selectedCourse && selectedTeacher && (
          <>
            <CardHeader className="max-w-md mx-auto">
              <CardTitle>Confirm Enrollment</CardTitle>
              <CardDescription>Review and confirm course enrollment</CardDescription>
            </CardHeader>
            <CardContent className="max-w-md mx-auto">
              <div className="space-y-4">
                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Student</h3>
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                    {selectedStudent.name}
                  </h3>
                  <span className="inline-block bg-blue-50 text-blue-700 rounded-md px-2 py-0.5 font-medium">
                    @{selectedStudent.username}
                  </span>
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
                    <span>Type: {selectedCourse.type}</span>
                  </div>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Start Date & Time</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Price</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="font-medium">฿{selectedCourse.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {currentStep === 4 ? (
                  "Cancel"
                ) : (
                  "Back"
                )}

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

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}