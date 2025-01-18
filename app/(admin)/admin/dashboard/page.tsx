import PieChart from "@/components/graph/pieChart";
import StaticGraph from "@/components/graph/staticGraph";
import AttendanceLog from "@/components/attendance/attendanceLog";
import classes from './page.module.css'
import MemberList from "@/components/list/memberList";

export default function dashboardAdmin(){
    const attendanceRecords = [
        { id: 1, name: 'John Doe', timestamp: '2025-01-18 10:00 AM' },
        { id: 2, name: 'Jane Smith', timestamp: '2025-01-18 10:15 AM' },
        { id: 3, name: 'Alice Johnson', timestamp: '2025-01-18 10:30 AM' },
        { id: 4, name: 'Bob Brown', timestamp: '2025-01-18 10:45 AM' },
    ];

    const members = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
        { id: 4, name: 'Bob Brown', email: 'bob.brown@example.com' },
        { id: 5, name: 'Charlie Black', email: 'charlie.black@example.com' },
        { id: 6, name: 'Diana White', email: 'diana.white@example.com' },
        { id: 7, name: 'Edward Green', email: 'edward.green@example.com' },
        { id: 8, name: 'Fiona Blue', email: 'fiona.blue@example.com' },
        { id: 9, name: 'George Gray', email: 'george.gray@example.com' },
        { id: 10, name: 'Hannah Yellow', email: 'hannah.yellow@example.com' },
        // Add more members as needed
    ];
    return (<main className={classes.container}>
        <div className={classes.minorContainer}>
            <StaticGraph />
            <PieChart />
        </div>
        <div className={classes.minorContainer}>
                {/* Pass the attendanceRecords as props */}
                <AttendanceLog records={attendanceRecords} />
                <MemberList members={members} />
                <MemberList members={members} />
        </div>
    </main>)
}