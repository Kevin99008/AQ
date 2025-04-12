"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { StatusConfirmDialog } from "@/components/adminComponent/teacherList/status-confirm-dialog"
import type { Teacher } from "@/types/teacher" // Import the Teacher type
import { fetchTeachers } from "@/services/api"

interface TeacherTableProps {
  categoryFilter: string
  statusFilter: string
  searchQuery: string
  onViewDetails: (teacher: any) => void
}

export function TeacherTable({ categoryFilter, statusFilter, searchQuery, onViewDetails }: TeacherTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [teacherData, setTeacherData] = useState<Teacher[]>([]) // Initialize as empty array of Teacher type
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const itemsPerPage = 5

  // Fetch teacher data when the component mounts
  useEffect(() => {
    const getTeachers = async () => {
      try {
        const teachers = await fetchTeachers() // Fetch teachers using fetchTeachers function
        setTeacherData(teachers.reverse()) // Reverse the array to show newest teachers first
      } catch (error) {
        console.error("Error fetching teachers:", error)
      }
    }

    getTeachers()
  }, []) // Empty dependency array ensures it runs only once when the component mounts

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
      teacher.contact.toLowerCase().includes(searchQuery.toLowerCase())

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
              <TableHead>Category</TableHead>
              <TableHead>Phone No.</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="cursor-pointer" onClick={() => onViewDetails(teacher)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {teacher.name}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.category}</TableCell>
                  <TableCell>{teacher.contact}</TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/teacher-details/${teacher.id}`)}>
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
