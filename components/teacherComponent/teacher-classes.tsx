import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ClassItem {
  id: number
  name: string
  description: string
  min_age: number | null
  max_age: number | null
  type: "restricted" | "unrestricted"
}

export default function TeacherClasses({ classes }: { classes: ClassItem[] }) {
  if (!classes.length) {
    return <div className="text-center py-6 text-muted-foreground">No classes available for this teacher.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{classItem.name}</CardTitle>
              <Badge variant={classItem.type === "restricted" ? "secondary" : "outline"}>{classItem.type}</Badge>
            </div>
            {(classItem.min_age || classItem.max_age) && (
              <CardDescription>
                Age: {classItem.min_age ?? "Any"} - {classItem.max_age ?? "Any"}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm">{classItem.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

