"use client"

import type { Teacher } from "@/types/teacher"
import { TeacherListItem } from "./teacher-list-item"

interface TeacherListProps {
  teachers: Teacher[]
  selectedTeacher: Teacher | null
  onSelectTeacher: (teacher: Teacher) => void
}

export function TeacherList({ teachers, selectedTeacher, onSelectTeacher }: TeacherListProps) {
  return (
    <div className="h-[calc(100vh-73px)] overflow-y-auto">
      {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <TeacherListItem
            key={teacher.id}
            teacher={teacher}
            isSelected={selectedTeacher?.id === teacher.id}
            onSelect={onSelectTeacher}
          />
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">No teachers found</div>
      )}
    </div>
  )
}

