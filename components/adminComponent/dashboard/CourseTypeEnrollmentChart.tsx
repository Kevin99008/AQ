"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api" // Import apiFetch and TOKEN_EXPIRED

interface CourseTypeEnrollment {
  category: string; // Course type (e.g., "Math", "Science")
  enrollments: number; // Number of enrollments
}

// Predefined set of softer gradient colors for the bars
const gradientPalette = [
  { id: "grad1", colors: ["#B3CDE0", "#A7BBC7"] },  // Light Blue to Soft Blue
  { id: "grad2", colors: ["#D1E7B7", "#A4D79C"] },  // Pale Green to Soft Green
  { id: "grad3", colors: ["#F5C2C7", "#F4A6B2"] },  // Light Pink to Soft Pink
  { id: "grad4", colors: ["#F4E2C7", "#E9C8A6"] },  // Soft Beige to Pale Yellow
  { id: "grad5", colors: ["#F1D7A8", "#F1D1A1"] },  // Light Yellow to Light Gold
  { id: "grad6", colors: ["#B6E0D3", "#A2D8C9"] },  // Light Teal to Soft Teal
  { id: "grad7", colors: ["#E3D1F0", "#D0A6F2"] },  // Lavender to Light Purple
  { id: "grad8", colors: ["#F1E0D6", "#E0D0C8"] },  // Light Peach to Soft Beige
]

export default function CourseTypeEnrollmentChart() {
  const [chartData, setChartData] = useState<{ name: string; enrollments: number; category: string; fill: string }[]>([])

  // Fetch course type enrollment data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch<CourseTypeEnrollment[]>("/api/course-enrollment/") // Use apiFetch
        if (data === TOKEN_EXPIRED) {
          console.log("Session expired, please login again.");
          // Handle session expiration here, e.g., redirect to login page
          return;
        }

        // Transform data for the chart, assigning gradient colors from the predefined palette
        const transformedData = data.map((item, index) => ({
          name: item.category.length > 20 ? item.category.substring(0, 20) + "..." : item.category,
          enrollments: item.enrollments,
          category: item.category,
          fill: `url(#grad${(index % gradientPalette.length) + 1})`, // Use gradient from the list
        }))
        setChartData(transformedData)
      } catch (error) {
        console.error("Error fetching course type enrollment data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <ChartContainer
        config={{
          enrollments: {
            label: "Enrollments",
          },
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
            <defs>
              {/* Gradient definitions */}
              {gradientPalette.map((grad, index) => (
                <linearGradient key={grad.id} id={`grad${index + 1}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  {grad.colors.map((color, i) => (
                    <stop key={i} offset={`${(i * 100) / (grad.colors.length - 1)}%`} stopColor={color} />
                  ))}
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tickMargin={15}
              tickSize={12}
              interval={0} // Ensures all labels are shown
            />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              formatter={(value: any) => [`${value}`, " Enrollments"]} // Show formatted tooltip with value
            />
            <Bar dataKey="enrollments" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} /> // Set the gradient for each bar
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
