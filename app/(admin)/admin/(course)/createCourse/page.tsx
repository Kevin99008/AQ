"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  numberOfClasses: z.coerce.number().int().min(1, { message: "Course must have at least 1 class" }),
  courseGroup: z.string({ required_error: "Please select a course group" }),
  image: z.any().optional(),
})

const courseGroups = [
  { id: "programming", name: "Programming" },
  { id: "design", name: "Design" },
  { id: "business", name: "Business" },
  { id: "marketing", name: "Marketing" },
  { id: "personal-development", name: "Personal Development" },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      numberOfClasses: 1,
      courseGroup: "",
      image: null,
    },
  })

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    form.setValue("image", null)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Here you would typically upload the image and submit the form data to your API
      console.log("Form values:", values)
      console.log("Image file:", imageFile)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success message and redirect
      alert("Course created successfully!")
      router.push("/courses") // Redirect to courses page
    } catch (error) {
      console.error("Error creating course:", error)
      alert("Failed to create course. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Course</CardTitle>
          <CardDescription>Fill in the details below to create a new course. All fields are required.</CardDescription>
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
                    <FormDescription>The name of your course as it will appear to students.</FormDescription>
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
                      <Textarea
                        placeholder="Provide a detailed description of your course..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Describe what students will learn in this course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start">
                        <div className="flex h-48 w-full items-center justify-center rounded-md border border-dashed sm:w-48">
                          {imagePreview ? (
                            <div className="relative h-full w-full">
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Course preview"
                                fill
                                className="rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2 h-6 w-6 rounded-full bg-background/80"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove image</span>
                              </Button>
                            </div>
                          ) : (
                            <label
                              htmlFor="courseImage"
                              className="flex cursor-pointer flex-col items-center justify-center gap-1 p-4 text-center"
                            >
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm font-medium">Upload image</span>
                              <span className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</span>
                            </label>
                          )}
                        </div>
                        <div className="w-full space-y-2">
                          <div className="flex items-center justify-between">
                            <FormDescription>Upload a high-quality image to represent your course.</FormDescription>
                          </div>
                          <Input
                            id="courseImage"
                            type="file"
                            accept="image/*"
                            className={imagePreview ? "hidden" : ""}
                            onChange={(e) => {
                              handleImageChange(e)
                              field.onChange(e.target.files?.[0] || null)
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="numberOfClasses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Classes</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>How many classes does this course contain?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseGroups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>The category this course belongs to.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

