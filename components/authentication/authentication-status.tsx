import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, HelpCircle, ShieldAlert, XCircle } from "lucide-react"

export type AuthenticationStatus = "pending" | "authenticated" | "disputed" | "rejected" | "unverified"

interface AuthenticationStatusBadgeProps {
  status: AuthenticationStatus
  className?: string
}

export function AuthenticationStatusBadge({ status, className }: AuthenticationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "authenticated":
        return {
          label: "Authenticated",
          icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
          variant: "success" as const,
        }
      case "pending":
        return {
          label: "Pending Authentication",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          variant: "outline" as const,
        }
      case "disputed":
        return {
          label: "Authentication Disputed",
          icon: <ShieldAlert className="h-3.5 w-3.5 mr-1" />,
          variant: "warning" as const,
        }
      case "rejected":
        return {
          label: "Authentication Rejected",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
          variant: "destructive" as const,
        }
      case "unverified":
        return {
          label: "Unverified",
          icon: <HelpCircle className="h-3.5 w-3.5 mr-1" />,
          variant: "secondary" as const,
        }
      default:
        return {
          label: "Unknown Status",
          icon: <HelpCircle className="h-3.5 w-3.5 mr-1" />,
          variant: "outline" as const,
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className={cn("flex items-center", className)}>
      {config.icon}
      <span>{config.label}</span>
    </Badge>
  )
}

// Custom success variant for the Badge component
// Add this to your globals.css or a custom component
