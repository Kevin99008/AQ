"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReceiptExportService } from "@/components/receipt-export-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import React from "react"

type ReceiptResponse = {
  id: string
  student_id: string
  student: string
  course_id: string
  course_name: string
  session_id: string
  amount: number
  payment_date: string
  payment_method: string
  receipt_number: string
  notes: string
  items: any
}

// Get months as options
const months = [
  { value: "all", label: "All Months" },
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
]

const parseDate = (dateString: string) => {
  // Check if the date is already in ISO format
  if (dateString.includes("T") && dateString.includes("-")) {
    return new Date(dateString)
  }

  // Handle the format "Apr 10, 2025, 07:27 AM"
  try {
    return new Date(dateString)
  } catch (error) {
    console.error("Error parsing date:", dateString, error)
    return new Date() // Fallback to current date
  }
}

// Sort options
const sortOptions = [
  { value: "newest", label: "Newest First", icon: SortDesc },
  { value: "oldest", label: "Oldest First", icon: SortAsc },
]

export default function ReceiptsPage() {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("list")
  const [yearlyData, setYearlyData] = useState<any>({})
  const [sortOrder, setSortOrder] = useState<string>("newest")
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false)
  const [receipts, setReceipts] = useState<ReceiptResponse[]>([])
  const [expandedReceipts, setExpandedReceipts] = useState<string[]>([])

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        const response = await apiFetch<ReceiptResponse[]>("/api/new/receipts/all/")
        if (response !== TOKEN_EXPIRED) {
          setReceipts(response)
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
  }, [])

  // With this useMemo hook:
  const uniqueYears = React.useMemo(() => {
    const years = receipts.map((receipt) => parseDate(receipt.payment_date).getFullYear())
    return [...new Set(years)].sort((a, b) => b - a) // Sort descending
  }, [receipts])

  // Filter receipts based on search term, year, and month
  const filteredReceipts = receipts.filter((receipt) => {
    const receiptDate = parseDate(receipt.payment_date)
    const receiptYear = receiptDate.getFullYear().toString()
    const receiptMonth = receiptDate.getMonth().toString()

    const matchesSearch =
      receipt.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesYear = selectedYear === "all" || receiptYear === selectedYear
    const matchesMonth = selectedMonth === "all" || receiptMonth === selectedMonth

    return matchesSearch && matchesYear && matchesMonth
  })

  // Sort receipts based on sort order
  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    const dateA = parseDate(a.payment_date).getTime()
    const dateB = parseDate(b.payment_date).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Calculate yearly data for the yearly view
  useEffect(() => {
    const data: Record<string, any> = {}

    uniqueYears.forEach((year) => {
      const yearReceipts = receipts.filter((receipt) => parseDate(receipt.payment_date).getFullYear() === year)

      // Initialize monthly data
      const monthlyData: Record<string, any> = {}
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = {
          count: 0,
          total: 0,
          receipts: [],
        }
      }

      // Populate monthly data
      yearReceipts.forEach((receipt) => {
        const month = parseDate(receipt.payment_date).getMonth()
        monthlyData[month].count += 1
        monthlyData[month].total += receipt.amount
        monthlyData[month].receipts.push(receipt)
      })

      data[year] = {
        total: yearReceipts.reduce((sum, receipt) => sum + receipt.amount, 0),
        count: yearReceipts.length,
        months: monthlyData,
      }
    })

    setYearlyData(data)
  }, [receipts])

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedReceipts.length === sortedReceipts.length) {
      setSelectedReceipts([])
    } else {
      setSelectedReceipts(sortedReceipts.map((receipt) => receipt.id))
    }
  }

  // Handle individual checkbox selection
  const handleSelectReceipt = (id: string) => {
    if (selectedReceipts.includes(id)) {
      setSelectedReceipts(selectedReceipts.filter((receiptId) => receiptId !== id))
    } else {
      setSelectedReceipts([...selectedReceipts, id])
    }
  }

  // Toggle receipt details
  const toggleReceiptDetails = (id: string) => {
    if (expandedReceipts.includes(id)) {
      setExpandedReceipts(expandedReceipts.filter((receiptId) => receiptId !== id))
    } else {
      setExpandedReceipts([...expandedReceipts, id])
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = parseDate(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Export functions with time period filtering
  const exportToPDF = (selectedOnly = false, period?: { year: string; month: string }) => {
    let dataToExport

    if (period) {
      // Filter by specified period
      dataToExport = receipts.filter((receipt) => {
        const receiptDate = parseDate(receipt.payment_date)
        const receiptYear = receiptDate.getFullYear().toString()
        const receiptMonth = receiptDate.getMonth().toString()

        const matchesYear = period.year === "all" || receiptYear === period.year
        const matchesMonth = period.month === "all" || receiptMonth === period.month

        return matchesYear && matchesMonth
      })
    } else {
      // Use current filters
      dataToExport = selectedOnly
        ? sortedReceipts.filter((receipt) => selectedReceipts.includes(receipt.id))
        : sortedReceipts
    }

    // Sort the export data
    dataToExport = [...dataToExport].sort((a, b) => {
      const dateA = parseDate(a.payment_date).getTime()
      const dateB = parseDate(b.payment_date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    // Generate title based on period
    let title = "Receipts"
    if (period) {
      if (period.month !== "all") {
        const monthName = months.find((m) => m.value === period.month)?.label.replace("All ", "")
        title += ` - ${monthName}`
      }
      if (period.year !== "all") {
        title += ` ${period.year}`
      }
    }

    ReceiptExportService.exportToPDF(dataToExport, title)
  }

  const exportToExcel = (selectedOnly = false, period?: { year: string; month: string }) => {
    let dataToExport

    if (period) {
      // Filter by specified period
      dataToExport = receipts.filter((receipt) => {
        const receiptDate = parseDate(receipt.payment_date)
        const receiptYear = receiptDate.getFullYear().toString()
        const receiptMonth = receiptDate.getMonth().toString()

        const matchesYear = period.year === "all" || receiptYear === period.year
        const matchesMonth = period.month === "all" || receiptMonth === period.month

        return matchesYear && matchesMonth
      })
    } else {
      // Use current filters
      dataToExport = selectedOnly
        ? sortedReceipts.filter((receipt) => selectedReceipts.includes(receipt.id))
        : sortedReceipts
    }

    // Sort the export data
    dataToExport = [...dataToExport].sort((a, b) => {
      const dateA = parseDate(a.payment_date).getTime()
      const dateB = parseDate(b.payment_date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    // Generate title based on period
    let title = "Receipts"
    if (period) {
      if (period.month !== "all") {
        const monthName = months.find((m) => m.value === period.month)?.label.replace("All ", "")
        title += ` - ${monthName}`
      }
      if (period.year !== "all") {
        title += ` ${period.year}`
      }
    }

    ReceiptExportService.exportToExcel(dataToExport, title)
  }

  // Export for a specific month in yearly view
  const exportMonthData = (year: number, month: number, format: "pdf" | "excel") => {
    const monthReceipts = yearlyData[year]?.months[month]?.receipts || []
    const monthName = months.find((m) => m.value === month.toString())?.label
    const title = `Receipts - ${monthName} ${year}`

    // Sort the month receipts
    const sortedMonthReceipts = [...monthReceipts].sort((a, b) => {
      const dateA = parseDate(a.payment_date).getTime()
      const dateB = parseDate(b.payment_date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    if (format === "pdf") {
      ReceiptExportService.exportToPDF(sortedMonthReceipts, title)
    } else {
      ReceiptExportService.exportToExcel(sortedMonthReceipts, title)
    }
  }

  // Render the list view content
  const renderListView = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search receipts..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <option.icon className="mr-2 h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedReceipts.length} of {sortedReceipts.length} selected
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedReceipts.length === sortedReceipts.length && sortedReceipts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Receipt #</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReceipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No receipts found
                </TableCell>
              </TableRow>
            ) : (
              sortedReceipts.map((receipt) => (
                <React.Fragment key={receipt.id}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedReceipts.includes(receipt.id)}
                        onCheckedChange={() => handleSelectReceipt(receipt.id)}
                        aria-label={`Select receipt ${receipt.receipt_number}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <a href={`/admin/receipts/${receipt.id}`} className="text-primary hover:underline">
                        {receipt.receipt_number}
                      </a>
                    </TableCell>
                    <TableCell>{receipt.student}</TableCell>
                    <TableCell>{receipt.course_name}</TableCell>
                    <TableCell>฿{receipt.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
                    <TableCell>{formatDate(receipt.payment_date)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReceiptDetails(receipt.id)}
                        aria-label={expandedReceipts.includes(receipt.id) ? "Hide details" : "Show details"}
                      >
                        {expandedReceipts.includes(receipt.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedReceipts.includes(receipt.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Receipt Details</h4>
                            <dl className="grid grid-cols-[120px_1fr] gap-1 text-sm">
                              <dt className="font-medium text-muted-foreground">Receipt Number:</dt>
                              <dd>{receipt.receipt_number}</dd>
                              <dt className="font-medium text-muted-foreground">Payment Method:</dt>
                              <dd>{receipt.payment_method}</dd>
                              <dt className="font-medium text-muted-foreground">Payment Date:</dt>
                              <dd>{formatDate(receipt.payment_date)}</dd>
                              <dt className="font-medium text-muted-foreground">Amount:</dt>
                              <dd>฿{receipt.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</dd>
                            </dl>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Course Information</h4>
                            <dl className="grid grid-cols-[120px_1fr] gap-1 text-sm">
                              <dt className="font-medium text-muted-foreground">Student:</dt>
                              <dd>{receipt.student}</dd>
                              <dt className="font-medium text-muted-foreground">Student ID:</dt>
                              <dd>{receipt.student_id}</dd>
                              <dt className="font-medium text-muted-foreground">Course:</dt>
                              <dd>{receipt.course_name}</dd>
                              <dt className="font-medium text-muted-foreground">Session ID:</dt>
                              <dd>{receipt.session_id}</dd>
                            </dl>
                          </div>
                          {receipt.notes && (
                            <div className="col-span-1 md:col-span-2">
                              <h4 className="font-medium mb-2">Notes</h4>
                              <p className="text-sm">{receipt.notes}</p>
                            </div>
                          )}
                          {receipt.items && (
                            <div className="col-span-1 md:col-span-2">
                              <h4 className="font-medium mb-2">Items</h4>
                              <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
                                {JSON.stringify(receipt.items, null, 2)}
                              </pre>
                            </div>
                          )}
                          <div className="col-span-1 md:col-span-2 flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/admin/receipts/${receipt.id}`}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                View Full Receipt
                              </a>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  // Render the yearly view content
  const renderYearlyView = () => {
    const yearToDisplay = selectedYear !== "all" ? selectedYear : uniqueYears[0]?.toString()

    return (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Select value={yearToDisplay} onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <option.icon className="mr-2 h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {yearToDisplay && yearlyData[yearToDisplay] ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{yearlyData[yearToDisplay].count}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ฿{yearlyData[yearToDisplay].total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ฿
                    {(yearlyData[yearToDisplay].total / yearlyData[yearToDisplay].count || 0)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-3">Monthly Breakdown</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Receipts</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {months.slice(1).map((month, index) => (
                    <TableRow key={month.value}>
                      <TableCell className="font-medium">{month.label}</TableCell>
                      <TableCell>{yearlyData[yearToDisplay].months[index].count || 0}</TableCell>
                      <TableCell>
                        ฿
                        {(yearlyData[yearToDisplay].months[index].total || 0)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </TableCell>
                      <TableCell className="text-right">
                        {yearlyData[yearToDisplay].months[index].count > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Export</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => exportMonthData(Number(yearToDisplay), index, "pdf")}>
                                <FileText className="mr-2 h-4 w-4" />
                                Export to PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportMonthData(Number(yearToDisplay), index, "excel")}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Export to Excel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Select a year to view data</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Receipt Management</CardTitle>
              <CardDescription>Manage and export student payment receipts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuItem onClick={() => exportToPDF(false)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Current View to PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(true)} disabled={selectedReceipts.length === 0}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Selected to PDF ({selectedReceipts.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel(false)}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Current View to Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel(true)} disabled={selectedReceipts.length === 0}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export Selected to Excel ({selectedReceipts.length})
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Fixed Export by Time Period */}
                  <div className="px-2 py-1.5 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Export by Time Period
                    </div>
                    <div className="mt-2 space-y-2">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Years</SelectItem>
                          {uniqueYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="h-8 w-full">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="h-8 w-full"
                          onClick={() => exportToPDF(false, { year: selectedYear, month: selectedMonth })}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 w-full"
                          onClick={() => exportToExcel(false, { year: selectedYear, month: selectedMonth })}
                        >
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="yearly">Yearly View</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="mt-4">
                {renderListView()}
              </TabsContent>
              <TabsContent value="yearly" className="mt-4">
                {renderYearlyView()}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
