import type React from "react"
import Sidebar from "@/components/teacherComponent/Sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
  )
}

