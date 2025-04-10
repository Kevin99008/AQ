"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { PieChartData } from "@/types/dashboard"
import { TrendingUp, TrendingDown, Users, UserCheck, UserMinus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"

interface MembershipDistributionProps {
  category: string
}

export default function MembershipDistribution({ category }: MembershipDistributionProps) {
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([
    { name: "Student", value: 0 },
    { name: "Teacher", value: 0 },
  ])

  useEffect(() => {
    // Fetch pie chart data based on the selected category
    const fetchData = async () => {
      try {
        const pieChartResponse = await apiFetch<PieChartData[]>(`/api/static/pie?category=${category}`)
        if (pieChartResponse !== TOKEN_EXPIRED) {
          if (Array.isArray(pieChartResponse) && pieChartResponse.length > 0) {
            setPieChartData(pieChartResponse)
          } else {
            console.error("Invalid or empty response from API.")
          }
        }
      } catch (error) {
        console.error("Failed to fetch pie chart data:", error)
      }
    }

    fetchData()
  }, [category])

  // Custom colors for the pie chart segments
  const COLORS = [    "#36A2EB", 
    "#FF9F40",]

  // Calculate percentages for the summary
  const total = pieChartData.reduce((sum, item) => sum + item.value, 0)
  const percentages = pieChartData.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: Math.round((item.value / total) * 100),
  }))

  return (
    <div className="flex flex-col h-full">
      {category !== "All" && (
        <div className="mb-3">
          <Badge
            className={`
              ${
                category === "AquaKids"
                  ? "bg-blue-100 text-blue-800"
                  : category === "Playsound"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-amber-100 text-amber-800"
              }
            `}
          >
            {category}
          </Badge>
        </div>
      )}

      {/* Increased height for the pie chart container */}
      <div className="flex-1 min-h-[220px] w-full">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              // Increased outer and inner radius for a bigger chart
              outerRadius={90}
              innerRadius={40}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${Math.round((value as number / total as number) * 100)}%)`, name]}
              contentStyle={{ borderRadius: "8px", padding: "8px 12px", fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-2">
        {percentages.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span>{item.name}</span>
            </div>
            <div className="font-medium">
              {item.value} ({item.percentage}%)
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center text-sm font-semibold pt-2 border-t">
          <span>Total</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  )
}
