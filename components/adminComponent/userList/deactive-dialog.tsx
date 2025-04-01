import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateStudentStatus } from '@/services/api'; // Import the fetch API function
import { toast } from 'react-toastify'; // Import react-toastify for notifications
import { X } from 'lucide-react';

export function DeactiveDialog({ user, setUser, student, isOpen, setDialogOpen }: any) {
  const [deactivating, setDeactivating] = useState(false); // To handle the loading state during the update

  const confirmStatusChange = async () => {
    if (student && user) {
      const newStatus = student.status === 'active' ? 'inactive' : 'active'; // Toggle status

      try {
        setDeactivating(true); // Set loading state while we wait for the update

        // Call the API to update the student's status
        const updatedStudent = await updateStudentStatus(student.id, newStatus, user.token);

        // If the update is successful, update the user state with the new student data
        const updatedUser = {
          ...user,
          students: user.students.map((s: any) =>
            s.id === student.id ? { ...s, status: newStatus } : s
          ),
        };

        setUser(updatedUser); // Update the user state with the new list of students
        setDialogOpen(false); // Close the dialog

        // Show success toast
        toast.success(`${student.name} has been ${newStatus === 'inactive' ? 'deactivated' : 'activated'} successfully.`);
      } catch (error) {
        console.error('Error updating student status:', error);
        // Show error toast
        toast.error('Failed to update student status. Please try again.');
      } finally {
        setDeactivating(false); // Reset loading state
      }
    }
  };

  return (
    <>
      {/* Deactive/Activate Button */}
      <Button
        variant="outline"
        size="sm"
        className={student?.status === 'inactive' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}
        onClick={() => setDialogOpen(true)} // Open the dialog
      >
        {student?.status === 'inactive' ? 'Activate' : 'Deactivate'} {/* Dynamic button text */}
        <X className="h-4 w-4" />
      </Button>

      {/* Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {student?.status === 'inactive' ? 'Activate' : 'Deactivate'} Student
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {student?.status === 'inactive' ? 'activate' : 'deactivate'} {student?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={student?.status === 'inactive' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={deactivating} // Disable button during loading
            >
              {deactivating ? 'Updating...' : student?.status === 'inactive' ? 'Activate' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
