"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Award, Plus, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react"
import { use } from "react"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample course data based on the provided JSON
type Teacher = {
  id: number
  name: string
  contact: string
  status: string
}

type Attendance = {
  id: number
  status: string
  type: string
  student_id: number
  student_name: string
  attendance_date: string
  start_time: string
  end_time: string
  checked_date: string | null
}

type Session = {
  id: number
  name: string
  total_quota: number
  attendances: Attendance[]
}

type Course = {
  id: number
  name: string
  description: string
  type: string
  min_age: number
  max_age: number
  quota: number
  created_at: string // ISO date string
  price: number
  category: string
  teachers: Teacher[]
  sessions: Session[]
}

export default function AdminCourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [teacherList, setTeacherList] = useState<Teacher[]>([])
  const [deleteTeacherDialogOpen, setDeleteTeacherDialogOpen] = useState(false)
  const [teacherToRemove, setTeacherToRemove] = useState<any>(null)
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState<any>(null)
  const [sessionSearchQuery, setSessionSearchQuery] = useState("")
  const [openSessions, setOpenSessions] = useState<Record<number, boolean>>({})

  // Unwrap params using React.use()
  const params = use(props.params)
  const id = params.id

  const fetchCourse = async () => {
    const courseId = Number.parseInt(id)
    try {
      const courseResult = await apiFetch<Course>(`/api/new/courses/detail/${courseId}/`)
      if (courseResult !== TOKEN_EXPIRED) {
        setCourse(courseResult)
        setLoading(false)
      }

      const teacherResult = await apiFetch<Teacher[]>(`/api/new/courses/add-teacher-list/${courseId}/`)
      if (teacherResult !== TOKEN_EXPIRED) {
        setTeacherList(teacherResult)
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  const toggleSession = (sessionId: number) => {
    setOpenSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  const formatAgeInMonths = (months: number | null): string => {
    if (months === null) return "N/A"

    if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""}`
    } else {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12

      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? "s" : ""}`
      } else {
        return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
      }
    }
  }

  const handleAddTeacher = async () => {
    if (!selectedTeacher) return

    const teacherId = Number.parseInt(selectedTeacher)
    const courseId = Number.parseInt(id)
    try {
      const response = await apiFetch<any>(`/api/new/courses/${courseId}/assign-teacher/`, "POST", {
        teacher_id: teacherId,
      })
      if (response !== TOKEN_EXPIRED) {
        fetchCourse()
        toast.success("Successfully Added Teacher to Course")
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const handleRemoveTeacher = (teacher: any) => {
    setTeacherToRemove(teacher)
    setDeleteTeacherDialogOpen(true)
  }

  const confirmRemoveTeacher = async () => {
    if (teacherToRemove && course) {
      const courseId = Number.parseInt(id)
      try {
        const response = await apiFetch<any>(
          `/api/new/courses/${courseId}/${Number.parseInt(teacherToRemove.id)}/remove-teacher/`,
          "DELETE",
        )
        if (response !== TOKEN_EXPIRED) {
          fetchCourse()
          toast.success("Successfully Removed Teacher from Course")
        }
      } catch (err: any) {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error("Something went wrong")
        }
      }
    }
  }

  // Helper function to determine attendance status display
  const getAttendanceStatus = (attendance: Attendance) => {
    // Check if checked_date is missing or empty
    if (!attendance.checked_date) {
      return { text: "No Record", variant: "secondary" }
    }

    // Otherwise use the status field
    if (attendance.status === "present") {
      return { text: "Present", variant: "green" }
    } else if (attendance.status === "absent") {
      return { text: "Absent", variant: "destructive" }
    } else if (!attendance.status) {
      return { text: "No Record", variant: "secondary" }
    } else {
      return { text: attendance.status, variant: "secondary" }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center py-8">Course not found.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button onClick={() => router.push("/admin/unit-course")} className="w-full">
              Return to Course List
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{course.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant={
                      course.category === "Aquakids" ? "blue" : course.category === "Playsounds" ? "green" : "secondary"
                    }
                    className="text-sm"
                  >
                    {course.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Price: THB{course.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    {course.type === "restricted" && (
                      <span>
                        Age Range: {formatAgeInMonths(course.min_age)} - {formatAgeInMonths(course.max_age)}
                      </span>
                    )}
                    {course.type !== "restricted" && <span>Age Range: All ages</span>}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Duration: 10 class</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="teachers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teachers">Teacher Assignments</TabsTrigger>
              <TabsTrigger value="sessions">Sessions & Attendance</TabsTrigger>
              <TabsTrigger value="details">Course Details</TabsTrigger>
            </TabsList>

            <TabsContent value="teachers" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Assigned Teachers</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Teacher
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Teacher to Course</DialogTitle>
                      <DialogDescription>Select a teacher to assign to this course.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search teachers..."
                          className="pl-8"
                          value={teacherSearchQuery}
                          onChange={(e) => setTeacherSearchQuery(e.target.value)}
                        />
                      </div>

                      {teacherList.length > 0 ? (
                        <div className="max-h-[200px] overflow-y-auto border rounded-md">
                          {teacherList
                            .filter(
                              (teacher) =>
                                teacher.name.toLowerCase().includes(teacherSearchQuery.toLowerCase()) ||
                                teacher.contact.toLowerCase().includes(teacherSearchQuery.toLowerCase()),
                            )
                            .map((teacher) => (
                              <div
                                key={teacher.id}
                                className={`flex items-center justify-between p-3 hover:bg-muted cursor-pointer ${
                                  selectedTeacher === teacher.id.toString() ? "bg-muted" : ""
                                } ${teacherList.indexOf(teacher) !== teacherList.length - 1 ? "border-b" : ""}`}
                                onClick={() => {
                                  setSelectedTeacher(teacher.id.toString())
                                  setConfirmDialogOpen(true)
                                  setSelectedTeacherDetails(teacher)
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{teacher.name}</p>
                                    <p className="text-xs text-muted-foreground">{teacher.contact}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">No available teachers</div>
                      )}
                    </div>
                  </DialogContent>
                  {selectedTeacherDetails && (
                    <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Teacher Assignment</AlertDialogTitle>
                          {/* Don't use AlertDialogDescription for complex content */}
                        </AlertDialogHeader>
                        <div className="space-y-4 py-3">
                          <p className="text-sm">
                            You are about to add <span className="font-medium">{selectedTeacherDetails.name}</span> to
                            this course.
                          </p>
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-800">
                              This teacher will be automatically assigned to all course timeslots and will be
                              responsible for:
                            </p>
                            <ul className="text-sm text-blue-800 list-disc pl-5 mt-2">
                              <li>Attending all scheduled classes</li>
                              <li>Managing student attendance</li>
                              <li>Providing course materials</li>
                              <li>Evaluating student progress</li>
                            </ul>
                          </div>
                          <p className="text-sm">Do you want to continue?</p>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setConfirmDialogOpen(false)
                              setSelectedTeacher("")
                            }}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleAddTeacher()
                              setConfirmDialogOpen(false)
                            }}
                          >
                            Confirm Assignment
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </Dialog>
              </div>

              {course.teachers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.teachers.map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {teacher.name}
                          </div>
                        </TableCell>
                        <TableCell>{teacher.contact}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === "active" ? "green" : "secondary"} className="text-sm">
                            {teacher.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveTeacher(teacher)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No teachers assigned to this course yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="space-y-4 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Course Sessions</h2>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search sessions or students..."
                    className="pl-8"
                    value={sessionSearchQuery}
                    onChange={(e) => setSessionSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {course.sessions && course.sessions.length > 0 ? (
                <div className="space-y-4">
                  {course.sessions
                    .filter((session: Session) => {
                      if (!sessionSearchQuery) return true
                      const query = sessionSearchQuery.toLowerCase()

                      // Search by session name
                      if (session.name.toLowerCase().includes(query)) return true

                      // Search by student name in attendances
                      return session.attendances.some((attendance: Attendance) =>
                        attendance.student_name.toLowerCase().includes(query),
                      )
                    })
                    .map((session: Session) => (
                      <Collapsible
                        key={session.id}
                        open={openSessions[session.id]}
                        onOpenChange={() => toggleSession(session.id)}
                        className="border rounded-md"
                      >
                        <CollapsibleTrigger asChild>
                          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted">
                            <div className="flex flex-col">
                              <div className="font-medium">{session.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {session.attendances.length} attendance records
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">Quota: {session.total_quota}</Badge>
                              {openSessions[session.id] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4">
                            {sessionSearchQuery &&
                              session.attendances.some((a) =>
                                a.student_name.toLowerCase().includes(sessionSearchQuery.toLowerCase()),
                              ) && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  Showing students matching "{sessionSearchQuery}"
                                </p>
                              )}

                            {session.attendances.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Type</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {session.attendances
                                    .filter((attendance: Attendance) => {
                                      if (!sessionSearchQuery) return true
                                      return attendance.student_name
                                        .toLowerCase()
                                        .includes(sessionSearchQuery.toLowerCase())
                                    })
                                    .map((attendance: Attendance) => {
                                      const attendanceStatus = getAttendanceStatus(attendance)
                                      return (
                                        <TableRow key={attendance.id}>
                                          <TableCell className="font-medium">{attendance.student_name}</TableCell>
                                          <TableCell>
                                            {attendance.attendance_date
                                              ? new Date(attendance.attendance_date).toLocaleDateString()
                                              : "Not scheduled"}
                                          </TableCell>
                                          <TableCell>
                                            {attendance.start_time && attendance.end_time
                                              ? `${attendance.start_time} - ${attendance.end_time}`
                                              : "N/A"}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant={attendanceStatus.variant as any}>
                                              {attendanceStatus.text}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{attendance.type || "N/A"}</TableCell>
                                        </TableRow>
                                      )
                                    })}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground">No attendance records for this session.</p>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No sessions or attendance records available for this course.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <h2 className="text-xl font-bold mb-4">Course Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Course Type</h3>
                  <p className="text-sm capitalize">{course.type}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Created At</h3>
                  <p className="text-sm">{new Date(course.created_at).toLocaleDateString()}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Quota</h3>
                  <p className="text-sm">{course.quota} students</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Price</h3>
                  <p className="text-sm">฿{course.price.toLocaleString()}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Category</h3>
                  <p className="text-sm">{course.category}</p>
                </div>
                {course.type === "restricted" && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Age Range</h3>
                    <p className="text-sm">
                      {formatAgeInMonths(course.min_age)} - {formatAgeInMonths(course.max_age)}{" "}
                    </p>
                  </div>
                )}
                {course.type !== "restricted" && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Age Range</h3>
                    <p className="text-sm">All Ages</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Remove Teacher Confirmation Dialog */}
      <AlertDialog open={deleteTeacherDialogOpen} onOpenChange={setDeleteTeacherDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {teacherToRemove?.name} from this course?
            </AlertDialogDescription>
            <div className="space-y-4 py-3">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  This teacher will be removed from all course timeslots enrollment in the future and will still have
                  responsible for already enrolled timeslots
                </p>
              </div>
              <p className="text-sm">Do you want to continue?</p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveTeacher}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
