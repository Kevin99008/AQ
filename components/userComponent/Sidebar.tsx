"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, BookOpen, GraduationCap, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = () => (
    <ul className="space-y-2">
      <li>
        <Link
          href="/home"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home" ? "bg-primary/10 text-primary" : "",
          )}
          onClick={() => setIsOpen(false)}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/progress"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home/progress" || pathname.startsWith("/home/progress/") ? "bg-primary/10 text-primary" : "",
          )}
          onClick={() => setIsOpen(false)}
        >
          <BookOpen size={20} />
          <span>Course Progress</span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/completed"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home/completed" || pathname.startsWith("/home/completed/") ? "bg-primary/10 text-primary" : "",
          )}
          onClick={() => setIsOpen(false)}
        >
          <GraduationCap size={20} />
          <span>Completed Courses</span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/profile"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home/profile" ? "bg-primary/10 text-primary" : "",
          )}
          onClick={() => setIsOpen(false)}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
      </li>
      <li className="mt-auto pt-4">
        <Link
          href="/"
          className="flex items-center space-x-2 p-2 rounded hover:bg-destructive/10 text-destructive"
          onClick={() => setIsOpen(false)}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </li>
    </ul>
  )

  return (
    <>
      {/* Mobile Sidebar Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4 bg-gray-800 text-white">
          <SheetHeader>
            <SheetTitle>Course Management</SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r h-screen sticky top-0 p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-6">Course Management</h1>
        <nav>
          <NavItems />
        </nav>
      </div>
    </>
  )
}

