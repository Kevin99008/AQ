"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Award, Plus, Trash2, ArrowLeft, Search, Check } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from 'react-toastify';
import { Input } from "@/components/ui/input"

// Sample course data based on the provided JSON
type Teacher = {
  id: number;
  name: string;
  contact: string;
  status: string
};

type Course = {
  id: number;
  name: string;
  description: string;
  type: string;
  min_age: number;
  max_age: number;
  quota: number;
  created_at: string; // ISO date string
  price: number;
  category: string;
  teachers: Teacher[];
};


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
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }
  useEffect(() => {
    fetchCourse()
  }, [id])

  const handleAddTeacher = async () => {
    if (!selectedTeacher) return

    const teacherId = Number.parseInt(selectedTeacher)
    const courseId = Number.parseInt(id)
    try {
      const response = await apiFetch<any>(`/api/new/courses/${courseId}/assign-teacher/`, "POST", {
        teacher_id: teacherId
      })
      if (response !== TOKEN_EXPIRED) {
        fetchCourse()
        toast.success("Successfully Added Teacher to Course")
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
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
        const response = await apiFetch<any>(`/api/new/courses/${courseId}/${Number.parseInt(teacherToRemove.id)}/remove-teacher/`, "DELETE")
        if (response !== TOKEN_EXPIRED) {
          fetchCourse()
          toast.success("Successfully Removed Teacher from Course")
        }
      } catch (err: any) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong");
        }
      }

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
          <Button variant="outline" onClick={() => router.push("/admin/unit-course")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
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
          <Button variant="outline" onClick={() => router.push("/admin/unit-course")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
                    <span>Price: ₹{course.price}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Age Range: {course.min_age} - {course.max_age} years
                    </span>
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
                                className={`flex items-center justify-between p-3 hover:bg-muted cursor-pointer ${selectedTeacher === teacher.id.toString() ? "bg-muted" : ""
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
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Minimum Age</h3>
                  <p className="text-sm">{course.min_age} years</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Maximum Age</h3>
                  <p className="text-sm">{course.max_age} years</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-6 space-y-6">
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
            <div className="space-y-4 py-3">
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  This teacher will be removed from all course timeslots enrollment in the future and will still have responsible for already enrolled timeslots
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

