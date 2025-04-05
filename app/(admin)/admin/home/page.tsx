'use client'
import Link from "next/link";
import { ArchiveRestore, Book, BookA, BookAIcon, BookCheck, BookOpen, BookPlus, GraduationCap, Home, LogOut, ScanFace, Settings, Settings2, Users } from "lucide-react";
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
        <div className="flex flex-col w-full"> {/* Add a full-width background color */}
            {/* Navbar */}
    
            {/* Navigation Cards */}
            <div className="flex-grow">
                <div className="space-y-10 w-full px-4"> {/* Add padding to create space on the sides */}
                    {/* Green background group */}
                    <div className="w-full bg-green-100 rounded-md p-4">
                        <div className="flex gap-6 w-full max-w-6xl mx-auto justify-center">
                            <NavCard icon={<Home size={28} />} name="Dashboard" href="dashboard" />
                            <NavCard icon={<ScanFace size={28} />} name="Check Attendance" href="checkAttendance" />
                            <NavCard icon={<Settings2 size={28} />} name="Edit Attendance" href="modifyAttendance" />
                        </div>
                    </div>
    
                    {/* Blue background group */}
                    <div className="w-full bg-blue-100 rounded-md p-4">
                        <div className="flex gap-6 w-full max-w-6xl mx-auto justify-center">
                            <NavCard icon={<Users size={28} />} name="Unit-User" href="unit-user" />
                            <NavCard icon={<Users size={28} />} name="Unit-Teacher" href="unit-teacher" />
                            <NavCard icon={<ArchiveRestore size={28} />} name="Storage" href="storage" />
                        </div>
                    </div>
    
                    {/* Orange background group */}
                    <div className="w-full bg-orange-100 rounded-md p-4">
                        <div className="flex gap-6 w-full max-w-6xl mx-auto justify-center">
                            <NavCard icon={<Book size={28} />} name="All Courses" href="all-course" />
                            <NavCard icon={<BookA size={28} />} name="Progress Courses" href="unit-course" />
                            <NavCard icon={<BookCheck size={28} />} name="Schedule Courses" href="scheduleCourse" />
                            <NavCard icon={<GraduationCap size={28} />} name="Upload Certificate" href="uploadCertificate" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
