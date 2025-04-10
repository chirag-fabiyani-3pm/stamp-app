"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Users, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

// Sample forum data
const forumCategories = [
  {
    id: "general",
    name: "General Discussion",
    description: "General discussions about stamp collecting",
    topics: 156,
    posts: 1243,
  },
  {
    id: "identification",
    name: "Stamp Identification",
    description: "Help with identifying stamps",
    topics: 89,
    posts: 567,
  },
  {
    id: "marketplace",
    name: "Marketplace Discussion",
    description: "Discussions about buying, selling, and trading stamps",
    topics: 72,
    posts: 421,
  },
  {
    id: "events",
    name: "Events & Exhibitions",
    description: "Information about stamp exhibitions and events",
    topics: 34,
    posts: 189,
  },
  {
    id: "technical",
    name: "Technical Discussion",
    description: "Discussions about stamp collecting techniques and tools",
    topics: 45,
    posts: 312,
  },
]

const recentTopics = [
  {
    id: 1,
    title: "Help identifying this 1935 Silver Jubilee stamp",
    category: "identification",
    author: {
      name: "StampCollector123",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
    },
    replies: 12,
    views: 156,
    lastActivity: "2 hours ago",
    isHot: true,
  },
  {
    id: 2,
    title: "Upcoming stamp exhibition in London - May 2024",
    category: "events",
    author: {
      name: "PhilatelyFan",
      avatar: "/placeholder.svg?height=40&width=40&text=PF",
    },
    replies: 8,
    views: 94,
    lastActivity: "5 hours ago",
    isHot: false,
  },
  {
    id: 3,
    title: "Best storage methods for valuable stamps?",
    category: "technical",
    author: {
      name: "NewCollector",
      avatar: "/placeholder.svg?height=40&width=40&text=NC",
    },
    replies: 23,
    views: 210,
    lastActivity: "1 day ago",
    isHot: true,
  },
  {
    id: 4,
    title: "Fair price for 1922 Peace and Commerce Issue - France?",
    category: "marketplace",
    author: {
      name: "StampTrader",
      avatar: "/placeholder.svg?height=40&width=40&text=ST",
    },
    replies: 15,
    views: 132,
    lastActivity: "2 days ago",
    isHot: false,
  },
  {
    id: 5,
    title: "Introduction and my collection showcase",
    category: "general",
    author: {
      name: "PhilatelistNewbie",
      avatar: "/placeholder.svg?height=40&width=40&text=PN",
    },
    replies: 19,
    views: 178,
    lastActivity: "3 days ago",
    isHot: false,
  },
]

const popularTopics = [
  {
    id: 6,
    title: "Authentication process explained - Official guide",
    category: "general",
    author: {
      name: "AdminUser",
      avatar: "/placeholder.svg?height=40&width=40&text=AU",
    },
    replies: 87,
    views: 1243,
    lastActivity: "1 week ago",
    isPinned: true,
  },
  {
    id: 7,
    title: "Complete guide to stamp grading standards",
    category: "technical",
    author: {
      name: "MasterPhilatelist",
      avatar: "/placeholder.svg?height=40&width=40&text=MP",
    },
    replies: 64,
    views: 982,
    lastActivity: "2 weeks ago",
    isPinned: false,
  },
  {
    id: 8,
    title: "2024 Stamp Market Trends and Predictions",
    category: "marketplace",
    author: {
      name: "StampAnalyst",
      avatar: "/placeholder.svg?height=40&width=40&text=SA",
    },
    replies: 53,
    views: 876,
    lastActivity: "3 weeks ago",
    isPinned: false,
  },
  {
    id: 9,
    title: "How to spot counterfeit stamps - Expert tips",
    category: "identification",
    author: {
      name: "AuthenticationExpert",
      avatar: "/placeholder.svg?height=40&width=40&text=AE",
    },
    replies: 49,
    views: 812,
    lastActivity: "1 month ago",
    isPinned: false,
  },
  {
    id: 10,
    title: "Major stamp exhibitions calendar for 2024-2025",
    category: "events",
    author: {
      name: "EventOrganizer",
      avatar: "/placeholder.svg?height=40&width=40&text=EO",
    },
    replies: 41,
    views: 734,
    lastActivity: "1 month ago",
    isPinned: true,
  },
]

export default function CommunityForums() {
  const [searchTerm, setSearchTerm] = useState("")
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const activeTab = categoryParam || "recent"

  // Filter topics based on search term
  const filteredRecentTopics = recentTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPopularTopics = popularTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/community/new-topic">
          <Button className="w-full md:w-auto">Create New Topic</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forumCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{category.topics} topics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{category.posts} posts</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/community?category=${category.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Topics
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recent" value={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent" asChild>
            <Link href="/community?category=recent">Recent Topics</Link>
          </TabsTrigger>
          <TabsTrigger value="popular" asChild>
            <Link href="/community?category=popular">Popular Topics</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
              <CardDescription>The latest topics from our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecentTopics.length > 0 ? (
                  filteredRecentTopics.map((topic) => (
                    <div key={topic.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                        <AvatarFallback>{topic.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link href={`/community/${topic.id}`} className="font-medium hover:underline truncate">
                            {topic.title}
                          </Link>
                          {topic.isHot && (
                            <Badge variant="destructive" className="text-xs">
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                          <Badge variant="outline">{topic.category}</Badge>
                          <span>by {topic.author.name}</span>
                          <span>•</span>
                          <span>{topic.replies} replies</span>
                          <span>•</span>
                          <span>{topic.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 mr-1" />
                        {topic.lastActivity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No topics found matching your search.</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="gap-2">
                View More <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="popular" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Discussions</CardTitle>
              <CardDescription>Most viewed and active topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPopularTopics.length > 0 ? (
                  filteredPopularTopics.map((topic) => (
                    <div key={topic.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                        <AvatarFallback>{topic.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link href={`/community/${topic.id}`} className="font-medium hover:underline truncate">
                            {topic.title}
                          </Link>
                          {topic.isPinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                          <Badge variant="outline">{topic.category}</Badge>
                          <span>by {topic.author.name}</span>
                          <span>•</span>
                          <span>{topic.replies} replies</span>
                          <span>•</span>
                          <span>{topic.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 mr-1" />
                        {topic.lastActivity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No topics found matching your search.</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="gap-2">
                View More <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
