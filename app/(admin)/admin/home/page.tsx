'use client'
import Link from "next/link";
import { Home, LogOut, Settings, Users } from "lucide-react";
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

    const { push } = useRouter();

    const handleLogout = () => {
        useUserSession.getState().logout()
        push("/login")
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
                <h1 className="text-lg font-semibold">Admin Panel</h1>
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            {/* Navigation Cards */}
            <div className="flex-grow flex items-center justify-center">
                <div className="flex gap-6 w-full max-w-lg justify-center">
                    <NavCard icon={<Home size={28} />} name="Dashboard" href="/" />
                    <NavCard icon={<Users size={28} />} name="Users" href="/users" />
                    <NavCard icon={<Settings size={28} />} name="Settings" href="/settings" />
                </div>
            </div>
        </div>
    );
}
