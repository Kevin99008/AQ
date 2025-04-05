"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { Phone, Users, AlertCircle, BookOpen, ExternalLink, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ClassItem {
  id: number
  name: string
  description: string
  type: string
  min_age: number | null
  max_age: number | null
}

interface Teacher {
  id: number
  name: string
  category: string
  contact: string
  status: string
  classes: ClassItem[]
}

export default function TeacherDetailsPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<ClassItem | null>(null)
  const [courseDialogOpen, setCourseDialogOpen] = useState(false)

  const params = use(props.params)
  const id = params.id

  const fetchTeacher = async () => {
    const teacherId = Number.parseInt(id)
    try {
      const teacherResult = await apiFetch<Teacher>(`/api/new/teachers/detail/${teacherId}/`)
      if (teacherResult !== TOKEN_EXPIRED) {
        setTeacher(teacherResult)
        setLoading(false)
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Something went wrong")
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchTeacher()
  }, [id])

  // Function to format age in months to a readable format
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

  const handleCourseClick = (course: ClassItem) => {
    setSelectedCourse(course)
    setCourseDialogOpen(true)
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

  if (!teacher) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Details</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center py-8">Teacher not found.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/unit-teacher")} className="w-full">
              Return to Teacher List
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage alt={teacher.name} />
              <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{teacher.name}</CardTitle>
            <CardDescription>{teacher.category}</CardDescription>
            <Badge variant={teacher.status === "active" ? "green" : "secondary"} className="mt-2">
              {teacher.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{teacher.contact}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <div>{teacher.category}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="capitalize">{teacher.status}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Classes</h3>
                <div>{teacher.classes.length} classes</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/admin/unit-teacher")} className="w-full">
              Return to Teacher List
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Courses</CardTitle>
            <CardDescription>Courses currently taught by {teacher.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {teacher.classes && teacher.classes.length > 0 ? (
              <div className="space-y-4">
                {teacher.classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCourseClick(classItem)}
                  >
                    <div
                      className={`h-2 w-full ${classItem.type === "restricted"
                        ? "bg-blue-500"
                        : classItem.type === "unrestricted"
                          ? "bg-green-500"
                          : "bg-purple-500"
                        }`}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <Badge
                          variant={
                            classItem.type === "restricted" ? "blue" : classItem.type === "unrestricted" ? "green" : "secondary"
                          }
                        >
                          {classItem.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{classItem.description}</p>

                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {classItem.type === "restricted" && <span>
                            Age Range: {formatAgeInMonths(classItem.min_age)} - {formatAgeInMonths(classItem.max_age)}
                          </span>}
                          {classItem.type !== "restricted" && <span>
                            Age Range: All ages
                          </span>}
                        </div>
                      </div>

                      {classItem.min_age !== null &&
                        classItem.min_age >= 216 && ( // 18 years = 216 months
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div className="text-xs text-blue-700">This class is for adults and older students.</div>
                          </div>
                        )}

                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent card click
                            router.push(`/admin/unit-course/${classItem.id}`)
                          }}
                          className="flex items-center gap-1"
                        >
                          <BookOpen className="h-4 w-4" />
                          View Course Details
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No classes assigned.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Detail Dialog */}
      <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-xl">{selectedCourse.name}</DialogTitle>
                    <DialogDescription className="mt-1">{selectedCourse.description}</DialogDescription>
                  </div>
                  <Badge
                    variant={
                      selectedCourse.type === "lecture" ? "blue" : selectedCourse.type === "lab" ? "green" : "secondary"
                    }
                  >
                    {selectedCourse.type}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Course Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm mb-1">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Age Range</span>
                      </div>
                      {selectedCourse.type === "restricted" && <p className="text-sm">
                        {formatAgeInMonths(selectedCourse.min_age)} - {formatAgeInMonths(selectedCourse.max_age)}
                      </p>}
                      {selectedCourse.type !== "restricted" && <p className="text-sm">
                        All ages
                      </p>}
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center text-sm mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">Course Type</span>
                      </div>
                      <p className="text-sm capitalize">{selectedCourse.type}</p>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 mt-4">
                    <h3 className="font-medium mb-2">Course Description</h3>
                    <p className="text-sm">{selectedCourse.description}</p>
                  </div>

                  {selectedCourse.min_age !== null && selectedCourse.min_age >= 216 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        This class is designed for adults and older students (18+ years).
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="requirements" className="pt-4">
                  <div className="space-y-4">
                  {selectedCourse.type === "restricted" && <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Age Requirements</h3>
                      <p className="text-sm">
                        Students must be between {formatAgeInMonths(selectedCourse.min_age)} and{" "}
                        {formatAgeInMonths(selectedCourse.max_age)} to enroll in this course.
                      </p>
                    </div>}

                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Course Prerequisites</h3>
                      <p className="text-sm">
                        {selectedCourse.type === "lecture"
                          ? "No specific prerequisites required."
                          : selectedCourse.type === "lab"
                            ? "Basic understanding of the subject matter is recommended."
                            : "Please contact the instructor for specific requirements."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setCourseDialogOpen(false)
                    router.push(`/admin/unit-course/${selectedCourse.id}`)
                  }}
                >
                  View Full Details
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

