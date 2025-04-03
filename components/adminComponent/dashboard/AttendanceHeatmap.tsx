"use client"

import { useState, useEffect } from "react"

interface AttendanceHeatmapProps {
  category?: string
}

export default function AttendanceHeatmap({ category = "All" }: AttendanceHeatmapProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const timeSlots = ["10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"] // Time slots

  // State for attendance data
  const [heatmapData, setHeatmapData] = useState<{ [key: string]: { [key: string]: number } }>({})

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://aqtech-production.up.railway.app/api/attendance-heatmap/?category=${category}`)
        const data = await response.json()
        setHeatmapData(data)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
      }
    }

    fetchData()
  }, [category])

  // Function to determine color based on raw count value
  const getColor = (value: number) => {
    if (value >= 15) return "bg-emerald-500/90"   // Very high count
    if (value >= 12) return "bg-emerald-400/80"   // High count
    if (value >= 10) return "bg-emerald-300/70"   // Medium-high count
    if (value >= 8) return "bg-amber-400/70"      // Medium count
    if (value >= 6) return "bg-amber-300/60"      // Low-medium count
    if (value >= 4) return "bg-amber-200/50"      // Very low-medium count
    return "bg-rose-300/50"                       // Low count
  }

  // Function to determine text color based on background
  const getTextColor = (value: number) => {
    return value >= 8 ? "text-white" : "text-gray-800" // Dark text for low counts
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <div className="min-w-[300px] sm:min-w-full">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1">
          {/* Header row with days */}
          <div className="h-8"></div>
          {days.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center font-medium text-xs sm:text-sm">
              {day}
            </div>
          ))}

          {/* Time slots and heatmap cells */}
          {timeSlots.map((time) => (
            <div key={time} className="contents">
              <div className="h-8 sm:h-10 flex items-center justify-end pr-2 text-xs text-muted-foreground">
                {time}
              </div>
              {days.map((day) => {
                const value = heatmapData[day]?.[time] || 0
                return (
                  <div
                    key={`${day}-${time}`}
                    className={`h-8 sm:h-10 rounded flex items-center justify-center text-xs font-medium ${getColor(value)} ${getTextColor(value)}`}
                    title={`${day} at ${time}: ${value} attendance`}
                  >
                    {value}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-rose-300/50 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-200/50 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-300/60 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400/70 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-300/70 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400/80 rounded"></div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500/90 rounded"></div>
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  )
}
