"use client"

import { useState, useEffect } from "react"
import { Search, Info, Plus, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fetchCategories } from "@/services/api"

// Sample course data with teachers
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description:
      "Learn the basics of swimming in a fun and safe environment. Perfect for children who are new to swimming.",
    type: "restricted",
    min_age: 60, // 5 years in months
    max_age: 96, // 8 years in months
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [
      { id: 1, name: "Sarah Johnson", specialty: "Swimming Instructor" },
      { id: 3, name: "Emily Rodriguez", specialty: "Water Safety Instructor" },
    ],
  },
  {
    id: 2,
    name: "Piano for Kids",
    description: "Introduction to piano for young children. Learn basic notes, rhythm, and simple songs.",
    type: "restricted",
    min_age: 72, // 6 years in months
    max_age: 120, // 10 years in months
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 2, name: "Michael Chen", specialty: "Piano Teacher" }],
  },
  {
    id: 3,
    name: "Advanced Swimming",
    description: "For children who already know basic swimming. Focus on improving technique and endurance.",
    type: "restricted",
    min_age: 96, // 8 years in months
    max_age: 144, // 12 years in months
    quota: 8,
    created_at: "2023-01-20T09:15:00Z",
    price: 3800,
    category: "Aquakids",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [
      { id: 3, name: "Emily Rodriguez", specialty: "Water Safety Instructor" },
      { id: 6, name: "Robert Wilson", specialty: "Swim Coach" },
    ],
  },
  {
    id: 4,
    name: "Guitar Fundamentals",
    description: "Learn the basics of playing guitar including chords, strumming patterns, and simple songs.",
    type: "restricted",
    min_age: 84, // 7 years in months
    max_age: 168, // 14 years in months
    quota: 10,
    created_at: "2023-03-05T13:00:00Z",
    price: 3700,
    category: "Playsounds",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 4, name: "David Kim", specialty: "Guitar Teacher" }],
  },
  {
    id: 5,
    name: "Art for Everyone",
    description: "Explore various art techniques including drawing, painting, and mixed media. Open to all ages.",
    type: "unrestricted",
    min_age: null,
    max_age: null,
    quota: 12,
    created_at: "2023-02-25T11:45:00Z",
    price: 3200,
    category: "Other",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 5, name: "Jessica Patel", specialty: "Art Teacher" }],
  },
  {
    id: 6,
    name: "Competitive Swimming",
    description: "Training for competitive swimming events. For experienced swimmers only.",
    type: "restricted",
    min_age: 120, // 10 years in months
    max_age: 192, // 16 years in months
    quota: 8,
    created_at: "2023-01-30T15:30:00Z",
    price: 4500,
    category: "Aquakids",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 6, name: "Robert Wilson", specialty: "Swim Coach" }],
  },
  {
    id: 7,
    name: "Violin for Beginners",
    description: "Introduction to violin. Learn proper posture, basic notes, and simple melodies.",
    type: "restricted",
    min_age: 84, // 7 years in months
    max_age: 144, // 12 years in months
    quota: 6,
    created_at: "2023-03-15T10:30:00Z",
    price: 4200,
    category: "Playsounds",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 7, name: "Amanda Lee", specialty: "Violin Teacher" }],
  },
  {
    id: 8,
    name: "Family Dance",
    description: "Fun dance class for the whole family. Learn various dance styles together.",
    type: "unrestricted",
    min_age: null,
    max_age: null,
    quota: 15,
    created_at: "2023-02-20T16:00:00Z",
    price: 3000,
    category: "Other",
    image: "/placeholder.svg?height=200&width=350",
    teachers: [{ id: 8, name: "Thomas Brown", specialty: "Dance Instructor" }],
  },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [ageRange, setAgeRange] = useState([0, 18]) // Age range in years

  const [categories, setCategories] = useState<Array<{ id: string | number; categoryName: string }>>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories() // Fetch categories
        setCategories(fetchedCategories)
      } catch (error) {
        setCategoryError("Failed to load categories")
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teachers.some(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      )

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

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <Button asChild>
          <Link href="unit-course/create">
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
            {loadingCategories ? (
              <div className="text-sm text-muted-foreground">Loading categories...</div>
            ) : categoryError ? (
              <div className="text-sm text-red-500">{categoryError}</div>
            ) : (
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
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category.id}`}
                      name="category"
                      className="mr-2"
                      checked={categoryFilter === category.categoryName.toLowerCase()}
                      onChange={() => setCategoryFilter(category.categoryName.toLowerCase())}
                    />
                    <label htmlFor={`category-${category.id}`}>{category.categoryName}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course listings */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{sortedCourses.length} courses available</p>
          </div>

          {currentCourses.map((course) => (
            <div key={course.id} className="border rounded-md overflow-hidden flex flex-col md:flex-row">
              {/* <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div> */}
              <div className="w-6 bg-black"></div>
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
                      {course.teachers.map((teacher) => (
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
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                    {course.type === "restricted" ? (
                      <div className="flex items-center">
                        <span className="font-medium">Age Range:</span>
                        <span className="ml-1">
                          {/* Display age in years */}
                          {course.min_age !== null ? `${Math.floor(course.min_age / 12)} years` : "N/A"} -
                          {course.max_age !== null ? `${Math.floor(course.max_age / 12)} years` : "N/A"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium">Age Range:</span>
                        <span className="ml-1">All ages welcome</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">₹{course.price}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/unit-course/${course.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm">Enroll Now</Button>
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

