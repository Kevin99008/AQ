export interface AttendanceRecord {
    id: number;
    name: string;
    timestamp: string;
    course: string;
  }
  
  export interface StudentData {
    month: string;
    students: number;
  }
  
  export interface CourseData {
    month: string;
    courses: number;
  }
  
  export interface PieChartData {
    name: string;
    value: number;
  }
  
  export interface StatisticsData {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newStudents: number;
  }
  