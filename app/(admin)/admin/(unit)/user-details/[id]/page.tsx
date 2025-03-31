"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { Mail, Phone, Calendar, Plus, Trash2, User, Cake, Search, Filter, BookOpen, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Add this to the existing sample user data to include course sessions
const users = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        role: "parent",
        avatar: "/placeholder.svg?height=40&width=40",
        registeredDate: "2023-01-15",
        address: "123 Main St, Anytown, CA 12345",
        students: [
            {
                id: 1,
                name: "Emma Smith",
                birthdate: "2015-05-12",
                sessions: [
                    {
                        id: 101,
                        name: "Session #1001",
                        total_quota: 8,
                        course: {
                            id: 1,
                            name: "Beginner Swimming",
                            description: "Learn the basics of swimming in a fun and safe environment.",
                            type: "restricted",
                            min_age: 5,
                            max_age: 8,
                            quota: 10,
                            price: 3500,
                            category: "Aquakids",
                            schedule: "Monday, Wednesday 4:00-5:00 PM",
                            location: "Main Pool",
                            instructor: "Sarah Johnson",
                        },
                    },
                    {
                        id: 102,
                        name: "Session #1002",
                        total_quota: 10,
                        course: {
                            id: 3,
                            name: "Advanced Swimming",
                            description: "For children who already know basic swimming.",
                            type: "restricted",
                            min_age: 8,
                            max_age: 12,
                            quota: 8,
                            price: 3800,
                            category: "Aquakids",
                            schedule: "Tuesday, Thursday 5:00-6:00 PM",
                            location: "Olympic Pool",
                            instructor: "Emily Rodriguez",
                        },
                    },
                ],
            },
            {
                id: 2,
                name: "Noah Smith",
                birthdate: "2017-08-23",
                sessions: [
                    {
                        id: 103,
                        name: "Session #1003",
                        total_quota: 6,
                        course: {
                            id: 2,
                            name: "Piano for Kids",
                            description: "Introduction to piano for young children.",
                            type: "restricted",
                            min_age: 6,
                            max_age: 10,
                            quota: 8,
                            price: 4000,
                            category: "Playsounds",
                            schedule: "Tuesday, Thursday 3:30-4:30 PM",
                            location: "Music Room 2",
                            instructor: "Michael Chen",
                        },
                    },
                ],
            },
        ],
    },
    // Keep other user data as is
    {
        id: 2,
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        phone: "(555) 234-5678",
        role: "parent",
        avatar: "/placeholder.svg?height=40&width=40",
        registeredDate: "2023-02-10",
        address: "456 Oak Ave, Somewhere, NY 67890",
        students: [
            {
                id: 3,
                name: "Sofia Garcia",
                birthdate: "2016-03-18",
                sessions: [
                    {
                        id: 104,
                        name: "Session #1004",
                        total_quota: 8,
                        course: {
                            id: 7,
                            name: "Violin for Beginners",
                            description: "Introduction to violin.",
                            type: "restricted",
                            min_age: 7,
                            max_age: 12,
                            quota: 6,
                            price: 4200,
                            category: "Playsounds",
                            schedule: "Monday, Wednesday 3:30-4:30 PM",
                            location: "Music Room 1",
                            instructor: "Amanda Lee",
                        },
                    },
                ],
            },
        ],
    },
    // Keep other users as is
]

