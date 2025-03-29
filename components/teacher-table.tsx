"use client"

import type React from "react"

import { useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { StatusConfirmDialog } from "@/components/status-confirm-dialog"

// Sample teacher data
const teachers = [
  {
    id: 1,
    name: "Sarah Johnson",
    category: "Aquakids",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Swimming Instructor",
    classes: [
      { id: 101, name: "Beginner Swimming", schedule: "Mon, Wed 4:00-5:00 PM", students: 8, level: "Beginner" },
      { id: 102, name: "Intermediate Swimming", schedule: "Tue, Thu 4:30-5:30 PM", students: 6, level: "Intermediate" },
      { id: 103, name: "Water Safety", schedule: "Fri 3:30-4:30 PM", students: 10, level: "All Levels" },
    ],
  },
  {
    id: 2,
    name: "Michael Chen",
    category: "Playsounds",
    email: "michael.chen@example.com",
    phone: "(555) 234-5678",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Piano Teacher",
    classes: [
      { id: 201, name: "Piano Basics", schedule: "Mon, Wed 3:00-4:00 PM", students: 5, level: "Beginner" },
      { id: 202, name: "Classical Piano", schedule: "Tue, Thu 5:00-6:00 PM", students: 4, level: "Intermediate" },
    ],
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    category: "Aquakids",
    email: "emily.rodriguez@example.com",
    phone: "(555) 345-6789",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Water Safety Instructor",
    classes: [
      { id: 301, name: "Toddler Swimming", schedule: "Sat 9:00-10:00 AM", students: 6, level: "Beginner" },
      { id: 302, name: "Parent-Child Swimming", schedule: "Sat 10:30-11:30 AM", students: 8, level: "Beginner" },
    ],
  },
  {
    id: 4,
    name: "David Kim",
    category: "Playsounds",
    email: "david.kim@example.com",
    phone: "(555) 456-7890",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Guitar Teacher",
    classes: [
      { id: 401, name: "Guitar Fundamentals", schedule: "Mon, Wed 4:00-5:00 PM", students: 7, level: "Beginner" },
      { id: 402, name: "Acoustic Guitar", schedule: "Tue, Thu 4:00-5:00 PM", students: 5, level: "Intermediate" },
      { id: 403, name: "Electric Guitar", schedule: "Fri 4:00-5:30 PM", students: 4, level: "Advanced" },
    ],
  },
  {
    id: 5,
    name: "Jessica Patel",
    category: "Other",
    email: "jessica.patel@example.com",
    phone: "(555) 567-8901",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Art Teacher",
    classes: [
      { id: 501, name: "Drawing Basics", schedule: "Mon 3:30-4:30 PM", students: 10, level: "Beginner" },
      { id: 502, name: "Watercolor Painting", schedule: "Wed 3:30-4:30 PM", students: 8, level: "Intermediate" },
      { id: 503, name: "Mixed Media Art", schedule: "Fri 3:30-5:00 PM", students: 6, level: "All Levels" },
    ],
  },
  {
    id: 6,
    name: "Robert Wilson",
    category: "Aquakids",
    email: "robert.wilson@example.com",
    phone: "(555) 678-9012",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Swim Coach",
    classes: [
      { id: 601, name: "Competitive Swimming", schedule: "Tue, Thu 5:30-7:00 PM", students: 12, level: "Advanced" },
    ],
  },
  {
    id: 7,
    name: "Amanda Lee",
    category: "Playsounds",
    email: "amanda.lee@example.com",
    phone: "(555) 789-0123",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Violin Teacher",
    classes: [
      { id: 701, name: "Violin for Beginners", schedule: "Mon, Wed 3:30-4:30 PM", students: 6, level: "Beginner" },
      { id: 702, name: "String Ensemble", schedule: "Fri 4:00-5:30 PM", students: 8, level: "Intermediate" },
    ],
  },
  {
    id: 8,
    name: "Thomas Brown",
    category: "Other",
    email: "thomas.brown@example.com",
    phone: "(555) 890-1234",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Dance Instructor",
    classes: [
      { id: 801, name: "Hip Hop Dance", schedule: "Tue, Thu 4:00-5:00 PM", students: 15, level: "Beginner" },
      { id: 802, name: "Contemporary Dance", schedule: "Mon, Wed 5:00-6:00 PM", students: 12, level: "Intermediate" },
    ],
  },
  {
    id: 9,
    name: "Sophia Martinez",
    category: "Aquakids",
    email: "sophia.martinez@example.com",
    phone: "(555) 901-2345",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Lifeguard Trainer",
    classes: [
      { id: 901, name: "Lifeguard Certification", schedule: "Sat, Sun 1:00-3:00 PM", students: 10, level: "Advanced" },
      { id: 902, name: "CPR Training", schedule: "Sat 10:00-12:00 PM", students: 15, level: "All Levels" },
    ],
  },
  {
    id: 10,
    name: "James Taylor",
    category: "Playsounds",
    email: "james.taylor@example.com",
    phone: "(555) 012-3456",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Drums Teacher",
    classes: [{ id: 1001, name: "Drum Basics", schedule: "Tue, Thu 3:30-4:30 PM", students: 5, level: "Beginner" }],
  },
]

interface TeacherTableProps {
  categoryFilter: string
  statusFilter: string
  searchQuery: string
  onViewDetails: (teacher: any) => void
}

export function TeacherTable({ categoryFilter, statusFilter, searchQuery, onViewDetails }: TeacherTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [teacherData, setTeacherData] = useState(teachers)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const itemsPerPage = 5

  // Prepare for status toggle
  const handleStatusToggleClick = (teacher: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTeacher(teacher)
    setStatusDialogOpen(true)
  }

  // Toggle teacher status after confirmation
  const confirmStatusToggle = () => {
    if (selectedTeacher) {
      setTeacherData((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, status: teacher.status === "active" ? "inactive" : "active" }
            : teacher,
        ),
      )
    }
    setStatusDialogOpen(false)
  }

  // Filter teachers based on selected filters and search query
  const filteredTeachers = teacherData.filter((teacher) => {
    const matchesCategory = categoryFilter === "all" || teacher.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || teacher.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesStatus && matchesSearch
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="cursor-pointer" onClick={() => onViewDetails(teacher)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {teacher.name}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.specialty}</TableCell>
                  <TableCell>{teacher.category}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={teacher.status === "active"}
                        onCheckedChange={() => {}}
                        onClick={(e) => handleStatusToggleClick(teacher, e)}
                      />
                      <div className="text-sm text-muted-foreground">
                        {teacher.status === "active" ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/teacher-details/${teacher.id}`)}>
                          Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No teachers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredTeachers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
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
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {selectedTeacher && (
        <StatusConfirmDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          teacher={selectedTeacher}
          onConfirm={confirmStatusToggle}
        />
      )}
    </>
  )
}

