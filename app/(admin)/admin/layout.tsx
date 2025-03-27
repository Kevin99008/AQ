import type React from "react"
import Sidebar from "@/components/adminComponent/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <main className="flex-1 overflow-y-auto">{children}</main>

  )
}

