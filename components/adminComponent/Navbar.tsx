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

    return(
        <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
        </button>
        </div>
    )
}