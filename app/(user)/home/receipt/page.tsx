"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CreditCard, Download, Eye, FileText, Search, SortAsc, SortDesc, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

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

interface Student {
    id: string
    name: string
    email: string
    phone: string
}

interface Session {
    course_name: string
    course_id: number
    category: string
    total_quota: number
}

interface Invoice {
    id: number
    receipt_number: string
    student: Student
    session: Session
    attendances: Attendance[]
    amount: string
    payment_date: string
    payment_method: string
    created_by: string
    notes: string
    items: ReceiptItem[]
}

export default function InvoicesPage() {
    const router = useRouter()
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<string>("all")
    const [selectedCourse, setSelectedCourse] = useState<string>("all")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
    const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null)
    const [students, setStudents] = useState<{ id: string; name: string }[]>([])
    const [courses, setCourses] = useState<{ id: number; name: string }[]>([])

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const response = await apiFetch<Invoice[]>("/api/new/receipts/students/")
                if (response !== TOKEN_EXPIRED) {
                    setInvoices(response)
                    setFilteredInvoices(response)

                    // Extract unique students and courses for filters
                    const uniqueStudents = Array.from(
                        new Map(
                            response.map((invoice) => [
                                invoice.student.id,
                                {
                                    id: invoice.student.id,
                                    name: invoice.student.name,
                                },
                            ]),
                        ).values(),
                    )
                    setStudents(uniqueStudents)

                    const uniqueCourses = Array.from(
                        new Map(
                            response.map((invoice) => [
                                invoice.session.course_id,
                                {
                                    id: invoice.session.course_id,
                                    name: invoice.session.course_name,
                                },
                            ]),
                        ).values(),
                    )
                    setCourses(uniqueCourses)

                    setLoading(false)
                }
            } catch (error: any) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
                setLoading(false)
            }
        }

        loadInvoices()
    }, [])

    // Apply filters and sorting
    useEffect(() => {
        let result = [...invoices]

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(
                (invoice) =>
                    invoice.receipt_number.toLowerCase().includes(term) ||
                    invoice.student.name.toLowerCase().includes(term) ||
                    invoice.session.course_name.toLowerCase().includes(term),
            )
        }

        // Filter by student
        if (selectedStudent !== "all") {
            result = result.filter((invoice) => invoice.student.id === selectedStudent)
        }

        // Filter by course
        if (selectedCourse !== "all") {
            result = result.filter((invoice) => invoice.session.course_id.toString() === selectedCourse)
        }

        // Sort by date
        result.sort((a, b) => {
            const dateA = new Date(a.payment_date).getTime()
            const dateB = new Date(b.payment_date).getTime()
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB
        })

        setFilteredInvoices(result)
    }, [invoices, searchTerm, selectedStudent, selectedCourse, sortOrder])

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
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

    // Get payment method icon
    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case "CARD":
                return <CreditCard className="h-4 w-4" />
            case "CASH":
                return <CreditCard className="h-4 w-4" />
            case "TRANSFER":
                return <CreditCard className="h-4 w-4" />
            default:
                return <CreditCard className="h-4 w-4" />
        }
    }

    // Toggle expanded invoice
    const toggleExpand = (id: number) => {
        if (expandedInvoice === id) {
            setExpandedInvoice(null)
        } else {
            setExpandedInvoice(id)
        }
    }

    // View invoice details
    const viewInvoiceDetails = (id: number) => {
        router.push(`/home/receipt/${id}`)
    }

    // Generate PDF for a specific invoice
    const generatePDF = (invoice: Invoice) => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margin = 14
        const contentWidth = pageWidth - margin * 2

        // Add company logo/header
        doc.setFontSize(20)
        doc.setTextColor(40, 40, 40)
        doc.text("INVOICE", pageWidth / 2, 20, { align: "center" })

        // Add receipt number and date
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text(`Invoice #: ${invoice.receipt_number}`, pageWidth / 2, 30, { align: "center" })
        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        doc.text(`Date: ${formatDate(invoice.payment_date)}`, pageWidth / 2, 36, { align: "center" })

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
        doc.text(invoice.student.name, margin + 30, 60)
        doc.text(invoice.student.id, margin + 30, 66)
        doc.text(invoice.student.phone || "N/A", margin + 30, 72)

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
        doc.text(`${Number.parseFloat(invoice.amount).toFixed(2)} Baht`, margin + colWidth + 50, 60)
        doc.text(formatPaymentMethod(invoice.payment_method), margin + colWidth + 50, 66)
        doc.text(invoice.created_by, margin + colWidth + 50, 72)

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
        doc.text(invoice.session.course_name, margin + 40, 98)
        doc.text(invoice.session.category, margin + 40, 104)
        doc.text(invoice.session.total_quota.toString(), margin + 40, 110)

        // Add items table
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text("Payment Details", margin, 122)

        autoTable(doc, {
            startY: 128,
            head: [["Description", "Amount"]],
            body: invoice.items.map((item) => [
                item.description,
                `${item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Baht`,
            ]),
            foot: [
                [
                    "Total",
                    `${Number.parseFloat(invoice.amount)
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
        if (invoice.notes) {
            doc.setFontSize(12)
            doc.setTextColor(40, 40, 40)
            doc.text("Notes", margin, finalY + 10)

            doc.setFontSize(10)
            doc.setTextColor(80, 80, 80)
            doc.text(invoice.notes, margin, finalY + 18)
        }

        // Add attendance information on a new page if there are attendances
        if (invoice.attendances && invoice.attendances.length > 0) {
            doc.addPage()

            doc.setFontSize(16)
            doc.setTextColor(40, 40, 40)
            doc.text("Attendance Schedule", pageWidth / 2, 20, { align: "center" })

            doc.setFontSize(12)
            doc.setTextColor(80, 80, 80)
            doc.text(`For Invoice #${invoice.receipt_number}`, pageWidth / 2, 28, { align: "center" })

            // Add horizontal line
            doc.setDrawColor(200, 200, 200)
            doc.line(margin, 34, pageWidth - margin, 34)

            // Add attendance table
            autoTable(doc, {
                startY: 40,
                head: [["Date", "Time", "Status", "Type"]],
                body: invoice.attendances.map((attendance) => [
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
        doc.save(`Invoice-${invoice.receipt_number}.pdf`)
    }

    if (loading) {
        return (
            <div className="container mx-auto py-12">
                <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">Loading invoices...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">My Invoices</CardTitle>
                            <CardDescription>View and manage your payment invoices</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search invoices..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button variant="outline" onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}>
                                    {sortOrder === "newest" ? <SortDesc className="mr-2 h-4 w-4" /> : <SortAsc className="mr-2 h-4 w-4" />}
                                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Students</SelectItem>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courses</SelectItem>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {filteredInvoices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No invoices found</h3>
                            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredInvoices.map((invoice) => (
                                <Card key={invoice.id} className="overflow-hidden">
                                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-medium">{invoice.receipt_number}</h3>
                                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                                        {getPaymentMethodIcon(invoice.payment_method)}
                                                        <span className="ml-1">{invoice.payment_method}</span>
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 text-primary mr-1" />
                                                        <span className="font-medium">{invoice.student.name}</span>
                                                    </div>
                                                    <span className="hidden sm:inline text-muted-foreground">•</span>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 text-primary mr-1" />
                                                        <span className="font-medium">{invoice.session.course_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-1">
                                            <span className="text-lg font-bold">
                                                ฿
                                                {Number.parseFloat(invoice.amount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                            <p className="text-sm text-muted-foreground">{formatDate(invoice.payment_date)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => toggleExpand(invoice.id)}>
                                                {expandedInvoice === invoice.id ? "Hide Details" : "Show Details"}
                                            </Button>
                                            <Button variant="default" size="sm" onClick={() => viewInvoiceDetails(invoice.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </div>
                                    </div>

                                    {expandedInvoice === invoice.id && (
                                        <div className="border-t px-4 sm:px-6 py-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base font-medium">Invoice Details</h4>
                                                <Button variant="outline" size="sm" onClick={() => generatePDF(invoice)}>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Export to PDF
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                                        <User className="mr-2 h-4 w-4 text-primary" />
                                                        Student Information
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Name</p>
                                                                <p className="text-sm">{invoice.student.name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">ID</p>
                                                                <p className="text-sm">{invoice.student.id}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Phone</p>
                                                                <p className="text-sm">{invoice.student.phone || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                                        Course Information
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Course</p>
                                                                <p className="text-sm">{invoice.session.course_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Category</p>
                                                                <p className="text-sm capitalize">{invoice.session.category}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Course ID</p>
                                                                <p className="text-sm">{invoice.session.course_id}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">Total Quota</p>
                                                                <p className="text-sm">{invoice.session.total_quota}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {invoice.attendances && invoice.attendances.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium mb-2 flex items-center">
                                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                                        Scheduled Sessions
                                                    </h4>
                                                    <div className="overflow-x-auto">
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
                                                                {invoice.attendances.map((attendance) => (
                                                                    <TableRow key={attendance.id}>
                                                                        <TableCell>{formatSimpleDate(attendance.date)}</TableCell>
                                                                        <TableCell>
                                                                            {formatTime(attendance.start_time)} - {formatTime(attendance.end_time)}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={
                                                                                    attendance.status === "present"
                                                                                        ? "bg-green-100 text-green-800 border-green-200"
                                                                                        : attendance.status === "absent"
                                                                                            ? "bg-red-100 text-red-800 border-red-200"
                                                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                                                }
                                                                            >
                                                                                {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="capitalize">{attendance.type}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium mb-2 flex items-center">
                                                    <CreditCard className="mr-2 h-4 w-4 text-primary" />
                                                    Payment Details
                                                </h4>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Description</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {invoice.items.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{item.description}</TableCell>
                                                                <TableCell className="text-right">
                                                                    ฿{item.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <Separator className="my-2" />
                                                <div className="flex justify-between font-medium">
                                                    <span>Total</span>
                                                    <span>
                                                        ฿
                                                        {Number.parseFloat(invoice.amount).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {invoice.notes && (
                                                <div className="mt-4 p-3 bg-muted/50 rounded-md">
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                                                    <p className="text-sm">{invoice.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
