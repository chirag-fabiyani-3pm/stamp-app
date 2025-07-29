import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ReviewerBadge, type ReviewerLevel } from "@/components/authentication/reviewer-badge"

interface ReviewerProgressProps {
  level: ReviewerLevel
  isAdmin?: boolean // Add isAdmin property
}

export function ReviewerProgress({ level, isAdmin = false }: ReviewerProgressProps) {
  // If user is admin, they're automatically at master level
  const effectiveLevel = isAdmin ? "master" : level

  const getLevelProgress = () => {
    switch (effectiveLevel) {
      case "master":
        return 100
      case "certified":
        return 75
      case "apprentice":
        return 35
      default:
        return 0
    }
  }

  const getNextLevelRequirements = () => {
    if (isAdmin) {
      return null // Admins are already at the highest level
    }

    switch (level) {
      case "master":
        return null // Already at highest level
      case "certified":
        return {
          reviews: "50 more reviews",
          accuracy: "95% accuracy rate",
          endorsements: "100 endorsements",
        }
      case "apprentice":
        return {
          reviews: "25 more reviews",
          accuracy: "85% accuracy rate",
          endorsements: "50 endorsements",
        }
      default:
        return {
          reviews: "10 reviews",
          accuracy: "75% accuracy rate",
          endorsements: "20 endorsements",
        }
    }
  }

  const nextLevel = isAdmin ? null : level === "apprentice" ? "certified" : level === "certified" ? "master" : null
  const requirements = getNextLevelRequirements()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviewer Status</CardTitle>
            <CardDescription>Your authentication expertise level</CardDescription>
          </div>
          <ReviewerBadge level={level} showLabel size="md" isAdmin={isAdmin} />
        </div>
      </CardHeader>
      <CardContent>
        {!isAdmin && nextLevel && (
          <>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Progress to {nextLevel}</span>
              <span>{getLevelProgress()}%</span>
            </div>
            <Progress value={getLevelProgress()} className="mb-4" />

            {requirements && (
              <div className="space-y-2 text-sm">
                <p className="font-medium">Requirements for next level:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• {requirements.reviews}</li>
                  <li>• {requirements.accuracy}</li>
                  <li>• {requirements.endorsements}</li>
                </ul>
              </div>
            )}
          </>
        )}

        {isAdmin && (
          <div className="text-sm text-muted-foreground">
            <p>As an administrator, you have Master Philatelist status with full authentication privileges.</p>
            <ul className="mt-2 space-y-1">
              <li>• Approve or reject any authentication review</li>
              <li>• Endorse other authenticators&apos; reviews</li>
              <li>• Manage authentication standards</li>
            </ul>
          </div>
        )}

        <div className="mt-4 text-sm">
          <p className="font-medium">Your stats:</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md border p-2">
              <div className="text-2xl font-bold">42</div>
              <div className="text-xs text-muted-foreground">Reviews submitted</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-muted-foreground">Accuracy rate</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-2xl font-bold">78</div>
              <div className="text-xs text-muted-foreground">Endorsements received</div>
            </div>
            <div className="rounded-md border p-2">
              <div className="text-2xl font-bold">36</div>
              <div className="text-xs text-muted-foreground">Endorsements given</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
