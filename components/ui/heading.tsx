import type React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function Heading({ className, children, ...props }: HeadingProps) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight text-foreground", className)} {...props}>
      {children}
    </h1>
  )
}
