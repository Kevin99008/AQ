import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Member {
  id: number
  name: string
  contact: string
  role: string
}

interface MemberListProps {
  title: string
  members: Member[]
  onSelectMember: (member: Member) => void
}

export default function MemberList({ title, members, onSelectMember }: MemberListProps) {
  return (
    <Card className="h-[400px] bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onSelectMember(member)}
              >
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

