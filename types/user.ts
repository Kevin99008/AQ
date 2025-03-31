import { EnrolledCourse } from "./course";

export interface Student {
  id: number;
  name: string;
  birthdate: string;
  sessions: EnrolledCourse[];  // Array of CourseSession objects, not strings
}

export interface User {
  id: number;
  username: string;
  role: string;
  first_name: string;
  last_name: string;
  join_date: string;
  contact: string;
  students: Student[];
}

export interface StudentRaw {
  id: number;
  name: string;
  birthdate: string;
  username: string
}

export interface TeacherRaw {
  id: number;
  name: string;
  username: string;
}

export interface StudentCertRaw {
  id: number;
  name: string;
  birthdate: string;
  username: string
  user_id: number
}