"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Calendar, CheckCircle, Clock, Eye, MessageSquare, ThumbsUp, XCircle } from "lucide-react"
import Link from "next/link"

// Sample review data - in a real app, this would be fetched based on the reviewId
const reviewData = {
  id: "1",
  status: "pending",
  stampName: "1935 King George V Silver Jubilee",
  stampOrigin: "New Zealand",
  stampYear: "1935",
  stampDenomination: "1d",
  stampColor: "Red",
  stampCondition: "Very Fine",
  stampDescription:
    "This is a genuine 1935 King George V Silver Jubilee stamp from New Zealand. The perforations are intact and the colors are vibrant. There is slight toning on the reverse but overall in very fine condition.",
  reviewType: "authenticity",
  result: "genuine",
  reviewer: {
    id: "user123",
    name: "StampLearner",
    avatar: "/placeholder.svg?height=40&width=40&text=SL",
    level: "apprentice",
    reviewCount: 12,
    successRate: 92,
  },
  listingOwner: {
    id: "user456",
    name: "StampCollector123",
    avatar: "/placeholder.svg?height=40&width=40&text=SC",
  },
  submittedAt: "May 15, 2024",
  images: [
    "/placeholder.svg?height=300&width=400&text=Stamp+Front",
    "/placeholder.svg?height=300&width=400&text=Stamp+Back",
    "/placeholder.svg?height=300&width=400&text=Stamp+Detail",
  ],
  endorsements: [
    {
      id: "end1",
      user: {
        name: "VintageStamps",
        avatar: "/placeholder.svg?height=40&width=40&text=VS",
        level: "certified",
      },
      comment: "I agree with this assessment. The stamp appears genuine with all the correct features.",
      date: "May 16, 2024",
    },
    {
      id: "end2",
      user: {
        name: "CollectorPro",
        avatar: "/placeholder.svg?height=40&width=40&text=CP",
        level: "certified",
      },
      comment: "Concur. The perforations and watermark are consistent with genuine examples.",
      date: "May 17, 2024",
    },
  ],
  comments: [
    {
      id: "com1",
      user: {
        name: "StampExpert",
        avatar: "/placeholder.svg?height=40&width=40&text=SE",
        level: "master",
      },
      comment: "Could you provide a closer image of the watermark?",
      date: "May 16, 2024",
    },
    {
      id: "com2",
      user: {
        name: "StampLearner",
        avatar: "/placeholder.svg?height=40&width=40&text=SL",
        level: "apprentice",
      },
      comment: "I've added a detailed image of the watermark. It shows the correct pattern for this issue.",
      date: "May 16, 2024",
    },
  ],
}

