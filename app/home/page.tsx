"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, FileText, User, Users } from "lucide-react"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("courses")

  const courses = [
    {
      id: 1,
      title: "Toddler Swimming Course",
      description:
        "Age-Appropriate Classes: Our programs cater to children from infancy up to 10 years old, focusing on water safety and swimming techniques tailored to each developmental stage.",
      quota: 10,
      completed: 7,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Piano Course",
      description:
        "Learn to play the piano with our comprehensive course designed for beginners to intermediate players.",
      quota: 10,
      completed: 5,
      color: "bg-purple-500",
    },
    {
      id: 3,
      title: "Guitar",
      description: "Master the guitar with our step-by-step lessons covering various styles and techniques.",
      quota: 10,
      completed: 0,
      color: "bg-green-500",
    },
  ]

  const certifications = [
    {
      id: 1,
      title: "Toddler Swimming Course",
      description: "Successfully completed the full program of water safety and swimming techniques.",
      completed: true,
    },
    {
      id: 2,
      title: "Piano Fundamentals",
      description: "Mastered the basics of piano playing and music theory.",
      completed: true,
    },
  ]

  const userProfile = {
    username: "john_doe",
    image: "/placeholder.svg",
    contacts: [
      { id: 1, name: "Alice", phone: "123-456-7890" },
      { id: 2, name: "Bob", phone: "987-654-3210" },
    ],
    kids: [
      { id: 1, name: "Tommy", age: 8 },
      { id: 2, name: "Lucy", age: 5 },
    ],
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-white shadow-md rounded-lg">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${course.color}`}
                    style={{ width: `${(course.completed / course.quota) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {course.completed} of {course.quota} classes completed
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: course.quota }).map((_, index) => (
                    <Badge
                      key={index}
                      variant={index < course.completed ? "default" : "outline"}
                      className={index < course.completed ? course.color : ""}
                    >
                      {index + 1}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="certifications" className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
                <CardDescription>{cert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Completed</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
                  <FileText className="mr-2 h-4 w-4" /> View Certificate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="profile">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 ring-2 ring-blue-500 ring-offset-2">
                  <AvatarImage src={userProfile.image} alt={userProfile.username} />
                  <AvatarFallback className="bg-blue-500 text-white text-2xl">
                    {userProfile.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{userProfile.username}</h3>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Contact List</h4>
                <ul className="space-y-2">
                  {userProfile.contacts.map((contact) => (
                    <li key={contact.id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>
                        {contact.name} - {contact.phone}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Kids</h4>
                <ul className="space-y-2">
                  {userProfile.kids.map((kid) => (
                    <li key={kid.id} className="flex items-center space-x-2 bg-white p-2 rounded-md shadow">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>
                        {kid.name} - {kid.age} years old
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

