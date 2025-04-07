"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Clock, Calendar, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"

type Student = {
  id: number;
  name: string;
  birthdate: string; // or Date if you'll parse it
  username: string;
  avatar: string;
}


// แก้ไขฟังก์ชัน calculateAge เพื่อคำนวณอายุเป็นเดือนด้วย
const calculateAge = (birthdate: string): { years: number; months: number } => {
  const today = new Date()
  const birthDate = new Date(birthdate)

  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--
    months += 12
  }

  // ปรับค่าเดือนถ้าวันที่ปัจจุบันน้อยกว่าวันเกิด
  if (today.getDate() < birthDate.getDate()) {
    months--
    if (months < 0) {
      months += 12
    }
  }

  return { years, months }
}

// แก้ไขฟังก์ชัน isStudentInAgeRange เพื่อให้ตรวจสอบอายุตามเงื่อนไขที่ต้องการ
const isStudentInAgeRange = (birthdate: string, minAge: number | null, maxAge: number | null): boolean => {
  // ถ้าไม่มีการจำกัดอายุ ให้ผ่านเลย
  if (minAge === null && maxAge === null) return true

  const age = calculateAge(birthdate)
  const ageInMonths = age.years * 12 + age.months

  // ตรวจสอบช่วงอายุ - ปรับปรุงตามความต้องการใหม่
  let isAboveMinAge = true
  let isBelowMaxAge = true

  // ตรวจสอบอายุขั้นต่ำ
  if (minAge !== null) {
    if (minAge >= 12) {
      // ถ้า minAge มากกว่าหรือเท่ากับ 12 เดือน (1 ปี) ให้ตรวจสอบแบบปีเท่านั้น
      isAboveMinAge = age.years >= Math.floor(minAge / 12)
    } else {
      // ถ้า minAge น้อยกว่า 12 เดือน ให้ตรวจสอบแบบเดือน
      isAboveMinAge = ageInMonths >= minAge
    }
  }

  // ตรวจสอบอายุสูงสุด
  if (maxAge !== null) {
    if (maxAge >= 12) {
      // ถ้า maxAge มากกว่าหรือเท่ากับ 12 เดือน (1 ปี) ให้ตรวจสอบแบบปีเท่านั้น
      // เพิ่ม 1 ปีเพื่อให้รวมถึงปีสุดท้าย (เช่น 2 ปี = ถึง 2 ปี 11 เดือน)
      isBelowMaxAge = age.years <= Math.floor(maxAge / 12)
    } else {
      // ถ้า maxAge น้อยกว่า 12 เดือน ให้ตรวจสอบแบบเดือน
      isBelowMaxAge = ageInMonths <= maxAge
    }
  }

  return isAboveMinAge && isBelowMaxAge
}

// แก้ไขฟังก์ชัน formatAge เพื่อแสดงอายุในรูปแบบที่เหมาะสม
const formatAge = (birthdate: string): string => {
  const age = calculateAge(birthdate)

  if (age.years === 0) {
    return `${age.months} month${age.months !== 1 ? "s" : ""}`
  } else if (age.months === 0) {
    return `${age.years} year${age.years !== 1 ? "s" : ""}`
  } else {
    return `${age.years} year${age.years !== 1 ? "s" : ""} ${age.months} month${age.months !== 1 ? "s" : ""}`
  }
}

interface StudentSelectionProps {
  course: any
  onComplete: (students: any[]) => void
  onBack: () => void
}

