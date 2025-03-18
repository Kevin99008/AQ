export interface Course {
  id: number
  name: string
  description: string
  category: string
  type: "AquaKids" | "Playsound" | "Other"
  duration: string
  startDate: string
}

export interface CourseRaw {
  id: number
  courseName: string
  description: string
  type: "AquaKids" | "Playsound" | "Other"
  quota: number
}
