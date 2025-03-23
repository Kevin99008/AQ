"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Award, AlertCircle, ZoomIn, X } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentSelector } from "@/components/userComponent/student-selector"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Types for API responses
interface Certificate {
  id: string
  course: string
  status: string
  certificate_url: string
}

interface Student {
  id: string
  name: string
  birthdate: string
}

export default function CertificatesPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [viewingCertificate, setViewingCertificate] = useState<boolean>(false)

  // Fetch Students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await apiFetch<Student[]>("/api/user/students/")

        if (data === TOKEN_EXPIRED) return // Handle session expiration

        setStudents(data)

        // Set the first Student as selected by default
        if (data.length > 0 && !selectedStudentId) {
          setSelectedStudentId(data[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch Students:", err)
        setError("Failed to load Students data. Please try again later.")
      }
    }

    fetchStudents()
  }, [selectedStudentId])

  // Fetch certificates when selected student changes
  useEffect(() => {
    if (!selectedStudentId) return

    const fetchCertificates = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch certificates for the selected student
        const data = await apiFetch<Certificate[]>(`/api/certificates-all/${selectedStudentId}`)

        if (data === TOKEN_EXPIRED) return // Handle session expiration

        setCertificates(data)
      } catch (err) {
        console.error("Failed to fetch certificates:", err)
        setError("Failed to load certificate data. Please try again later.")
        setCertificates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [selectedStudentId])

  // Function to view a certificate in full screen
  const viewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate)
    setViewingCertificate(true)
    document.body.style.overflow = "hidden"
  }

  // Close certificate view
  const closeCertificate = () => {
    setSelectedCertificate(null)
    setViewingCertificate(false)
    document.body.style.overflow = "auto"
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "issued":
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Fallback for loading state
  if (loading && !certificates.length && !students.length) {
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
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
              </CardHeader>
              <CardContent className="flex justify-center">
                <Skeleton className="h-40 w-full" />
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

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-12">Certificates</h1>
          <p className="text-muted-foreground">View your student&apos;s course certificates</p>
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
            Viewing certificates for: <span className="text-primary">{selectedStudent.name}</span>
          </h2>
          <p className="text-sm text-muted-foreground">{certificates.length} certificates available</p>
        </div>
      )}

      {loading && certificates.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
              </CardHeader>
              <CardContent className="flex justify-center">
                <Skeleton className="h-40 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Award className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No certificates available</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedStudent?.name} hasn&apos;t completed any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{certificate.course}</CardTitle>
                  <Badge className={`${getStatusColor(certificate.status)}`}>{certificate.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <div
                  className="relative w-full h-48 cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => viewCertificate(certificate)}
                >
                  {certificate.certificate_url ? (
                    <>
                      <Image
                        src={certificate.certificate_url || "/placeholder.svg"}
                        alt={`Certificate for ${certificate.course}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md flex items-center">
                          <ZoomIn size={16} className="mr-1" />
                          <span className="text-sm">View Certificate</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted rounded-md">
                      <Award className="h-16 w-16 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Certificate not available</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => viewCertificate(certificate)}
                  disabled={!certificate.certificate_url}
                >
                  <Award className="mr-2 h-4 w-4" />
                  View Certificate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Full screen certificate viewer */}
      {viewingCertificate && selectedCertificate && selectedCertificate.certificate_url && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedCertificate.certificate_url || "/placeholder.svg"}
              alt={`Certificate for ${selectedCertificate.course}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={closeCertificate}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

