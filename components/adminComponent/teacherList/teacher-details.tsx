"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Teacher } from "@/types/teacher"
import { TeacherInfoCard } from "./teacher-info-card"
import { SessionList } from "./session-list"
import { AddSessionForm } from "./add-session-form"

interface TeacherDetailsProps {
  teacher: Teacher
  onSessionAdded: () => void
}

export function TeacherDetails({ teacher, onSessionAdded }: TeacherDetailsProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{teacher.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{teacher.name}</h1>
          <p className="text-muted-foreground">@{teacher.username}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <TeacherInfoCard title="Teacher Information" description="Basic teacher details">
          <dl className="grid gap-2">
            <div className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd>{teacher.name}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">Username</dt>
              <dd>@{teacher.username}</dd>
            </div>
          </dl>
        </TeacherInfoCard>

        <TeacherInfoCard
          title="Sessions"
          description={`${teacher.name} has ${teacher.sessions.length} session${teacher.sessions.length !== 1 ? "s" : ""}`}
        >
          <SessionList sessions={teacher.sessions} />
          <AddSessionForm teacher={teacher} onSessionAdded={onSessionAdded} />
        </TeacherInfoCard>
      </div>
    </div>
  )
}

