"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define types for our data
interface ClassItem {
    id: number
    name: string
    schedule: string
    level: string
    students: number
}

interface Teacher {
    id: number
    name: string
    category: string
    email: string
    phone: string
    status: string
    avatar: string
    specialty: string
    classes: ClassItem[]
}

// This would typically come from an API call
const teachers: Teacher[] = [
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

export default function TeacherDetailsPage(props: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [loading, setLoading] = useState(true)

    // Unwrap params using React.use()
    const params = use(props.params)
    const id = params.id

    useEffect(() => {
        // Simulate API fetch
        const fetchTeacher = () => {
            const teacherId = Number.parseInt(id)
            const foundTeacher = teachers.find((t) => t.id === teacherId)

            if (foundTeacher) {
                setTeacher(foundTeacher)
            }
            setLoading(false)
        }

        fetchTeacher()
    }, [id])

    if (loading) {
        return (
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!teacher) {
        return (
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="flex items-center mb-6">
                    <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
                        Back to List
                    </Button>
                    <h1 className="text-2xl font-bold">Teacher Details</h1>
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <p className="text-center py-8">Teacher not found.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => router.push("/")} className="w-full">
                            Return to Teacher List
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex items-center mb-6">
                <Button variant="outline" onClick={() => router.push("/")} className="mr-4">
                    Back to List
                </Button>
                <h1 className="text-2xl font-bold">Teacher Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card>
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">{teacher.name}</CardTitle>
                        <CardDescription>{teacher.specialty}</CardDescription>
                        <Badge variant={teacher.status === "active" ? "green" : "secondary"} className="mt-2">
                            {teacher.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <div>{teacher.email}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                                <div>{teacher.phone}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                <div>{teacher.category}</div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                <div className="capitalize">{teacher.status}</div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => router.push("/admin/unit-teacher")} className="w-full">
                            Return to Teacher List
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                        <CardDescription>Classes currently taught by {teacher.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {teacher.classes && teacher.classes.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Class Name</TableHead>
                                        <TableHead>Schedule</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Students</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teacher.classes.map((classItem: ClassItem) => (
                                        <TableRow key={classItem.id}>
                                            <TableCell className="font-medium">{classItem.name}</TableCell>
                                            <TableCell>{classItem.schedule}</TableCell>
                                            <TableCell>{classItem.level}</TableCell>
                                            <TableCell>{classItem.students}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center py-8 text-muted-foreground">No classes assigned.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

