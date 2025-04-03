import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function HomePage() {
  return (
    <div className="container mx-auto">

      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-6">AquaCube Course Progression</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Track your children&apos;s educational progress and View Certificate
        </p>
      </div>

      <div className="grid gap-6 pt-12 ">
        <Card className="bg-green-100">
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

        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center gap-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div className="grid gap-1">
              <CardTitle>Certificate</CardTitle>
              <CardDescription>View course certificates</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access certificates for your children.
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

        <Card className="bg-orange-100">
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

