"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Download, AlertCircle } from "lucide-react"
import QRCode from "qrcode"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Types for API responses
interface CourseClass {
  date: string;
  attended: boolean;
  topic: string;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  totalClasses: number;
  attendedClasses: number;
  startDate: string;
  endDate: string;
  teacher: string;
  classes: CourseClass[];
}

interface Student {
  id: string;
  name: string;
  birthdate: string;
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const courseId = params.courseId;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // Generate QR code
  useEffect(() => {
    if (student && course) {
      const qrData = JSON.stringify({
        studentId,
        studentName: student.name,
        courseId,
        courseTitle: course.title,
      });

      QRCode.toDataURL(qrData)
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("Failed to generate QR code:", err));
    }
  }, [student, course, studentId, courseId]);

  // Fetch course details
  useEffect(() => {
    if (!studentId) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch course progress for student
        const progressData = await apiFetch<CourseDetail[]>(
          `/api/sessions/progress/?studentId=${studentId}`
        );

        if (progressData === TOKEN_EXPIRED) {
          setError("Session expired. Please log in again.");
          return;
        }

        const courseData = progressData.find((c) => c.id === courseId);
        if (!courseData) {
          throw new Error("Course not found.");
        }

        setCourse(courseData);

        // Fetch student details
        const studentData = await apiFetch<Student>(`/api/students/${studentId}/`);
        if (studentData === TOKEN_EXPIRED) {
          setError("Session expired. Please log in again.");
          return;
        }

        setStudent(studentData);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, studentId]);

  // Handle not found or error states
  if (!studentId) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Missing student information</h1>
          <p className="mt-2 text-muted-foreground">Please select a student to view course details.</p>
          <Button className="mt-4" onClick={() => router.push("/progress")}>
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/progress")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96 mb-6" />

            <div className="mt-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-4 overflow-hidden rounded-lg border bg-white p-1">
                <Skeleton className="h-48 w-48" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Skeleton className="h-64 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/home/progress")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Not found state
  if (!course || !student) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="mt-2 text-muted-foreground">
            The course you're looking for doesn't exist or you don't have access.
          </p>
          <Button className="mt-4" onClick={() => router.push("/home/progress")}>
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  // Function to download QR code
  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.href = qrCodeDataUrl
    link.download = `qrcode-${course.title}-${student.name}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/home/progress")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Courses
      </Button>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-muted-foreground">{course.description}</p>

          <div className="mt-6">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="text-xs font-bold">T</span>
              </div>
              <div>
                <p className="font-medium">Teacher</p>
                <p className="text-sm text-muted-foreground">{course.teacher}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between">
              <h3 className="font-medium">Course Progress</h3>
              <span className="text-sm font-medium">
                {course.attendedClasses} of {course.totalClasses} classes
              </span>
            </div>
            <Progress value={(course.attendedClasses / course.totalClasses) * 100} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {student.name} has attended {course.attendedClasses} out of {course.totalClasses} classes (
              {Math.round((course.attendedClasses / course.totalClasses) * 100)}% complete)
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course QR Code</CardTitle>
            <CardDescription>Scan for attendance and details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-4 overflow-hidden rounded-lg border bg-white p-1">
              {qrCodeDataUrl ? (
                <Image
                  src={qrCodeDataUrl || "/placeholder.svg"}
                  alt="Course QR Code"
                  width={200}
                  height={200}
                  className="h-48 w-48"
                />
              ) : (
                <div className="h-48 w-48 flex items-center justify-center bg-gray-100">
                  <p className="text-sm text-gray-500">Generating QR code...</p>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              This QR code contains information about the course, student, and enrollment details.
            </p>
            <Button variant="outline" className="mt-4 w-full" onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription>Record of classes and attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">Date</th>
                    <th className="py-3 text-left font-medium">Topic</th>
                    <th className="py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {course.classes.map((classItem, index) => {
                    const classDate = new Date(classItem.date)
                    const today = new Date()
                    const isUpcoming = classDate > today

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-3">{classDate.toLocaleDateString()}</td>
                        <td className="py-3">{classItem.topic}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              classItem.attended
                                ? "bg-green-100 text-green-800"
                                : isUpcoming
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {classItem.attended ? "Attended" : isUpcoming ? "Upcoming" : "Absent"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

