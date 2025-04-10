"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, ThumbsUp, AlertCircle } from "lucide-react"
import { ReviewerBadge, type ReviewerLevel } from "@/components/authentication/reviewer-badge"

export interface AuthenticationReviewProps {
  review: {
    id: string
    reviewer: {
      id: string
      name: string
      avatar?: string
      level: ReviewerLevel
      isAdmin?: boolean // Add isAdmin property
    }
    date: string
    status: "pending" | "approved" | "rejected"
    comments: string
    endorsements: number
    rejections: number
    images?: string[]
  }
  canEndorse?: boolean
  canReject?: boolean
  canApprove?: boolean // Add canApprove property
  onEndorse?: (reviewId: string) => void
  onReject?: (reviewId: string) => void
  onApprove?: (reviewId: string) => void // Add onApprove callback
}

export function AuthenticationReview({
  review,
  canEndorse = false,
  canReject = false,
  canApprove = false,
  onEndorse,
  onReject,
  onApprove,
}: AuthenticationReviewProps) {
  const [isEndorsed, setIsEndorsed] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [endorsements, setEndorsements] = useState(review.endorsements)
  const [rejections, setRejections] = useState(review.rejections)
  const [status, setStatus] = useState(review.status)

  const handleEndorse = () => {
    if (isEndorsed) return
    setIsEndorsed(true)
    setEndorsements(endorsements + 1)
    if (isRejected) {
      setIsRejected(false)
      setRejections(rejections - 1)
    }
    onEndorse?.(review.id)
  }

  const handleReject = () => {
    if (isRejected) return
    setIsRejected(true)
    setRejections(rejections + 1)
    if (isEndorsed) {
      setIsEndorsed(false)
      setEndorsements(endorsements - 1)
    }
    onReject?.(review.id)
  }

  const handleApprove = () => {
    setStatus("approved")
    onApprove?.(review.id)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
              <AvatarFallback>{review.reviewer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{review.reviewer.name}</CardTitle>
                <ReviewerBadge level={review.reviewer.level} size="sm" isAdmin={review.reviewer.isAdmin} />
              </div>
              <CardDescription>{review.date}</CardDescription>
            </div>
          </div>
          <Badge
            variant={status === "approved" ? "outline" : status === "rejected" ? "destructive" : "secondary"}
            className="flex items-center gap-1"
          >
            {status === "approved" ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Approved
              </>
            ) : status === "rejected" ? (
              <>
                <XCircle className="h-3 w-3" /> Rejected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" /> Pending
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{review.comments}</p>
        {review.images && review.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {review.images.map((image, index) => (
              <div key={index} className="rounded-md overflow-hidden border">
                <img src={image || "/placeholder.svg"} alt={`Review image ${index + 1}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" /> {endorsements} endorsements
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="h-4 w-4" /> {rejections} rejections
          </div>
        </div>
        <div className="flex gap-2">
          {status === "pending" && canApprove && (
            <Button
              variant="default"
              size="sm"
              className="gap-1 bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
            >
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          )}
          {canEndorse && (
            <Button
              variant={isEndorsed ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={handleEndorse}
              disabled={status !== "pending"}
            >
              <ThumbsUp className="h-4 w-4" /> Endorse
            </Button>
          )}
          {canReject && (
            <Button
              variant={isRejected ? "destructive" : "outline"}
              size="sm"
              className="gap-1"
              onClick={handleReject}
              disabled={status !== "pending"}
            >
              <XCircle className="h-4 w-4" /> Reject
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
