"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Camera, AlertCircle, RefreshCw, CheckCircle, User, Calendar, Clock, MapPin } from "lucide-react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import type { AttendanceRecord } from "@/types/dashboard"
import AttendanceLog from "@/components/adminComponent/dashboard/AttendanceLog"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Define the Student interface
interface Student {
  id: number
  name: string
  email?: string
  student_id: string
  profile_image?: string
  department?: string
  year?: string
  status?: string
  sessions?: string
  // Add any other student fields you need
}

export default function CheckAttendance() {
  const [scanning, setScanning] = useState(false)
  const [qrContent, setQrContent] = useState<string | null>(null)
  const [parsedContent, setParsedContent] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>("All")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [studentDetails, setStudentDetails] = useState<Student | null>(null)
  const [loadingStudent, setLoadingStudent] = useState(false)

  useEffect(() => {
    // Fetch data based on the selected group
    const fetchData = async () => {
      try {
        const attendanceResponse = await apiFetch<AttendanceRecord[]>(`/api/attendance-log/?sortNewestFirst=true`)
        if (attendanceResponse !== TOKEN_EXPIRED) {
          setAttendanceRecords(attendanceResponse) // Now passing an array
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null

    if (scanning) {
      // Function to handle successful scans
      const onScanSuccess = async (decodedText: string) => {
        // Store the raw QR code content
        setQrContent(decodedText)

        try {
          // Try to parse the QR code content as JSON
          const parsedData = JSON.parse(decodedText)
          setParsedContent(parsedData)

          // If we have a student_id, fetch the student details
          if (parsedData.student_id) {
            await fetchStudentDetails(parsedData.student_id)
          }
        } catch (e) {
          // If it's not valid JSON, just show the raw text
          setParsedContent(null)
          setStudentDetails(null)
        }
      }

      // Function to handle scan failures
      const onScanFailure = (error: string) => {
        // We don't need to show every scan failure as it happens continuously
        console.warn(`QR scan error: ${error}`)
      }

      // Initialize the scanner
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false,
      )

      scanner.render(onScanSuccess, onScanFailure)
    }

    // Cleanup function
    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner", error)
        })
      }
    }
  }, [scanning])

  // Clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchStudentDetails = async (studentId: number) => {
    setLoadingStudent(true)
    try {
      // Use the Django URL pattern to fetch student details
      const studentResponse = await apiFetch<Student>(`/api/students/${studentId}`)

      if (studentResponse === TOKEN_EXPIRED) {
        setError("sessions expired. Cannot fetch student details.")
        setStudentDetails(null)
        return
      }

      setStudentDetails(studentResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch student details")
      setStudentDetails(null)
      console.error("Error fetching student details:", err)
    } finally {
      setLoadingStudent(false)
    }
  }

  const startScanning = () => {
    setScanning(true)
    setError(null)
    setSuccess(null)
    setQrContent(null)
    setParsedContent(null)
    setStudentDetails(null)
  }

  const stopScanning = () => {
    setScanning(false)
  }

  const clearResults = () => {
    setQrContent(null)
    setParsedContent(null)
    setSuccess(null)
    setStudentDetails(null)
  }

  const handleCheckAttendance = async () => {
    try {
      // Validate that parsedContent has the expected format with student_id
      if (!parsedContent || !parsedContent.student_id) {
        setError('Invalid QR code format. Expected {"student_id": number}')
        return
      }

      const studentId = parsedContent.student_id

      setIsSubmitting(true)
      setError(null)

      // Prepare the data to send in the body
      const dataToSend = { student_id: studentId }

      // Make the API call using apiFetch with the extracted studentId in the body
      const result = await apiFetch("/api/attendance-update/", "PATCH", dataToSend)

      if (result === TOKEN_EXPIRED) {
        setError("sessions expired. Cannot update attendance.")
        return
      }

      setSuccess("Attendance successfully recorded!")

      // Refresh attendance records after successful check-in
      const attendanceResponse = await apiFetch<AttendanceRecord[]>(`/api/attendance-log/?sortNewestFirst=true`)
      if (attendanceResponse !== TOKEN_EXPIRED) {
        setAttendanceRecords(attendanceResponse)
      }

      console.log("Attendance updated:", result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update attendance")
      console.error("Error updating attendance:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex container flex-col sm:flex-row">
      <div className="mx-auto px-4 py-8 max-w-4xl sm:w-1/2">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Camera className="h-6 w-6" /> QR Code Scanner
            </CardTitle>
            <CardDescription>
              Scan QR codes to view student details. Position the QR code within the scanner frame.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!scanning ? (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground mb-4">
                  Click the button below to start scanning QR codes with your camera
                </p>
                <Button onClick={startScanning} size="lg" className="bg-black text-white">
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div id="reader" className="w-full max-w-md"></div>
                <Button onClick={stopScanning} variant="outline" className="mt-4 bg-black text-white">
                  Stop Scanning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Success notification */}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Error notification */}
        {error && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Student Details Display */}
        {qrContent && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Details</CardTitle>
                <CardDescription>Information about the scanned student</CardDescription>
              </div>
              {qrContent && (
                <Button variant="outline" size="sm" onClick={clearResults}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingStudent ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : studentDetails ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      {studentDetails.profile_image ? (
                        <AvatarImage src={studentDetails.profile_image} alt={studentDetails.name} />
                      ) : (
                        <AvatarFallback className="bg-black text-white text-lg">
                          {studentDetails.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{studentDetails.name}</h3>
                      <p className="text-muted-foreground">{studentDetails.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    {studentDetails.department && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Department:</span>
                        <span className="text-sm">{studentDetails.department}</span>
                      </div>
                    )}

                    {studentDetails.year && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Year:</span>
                        <span className="text-sm">{studentDetails.year}</span>
                      </div>
                    )}

                    {/* {studentDetails.sessions && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Last Attendance:</span>
                        <span className="text-sm">{studentDetails.sessions}</span>
                      </div>
                    )} */}
                  </div>

                  {/* {studentDetails.status && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={studentDetails.status === "Active" ? "default" : "secondary"}>
                        {studentDetails.status}
                      </Badge>
                    </div>
                  )} */}

                  <Separator />

                  {/* Check Attendance Button */}
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={handleCheckAttendance}
                      className="bg-green-600 hover:bg-green-700 text-white w-full py-6 text-lg"
                      disabled={isSubmitting || !parsedContent || !parsedContent.student_id}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Check Attendance
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : parsedContent ? (
                <div className="space-y-4">
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle>Student Not Found</AlertTitle>
                    <AlertDescription>
                      {parsedContent.student_id
                        ? "Could not retrieve student details. Please try again or check the student ID."
                        : "The scanned QR code doesn't contain a valid student_id. Please scan a valid student QR code."}
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Raw QR Content:</h3>
                    <div className="p-4 bg-muted rounded-md overflow-x-auto">
                      <pre className="whitespace-pre-wrap break-words">{qrContent}</pre>
                    </div>
                  </div>

                  {parsedContent && parsedContent.student_id && (
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={handleCheckAttendance}
                        className="bg-green-600 hover:bg-green-700 text-white w-full py-6 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Check Attendance Anyway
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium mb-2">Raw Content:</h3>
                  <div className="p-4 bg-muted rounded-md overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-words">{qrContent}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance Records Section */}
      <div className="mb-6 sm:w-1/2 sm:pl-4">
        <h2 className="text-lg font-semibold mb-3">Attendance</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Recent Attendance</CardTitle>
              <CardDescription>Search and view latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceLog
                records={attendanceRecords}
                onSelectAttendance={setSelectedAttendance}
                sortNewestFirst={true}
                category={selectedGroup}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
