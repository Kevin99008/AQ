"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTeacherModal } from "@/components/adminComponent/teacherList/create-teacher-modal"

interface TeacherSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onTeacherCreated: () => void
}

export function TeacherSearch({ searchQuery, setSearchQuery, onTeacherCreated }: TeacherSearchProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Teacher
        </Button>
      </div>

      <CreateTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeacherCreated={() => {
          setIsModalOpen(false)
          onTeacherCreated()
        }}
      />
    </div>
  )
}

