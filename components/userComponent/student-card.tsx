"use client"

import { Calendar, User, BookOpen } from "lucide-react"
import { format } from "date-fns"

interface StudentCardProps {
  student: {
    id: number
    name: string
    username: string
    birthdate: string
    sessions: any[]
  }
  onClick: () => void
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform origin-left transition-transform duration-300 group-hover:scale-x-100" />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex">
            {/* Avatar circle */}
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-3 mr-4 shadow-sm group-hover:shadow transition-shadow">
              <User className="h-6 w-6 text-blue-600" />
            </div>

            {/* Student info */}
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                {student.name}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <span className="inline-block bg-blue-50 text-blue-700 rounded-md px-2 py-0.5 font-medium">
                  @{student.username}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Born: {formatDate(student.birthdate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions count badge */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
            <span>Enrolled in</span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full px-3 py-1 border border-blue-100 shadow-sm">
            {student.sessions.length} Sessions
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  )
}

