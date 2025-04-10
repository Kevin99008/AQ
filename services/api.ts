import { Course } from "@/types/course";
import { Teacher } from "@/types/teacher";
import type { Student, User } from "@/types/user";
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"; // Import the apiFetch function

// Fetch all users
export async function fetchUsers(): Promise<User[]> {
  const users = await apiFetch<User[]>("/api/user/list/");
  if (users === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return users;
}

// Fetch a specific user
export async function fetchUser(userId: number): Promise<User> {
  const user = await apiFetch<User>(`/api/user/${userId}`);
  if (user === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return user;
}

// Add a student
export const addStudent = async (
  userId: number,
  studentData: { name: string; birthdate: string }
) => {
  const student = await apiFetch<{
    id: { success: boolean; student: Student; }; success: boolean; student: Student 
}>(
    `/api/students/add/${userId}/`,
    "POST",
    studentData
  );
  if (student === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return student;
};

// Fetch all courses
export async function fetchCourses(): Promise<Course[]> {
  const courses = await apiFetch<Course[]>("/api/courses");
  if (courses === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return courses;
}

// Enroll a student in a course
export async function enrollStudentInCourse(
  studentId: number,
  courseId: number
): Promise<{ success: boolean; message: string; student: Student }> {
  const enrollment = await apiFetch<{ success: boolean; message: string; student: Student }>(
    `/api/students/${studentId}/enroll`,
    "POST",
    { courseId }
  );
  if (enrollment === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return enrollment;
}

// Fetch all teachers
export async function fetchTeachers(): Promise<Teacher[]> {
  const teachers = await apiFetch<Teacher[]>("/api/teachers");
  if (teachers === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return teachers;
}

// Fetch a single teacher by ID
export async function fetchTeacher(id: number): Promise<Teacher> {
  const teacher = await apiFetch<Teacher>(`/api/teachers/${id}`);
  if (teacher === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return teacher;
}

// Create a new teacher
export async function createTeacher(teacherData: { name: string; username: string }): Promise<Teacher> {
  const teacher = await apiFetch<Teacher>("/api/teachers/create/", "POST", teacherData);
  if (teacher === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return teacher;
}

// Add a session to a teacher
export async function addSessionToTeacher(
  teacherId: number,
  sessionData: {
    course: string;
    session_date: string;
    start_time: string;
    end_time: string;
    total_quota: string;
  }
): Promise<void> {
  const session = await apiFetch<void>(`/api/teachers/${teacherId}/sessions`, "POST", sessionData);
  if (session === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
}

// Update teacher status
export async function updateTeacherStatus(teacherId: number, newStatus: string): Promise<void> {
  const statusUpdate = await apiFetch<void>(
    `/api/teachers/status/${teacherId}/`,
    "PATCH",
    { status: newStatus }
  );
  if (statusUpdate === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
}

// Fetch categories
export async function fetchCategories() {
  const categories = await apiFetch<any>("/api/categories/");
  if (categories === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return categories;
}

// Fetch enrolled courses
export const fetchEnrolledCourses = async () => {
  const courses = await apiFetch<any>("/api/enrolled-courses/");
  if (courses === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return courses;
}

// Update student status
export const updateStudentStatus = async (studentId: number, status: string) => {
  const updatedStudent = await apiFetch<any>(
    `/api/students/status/${studentId}/`,
    "PATCH",
    { status },
  );
  if (updatedStudent === TOKEN_EXPIRED) {
    throw new Error("Session expired, please log in again");
  }
  return updatedStudent;
};
