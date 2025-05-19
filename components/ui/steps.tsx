"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

type StepsProps = {
  steps: string[]
  currentStep: number
  onChange?: (step: number) => void
  className?: string
  orientation?: "horizontal" | "vertical"
}

const Steps = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StepsProps
>(({ steps, currentStep, onChange, className, orientation = "horizontal", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        orientation === "horizontal" 
          ? "flex items-center justify-between w-full relative" 
          : "flex flex-col space-y-4",
        className
      )}
      {...props}
    >
      {/* Background connector for horizontal orientation */}
      {orientation === "horizontal" && (
        <div className="absolute h-1 bg-gray-300 top-5 left-6 right-5 -translate-y-1/2 z-0 w-[90%]"></div>
      )}
      
      {/* Progress connector for horizontal orientation */}
      {orientation === "horizontal" && currentStep > 0 && (
        <div 
          className="absolute h-1 bg-green-600 top-5 left-6 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ 
            width: currentStep === steps.length-1 ? "90%" : `calc(${(currentStep/(steps.length-1)) * 100}% - 10px)`
          }}
        ></div>
      )}
      
      {steps.map((step, index) => {
        const status = 
          index < currentStep 
            ? "complete" 
            : index === currentStep 
              ? "current" 
              : "pending"
              
        return (
          <React.Fragment key={index}>
            <div 
              className={cn(
                "flex flex-col items-center relative z-10",
                orientation === "vertical" && "w-full flex-row gap-4"
              )}
            >
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200",
                  status === "complete" && "bg-green-600 text-white",
                  status === "current" && "bg-primary text-white",
                  status === "pending" && "bg-white text-gray-500 border-2 border-gray-300",
                  onChange && "cursor-pointer",
                  !onChange && "cursor-default"
                )}
                onClick={() => onChange?.(index)}
                aria-current={index === currentStep ? "step" : undefined}
                disabled={!onChange}
              >
                {status === "complete" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              
              <span 
                className={cn(
                  "text-xs text-center mt-1 font-medium",
                  orientation === "vertical" && "mt-0 text-sm",
                  status === "complete" && "text-green-600",
                  status === "current" && "text-primary",
                  status === "pending" && "text-gray-500"
                )}
              >
                {step}
              </span>
              
              {/* Vertical connector */}
              {orientation === "vertical" && index < steps.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-300">
                  <div 
                    className={cn(
                      "absolute left-0 top-0 w-full bg-green-600 transition-all duration-300",
                      status === "pending" && "h-0",
                      status === "current" && "h-1/2", 
                      status === "complete" && "h-full"
                    )}
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
})

Steps.displayName = "Steps"

const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-center text-muted-foreground mt-4", className)}
      {...props}
    />
  )
})

StepDescription.displayName = "StepDescription"

export { Steps, StepDescription } 