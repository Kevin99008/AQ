"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Teacher } from "@/types/teacher"

interface TeacherListItemProps {
  teacher: Teacher
  isSelected: boolean
  onSelect: (teacher: Teacher) => void
}

export function TeacherListItem({ teacher, isSelected, onSelect }: TeacherListItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={() => onSelect(teacher)}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{teacher.name}</div>
        <div className="text-sm text-muted-foreground truncate">@{teacher.username}</div>
      </div>
      <div className="text-xs text-muted-foreground">{teacher.sessions?.length || 0} sessions</div>
    </div>
  )
}

