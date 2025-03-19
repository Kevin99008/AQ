"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiFetch, TOKEN_EXPIRED  } from "@/utils/api"
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type UserResponse = {
  id: number
  username: string
  password: string
  email: string
  role: string
  first_name: string
  last_name: string
}
export default function CreateAccountPage() {
  const { push } = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    contact: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    try {
      const response = await apiFetch<UserResponse>("/api/user/create/", "POST", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        contact: formData.contact,
        password: `${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`,
      })

      if (response === TOKEN_EXPIRED) {
        push("/login")
      } else {
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          contact: "",
          password: ""
        })
        toast.success('user created successfully!');
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");   
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create Account For Parent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Phone number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-black text-white">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
