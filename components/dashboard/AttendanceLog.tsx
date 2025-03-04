import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AttendanceRecord {
  id: number
  name: string
  timestamp: string
  course: string
}

interface AttendanceLogProps {
  records: AttendanceRecord[]
  onSelectAttendance: (record: AttendanceRecord) => void
}

export default function AttendanceLog({ records, onSelectAttendance }: AttendanceLogProps) {
  return (
    <Card className="h-[400px] bg-white">
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectAttendance(record)}
              >
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.timestamp}</TableCell>
                <TableCell>{record.course}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

