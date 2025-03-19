"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Clock, User, ArrowLeft, CheckCircle, XCircle, HashIcon } from "lucide-react"
import { format } from "date-fns"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import 'react-toastify/dist/ReactToastify.css';
// Define types based on the JSON structure
interface Attendance {
    id: number
    status: string
    session: number
    student: number
    teacher: number
    attendance_date: string
    start_time: string
    end_time: string
    checked_date: string | null
}

interface Session {
    id: number
    course: number
    teacher: number
    student: number
    session_date: string
    session_name: string
    total_quota: number
    start_time: string
    end_time: string
    attendances: Attendance[]
}

interface Student {
    id: number
    user: number
    name: string
    username: string
    birthdate: string
    sessions: Session[]
}

const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
]



export default function ModifyAttendancePage() {
    const [studentsData, setStudentsData] = useState<Student[]>([])
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [selectedSession, setSelectedSession] = useState<Session | null>(null)
    const [view, setView] = useState<"students" | "sessions" | "attendances">("students")
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchCourseQuery, setSearchCourseQuery] = useState("")
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [date, setDate] = useState(new Date())

    const filteredStudent = studentsData.filter(
        (student) =>
            (student.name?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()) ||
            (student.username?.toLowerCase() || "").includes((searchQuery || "").toLowerCase()),

    )

    const filteredCourse = selectedStudent?.sessions.filter(
        (course) =>
            (course.session_name?.toLowerCase() || "").includes((searchCourseQuery || "").toLowerCase()),
    )

    async function loadData() {
        try {
            setIsLoading(true)

            const studentsData = await apiFetch<Student[]>('/api/attendance-all');
            if (studentsData !== TOKEN_EXPIRED) {
                setStudentsData(studentsData);  // Set data only if the token is not expired
            }


        } catch (err: any) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong");
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleStudentClick = (student: Student) => {
        setSelectedStudent(student)
        setSelectedSession(null)
        setView("sessions")
    }

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session)
        setView("attendances")
    }

    const handleBackToStudents = () => {
        setSelectedStudent(null)
        setSelectedSession(null)
        setView("students")
    }

    const handleBackToSessions = () => {
        setSelectedSession(null)
        setView("sessions")
    }

    const handleCancel = () => {
        if (isInputVisible === true) {
            setIsInputVisible(false);
            setSelectedTime("")
            setDate(new Date())
        } else {
            setIsInputVisible(true);
        }
    };

    const handleConfirmAction = async () => {
        const toastId = toast.info(
            <div className="flex flex-col items-center">
                <p className="mb-2 text-center">Are you sure you want to add this makeup class?</p>
                <div className="flex w-full sm:w-auto sm:flex-row p-4 space-x-2">
                    <button
                        onClick={handleMakeUpClass}
                        className="flex items-center justify-center w-24 px-4 py-2 text-sm font-bold bg-green-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none hover:shadow-lg hover:-translate-y-1"
                    >
                        Confirm
                    </button>

                    <button
                        onClick={() => toast.dismiss(toastId)}
                        className="flex items-center justify-center w-24 px-4 py-2 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-sm cursor-pointer border-green-300 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none hover:shadow-lg hover:-translate-y-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Do not auto-close, wait for user action
                closeOnClick: false, // Disable click to close
                draggable: false,
            }
        );
    };

    const handleMakeUpClass = async () => {
        if (!selectedSession || !date || !selectedTime) {
            toast.error("Please selected time and date")
            return
        }

        try {
            const bangkokOffset = 7 * 60;
            const localTimeDate = new Date(date.getTime() + bangkokOffset * 60 * 1000)
            console.log(encodeURIComponent(localTimeDate.toISOString()))
            const responseData = await apiFetch<Attendance>('/api/attendance-create/', "POST", {
                session_id: selectedSession.id, // Ensure this is defined
                date: encodeURIComponent(localTimeDate.toISOString()),  // Current date in ISO format
                start_time: selectedTime, // Example time, adjust as needed
            });
            if (responseData !== TOKEN_EXPIRED) {
                setSelectedSession((prevSession) => {
                    if (!prevSession) {
                        const newSession = {
                            ...selectedSession, // Ensure selectedSession is not null before calling handleMakeUpClass
                            attendances: [responseData], // Start with a new array containing the response
                        };

                        // After updating the session, update selectedStudent to reflect the new session data
                        setSelectedStudent((prevStudent) => {
                            if (prevStudent) {
                                return {
                                    ...prevStudent,
                                    sessions: prevStudent.sessions.map((session) =>
                                        session.id === selectedSession.id ? newSession : session
                                    ),
                                };
                            }
                            return prevStudent; // If no student is selected, leave it unchanged
                        });

                        return newSession;
                    } else {
                        const updatedSession = {
                            ...prevSession,
                            attendances: [...prevSession.attendances, responseData], // Append the new attendance
                        };

                        // After updating the session, update selectedStudent to reflect the new session data
                        setSelectedStudent((prevStudent) => {
                            if (prevStudent) {
                                return {
                                    ...prevStudent,
                                    sessions: prevStudent.sessions.map((session) =>
                                        session.id === selectedSession.id ? updatedSession : session
                                    ),
                                };
                            }
                            return prevStudent; // If no student is selected, leave it unchanged
                        });

                        return updatedSession;
                    }
                });
                loadData()
                toast.success('class created successfully!');
            }

        } catch (err: any) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy")
        } catch (error) {
            return dateString
        }
    }

    const formatTime = (timeString: string) => {
        try {
            // Handle time format like "10:00:00"
            const [hours, minutes] = timeString.split(":")
            return `${hours}:${minutes}`
        } catch (error) {
            return timeString
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center items-center min-h-screen">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Attendance Management</h1>

                        {/* Breadcrumb navigation */}
                        <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                            <button
                                onClick={handleBackToStudents}
                                className={`flex items-center ${view === "students" ? "font-medium text-blue-600" : "hover:text-gray-700"}`}
                            >
                                Students
                            </button>

                            {view !== "students" && (
                                <>
                                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                                    <button
                                        onClick={view === "attendances" ? handleBackToSessions : undefined}
                                        className={`flex items-center ${view === "sessions" ? "font-medium text-blue-600" : "hover:text-gray-700"}`}
                                    >
                                        {selectedStudent?.name}'s Sessions
                                    </button>
                                </>
                            )}

                            {view === "attendances" && (
                                <>
                                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                                    <span className="font-medium text-blue-600">Session #{selectedSession?.id} Attendance</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="px-6 py-4">
                    {/* Students View */}
                    {view === "students" && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Student</h2>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search students..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudent.map((student) => (
                                    <div
                                        key={student.id}
                                        onClick={() => handleStudentClick(student)}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-3 mr-4 shadow-sm group-hover:shadow transition-shadow">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                                                        {student.name}
                                                    </h3>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <span className="inline-block bg-blue-50 text-blue-700 rounded-md px-2 py-0.5 font-medium">
                                                            @{student.username}
                                                        </span>
                                                    </div>

                                                    <div className="mt-3 space-y-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                            <span>Born: {formatDate(student.birthdate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-2.5 py-0.5">
                                                {student.sessions.length} Sessions
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sessions View */}
                    {view === "sessions" && selectedStudent && (
                        <div>
                            <div className="flex items-center mb-4">
                                <button
                                    onClick={handleBackToStudents}
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Students
                                </button>
                            </div>

                            <h2 className="text-lg font-medium text-gray-900 mb-2">{selectedStudent.name}'s Sessions</h2>
                            <div className="text-sm text-gray-500 mb-4">Select a session to view attendance records</div>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search sessions..."
                                        className="pl-8"
                                        value={searchCourseQuery}
                                        onChange={(e) => setSearchCourseQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredCourse?.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => handleSessionClick(session)}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-medium text-gray-900">{session.session_name}</h3>
                                            <div className="bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-2.5 py-0.5">
                                                {session.attendances.length} Records
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <HashIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                <span>Session: {session.id}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                <span>Start: {formatDate(session.session_date)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                <span>
                                                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attendance View */}
                    {view === "attendances" && selectedSession && (
                        <div>
                            <div className="flex items-center mb-4">
                                <button
                                    onClick={handleBackToSessions}
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Sessions
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                <h2 className="text-lg font-medium text-gray-900">Attendance for Session #{selectedSession.id}</h2>
                                <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                                    {formatDate(selectedSession.session_date)} • {formatTime(selectedSession.start_time)} -{" "}
                                    {formatTime(selectedSession.end_time)}
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="text-blue-600 hover:text-blue-800 "
                                >
                                    {isInputVisible ? "Cancel" : "Update Time"}
                                </button>
                            </div>

                            {isInputVisible && (
                                <div className="mt-4 mb-8">
                                    <div className="p-3 border rounded-md bg-muted/50">
                                        <h3 className="font-medium mb-1">Start Date</h3>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Select a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)}
                                                    className="rounded-md border"
                                                    classNames={{
                                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                                        day_today: "bg-accent text-accent-foreground",
                                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                                        day_disabled: "text-muted-foreground opacity-50",
                                                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                                        day_hidden: "invisible",
                                                        caption: "flex justify-center pt-1 relative items-center",
                                                        caption_label: "text-sm font-medium",
                                                        nav: "space-x-1 flex items-center",
                                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                                        table: "w-full border-collapse space-y-1",
                                                        head_row: "flex",
                                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                                        row: "flex w-full mt-2",
                                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <div className="space-y-2">
                                            <Label htmlFor="time-select">Select Time</Label>
                                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                                <SelectTrigger id="time-select">
                                                    <SelectValue placeholder="Select a time" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white">
                                                    {timeSlots.map((time, index) => (
                                                        <SelectItem className="hover:bg-gray-200" key={index} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <button
                                            onClick={handleConfirmAction}
                                            className="ml-2 px-4 py-2 bg-green-600 text-green-100 rounded-lg mt-4"
                                        >
                                            Makeup Class
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Student
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Teacher
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Time
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    Checked
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedSession.attendances.map((attendance) => (
                                                <tr key={attendance.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendance.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {attendance.status.toLowerCase() === "present" ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Present
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Absent
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Student #{attendance.student}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Teacher #{attendance.teacher}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(attendance.attendance_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatTime(attendance.start_time)} - {formatTime(attendance.end_time)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {attendance.checked_date ? formatDate(attendance.checked_date) : "Not checked"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

