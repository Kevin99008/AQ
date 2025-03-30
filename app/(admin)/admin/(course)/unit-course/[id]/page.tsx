"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Award, Plus, Trash2, CheckCircle } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Sample course data
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description: "Learn the basics of swimming in a fun and safe environment.",
    type: "restricted",
    min_age: 5,
    max_age: 8,
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    instructor: "Sarah Johnson",
    enrolled: 6,
    teachers: [
      { id: 1, name: "Sarah Johnson", email: "sarah.johnson@example.com" },
      { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@example.com" },
    ],
    schedule: "Monday, Wednesday 4:00-5:00 PM",
    location: "Main Pool",
    duration: "8 weeks",
    startDate: "2023-04-10",
    endDate: "2023-06-02",
    curriculum: [
      "Week 1: Water confidence and basic safety",
      "Week 2: Floating and gliding",
      "Week 3: Kicking techniques",
      "Week 4: Arm movements and coordination",
      "Week 5: Introduction to front crawl",
      "Week 6: Introduction to backstroke",
      "Week 7: Breathing techniques",
      "Week 8: Review and mini swimming challenge",
    ],
    requirements: [
      "Swimsuit and towel",
      "Swim cap (optional but recommended)",
      "No prior swimming experience required",
      "Parent/guardian must sign a waiver form",
    ],
  },
  {
    id: 2,
    name: "Piano for Kids",
    description: "Introduction to piano for young children.",
    type: "restricted",
    min_age: 6,
    max_age: 10,
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    instructor: "Michael Chen",
    enrolled: 5,
    teachers: [{ id: 2, name: "Michael Chen", email: "michael.chen@example.com" }],
    schedule: "Tuesday, Thursday 3:30-4:30 PM",
    location: "Music Room 2",
    duration: "10 weeks",
    startDate: "2023-04-15",
    endDate: "2023-06-20",
    curriculum: [
      "Lesson 1: Introduction to the piano and basic music theory",
      "Lesson 2: Finger exercises and posture",
      "Lesson 3: Playing simple melodies",
      "Lesson 4: Introduction to rhythm",
      "Lesson 5: Playing with both hands",
      "Lesson 6: Learning to read sheet music",
      "Lesson 7: Playing chords",
      "Lesson 8: Playing a simple song",
    ],
    requirements: [
      "Access to a piano or keyboard",
      "Comfortable seating",
      "Sheet music (provided)",
      "Enthusiasm for music!",
    ],
  },
]

// Sample teacher data
const teachers = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Aquakids",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    status: "active",
    specialty: "Swimming Instructor",
  },
  {
    id: 2,
    name: "Michael Chen",
    category: "Playsounds",
    email: "michael.chen@example.com",
    phone: "(555) 234-5678",
    status: "active",
    specialty: "Piano Teacher",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    category: "Aquakids",
    email: "emily.rodriguez@example.com",
    phone: "(555) 345-6789",
    status: "active",
    specialty: "Water Safety Instructor",
  },
  {
    id: 4,
    name: "David Kim",
    category: "Playsounds",
    email: "david.kim@example.com",
    phone: "(555) 456-7890",
    status: "active",
    specialty: "Guitar Teacher",
  },
  {
    id: 5,
    name: "Jessica Patel",
    category: "Other",
    email: "jessica.patel@example.com",
    phone: "(555) 567-8901",
    status: "active",
    specialty: "Art Teacher",
  },
  {
    id: 6,
    name: "Robert Wilson",
    category: "Aquakids",
    email: "robert.wilson@example.com",
    phone: "(555) 678-9012",
    status: "active",
    specialty: "Swim Coach",
  },
]

