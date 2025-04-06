"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { StudentCertRaw } from "@/types/user"

interface StudentSelectorProps {
  students: StudentCertRaw[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectStudent: (student: StudentCertRaw) => void
}

export function StudentSelector({ students, searchQuery, onSearchChange, onSelectStudent }: StudentSelectorProps) {
  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      (student.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
      (student.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),
  )

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <RadioGroup className="space-y-3">
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredStudents.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">No students found matching "{searchQuery}"</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={student.id.toString()}
                  id={`student-${student.id}`}
                  onClick={() => onSelectStudent(student)}
                />
                <Label
                  htmlFor={`student-${student.id}`}
                  className="flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Username: {student.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Born: {new Date(student.birthdate).toLocaleDateString()}
                    </p>
                  </div>
                </Label>
              </div>
            ))
          )}
        </div>
      </RadioGroup>
    </div>
  )
}

