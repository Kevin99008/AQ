"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import type { Session } from "@/types/teacher"

interface SessionListProps {
  sessions: Session[]
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return <p className="text-muted-foreground text-sm">No sessions found</p>
  }

  return (
    <div className="space-y-3 mb-4">
      {sessions.map((session) => (
        <Card key={session.session_id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{session.course}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{session.session_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {session.start_time} - {session.end_time}
                  </span>
                </div>
              </div>
              <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Quota: {session.total_quota}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

