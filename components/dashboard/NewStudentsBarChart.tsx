import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", students: 12 },
  { month: "Feb", students: 19 },
  { month: "Mar", students: 3 },
  { month: "Apr", students: 5 },
  { month: "May", students: 2 },
  { month: "Jun", students: 3 },
  { month: "Jul", students: 8 },
  { month: "Aug", students: 15 },
  { month: "Sep", students: 7 },
  { month: "Oct", students: 10 },
  { month: "Nov", students: 22 },
  { month: "Dec", students: 14 },
];


export default function NewStudentsBarChart() {
  return (
    <Card className="h-[400px] bg-white">
      <CardHeader>
        <CardTitle>New Students per Month</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

