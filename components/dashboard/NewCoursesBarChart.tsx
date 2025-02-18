import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { month: "Jan", courses: 4 },
  { month: "Feb", courses: 3 },
  { month: "Mar", courses: 5 },
  { month: "Apr", courses: 2 },
  { month: "May", courses: 6 },
  { month: "Jun", courses: 4 },
  { month: "Jul", courses: 3 },
  { month: "Aug", courses: 5 },
  { month: "Sep", courses: 7 },
  { month: "Oct", courses: 4 },
  { month: "Nov", courses: 6 },
  { month: "Dec", courses: 3 },
]

export default function NewCoursesBarChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Courses Sold per Month</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="courses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

