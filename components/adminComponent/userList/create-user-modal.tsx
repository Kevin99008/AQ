"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { useRouter } from "next/navigation"

type UserResponse = {
  id: number
  username: string
  password: string
  email: string
  role: string
  first_name: string
  last_name: string
}

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const { push } = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    contact: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Replace the existing state for previewUsername with an array of usernames and a selected username
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])
  const [selectedUsername, setSelectedUsername] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  // Update the resetForm function to reset the username suggestions and selection
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      contact: "",
    })
    setUsernameSuggestions([])
    setSelectedUsername("")
    setShowConfirmation(false)
  }

  // Replace the generateUsername function with this new function that generates multiple options
  const generateUsernameSuggestions = (firstName: string, lastName: string, contact: string) => {
    if (!firstName || !lastName || !contact || contact.length < 4) return []

    const suggestions: string[] = []

    // Option 1: First initial + Last initial + Last 4 digits (original pattern)
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

  // Replace the useEffect that updates the preview username
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
    // Instead of submitting directly, show confirmation dialog
    setShowConfirmation(true)
  }

  // Replace the handleConfirmCreate function to use selectedUsername instead of previewUsername
  const handleConfirmCreate = async () => {
    setIsSubmitting(true)

    try {
      const response = await apiFetch<UserResponse>("/api/user/create/", "POST", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: selectedUsername,
        contact: formData.contact,
        password: `${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`,
      })

      if (response === TOKEN_EXPIRED) {
        push("/login")
      } else {
        resetForm()
        toast.success("User created successfully!")
        onUserCreated()
        onClose()
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
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
            resetForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
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
              <Label htmlFor="contact">Phone number</Label>
              <Input id="contact" name="contact" type="tel" value={formData.contact} onChange={handleChange} required />
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
                        {index === 0 && <span className="ml-2 text-xs text-slate-400">(initials + last 4 digits)</span>}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedUsername}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm User Creation</DialogTitle>
            <DialogDescription>Please review the user details before confirming.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>A new user will be created with the following details:</AlertDescription>
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

                <p className="text-sm font-medium">Initial Password:</p>
                <p className="text-sm">{`${formData.firstName[0]}${formData.lastName[0]}${formData.contact}`}</p>
              </div>
            </div>

            <p className="text-sm text-amber-600">
              Note: The user cannot to change their password after created.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
              Back
            </Button>
            <Button onClick={handleConfirmCreate} disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting ? "Creating..." : "Confirm & Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

