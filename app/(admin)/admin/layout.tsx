"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import Navbar from "@/components/adminComponent/Navbar"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // Check if we're on the home page
  const isHomePage = pathname === "/" || pathname === "/admin/home"

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-white mr-2 w-full px-4">
              <ChevronLeft size={20} /> Back
            </Button>
          )}
        </div>

        {/* Always show the Navbar, even on the home page */}
        <Navbar />
      </div>

      <main className="">
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
