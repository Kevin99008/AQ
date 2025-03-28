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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {!isHomePage && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-gray-700 mr-2">
              <ChevronLeft size={20} /> Back
            </Button>
          )}
        </div>

        {/* Always show the Navbar, even on the home page */}
        <Navbar />
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  )
}
