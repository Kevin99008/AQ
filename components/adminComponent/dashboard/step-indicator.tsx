"use client"

import { CheckCircle2 } from "lucide-react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={index} className={`flex items-center ${index < steps.length - 1 ? "w-full" : ""}`}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
              }`}
            >
              {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
            </div>

            <div className={`flex-1 ${index < steps.length - 1 ? "flex w-full items-center" : ""}`}>
              <span className="ml-2">{step}</span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? "bg-primary" : "bg-muted"}`}></div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

