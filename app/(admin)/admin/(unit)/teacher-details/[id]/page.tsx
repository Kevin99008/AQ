"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, use } from "react"
import { Mail, Users, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED  } from "@/utils/api"

// Update the ClassItem interface to specify that min_age and max_age are in months
interface ClassItem {
  id: number
  name: string
  description: string
  min_age: number | null
  max_age: number | null
  type: "restricted" | "unrestricted"
}

interface Teacher {
  id: number
  name: string
  category: string
  contact: string
  status: string
  classes: ClassItem[]
}

// Add a function to format age in months to a readable format
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

export default function TeacherDetailsPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [loading, setLoading] = useState(true)

    // Unwrap params using React.use()
    const params = use(props.params)
    const id = params.id

    useEffect(() => {
        // Simulate API fetch
        const fetchTeacher = async () => {
            const teacherId = Number.parseInt(id)

            const result = await apiFetch<Teacher>(`/api/new/teachers/detail/${teacherId}/`);
            

            if (result !== TOKEN_EXPIRED) {
                setTeacher(result)
            }
            setLoading(false)
        }

        fetchTeacher()
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

  if (!teacher) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/admin/unit-teacher")} className="mr-4">
            Back to List
          </Button>
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
        <Button variant="outline" onClick={() => router.push("/admin/unit-teacher")} className="mr-4">
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Teacher Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={teacher.name} />
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
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
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
            <CardTitle>Classes</CardTitle>
            <CardDescription>Classes currently taught by {teacher.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {teacher.classes && teacher.classes.length > 0 ? (
              <div className="space-y-4">
                {teacher.classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/admin/unit-course/${classItem.id}`)}
                  >
                    <div
                      className={`h-2 w-full ${
                        teacher.category === "Aquakids"
                          ? "bg-blue-500"
                          : teacher.category === "Playsounds"
                            ? "bg-green-500"
                            : "bg-gray-500"
                      }`}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{classItem.name}</CardTitle>
                        <Badge variant={classItem.type === "restricted" ? "blue" : "secondary"}>
                          {classItem.type === "restricted" ? "Age Restricted" : "All Ages"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm text-muted-foreground">{classItem.description}</p>

                      <div className="flex items-center mt-2">
                        {classItem.type === "restricted" ? (
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              Ages: {formatAgeInMonths(classItem.min_age)} - {formatAgeInMonths(classItem.max_age)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>All ages welcome</span>
                          </div>
                        )}
                      </div>

                      {classItem.type === "restricted" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div className="text-xs text-blue-700">
                            This class is age-restricted and only available for children between{" "}
                            {formatAgeInMonths(classItem.min_age)} and {formatAgeInMonths(classItem.max_age)}.
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/unit-course/${classItem.id}`)
                          }}
                        >
                          View Course Details
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
    </div>
  )
}

