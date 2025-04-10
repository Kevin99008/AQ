import { CleanMenu } from "@/components/clean-menu"
import { Droplets } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat"
          style={{ backgroundImage: "url('/wave-pattern.svg')" }}
        />
      </div>

      {/* Swimming Lane Lines */}
      <div className="absolute inset-0 z-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute h-full w-px bg-blue-200/30" style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-sky-900 flex items-center">
              Admin Menu Panel
            </h1>
          </div>
        </div>

        <CleanMenu />
      </div>

      {/* Water Bubbles Animation */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-sky-300/20 z-0"
          style={{
            width: `${Math.random() * 50 + 20}px`,
            height: `${Math.random() * 50 + 20}px`,
            left: `${Math.random() * 100}%`,
            bottom: `-100px`,
            animation: `bubble ${Math.random() * 10 + 15}s linear ${Math.random() * 10}s infinite`,
          }}
        />
      ))}

      {/* Footer */}
      <div className="w-full text-center mt-16 text-sky-600/60 text-sm">© 2025 AquaCube. All rights reserved</div>
    </main>
  )
}
