"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts"
import type { StudentData } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface NewStudentsBarChartProps {
  data: StudentData[]
}

export default function NewStudentsBarChart({ data }: NewStudentsBarChartProps) {
  // Calculate averages for the summary
  const totalNewStudents = data.reduce((sum, item) => sum + item.students, 0)
  const totalReturningStudents = data.reduce((sum, item) => sum + (item.returning || 0), 0)
  const averageNewStudents = Math.round(totalNewStudents / data.length)
  const targetAchievement = Math.round(
    (totalNewStudents / data.reduce((sum, item) => sum + (item.target || 0), 0)) * 100,
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalNewStudents}</div>
            <p className="text-xs text-muted-foreground">Total New Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalReturningStudents}</div>
            <p className="text-xs text-muted-foreground">Total Returning Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{targetAchievement}%</div>
            <p className="text-xs text-muted-foreground">Target Achievement</p>
          </CardContent>
        </Card>
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
        className="h-[300px]"
      >
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="students" name="New Students" fill="var(--color-students)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="returning" name="Returning Students" fill="var(--color-returning)" radius={[4, 4, 0, 0]} />
          <ReferenceLine
            y={averageNewStudents}
            stroke="hsl(var(--chart-3))"
            strokeDasharray="3 3"
            label={{
              value: `Avg: ${averageNewStudents}`,
              position: "insideBottomRight",
              fill: "hsl(var(--chart-3))",
              fontSize: 12,
            }}
          />
        </BarChart>
      </ChartContainer>

      <div className="text-sm text-muted-foreground">
        <p>
          Analysis: The chart shows new student registrations compared to returning students and monthly targets.
          {targetAchievement > 100
            ? ` We've exceeded our targets by ${targetAchievement - 100}%, with particularly strong performance in ${data.reduce((max, item) => (item.students > max.students ? item : max), data[0]).month}.`
            : ` We're at ${targetAchievement}% of our target, with room for improvement in upcoming months.`}
        </p>
      </div>
    </div>
  )
}

