"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Course {
  id: number
  title: string
  description: string
  quota: number
  completed: number
  color: string
}

interface Child {
  id: number
  name: string
  courses: Course[]
}

interface CoursesProps {
  children: Child[]
}

const Courses: React.FC<CoursesProps> = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState<number>(children[0]?.id || 0)

  const selectedChildCourses = children.find((child) => child.id === selectedChild)?.courses || []

  return (
    <div className="space-y-4">
      <Select onValueChange={(value) => setSelectedChild(Number(value))}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id.toString()}>
              {child.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedChildCourses.map((course) => (
        <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${course.color}`}
                style={{ width: `${(course.completed / course.quota) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {course.completed} of {course.quota} classes completed
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: course.quota }).map((_, index) => (
                <Badge
                  key={index}
                  variant={index < course.completed ? "default" : "outline"}
                  className={index < course.completed ? course.color : ""}
                >
                  {index + 1}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default Courses

