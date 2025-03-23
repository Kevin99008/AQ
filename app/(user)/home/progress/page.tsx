"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Clock, AlertCircle, BookOpen } from "lucide-react"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StudentSelector } from "@/components/userComponent/student-selector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Types for the API responses
interface Course {
  id: string
  title: string
  description: string
  totalClasses: number
  attendedClasses: number
  startDate: string
  endDate: string
}

interface Student {
  id: string
  name: string
  birthdate: string
}

export default function ProgressPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [Students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiFetch<Student[]>("/api/user/students/");

        if (data === TOKEN_EXPIRED) return; // Handle session expiration

        setStudents(data);

        // Set the first Student as selected by default
        if (data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch Students:", err);
        setError("Failed to load Students data. Please try again later.");
      }
    };

    fetchStudents();
  }, [selectedStudentId]);

  // Fetch courses when selected Student changes
  useEffect(() => {
    if (!selectedStudentId) return;

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiFetch<Course[]>(`/api/sessions/progress/?studentId=${selectedStudentId}`);

        if (data === TOKEN_EXPIRED) return; // Handle session expiration

        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load course data. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedStudentId]);

  // Fallback for loading state
  if (loading && !courses.length && !Students.length) {
    return (
      <div className="container mx-auto">
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
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-4 w-32" />
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

  // Get the selected Student
  const selectedStudent = Students.find((Student) => Student.id === selectedStudentId)

  return (
    <div className="container mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-12">Course Progression</h1>
          <p className="text-muted-foreground">Track your Student&apos;s progress in ongoing courses</p>
        </div>
        {Students.length > 0 && (
          <StudentSelector Students={Students} selectedStudentId={selectedStudentId || ""} onSelect={setSelectedStudentId} />
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
            Viewing courses for: <span className="text-primary">{selectedStudent.name}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{courses.length} active courses</p>
        </div>
      )}

      {loading && courses.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No active courses</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedStudent?.name} isn&apos;t enrolled in any active courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {course.attendedClasses} of {course.totalClasses} classes
                    </span>
                  </div>
                  <Progress value={(course.attendedClasses / course.totalClasses) * 100} />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{Math.round((course.attendedClasses / course.totalClasses) * 100)}% complete</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`progress/${course.id}?studentId=${selectedStudentId}`} className="w-full">
                  <button className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

