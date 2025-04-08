"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Types for API responses
// Types
interface AttendanceRecord {
  attendanceDate: string;
  status: string;
  checkedDate: string | null;
}

interface SessionDetail {
  id: string;
  title: string;
  description: string;
  totalClasses: number;
  attendedClasses: number;
  startDate: string;
  endDate: string;
  teacher: string;
  attendanceRecords: AttendanceRecord[]; // ✅ Add attendance records
}

interface Student {
  id: string;
  name: string;
  birthdate: string;
}

export default function SessionDetailPage() {
  const params = useParams(); // ✅ Fix: Use `useParams()` for dynamic route params
  const searchParams = useSearchParams();
  const router = useRouter();

  const studentId = searchParams.get("studentId");
  const sessionId = params.sessionId as string; // ✅ Ensure `sessionId` is a string

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details + attendance records
  useEffect(() => {
    if (!studentId || !sessionId) return; // ✅ Ensure both `studentId` and `sessionId` exist

    const fetchSessionDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Fetch session and attendance details
        const sessionData = await apiFetch<SessionDetail>(
          `/api/session-detail/?studentId=${studentId}&sessionId=${sessionId}`
        );
  
        if (sessionData === "TOKEN_EXPIRED") {
          setError("Session expired. Please log in again.");
          return;
        }
  
        setSession(sessionData);
  
        // ✅ Fetch student details
        const studentData = await apiFetch<Student>(
          `/api/students/${studentId}`
        );
  
        if (studentData === "TOKEN_EXPIRED") {
          setError("Session expired. Please log in again.");
          return;
        }
  
        setStudent(studentData);
      } catch (err) {
        console.error("Failed to fetch session details:", err);
        setError("Failed to load session details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, studentId]);


  // Handle not found or error states
  if (!studentId) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Missing student information</h1>
          <p className="mt-2 text-muted-foreground">Please select a student to view session details.</p>
          <Button className="mt-4" onClick={() => router.push("/progress")}>
            Back to sessions
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
          Back to sessions
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
          Back to sessions
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
  if (!session || !student) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">session not found</h1>
          <p className="mt-2 text-muted-foreground">
            The session you're looking for doesn't exist or you don't have access.
          </p>
          <Button className="mt-4" onClick={() => router.push("/home/progress")}>
            Back to sessions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/home/progress")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to sessions
      </Button>
  
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{session.title}</h1>
          <p className="mt-2 text-muted-foreground">{session.description}</p>
  
          <div className="mt-6">
            <div className="flex items-start">
              <div className="mr-2 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-muted text-muted-foreground">
                <span className="text-xs font-bold">T</span>
              </div>
              <div>
                <p className="font-medium">Teacher</p>
                <p className="text-sm text-muted-foreground">{session.teacher}</p>
              </div>
            </div>
          </div>
  
          <div className="mt-6">
            <div className="mb-2 flex justify-between">
              <h3 className="font-medium">session Progress</h3>
              <span className="text-sm font-medium">
                {session.attendedClasses} of {session.totalClasses} classes
              </span>
            </div>
            <Progress value={(session.attendedClasses / session.totalClasses) * 100} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {student.name} has attended {session.attendedClasses} out of {session.totalClasses} classes (
              {Math.round((session.attendedClasses / session.totalClasses) * 100)}% complete)
            </p>
          </div>
        </div>
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
                    <th className="py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {session.attendanceRecords && session.attendanceRecords.length > 0 ? (
                    session.attendanceRecords.map((attendanceRecord, index) => {
                      const classDate = new Date(attendanceRecord.attendanceDate)
                      const today = new Date()
                      const isUpcoming = classDate > today
                      const isChecked = attendanceRecord.checkedDate !== null

                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3">{classDate.toLocaleDateString()}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                !isChecked
                                  ? "bg-gray-100 text-gray-800" // Gray for not recorded
                                  : attendanceRecord.status === "absent"
                                    ? "bg-red-100 text-red-800" // Red status for absent
                                    : attendanceRecord.status === "present"
                                      ? "bg-green-100 text-green-800" // Green status for attended
                                      : isUpcoming
                                        ? "bg-blue-100 text-blue-800" // Blue status for upcoming
                                        : "bg-gray-100 text-gray-800" // Default gray if no status
                              }`}
                            >
                              {!isChecked
                                ? "Not Recorded" // Show "Not Recorded" if checked_date is null
                                : attendanceRecord.status === "absent"
                                  ? "Absent"
                                  : attendanceRecord.status === "present"
                                    ? "Attended"
                                    : isUpcoming
                                      ? "Upcoming"
                                      : "No Status"}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-3 text-center text-sm text-muted-foreground">
                        No classes available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  
}

