"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Check, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample students data
const students = [
  { id: "student-1", name: "Somchai Jaidee", avatar: "/placeholder.svg?height=64&width=64" },
  { id: "student-2", name: "Malee Sooksai", avatar: "/placeholder.svg?height=64&width=64" },
  { id: "student-3", name: "Wichai Thongdee", avatar: "/placeholder.svg?height=64&width=64"},
  { id: "student-4", name: "Pranee Rakdee", avatar: "/placeholder.svg?height=64&width=64" },
  { id: "student-5", name: "Somsak Deejai", avatar: "/placeholder.svg?height=64&width=64"},
]

interface StudentSelectionProps {
  course: any
  onComplete: (students: any[]) => void
  onBack: () => void
}

export default function StudentSelection({ course, onComplete, onBack }: StudentSelectionProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const handleStudentToggle = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleComplete = () => {
    const selectedStudentObjects = students.filter((student) => selectedStudents.includes(student.id))
    onComplete(selectedStudentObjects)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl">{course.name}</CardTitle>
              <CardDescription>{course.code}</CardDescription>
              <div className="flex items-center mt-2 gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration} per session
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {course.totalSessions} sessions total
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Select one or more students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStudents.includes(student.id)
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleStudentToggle(student.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`student-${student.id}`}
                    checked={selectedStudents.includes(student.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Label htmlFor={`student-${student.id}`} className="text-base font-medium">
                          {student.name}
                        </Label>
                      </div>
                    </div>
                  </div>
                  {selectedStudents.includes(student.id) && (
                    <div className="text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleComplete} disabled={selectedStudents.length === 0}>
            Continue to Scheduling
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

