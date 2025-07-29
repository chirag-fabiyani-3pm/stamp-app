"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthenticationReview } from "@/components/authentication/authentication-review"
import type { ReviewerLevel } from "@/components/authentication/reviewer-badge"

// Sample data for authentication reviews
const sampleReviews = [
  {
    id: "1",
    reviewer: {
      id: "user1",
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
      level: "certified" as ReviewerLevel,
    },
    date: "2 days ago",
    status: "pending" as const,
    comments:
      "The stamp appears to be genuine based on the paper quality and perforations. The color matches the known examples from this period. I recommend approval.",
    endorsements: 2,
    rejections: 0,
    images: [
      "/placeholder.svg?height=200&width=300&text=Detail+Image",
      "/placeholder.svg?height=200&width=300&text=Perforation+Detail",
    ],
  },
  {
    id: "2",
    reviewer: {
      id: "user2",
      name: "VintageCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=VC",
      level: "apprentice" as ReviewerLevel,
    },
    date: "3 days ago",
    status: "approved" as const,
    comments:
      "I've compared this with my reference collection. The watermark and printing technique are consistent with genuine examples. The cancel mark appears period-appropriate.",
    endorsements: 5,
    rejections: 1,
  },
  {
    id: "3",
    reviewer: {
      id: "user3",
      name: "PhilatelyPro",
      avatar: "/placeholder.svg?height=40&width=40&text=PP",
      level: "master" as ReviewerLevel,
    },
    date: "4 days ago",
    status: "approved" as const,
    comments:
      "This is a genuine example of the 1922 issue. The paper, ink, and gum are all consistent with known examples. The centering is above average for this issue.",
    endorsements: 8,
    rejections: 0,
  },
  {
    id: "4",
    reviewer: {
      id: "user4",
      name: "StampNewbie",
      avatar: "/placeholder.svg?height=40&width=40&text=SN",
      level: "apprentice" as ReviewerLevel,
    },
    date: "5 days ago",
    status: "rejected" as const,
    comments:
      "I have concerns about the perforation gauge which appears to be 11.5 rather than the expected 12 for this issue. The color also seems slightly off compared to reference examples.",
    endorsements: 1,
    rejections: 3,
  },
]

interface AuthenticationHistoryProps {
  userLevel?: ReviewerLevel
  isAdmin?: boolean // Add isAdmin property
}

export function AuthenticationHistory({ userLevel = "apprentice", isAdmin = false }: AuthenticationHistoryProps) {
  const [reviews, setReviews] = useState(sampleReviews)

  // Determine if the user can endorse reviews based on their level
  const canEndorse = (reviewerLevel: ReviewerLevel) => {
    if (isAdmin) return true // Admins can endorse any review

    // Users can endorse reviews from users of the same level or lower
    if (userLevel === "master") return true
    if (userLevel === "certified" && (reviewerLevel === "certified" || reviewerLevel === "apprentice")) return true
    if (userLevel === "apprentice" && reviewerLevel === "apprentice") return true
    return false
  }

  // Determine if the user can approve reviews based on their level
  const canApprove = (reviewerLevel: ReviewerLevel, status: string) => {
    if (status !== "pending") return false

    // Only admins and master philatelists can approve any review
    // Certified authenticators can approve apprentice reviews
    if (isAdmin) return true
    if (userLevel === "master") return true
    if (userLevel === "certified" && reviewerLevel === "apprentice") return true
    return false
  }

  const handleEndorse = (reviewId: string) => {
    console.log(`Endorsed review ${reviewId}`)
    // In a real app, you would call an API to update the endorsement
  }

  const handleReject = (reviewId: string) => {
    console.log(`Rejected review ${reviewId}`)
    // In a real app, you would call an API to update the rejection
  }

  const handleApprove = (reviewId: string) => {
    console.log(`Approved review ${reviewId}`)
    // In a real app, you would call an API to update the status to approved

    // Update the local state to show the approval
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, status: "approved" as const } : review)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication History</CardTitle>
        <CardDescription>Review authentication history and provide feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {reviews.map((review) => (
              <AuthenticationReview
                key={review.id}
                review={{
                  ...review,
                  reviewer: {
                    ...review.reviewer,
                    isAdmin: review.reviewer.id === "user3", // Just for demo, marking one user as admin
                  },
                }}
                canEndorse={canEndorse(review.reviewer.level)}
                canReject={canEndorse(review.reviewer.level)}
                canApprove={canApprove(review.reviewer.level, review.status)}
                onEndorse={handleEndorse}
                onReject={handleReject}
                onApprove={handleApprove}
              />
            ))}
          </TabsContent>

          <TabsContent value="pending">
            {reviews
              .filter((review) => review.status === "pending")
              .map((review) => (
                <AuthenticationReview
                  key={review.id}
                  review={{
                    ...review,
                    reviewer: {
                      ...review.reviewer,
                      isAdmin: review.reviewer.id === "user3", // Just for demo
                    },
                  }}
                  canEndorse={canEndorse(review.reviewer.level)}
                  canReject={canEndorse(review.reviewer.level)}
                  canApprove={canApprove(review.reviewer.level, review.status)}
                  onEndorse={handleEndorse}
                  onReject={handleReject}
                  onApprove={handleApprove}
                />
              ))}
          </TabsContent>

          <TabsContent value="approved">
            {reviews
              .filter((review) => review.status === "approved")
              .map((review) => (
                <AuthenticationReview
                  key={review.id}
                  review={{
                    ...review,
                    reviewer: {
                      ...review.reviewer,
                      isAdmin: review.reviewer.id === "user3", // Just for demo
                    },
                  }}
                  canEndorse={canEndorse(review.reviewer.level)}
                  canReject={canEndorse(review.reviewer.level)}
                  onEndorse={handleEndorse}
                  onReject={handleReject}
                />
              ))}
          </TabsContent>

          <TabsContent value="rejected">
            {reviews
              .filter((review) => review.status === "rejected")
              .map((review) => (
                <AuthenticationReview
                  key={review.id}
                  review={{
                    ...review,
                    reviewer: {
                      ...review.reviewer,
                      isAdmin: review.reviewer.id === "user3", // Just for demo
                    },
                  }}
                  canEndorse={canEndorse(review.reviewer.level)}
                  canReject={canEndorse(review.reviewer.level)}
                  onEndorse={handleEndorse}
                  onReject={handleReject}
                />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
