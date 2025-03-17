export interface Course {
  id: number
  name: string
  description: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  startDate: string
}

