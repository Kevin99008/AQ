export interface CourseSession {
  courseName: string;  // courseName as a string
  // Other properties you might want to include from your session data
}

export interface Student {
  id: number;
  name: string;
  birthdate: string;
  sessions: CourseSession[];  // Array of CourseSession objects, not strings
}

export interface User {
  id: number;
  username: string;
  avatar: string;
  role: string;
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