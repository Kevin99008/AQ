"use client"

import { useState } from "react"
import { Search, User, Calendar, AtSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StudentCertRaw } from "@/types/user"

interface StudentSelectorProps {
  students: StudentCertRaw[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectStudent: (student: StudentCertRaw) => void
}

export function StudentSelector({ students, searchQuery, onSearchChange, onSelectStudent }: StudentSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      (student.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (student.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),
  )

  // Handle student selection
  const handleSelect = (student: StudentCertRaw) => {
    setSelectedId(student.id.toString())
    onSelectStudent(student)
  }

  // Calculate age from birthdate
  const calculateAge = (birthdate: string): string => {
    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return `${age} years old`
  }

  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get random pastel color for avatar based on name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-yellow-100 text-yellow-800",
      "bg-indigo-100 text-indigo-800",
      "bg-red-100 text-red-800",
      "bg-orange-100 text-orange-800",
    ]

    // Simple hash function to get consistent color for the same name
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students by name or username..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">No students found matching "{searchQuery}"</p>
        </div>
      ) : (
        <RadioGroup className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className={cn(
                "cursor-pointer transition-all border-2",
                selectedId === student.id.toString()
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-primary/20",
              )}
              onClick={() => handleSelect(student)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <RadioGroupItem value={student.id.toString()} id={`student-${student.id}`} className="mt-1" />

                <Avatar className={cn("h-12 w-12", getAvatarColor(student.name))}>
                  <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="font-medium text-base">{student.name}</div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <AtSign className="h-3 w-3" />
                        {student.username}
                      </Badge>

                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {calculateAge(student.birthdate)}
                      </Badge>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Born: {new Date(student.birthdate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}

