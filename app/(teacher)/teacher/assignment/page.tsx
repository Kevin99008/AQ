"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

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

export default function TeacherAssignments() {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setTeacherData(data)  // Since data is a single teacher object
  
        setLoading(false)
      } catch (err) {
        setError("An error occurred while fetching data.")
        setLoading(false)
      }
    }
  
    fetchTeacherAssignments()
  }, [])
  

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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">{teacherData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-lg">{teacherData.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-lg">{teacherData.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge>{teacherData.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Assigned Classes</h2>

      {teacherData.classes.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Classes</AlertTitle>
          <AlertDescription>You don't have any assigned classes yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherData.classes.map((classItem) => (
            <Card key={classItem.id} className="h-full">
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
