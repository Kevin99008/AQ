"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { CoursePriceRaw } from "@/types/course"
import { Search, Filter, Droplets, Music, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(3, { message: "Course name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  classesOption: z.enum(["5", "10", "custom"], { required_error: "Please select number of classes" }),
  customClasses: z.coerce.number().int().min(1, { message: "Course must have at least 1 class" }).optional(),
  levelId: z.string({ required_error: "Please select a course level" }),
  price: z.coerce.number().min(10, { message: "Price must be at least 10" }).max(99999, { message: "Price cannot exceed 99999" })
})

const classTypes = [
  { id: "1", name: "Aquakids" },
  { id: "2", name: "Playsound" },
  { id: "3", name: "Other" },
]

const typeConfig: Record<
  string,
  {
    borderColor: string
    bgColor: string
    badgeColor: string
    icon: React.ReactNode
  }
> = {
  AquaKids: {
    borderColor: "border-blue-400",
    bgColor: "bg-gradient-to-r from-blue-50 to-transparent",
    badgeColor: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    icon: <Droplets className="h-4 w-4 text-blue-500 flex-shrink-0" />,
  },
  Playsound: {
    borderColor: "border-orange-400",
    bgColor: "bg-gradient-to-r from-orange-50 to-transparent",
    badgeColor: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    icon: <Music className="h-4 w-4 text-orange-500 flex-shrink-0" />,
  },
  Other: {
    borderColor: "border-pink-400",
    bgColor: "bg-gradient-to-r from-pink-50 to-transparent",
    badgeColor: "bg-pink-100 text-pink-700 hover:bg-pink-100",
    icon: <Sparkles className="h-4 w-4 text-pink-500 flex-shrink-0" />,
  },
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [price, setPrice] = useState(0)
  const [courses, setCourses] = useState<CoursePriceRaw[]>([])
  const [searchCourseQuery, setSearchCourseQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["AquaKids", "Playsound", "Other"])

  const filteredCourse = courses.filter(
    (course) =>
      (course.courseName?.toLowerCase() || "").includes((searchCourseQuery || "").toLowerCase()) &&
      selectedTypes.includes(course.type),
  )

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const typeMap: Record<number, CoursePriceRaw["type"]> = {
    1: "AquaKids",
    2: "Playsound",
    3: "Other",
  };

  function transformCourseResponse(response: any): CoursePriceRaw {
    return {
      id: response.id,
      courseName: response.courseName,
      description: response.description,
      type: typeMap[response.type] || "Other", // Default to "Other" if unknown
      quota: response.quota,
      price: response.price,
    };
  }
  
  async function loadData() {
    try {
      setIsLoading(true)


      const coursesData = await apiFetch<CoursePriceRaw[]>('/api/courses-price/');
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
  useEffect(() => {

    loadData()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      classesOption: "10",
      customClasses: 1,
      levelId: "",
      price: 0,
    },
  })

  // Watch the classesOption field to conditionally render the custom input
  const classesOption = form.watch("classesOption")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Determine the actual number of classes based on the selection
      const numberOfClasses =
        values.classesOption === "custom" ? values.customClasses : Number.parseInt(values.classesOption, 10)

      if (!numberOfClasses) {
        throw new Error("Number of classes is required")
      }

      const response = await apiFetch<CoursePriceRaw>("/api/courses/create/", "POST", {
        courseName: values.name,
        description: values.description,
        typeId: values.levelId,
        quota: numberOfClasses,
        price: values.price,
      })

      if (response === TOKEN_EXPIRED) throw new Error("Token expired. Please log in again.")

      toast.success("Course created successfully!")
      // router.push("/admin/createCourse")
      loadData()
    } catch (error) {
      console.error("Error creating course:", error)
      toast.error("Failed to create course. Please try again.")
    } finally {
      setIsSubmitting(false)
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
    <div className="container py-10 flex">
      <Card className="w-2/3 mr-12 h-full">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>Choose a course to enroll the student in</CardDescription>
        </CardHeader>
        <CardContent>
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchCourseQuery}
              onChange={(e) => setSearchCourseQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("AquaKids")}
                onCheckedChange={() => toggleType("AquaKids")}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600">AquaKids</span>
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("Playsound")}
                onCheckedChange={() => toggleType("Playsound")}
              >
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600">Playsound</span>
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedTypes.includes("Other")}
                onCheckedChange={() => toggleType("Other")}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span className="text-pink-600">Other</span>
                </div>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto ">
          {filteredCourse.map((course) => {
            const config = typeConfig[course.type] || typeConfig["Other"]

            return (
              <div
                key={course.id}
                className={cn(
                  "p-3 border border-l-4 rounded-md cursor-pointer transition-colors",
                  config.borderColor,
                  config.bgColor,
                  "hover:bg-muted/50 group",
                )}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{course.courseName}</h3>
                      <Badge className={cn("text-xs font-medium", config.badgeColor)}>{course.type}</Badge>
                    </div>
                  </div>

                  <Badge
                    className={cn(
                      "font-medium text-sm shadow-sm transition-transform group-hover:scale-105",
                      config.badgeColor
                        .replace("hover:bg-blue-100", "")
                        .replace("hover:bg-orange-100", "")
                        .replace("hover:bg-pink-100", ""),
                    )}
                  >
                    ฿{typeof course.price === "number" ? course.price.toFixed(2) : course.price}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground ml-6">{course.description}</p>
                <Badge className={cn("text-xs font-medium", config.badgeColor)}>Course Quota: {course.quota}</Badge>
                  
                </div>
              </div>

            )
          })}
          </div>
        </CardContent>
      </Card>
      <Card className="w-1/3">
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
                name="classesOption"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Number of Classes</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="5" />
                          </FormControl>
                          <FormLabel className="font-normal">5 Classes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="10" />
                          </FormControl>
                          <FormLabel className="font-normal">10 Classes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="custom" />
                          </FormControl>
                          <FormLabel className="font-normal">Custom</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {classesOption === "custom" && (
                <FormField
                  control={form.control}
                  name="customClasses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Number of Classes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter number of classes"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : Number(value)); // Allow clearing the input
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="levelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type of class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Price</FormLabel>
                    <FormControl>
                      <Input
                        id="credit-quantity"
                        type="number"
                        min={10}
                        max={99999}
                        value={price === 0 ? '' : price}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                          setPrice(isNaN(value) ? 0 : value)
                          field.onChange(value)
                        }}
                        className="w-full"
                      />
                    </FormControl>
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

