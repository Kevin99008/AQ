"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Student {
  id: number;
  name: string;
}

interface StudentSelectProps {
  students: Student[];
  selectedStudent: number | null;
  onSelectStudent: (studentId: number) => void;
}

export default function StudentSelect({ students, selectedStudent, onSelectStudent }: StudentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedStudent ? students.find(student => student.id === selectedStudent)?.name : "Select student..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        <div className="p-2">
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {filteredStudents.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No students found.</div>
          ) : (
            filteredStudents.map(student => (
              <DropdownMenuItem
                key={student.id}
                onSelect={() => {
                  onSelectStudent(student.id);
                  setIsOpen(false);
                }}
              >
                {student.name}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
