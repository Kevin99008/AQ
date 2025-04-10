"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Users, ChevronDown, ChevronUp, Clock, Calendar } from "lucide-react"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
interface Attendance {
  id: number
  status: string
  type: string
  student_id: number
  student_name: string
  attendance_date: string
  start_time: string
  end_time: string
}

interface Session {
  id: number
  name: string
  total_quota: number
  attendances: Attendance[]
}

interface ClassDetail {
  course_id: number
  course_name: string
  sessions: Session[]
}

export default function ClassDetailPage() {
  const params = useParams()
  const classId = params.id as string

  // State
  const [classData, setClassData] = useState<ClassDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSessions, setExpandedSessions] = useState<Record<number, boolean>>({})

  // Fetch class details
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true)
        const data = await apiFetch<ClassDetail>(`/api/teacher/class/${classId}/sessions/`)

        if (data === TOKEN_EXPIRED) {
          setError("Your session has expired. Please log in again.")
          setLoading(false)
          return
        }

        setClassData(data)
        setLoading(false)
      } catch (err) {
        setError("An error occurred while fetching class details.")
        setLoading(false)
      }
    }

    if (classId) {
      fetchClassDetails()
    }
  }, [classId])

  // Handlers
  const toggleSessionExpand = (sessionId: number) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  // Render states
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

  if (!classData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data</AlertTitle>
          <AlertDescription>No class data found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{classData.course_name}</h1>
        <p className="text-muted-foreground">Course ID: {classData.course_id}</p>
      </div>

      {/* Sessions Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Sessions</CardTitle>
              <CardDescription>Total: {classData.sessions.length} sessions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {classData.sessions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Sessions</AlertTitle>
              <AlertDescription>This class doesn't have any scheduled sessions yet.</AlertDescription>
            </Alert>
          ) : (
            <SessionsList
              sessions={classData.sessions}
              expandedSessions={expandedSessions}
              toggleSessionExpand={toggleSessionExpand}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Component for rendering sessions list
function SessionsList({
  sessions,
  expandedSessions,
  toggleSessionExpand,
}: {
  sessions: Session[]
  expandedSessions: Record<number, boolean>
  toggleSessionExpand: (id: number) => void
}) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{session.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSessionExpand(session.id)}
                aria-label={expandedSessions[session.id] ? "Collapse session details" : "Expand session details"}
              >
                {expandedSessions[session.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Quota: {session.total_quota}</span>
              <span className="mx-2">•</span>
              <span>Attendances: {session.attendances.length}</span>
            </div>
          </CardHeader>

          {expandedSessions[session.id] && (
            <CardContent>
              <AttendanceTabs attendances={session.attendances} />
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

// Component for attendance tabs
function AttendanceTabs({ attendances }: { attendances: Attendance[] }) {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>

      <TabsContent value="list">
        <AttendanceListView attendances={attendances} />
      </TabsContent>

      <TabsContent value="table">
        <AttendanceTableView attendances={attendances} />
      </TabsContent>
    </Tabs>
  )
}

// Component for list view of attendances
function AttendanceListView({ attendances }: { attendances: Attendance[] }) {
  if (attendances.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No attendance records found</p>
  }

  return (
    <div className="space-y-3">
      {attendances.map((attendance) => (
        <Card key={attendance.id} className="bg-muted/40">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="font-medium">{attendance.student_name}</div>
              <AttendanceStatusBadge status={attendance.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(attendance.attendance_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {attendance.start_time} - {attendance.end_time}
                </span>
              </div>
              <div>Type: {attendance.type}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Component for table view of attendances
function AttendanceTableView({ attendances }: { attendances: Attendance[] }) {
  if (attendances.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No attendance records found</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">{attendance.student_name}</TableCell>
              <TableCell>{new Date(attendance.attendance_date).toLocaleDateString()}</TableCell>
              <TableCell>
                {attendance.start_time} - {attendance.end_time}
              </TableCell>
              <TableCell>
                <AttendanceStatusBadge status={attendance.status} />
              </TableCell>
              <TableCell>{attendance.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Reusable badge component for attendance status
function AttendanceStatusBadge({ status }: { status: string }) {
  const variant =
    status === "Present" ? "default" : status === "Absent" ? "destructive" : status === "Late" ? "warning" : "outline"

  return <Badge variant={variant}>{status}</Badge>
}

// Loading state component
function LoadingState() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Skeleton className="h-9 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48 mb-2" />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
