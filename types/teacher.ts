export interface Session {
    session_id: number
    course: string
    session_date: string
    start_time: string
    end_time: string
    total_quota: number
  }
  
  export interface Teacher {
    id: number
    name: string
    username: string
    status: string
    category: string
    contact: string
    sessions: Session[]
  }  