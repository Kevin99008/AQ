"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface ReceiptData {
  id: number
  receipt_number: string
  student: {
    name: string
    email: string
    id: string
    phone: string
  }
  session: {
    name: string
    course_name: string
    category: string
    total_quota: number
  }
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
  // Mock receipt data - in a real app, you would fetch this from your API
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

  // Generate PDF function
  const generatePDF = () => {
    if (!receipt) return

    const doc = new jsPDF()

    // Add company logo/header
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text("RECEIPT", 105, 20, { align: "center" })

    // Add receipt information
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text("Receipt Number:", 14, 40)
    doc.text("Date:", 14, 45)
    doc.text("Payment Method:", 14, 50)

    doc.setTextColor(40, 40, 40)
    doc.text(receipt.receipt_number, 50, 40)
    doc.text(formatDate(receipt.payment_date), 50, 45)
    doc.text(formatPaymentMethod(receipt.payment_method), 50, 50)

    // Add student information
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Student Information", 14, 65)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text("Name:", 14, 75)
    doc.text("Phone:", 14, 90)

    doc.setTextColor(40, 40, 40)
    doc.text(receipt.student.name, 50, 75)
    doc.text(receipt.student.phone, 50, 90)

    // Add course information
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Course Information", 14, 105)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text("Course:", 14, 115)
    doc.text("Category:", 14, 120)
    doc.text("Total Quota:", 14, 125)

    doc.setTextColor(40, 40, 40)
    doc.text(receipt.session.name, 50, 115)
    doc.text(receipt.session.category, 50, 120)
    doc.text(receipt.session.total_quota.toString(), 50, 125)

    // Add items table
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Payment Details", 14, 140)

    // @ts-ignore - jspdf-autotable types are not included
    autoTable(doc, {
      startY: 145,
      head: [["Description", "Amount"]],
      body: receipt.items.map((item) => [item.description, `${item.amount.toFixed(2)} Baht`]),
      foot: [["Total", `${receipt.amount} Baht`]],
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
      footStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40], fontStyle: "bold" },
    })

    // Add notes
    if (receipt.notes) {
      // @ts-ignore - get the final y position after the table
      const finalY = (doc as any).lastAutoTable.finalY || 200

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text("Notes:", 14, finalY + 10)

      doc.setTextColor(40, 40, 40)
      doc.text(receipt.notes, 14, finalY + 15)
    }

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receipt Number</p>
                <p>{receipt.receipt_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{formatDate(receipt.payment_date)}</p>
              </div>
              {/* <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p>{formatPaymentMethod(receipt.payment_method)}</p>
              </div> */}
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
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{receipt.student.name}</p>
            </div>
            {/* <div>
              <p className="text-sm font-medium text-muted-foreground">Student ID</p>
              <p>{receipt.student.id}</p>
            </div> */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>{receipt.student.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Course Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course</p>
                <p>{receipt.session.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Course Name</p>
                <p>{receipt.session.course_name}</p>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
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
    </div>
  )
}
