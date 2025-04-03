"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { useMobile } from "@/hooks/use-mobile"

interface categoryEnrollment {
  category: string
  enrollments: number
}

// Predefined set of softer gradient colors for the bars
const gradientPalette = [
  { id: "grad1", colors: ["#B3CDE0", "#A7BBC7"] }, // Light Blue to Soft Blue
  { id: "grad2", colors: ["#D1E7B7", "#A4D79C"] }, // Pale Green to Soft Green
  { id: "grad3", colors: ["#F5C2C7", "#F4A6B2"] }, // Light Pink to Soft Pink
  { id: "grad4", colors: ["#F4E2C7", "#E9C8A6"] }, // Soft Beige to Pale Yellow
  { id: "grad5", colors: ["#F1D7A8", "#F1D1A1"] }, // Light Yellow to Light Gold
  { id: "grad6", colors: ["#B6E0D3", "#A2D8C9"] }, // Light Teal to Soft Teal
  { id: "grad7", colors: ["#E3D1F0", "#D0A6F2"] }, // Lavender to Light Purple
  { id: "grad8", colors: ["#F1E0D6", "#E0D0C8"] }, // Light Peach to Soft Beige
]

export default function categoryEnrollmentChart() {
  const [chartData, setChartData] = useState<{ name: string; enrollments: number; category: string; fill: string }[]>(
    [],
  )
  const isMobile = useMobile()

  // Fetch course type enrollment data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch<categoryEnrollment[]>("/api/course-enrollment/")
        if (data === TOKEN_EXPIRED) {
          console.log("Session expired, please login again.")
          // Handle session expiration here, e.g., redirect to login page
          return
        }

        // Transform data for the chart, assigning gradient colors from the predefined palette
        const transformedData = data.map((item, index) => ({
          name:
            isMobile && item.category.length > 12
              ? item.category.substring(0, 12) + "..."
              : item.category.length > 20
                ? item.category.substring(0, 20) + "..."
                : item.category,
          enrollments: item.enrollments,
          category: item.category,
          fill: `url(#grad${(index % gradientPalette.length) + 1})`,
        }))
        setChartData(transformedData)
      } catch (error) {
        console.error("Error fetching course type enrollment data:", error)
      }
    }

    fetchData()
  }, [isMobile]) // Re-run when isMobile changes to update label truncation

  // Responsive chart configuration
  const chartConfig = {
    height: isMobile ? 300 : 400,
    margin: isMobile ? { top: 5, right: 10, left: -10, bottom: 5 } : { top: 10, right: 30, left: 0, bottom: 10 },
    barSize: isMobile ? 20 : 40,
    yAxisWidth: isMobile ? 70 : 100,
    labelTruncate: isMobile ? 12 : 20,
  }

  return (
    <div className="w-full">
      <ChartContainer
        config={{
          enrollments: {
            label: "Enrollments",
          },
        }}
      >
        <ResponsiveContainer width="100%" height={chartConfig.height}>
          <BarChart data={chartData} layout="vertical" margin={chartConfig.margin}>
            <defs>
              {/* Gradient definitions */}
              {gradientPalette.map((grad, index) => (
                <linearGradient key={grad.id} id={`grad${index + 1}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  {grad.colors.map((color, i) => (
                    <stop key={i} offset={`${(i * 100) / (grad.colors.length - 1)}%`} stopColor={color} />
                  ))}
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} tickCount={isMobile ? 3 : 5} />
            <YAxis
              dataKey="name"
              type="category"
              width={chartConfig.yAxisWidth}
              tickSize={0}
              tickMargin={isMobile ? 5 : 10}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              formatter={(value: any) => [`${value}`, " Enrollments"]}
            />
            <Bar dataKey="enrollments" radius={[0, 4, 4, 0]} maxBarSize={chartConfig.barSize}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

