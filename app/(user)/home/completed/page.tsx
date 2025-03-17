"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Award, Calendar, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentSelector } from "@/components/userComponent/student-selector"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/userComponent/user-avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Types for API responses
interface CompletedCourse {
  id: string
  title: string
  description: string
  completionDate: string
  grade: string
  instructor: string
  certificateId: string
}

interface Student {
  id: string
  name: string
  birthdate: string
}

export default function CompletedCoursesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiFetch<Student[]>("/api/students/")

        if (data === TOKEN_EXPIRED) return // Handle session expiration

        setStudents(data)

        // Set the first student as selected by default
        if (data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(data[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch students:", err)
        setError("Failed to load students data. Please try again later.")
      }
    }

    fetchStudents()
  }, [selectedStudentId])

  // Fetch completed courses when selected student changes
  useEffect(() => {
    if (!selectedStudentId) return

    const fetchCompletedCourses = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await apiFetch<CompletedCourse[]>(`/api/courses/completed/?studentId=${selectedStudentId}`)

        if (data === TOKEN_EXPIRED) return // Handle session expiration

        setCompletedCourses(data)
      } catch (err) {
        console.error("Failed to fetch completed courses:", err)
        setError("Failed to load completed course data. Please try again later.")
        setCompletedCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedCourses()
  }, [selectedStudentId])

  // Fallback for loading state
  if (loading && !completedCourses.length && !students.length) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-end mb-6">
          <UserAvatar />
        </div>

        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-8 w-72 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Get the selected student
  const selectedStudent = students.find((student) => student.id === selectedStudentId)

  return (
    <div className="container mx-auto">
      <div className="flex justify-end mb-6">
        <UserAvatar />
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Courses</h1>
          <p className="text-muted-foreground">View your student&apos;s completed courses and certificates</p>
        </div>
        {students.length > 0 && (
          <StudentSelector
            Students={students}
            selectedStudentId={selectedStudentId || ""}
            onSelect={setSelectedStudentId}
          />
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedStudent && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Viewing completed courses for: <span className="text-primary">{selectedStudent.name}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{completedCourses.length} completed courses</p>
        </div>
      )}

      {loading && completedCourses.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : completedCourses.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Award className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No completed courses yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedStudent?.name} hasn&apos;t completed any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {completedCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completion Date:</span>
                    <span className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                      {new Date(course.completionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Final Grade:</span>
                    <span className="text-sm">{course.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Instructor:</span>
                    <span className="text-sm">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Certificate ID:</span>
                    <span className="text-sm font-mono">{course.certificateId}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/completed/${course.id}?StudentId=${selectedStudentId}`} className="w-full">
                  <Button className="w-full">
                    <Award className="mr-2 h-4 w-4" />
                    View Certificate
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

