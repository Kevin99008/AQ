"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, UserPlus, Users, BookOpen, Menu, ScanFace, LogOut, WavesLadder, Music4, BookA, GraduationCap, BookPlus, ArchiveRestore, Pencil, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import useUserSession from "@/stores/user";
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter();

  const handleLogout = () => {
    useUserSession.getState().logout()
    push("/login")
  }

  const NavItems = () => (
    <ul className="space-y-2">
      <li>
        <Link href="/admin/checkAttendance" className="flex items-center space-x-2 px-2 py-4 place-content-center bg-green-500 rounded hover:bg-green-700">
          <ScanFace size={20} />
          <span>Check Attendance</span>
        </Link>
      </li>
      <li className="h-1 bg-white rounded-2xl"></li>
      <li>
        <Link href="/admin/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
      </li>
      <li className="h-1 bg-white rounded-2xl"></li>
      <li>
        <Link href="/admin/modifyAttendance" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Settings2 size={20} />
          <span>edit Attendance</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/createAccount" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <UserPlus size={20} />
          <span>Create Account</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/userList" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Users size={20} />
          <span>Users List</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/teacherList" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Users size={20} />
          <span>Teachers List</span>
        </Link>
      </li>
      <li className="h-1 bg-white rounded-2xl"></li>
      <li>
        <Link href="/admin/uploadCertificate" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <GraduationCap size={20} />
          <span>Certificate</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/enrollCourse" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <BookOpen size={20} />
          <span>Enroll Courses</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/createCourse" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <BookPlus size={20} />
          <span>Create Courses</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/storage" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <ArchiveRestore size={20} />
          <span>Storages</span>
        </Link>
      </li>
      <li className="h-1 bg-white rounded-2xl"></li>
      <li>
        <Button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-red-500 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </li>
    </ul>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-800 text-white p-4 h-screen overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-white">Admin Panel</SheetTitle>
      </SheetHeader>
      <nav className="mt-6">
        <NavItems />
      </nav>
    </SheetContent>

      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 text-white p-4 h-screen overflow-y-auto"> {/* Added scrollable container */}
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav>
          <NavItems />
        </nav>
      </div>
    </>
  )
}

