"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/types/user";
import { useEffect, useState } from "react";

interface StudentListProps {
  students: Student[];
}

export function StudentList({ students = [] }: StudentListProps) {
  const [formattedStudents, setFormattedStudents] = useState<
    Array<Student & { age: number; formattedDate: string }>
  >([]);

  useEffect(() => {
    if (!students) return; // Prevents TypeError

    const formatted = students.map((student) => ({
      ...student,
      age: calculateAge(student.birthdate),
      formattedDate: formatDate(student.birthdate),
    }));

    setFormattedStudents(formatted);
  }, [students]);

  if (!students || students.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No students added yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {formattedStudents.map((student) => (
        <Card key={student.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Born: {student.formattedDate}
                  </p>
                </div>
                <Badge variant="outline">{student.age} years old</Badge>
              </div>

              {/* Display Sessions (Now only courseName) */}
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Enrolled Courses:</h4>
                <div className="flex flex-wrap gap-1">
                  {student.sessions?.length > 0 ? (
                    student.sessions.map((session, index) => (
                      // Access courseName directly since it's a string
                      <Badge key={index} variant="secondary" className="text-xs">
                        {session.courseName} {/* ✅ Access courseName */}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No courses enrolled
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper function to calculate age from birthdate
function calculateAge(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Format date in a consistent way
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
