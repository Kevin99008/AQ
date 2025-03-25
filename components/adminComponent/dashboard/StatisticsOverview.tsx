import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserMinus, UserPlus } from "lucide-react"
import type { StatisticsData } from "@/types/dashboard"

export default function StatisticsOverview({ countStudentData }: { countStudentData: StatisticsData }) {

  return (
    <div className="space-y-2">
      <StatCard
        title="Total Students"
        value={countStudentData.totalStudent}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Active Students"
        value={countStudentData.activeStudent}
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Inactive Students"
        value={countStudentData.inactiveStudent}
        icon={<UserMinus className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="New Students"
        value={countStudentData.newStudents}
        icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}