export default function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([])
  const [deleteTeacherDialogOpen, setDeleteTeacherDialogOpen] = useState(false)
  const [teacherToRemove, setTeacherToRemove] = useState<any>(null)

  const [editedDescription, setEditedDescription] = useState(course?.description || "")
  const [editedCurriculum, setEditedCurriculum] = useState(course?.curriculum || [])
  const [editedRequirements, setEditedRequirements] = useState(course?.requirements || [])

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
        const filteredTeachers = teachers.filter((t) => !assignedTeacherIds.includes(t.id))
        setAvailableTeachers(filteredTeachers)
      }
      setLoading(false)
    }

    fetchCourse()
  }, [id])

  const handleAddTeacher = () => {
    if (!selectedTeacher) return

    const teacherId = Number.parseInt(selectedTeacher)
    const teacherToAdd = teachers.find((t) => t.id === teacherId)

    if (teacherToAdd && course) {
      // Add teacher to course
      const updatedCourse = {
        ...course,
        teachers: [...course.teachers, teacherToAdd],
      }
      setCourse(updatedCourse)

      // Remove from available teachers
      setAvailableTeachers((prev) => prev.filter((t) => t.id !== teacherId))
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
      setAvailableTeachers((prev) => [...prev, teacherToRemove])
      setDeleteTeacherDialogOpen(false)
    }
  }

  // Initialize edit fields when course data is loaded
  useEffect(() => {
    if (course) {
      setEditedDescription(course.description || "")
      setEditedCurriculum(course.curriculum || [])
      setEditedRequirements(course.requirements || [])
    }
  }, [course])

  // Curriculum handlers
  const handleAddCurriculumItem = () => {
    setEditedCurriculum([...editedCurriculum, ""])
  }

  const handleCurriculumItemChange = (index: number, value: string) => {
    const newCurriculum = [...editedCurriculum]
    newCurriculum[index] = value
    setEditedCurriculum(newCurriculum)
  }

  const handleRemoveCurriculumItem = (index: number) => {
    setEditedCurriculum(editedCurriculum.filter((_: string, i: number) => i !== index))
  }

  // Requirements handlers
  const handleAddRequirementItem = () => {
    setEditedRequirements([...editedRequirements, ""])
  }

  const handleRequirementItemChange = (index: number, value: string) => {
    const newRequirements = [...editedRequirements]
    newRequirements[index] = value
    setEditedRequirements(newRequirements)
  }

  const handleRemoveRequirementItem = (index: number) => {
    setEditedRequirements(editedRequirements.filter((_: string, i: number) => i !== index))
  }

  // Save all changes
  const handleSaveDetails = () => {
    if (course) {
      // Filter out empty items
      const filteredCurriculum = editedCurriculum.filter((item: string) => item.trim() !== "")
      const filteredRequirements = editedRequirements.filter((item: string) => item.trim() !== "")

      // Update course with edited values
      const updatedCourse = {
        ...course,
        description: editedDescription,
        curriculum: filteredCurriculum,
        requirements: filteredRequirements,
      }

      setCourse(updatedCourse)

      // Show success message or notification
      alert("Course details updated successfully")

      // In a real application, you would send this data to your API
      console.log("Updated course:", updatedCourse)
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
          <Button variant="outline" onClick={() => router.push("/admin/courses")} className="mr-4">
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
        <Button onClick={() => router.push(`/admin/courses/${course.id}/edit`)}>Edit Course</Button>
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
                    <span>Schedule: {course.schedule || "Not set"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Duration: {course.duration || "Not set"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {course.type === "restricted" ? (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {/* Display age in months if less than 12 months */}
                        {course.min_age !== null && course.min_age < 12
                          ? `${course.min_age} months`
                          : course.min_age !== null
                            ? `${Math.floor(course.min_age / 12)} years`
                            : "N/A"}{" "}
                        -
                        {course.max_age !== null && course.max_age < 12
                          ? `${course.max_age} months`
                          : course.max_age !== null
                            ? `${Math.floor(course.max_age / 12)} years`
                            : "N/A"}
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

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Enrollment</span>
                  <span>
                    {course.enrolled} of {course.quota} spots filled
                  </span>
                </div>
                <Progress value={(course.enrolled / course.quota) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="teachers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teachers">Assigned Teachers</TabsTrigger>
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="edit">Edit Details</TabsTrigger>
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
                          {availableTeachers.length > 0 ? (
                            availableTeachers.map((teacher: any) => (
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
                      <Button onClick={handleAddTeacher} disabled={!selectedTeacher || availableTeachers.length === 0}>
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
                      <TableHead>Category</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.teachers.map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.specialty}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.category}</TableCell>
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
                  <h3 className="font-medium mb-2">Schedule</h3>
                  <p className="text-sm">{course.schedule || "Not set"}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-sm">{course.location || "Not set"}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Duration</h3>
                  <p className="text-sm">{course.duration || "Not set"}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Age Range</h3>
                  <p className="text-sm">
                    {course.type === "restricted"
                      ? `${course.min_age !== null ? course.min_age : "N/A"} - ${course.max_age !== null ? course.max_age : "N/A"} years`
                      : "All ages welcome"}
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Start Date</h3>
                  <p className="text-sm">
                    {course.startDate ? new Date(course.startDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">End Date</h3>
                  <p className="text-sm">
                    {course.endDate ? new Date(course.endDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-6 mb-4">Curriculum</h2>
              {course.curriculum && course.curriculum.length > 0 ? (
                <div className="space-y-3">
                  {course.curriculum.map((item: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No curriculum information available.</p>
                </div>
              )}

              <h2 className="text-xl font-bold mt-6 mb-4">Requirements</h2>
              {course.requirements && course.requirements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {course.requirements.map((item: string, index: number) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No requirements information available.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="edit" className="space-y-4 pt-4">
              <h2 className="text-xl font-bold mb-4">Edit Course Details</h2>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={4}
                    placeholder="Enter course description"
                    className="w-full"
                  />
                </div>

                {/* Curriculum */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Curriculum</h3>
                    <Button variant="outline" size="sm" onClick={handleAddCurriculumItem}>
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </div>

                  {editedCurriculum.length > 0 ? (
                    <div className="space-y-2">
                      {editedCurriculum.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={item}
                            onChange={(e) => handleCurriculumItemChange(index, e.target.value)}
                            placeholder={`Week ${index + 1}: Content`}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCurriculumItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md">
                      <p className="text-muted-foreground">No curriculum items added yet.</p>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Requirements</h3>
                    <Button variant="outline" size="sm" onClick={handleAddRequirementItem}>
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </div>

                  {editedRequirements.length > 0 ? (
                    <div className="space-y-2">
                      {editedRequirements.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={item}
                            onChange={(e) => handleRequirementItemChange(index, e.target.value)}
                            placeholder="Requirement"
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRequirementItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md">
                      <p className="text-muted-foreground">No requirements added yet.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveDetails}>Save Changes</Button>
                </div>
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
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Enrollment</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{course.enrolled} enrolled</span>
                    <span>{course.quota - course.enrolled} spots left</span>
                  </div>
                  <Progress value={availabilityPercentage} className="h-2" />
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

