"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CreditCard, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { use } from "react"
import { useEffect, useState } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"

interface ReceiptItem {
  description: string
  amount: number
}

interface Attendance {
  id: number
  status: string
  type: string
  date: string
  start_time: string
  end_time: string
  timeslot_id: number
}

interface ReceiptData {
  id: number
  receipt_number: string
  student: {
    id: string
    name: string
    email: string
    phone: string
  }
  session: {
    course_name: string
    course_id: number
    category: string
    total_quota: number
  }
  attendances: Attendance[]
  amount: string
  payment_date: string
  payment_method: string
  created_by: string
  notes: string
  items: ReceiptItem[]
}

export default function ReceiptDetailPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use(props.params)
  const id = params.id
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const response = await apiFetch<ReceiptData>(`/api/new/receipts/${id}`)
        if (response !== TOKEN_EXPIRED) {
          setReceipt(response)
          setLoading(false)
        }
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Something went wrong")
        }
      }
    }

    loadReceipts()
  }, [id])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Format simple date
  const formatSimpleDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Format time
  const formatTime = (timeString: string) => {
    // Handle "10:00" format
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours, 10))
      date.setMinutes(Number.parseInt(minutes, 10))

      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(date)
    }

    // Handle ISO format or return as is if can't parse
    try {
      const date = new Date(timeString)
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return timeString
    }
  }

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      CARD: "Credit/Debit Card",
      CASH: "Cash",
      TRANSFER: "Bank Transfer",
      CHECK: "Check",
      OTHER: "Other",
    }
    return methods[method] || method
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Generate PDF function
  const generatePDF = () => {
    if (!receipt) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 14
    const contentWidth = pageWidth - margin * 2

    // Add company logo/header
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("RECEIPT", pageWidth / 2, 20, { align: "center" })

    // Add receipt number and date
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text(`Receipt #: ${receipt.receipt_number}`, pageWidth / 2, 30, { align: "center" })
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text(`Date: ${formatDate(receipt.payment_date)}`, pageWidth / 2, 36, { align: "center" })

    // Add horizontal line
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, 42, pageWidth - margin, 42)

    // Two-column layout for student and payment info
    const colWidth = (contentWidth - 10) / 2

    // Left column - Student Information
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Student Information", margin, 52)

    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text("Name:", margin, 60)
    doc.text("ID:", margin, 66)
    doc.text("Phone:", margin, 72)

    doc.setTextColor(40, 40, 40)
    doc.text(receipt.student.name, margin + 30, 60)
    doc.text(receipt.student.id, margin + 30, 66)
    doc.text(receipt.student.phone || "N/A", margin + 30, 72)

    // Right column - Payment Information
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Payment Information", margin + colWidth + 10, 52)

    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text("Amount:", margin + colWidth + 10, 60)
    doc.text("Method:", margin + colWidth + 10, 66)
    doc.text("Created By:", margin + colWidth + 10, 72)

    doc.setTextColor(40, 40, 40)
    doc.text(`${Number.parseFloat(receipt.amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Baht`, margin + colWidth + 50, 60)
    doc.text(formatPaymentMethod(receipt.payment_method), margin + colWidth + 50, 66)
    doc.text(receipt.created_by, margin + colWidth + 50, 72)

    // Course Information
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Course Information", margin, 90)

    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text("Course:", margin, 98)
    doc.text("Category:", margin, 104)
    doc.text("Total Quota:", margin, 110)

    doc.setTextColor(40, 40, 40)
    doc.text(receipt.session.course_name, margin + 40, 98)
    doc.text(receipt.session.category, margin + 40, 104)
    doc.text(receipt.session.total_quota.toString(), margin + 40, 110)

    // Add items table
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Payment Details", margin, 122)

    autoTable(doc, {
      startY: 128,
      head: [["Description", "Amount"]],
      body: receipt.items.map((item) => [
        item.description,
        `${item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Baht`,
      ]),
      foot: [
        [
          "Total",
          `${Number.parseFloat(receipt.amount)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Baht`,
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
      footStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40], fontStyle: "bold" },
      margin: { left: margin, right: margin },
      styles: { overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: contentWidth * 0.7 },
        1: { cellWidth: contentWidth * 0.3, halign: "right" },
      },
    })

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 160

    // Add notes if available
    if (receipt.notes) {
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text("Notes", margin, finalY + 10)

      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text(receipt.notes, margin, finalY + 18)
    }

    // Add attendance information on a new page if there are attendances
    if (receipt.attendances && receipt.attendances.length > 0) {
      doc.addPage()

      doc.setFontSize(16)
      doc.setTextColor(40, 40, 40)
      doc.text("Attendance Schedule", pageWidth / 2, 20, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(80, 80, 80)
      doc.text(`For Receipt #${receipt.receipt_number}`, pageWidth / 2, 28, { align: "center" })

      // Add horizontal line
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, 34, pageWidth - margin, 34)

      // Add attendance table
      autoTable(doc, {
        startY: 40,
        head: [["Date", "Time", "Status", "Type"]],
        body: receipt.attendances.map((attendance) => [
          formatSimpleDate(attendance.date),
          `${formatTime(attendance.start_time)} - ${formatTime(attendance.end_time)}`,
          attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1),
          attendance.type.charAt(0).toUpperCase() + attendance.type.slice(1),
        ]),
        theme: "grid",
        headStyles: { fillColor: [60, 60, 60] },
        margin: { left: margin, right: margin },
        styles: { overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.25 },
          1: { cellWidth: contentWidth * 0.35 },
          2: { cellWidth: contentWidth * 0.2 },
          3: { cellWidth: contentWidth * 0.2 },
        },
      })
    }

    // Add footer on all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      )
    }

    // Save the PDF
    doc.save(`Receipt-${receipt.receipt_number}.pdf`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <p>Loading receipt details...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <p>Receipt not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/admin/receipts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipts
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receipt #{receipt.receipt_number}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export to PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Receipt Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receipt Number</p>
                <p className="font-medium">{receipt.receipt_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{formatDate(receipt.payment_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p>{formatPaymentMethod(receipt.payment_method)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p>{receipt.created_by}</p>
              </div>
            </div>
            {receipt.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{receipt.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium">{receipt.student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                <p>{receipt.student.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{receipt.student.phone || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course Name</p>
                <p className="font-medium">{receipt.session.course_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course ID</p>
                <p>{receipt.session.course_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="capitalize">{receipt.session.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quota</p>
                <p>{receipt.session.total_quota}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {receipt.attendances && receipt.attendances.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Attendance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{formatSimpleDate(attendance.date)}</TableCell>
                    <TableCell>
                      {formatTime(attendance.start_time)} - {formatTime(attendance.end_time)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(attendance.status)} variant="outline">
                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{attendance.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">
                    ฿{item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className="my-4" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>
              ฿
              {Number.parseFloat(receipt.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
