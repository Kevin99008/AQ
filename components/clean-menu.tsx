"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Info, ShoppingBag, Mail, User, Droplets, Calendar, LifeBuoy, ShieldCheck, Shirt, ScanFace, GraduationCap, ArchiveRestore, BookA, Book, Glasses, Receipt } from "lucide-react"

interface MenuItemProps {
    icon: React.ReactNode
    label: string
    href: string
    color: string
    bgColor: string
    hoverColor: string
}

const menuItems: MenuItemProps[][] = [
    [
        {
            icon: <Home className="h-10 w-10" />,
            label: "Dashboard",
            href: "/admin/dashboard",
            color: "text-sky-600",
            bgColor: "bg-sky-50",
            hoverColor: "group-hover:bg-sky-100",
        },
        {
            icon: <ScanFace className="h-10 w-10" />,
            label: "Check-in",
            href: "/admin/checkAttendance",
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            hoverColor: "group-hover:bg-cyan-100",
        },
        {
            icon: <BookA className="h-10 w-10" />,
            label: "Courses",
            href: "/admin/unit-course",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            hoverColor: "group-hover:bg-blue-100",
        },
        {
            icon: <Calendar className="h-10 w-10" />,
            label: "Enrollment",
            href: "/admin/all-course",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            hoverColor: "group-hover:bg-indigo-100",
        },
        {
            icon: <ArchiveRestore className="h-10 w-10" />,
            label: "Storage",
            href: "/admin/storage",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            hoverColor: "group-hover:bg-orange-100",
        },
    ],
    [
        {
            icon: <User className="h-10 w-10" />,
            label: "Students",
            href: "/admin/unit-user",
            color: "text-violet-600",
            bgColor: "bg-violet-50",
            hoverColor: "group-hover:bg-violet-100",
        },
        {
            icon: <Glasses className="h-10 w-10" />,
            label: "Teachers",
            href: "/admin/unit-teacher",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            hoverColor: "group-hover:bg-emerald-100",
        },
        {
            icon: <GraduationCap className="h-10 w-10" />,
            label: "Certificates",
            href: "/admin/uploadCertificate",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            hoverColor: "group-hover:bg-amber-100",
        },
        {
            icon: <Receipt className="h-10 w-10" />,
            label: "Receipts",
            href: "/admin/receipts",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            hoverColor: "group-hover:bg-orange-100",
        },
    ],
]

export function CleanMenu() {
    return (
        <div className="flex flex-col items-center justify-center w-full gap-8">
            {menuItems.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap justify-center gap-4 w-full max-w-4xl">
                    {row.map((item, itemIndex) => (
                        <motion.div
                            key={`${rowIndex}-${itemIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: (rowIndex * 5 + itemIndex) * 0.05,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            }}
                            className="relative"
                        >
                            <Link
                                href={item.href}
                                className={`group flex flex-col items-center justify-center w-36 h-36 p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-sky-100 text-gray-800 hover:border-${item.color.split("-")[1]}-200 transition-all duration-300`}
                            >
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-full ${item.bgColor} ${item.hoverColor} mb-3 ${item.color} transition-colors duration-300`}
                                >
                                    {item.icon}
                                </div>
                                <span className="text-sm font-medium">{item.label}</span>
                                <motion.div
                                    className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.bgColor.replace("bg-", "var(--")} 0%, white 100%)`,
                                        borderRadius: "1rem",
                                    }}
                                />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    )
}
