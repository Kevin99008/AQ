"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { toast } from "react-toastify"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { StepIndicator } from "@/components/dashboard/step-indicator"
import type { StudentCertRaw } from "@/types/user"
import type { CourseRaw } from "@/types/course"
import defaultImg from "@/assets/logo.png"
import { apiFetchFormData } from "@/utils/formData"

export default function CertificatePage() {
  const { push } = useRouter();
  const [currentStep, setCurrentStep] = useState(0)
  const [users, setUsers] = useState<StudentCertRaw[]>([])
  const [courses, setCourses] = useState<CourseRaw[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentCertRaw | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CourseRaw | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchCourseQuery, setSearchCourseQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [newItem, setNewItem] = useState<{ imageUrl: string; file: File | null }>({
    imageUrl: "",
    file: null,
  })
  const steps = ["Select Student", "Select Course", "Upload Confirmation"]
  // const [users, setUsers] = useState<User[]>([])
  // Filter users based on search query
  const filteredStudent = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),

  )

  const filteredCourse = courses.filter(
    (course) =>
      (course.courseName?.toLowerCase() || "").includes((searchCourseQuery || "").toLowerCase()),

  )

  const typeMap: Record<number, CourseRaw["type"]> = {
    1: "AquaKids",
    2: "Playsound",
    3: "Other",
  };
  
  function transformCourseResponse(response: any): CourseRaw {
    return {
      id: response.id,
      courseName: response.courseName,
      description: response.description,
      type: typeMap[response.type] || "Other", // Default to "Other" if unknown
      quota: response.quota,
    };
  }
  // Fetch users and courses on initial load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        const studentsData = await apiFetch<StudentCertRaw[]>('/api/studentscertificate');
        if (studentsData !== TOKEN_EXPIRED) {
          setUsers(studentsData);  // Set data only if the token is not expired
        }

        const coursesData = await apiFetch<CourseRaw[]>('/api/courses/');
        if (coursesData !== TOKEN_EXPIRED) {
          const transformedCourses = coursesData.map(transformCourseResponse);
          setCourses(transformedCourses);  // Set data only if the token is not expired
        }

      } catch (err: any) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong");
        }
      }
      finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])


  // Handle student selection
  const handleStudentSelect = (student: StudentCertRaw) => {
    setSelectedStudent(student)
    setCurrentStep(1) // Move to course selection step
  }

  // Handle course selection
  const handleCourseSelect = (course: CourseRaw) => {
    setSelectedCourse(course)
    setCurrentStep(2) // Move to confirmation step
  }

  type LogResponse = {
    id: number
    user: number
    course: number
    certificate_url: string
    status: string
  }
  // Handle enrollment submission
  const handleEnrollment = async () => {
    if (!selectedStudent || !selectedCourse || !newItem.file) {
      toast.error("Please upload a certificate")
      return
    }
    
    const formData = new FormData();
    formData.append("certificate_image", newItem.file);
    formData.append("student", selectedStudent.id.toString());
    formData.append("course", selectedCourse.id.toString());

    try {
      const response = await apiFetchFormData<LogResponse>("/api/certificates-upload/", "POST", formData);
      if (response === TOKEN_EXPIRED) {
        push("/login");
      } else {
        toast.success("Certificate uploaded successfully!");
        // Perform any additional actions, like redirecting or clearing the form
        setSelectedStudent(null)
        setSelectedCourse(null)
        setNewItem({ imageUrl: "", file: null });
        setCurrentStep(0)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to enroll student in course.")
      }
    } 
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileNameWithUnderscores = file.name.replace(/\s+/g, '_');
      const newFile = new File([file], fileNameWithUnderscores, { type: file.type });
  
      setNewItem((prevItem) => ({
        ...prevItem,
        imageUrl: URL.createObjectURL(newFile), // Preview image
        file: newFile, // Store new file for FormData
      }));
    } else {
      setNewItem((prevItem) => ({
        ...prevItem,
        imageUrl: "",
        file: null,
      }));
    }
  }

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
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
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <RadioGroup className="space-y-3">
              <div className="space-y-3 max-h-[400px] overflow-y-auto ">
                {filteredStudent.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={student.id.toString()}
                      id={`student-${student.id}`}
                      onClick={() => handleStudentSelect(student)}
                    />
                    <Label
                      htmlFor={`student-${student.id}`}
                      className="flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Username: {student.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Born: {new Date(student.birthdate).toLocaleDateString()}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
                </div>
              </RadioGroup>

            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
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
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8"
                    value={searchCourseQuery}
                    onChange={(e) => setSearchCourseQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredCourse.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{course.courseName}</h3>
                      <Badge>Type: {course.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Category: {course.description}</span>
                    </div>
                  </div>
                ))}
              </div>
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
              <CardDescription>Review and confirm </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Student</h3>
                  <p>{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Born: {new Date(selectedStudent.birthdate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <h3 className="font-medium mb-1">Course</h3>
                  <p>{selectedCourse.courseName}</p>
                  <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                    <span>Type: {selectedCourse.type}</span>
                  </div>
                </div>

                <div className="p-3 border rounded-md bg-muted/50">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} />
                  {newItem.imageUrl && (
                    <Image
                      src={newItem.imageUrl || defaultImg}
                      alt="Uploaded Image"
                      width={1000}
                      height={0}
                      className="rounded-md"
                    />
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleEnrollment} >
                confirm Upload
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