export default function ReviewDetailPage() {
  const params = useParams()
  const reviewId = params.reviewId as string
  const [adminComment, setAdminComment] = useState("")
  const [adminDecision, setAdminDecision] = useState<string | null>(null)

  // Get badge color based on reviewer level
  const getReviewerLevelBadge = (level: string) => {
    const variants = {
      apprentice: { bg: "bg-blue-100", text: "text-blue-800" },
      certified: { bg: "bg-green-100", text: "text-green-800" },
      master: { bg: "bg-purple-100", text: "text-purple-800" },
    }

    const variant =
                  level in variants ? variants[level as keyof typeof variants] : { bg: "bg-muted", text: "text-muted-foreground" }

    return (
      <Badge variant="outline" className={`${variant.bg} ${variant.text} hover:${variant.bg}`}>
        <Award className="h-3 w-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    )
  }

  // Get badge color based on review type
  const getReviewTypeBadge = (type: string) => {
    switch (type) {
      case "authenticity":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Authenticity
          </Badge>
        )
      case "condition":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Condition
          </Badge>
        )
      case "valuation":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Valuation
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Authentication Review #{reviewId}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Status:</p>
            {getStatusBadge(reviewData.status)}
            <p className="text-muted-foreground ml-4">Type:</p>
            {getReviewTypeBadge(reviewData.reviewType)}
            <p className="text-muted-foreground ml-4">Submitted:</p>
                            <Badge variant="outline" className="bg-muted">
              <Calendar className="h-3 w-3 mr-1" />
              {reviewData.submittedAt}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/authentication/pending">Back to List</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/marketplace/listing-${reviewId}`}>
              <Eye className="h-4 w-4 mr-1" /> View Listing
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stamp Details</CardTitle>
              <CardDescription>Information about the authenticated stamp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">{reviewData.stampName}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span className="font-medium">{reviewData.stampOrigin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{reviewData.stampYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Denomination:</span>
                      <span className="font-medium">{reviewData.stampDenomination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color:</span>
                      <span className="font-medium">{reviewData.stampColor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="font-medium">{reviewData.stampCondition}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{reviewData.stampDescription}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reviewData.images.map((image, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Stamp image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Review</CardTitle>
              <CardDescription>Review details and assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reviewData.reviewer.avatar} alt={reviewData.reviewer.name} />
                  <AvatarFallback>{reviewData.reviewer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{reviewData.reviewer.name}</div>
                  <div className="flex items-center gap-2">
                    {getReviewerLevelBadge(reviewData.reviewer.level)}
                    <span className="text-xs text-muted-foreground">
                      {reviewData.reviewer.reviewCount} reviews • {reviewData.reviewer.successRate}% success rate
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Authentication Result</h3>
                  <div className="mt-1">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {reviewData.result === "genuine" ? "Genuine" : reviewData.result}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Assessment</h3>
                  <p className="mt-1">{reviewData.stampDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="endorsements">
            <TabsList>
              <TabsTrigger value="endorsements">Endorsements ({reviewData.endorsements.length})</TabsTrigger>
              <TabsTrigger value="comments">Comments ({reviewData.comments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="endorsements" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {reviewData.endorsements.length > 0 ? (
                    <div className="space-y-4">
                      {reviewData.endorsements.map((endorsement) => (
                        <div key={endorsement.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={endorsement.user.avatar} alt={endorsement.user.name} />
                            <AvatarFallback>{endorsement.user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{endorsement.user.name}</span>
                              {getReviewerLevelBadge(endorsement.user.level)}
                              <span className="text-xs text-muted-foreground">{endorsement.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-green-600">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm font-medium">Endorsed</span>
                            </div>
                            <p className="mt-2 text-sm">{endorsement.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No endorsements yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {reviewData.comments.length > 0 ? (
                    <div className="space-y-4">
                      {reviewData.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.user.name}</span>
                              {getReviewerLevelBadge(comment.user.level)}
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="mt-2 text-sm">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">No comments yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Review and take action</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-comment">Admin Comment</Label>
                <Textarea
                  id="admin-comment"
                  placeholder="Add your comment or feedback..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-decision">Decision</Label>
                <Select value={adminDecision || ""} onValueChange={setAdminDecision}>
                  <SelectTrigger id="admin-decision">
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve Review</SelectItem>
                    <SelectItem value="reject">Reject Review</SelectItem>
                    <SelectItem value="request-changes">Request Changes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" disabled={!adminDecision}>
                Submit Decision
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-1" /> Add Comment Only
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing Owner</CardTitle>
              <CardDescription>Stamp listing owner details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reviewData.listingOwner.avatar} alt={reviewData.listingOwner.name} />
                  <AvatarFallback>{reviewData.listingOwner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{reviewData.listingOwner.name}</div>
                  <Button variant="link" className="h-auto p-0 text-sm" asChild>
                    <Link href={`/admin/users/${reviewData.listingOwner.id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviewer</CardTitle>
              <CardDescription>Authentication reviewer details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={reviewData.reviewer.avatar} alt={reviewData.reviewer.name} />
                  <AvatarFallback>{reviewData.reviewer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{reviewData.reviewer.name}</div>
                  <div className="flex items-center gap-2 mt-1">{getReviewerLevelBadge(reviewData.reviewer.level)}</div>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <div>{reviewData.reviewer.reviewCount} reviews</div>
                    <div>{reviewData.reviewer.successRate}% success</div>
                  </div>
                  <Button variant="link" className="h-auto p-0 text-sm mt-1" asChild>
                    <Link href={`/admin/users/${reviewData.reviewer.id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
