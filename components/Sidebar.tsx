"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, UserPlus, Users, BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <ul className="space-y-2">
      <li>
        <Link href="/admin/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/createAccount" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <UserPlus size={20} />
          <span>Create Account</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/memberList" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <Users size={20} />
          <span>Members</span>
        </Link>
      </li>
      <li>
        <Link href="/admin/enrollCourse" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700">
          <BookOpen size={20} />
          <span>Courses</span>
        </Link>
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
        <SheetContent side="left" className="w-64 bg-gray-800 text-white p-4">
          <SheetHeader>
            <SheetTitle className="text-white">Admin Panel</SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav>
          <NavItems />
        </nav>
      </div>
    </>
  )
}

