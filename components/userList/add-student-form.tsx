"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/types/user"
import { addStudent } from "@/services/api"
import { toast } from "react-toastify"

interface AddStudentFormProps {
  user: User
  onStudentAdded: () => void
}

export function AddStudentForm({ user, onStudentAdded }: AddStudentFormProps) {
  const [name, setName] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim() && birthdate) {
      setIsSubmitting(true)

      try {
        await addStudent(user.id, {
          name, birthdate
        })

        toast.success(`Added ${name} to ${user.username}'s students`)

        setName("")
        setBirthdate("")
        setIsFormVisible(false)
        onStudentAdded()
      } catch (error) {
        toast.error("Failed to add student. Please try again.")
        console.error("Failed to add student:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="mt-4">
      {!isFormVisible ? (
        <Button variant="outline" onClick={() => setIsFormVisible(true)} className="w-full">
          Add New Student
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Birth Date</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Student"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsFormVisible(false)} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

