"use client"

import { XAxis, YAxis, CartesianGrid, Legend, Line, LineChart } from "recharts"
import type { CourseData, CoursePopularity } from "@/types/dashboard"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BookOpen, Users, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CoursePerformanceProps {
  data: CourseData[]
  coursePopularity: CoursePopularity[]
  courseType?: string
}

export default function CoursePerformance({ data, coursePopularity, courseType = "All" }: CoursePerformanceProps) {
  // Filter course popularity data by course type if not "All"
  const filteredCoursePopularity =
    courseType === "All" ? coursePopularity : coursePopularity.filter((course) => course.courseType === courseType)

  // Calculate metrics for the summary
  const totalCourses = data.reduce((sum, item) => sum + item.courses, 0)
  const avgAttendance = Math.round(
    data.reduce((sum, item) => sum + (item.attendance || 0) * (item.courses || 1), 0) /
      data.filter((item) => item.courses > 0).length,
  )
  const totalCapacity = data.reduce((sum, item) => sum + (item.capacity || 0), 0)
  const utilizationRate = Math.round(
    (data.reduce((sum, item) => sum + (item.attendance || 0) * (item.courses || 0), 0) /
      data.reduce((sum, item) => sum + (item.capacity || 0), 0)) *
      100,
  )

  // Find the month with highest attendance
  const highestAttendanceMonth = data.reduce(
    (max, item) => ((item.attendance || 0) > (max.attendance || 0) ? item : max),
    data[0] || { month: "N/A", attendance: 0 },
  )

  // Function to get badge color based on course type
  const getBadgeColor = (courseType: string) => {
    switch (courseType) {
      case "AquaKids":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Playsound":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "Other":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <BookOpen className="h-8 w-8 text-primary mr-3" />
          <div>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Percent className="h-8 w-8 text-amber-500 mr-3" />
          <div>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
            <p className="text-xs text-muted-foreground">Average Attendance</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <Users className="h-8 w-8 text-indigo-500 mr-3" />
          <div>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground">Capacity Utilization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Course Popularity Comparison</h3>
          <div className="space-y-4 p-2">
            {/* Course popularity bars */}
            <div className="space-y-3">
              {filteredCoursePopularity.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No course data available</div>
              ) : (
                filteredCoursePopularity.map((course, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium flex items-center">
                        <span>{course.name}</span>
                        {courseType === "All" && (
                          <Badge className={`ml-2 ${getBadgeColor(course.courseType)}`} variant="outline">
                            {course.courseType}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">{course.students} students</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${course.popularity}%`,
                          backgroundColor:
                            course.courseType === "AquaKids"
                              ? "hsl(210, 70%, 60%)"
                              : course.courseType === "Playsound"
                                ? "hsl(270, 70%, 60%)"
                                : "hsl(45, 70%, 60%)",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Popularity: {course.popularity}%</span>
                      {course.popularity > 85 ? (
                        <span className="text-emerald-500">High demand</span>
                      ) : course.popularity > 75 ? (
                        <span className="text-amber-500">Medium demand</span>
                      ) : (
                        <span className="text-rose-500">Low demand</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              <p>Popularity is calculated based on enrollment rate, attendance, and student feedback.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Attendance Rate Trends</h3>
          <ChartContainer
            config={{
              attendance: {
                label: "Attendance Rate",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[250px]"
          >
            <LineChart data={data.filter((item) => item.courses > 0)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance Rate (%)"
                stroke="var(--color-attendance)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Course Performance Insights:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {totalCourses > 10
                  ? `Strong course offering with ${totalCourses} total courses`
                  : `Limited course catalog with only ${totalCourses} courses`}
              </li>
              <li>
                {avgAttendance > 85
                  ? `Excellent attendance rate of ${avgAttendance}%`
                  : `Attendance rate of ${avgAttendance}% needs improvement`}
              </li>
              <li>
                Highest attendance in {highestAttendanceMonth.month} ({highestAttendanceMonth.attendance}%)
              </li>
            </ul>
          </div>
          <div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {utilizationRate > 90
                  ? `Near capacity at ${utilizationRate}% utilization`
                  : utilizationRate > 70
                    ? `Good capacity utilization at ${utilizationRate}%`
                    : `Underutilized capacity at ${utilizationRate}%`}
              </li>
              <li>
                {data.some((item) => item.courses === 0)
                  ? "Some months have no courses scheduled"
                  : "Consistent course scheduling throughout the period"}
              </li>
              <li>
                {courseType !== "All"
                  ? `${courseType} courses show ${avgAttendance > 85 ? "strong" : "average"} performance metrics`
                  : "Consider focusing resources on high-demand course types"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

