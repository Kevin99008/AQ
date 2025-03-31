"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchCategories } from "@/services/api"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"

type UserResponse = {
  id: number
  username: string
  password: string
  email: string
  role: string
  first_name: string
  last_name: string
}

export default function AddTeacherPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    contact: "",
    category: "",
  })
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories() // Fetch categories
        setCategories(fetchedCategories)
      } catch (error) {
        setCategoryError("Failed to load categories")
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      contact: "",
      category: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting teacher data:", formData)

    try {
      const response = await apiFetch<UserResponse>("/api/new/teachers/create/", "POST", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        contact: formData.contact,
        password: `${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`,
        category: formData.category,
      })

      if (response !== TOKEN_EXPIRED) {

        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          contact: "",
          category: "",
        })
        toast.success('teacher created successfully!');
      }
      
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }

    // Navigate back to the teacher list
    // router.push("/")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/admin/unit-teacher")} className="mr-4">
          Back to List
        </Button>
        <h1 className="text-2xl font-bold">Add New Teacher</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Fill in the details to add a new teacher to the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lasttName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">

                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category">
                      {categories.find((cat) => cat.id === Number(formData.category))?.categoryName || "Select category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Clear Data
            </Button>
            <Button type="submit">Add Teacher</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

