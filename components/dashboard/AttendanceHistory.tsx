import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface AttendanceRecord {
  id: number
  name: string
  timestamp: string
  course: string
}

interface AttendanceHistoryProps {
  record: AttendanceRecord
  onClose: () => void
}

export default function AttendanceHistory({ record, onClose }: AttendanceHistoryProps) {
  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{record.name}</DialogTitle>
          <DialogDescription>Attendance History</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{record.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Timestamp:</span>
            <span className="col-span-3">{record.timestamp}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Course:</span>
            <span className="col-span-3">{record.course}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

