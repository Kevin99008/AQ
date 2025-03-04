"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateAccountPage() {
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
      const response = await fetch("http://localhost:8000/api/user/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          contact: formData.contact,
          password: formData.contact,
        }),
      })

      const data = await response.json()
      console.log("API Response:", data)

      if (response.ok) {
        alert("Account created successfully")
        setFormData({
          firstName: "",
          lastName: "",
          username: "",
          contact: "",
          password: ""
        })
      } else {
        alert(`Failed to create account: ${data.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to create account")
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
