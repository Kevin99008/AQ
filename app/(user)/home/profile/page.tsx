"use client"

import { useState, useEffect, useCallback } from "react"
import { User, AlertCircle, QrCode } from "lucide-react"
import { format } from "date-fns"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Types for the API responses
interface UserProfile {
  id: string
  username: string
  email: string
  contact: string
  students: {
    id: string
    name: string
    birthdate: Date
  }[]
}

// Function to calculate age in years
const calculateAge = (birthdate: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthdate.getFullYear()
  const monthDifference = today.getMonth() - birthdate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--
  }

  return age
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await apiFetch<UserProfile>("/api/profile")

        if (data === TOKEN_EXPIRED) {
          setError("Session expired. Please log in again.")
          return
        }

        // Convert string dates to Date objects and rename children to students
        const formattedData: UserProfile = {
          ...data,
          students: data.students.map((student) => ({
            ...student,
            birthdate: new Date(student.birthdate),
          })),
        }

        setUser(formattedData)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Generate QR code for student
  const generateQRCode = useCallback(async (studentId: string) => {
    setSelectedStudent(studentId)
    setQrCodeDataUrl(null)

    try {
      // Dynamic import of QRCode library to avoid SSR issues
      const QRCode = (await import("qrcode")).default

      const qrData = JSON.stringify({
        student_id: studentId,
      })

      const url = await QRCode.toDataURL(qrData)
      setQrCodeDataUrl(url)
    } catch (err) {
      console.error("Failed to generate QR code:", err)
    }
  }, [])

  // Generate QR code when dialog opens for a student
  useEffect(() => {
    if (dialogOpen && selectedStudent) {
      generateQRCode(selectedStudent)
    }
  }, [dialogOpen, selectedStudent, generateQRCode])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Profile</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Profile</h1>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  // Not found state
  if (!user) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find your profile information.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Profile</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={user.username} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{user.username}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                    <p>{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{user.contact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Your students' information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.students.map((student) => (
                <div key={student.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Birthdate: {format(student.birthdate, "PPP")} ({calculateAge(student.birthdate)} years old)
                      </p>
                    </div>
                    <Dialog
                      open={dialogOpen && selectedStudent === student.id}
                      onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (open) {
                          setSelectedStudent(student.id)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(student.id)
                          }}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Student QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-6">
                          {qrCodeDataUrl ? (
                            <div className="flex flex-col items-center gap-4">
                              <img
                                src={qrCodeDataUrl || "/placeholder.svg"}
                                alt="Student QR Code"
                                className="h-64 w-64"
                              />
                              <p className="text-sm text-muted-foreground">Student Name: {student.name}</p>
                              <p className="text-sm text-muted-foreground">Student ID: {student.id}</p>
                            </div>
                          ) : (
                            <div className="flex h-64 w-64 items-center justify-center">
                              <p>Generating QR code...</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}

              {user.students.length === 0 && (
                <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">No students added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

