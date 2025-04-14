import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, CreditCard } from "lucide-react"
import { ApiReceiptResponse } from "@/types/receipt"


// Helper function to format date
function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

// Helper function to format time
function formatTime(timeStr: string) {
    // Handle time strings like "14:00:00"
    const [hours, minutes] = timeStr.split(":")
    const time = new Date()
    time.setHours(Number.parseInt(hours, 10))
    time.setMinutes(Number.parseInt(minutes, 10))

    return time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}


interface ConfirmPageProps {
    response: ApiReceiptResponse
}

export default function AttendanceReceiptPage({ response }: ConfirmPageProps) {
    const { message, session_count, sessions } = response

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center gap-2 mb-6 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h1 className="text-xl font-medium text-green-700">{message}</h1>
            </div>

            <a
                href={`/admin/receipts/`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                <span className="mr-2">View All Receipts</span>
                <CreditCard className="h-4 w-4" />
            </a>


            <div className="mb-6 mt-8">
                <h2 className="text-lg font-medium mb-2">Summary</h2>
                <div className="flex items-center gap-2">
                    <span>Total sessions processed:</span>
                    <Badge variant="outline">{session_count}</Badge>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between">
                    <h2 className="text-lg font-medium">Session Details</h2>
                </div>
                {sessions.map((session) => (
                    <Card key={session.session_id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50">
                            <CardTitle className="flex justify-between">
                                <span>{session.course_name} </span>
                                <Badge>Session #{session.session_id}</Badge>
                            </CardTitle>
                            <CardDescription>
                                <Badge>Student: {session.student_name} (ID: {session.student_id})</Badge>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* Receipt Information */}
                                <div>
                                    <h3 className="text-base font-medium mb-3">Receipt Information</h3>
                                    <div className="bg-slate-50 p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="font-semibold">{session.receipt.receipt_number}</div>
                                            <div className="flex items-center gap-1">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="text-sm">{session.receipt.payment_method}</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground mb-3">{session.receipt.notes}</div>

                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {session.receipt.items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell className="font-medium">Total</TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        ${session.receipt.amount.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Attendance Records */}
                                <div>
                                    <h3 className="text-base font-medium mb-3">Attendance Records</h3>
                                    <div className="bg-slate-50 rounded-md overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Attendance ID</TableHead>
                                                    <TableHead>Timeslot ID</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {session.attendances.map((attendance) => (
                                                    <TableRow key={attendance.attendance_id}>
                                                        <TableCell>{attendance.attendance_id}</TableCell>
                                                        <TableCell>{attendance.timeslot_id}</TableCell>
                                                        <TableCell>{formatDate(attendance.date)}</TableCell>
                                                        <TableCell>
                                                            {formatTime(attendance.start_time)} - {formatTime(attendance.end_time)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <a
                                    href={`/admin/receipts/${session.receipt.id}`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <span className="mr-2">View Receipt Details</span>
                                    <CreditCard className="h-4 w-4" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
