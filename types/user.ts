export interface Student {
  id: number
  name: string
  birthdate: string
  courses: string[]
}

export interface User {
  id: number
  name: string
  avatar: string
  role: string
  joinDate: string
  phone: string
  students: Student[]
}

