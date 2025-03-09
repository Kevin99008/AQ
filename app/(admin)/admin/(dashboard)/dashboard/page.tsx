"use client";

import { useState, useEffect } from "react";
import StatisticsOverview from "@/components/dashboard/StatisticsOverview";
import MembershipPieChart from "@/components/dashboard/MembershipPieChart";
import NewStudentsBarChart from "@/components/dashboard/NewStudentsBarChart";
import NewCoursesBarChart from "@/components/dashboard/NewCoursesBarChart";
import AttendanceLog from "@/components/dashboard/AttendanceLog";
import AttendanceHistory from "@/components/dashboard/AttendanceHistory";
import { AttendanceRecord, StudentData, CourseData, PieChartData, StatisticsData } from "@/types/dashboard";
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceRecord | null>(null);
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [lastMonthData, setLastMonthData] = useState<StatisticsData>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    newStudents: 0
  });
  const [thisMonthData, setThisMonthData] = useState<StatisticsData>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    newStudents: 0
  });
  const [pieChartData, setPieData] = useState<PieChartData[]>([
    { name: "Teacher", value: 0 },
    { name: "Student", value: 0 }
  ]);
  const { push } = useRouter();
  
  useEffect(() => {
    // Simulated data fetching; replace this with your actual API call
    const fetchData = async () => {
      try {
        // Fetching last month and this month data
        const lastMonthResponse = await apiFetch<StatisticsData>('/api/static/count/');
        if (lastMonthResponse !== TOKEN_EXPIRED) {
          setLastMonthData(lastMonthResponse);  // Set data only if the token is not expired
        }
  
        const thisMonthResponse = await apiFetch<StatisticsData>('/api/static/count/');
        if (thisMonthResponse !== TOKEN_EXPIRED) {
          setThisMonthData(thisMonthResponse);  // Set data only if the token is not expired
        }
  
        const pieChartResponse = await apiFetch<PieChartData[]>('/api/static/pie');
        if (pieChartResponse !== TOKEN_EXPIRED) {
          setPieData(pieChartResponse);  // Set data only if the token is not expired
        }
  
        // Using static data for now
        const fetchedStudentData: StudentData[] = [
          { month: "Jan", students: 12 },
          { month: "Feb", students: 19 },
        ];
        setStudentData(fetchedStudentData);
  
        const fetchedCourseData: CourseData[] = [
          { month: "Jan", courses: 4 },
          { month: "Feb", courses: 3 },
        ];
        setCourseData(fetchedCourseData);
  
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const attendanceRecords = [
    { id: 1, name: "John Doe", timestamp: "2025-01-18 10:00 AM", course: "Mathematics 101" },
    { id: 2, name: "Jane Smith", timestamp: "2025-01-18 10:15 AM", course: "Physics 202" },
    { id: 3, name: "Alice Johnson", timestamp: "2025-01-18 10:30 AM", course: "Chemistry 301" },
    { id: 4, name: "Bob Brown", timestamp: "2025-01-18 10:45 AM", course: "Biology 102" },
    { id: 5, name: "Charlie Davis", timestamp: "2025-01-18 11:00 AM", course: "English Literature 201" },
    { id: 6, name: "Eva White", timestamp: "2025-01-18 11:15 AM", course: "Computer Science 401" },
    { id: 7, name: "Frank Miller", timestamp: "2025-01-18 11:30 AM", course: "History 301" },
    { id: 8, name: "Grace Taylor", timestamp: "2025-01-18 11:45 AM", course: "Art 101" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-4">
          <StatisticsOverview lastMonthData={lastMonthData} thisMonthData={thisMonthData} />      
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <NewStudentsBarChart data={studentData} />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <NewCoursesBarChart data={courseData} />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <AttendanceLog records={attendanceRecords} onSelectAttendance={setSelectedAttendance} />
        </div>
        <div className="md:col-span-2 lg:col-span-2 ">
          <MembershipPieChart data={pieChartData}/>
        </div>
      </div>
      {selectedAttendance && (
        <AttendanceHistory record={selectedAttendance} onClose={() => setSelectedAttendance(null)} />
      )}
    </div>
  );
}
