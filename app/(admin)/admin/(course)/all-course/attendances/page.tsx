"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ThankYouPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          // Redirect to courses page
          router.push("/admin/all-courses")
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    // Clean up timer on component unmount
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You for Enrolling!</h1>

        <p className="text-gray-600 mb-6">
          Your enrollment has been successfully processed. You will be redirected to the courses page in {countdown}{" "}
          seconds.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          ></div>
        </div>

        <button
          onClick={() => router.push("/admin/all-course")}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Go to Courses Now
        </button>
      </div>
    </div>
  )
}
