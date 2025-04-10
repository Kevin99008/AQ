"use client"

import type React from "react"

import { Search, Filter, Droplets, Music, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CourseSelectorProps {
  courses: any[]
  categories: any[]
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTypes: string[]
  onToggleType: (type: string) => void
  onSelectCourse: (course: any) => void
  loadingCategories: boolean
}

export function CourseSelector({
  courses,
  categories,
  searchQuery,
  onSearchChange,
  selectedTypes,
  onToggleType,
  onSelectCourse,
  loadingCategories,
}: CourseSelectorProps) {
  // Get category name from category ID
  function getCategoryName(categoryId: number, categories: any[]): string {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.categoryName : "Other"
  }

  // Get category icon based on category name
  function getCategoryIcon(categoryName: string): React.ReactNode {
    switch (categoryName.toLowerCase()) {
      case "aquakids":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "playsound":
        return <Music className="h-4 w-4 text-orange-500" />
      default:
        return <Sparkles className="h-4 w-4 text-pink-500" />
    }
  }

  // Get dynamic styling for a category
  function getCategoryStyles(categoryName: string) {
    const lowerCaseName = categoryName.toLowerCase()

    if (lowerCaseName === "aquakids") {
      return {
        borderColor: "border-blue-400",
        bgColor: "bg-gradient-to-r from-blue-50 to-transparent",
        badgeColor: "bg-blue-100 text-blue-700",
        textColor: "text-blue-700",
      }
    } else if (lowerCaseName === "playsound") {
      return {
        borderColor: "border-orange-400",
        bgColor: "bg-gradient-to-r from-orange-50 to-transparent",
        badgeColor: "bg-orange-100 text-orange-700",
        textColor: "text-orange-700",
      }
    } else {
      return {
        borderColor: "border-pink-400",
        bgColor: "bg-gradient-to-r from-pink-50 to-transparent",
        badgeColor: "bg-pink-100 text-pink-700",
        textColor: "text-pink-700",
      }
    }
  }

  // Filter courses based on search query and selected types
  const filteredCourses = courses.filter(
    (course) =>
      (course.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) &&
      (selectedTypes.includes(getCategoryName(course.category, categories)) || selectedTypes.length === 0),
  )

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {loadingCategories ? (
              <div className="px-2 py-1 text-sm">Loading categories...</div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category.id}
                  checked={selectedTypes.includes(category.categoryName)}
                  onCheckedChange={() => onToggleType(category.categoryName)}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category.categoryName)}
                    <span className={getCategoryStyles(category.categoryName).textColor}>{category.categoryName}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="px-2 py-1 text-sm">No categories available</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">No courses found matching your criteria</div>
        ) : (
          filteredCourses.map((course) => {
            const categoryName = getCategoryName(course.category, categories)
            const styles = getCategoryStyles(categoryName)

            return (
              <div
                key={course.id}
                className={cn(
                  "p-3 border border-l-4 rounded-md cursor-pointer transition-colors",
                  styles.borderColor,
                  styles.bgColor,
                  "hover:bg-muted/50 group",
                )}
                onClick={() => onSelectCourse(course)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(categoryName)}
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{course.name}</h3>
                      <Badge className={cn("text-xs font-medium", styles.badgeColor)}>{categoryName}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground ml-6">{course.description}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground ml-6">
                  <span>Type: {course.type === "restricted" ? "Age Restricted" : "All Ages"}</span>
                  <span>Quota: {course.quota} students</span>
                  <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

