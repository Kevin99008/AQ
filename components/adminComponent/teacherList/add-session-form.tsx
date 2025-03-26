"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { addSessionToTeacher } from "@/services/api"
import type { Teacher } from "@/types/teacher"

interface AddSessionFormProps {
  teacher: Teacher
  onSessionAdded: () => void
}

export function AddSessionForm({ teacher, onSessionAdded }: AddSessionFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    course: "",
    session_date: "",
    start_time: "",
    end_time: "",
    total_quota: "10",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addSessionToTeacher(teacher.id, formData)
      toast.success("Session added successfully")
      setIsAdding(false)
      setFormData({
        course: "",
        session_date: "",
        start_time: "",
        end_time: "",
        total_quota: "10",
      })
      onSessionAdded()
    } catch (error) {
      toast.error("Failed to add session")
      console.error("Failed to add session:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdding) {
    return (
      <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
        Add New Session
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 border rounded-lg p-4">
      <h3 className="font-medium">Add New Session</h3>

      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select value={formData.course} onValueChange={(value) => handleSelectChange("course", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="session_date">Session Date</Label>
        <Input
          id="session_date"
          name="session_date"
          type="date"
          value={formData.session_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" name="end_time" type="time" value={formData.end_time} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_quota">Total Quota</Label>
        <Input
          id="total_quota"
          name="total_quota"
          type="number"
          min="1"
          value={formData.total_quota}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Session"}
        </Button>
      </div>
    </form>
  )
}

