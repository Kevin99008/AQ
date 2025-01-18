'use client'
import React from 'react';
import classes from './attendanceLog.module.css'; // Import CSS module

// Define the type for an attendance record
interface AttendanceRecord {
    id: number;
    name: string;
    timestamp: string;
}

// Props for the component
interface AttendanceHistoryProps {
    records: AttendanceRecord[]; // Array of attendance records
}

export default function AttendanceLog({ records }: AttendanceHistoryProps) {
    return (
        <div className={classes.container}>
            <h2>Attendance History</h2>
            {records.length > 0 ? (
                <table className={classes.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>{record.name}</td>
                                <td>{record.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No attendance records available.</p>
            )}
        </div>
    );
}
