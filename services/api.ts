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

export const addStudent = async (userId: number, studentData: { name: string; birthdate: string }) => {
  const response = await fetch(`http://localhost:8000/api/students/add/${userId}/`, {
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


