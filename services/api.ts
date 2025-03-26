import { Course } from "@/types/course"
import { Teacher } from "@/types/teacher"
import type { Student, User } from "@/types/user"

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://aqtech-production.up.railway.app/api/user/list/")

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

// Fetch a specific user
export async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`https://aqtech-production.up.railway.app/api/user/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

export const addStudent = async (userId: number, studentData: { name: string; birthdate: string }) => {
  const response = await fetch(`https://aqtech-production.up.railway.app/api/students/add/${userId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    throw new Error("Failed to add student");
  }

  return await response.json();
};


// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch("/api/courses")

  if (!response.ok) {
    throw new Error("Failed to fetch courses")
  }

  return response.json()
}

// Enroll a student in a course
export async function enrollStudentInCourse(
  studentId: number,
  courseId: number,
): Promise<{ success: boolean; message: string; student: Student }> {
  const response = await fetch(`/api/students/${studentId}/enroll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to enroll student")
  }

  return response.json()
}

// Fetch all teachers
export async function fetchTeachers(): Promise<Teacher[]> {
  try {
    const response = await fetch("https://aqtech-production.up.railway.app/api/teachers")
    if (!response.ok) {
      throw new Error("Failed to fetch teachers")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching teachers:", error)
    throw error
  }
}

// Fetch a single teacher by ID
export async function fetchTeacher(id: number): Promise<Teacher> {
  try {
    const response = await fetch(`https://aqtech-production.up.railway.app/api/teachers/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch teacher")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching teacher:", error)
    throw error
  }
}

// Create a new teacher
export async function createTeacher(teacherData: { name: string; username: string }): Promise<Teacher> {
  try {
    const response = await fetch("https://aqtech-production.up.railway.app/api/teachers/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData),
    })
    if (!response.ok) {
      throw new Error("Failed to create teacher")
    }
    return await response.json()
  } catch (error) {
    console.error("Error creating teacher:", error)
    throw error
  }
}

// Add a session to a teacher
export async function addSessionToTeacher(
  teacherId: number,
  sessionData: {
    course: string
    session_date: string
    start_time: string
    end_time: string
    total_quota: string
  },
): Promise<void> {
  try {
    const response = await fetch(`https://aqtech-production.up.railway.app/api/teachers/${teacherId}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    })
    if (!response.ok) {
      throw new Error("Failed to add session")
    }
  } catch (error) {
    console.error("Error adding session:", error)
    throw error
  }
}

