"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { createTeacher } from "@/services/api"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { useRouter } from "next/navigation"

interface CreateTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  onTeacherCreated: () => void
}

type UserResponse = {
  id: number
  username: string
  password: string
  email: string
  role: string
  first_name: string
  last_name: string
}


export function CreateTeacherModal({ isOpen, onClose, onTeacherCreated }: CreateTeacherModalProps) {
    const { push } = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    contact: "",
    password: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      console.log("Form submitted:", formData)
  
      try {
        const response = await apiFetch<UserResponse>("/api/teachers/create/", "POST", {
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
          toast.success('teacher created successfully!');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Teacher</DialogTitle>
          <DialogDescription>Add a new teacher to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Phone number</Label>
            <Input id="contact" name="contact" type="tel" value={formData.contact} onChange={handleChange} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

