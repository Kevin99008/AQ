"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import useUserSession from "@/stores/user";
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const { push } = useRouter();

  const handleLogout = () => {
    useUserSession.getState().logout()
    push("/login")
  }

  const NavItems = () => (
    <ul className="space-y-2">
      <li>
        <Link
          href="/home"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home" ? "bg-primary/50 text-white" : "",
          )}
          onClick={() => setIsOpen(false)} // Close sidebar on click
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link
          href="/home/profile"
          className={cn(
            "flex items-center space-x-2 p-2 rounded hover:bg-primary/10",
            pathname === "/home/profile" ? "bg-primary/50 text-white" : "",
          )}
          onClick={() => setIsOpen(false)} // Close sidebar on click
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
      </li>
      <li className="mt-auto pt-4">
        <Button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-red-500 w-full">
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
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
            <SheetTitle className="text-white">AquaCube Teacher</SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r h-screen sticky top-0 p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-6">AquaCube Teacher</h1>
        <nav>
          <NavItems />
        </nav>
      </div>
    </>
  )
}
