"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { toast } from "react-toastify"
import { addStudent } from "@/services/api" // Assuming addStudent is the API function
import { User } from "@/types/user"

interface AddStudentDialogProps {
  user: User
  onStudentAdded: () => void // Ensure this is passed correctly from the parent component
}

export function AddStudentDialog({ user, onStudentAdded }: AddStudentDialogProps) {
    const [newStudent, setNewStudent] = useState({ name: "", birthdate: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  
    const handleAddStudent = async () => {
      if (newStudent.name.trim() && newStudent.birthdate) {
        setIsSubmitting(true);
  
        try {
          const response = await addStudent(user.id, {
            name: newStudent.name,
            birthdate: newStudent.birthdate,
          });
  
          console.log(response);
  
          if (response && response.id) {
            toast.success(`Added ${newStudent.name} to ${user.username}'s students`);
            setNewStudent({ name: "", birthdate: "" }); // Reset form
            onStudentAdded(); // Call the parent's fetchStudents function
            setIsOpen(false); // Close the dialog
          } else {
            toast.error("Failed to add student. Please try again.");
          }
        } catch (error) {
          toast.error("Failed to add student. Please try again.");
          console.error("Failed to add student:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  
    return (
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Add a student to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Enter student name"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={newStudent.birthdate}
                  onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddStudent} disabled={isSubmitting || !newStudent.name || !newStudent.birthdate}>
                {isSubmitting ? "Adding..." : "Add Student"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }