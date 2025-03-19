"use client"

import { PieChart, Pie, Cell } from "recharts"
import type { PieChartData } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MembershipPieChartProps {
  data: PieChartData[]
}

export default function MembershipPieChart({ data }: MembershipPieChartProps) {
  // Custom colors for the pie chart segments
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"]

  return (
    <ChartContainer
      config={{
        teacher: {
          label: "Teacher",
          color: "hsl(var(--chart-1))",
        },
        student: {
          label: "Student",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[250px]"
    >
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          dataKey="value"
          nameKey="name"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

