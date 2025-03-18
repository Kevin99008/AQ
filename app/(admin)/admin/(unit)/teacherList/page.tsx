"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MemberList from "@/components/dashboard/MemberList"
import MemberDetails from "@/components/dashboard/MemberDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"
import { apiFetch, TOKEN_EXPIRED } from "@/utils/api"
import { toast } from "react-toastify"
import { Member } from "@/types/member"

type UserResponse = {
  id: number
  username: string
  password: string
  email: string
  role: string
  first_name: string
  last_name: string
}

export default function MemberListPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [teacherSearch, setTeacherSearch] = useState("")
  const [teachers, setTeachers] = useState<Member[]>([])
  const { push } = useRouter();
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      username: "",
      contact: "",
      password: ""
    })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      console.log("Form submitted:", formData)
  
      try {
        const response = await apiFetch<UserResponse>("/api/teachers/create/", "POST", {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          contact: formData.contact,
          password: formData.contact,
        })
  
        if (response === TOKEN_EXPIRED) {
          push("/login")
        } else {
          setFormData({
            firstName: "",
            lastName: "",
            username: "",
            contact: "",
            password: ""
          })
          toast.success('teacher created successfully!');
        }
      } catch (error: any) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Something went wrong");   
        }
      }
    }
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes] = await Promise.all([
          fetch("http://localhost:8000/api/teachers/"),
        ])
  
        const [teachersData] = await Promise.all([
          teachersRes.json(),
        ])
  
        setTeachers(teachersData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      }
    }
  
    fetchData()
  }, [])
  

const filteredTeachers = teachers.filter(
  (teacher) => teacher.name && teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
)

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Teacher List</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Input
            type="text"
            placeholder="Search teachers..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            className="mb-4"
          />
          <MemberList title="Teachers List" members={filteredTeachers} onSelectMember={setSelectedMember} />
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create Account For Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Phone number</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-black text-white">
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {selectedMember && <MemberDetails member={selectedMember} onClose={() => setSelectedMember(null)} />}
    </div>
  )
}
