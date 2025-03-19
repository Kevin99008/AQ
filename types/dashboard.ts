export interface AttendanceRecord {
    courseType: any;
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
    totalStudent: number;
    activeStudent: number;
    inactiveStudent: number;
    newStudents: number;
  }
  