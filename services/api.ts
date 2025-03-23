import { Course } from "@/types/course"
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
