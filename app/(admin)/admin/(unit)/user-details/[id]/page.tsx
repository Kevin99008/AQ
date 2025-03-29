"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Mail, Phone, Calendar, Plus, Trash2, User, Cake, Search, Filter } from "lucide-react"

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

// Sample user data
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
            { id: 1, name: "Emma Smith", birthdate: "2015-05-12" },
            { id: 2, name: "Noah Smith", birthdate: "2017-08-23" },
        ],
    },
    {
        id: 2,
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        phone: "(555) 234-5678",
        role: "parent",
        avatar: "/placeholder.svg?height=40&width=40",
        registeredDate: "2023-02-10",
        address: "456 Oak Ave, Somewhere, NY 67890",
        students: [{ id: 3, name: "Sofia Garcia", birthdate: "2016-03-18" }],
    },
    {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "(555) 345-6789",
        role: "parent",
        avatar: "/placeholder.svg?height=40&width=40",
        registeredDate: "2023-01-20",
        address: "789 Pine Rd, Elsewhere, TX 54321",
        students: [],
    },
    {
        id: 4,
        name: "Lisa Chen",
        email: "lisa.chen@example.com",
        phone: "(555) 456-7890",
        role: "parent",
        avatar: "/placeholder.svg?height=40&width=40",
        registeredDate: "2023-03-05",
        address: "101 Cedar Ln, Nowhere, FL 13579",
        students: [
            { id: 4, name: "William Chen", birthdate: "2014-11-05" },
            { id: 5, name: "Olivia Chen", birthdate: "2018-02-14" },
        ],
    },
]

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

    const params = use(props.params) // Correctly unwraps the Promise
    const id = params.id


    useEffect(() => {
        // Simulate API fetch
        const fetchUser = () => {
            const userId = Number.parseInt(id)
            const foundUser = users.find((u) => u.id === userId)

            if (foundUser) {
                setUser(foundUser)
            }
            setLoading(false)
        }

        fetchUser()
    }, [id])

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
                    <Button variant="outline" onClick={() => router.push("/admin/users")} className="mr-4">
                        Back to Users
                    </Button>
                    <h1 className="text-2xl font-bold">User Details</h1>
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <p className="text-center py-8">User not found.</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                        <Button onClick={() => router.push("/admin/users")} className="w-full">
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
                    <Button variant="outline" onClick={() => router.push("/admin/users")} className="mr-4">
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

                        <TabsContent value="enrollments" className="pt-4">
                            <h2 className="text-xl font-bold mb-4">Course Enrollments</h2>
                            <div className="text-center py-8 border rounded-md">
                                <p className="text-muted-foreground">No course enrollments found.</p>
                            </div>
                        </TabsContent>
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

