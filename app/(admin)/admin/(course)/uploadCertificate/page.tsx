"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Mock data for students and courses
const students = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
]

const courses = [
  { id: "1", name: "Introduction to React" },
  { id: "2", name: "Advanced JavaScript" },
  { id: "3", name: "Web Design Fundamentals" },
]

const formSchema = z.object({
  studentId: z.string().min(1, { message: "Please select a student" }),
  courseId: z.string().min(1, { message: "Please select a course" }),
})

export default function UploadCertificatePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      courseId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const student = students.find((s) => s.id === values.studentId)
    const course = courses.find((c) => c.id === values.courseId)

    if (student && course) {
      // Generate certificate preview
      const certificateHtml = `
        <div style="width: 800px; height: 600px; border: 2px solid #000; padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h1 style="font-size: 36px; margin-bottom: 20px;">Certificate of Completion</h1>
          <p style="font-size: 24px; margin-bottom: 40px;">This certifies that</p>
          <p style="font-size: 36px; font-weight: bold; margin-bottom: 40px;">${student.name}</p>
          <p style="font-size: 24px; margin-bottom: 40px;">has successfully completed the course</p>
          <p style="font-size: 36px; font-weight: bold; margin-bottom: 40px;">${course.name}</p>
          <p style="font-size: 24px;">Date: ${new Date().toLocaleDateString()}</p>
        </div>
      `

      // Convert HTML to data URL
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(certificateHtml)}`
      setPreviewUrl(dataUrl)

      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500))
      alert("Certificate uploaded successfully!")
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Upload Certificate</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student and Course Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Generate and Upload Certificate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {previewUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Certificate Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe src={previewUrl} className="w-full h-[450px] border-0" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

