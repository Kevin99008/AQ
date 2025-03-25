"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateUserModal } from "@/components/adminComponent/userList/create-user-modal"

interface UserSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onUserCreated: () => void
}

export function UserSearch({ searchQuery, setSearchQuery, onUserCreated }: UserSearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add User
        </Button>
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserCreated={() => {
          setIsModalOpen(false)
          onUserCreated()
        }}
      />
    </div>
  )
}

