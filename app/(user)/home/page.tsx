import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/userComponent/user-avatar"

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-end mb-6">
        <UserAvatar />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">AquaCube Course Management</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Track your children&apos;s educational progress and achievements
        </p>
      </div>

      <div className="grid gap-6 pt-12 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div className="grid gap-1">
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Track ongoing courses</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View your children&apos;s progress in current courses, including attendance and completion status.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/home/progress" className="w-full">
              <Button className="w-full">
                View Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="grid gap-1">
              <CardTitle>Completed Courses</CardTitle>
              <CardDescription>View certifications</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access completed courses and view certificates for your children&apos;s achievements.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/home/completed" className="w-full">
              <Button className="w-full">
                View Completed
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <div className="grid gap-1">
              <CardTitle>Profile</CardTitle>
              <CardDescription>View account details</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View your information and your children&apos;s profiles.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/home/profile" className="w-full">
              <Button className="w-full">
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

