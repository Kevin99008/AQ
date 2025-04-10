"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, BookOpen, Calendar, Phone, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Button } from "@/components/ui/button"

// Define the types for Class and TeacherData
interface Class {
  id: number
  name: string
  description: string
  type: string
  min_age: number
  max_age: number
}

interface TeacherData {
  id: number
  name: string
  contact: string
  category: string
  status: string
  classes: Class[]
}

interface TeacherProfile {
  user: {
    id: string
    username: string
    email: string
    role: string
    contact: string
    join_date: string
  }
  teacher: {
    id: string
    name: string
    category: string
    status: string
  }
}

export default function TeacherAssignments() {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)

  // First useEffect - fetch teacher profile
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await apiFetch<TeacherProfile>("/api/teacher-profile")

        if (data === TOKEN_EXPIRED) {
          setError("Session expired. Please log in again.")
          return
        }

        setTeacher(data)
      } catch (err) {
        console.error("Failed to fetch teacher profile:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherProfile()
  }, [])

  // Second useEffect - fetch teacher assignments
  // MOVED HERE - before any conditional returns
  useEffect(() => {
    const fetchTeacherAssignments = async () => {
      try {
        setLoading(true)

        // Use apiFetch to fetch teacher assignments
        const data = await apiFetch<TeacherData>("/api/teacher-assignment/")

        // Handle token expiration case
        if (data === TOKEN_EXPIRED) {
          setError("Your session has expired. Please log in again.")
          setLoading(false)
          return
        }

        // If successful, set the teacher data
        setTeacherData(data) // Since data is a single teacher object

        setLoading(false)
      } catch (err) {
        setError("An error occurred while fetching data.")
        setLoading(false)
      }
    }

    fetchTeacherAssignments()
  }, [])

  // Now you can have conditional returns
  if (!teacher) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Teacher profile not found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find your teacher profile information. You may not have teacher privileges.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!teacherData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No teacher assignment data found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Teacher Assignments</h1>
        <p className="text-muted-foreground">View all your assigned classes</p>
      </div>

      <Card className="w-full overflow-hidden">
        <div className="bg-gradient-to-r from-rose-100 to-teal-100 h-24 sm:h-32 relative">
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage alt={teacher.teacher.name} />
              <AvatarFallback className="flex items-center justify-center bg-gray-100 rounded-full">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-16 sm:pt-20 pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{teacher.teacher.name}</h2>
              <p className="text-sm text-muted-foreground">@{teacher.user.username}</p>
              <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {teacher.teacher.status}
              </div>
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg self-start">
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-medium">{teacher.teacher.category}</p>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-gray-200">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="font-medium">{teacher.user.contact}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="font-medium">{new Date(teacher.user.join_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium capitalize">{teacher.user.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ID</p>
                  <p className="font-medium">{teacher.user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <CardFooter className="bg-gray-50 py-3"></CardFooter>
      </Card>

      <h2 className="text-2xl font-bold my-4">Assigned Classes</h2>

      {teacherData.classes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Classes</AlertTitle>
          <AlertDescription>You don't have any assigned classes yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherData.classes.map((classItem) => (
            <Link href={`/teacher/assignment/${classItem.id}`} key={classItem.id} className="block h-full">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <CardTitle>{classItem.name}</CardTitle>
                  <CardDescription>Type: {classItem.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{classItem.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Age Range: {classItem.min_age} - {classItem.max_age} years
                    </span>
                    <span>ID: {classItem.id}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-8 w-48 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
