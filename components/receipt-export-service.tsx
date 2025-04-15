// This is a service for exporting receipts to PDF and Excel

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

export interface Receipt {
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
  [key: string]: any
}

export const ReceiptExportService = {
  /**
   * Export receipts to PDF
   */
  exportToPDF: (receipts: Receipt[], title = "Receipts") => {
    // Create a new PDF document
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 14
    const tableWidth = pageWidth - margin * 2

    // Add title
    doc.setFontSize(18)
    doc.text(title, margin, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 30)

    // Add summary
    doc.setFontSize(11)
    doc.text(`Total Receipts: ${receipts.length}`, margin, 38)

    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)
    doc.text(`Total Amount: ${totalAmount.toFixed(2)} Baht`, margin, 44)

    // Add table with receipt data - REMOVED NOTES COLUMN
    autoTable(doc, {
      startY: 50,
      head: [["Receipt #", "Student", "Course", "Amount", "Date", "Method"]],
      body: receipts.map((receipt) => [
        receipt.receipt_number,
        receipt.student,
        receipt.course_name,
        `${receipt.amount.toFixed(2)} Baht`,
        new Date(receipt.payment_date).toLocaleDateString(),
        receipt.payment_method,
      ]),
      theme: "grid",
      headStyles: { fillColor: [60, 60, 60] },
      styles: { overflow: "ellipsize", cellWidth: "wrap", fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 }, // Receipt #
        1: { cellWidth: 35 }, // Student
        2: { cellWidth: 40 }, // Course
        3: { cellWidth: 30 }, // Amount
        4: { cellWidth: 30 }, // Date
        5: { cellWidth: 25 }, // Method
      },
      margin: { left: margin, right: margin },
      tableWidth: tableWidth,
    })

    // Add a second page for detailed information
    doc.addPage()
    doc.setFontSize(16)
    doc.text("Detailed Receipt Information", margin, 22)

    let yPosition = 30

    // Create a detailed table for each receipt
    for (const receipt of receipts) {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 60) {
        doc.addPage()
        yPosition = 20
      }

      // Add receipt header
      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      yPosition += 10
      doc.text(`Receipt #${receipt.receipt_number} - ${receipt.student}`, margin, yPosition)
      yPosition += 8

      // Add receipt details table
      autoTable(doc, {
        startY: yPosition,
        head: [["Field", "Value"]],
        body: [
          ["Receipt Number", receipt.receipt_number],
          ["Student", receipt.student],
          ["Student ID", receipt.student_id],
          ["Course", receipt.course_name],
          ["Course ID", receipt.course_id],
          ["Session ID", receipt.session_id],
          ["Amount", `${receipt.amount.toFixed(2)} Baht`],
          ["Payment Date", new Date(receipt.payment_date).toLocaleDateString()],
          ["Payment Method", receipt.payment_method],
          ["Notes", receipt.notes || "-"],
        ],
        theme: "grid",
        headStyles: { fillColor: [80, 80, 80] },
        styles: { overflow: "linebreak", fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: "bold" },
          1: { cellWidth: tableWidth - 40 },
        },
        margin: { left: margin, right: margin },
        tableWidth: tableWidth,
      })

      // Update yPosition after the table
      const finalY = (doc as any).lastAutoTable.finalY || yPosition + 20
      yPosition = finalY + 15

      // Add items table if items exist
      if (receipt.items && typeof receipt.items === "object" && Object.keys(receipt.items).length > 0) {
        try {
          const itemsArray = Array.isArray(receipt.items)
            ? receipt.items
            : Object.entries(receipt.items).map(([key, value]) => {
                // Check if value is an object before spreading
                if (value && typeof value === "object") {
                  return { name: key, ...value }
                } else {
                  // Handle primitive values
                  return { name: key, price: value, quantity: 1 }
                }
              })

          if (itemsArray.length > 0) {
            // Add items header
            doc.setFontSize(11)
            doc.text("Items:", margin, yPosition)
            yPosition += 5

            autoTable(doc, {
              startY: yPosition,
              head: [["Item", "Quantity", "Price", "Subtotal"]],
              body: itemsArray.map((item) => [
                item.name || "Item",
                item.quantity || 1,
                `${(item.price || 0).toFixed(2)} Baht`,
                `${((item.price || 0) * (item.quantity || 1)).toFixed(2)} Baht`,
              ]),
              theme: "grid",
              headStyles: { fillColor: [100, 100, 100] },
              styles: { fontSize: 9 },
              columnStyles: {
                0: { cellWidth: tableWidth * 0.4 }, // Item name (40% of table)
                1: { cellWidth: tableWidth * 0.15 }, // Quantity (15% of table)
                2: { cellWidth: tableWidth * 0.2 }, // Price (20% of table)
                3: { cellWidth: tableWidth * 0.25 }, // Subtotal (25% of table)
              },
              margin: { left: margin, right: margin },
              tableWidth: tableWidth,
            })

            // Update yPosition after the table
            const itemsFinalY = (doc as any).lastAutoTable.finalY || yPosition + 20
            yPosition = itemsFinalY + 20
          }
        } catch (error) {
          console.error("Error processing items for receipt", receipt.receipt_number, error)
          doc.text("Error processing items for this receipt", margin, yPosition)
          yPosition += 10
        }
      }

      // Add a separator line
      if (yPosition < doc.internal.pageSize.height - 20) {
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10)
      }
    }

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`${title} | Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, {
        align: "center",
      })
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
        "Student ID": receipt.student_id,
        Student: receipt.student,
        "Course ID": receipt.course_id,
        Course: receipt.course_name,
        "Session ID": receipt.session_id,
        Amount: `${receipt.amount.toFixed(2)}`,
        "Payment Date": new Date(receipt.payment_date).toLocaleDateString(),
        "Payment Method": receipt.payment_method,
        Notes: receipt.notes || "",
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
      { Metric: "Total Amount", Value: `฿${totalAmount.toFixed(2)}` },
      { Metric: "Average Amount", Value: `฿${avgAmount.toFixed(2)}` },
      { Metric: "Generated On", Value: new Date().toLocaleDateString() },
    ]

    const summarySheet = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary")

    // Add items sheet if any receipts have items
    let hasItems = false
    const itemsData: any[] = []

    for (const receipt of receipts) {
      if (receipt.items && typeof receipt.items === "object" && Object.keys(receipt.items).length > 0) {
        hasItems = true

        try {
          const itemsArray = Array.isArray(receipt.items)
            ? receipt.items
            : Object.entries(receipt.items).map(([key, value]) => {
                // Check if value is an object before spreading
                if (value && typeof value === "object") {
                  return { name: key, ...value }
                } else {
                  // Handle primitive values
                  return { name: key, price: value, quantity: 1 }
                }
              })

          itemsArray.forEach((item) => {
            itemsData.push({
              "Receipt #": receipt.receipt_number,
              Student: receipt.student,
              Course: receipt.course_name,
              "Item Name": item.name || "Item",
              Quantity: item.quantity || 1,
              "Unit Price": (item.price || 0).toFixed(2),
              Subtotal: ((item.price || 0) * (item.quantity || 1)).toFixed(2),
            })
          })
        } catch (error) {
          console.error("Error processing items for receipt", receipt.receipt_number, error)
          itemsData.push({
            "Receipt #": receipt.receipt_number,
            Student: receipt.student,
            Course: receipt.course_name,
            "Item Name": "Error processing items",
            Quantity: "",
            "Unit Price": "",
            Subtotal: "",
          })
        }
      }
    }

    if (hasItems && itemsData.length > 0) {
      const itemsSheet = XLSX.utils.json_to_sheet(itemsData)
      XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items")
    }

    // Generate Excel file
    XLSX.writeFile(workbook, `${title.toLowerCase().replace(/\s+/g, "-")}.xlsx`)
  },
}
