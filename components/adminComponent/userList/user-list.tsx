"use client"

import type { User } from "@/types/user"
import { UserListItem } from "./user-list-item"

interface UserListProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

export function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
  return (
    <div className="h-[calc(100vh-73px)] overflow-y-auto">
      {users.length > 0 ? (
        users.map((user) => (
          <UserListItem key={user.id} user={user} isSelected={selectedUser?.id === user.id} onSelect={onSelectUser} />
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">No users found</div>
      )}
    </div>
  )
}