export default function StudentSelection({ course, onComplete, onBack }: StudentSelectionProps) {
  // แก้ไขส่วนของ state และฟังก์ชันการค้นหา
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [usernameTags, setUsernameTags] = useState<string[]>([])
  const [usernameInput, setUsernameInput] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<typeof students>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchStudent = async () => {
    try {
      const response = await apiFetch<Student[]>("/api/new/courses/student-enroll/")
      if (response !== TOKEN_EXPIRED) {
        setStudents(response)
      }
    } catch (err: any) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchStudent()
  }, [])
  // แก้ไขส่วนของ useEffect ให้แยกเป็นสองส่วน
  // useEffect แรกสำหรับกรองตามอายุเมื่อ course เปลี่ยน
  useEffect(() => {
    setIsLoading(true)
    // กรองนักเรียนตามอายุถ้าคอร์สเป็นแบบ restricted
    const studentsFilteredByAge =
      course.type === "restricted"
        ? students.filter((student) => isStudentInAgeRange(student.birthdate, course.min_age, course.max_age))
        : students

    setFilteredStudents(studentsFilteredByAge)
    setIsLoading(false)
  }, [course, students])

  // useEffect ที่สองสำหรับกรองตามคำค้นหาและ username tags
  // โดยเริ่มจากรายการที่กรองตามอายุแล้ว
  useEffect(() => {
    setIsLoading(true)
    // เริ่มจากนักเรียนที่ผ่านการกรองตามอายุแล้ว
    let filtered =
      course.type === "restricted"
        ? students.filter((student) => isStudentInAgeRange(student.birthdate, course.min_age, course.max_age))
        : students

    // กรองตาม username tags ถ้ามี - แก้ไขให้ตรงตัวมากขึ้น
    if (usernameTags.length > 0) {
      filtered = filtered.filter((student) =>
        usernameTags.some((tag) => {
          // ตรวจสอบว่า username ตรงกับ tag หรือไม่ (แบบตรงตัว)
          return (
            student.username === tag ||
            // หรือเริ่มต้นด้วย tag ตามด้วยอักขระที่ไม่ใช่ตัวเลขหรือตัวอักษร
            student.username.startsWith(tag + " ") ||
            student.username.startsWith(tag + "_") ||
            student.username.startsWith(tag + "-") ||
            // หรือเป็น tag ทั้งหมด
            student.username === tag
          )
        }),
      )
    }

    // กรองตามคำค้นหา
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // เพิ่มนักเรียนที่ถูกเลือกแล้วเข้าไปในรายการเสมอ
    const selectedStudentObjects = students.filter((student) => selectedStudents.includes(student.id))
    const filteredIds = filtered.map((student) => student.id)
    const missingSelectedStudents = selectedStudentObjects.filter((student) => !filteredIds.includes(student.id))

    // รวมรายการนักเรียนที่ผ่านการกรองและนักเรียนที่ถูกเลือกแล้ว
    filtered = [...filtered, ...missingSelectedStudents]

    // ลบรายการซ้ำ
    filtered = filtered.filter((student, index, self) => index === self.findIndex((s) => s.id === student.id))

    setFilteredStudents(filtered)
    setIsLoading(false)
  }, [searchQuery, usernameTags, course, students, selectedStudents])

  const handleStudentToggle = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleComplete = () => {
    const selectedStudentObjects = students.filter((student) => selectedStudents.includes(student.id))
    onComplete(selectedStudentObjects)
  }

  // เพิ่ม username เป็น tag
  const addUsernameTag = () => {
    if (usernameInput && !usernameTags.includes(usernameInput)) {
      setUsernameTags([...usernameTags, usernameInput])
      setUsernameInput("")
    }
  }

  // ลบ username tag
  const removeUsernameTag = (tag: string) => {
    setUsernameTags(usernameTags.filter((t) => t !== tag))
  }

  // จัดการการกด Enter ในช่อง input username
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addUsernameTag()
    }
  }

  // แสดงข้อความช่วงอายุที่กำหนด
  const getAgeRangeText = () => {
    if (course.type !== "restricted") return "All ages welcome"

    const minAgeText =
      course.min_age !== null
        ? course.min_age < 12
          ? `${course.min_age} months`
          : `${Math.floor(course.min_age / 12)} year${Math.floor(course.min_age / 12) !== 1 ? "s" : ""}`
        : null

    const maxAgeText =
      course.max_age !== null
        ? course.max_age < 12
          ? `${course.max_age} months`
          : `${Math.floor(course.max_age / 12)} year${Math.floor(course.max_age / 12) !== 1 ? "s" : ""}`
        : null

    if (minAgeText !== null && maxAgeText !== null) {
      return `${minAgeText} - ${maxAgeText}`
    } else if (minAgeText !== null) {
      return `${minAgeText} and older`
    } else if (maxAgeText !== null) {
      return `Up to ${maxAgeText}`
    }

    return "No age restriction"
  }


  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl">{course.name}</CardTitle>
              <CardDescription>{course.code}</CardDescription>
              <div className="flex items-center mt-2 gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration} per session
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {course.totalSessions} sessions total
                </Badge>
                {course.type === "restricted" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getAgeRangeText()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Select one or more students</h3>

          {/* เพิ่มส่วนค้นหาและ username tags */}
          <div className="mb-6 space-y-4">
            {/* ช่องค้นหา */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or username..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* ช่องเพิ่ม username tag */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-2.5 text-muted-foreground">@</span>
                <Input
                  type="text"
                  placeholder="Add username tag..."
                  className="pl-8"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button variant="outline" onClick={addUsernameTag} disabled={!usernameInput}>
                Add Tag
              </Button>
            </div>

            {/* แสดง username tags */}
            {usernameTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {usernameTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    @{tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeUsernameTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {usernameTags.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setUsernameTags([])}>
                    Clear all
                  </Button>
                )}
              </div>
            )}

            {/* แสดงจำนวนผลลัพธ์ */}
            <div className="text-sm text-muted-foreground">{filteredStudents.length} students found</div>

            {/* แสดงข้อความเกี่ยวกับการกรองตามอายุ */}
            {course.type === "restricted" && (
              <div className="text-sm p-2 bg-amber-50 border border-amber-200 rounded-md">
                <span className="font-medium">Note:</span> Only showing students in the age range: {getAgeRangeText()}
              </div>
            )}
          </div>

          {/* เปลี่ยนจาก div ธรรมดาเป็น div ที่มีความสูงจำกัดและมี scrolling */}
          <div className="max-h-[400px] overflow-y-auto pr-2 mb-4">
            <div className="bg-gray-50 rounded-lg shadow-sm">
              <div className="py-3 px-4 font-medium text-gray-700 bg-gray-100 border-b">Top Students</div>
              <div className="divide-y">
                {filteredStudents.map((student, index) => {
                  const isSelected = selectedStudents.includes(student.id)
                  return (
                    <div
                      key={student.id}
                      className={`px-4 py-3 flex items-center cursor-pointer transition-all ${isSelected
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                        }`}
                      onClick={() => handleStudentToggle(student.id)}
                    >
                      <div className="w-8 text-gray-500 font-medium">{index + 1}.</div>
                      <Avatar className="h-10 w-10 mr-3 ring-2 ring-gray-100">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {student.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-800">{student.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500">{formatAge(student.birthdate)}</div>
                          <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                            @{student.username}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={isSelected}
                          className={`mr-2 ${isSelected ? "text-primary" : ""}`}
                          onClick={(e) => e.stopPropagation()}
                          onCheckedChange={() => handleStudentToggle(student.id)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {filteredStudents.length === 0 && !isLoading && (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No students found matching your search criteria</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setUsernameTags([])
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleComplete} disabled={selectedStudents.length === 0}>
            Continue to Scheduling
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

