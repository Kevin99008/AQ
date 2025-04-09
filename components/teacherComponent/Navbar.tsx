'use client'
import useUserSession from "@/stores/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const { push } = useRouter();

    const handleLogout = () => {
        useUserSession.getState().logout()
        push("/login")
    }

    const handleNavigateToAdmin = () => {
        push("/teacher/assignment")  // Navigate to /admin page
    }

    return (
        <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
            {/* Clickable Admin Panel heading */}
            <h1
                className="text-lg font-semibold cursor-pointer"
                onClick={handleNavigateToAdmin}  // On click, navigate to /admin
            >
                Teacher Panel
            </h1>
            <button
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleLogout}
            >
                <LogOut size={18} />
                Logout
            </button>
        </div>
    )
}
