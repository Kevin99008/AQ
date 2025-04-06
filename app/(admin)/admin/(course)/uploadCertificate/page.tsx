"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { StepIndicator } from "@/components/adminComponent/dashboard/step-indicator"
import { apiFetchFormData } from "@/utils/formData"
import { fetchCategories } from "@/services/api"
import { StudentSelector } from "@/components/certificate/student-selector"
import { CourseSelector } from "@/components/certificate/course-selector"
import { CertificateUploader } from "@/components/certificate/certificate-uploader"
import type { StudentCertRaw } from "@/types/user"

type Category = {
  id: number | string
  categoryName: string
  color?: string
}

type Course = {
  id: number
  name: string
  description: string
  type: string
  quota: number
  created_at: string
  category: number
}

export default function CertificatePage() {
  const { push } = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [users, setUsers] = useState<StudentCertRaw[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentCertRaw | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCourseQuery, setSearchCourseQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [newItem, setNewItem] = useState<{ imageUrl: string; file: File | null }>({
    imageUrl: "",
    file: null,
  })

  const steps = ["Select Student", "Select Course", "Upload Confirmation"]

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories)

        // Initialize selected types with all category names
        setSelectedTypes(fetchedCategories.map((cat: { categoryName: any }) => cat.categoryName))
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Fetch students
  useEffect(() => {
    async function loadStudents() {
      try {
        setIsLoading(true)
        const studentsData = await apiFetch<StudentCertRaw[]>("/api/studentscertificate")
        if (studentsData !== TOKEN_EXPIRED) {
          setUsers(studentsData)
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    loadStudents()
  }, [])

  // Fetch courses when student is selected
  useEffect(() => {
    if (!selectedStudent?.id) return

    async function loadCourses() {
      try {
        setIsLoading(true)
        const coursesData = await apiFetch<Course[]>(`/api/courses/enrolled/?studentId=${selectedStudent?.id}`)
        if (coursesData !== TOKEN_EXPIRED) {
          setCourses(coursesData)
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [selectedStudent])

  // Handle student selection
  const handleStudentSelect = (student: StudentCertRaw) => {
    setSelectedStudent(student)
    setCurrentStep(1) // Move to course selection step
  }

  // Handle course selection
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setCurrentStep(2) // Move to confirmation step
  }

  // Handle image upload
  const handleImageUpload = (imageUrl: string, file: File | null) => {
    setNewItem({
      imageUrl,
      file,
    })
  }

  type LogResponse = {
    id: number
    user: number
    course: number
    certificate_url: string
    status: string
  }

  // Handle certificate submission
  const handleEnrollment = async () => {
    if (!selectedStudent || !selectedCourse || !newItem.file) {
      toast.error("Please upload a certificate")
      return
    }

    const formData = new FormData()
    formData.append("certificate_image", newItem.file)
    formData.append("student", selectedStudent.id.toString())
    formData.append("course", selectedCourse.id.toString())
    formData.append("user", selectedStudent.user_id.toString())

    try {
      const response = await apiFetchFormData<LogResponse>("/api/certificates-upload/", "POST", formData)
      if (response === TOKEN_EXPIRED) {
        push("/login")
      } else {
        toast.success("Certificate uploaded successfully!")
        // Reset form
        setSelectedStudent(null)
        setSelectedCourse(null)
        setNewItem({ imageUrl: "", file: null })
        setCurrentStep(0)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to upload certificate.")
      }
    }
  }

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isLoading && currentStep === 0) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Certification Upload</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <Card className="w-full max-w-3xl mx-auto">
        {currentStep === 0 && (
          <>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>Choose which student to upload a certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentSelector
                students={users}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectStudent={handleStudentSelect}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 1 && selectedStudent && (
          <>
            <CardHeader>
              <CardTitle>Select Course</CardTitle>
              <CardDescription>Choose a course to describe a certificate</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              ) : (
                <CourseSelector
                  courses={courses}
                  categories={categories}
                  searchQuery={searchCourseQuery}
                  onSearchChange={setSearchCourseQuery}
                  selectedTypes={selectedTypes}
                  onToggleType={toggleType}
                  onSelectCourse={handleCourseSelect}
                  loadingCategories={loadingCategories}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </CardFooter>
          </>
        )}

        {currentStep === 2 && selectedStudent && selectedCourse && (
          <>
            <CardHeader>
              <CardTitle>Confirm Certification</CardTitle>
              <CardDescription>Review and confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <CertificateUploader
                selectedStudent={selectedStudent}
                selectedCourse={selectedCourse}
                categories={categories}
                onImageUpload={handleImageUpload}
                imageUrl={newItem.imageUrl}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleEnrollment} disabled={!newItem.file}>
                Confirm Upload
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

