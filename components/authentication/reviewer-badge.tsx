import { cn } from "@/lib/utils"
import { BadgeCheck, Crown, GraduationCap, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ReviewerLevel = "apprentice" | "certified" | "master"

interface ReviewerBadgeProps {
  level: ReviewerLevel
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  isAdmin?: boolean // Add isAdmin prop
}

export function ReviewerBadge({
  level,
  showLabel = false,
  size = "md",
  className,
  isAdmin = false,
}: ReviewerBadgeProps) {
  // If user is admin, always treat them as master level
  const effectiveLevel = isAdmin ? "master" : level

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const labelClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const badgeClasses = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5",
  }

  const getBadgeContent = () => {
    switch (effectiveLevel) {
      case "master":
        return {
          icon: <Crown className={sizeClasses[size]} />,
          label: isAdmin ? "Admin Philatelist" : "Master Philatelist",
          color:
            "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800",
          tooltip: isAdmin
            ? "Admin Philatelist: Administrator with highest level of authentication authority"
            : "Master Philatelist: The highest level of authentication expertise",
        }
      case "certified":
        return {
          icon: <BadgeCheck className={sizeClasses[size]} />,
          label: "Certified Authenticator",
          color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800",
          tooltip: "Certified Authenticator: Proven expertise in stamp authentication",
        }
      case "apprentice":
        return {
          icon: <GraduationCap className={sizeClasses[size]} />,
          label: "Apprentice Authenticator",
          color:
            "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-300 dark:border-slate-700",
          tooltip: "Apprentice Authenticator: Learning the authentication process",
        }
      default:
        return {
          icon: <Star className={sizeClasses[size]} />,
          label: "Reviewer",
          color: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 border-gray-300 dark:border-gray-700",
          tooltip: "Reviewer",
        }
    }
  }

  const content = getBadgeContent()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full border",
              badgeClasses[size],
              content.color,
              className,
            )}
          >
            {content.icon}
            {showLabel && <span className={cn("font-medium", labelClasses[size])}>{content.label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
