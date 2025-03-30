'use client'
import Link from "next/link";
import { ArchiveRestore, BookOpen, BookPlus, GraduationCap, Home, LogOut, ScanFace, Settings, Settings2, Users } from "lucide-react";
import useUserSession from "@/stores/user";
import { useRouter } from "next/navigation"

interface NavCardProps {
    icon: React.ReactNode;
    name: string;
    href: string;
}

const NavCard: React.FC<NavCardProps> = ({ icon, name, href }) => {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md transition hover:bg-gray-100 w-36"
        >
            <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full">
                {icon}
            </div>
            <span className="mt-3 text-base font-medium">{name}</span>
        </Link>
    );
};

export default function AdminPanel() {

    return (
        <div className="flex flex-col">
            {/* Navbar */}

            {/* Navigation Cards */}
            <div className="flex-grow flex items-center justify-center">
                <div className="space-y-10">
                    <div className="flex gap-6 w-full max-w-lg justify-center">
                        <NavCard icon={<Home size={28} />} name="Dashboard" href="dashboard" />
                        <NavCard icon={<ScanFace size={28} />} name="Check Attendance" href="checkAttendance" />
                        <NavCard icon={<Settings2 size={28} />} name="Edit Attendance" href="modifyAttendance" />
                    </div>
                    <div className="flex gap-6 w-full max-w-lg justify-center">
                        <NavCard icon={<Users size={28} />} name="User List" href="userList" />
                        <NavCard icon={<Users size={28} />} name="Unit-User" href="unit-user" />
                        <NavCard icon={<Users size={28} />} name="Teacher List" href="teacherList" />
                        <NavCard icon={<Users size={28} />} name="Unit-Teacher" href="unit-teacher" />
                        <NavCard icon={<ArchiveRestore size={28} />} name="Storage" href="storage" />
                    </div>
                    <div className="flex gap-6 w-full max-w-lg justify-center">
                        <NavCard icon={<BookOpen size={28} />} name="Enroll Courses" href="enrollCourse" />
                        <NavCard icon={<BookPlus size={28} />} name="Create Courses" href="createCourse" />
                        <NavCard icon={<GraduationCap size={28} />} name="Upload Certificate" href="uploadCertificate" />
                    </div>
                </div>
            </div>
        </div>
    );
}