// Update the UserDetailPage component to include the enrollment tab functionality
export default function UserDetailPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [newStudent, setNewStudent] = useState({ name: "", birthdate: "" })
    const [deleteStudentDialogOpen, setDeleteStudentDialogOpen] = useState(false)
    const [studentToDelete, setStudentToDelete] = useState<any>(null)

    // Student search and filter
    const [studentSearchQuery, setStudentSearchQuery] = useState("")
    const [ageRange, setAgeRange] = useState([0, 18])
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // New state for enrollment tab
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

    const params = use(props.params)
    const id = params.id

    useEffect(() => {
        // Simulate API fetch
        const fetchUser = () => {
            const userId = Number.parseInt(id)
            const foundUser = users.find((u) => u.id === userId)

            if (foundUser) {
                setUser(foundUser)
                // Set the first student as selected by default if available
                if (foundUser.students.length > 0) {
                    setSelectedStudentId(foundUser.students[0].id)
                }
            }
            setLoading(false)
        }

        fetchUser()
    }, [params.id])

    const handleAddStudent = () => {
        if (!newStudent.name || !newStudent.birthdate) return

        if (user) {
            // Create new student with generated ID
            const newStudentWithId = {
                id: Math.max(0, ...user.students.map((s: any) => s.id)) + 1,
                name: newStudent.name,
                birthdate: newStudent.birthdate,
            }

            // Add student to user
            const updatedUser = {
                ...user,
                students: [...user.students, newStudentWithId],
            }

            setUser(updatedUser)
            setNewStudent({ name: "", birthdate: "" }) // Reset form
        }
    }

    const handleDeleteStudent = (student: any) => {
        setStudentToDelete(student)
        setDeleteStudentDialogOpen(true)
    }

    const confirmDeleteStudent = () => {
        if (studentToDelete && user) {
            // Remove student from user
            const updatedUser = {
                ...user,
                students: user.students.filter((s: any) => s.id !== studentToDelete.id),
            }

            setUser(updatedUser)
            setDeleteStudentDialogOpen(false)
        }
    }

    // Calculate age for each student
    const calculateAge = (birthdate: string) => {
        const today = new Date()
        const birth = new Date(birthdate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }

        return age
    }

    // Filter students based on search query and age range
    const filteredStudents =
        user?.students.filter((student: any) => {
            const age = calculateAge(student.birthdate)
            const matchesSearch = student.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
            const matchesAgeRange = age >= ageRange[0] && age <= ageRange[1]

            return matchesSearch && matchesAgeRange
        }) || []

    // Add a function to get the selected student
    const getSelectedStudent = () => {
        if (!user || !selectedStudentId) return null
        return user.students.find((student: any) => student.id === selectedStudentId)
    }

    // Keep the rest of the component as is, but update the enrollments tab content

    // Update the TabsContent for enrollments
    const renderEnrollmentsTab = () => {
        const selectedStudent = getSelectedStudent()

        return (
            <TabsContent value="enrollments" className="pt-4">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Course Enrollments</h2>

                        {user && user.students.length > 0 ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Show enrollments for:</span>
                                <Select
                                    value={selectedStudentId?.toString() || ""}
                                    onValueChange={(value) => setSelectedStudentId(Number(value))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {user.students.map((student: any) => (
                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : null}
                    </div>

                    {selectedStudent ? (
                        selectedStudent.sessions && selectedStudent.sessions.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {selectedStudent.sessions.map((session: any) => (
                                    <Card key={session.id} className="overflow-hidden">
                                        <div
                                            className={`h-2 w-full ${session.course.category === "Aquakids"
                                                    ? "bg-blue-500"
                                                    : session.course.category === "Playsounds"
                                                        ? "bg-green-500"
                                                        : "bg-gray-500"
                                                }`}
                                        />
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle>{session.course.name}</CardTitle>
                                                    <p className="text-sm text-muted-foreground">{session.name}</p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        session.course.category === "Aquakids"
                                                            ? "blue"
                                                            : session.course.category === "Playsounds"
                                                                ? "green"
                                                                : "secondary"
                                                    }
                                                >
                                                    {session.course.category}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                    <span>Instructor: {session.course.instructor}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>Schedule: {session.course.schedule}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>Location: {session.course.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span>Total Quota: {session.total_quota}</span>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">₹{session.course.price}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.push(`/admin/courses/${session.course.id}`)}
                                                    >
                                                        View Course
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border rounded-md">
                                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No course enrollments found for {selectedStudent.name}.</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enroll this student in courses from the course management section.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-8 border rounded-md">
                            <p className="text-muted-foreground">Please select a student to view their enrollments.</p>
                        </div>
                    )}
                </div>
            </TabsContent>
        )
    }

    // Keep the rest of the component as is, but update the Tabs component to include the new enrollments tab content

    // In the return statement, replace the existing enrollments TabsContent with the new one
    if (loading) {
        return (
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex items-center mb-6">
                    <Button variant="outline" onClick={() => router.push("/admin/unit-user")} className="mr-4">
                        Back to Users
                    </Button>
                    <h1 className="text-2xl font-bold">User Details</h1>
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <p className="text-center py-8">User not found.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button onClick={() => router.push("/admin/unit-user")} className="w-full">
                            Return to User List
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Update the age calculation to show months for children under 1 year
    const formatAge = (birthdate: string) => {
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
                <div className="flex items-center">
                    <Button variant="outline" onClick={() => router.push("/admin/unit-user")} className="mr-4">
                        Back to Users
                    </Button>
                    <h1 className="text-2xl font-bold">User Details</h1>
                </div>
                <Button onClick={() => router.push(`/admin/users/${user.id}/edit`)}>Edit User</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile */}
                <Card>
                    {/* Replace the user avatar with an icon */}
                    <CardHeader className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <User className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Registered: {new Date(user.registeredDate).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-4 border-t">
                                <h3 className="font-medium mb-2">Address</h3>
                                <p className="text-sm">{user.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="students" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="students">Students</TabsTrigger>
                            <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="students" className="space-y-4 pt-4">
                            {/* Keep the existing students tab content */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Registered Students</h2>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm">
                                            <Plus className="h-4 w-4 mr-2" /> Add Student
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Student</DialogTitle>
                                            <DialogDescription>Add a student to this user's account.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Student Name</Label>
                                                <Input
                                                    id="name"
                                                    value={newStudent.name}
                                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                                    placeholder="Enter student name"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="birthdate">Birthdate</Label>
                                                <Input
                                                    id="birthdate"
                                                    type="date"
                                                    value={newStudent.birthdate}
                                                    onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleAddStudent} disabled={!newStudent.name || !newStudent.birthdate}>
                                                Add Student
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Search and filter */}
                            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search students..."
                                        className="pl-8"
                                        value={studentSearchQuery}
                                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                            <Filter className="h-4 w-4" />
                                            Age Filter: {ageRange[0]}-{ageRange[1]} years
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-4">
                                            {/* Update the filter to include months */}
                                            <h4 className="font-medium">Filter by Age Range</h4>
                                            <div className="px-1">
                                                <Slider
                                                    defaultValue={ageRange}
                                                    min={0}
                                                    max={18}
                                                    step={1}
                                                    value={ageRange}
                                                    onValueChange={setAgeRange}
                                                />
                                                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                                    <span>0 years</span>
                                                    <span>18 years</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Note: Children under 1 year will be shown in months
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <Button variant="outline" size="sm" onClick={() => setAgeRange([0, 18])}>
                                                    Reset
                                                </Button>
                                                <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                                                    Apply Filter
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {user.students.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Birthdate</TableHead>
                                                <TableHead>Age</TableHead>
                                                <TableHead className="w-[100px]">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student: any) => (
                                                    <TableRow key={student.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center">
                                                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                                                {student.name}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{new Date(student.birthdate).toLocaleDateString()}</TableCell>
                                                        {/* Replace the age display in the table to use the new formatAge function */}
                                                        <TableCell>{formatAge(student.birthdate)}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => handleDeleteStudent(student)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete</span>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        {studentSearchQuery || ageRange[0] > 0 || ageRange[1] < 18 ? (
                                                            <p className="text-muted-foreground">No students match your search criteria.</p>
                                                        ) : (
                                                            <p className="text-muted-foreground">No students registered yet.</p>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {filteredStudents.length === 0 && (studentSearchQuery || ageRange[0] > 0 || ageRange[1] < 18) && (
                                        <div className="flex justify-center mt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setStudentSearchQuery("")
                                                    setAgeRange([0, 18])
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 border rounded-md">
                                    <Cake className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No students registered yet.</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Click "Add Student" to register a student to this account.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Replace the existing enrollments tab with the new one */}
                        {renderEnrollmentsTab()}
                    </Tabs>
                </div>
            </div>

            {/* Delete Student Confirmation Dialog */}
            <AlertDialog open={deleteStudentDialogOpen} onOpenChange={setDeleteStudentDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {studentToDelete?.name} from this account? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteStudent} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

