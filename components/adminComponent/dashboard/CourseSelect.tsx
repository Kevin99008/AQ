"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface Course {
  id: number
  name: string
  description: string
}

interface CourseSelectProps {
  courses: Course[]
  selectedCourse: number | null
  onSelectCourse: (courseId: number) => void
}

export default function CourseSelect({ courses, selectedCourse, onSelectCourse }: CourseSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCourse ? courses.find((course) => course.id === selectedCourse)?.name : "Select course..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="p-2">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {filteredCourses.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No courses found.</div>
          ) : (
            filteredCourses.map((course) => (
              <DropdownMenuItem
                key={course.id}
                onSelect={() => {
                  onSelectCourse(course.id)
                  setIsOpen(false)
                }}
              >
                <div>
                  <div>{course.name}</div>
                  <div className="text-sm text-gray-500">{course.description}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

