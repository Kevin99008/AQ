"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode } from "lucide-react"
import type { Student } from "@/types/user"
import { useEffect, useState, useCallback } from "react"

interface StudentListProps {
  students: Student[]
}

export function StudentList({ students = [] }: StudentListProps) {
  const [formattedStudents, setFormattedStudents] = useState<
    Array<Student & { ageInYears: number; ageInMonths: number; formattedDate: string; qrCode?: string }>
  >([])
  const [selectedQrCode, setSelectedQrCode] = useState<{
    isOpen: boolean
    studentName: string
    qrCode?: string
  }>({
    isOpen: false,
    studentName: "",
    qrCode: undefined,
  })

  // Generate QR code for student
  const generateQRCode = useCallback(async (studentId: string | number) => {
    try {
      const QRCode = (await import("qrcode")).default

      const qrData = JSON.stringify({
        student_id: studentId.toString(),
      })

      const url = await QRCode.toDataURL(qrData)
      return url
    } catch (err) {
      console.error("Failed to generate QR code:", err)
      return null
    }
  }, [])

  useEffect(() => {
    if (!students) return

    const loadStudentsWithQR = async () => {
      const formatted = await Promise.all(
        students.map(async (student) => {
          const qrCode = await generateQRCode(student.id)

          return {
            ...student,
            ...calculateAge(student.birthdate), // Added age in years and months
            formattedDate: formatDate(student.birthdate),
            qrCode: qrCode ?? undefined,
          }
        }),
      )

      setFormattedStudents(formatted)
    }

    loadStudentsWithQR()
  }, [students, generateQRCode])

  // Open QR code modal
  const openQrCodeModal = (studentName: string, qrCode?: string) => {
    setSelectedQrCode({
      isOpen: true,
      studentName,
      qrCode,
    })
  }

  // Close QR code modal
  const closeQrCodeModal = () => {
    setSelectedQrCode((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }

  if (!students || students.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No students added yet</p>
  }

  return (
    <>
      <div className="space-y-3">
        {formattedStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium">{student.name}</h3>
                  <div>
                    <Badge variant="outline" className="text-sm">
                    {student.ageInYears} years {student.ageInMonths} months old
                  </Badge>
                    <p className="text-sm text-muted-foreground">Born: {student.formattedDate}</p>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Enrolled Courses:</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.sessions?.length > 0 ? (
                        student.sessions.map((session, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {session.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No courses enrolled</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">

                  {/* QR Code Button */}
                  {student.qrCode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openQrCodeModal(student.name, student.qrCode)}
                      className="flex items-center gap-1"
                    >
                      View QR
                      <QrCode className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* QR Code Modal */}
      <Dialog open={selectedQrCode.isOpen} onOpenChange={closeQrCodeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code for {selectedQrCode.studentName}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {selectedQrCode.qrCode ? (
              <div className="bg-white p-4 rounded-md">
                <img
                  src={selectedQrCode.qrCode || "/placeholder.svg"}
                  alt={`QR Code for ${selectedQrCode.studentName}`}
                  className="h-48 w-48"
                />
              </div>
            ) : (
              <p>QR code not available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helper function to calculate age in years and months from birthdate
function calculateAge(birthdate: string) {
  const today = new Date()
  const birthDate = new Date(birthdate)

  // Calculate years difference
  let yearsDifference = today.getFullYear() - birthDate.getFullYear()
  let monthsDifference = today.getMonth() - birthDate.getMonth()

  // Adjust if the current month is before the birth month
  if (monthsDifference < 0 || (monthsDifference === 0 && today.getDate() < birthDate.getDate())) {
    yearsDifference--
    monthsDifference += 12
  }

  // Return age in years and months
  return {
    ageInYears: yearsDifference,
    ageInMonths: monthsDifference,
  }
}

// Format date in a consistent way
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
