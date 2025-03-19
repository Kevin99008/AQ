import { Line, Bar, XAxis, YAxis, CartesianGrid, Legend, ComposedChart, Area } from "recharts"
import type { StudentData } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, Users } from "lucide-react"

interface EnrollmentTrendsProps {
  data: StudentData[]
  courseType?: string
}

export default function EnrollmentTrends({ data, courseType = "All" }: EnrollmentTrendsProps) {
  // Calculate metrics for the summary
  const totalNewStudents = data.reduce((sum, item) => sum + item.students, 0)
  const totalReturningStudents = data.reduce((sum, item) => sum + (item.returning || 0), 0)
  const totalStudents = totalNewStudents + totalReturningStudents

  // Calculate growth rate (comparing first and last month)
  const firstMonth = data[0]?.students || 0
  const lastMonth = data[data.length - 1]?.students || 0
  const growthRate = firstMonth === 0 ? 100 : Math.round(((lastMonth - firstMonth) / firstMonth) * 100)

  // Calculate retention rate
  const retentionRate = totalNewStudents === 0 ? 0 : Math.round((totalReturningStudents / totalNewStudents) * 100)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Users className="h-8 w-8 text-primary mr-3" />
          <div>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Total Students
              {courseType !== "All" && ` (${courseType})`}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          {growthRate >= 0 ? (
            <TrendingUp className="h-8 w-8 text-emerald-500 mr-3" />
          ) : (
            <TrendingDown className="h-8 w-8 text-rose-500 mr-3" />
          )}
          <div>
            <div className={`text-2xl font-bold ${growthRate >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {growthRate >= 0 ? "+" : ""}
              {growthRate}%
            </div>
            <p className="text-xs text-muted-foreground">Growth Rate</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <div className="h-8 w-8 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-3">
            <span className="text-sm font-bold">{retentionRate}%</span>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalReturningStudents}</div>
            <p className="text-xs text-muted-foreground">Returning Students</p>
          </div>
        </div>
      </div>

      <ChartContainer
        config={{
          students: {
            label: "New Students",
            color: "hsl(var(--chart-1))",
          },
          returning: {
            label: "Returning Students",
            color: "hsl(var(--chart-2))",
          },
          target: {
            label: "Target",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[250px] sm:h-[300px]"
      >
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="students"
            name="New Students"
            fill="hsl(var(--chart-1))" // Use the same color here
            stroke="hsl(var(--chart-1))" // Use the same color here
            fillOpacity={0.3}
          />
          <Bar dataKey="returning" name="Returning Students" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ChartContainer>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">Enrollment Analysis:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            {growthRate > 0
              ? `Positive growth trend of ${growthRate}% from ${data[0]?.month} to ${data[data.length - 1]?.month}`
              : `Declining enrollment trend of ${Math.abs(growthRate)}% from ${data[0]?.month} to ${data[data.length - 1]?.month}`}
            {courseType !== "All" && ` for ${courseType} courses`}
          </li>
          <li>
            {retentionRate > 50
              ? `Strong student retention rate of ${retentionRate}%`
              : `Student retention needs improvement at ${retentionRate}%`}
          </li>
          <li>
            {data.some((item) => item.students >= (item.target || 0))
              ? "Meeting or exceeding enrollment targets in some months"
              : "Consistently below enrollment targets across all months"}
          </li>
        </ul>
      </div>
    </div>
  )
}
