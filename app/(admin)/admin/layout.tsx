import type React from "react"
import Sidebar from "@/components/adminComponent/Sidebar"
import Navbar from "@/components/adminComponent/Navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <main className="flex-1 overflow-y-auto">
      <Navbar />
      <div className="p-10">
        {children}
      </div>
    </main>

  )
}

