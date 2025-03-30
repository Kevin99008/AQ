"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "unrestricted",
    displayUnit: "years", // This is just for display purposes
    min_age: "",
    max_age: "",
    quota: "10",
    price: "3500",
    category: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ageTab, setAgeTab] = useState<"years" | "months">("years")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAgeTabChange = (value: string) => {
    setAgeTab(value as "years" | "months")
    setFormData((prev) => ({
      ...prev,
      displayUnit: value,
      // Reset age values when switching between years and months
      min_age: "",
      max_age: "",
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (formData.type === "restricted") {
      if (!formData.min_age) {
        newErrors.min_age = `Minimum age is required for restricted courses`
      } else {
        const minAge = Number.parseInt(formData.min_age)
        if (minAge < 0) {
          newErrors.min_age = `Minimum age cannot be negative`
        }

        // Different validation based on display unit
        if (formData.displayUnit === "months" && minAge > 36) {
          newErrors.min_age = "For ages above 36 months, please use years instead"
        }
      }

      if (!formData.max_age) {
        newErrors.max_age = `Maximum age is required for restricted courses`
      } else {
        const minAge = formData.min_age ? Number.parseInt(formData.min_age) : 0
        const maxAge = Number.parseInt(formData.max_age)

        if (maxAge <= minAge) {
          newErrors.max_age = `Maximum age must be greater than minimum age`
        }

        // Different validation based on display unit
        if (formData.displayUnit === "months" && maxAge > 36) {
          newErrors.max_age = "For ages above 36 months, please use years instead"
        }
      }
    }

    if (!formData.quota || Number.parseInt(formData.quota) <= 0) {
      newErrors.quota = "Quota must be a positive number"
    }

    if (!formData.price || Number.parseInt(formData.price) < 0) {
      newErrors.price = "Price cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Convert ages to months for database storage
  const convertToMonths = (age: string, unit: string) => {
    const ageNum = Number.parseInt(age)
    return unit === "years" ? ageNum * 12 : ageNum
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Convert ages to months for database storage
      const minAgeInMonths =
        formData.type === "restricted" ? convertToMonths(formData.min_age, formData.displayUnit) : null

      const maxAgeInMonths =
        formData.type === "restricted" ? convertToMonths(formData.max_age, formData.displayUnit) : null

      // Here you would typically send the data to your API
      console.log("Submitting course data:", {
        ...formData,
        // Store all ages in months in the database
        min_age_months: minAgeInMonths,
        max_age_months: maxAgeInMonths,
        // Keep the display unit for UI purposes
        display_unit: formData.displayUnit,
        quota: Number.parseInt(formData.quota),
        price: Number.parseInt(formData.price),
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to course list page after successful submission
      router.push("/admin/courses")
    } catch (error) {
      console.error("Error creating course:", error)
      setErrors((prev) => ({ ...prev, submit: "Failed to create course. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/admin/unit-course")} className="mr-4">
          Back to Courses
        </Button>
        <h1 className="text-2xl font-bold">Create New Course</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Fill in the details to create a new course. Fields marked with * are required.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base">
                  Course Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-base">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label className="text-base mb-2 block">Course Type *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unrestricted" id="unrestricted" />
                    <Label htmlFor="unrestricted">Unrestricted (No age limit)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="restricted" id="restricted" />
                    <Label htmlFor="restricted">Restricted (Age limited)</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.type === "restricted" && (
                <div className="border rounded-md p-4">
                  <div className="mb-4">
                    <Label className="text-base mb-2 block">Age Unit *</Label>
                    <Tabs value={ageTab} onValueChange={handleAgeTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="years">Years</TabsTrigger>
                        <TabsTrigger value="months">Months</TabsTrigger>
                      </TabsList>
                      <TabsContent value="years" className="pt-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          Use years for children 3 years and older
                        </div>
                      </TabsContent>
                      <TabsContent value="months" className="pt-4">
                        <div className="text-sm text-muted-foreground mb-4">
                          Use months for infants and toddlers under 3 years old
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="min_age" className="text-base">
                          Minimum Age *
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {formData.displayUnit === "months"
                                ? "Enter minimum age in months (e.g., 6 for 6 months)"
                                : "Enter minimum age in years (e.g., 3 for 3 years)"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="min_age"
                        name="min_age"
                        type="number"
                        min="0"
                        max={formData.displayUnit === "months" ? "36" : "18"}
                        value={formData.min_age}
                        onChange={handleChange}
                        className={errors.min_age ? "border-red-500" : ""}
                        placeholder={formData.displayUnit === "months" ? "e.g., 6" : "e.g., 3"}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {formData.displayUnit === "months" ? "Months" : "Years"}
                      </div>
                      {errors.min_age && <p className="text-sm text-red-500 mt-1">{errors.min_age}</p>}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="max_age" className="text-base">
                          Maximum Age *
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {formData.displayUnit === "months"
                                ? "Enter maximum age in months (e.g., 12 for 12 months)"
                                : "Enter maximum age in years (e.g., 5 for 5 years)"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="max_age"
                        name="max_age"
                        type="number"
                        min="0"
                        max={formData.displayUnit === "months" ? "36" : "18"}
                        value={formData.max_age}
                        onChange={handleChange}
                        className={errors.max_age ? "border-red-500" : ""}
                        placeholder={formData.displayUnit === "months" ? "e.g., 12" : "e.g., 5"}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {formData.displayUnit === "months" ? "Months" : "Years"}
                      </div>
                      {errors.max_age && <p className="text-sm text-red-500 mt-1">{errors.max_age}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quota" className="text-base">
                    Quota *
                  </Label>
                  <Input
                    id="quota"
                    name="quota"
                    type="number"
                    min="1"
                    value={formData.quota}
                    onChange={handleChange}
                    className={errors.quota ? "border-red-500" : ""}
                  />
                  {errors.quota && <p className="text-sm text-red-500 mt-1">{errors.quota}</p>}
                </div>

                <div>
                  <Label htmlFor="price" className="text-base">
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                </div>
              </div>

              <div>
                <Label className="text-base">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aquakids">Aquakids</SelectItem>
                    <SelectItem value="Playsounds">Playsounds</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Important Information</p>
                  <p className="mt-1">
                    All age restrictions are stored in months in the database for consistency, but will be displayed in
                    the appropriate format (months or years) to users.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/unit-course")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

