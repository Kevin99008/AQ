"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Award, Plus, Trash2 } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Sample course data based on the provided model
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description: "Learn the basics of swimming in a fun and safe environment.",
    type: "restricted",
    min_age: 60, // 5 years in months
    max_age: 96, // 8 years in months
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    teachers: [
      { id: 1, name: "Sarah Johnson", email: "sarah.johnson@example.com", specialty: "Swimming Instructor" },
      { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@example.com", specialty: "Water Safety Instructor" },
    ],
  },
  {
    id: 2,
    name: "Piano for Kids",
    description: "Introduction to piano for young children.",
    type: "restricted",
    min_age: 72, // 6 years in months
    max_age: 120, // 10 years in months
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    teachers: [{ id: 2, name: "Michael Chen", email: "michael.chen@example.com", specialty: "Piano Teacher" }],
  },
]

// Sample available teachers (not yet assigned to the course)
const availableTeachers = [
  { id: 4, name: "David Kim", email: "david.kim@example.com", specialty: "Guitar Teacher" },
  { id: 5, name: "Jessica Patel", email: "jessica.patel@example.com", specialty: "Art Teacher" },
  { id: 6, name: "Robert Wilson", email: "robert.wilson@example.com", specialty: "Swim Coach" },
  { id: 7, name: "Amanda Lee", email: "amanda.lee@example.com", specialty: "Violin Teacher" },
]

// Helper function to format age in months
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

export default function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [teacherList, setTeacherList] = useState<any[]>(availableTeachers)
  const [deleteTeacherDialogOpen, setDeleteTeacherDialogOpen] = useState(false)
  const [teacherToRemove, setTeacherToRemove] = useState<any>(null)

  // Unwrap params using React.use()
  const params = use(props.params)
  const id = params.id

  useEffect(() => {
    // Simulate API fetch
    const fetchCourse = () => {
      const courseId = Number.parseInt(id)
      const foundCourse = courses.find((c) => c.id === courseId)

      if (foundCourse) {
        setCourse(foundCourse)

        // Filter out teachers already assigned to this course
        const assignedTeacherIds = foundCourse.teachers.map((t) => t.id)
        const filteredTeachers = availableTeachers.filter((t) => !assignedTeacherIds.includes(t.id))
        setTeacherList(filteredTeachers)
      }
      setLoading(false)
    }

    fetchCourse()
  }, [id])

  const handleAddTeacher = () => {
    if (!selectedTeacher) return

    const teacherId = Number.parseInt(selectedTeacher)
    const teacherToAdd = teacherList.find((t) => t.id === teacherId)

    if (teacherToAdd && course) {
      // Add teacher to course
      const updatedCourse = {
        ...course,
        teachers: [...course.teachers, teacherToAdd],
      }
      setCourse(updatedCourse)

      // Remove from available teachers
      setTeacherList((prev) => prev.filter((t) => t.id !== teacherId))
      setSelectedTeacher("")
    }
  }

  const handleRemoveTeacher = (teacher: any) => {
    setTeacherToRemove(teacher)
    setDeleteTeacherDialogOpen(true)
  }

  const confirmRemoveTeacher = () => {
    if (teacherToRemove && course) {
      // Remove teacher from course
      const updatedCourse = {
        ...course,
        teachers: course.teachers.filter((t: any) => t.id !== teacherToRemove.id),
      }
      setCourse(updatedCourse)

      // Add back to available teachers
      setTeacherList((prev) => [...prev, teacherToRemove])
      setDeleteTeacherDialogOpen(false)
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
          <Button variant="outline" onClick={() => router.push("/admin/courses")} className="mr-4">
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center py-8">Course not found.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button onClick={() => router.push("/admin/courses")} className="w-full">
              Return to Course List
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Calculate availability percentage
  const availabilityPercentage = ((course.quota - course.enrolled) / course.quota) * 100

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="outline" onClick={() => router.push("/admin/unit-course")} className="mr-4">
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{course.description}</p>
                </div>
                <Badge
                  variant={
                    course.category === "Aquakids" ? "blue" : course.category === "Playsounds" ? "green" : "secondary"
                  }
                  className="text-sm"
                >
                  {course.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Quota: {course.quota} students</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {course.type === "restricted" ? (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        Age Range: {formatAgeInMonths(course.min_age)} - {formatAgeInMonths(course.max_age)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>All ages welcome</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Price: ₹{course.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="teachers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teachers">Teacher Assignments</TabsTrigger>
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
                    <div className="py-4">
                      <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teacherList.length > 0 ? (
                            teacherList.map((teacher: any) => (
                              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                {teacher.name} - {teacher.specialty}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No available teachers
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTeacher} disabled={!selectedTeacher || teacherList.length === 0}>
                        Add Teacher
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {course.teachers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.teachers.map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.specialty}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
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
                  <p className="text-sm">₹{course.price}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Category</h3>
                  <p className="text-sm">{course.category}</p>
                </div>
                {course.type === "restricted" && (
                  <>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Minimum Age</h3>
                      <p className="text-sm">{formatAgeInMonths(course.min_age)}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Maximum Age</h3>
                      <p className="text-sm">{formatAgeInMonths(course.max_age)}</p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Price</h3>
                  <p className="text-2xl font-bold">₹{course.price}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Quota</h3>
                  <p className="text-sm">{course.quota} students</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Category</h3>
                  <Badge
                    variant={
                      course.category === "Aquakids" ? "blue" : course.category === "Playsounds" ? "green" : "secondary"
                    }
                  >
                    {course.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Created</h3>
                  <p className="text-sm">{new Date(course.created_at).toLocaleDateString()}</p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Teachers</h3>
                  <p className="text-sm">{course.teachers.length} assigned</p>
                </div>
              </CardContent>
            </Card>
          </div>
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

