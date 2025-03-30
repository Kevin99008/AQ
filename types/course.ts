import { Teacher } from "./teacher"

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

export interface CoursePriceRaw {
  id: number
  courseName: string
  description: string
  type: "AquaKids" | "Playsound" | "Other"
  quota: number
  price: number
}

export interface ClassRaw {
  id: number; // id should be of type number, not a fixed value
  title: string;
  date: string; // Date in "YYYY-MM-DD" format
  startTime: string; // Time in "HH:mm:ss" format
  endTime: string; // Time in "HH:mm:ss" format
  instructor: string;
  student: string;
  color: string; // Class name for styling purposes
}

export interface AttendanceRaw {
  id: number;
  status: string;
  session_id: number;
  session_date: string; // Date in "YYYY-MM-DD" format
  course_id: number;
  course_name: string;
  teacher_id: number;
  teacher_name: string;
  student_id: number;
  student_name: string;
  attendance_date: string; // Date in "YYYY-MM-DD" format
  start_time: string; // Time in "HH:mm:ss" format
  end_time: string; // Time in "HH:mm:ss" format
  is_owner: boolean;
}

export interface EnrolledCourse{
  id: number;
  name: string;
  description: string;
  type: string;
  min_age: number;
  max_age: number;
  quota: number;
  created_at: string;
  price: number;
  category: string;
  enrolled: number;
  teachers: Teacher[]; // You can replace `any` with a more specific type if needed
}