"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
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

interface AddTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTeacherAdded?: () => void
}

export function AddTeacherModal({ open, onOpenChange, onTeacherAdded }: AddTeacherModalProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])
  const [selectedUsername, setSelectedUsername] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

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

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      contact: "",
      category: "",
    })
    setUsernameSuggestions([])
    setSelectedUsername("")
    setShowConfirmation(false)
  }

  // Generate username suggestions based on first name, last name, and contact
  const generateUsernameSuggestions = (firstName: string, lastName: string, contact: string) => {
    if (!firstName || !lastName || !contact || contact.length < 4) return []

    const suggestions: string[] = []

    // Option 1: First initial + Last initial + Last 4 digits
    const firstInitial = firstName[0]?.toLowerCase() || ""
    const lastInitial = lastName[0]?.toLowerCase() || ""
    const lastFourDigits = contact.slice(-4)
    suggestions.push(`${firstInitial}${lastInitial}${lastFourDigits}`)

    // Option 2: First name + Last initial + Last 2 digits
    const firstNameLower = firstName.toLowerCase()
    const lastTwoDigits = contact.slice(-2)
    suggestions.push(`${firstNameLower}${lastInitial}${lastTwoDigits}`)

    // Option 3: First 3 letters of first name + First 3 letters of last name
    const firstThreeFirst = firstName.substring(0, Math.min(3, firstName.length)).toLowerCase()
    const firstThreeLast = lastName.substring(0, Math.min(3, lastName.length)).toLowerCase()
    suggestions.push(`${firstThreeFirst}${firstThreeLast}`)

    return suggestions
  }

  // Update username suggestions when form data changes
  useEffect(() => {
    const suggestions = generateUsernameSuggestions(formData.firstName, formData.lastName, formData.contact)
    setUsernameSuggestions(suggestions)

    // Select the first suggestion by default if we have suggestions and nothing is selected yet
    if (suggestions.length > 0 && (!selectedUsername || !suggestions.includes(selectedUsername))) {
      setSelectedUsername(suggestions[0])
    }
  }, [formData.firstName, formData.lastName, formData.contact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Show confirmation dialog instead of submitting directly
    setShowConfirmation(true)
  }

  const handleConfirmCreate = async () => {
    setIsSubmitting(true)

    try {
      const response = await apiFetch<UserResponse>("/api/new/teachers/create/", "POST", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: selectedUsername,
        contact: formData.contact,
        password: `${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`,
        category: formData.category,
      })

      if (response !== TOKEN_EXPIRED) {
        resetForm()
        toast.success("Teacher created successfully!")
        onOpenChange(false) // Close the modal
        if (onTeacherAdded) {
          onTeacherAdded() // Refresh the teacher list if needed
        }
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
      setShowConfirmation(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            onOpenChange(false)
            resetForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Fill in the details to add a new teacher to the system.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
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
                        {categories.find((cat) => cat.id === Number(formData.category))?.categoryName ||
                          "Select category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {usernameSuggestions.length > 0 && (
                <div className="mt-4 p-3 bg-slate-50 rounded-md border">
                  <p className="text-sm text-slate-500 mb-2">Select a username:</p>
                  <div className="space-y-2">
                    {usernameSuggestions.map((username, index) => (
                      <div key={username} className="flex items-center">
                        <input
                          type="radio"
                          id={`username-${index}`}
                          name="username-selection"
                          value={username}
                          checked={selectedUsername === username}
                          onChange={() => setSelectedUsername(username)}
                          className="mr-2"
                        />
                        <label htmlFor={`username-${index}`} className="text-sm font-medium">
                          {username}
                          {index === 0 && (
                            <span className="ml-2 text-xs text-slate-400">(initials + last 4 digits)</span>
                          )}
                          {index === 1 && (
                            <span className="ml-2 text-xs text-slate-400">(first name + initial + last 2 digits)</span>
                          )}
                          {index === 2 && (
                            <span className="ml-2 text-xs text-slate-400">(first 3 chars of first & last name)</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={resetForm}>
                Clear Data
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedUsername}>
                {isSubmitting ? "Adding..." : "Add Teacher"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Teacher Creation</DialogTitle>
            <DialogDescription>Please review the teacher details before confirming.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>A new teacher will be created with the following details:</AlertDescription>
            </Alert>

            <div className="space-y-2 p-4 bg-slate-50 rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm font-medium">Name:</p>
                <p className="text-sm">
                  {formData.firstName} {formData.lastName}
                </p>

                <p className="text-sm font-medium">Contact:</p>
                <p className="text-sm">{formData.contact}</p>

                <p className="text-sm font-medium">Username:</p>
                <p className="text-sm font-bold">{selectedUsername}</p>

                <p className="text-sm font-medium">Category:</p>
                <p className="text-sm">
                  {categories.find((cat) => cat.id === Number(formData.category))?.categoryName || ""}
                </p>

                <p className="text-sm font-medium">Initial Password:</p>
                <p className="text-sm">{`${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`}</p>
              </div>
            </div>

            <p className="text-sm text-amber-600">Note: The teacher cannot change their password after creation.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
              Back
            </Button>
            <Button onClick={handleConfirmCreate} disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting ? "Creating..." : "Confirm & Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
