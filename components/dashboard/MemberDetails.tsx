import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Member {
  id: number
  name: string
  contact: string
  role: string
}

interface MemberDetailsProps {
  member: Member
  onClose: () => void
}

export default function MemberDetails({ member, onClose }: MemberDetailsProps) {
  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
          <DialogDescription>Member Details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 bg-white">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">ID:</span>
            <span className="col-span-3">{member.id}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">contact:</span>
            <span className="col-span-3">{member.contact}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Role:</span>
            <span className="col-span-3 capitalize">{member.role}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

