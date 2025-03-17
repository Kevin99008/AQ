"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

const formSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  numberOfClasses: z.coerce.number().int().min(1, { message: "Course must have at least 1 class" }),
  levelId: z.string({ required_error: "Please select a course level" }), // Change courseGroup to levelId
})

const courseLevels = [
  { id: "1", name: "Beginner" },
  { id: "2", name: "Intermediate" },
  { id: "3", name: "Advanced" },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      numberOfClasses: 10,
      levelId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await apiFetch("/api/courses/create/", "POST", {
        courseName: values.name,
        description: values.description,
        levelId: values.levelId,  // Just sending the levelId, not the entire level object
      })

      if (response === TOKEN_EXPIRED) throw new Error("Token expired. Please log in again.")

      toast.success("Course created successfully!")
      router.push("/admin/createCourse")
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error("Failed to create course. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <div className="container py-10 place-items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Course</CardTitle>
          <CardDescription>Fill in the details below to create a new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a detailed description..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfClasses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Classes</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="levelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} type="button">
            Cancel
          </Button>
          <Button type="submit" form="course-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
