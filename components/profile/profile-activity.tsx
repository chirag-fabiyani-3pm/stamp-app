"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Tag, ShoppingCart, Eye, Calendar } from "lucide-react"

// Sample activity data
const marketplaceActivity = [
  {
    id: 1,
    type: "listing_created",
    title: "Silver Jubilee 1935 - New Zealand",
    date: "2 days ago",
    status: "active",
  },
  {
    id: 2,
    type: "listing_created",
    title: "Coronation Series 1953 - UK",
    date: "1 week ago",
    status: "active",
  },
  {
    id: 3,
    type: "bid_received",
    title: "Olympic Games 2000 - Australia",
    date: "2 weeks ago",
    user: {
      name: "StampExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=SE",
    },
    amount: 18.5,
  },
  {
    id: 4,
    type: "trade_offer",
    title: "Flora Series 1961 - South Africa",
    date: "3 weeks ago",
    user: {
      name: "GlobalTrader",
      avatar: "/placeholder.svg?height=40&width=40&text=GT",
    },
  },
  {
    id: 5,
    type: "purchase",
    title: "Independence Issue 1947 - India",
    date: "1 month ago",
    amount: 35.0,
    seller: {
      name: "VintageStamps",
      avatar: "/placeholder.svg?height=40&width=40&text=VS",
    },
  },
]

const communityActivity = [
  {
    id: 1,
    type: "topic_created",
    title: "Identifying rare 19th century European stamps",
    date: "3 days ago",
    replies: 5,
  },
  {
    id: 2,
    type: "reply_posted",
    title: "Best storage methods for preserving stamp condition",
    date: "1 week ago",
    topicAuthor: {
      name: "CollectorPro",
      avatar: "/placeholder.svg?height=40&width=40&text=CP",
    },
  },
  {
    id: 3,
    type: "topic_liked",
    title: "Value estimation for Silver Jubilee collection",
    date: "2 weeks ago",
    topicAuthor: {
      name: "StampAppraiser",
      avatar: "/placeholder.svg?height=40&width=40&text=SA",
    },
  },
]

const collectionActivity = [
  {
    id: 1,
    type: "stamp_added",
    title: "Bicentennial - United States",
    date: "1 day ago",
  },
  {
    id: 2,
    type: "stamp_identified",
    title: "Silver Jubilee - New Zealand",
    date: "5 days ago",
  },
  {
    id: 3,
    type: "collection_updated",
    title: "Updated condition for 3 stamps",
    date: "1 week ago",
  },
  {
    id: 4,
    type: "stamp_added",
    title: "Olympic Games - Australia",
    date: "2 weeks ago",
  },
]

export default function ProfileActivity() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 pt-6">
          <h2 className="text-xl font-medium">Recent Activity</h2>

          <div className="space-y-4">
            {[...marketplaceActivity, ...communityActivity, ...collectionActivity]
              .sort((a, b) => {
                // Simple sort by date string - in a real app, use actual dates
                const dateA = a.date.includes("day") ? 1 : a.date.includes("week") ? 7 : 30
                const dateB = b.date.includes("day") ? 1 : b.date.includes("week") ? 7 : 30
                return dateA - dateB
              })
              .slice(0, 10)
              .map((activity) => renderActivityItem(activity))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6 pt-6">
          <h2 className="text-xl font-medium">Marketplace Activity</h2>

          <div className="space-y-4">{marketplaceActivity.map((activity) => renderActivityItem(activity))}</div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6 pt-6">
          <h2 className="text-xl font-medium">Community Activity</h2>

          <div className="space-y-4">{communityActivity.map((activity) => renderActivityItem(activity))}</div>
        </TabsContent>

        <TabsContent value="collection" className="space-y-6 pt-6">
          <h2 className="text-xl font-medium">Collection Activity</h2>

          <div className="space-y-4">{collectionActivity.map((activity) => renderActivityItem(activity))}</div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
          <CardDescription>Your activity over time</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Calendar className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground ml-4">Activity calendar would appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}

function renderActivityItem(activity: Record<string, any>) {
  let icon
  let content

  // Determine icon based on activity type
  if (activity.type.includes("listing")) {
    icon = <Tag className="h-4 w-4" />
  } else if (activity.type.includes("bid") || activity.type.includes("trade") || activity.type.includes("purchase")) {
    icon = <ShoppingCart className="h-4 w-4" />
  } else if (activity.type.includes("topic") || activity.type.includes("reply")) {
    icon = <MessageSquare className="h-4 w-4" />
  } else {
    icon = <Eye className="h-4 w-4" />
  }

  // Generate content based on activity type
  switch (activity.type) {
    case "listing_created":
      content = (
        <>
          <div className="flex-1">
            <p>
              You created a new listing: <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
          <Badge variant="default">Listed</Badge>
        </>
      )
      break

    case "bid_received":
      content = (
        <>
          <div className="flex-1">
            <p>
              <span className="font-medium">{activity.user.name}</span> placed a bid on your listing:{" "}
              <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
          <Badge variant="outline">${activity.amount.toFixed(2)}</Badge>
        </>
      )
      break

    case "trade_offer":
      content = (
        <>
          <div className="flex-1">
            <p>
              <span className="font-medium">{activity.user.name}</span> made a trade offer for your:{" "}
              <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
          <Button variant="outline" size="sm">
            View Offer
          </Button>
        </>
      )
      break

    case "purchase":
      content = (
        <>
          <div className="flex-1">
            <p>
              You purchased <span className="font-medium">{activity.title}</span> from{" "}
              <span className="font-medium">{activity.seller.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
          <Badge variant="outline">${activity.amount.toFixed(2)}</Badge>
        </>
      )
      break

    case "topic_created":
      content = (
        <>
          <div className="flex-1">
            <p>
              You created a new topic: <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
          <Badge variant="outline">{activity.replies} replies</Badge>
        </>
      )
      break

    case "reply_posted":
      content = (
        <>
          <div className="flex-1">
            <p>
              You replied to <span className="font-medium">{activity.topicAuthor.name}</span>&apos;s topic:{" "}
              <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </>
      )
      break

    case "topic_liked":
      content = (
        <>
          <div className="flex-1">
            <p>
              You liked <span className="font-medium">{activity.topicAuthor.name}</span>&apos;s topic:{" "}
              <span className="font-medium">{activity.title}</span>
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </>
      )
      break

    case "stamp_added":
    case "stamp_identified":
      content = (
        <>
          <div className="flex-1">
            <p>
              You added <span className="font-medium">{activity.title}</span> to your collection
            </p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </>
      )
      break

    case "collection_updated":
      content = (
        <>
          <div className="flex-1">
            <p>{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </>
      )
      break

    default:
      content = (
        <>
          <div className="flex-1">
            <p>{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.date}</p>
          </div>
        </>
      )
  }

  return (
    <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
      {content}
    </div>
  )
}
