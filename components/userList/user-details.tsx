"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/types/user"
import { UserInfoCard } from "./user-info-card"
import { StudentList } from "./student-list"
import { AddStudentForm } from "./add-student-form"

interface UserDetailsProps {
  user: User
  onStudentAdded: () => void
}

export function UserDetails({ user, onStudentAdded }: UserDetailsProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.role}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <UserInfoCard title="Contact Information" description="Basic user details">
          <dl className="grid gap-2">
            <div className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">Role</dt>
              <dd>{user.role}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
              <dd>{user.phone}</dd>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <dt className="text-sm font-medium text-muted-foreground">Join Date</dt>
              <dd>{user.joinDate}</dd>
            </div>
          </dl>
        </UserInfoCard>

        <UserInfoCard
          title="Students"
          description={`${user.name} has ${user.students.length} student${user.students.length !== 1 ? "s" : ""}`}
        >
          <StudentList students={user.students} />
          <AddStudentForm user={user} onStudentAdded={onStudentAdded} />
        </UserInfoCard>
      </div>
    </div>
  )
}

