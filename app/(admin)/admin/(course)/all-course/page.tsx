"use client"

import { useState, useEffect } from "react"
import { Search, Info, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Sample course data based on the provided model
const courses = [
  {
    id: 1,
    name: "Beginner Swimming",
    description:
      "Learn the basics of swimming in a fun and safe environment. Perfect for children who are new to swimming.",
    type: "restricted",
    min_age: 5,
    max_age: 8,
    quota: 10,
    created_at: "2023-01-15T10:00:00Z",
    price: 3500,
    category: "Aquakids",
    instructor: "Sarah Johnson",
    enrolled: 6,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 2,
    name: "Piano for Kids",
    description: "Introduction to piano for young children. Learn basic notes, rhythm, and simple songs.",
    type: "restricted",
    min_age: 6,
    max_age: 10,
    quota: 8,
    created_at: "2023-02-10T14:30:00Z",
    price: 4000,
    category: "Playsounds",
    instructor: "Michael Chen",
    enrolled: 5,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 3,
    name: "Advanced Swimming",
    description: "For children who already know basic swimming. Focus on improving technique and endurance.",
    type: "restricted",
    min_age: 8,
    max_age: 12,
    quota: 8,
    created_at: "2023-01-20T09:15:00Z",
    price: 3800,
    category: "Aquakids",
    instructor: "Emily Rodriguez",
    enrolled: 7,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 4,
    name: "Guitar Fundamentals",
    description: "Learn the basics of playing guitar including chords, strumming patterns, and simple songs.",
    type: "restricted",
    min_age: 7,
    max_age: 14,
    quota: 10,
    created_at: "2023-03-05T13:00:00Z",
    price: 3700,
    category: "Playsounds",
    instructor: "David Kim",
    enrolled: 8,
    image: "/placeholder.svg?height=200&width=350",
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
    instructor: "Jessica Patel",
    enrolled: 9,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 6,
    name: "Competitive Swimming",
    description: "Training for competitive swimming events. For experienced swimmers only.",
    type: "restricted",
    min_age: 10,
    max_age: 16,
    quota: 8,
    created_at: "2023-01-30T15:30:00Z",
    price: 4500,
    category: "Aquakids",
    instructor: "Robert Wilson",
    enrolled: 6,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 7,
    name: "Violin for Beginners",
    description: "Introduction to violin. Learn proper posture, basic notes, and simple melodies.",
    type: "restricted",
    min_age: 7,
    max_age: 12,
    quota: 6,
    created_at: "2023-03-15T10:30:00Z",
    price: 4200,
    category: "Playsounds",
    instructor: "Amanda Lee",
    enrolled: 4,
    image: "/placeholder.svg?height=200&width=350",
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
    instructor: "Thomas Brown",
    enrolled: 12,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 9,
    name: "Water Safety",
    description: "Essential water safety skills for children. Learn how to stay safe in and around water.",
    type: "restricted",
    min_age: 4,
    max_age: 10,
    quota: 10,
    created_at: "2023-01-25T09:00:00Z",
    price: 3300,
    category: "Aquakids",
    instructor: "Sophia Martinez",
    enrolled: 8,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 10,
    name: "Drum Basics",
    description: "Introduction to drums. Learn rhythm, basic beats, and coordination.",
    type: "restricted",
    min_age: 8,
    max_age: 15,
    quota: 6,
    created_at: "2023-03-10T14:00:00Z",
    price: 3900,
    category: "Playsounds",
    instructor: "James Taylor",
    enrolled: 3,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 11,
    name: "Parent-Child Swimming",
    description:
      "Swimming lessons for parents and young children together. Build water confidence in a fun environment.",
    type: "restricted",
    min_age: 1,
    max_age: 4,
    quota: 8,
    created_at: "2023-02-05T11:00:00Z",
    price: 4000,
    category: "Aquakids",
    instructor: "Emma Wilson",
    enrolled: 6,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 12,
    name: "Music Theory for Kids",
    description: "Introduction to music theory concepts in a fun and engaging way for children.",
    type: "restricted",
    min_age: 7,
    max_age: 12,
    quota: 10,
    created_at: "2023-03-20T13:30:00Z",
    price: 3600,
    category: "Playsounds",
    instructor: "Daniel Park",
    enrolled: 4,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 13,
    name: "Teen Swim Club",
    description: "Swimming club for teenagers to improve technique and fitness in a social environment.",
    type: "restricted",
    min_age: 13,
    max_age: 17,
    quota: 12,
    created_at: "2023-02-15T14:00:00Z",
    price: 4200,
    category: "Aquakids",
    instructor: "James Thompson",
    enrolled: 9,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 14,
    name: "Ukulele for Beginners",
    description: "Learn to play the ukulele with simple chords and fun songs. Perfect for beginners.",
    type: "restricted",
    min_age: 8,
    max_age: 14,
    quota: 8,
    created_at: "2023-03-25T10:00:00Z",
    price: 3500,
    category: "Playsounds",
    instructor: "Olivia Garcia",
    enrolled: 5,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 15,
    name: "Creative Writing",
    description: "Develop creative writing skills through fun exercises and storytelling techniques.",
    type: "unrestricted",
    min_age: null,
    max_age: null,
    quota: 10,
    created_at: "2023-02-28T09:30:00Z",
    price: 3300,
    category: "Other",
    instructor: "Nathan Lee",
    enrolled: 6,
    image: "/placeholder.svg?height=200&width=350",
  },
]

// Popular categories
const popularCategories = [
  "Swimming Basics",
  "Advanced Swimming",
  "Water Safety",
  "Piano Lessons",
  "Guitar Lessons",
  "Violin Classes",
  "Drum Lessons",
  "Art & Crafts",
  "Dance Classes",
  "Music Theory",
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter.toLowerCase()

    const matchesType = typeFilter === "all" || course.type === typeFilter

    // Age filter logic
    const matchesAge =
      !ageFilter ||
      course.type === "unrestricted" ||
      (course.min_age !== null && course.max_age !== null && ageFilter >= course.min_age && ageFilter <= course.max_age)

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
    } else if (sortBy === "availability") {
      return b.quota - b.enrolled - (a.quota - a.enrolled)
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
  }, [searchQuery, categoryFilter, typeFilter, ageFilter, sortBy])

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

      {/* Popular categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {popularCategories.map((category, index) => (
            <Link
              key={index}
              href={`/courses?search=${encodeURIComponent(category)}`}
              className="border border-gray-300 hover:border-gray-400 rounded-md p-3 text-center text-sm transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="aquakids">Aquakids</SelectItem>
              <SelectItem value="playsounds">Playsounds</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <h3 className="font-semibold mb-3">Filter by Age</h3>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Enter age"
                min={1}
                max={18}
                value={ageFilter || ""}
                onChange={(e) => setAgeFilter(e.target.value ? Number.parseInt(e.target.value) : null)}
                className="w-full"
              />
              {ageFilter && (
                <Button variant="outline" size="sm" onClick={() => setAgeFilter(null)} className="w-full mt-2">
                  Clear Age Filter
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-2">Enter a specific age to find suitable courses</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Category</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="category-aquakids"
                  checked={categoryFilter === "aquakids" || categoryFilter === "all"}
                  onCheckedChange={(checked) => setCategoryFilter(checked ? "aquakids" : "all")}
                  className="mr-2"
                />
                <label htmlFor="category-aquakids">Aquakids</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="category-playsounds"
                  checked={categoryFilter === "playsounds" || categoryFilter === "all"}
                  onCheckedChange={(checked) => setCategoryFilter(checked ? "playsounds" : "all")}
                  className="mr-2"
                />
                <label htmlFor="category-playsounds">Playsounds</label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="category-other"
                  checked={categoryFilter === "other" || categoryFilter === "all"}
                  onCheckedChange={(checked) => setCategoryFilter(checked ? "other" : "all")}
                  className="mr-2"
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
                  src={course.image || "/placeholder.svg"}
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
                  <p className="text-xs text-muted-foreground mb-2">Instructor: {course.instructor}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                    {course.type === "restricted" ? (
                      <div className="flex items-center">
                        <span className="font-medium">Age Range:</span>
                        <span className="ml-1">
                          {/* Display age in months if less than 12 months */}
                          {course.min_age !== null && course.min_age < 12
                            ? `${course.min_age} months`
                            : course.min_age !== null
                              ? `${Math.floor(course.min_age / 12)} years`
                              : "N/A"}{" "}
                          -
                          {course.max_age !== null && course.max_age < 12
                            ? `${course.max_age} months`
                            : course.max_age !== null
                              ? `${Math.floor(course.max_age / 12)} years`
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
                      <span className="font-medium">Availability:</span>
                      <span className="ml-1">
                        {course.quota - course.enrolled} of {course.quota} spots left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">₹{course.price}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/all-course/${course.id}`}>View Details</Link>
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

