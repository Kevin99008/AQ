"use client"

import { useState } from "react"
import { Search, Plus, Eye, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Sample user data with a user having 3+ students
const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    role: "parent",
    registeredDate: "2023-01-15",
    students: [
      { id: 1, name: "Emma Smith", birthdate: "2015-05-12" },
      { id: 2, name: "Noah Smith", birthdate: "2017-08-23" },
      { id: 3, name: "Olivia Smith", birthdate: "2019-03-15" }, // Added third student
    ],
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "(555) 234-5678",
    role: "parent",
    registeredDate: "2023-02-10",
    students: [{ id: 4, name: "Sofia Garcia", birthdate: "2016-03-18" }],
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 345-6789",
    role: "parent",
    registeredDate: "2023-01-20",
    students: [],
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa.chen@example.com",
    phone: "(555) 456-7890",
    role: "parent",
    registeredDate: "2023-03-05",
    students: [
      { id: 5, name: "William Chen", birthdate: "2014-11-05" },
      { id: 6, name: "Olivia Chen", birthdate: "2018-02-14" },
      { id: 7, name: "James Chen", birthdate: "2020-06-22" },
      { id: 8, name: "Sophia Chen", birthdate: "2022-09-10" }, // Added more students
    ],
  },
]

export default function UserListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userData, setUserData] = useState(users)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [studentListOpen, setStudentListOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter users based on search query - including student names
  const filteredUsers = userData.filter((user) => {
    const matchesUserName = user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEmail = user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPhone = user.phone.includes(searchQuery)

    // Check if any student name matches the search query
    const matchesStudentName = user.students.some((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return matchesUserName || matchesEmail || matchesPhone || matchesStudentName
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const calculateAge = (birthdate: string) => {
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    // If less than 1 year old, show age in months
    if (age < 1) {
      let months = today.getMonth() - birth.getMonth()
      if (months < 0) {
        months += 12
      }
      if (today.getDate() < birth.getDate()) {
        months--
      }
      return `${months} months`
    }

    return `${age} years`
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" /> Create User
          </Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users or students..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{new Date(user.registeredDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {user.students.length}
                      </div>
                      {user.students.length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedUser(user)
                            setStudentListOpen(true)
                          }}
                          className="flex flex-col hover:text-blue-600 transition-colors"
                        >
                          <span className="text-xs text-muted-foreground">
                            {user.students
                              .map((s) => s.name)
                              .slice(0, 2)
                              .join(", ")}
                            {user.students.length > 2 && (
                              <span className="font-medium text-blue-600"> +{user.students.length - 2} more</span>
                            )}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No students</span>
                      )}
                    </div>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/user-details/${user.id}`)}>
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredUsers.length > 0 && (
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

      {selectedUser && (
        <Dialog open={studentListOpen} onOpenChange={setStudentListOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Students for {selectedUser.name}</DialogTitle>
              <DialogDescription>
                {selectedUser.students.length} student{selectedUser.students.length !== 1 ? "s" : ""} registered
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedUser.students.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.students.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(student.birthdate).toLocaleDateString()} ({calculateAge(student.birthdate)})
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStudentListOpen(false)
                          router.push(`/admin/users/${selectedUser.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No students registered</p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setStudentListOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

