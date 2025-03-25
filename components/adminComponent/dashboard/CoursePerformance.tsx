"use client";

import { useState, useEffect } from "react";
import type { CourseData, CoursePopularityData } from "@/types/dashboard";
import { BookOpen, Users, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api";

interface CoursePerformanceProps {
  courseType: string;
}

export default function CoursePerformance({ courseType }: CoursePerformanceProps) {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [coursePopularityData, setCoursePopularityData] = useState<CoursePopularityData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch<{
          courseData: CourseData[];
          coursePopularityData: CoursePopularityData[];
        }>(`/api/course-performance/?courseType=${courseType}`);

        if (response !== TOKEN_EXPIRED) {
          const typedResponse = response as {
            courseData: CourseData[];
            coursePopularityData: CoursePopularityData[];
          };
          setCourseData(typedResponse.courseData || []);
          setCoursePopularityData(typedResponse.coursePopularityData || []);
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      }
    };

    fetchData();
  }, [courseType]);

  // Calculate metrics for the summary
  const totalCourses = courseData.reduce((sum, item) => sum + (item.courses || 0), 0);
  const validCourseData = courseData.filter((item) => item.courses > 0);
  const avgAttendance = validCourseData.length
    ? Math.round(
        validCourseData.reduce((sum, item) => sum + (item.attendance || 0), 0) / validCourseData.length
      )
    : 0;
  const totalCapacity = courseData.reduce((sum, item) => sum + (item.capacity || 0), 0);
  const utilizationRate = totalCapacity
    ? Math.round(
        (courseData.reduce((sum, item) => sum + (item.attendance || 0), 0) / totalCapacity) * 100
      )
    : 0;

  // Find the month with the highest attendance
  const highestAttendanceMonth = courseData.reduce(
    (max, item) => (item.attendance > (max?.attendance || 0) ? item : max),
    courseData[0] || { month: "N/A", attendance: 0 }
  );

  // Ensure coursePopularityData is an array and not undefined/null
  const popularityCourses = Array.isArray(coursePopularityData) ? coursePopularityData : [];

  // Function to get badge color based on course type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "AquaKids":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Playsound":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Other":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Function to get color based on course type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "AquaKids":
        return "hsl(210, 70%, 60%)";
      case "Playsound":
        return "hsl(270, 70%, 60%)";
      case "Other":
        return "hsl(45, 70%, 60%)";
      default:
        return "hsl(210, 70%, 60%)";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-muted/50 rounded-lg">
          <BookOpen className="h-8 w-8 text-primary mr-3" />
          <div>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Total Courses
              {courseType !== "All" && ` (${courseType})`}
            </p>
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

      <div>
        <h3 className="text-sm font-medium mb-3">Course Popularity Comparison</h3>
        <div className="space-y-4 p-2">
          {/* Course popularity bars */}
          <div className="space-y-3">
            {popularityCourses.map((course, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="font-medium flex items-center">
                    <span>{course.name}</span>
                    {courseType === "All" && (
                      <Badge className={`ml-2 ${getBadgeColor(course.type)}`} variant="outline">
                        {course.type}
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
                        courseType === "All"
                          ? getTypeColor(course.type)
                          : `hsl(${120 + index * 30}, 70%, 60%)`,
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
            ))}
          </div>
          <div className="text-xs text-muted-foreground pt-2">
            <p>Popularity is calculated based on enrollment rate, attendance, and student feedback.</p>
          </div>
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
                  : `Limited catalog with only ${totalCourses} courses`}
                {courseType !== "All" && ` in ${courseType}`}
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
                {courseData.some((item) => item.courses === 0)
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
  );
}