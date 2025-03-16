"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Award, Download, Printer, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Types for the API responses
interface CompletedCourseDetail {
  id: string
  title: string
  description: string
  completionDate: string
  grade: string
  instructor: string
  certificateId: string
  hours: number
  skills: string[]
}

interface Child {
  id: string
  name: string
  birthdate: string
}

export default function CertificatePage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get("childId")
  const courseId = params.courseId

  const [course, setCourse] = useState<CompletedCourseDetail | null>(null)
  const [child, setChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch certificate details
  useEffect(() => {
    if (!childId) return

    const fetchCertificateDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/completed/${courseId}?childId=${childId}`)

        if (!courseResponse.ok) {
          throw new Error(`Error: ${courseResponse.status}`)
        }

        const courseData = await courseResponse.json()
        setCourse(courseData)

        // Fetch child details
        const childResponse = await fetch(`/api/children/${childId}`)

        if (!childResponse.ok) {
          throw new Error(`Error: ${childResponse.status}`)
        }

        const childData = await childResponse.json()
        setChild(childData)
      } catch (err) {
        console.error("Failed to fetch certificate details:", err)
        setError("Failed to load certificate details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificateDetails()
  }, [courseId, childId])

  // Handle not found or error states
  if (!childId) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Missing child information</h1>
          <p className="mt-2 text-muted-foreground">Please select a child to view certificate details.</p>
          <Button className="mt-4" onClick={() => router.push("/completed")}>
            Back to Completed Courses
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/completed")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Completed Courses
          </Button>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <Card className="mx-auto max-w-3xl overflow-hidden border-2 print:border-0">
          <CardContent className="p-0">
            <div className="certificate-container bg-white p-8 print:p-0">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid gap-2 sm:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/completed")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Completed Courses
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
  if (!course || !child) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Certificate not found</h1>
          <p className="mt-2 text-muted-foreground">
            The certificate you're looking for doesn't exist or you don't have access.
          </p>
          <Button className="mt-4" onClick={() => router.push("/completed")}>
            Back to Completed Courses
          </Button>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/certificates/download/${courseId}?childId=${childId}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      // Create a blob from the PDF Stream
      const blob = await response.blob()

      // Create a link element, set the download attribute with a filename
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `Certificate-${course.certificateId}.pdf`

      // Append to the document and trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
    } catch (err) {
      console.error("Failed to download certificate:", err)
      alert("Failed to download certificate. Please try again later.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/completed")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Completed Courses
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Card className="mx-auto max-w-3xl overflow-hidden border-2 print:border-0">
        <CardContent className="p-0">
          <div className="certificate-container bg-white p-8 print:p-0">
            <div className="border-8 border-double border-primary/20 p-6 text-center">
              <div className="mb-6 flex justify-center">
                <Award className="h-16 w-16 text-primary" />
              </div>
              <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide text-primary">
                Certificate of Completion
              </h1>
              <p className="mb-8 text-lg text-muted-foreground">This certifies that</p>
              <h2 className="mb-8 font-serif text-3xl font-medium">{child.name}</h2>
              <p className="mb-8 text-lg text-muted-foreground">has successfully completed the course</p>
              <h3 className="mb-2 font-serif text-2xl font-bold">{course.title}</h3>
              <p className="mb-8 text-muted-foreground">{course.description}</p>
              <div className="mb-8 flex justify-center space-x-12">
                <div className="text-center">
                  <p className="text-sm font-medium uppercase text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(course.completionDate).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium uppercase text-muted-foreground">Hours</p>
                  <p className="font-medium">{course.hours}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium uppercase text-muted-foreground">Grade</p>
                  <p className="font-medium">{course.grade}</p>
                </div>
              </div>
              <div className="mb-6 flex justify-between">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-px w-40 bg-gray-300"></div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 h-px w-40 bg-gray-300"></div>
                  <p className="font-medium">Dr. Robert Miller</p>
                  <p className="text-sm text-muted-foreground">Program Director</p>
                </div>
              </div>
              <div className="mt-8 rounded border border-dashed border-muted-foreground/50 p-2 text-center">
                <p className="text-xs text-muted-foreground">Certificate ID: {course.certificateId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Skills Acquired</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {course.skills.map((skill, index) => (
            <li key={index} className="flex items-center">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></div>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

