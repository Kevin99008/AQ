"use client"

import type React from "react"

// React and Next.js imports
import { useEffect, useState } from "react"
import Link from "next/link"

// Icon imports
import { BookCopyIcon, Calendar, Phone, BookOpen, User } from "lucide-react"

// Component imports
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

// Type definitions
interface NavCardProps {
  icon: React.ReactNode
  name: string
  href: string
}

interface TeacherProfile {
  user: {
    id: string
    username: string
    email: string
    role: string
    contact: string
    join_date: string
  }
  teacher: {
    id: string
    name: string
    category: string
    status: string
  }
}

// NavCard component
const NavCard: React.FC<NavCardProps> = ({ icon, name, href }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-2xl shadow-md transition hover:bg-gray-100 w-full"
    >
      <div className="w-20 h-12 sm:w-28 sm:h-14 flex items-center justify-center bg-gray-200 rounded-full">{icon}</div>
      <span className="mt-3 text-sm sm:text-base font-medium">{name}</span>
    </Link>
  )
}

// Main component
export default function AdminPanel() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch teacher profile data
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        // This endpoint would need to be created on your backend to return the current teacher's profile
        const data = await apiFetch<TeacherProfile>("/api/teacher-profile")

        if (data === TOKEN_EXPIRED) {
          setError("Session expired. Please log in again.")
          return
        }

        setTeacher(data)
      } catch (err) {
        console.error("Failed to fetch teacher profile:", err)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherProfile()
  }, [])

  if (!teacher) {
    return (
      <div className="container mx-auto flex h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Teacher profile not found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find your teacher profile information. You may not have teacher privileges.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col gap-6 sm:gap-10">
        {/* Teacher Profile and Navigation Cards - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Teacher Profile Card */}
          <Card className="w-full overflow-hidden">
            <div className="bg-gradient-to-r from-rose-100 to-teal-100 h-24 sm:h-32 relative">
              <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage alt={teacher.teacher.name} />
                  <AvatarFallback className="flex items-center justify-center bg-gray-100 rounded-full">
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <CardContent className="pt-16 sm:pt-20 pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">{teacher.teacher.name}</h2>
                  <p className="text-sm text-muted-foreground">@{teacher.user.username}</p>
                  <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {teacher.teacher.status}
                  </div>
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg self-start">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{teacher.teacher.category}</p>
                </div>
              </div>
            </CardContent>

            <div className="border-t border-gray-200">
              <CardContent className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="font-medium">{teacher.user.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="font-medium">{new Date(teacher.user.join_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="font-medium capitalize">{teacher.user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="font-medium">{teacher.user.id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="bg-gray-50 py-3"></CardFooter>
          </Card>

          {/* Navigation Cards - Grid on mobile, column on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <NavCard icon={<Calendar size={24} />} name="My Calendar" href="dashboard" />
            <NavCard icon={<BookCopyIcon size={24} />} name="Assignment" href="assignment" />
          </div>
        </div>
      </div>
    </div>
  )
}

