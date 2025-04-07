"use client"

import { useState, useEffect } from "react"
import { Search, Info, Plus, Users, Clock, Calendar } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from 'react-toastify';

type Teacher = {
    id: number;
    name: string;
    contact: string;
    status: string
};

type Course = {
    id: number;
    name: string;
    description: string;
    type: string;
    min_age: number;
    max_age: number;
    quota: number;
    created_at: string; // ISO date string
    price: number;
    category: string;
    teachers: Teacher[];
};

// Default course metadata (for fields not in API)
const defaultCourseMetadata = {
    duration: "1 hour",
    code: "COURSE",
    image: "/placeholder.svg?height=200&width=350",
}

interface CoursesPageProps {
    onEnroll: (course: any) => void
}

export default function CoursesPage({ onEnroll }: CoursesPageProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [ageRange, setAgeRange] = useState([0, 18]) // Age range in years
    const [courses, setCourses] = useState<Course[]>([])
    useEffect(() => {
        const loadCourse = async () => {
            try {
                const coursesResponse = await apiFetch<Course[]>('/api/new/courses/enroll-list/')
                if (coursesResponse !== TOKEN_EXPIRED) {
                    setCourses(coursesResponse)
                }
            } catch (err: any) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        }
        loadCourse()
    }, [])
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Filter courses based on search query and filters
    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.teachers.some((teacher) => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter.toLowerCase()

        const matchesType = typeFilter === "all" || course.type === typeFilter

        // Age range filter logic
        const matchesAge =
            course.type === "unrestricted" || // Unrestricted courses match any age
            (course.min_age !== null &&
                course.max_age !== null &&
                ageRange[0] * 12 <= course.max_age &&
                ageRange[1] * 12 >= course.min_age) // Check for overlap in age ranges

        return matchesSearch && matchesCategory && matchesType && matchesAge
    })

    // Sort courses
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        } else if (sortBy === "price-low") {
            return a.price - b.price
        } else if (sortBy === "price-high") {
            return b.price - a.price
        }
        return 0
    })

    // Calculate total pages
    const totalPages = Math.ceil(sortedCourses.length / itemsPerPage)

    // Get current page data
    const currentCourses = sortedCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, categoryFilter, typeFilter, ageRange, sortBy])

    // Prepare course data for enrollment with default metadata
    const handleEnroll = (course: any) => {
        const enrichedCourse = {
            ...course,
            ...defaultCourseMetadata,
            totalSessions: course.quota, // Use quota as totalSessions
        }
        onEnroll(enrichedCourse)
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available Courses</h1>
                <Button asChild>
                    <Link href="/courses/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Course
                    </Link>
                </Button>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-500" />
                <p className="text-sm">Enroll now to secure your spot! Limited places available for each course.</p>
            </div>

            {/* Search bar at the top */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search courses or teachers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                {/* Sidebar filters */}
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Course Type</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="type-all"
                                    name="type"
                                    className="mr-2"
                                    checked={typeFilter === "all"}
                                    onChange={() => setTypeFilter("all")}
                                />
                                <label htmlFor="type-all">All Types</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="type-restricted"
                                    name="type"
                                    className="mr-2"
                                    checked={typeFilter === "restricted"}
                                    onChange={() => setTypeFilter("restricted")}
                                />
                                <label htmlFor="type-restricted">Age Restricted</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="type-unrestricted"
                                    name="type"
                                    className="mr-2"
                                    checked={typeFilter === "unrestricted"}
                                    onChange={() => setTypeFilter("unrestricted")}
                                />
                                <label htmlFor="type-unrestricted">No Age Restriction</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Age Range (Years)</h3>
                        <div className="space-y-4">
                            <Slider value={ageRange} min={0} max={18} step={1} onValueChange={setAgeRange} />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{ageRange[0]} years</span>
                                <span>{ageRange[1]} years</span>
                            </div>
                            <div className="flex justify-between">
                                <div className="space-y-1">
                                    <label htmlFor="min-age" className="text-xs">
                                        Min Age
                                    </label>
                                    <Input
                                        id="min-age"
                                        type="number"
                                        min={0}
                                        max={ageRange[1]}
                                        value={ageRange[0]}
                                        onChange={(e) => {
                                            const value = Number(e.target.value)
                                            if (!isNaN(value) && value >= 0 && value <= ageRange[1]) {
                                                setAgeRange([value, ageRange[1]])
                                            }
                                        }}
                                        className="w-20 h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="max-age" className="text-xs">
                                        Max Age
                                    </label>
                                    <Input
                                        id="max-age"
                                        type="number"
                                        min={ageRange[0]}
                                        max={18}
                                        value={ageRange[1]}
                                        onChange={(e) => {
                                            const value = Number(e.target.value)
                                            if (!isNaN(value) && value >= ageRange[0] && value <= 18) {
                                                setAgeRange([ageRange[0], value])
                                            }
                                        }}
                                        className="w-20 h-8"
                                    />
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setAgeRange([0, 18])} className="w-full">
                                Reset Age Range
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Category</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="category-all"
                                    name="category"
                                    className="mr-2"
                                    checked={categoryFilter === "all"}
                                    onChange={() => setCategoryFilter("all")}
                                />
                                <label htmlFor="category-all">All Categories</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="category-aquakids"
                                    name="category"
                                    className="mr-2"
                                    checked={categoryFilter === "aquakids"}
                                    onChange={() => setCategoryFilter("aquakids")}
                                />
                                <label htmlFor="category-aquakids">Aquakids</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="category-playsounds"
                                    name="category"
                                    className="mr-2"
                                    checked={categoryFilter === "playsounds"}
                                    onChange={() => setCategoryFilter("playsounds")}
                                />
                                <label htmlFor="category-playsounds">Playsounds</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="category-other"
                                    name="category"
                                    className="mr-2"
                                    checked={categoryFilter === "other"}
                                    onChange={() => setCategoryFilter("other")}
                                />
                                <label htmlFor="category-other">Other</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course listings */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">{sortedCourses.length} courses available</p>
                    </div>

                    {currentCourses.map((course) => (
                        <div key={course.id} className="border rounded-md overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 lg:w-1/4">
                                <img
                                    src={defaultCourseMetadata.image || "/placeholder.svg"}
                                    alt={course.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg mb-1">{course.name}</h3>
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
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>

                                    {/* Teacher list */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Teachers:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {course.teachers.slice(0, 4).map((teacher) => (
                                                <div
                                                    key={teacher.id}
                                                    className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
                                                >
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-[10px]">{teacher.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{teacher.name}</span>
                                                </div>
                                            ))}
                                            {course.teachers.length > 4 && (
                                                <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs">
                                                    <span>+{course.teachers.length - 4} more</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                                        {course.type === "restricted" ? (
                                            <div className="flex items-center">
                                                <span className="font-medium">Age Range:</span>
                                                <span className="ml-1">
                                                    {/* Display age in years */}
                                                    {course.min_age !== null
                                                        ? course.min_age < 12
                                                            ? `${course.min_age} months`
                                                            : `${Math.floor(course.min_age / 12)} year${Math.floor(course.min_age / 12) !== 1 ? "s" : ""}`
                                                        : "N/A"}{" "}
                                                    -
                                                    {course.max_age !== null
                                                        ? course.max_age < 12
                                                            ? `${course.max_age} months`
                                                            : `${Math.floor(course.max_age / 12)} year${Math.floor(course.max_age / 12) !== 1 ? "s" : ""}`
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span className="font-medium">Age Range:</span>
                                                <span className="ml-1">All ages welcome</span>
                                            </div>
                                        )}

                                        <div className="flex items-center">
                                            <span className="font-medium">Quota:</span>
                                            <span className="ml-1">{course.quota} students</span>
                                        </div>

                                        {/* Default metadata */}
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            <span>{defaultCourseMetadata.duration} per session</span>
                                        </div>

                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>{course.quota} sessions</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold">₹{course.price}</span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/courses/${course.id}`}>View Details</Link>
                                        </Button>
                                        <Button size="sm" onClick={() => handleEnroll(course)}>
                                            Enroll Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sortedCourses.length === 0 && (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {sortedCourses.length > 0 && (
                        <div className="flex items-center justify-between border-t pt-4">
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
            </div>
        </div>
    )
}

