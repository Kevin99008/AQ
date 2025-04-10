// This is a service for exporting receipts to PDF and Excel

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

export interface Receipt {
  id: string
  receipt_number: string
  student: string
  session: string
  amount: number
  payment_date: string
  payment_method: string
  [key: string]: any
}

export const ReceiptExportService = {
  /**
   * Export receipts to PDF
   */
  exportToPDF: (receipts: Receipt[], title = "Receipts") => {
    // Create a new PDF document
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Add summary
    doc.setFontSize(11)
    doc.text(`Total Receipts: ${receipts.length}`, 14, 38)

    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)
    doc.text(`Total Amount: ${totalAmount.toFixed(2)} Baht`, 14, 44)

    // Add table with receipt data
    autoTable(doc, {
      startY: 50,
      head: [["Receipt #", "Student", "Amount", "Date", "Method"]],
      body: receipts.map((receipt) => [
        receipt.receipt_number,
        receipt.student,
        `${receipt.amount.toFixed(2)} Baht`,
        new Date(receipt.payment_date).toLocaleDateString(),
        receipt.payment_method,
      ]),
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
    })

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`${title} | Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: "center" })
    }

    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`)
  },

  /**
   * Export receipts to Excel
   */
  exportToExcel: (receipts: Receipt[], title = "Receipts") => {
    // Prepare the worksheet data
    const worksheet = XLSX.utils.json_to_sheet(
      receipts.map((receipt) => ({
        "Receipt #": receipt.receipt_number,
        Student: receipt.student,
        "Course Session": receipt.session,
        Amount: `${receipt.amount.toFixed(2)}`,
        "Payment Date": new Date(receipt.payment_date).toLocaleDateString(),
        "Payment Method": receipt.payment_method,
      })),
    )

    // Create a workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts")

    // Add summary sheet
    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)
    const avgAmount = receipts.length > 0 ? totalAmount / receipts.length : 0

    const summaryData = [
      { Metric: "Total Receipts", Value: receipts.length },
      { Metric: "Total Amount", Value: `$${totalAmount.toFixed(2)}` },
      { Metric: "Average Amount", Value: `$${avgAmount.toFixed(2)}` },
      { Metric: "Generated On", Value: new Date().toLocaleDateString() },
    ]

    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

    // Generate Excel file
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, "-")}.xlsx`)
  },
}
