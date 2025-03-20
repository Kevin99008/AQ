export interface AttendanceRecord {
    courseType: any;
    id: number;
    name: string;
    studentId: number;
    timestamp: string;
    course: string;
  }
  
  export interface StudentData {
    month: string;
    students: number;
  }
  
  export interface CourseData {
    capacity: number;
    attendance: number;
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
  
  export interface CoursePopularityData {
    name: string;
    popularity: number;
    students: number;
    type: string;
  }
  