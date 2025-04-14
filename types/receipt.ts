interface ReceiptItem {
    description: string;
    amount: number;
  }
  
  // Receipt interface
  interface Receipt {
    id: string;
    receipt_number: string;
    amount: number;
    payment_method: string;
    notes: string;
    items: ReceiptItem[];
  }
  
  // Attendance interface
  interface Attendance {
    attendance_id: number;
    timeslot_id: number;
    date: string;
    start_time: string;
    end_time: string;
  }
  
  // Session interface
  interface Session {
    session_id: number;
    student_id: number;
    student_name: string;
    course_name: string;
    receipt: Receipt;
    attendances: Attendance[];
  }
  
  // API Response interface
 export interface ApiReceiptResponse {
    message: string;
    session_count: number;
    sessions: Session[];
  }