import React from 'react';
import classes from './memberList.module.css'; // Import CSS module

// Define the type for a member
interface Member {
    id: number;
    name: string;
    email: string;
}

// Props for the component
interface MemberListProps {
    members: Member[]; // Array of members
}

export default function MemberList({ members }: MemberListProps) {
    return (
        <div className={classes.container}>
            <h2 className={classes.heading}>Member List</h2>
            {members.length > 0 ? (
                <div className={classes.tableContainer}>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No members found.</p>
            )}
        </div>
    );
}
