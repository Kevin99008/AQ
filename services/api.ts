import type { Student, User } from "@/types/user"

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("http://localhost:8000/api/user/list/")

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

// Fetch a specific user
export async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`http://localhost:8000/api/user/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

// Add a new student to a user
export async function addStudent(userId: number, studentData: Omit<Student, "id" | "courses">): Promise<Student> {
  const response = await fetch(`/api/users/${userId}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  })

  if (!response.ok) {
    throw new Error("Failed to add student")
  }

  return response.json()
}

