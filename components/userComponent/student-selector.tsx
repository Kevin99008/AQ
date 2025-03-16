"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Student {
  id: string
  name: string
  birthdate: string
}

interface StudentSelectorProps {
  Students: Student[]
  selectedStudentId: string
  onSelect: (StudentId: string) => void
}

export function StudentSelector({ Students, selectedStudentId, onSelect }: StudentSelectorProps) {
  const handleValueChange = (value: string) => {
    onSelect(value)
  }

  return (
    <Select value={selectedStudentId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full md:w-[250px]">
        <SelectValue placeholder="Select Student" />
      </SelectTrigger>
      <SelectContent>
        {Students.map((Student) => (
          <SelectItem key={Student.id} value={Student.id}>
            {Student.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

