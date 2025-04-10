"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Users, Clock, Award, CheckCircle } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

// Sample course data based on the provided model
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description:
      "Learn the basics of swimming in a fun and safe environment. Perfect for children who are new to swimming.",
    type: "restricted",
    min_age: 5,
    max_age: 8,
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    instructor: "Sarah Johnson",
    enrolled: 6,
    image: "/placeholder.svg?height=200&width=350",
    schedule: "Monday, Wednesday 4:00-5:00 PM",
    location: "Main Pool",
    duration: "8 weeks",
    startDate: "2023-04-10",
    endDate: "2023-06-02",
    details:
      "This beginner swimming course is designed for children who have little to no experience in the water. The course focuses on water confidence, basic floating techniques, and introductory swimming strokes. Our experienced instructors create a safe and fun environment where children can learn at their own pace. All necessary equipment is provided.",
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
    description: "Introduction to piano for young children. Learn basic notes, rhythm, and simple songs.",
    type: "restricted",
    min_age: 6,
    max_age: 10,
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    instructor: "Michael Chen",
    enrolled: 5,
    image: "/placeholder.svg?height=200&width=350",
    schedule: "Tuesday, Thursday 3:30-4:30 PM",
    location: "Music Room 2",
    duration: "10 weeks",
    startDate: "2023-04-15",
    endDate: "2023-06-20",
    details:
      "This introductory piano course is specially designed for children aged 6-10. Students will learn the basics of piano playing, including note reading, rhythm, and simple songs. The course uses a fun, interactive approach to build a strong foundation in music. Each student will have access to their own keyboard during class time.",
    curriculum: [
      "Week 1: Introduction to the piano and proper posture",
      "Week 2: Learning the white keys and basic finger positions",
      "Week 3: Introduction to rhythm and timing",
      "Week 4: Reading simple sheet music",
      "Week 5: Playing with both hands",
      "Week 6: Learning simple songs",
      "Week 7: Introduction to sharps and flats",
      "Week 8: Building finger strength and dexterity",
      "Week 9: More complex songs and practice techniques",
      "Week 10: Mini recital preparation and performance",
    ],
    requirements: [
      "No prior music experience required",
      "Practice keyboard at home recommended but not required",
      "Notebook for music notes",
      "Positive attitude and willingness to practice",
    ],
  },
]

export default function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      }
      setLoading(false)
    }

    fetchCourse()
  }, [id])

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
          <Button variant="outline" onClick={() => router.push("/admin/all-course")} className="mr-4">
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold">Course Details</h1>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-center py-8">Course not found.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button onClick={() => router.push("/admin/all-course")} className="w-full">
              Browse All Courses
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
      <Button variant="outline" onClick={() => router.push("/admin/all-course")} className="mb-6">
        Back to Courses
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <h1 className="text-3xl font-bold">{course.name}</h1>
              <Badge
                variant={
                  course.category === "Aquakids" ? "blue" : course.category === "Playsounds" ? "green" : "secondary"
                }
                className="text-sm"
              >
                {course.category}
              </Badge>
            </div>
            <p className="text-lg mb-4">{course.description}</p>

            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <span>
                Instructor: <span className="text-blue-600">{course.instructor}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{course.schedule}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              {course.type === "restricted" ? (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {/* Display age in months if less than 12 months */}
                    Ages{" "}
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
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>All ages welcome</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <Card>
              <CardContent className="p-4">
                <img src={course.image || "/placeholder.svg"} alt={course.name} className="w-full rounded-md mb-4" />
                <div className="text-3xl font-bold mb-4">฿{course.price}</div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Availability</span>
                    <span>
                      {course.quota - course.enrolled} of {course.quota} spots left
                    </span>
                  </div>
                  <Progress value={availabilityPercentage} className="h-2" />
                </div>

                <Button className="w-full mb-3">Enroll Now</Button>
                <div className="text-center text-sm mt-4">
                  Course starts on {new Date(course.startDate).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Course Details</h2>
                <div className="text-sm space-y-4">
                  <p>{course.details}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Course Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Schedule</h3>
                    <p className="text-sm">{course.schedule}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Location</h3>
                    <p className="text-sm">{course.location}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Duration</h3>
                    <p className="text-sm">{course.duration}</p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Age Range</h3>
                    <p className="text-sm">
                      {course.type === "restricted"
                        ? `${course.min_age} - ${course.max_age} years`
                        : "All ages welcome"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Key Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <p className="text-sm">{new Date(course.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">End Date</h3>
                    <p className="text-sm">{new Date(course.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="pt-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
                <div className="space-y-3">
                  {course.curriculum.map((item: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="pt-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Course Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {course.requirements.map((item: string, index: number) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card>
              <CardContent className="p-4">
                <img src={course.image || "/placeholder.svg"} alt={course.name} className="w-full rounded-md mb-4" />
                <div className="text-3xl font-bold mb-4">฿{course.price}</div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Availability</span>
                    <span>
                      {course.quota - course.enrolled} of {course.quota} spots left
                    </span>
                  </div>
                  <Progress value={availabilityPercentage} className="h-2" />
                </div>

                <Button className="w-full mb-3">Enroll Now</Button>

                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold">Course Details:</h3>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Starts: {new Date(course.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      {course.type === "restricted"
                        ? `Ages ${course.min_age !== null ? course.min_age : "N/A"}-${course.max_age !== null ? course.max_age : "N/A"}`
                        : "All ages welcome"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2" />
                    <span>Certificate upon completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

