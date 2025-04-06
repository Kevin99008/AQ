"use client"

import type React from "react"

import { Droplets, Music, Sparkles } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import defaultImg from "@/assets/logo.png"
import { cn } from "@/lib/utils"
import type { StudentCertRaw } from "@/types/user"

interface CertificateUploaderProps {
  selectedStudent: StudentCertRaw | null
  selectedCourse: any | null
  categories: any[]
  onImageUpload: (imageUrl: string, file: File | null) => void
  imageUrl: string
}

export function CertificateUploader({
  selectedStudent,
  selectedCourse,
  categories,
  onImageUpload,
  imageUrl,
}: CertificateUploaderProps) {
  // Get category name from category ID
  function getCategoryName(categoryId: number, categories: any[]): string {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.categoryName : "Other"
  }

  // Get category icon based on category name
  function getCategoryIcon(categoryName: string): React.ReactNode {
    switch (categoryName.toLowerCase()) {
      case "aquakids":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "playsound":
        return <Music className="h-4 w-4 text-orange-500" />
      default:
        return <Sparkles className="h-4 w-4 text-pink-500" />
    }
  }

  // Get badge style for category
  function getCategoryBadgeStyle(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
      case "aquakids":
        return "bg-blue-100 text-blue-700"
      case "playsound":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-pink-100 text-pink-700"
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileNameWithUnderscores = file.name.replace(/\s+/g, "_")
      const newFile = new File([file], fileNameWithUnderscores, { type: file.type })

      onImageUpload(URL.createObjectURL(newFile), newFile)
    } else {
      onImageUpload("", null)
    }
  }

  if (!selectedStudent || !selectedCourse) return null

  const categoryName = getCategoryName(selectedCourse.category, categories)

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-md bg-muted/50">
        <h3 className="font-medium mb-1">Student</h3>
        <p>{selectedStudent.name}</p>
        <p className="text-sm text-muted-foreground">
          Born: {new Date(selectedStudent.birthdate).toLocaleDateString()}
        </p>
      </div>

      <div className="p-3 border rounded-md bg-muted/50">
        <h3 className="font-medium mb-1">Course</h3>
        <div className="flex items-center gap-2 mb-1">
          <p>{selectedCourse.name}</p>
          <Badge className={cn("text-xs font-medium", getCategoryBadgeStyle(categoryName))}>{categoryName}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            {getCategoryIcon(categoryName)}
            <span>Category: {categoryName}</span>
          </div>
          <span>Type: {selectedCourse.type === "restricted" ? "Age Restricted" : "All Ages"}</span>
          <span>Quota: {selectedCourse.quota} students</span>
          <span>Created: {new Date(selectedCourse.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="p-3 border rounded-md bg-muted/50">
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && (
          <Image
            src={imageUrl || defaultImg}
            alt="Uploaded Certificate"
            width={1000}
            height={0}
            className="rounded-md mt-3"
          />
        )}
      </div>
    </div>
  )
}

