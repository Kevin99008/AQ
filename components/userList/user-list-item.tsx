"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/types/user"
import { Users } from "lucide-react"

interface UserListItemProps {
  user: User
  isSelected: boolean
  onSelect: (user: User) => void
}

export function UserListItem({ user, isSelected, onSelect }: UserListItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 border-b p-3 transition-colors hover:bg-muted/50 ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={() => onSelect(user)}
    >
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="font-medium">{user.name}</p>
        <p className="truncate text-sm text-muted-foreground">{user.role}</p>
      </div>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Users size={16} />
        <span className="text-sm">{user.students.length}</span>
      </div>
    </div>
  )
}

