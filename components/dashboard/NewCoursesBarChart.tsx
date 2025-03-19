"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Legend, Line, ComposedChart } from "recharts"
import type { CourseData } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface NewCoursesBarChartProps {
  data: CourseData[]
}

export default function NewCoursesBarChart({ data }: NewCoursesBarChartProps) {
  // Calculate metrics for the summary
  const totalCourses = data.reduce((sum, item) => sum + item.courses, 0)
  const avgAttendance = Math.round(
    data.reduce((sum, item) => sum + (item.attendance || 0) * (item.courses || 0), 0) /
      data.reduce((sum, item) => sum + (item.courses || 0), 0),
  )
  const totalCapacity = data.reduce((sum, item) => sum + (item.capacity || 0), 0)
  const utilizationRate = Math.round(
    (data.reduce((sum, item) => sum + (item.attendance || 0) * (item.courses || 0), 0) /
      data.reduce((sum, item) => sum + (item.capacity || 0), 0)) *
      100,
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Average Attendance Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">Capacity Utilization</p>
          </CardContent>
        </Card>
      </div>

      <ChartContainer
        config={{
          courses: {
            label: "Courses",
            color: "hsl(var(--chart-2))",
          },
          attendance: {
            label: "Attendance Rate",
            color: "hsl(var(--chart-1))",
          },
          capacity: {
            label: "Capacity",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-[300px]"
      >
        <ComposedChart data={data}>
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="courses"
            name="Number of Courses"
            fill="var(--color-courses)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="capacity"
            name="Total Capacity"
            fill="var(--color-capacity)"
            radius={[4, 4, 0, 0]}
            opacity={0.5}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="attendance"
            name="Attendance Rate (%)"
            stroke="var(--color-attendance)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ChartContainer>

      <div className="text-sm text-muted-foreground">
        <p>
          Analysis: The chart shows the number of courses offered each month alongside attendance rates and capacity.
          {avgAttendance > 85
            ? ` We're maintaining excellent attendance rates (${avgAttendance}% average), indicating high student engagement and satisfaction.`
            : ` Our attendance rate of ${avgAttendance}% suggests we should investigate ways to improve student engagement.`}
          {utilizationRate > 90
            ? ` With ${utilizationRate}% capacity utilization, we should consider expanding our course offerings to meet demand.`
            : ` Our ${utilizationRate}% capacity utilization indicates we have room to grow enrollment in existing courses.`}
        </p>
      </div>
    </div>
  )
}

