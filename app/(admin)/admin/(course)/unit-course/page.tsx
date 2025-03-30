"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample course data based on the provided model
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description: "Learn the basics of swimming in a fun and safe environment.",
    type: "restricted",
    min_age: 5,
    max_age: 8,
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    instructor: "Sarah Johnson",
    enrolled: 6,
    teachers: [
      { id: 1, name: "Sarah Johnson", email: "sarah.johnson@example.com" },
      { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@example.com" },
    ],
  },
  {
    id: 2,
    name: "Piano for Kids",
    description: "Introduction to piano for young children.",
    type: "restricted",
    min_age: 6,
    max_age: 10,
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    instructor: "Michael Chen",
    enrolled: 5,
    teachers: [{ id: 2, name: "Michael Chen", email: "michael.chen@example.com" }],
  },
  {
    id: 3,
    name: "Advanced Swimming",
    description: "For children who already know basic swimming.",
    type: "restricted",
    min_age: 8,
    max_age: 12,
    quota: 8,
    created_at: "2023-01-20T09:15:00Z",
    price: 3800,
    category: "Aquakids",
    instructor: "Emily Rodriguez",
    enrolled: 7,
    teachers: [
      { id: 3, name: "Emily Rodriguez", email: "emily.rodriguez@example.com" },
      { id: 6, name: "Robert Wilson", email: "robert.wilson@example.com" },
    ],
  },
  {
    id: 4,
    name: "Guitar Fundamentals",
    description: "Learn the basics of playing guitar.",
    type: "restricted",
    min_age: 7,
    max_age: 14,
    quota: 10,
    created_at: "2023-03-05T13:00:00Z",
    price: 3700,
    category: "Playsounds",
    instructor: "David Kim",
    enrolled: 8,
    teachers: [{ id: 4, name: "David Kim", email: "david.kim@example.com" }],
  },
  {
    id: 5,
    name: "Art for Everyone",
    description: "Explore various art techniques.",
    type: "unrestricted",
    min_age: null,
    max_age: null,
    quota: 12,
    created_at: "2023-02-25T11:45:00Z",
    price: 3200,
    category: "Other",
    instructor: "Jessica Patel",
    enrolled: 9,
    teachers: [{ id: 5, name: "Jessica Patel", email: "jessica.patel@example.com" }],
  },
  {
    id: 6,
    name: "Competitive Swimming",
    description: "Training for competitive swimming events.",
    type: "restricted",
    min_age: 10,
    max_age: 16,
    quota: 8,
    created_at: "2023-01-30T15:30:00Z",
    price: 4500,
    category: "Aquakids",
    instructor: "Robert Wilson",
    enrolled: 6,
    teachers: [{ id: 6, name: "Robert Wilson", email: "robert.wilson@example.com" }],
  },
  {
    id: 7,
    name: "Violin for Beginners",
    description: "Introduction to violin.",
    type: "restricted",
    min_age: 7,
    max_age: 12,
    quota: 6,
    created_at: "2023-03-15T10:30:00Z",
    price: 4200,
    category: "Playsounds",
    instructor: "Amanda Lee",
    enrolled: 4,
    teachers: [{ id: 7, name: "Amanda Lee", email: "amanda.lee@example.com" }],
  },
  {
    id: 8,
    name: "Family Dance",
    description: "Fun dance class for the whole family.",
    type: "unrestricted",
    min_age: null,
    max_age: null,
    quota: 15,
    created_at: "2023-02-20T16:00:00Z",
    price: 3000,
    category: "Other",
    instructor: "Thomas Brown",
    enrolled: 12,
    teachers: [{ id: 8, name: "Thomas Brown", email: "thomas.brown@example.com" }],
  },
]

export default function CourseListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [courseData, setCourseData] = useState(courses)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<any>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter courses based on search query and category filter
  const filteredCourses = courseData.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage)

  // Handle delete course
  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (courseToDelete) {
      setCourseData((prevCourses) => prevCourses.filter((course) => course.id !== courseToDelete.id))
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Course Management</h1>
        </div>
        <Button asChild>
          <Link href="/admin/unit-course/create">
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="aquakids">Aquakids</SelectItem>
              <SelectItem value="playsounds">Playsounds</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quota</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Teachers</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCourses.length > 0 ? (
              paginatedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.category === "Aquakids"
                          ? "blue"
                          : course.category === "Playsounds"
                            ? "green"
                            : "secondary"
                      }
                    >
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.type === "restricted" ? (
                      <span>
                        Ages {course.min_age !== null ? course.min_age : "N/A"}-
                        {course.max_age !== null ? course.max_age : "N/A"}
                      </span>
                    ) : (
                      <span>All ages</span>
                    )}
                  </TableCell>
                  <TableCell>₹{course.price}</TableCell>
                  <TableCell>{course.quota}</TableCell>
                  <TableCell>{course.enrolled}</TableCell>
                  <TableCell>{course.teachers.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/unit-course/${course.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredCourses.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course "{courseToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

