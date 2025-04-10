import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageSquare, Heart, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import TopicReplyForm from "@/components/topic-reply-form"
import { ReportDialog } from "@/components/report-dialog"
import { redirect } from "next/navigation"

// This would typically come from a database
const getTopicData = (topicId: string) => {
  // Sample data for demonstration
  const id = topicId.replace("topic-", "")

  const topics = {
    "1": {
      id: 1,
      title: "Identifying rare 19th century European stamps",
      category: "Identification",
      content: `
      <p>Hello fellow collectors,</p>
      <p>I recently acquired a collection of European stamps that appear to be from the late 19th century. There are several that I'm having trouble identifying, particularly those from smaller states that existed before unification.</p>
      <p>I've attached images of three stamps that I'm most curious about. The first appears to be from one of the German states, possibly Bavaria or Württemberg, but I can't make out the postmark clearly.</p>
      <p>The second has what looks like Italian text, but doesn't match any of the standard Kingdom of Italy designs I'm familiar with. Could it be from one of the Italian states before unification?</p>
      <p>The third is the most mysterious - it has Cyrillic text but doesn't match Russian imperial stamps from the period.</p>
      <p>Has anyone encountered similar stamps or have resources for identifying these more obscure 19th century European issues?</p>
      <p>Thanks in advance for your help!</p>
    `,
      author: {
        name: "StampExpert",
        avatar: "/placeholder.svg?height=40&width=40&text=SE",
        joinDate: "August 2023",
        posts: 47,
      },
      createdAt: "2 hours ago",
      views: 342,
      replies: [
        {
          id: 1,
          content: `
          <p>The first stamp is definitely from Bavaria. It's part of the 1870-1872 series with the coat of arms. Based on the color, it's likely the 7 kreuzer ultramarine (Michel #26).</p>
          <p>For the second one, you're right that it's not from the Kingdom of Italy. It looks like it could be from the Papal States, which issued their own stamps until 1870. The design matches their final series.</p>
          <p>The Cyrillic one is trickier. Could you post a clearer image? It might be from one of the Russian zemstvo local posts, which had their own designs distinct from the imperial issues.</p>
        `,
          author: {
            name: "EuropeanCollector",
            avatar: "/placeholder.svg?height=40&width=40&text=EC",
            joinDate: "March 2022",
            posts: 156,
          },
          createdAt: "1 hour ago",
        },
        {
          id: 2,
          content: `
          <p>I agree with @EuropeanCollector about the Bavarian stamp. I have one in my collection and it's a nice find!</p>
          <p>For the Cyrillic one, another possibility is that it could be from Bulgaria. They issued their first stamps in 1879 with Cyrillic text. The Lion of Bulgaria was a common motif - does your stamp have anything like that?</p>
        `,
          author: {
            name: "PhilatelicHistorian",
            avatar: "/placeholder.svg?height=40&width=40&text=PH",
            joinDate: "January 2023",
            posts: 89,
          },
          createdAt: "45 minutes ago",
        },
      ],
    },
    "2": {
      id: 2,
      title: "Best storage methods for preserving stamp condition",
      category: "Preservation",
      content: `
      <p>I'm looking to upgrade my stamp storage system and would appreciate advice from experienced collectors.</p>
      <p>Currently, I'm using a basic album with plastic sleeves, but I'm concerned about long-term preservation, especially for some of my more valuable items.</p>
      <p>What storage methods and materials do you recommend for optimal preservation? Are there specific brands of albums, stock books, or mounts that you've found superior?</p>
      <p>I'm particularly concerned about:</p>
      <ul>
        <li>Acid-free materials</li>
        <li>Protection from light damage</li>
        <li>Humidity control</li>
        <li>Safe mounting methods that won't damage stamps</li>
      </ul>
      <p>Any advice would be greatly appreciated!</p>
    `,
      author: {
        name: "CollectorPro",
        avatar: "/placeholder.svg?height=40&width=40&text=CP",
        joinDate: "January 2022",
        posts: 73,
      },
      createdAt: "5 hours ago",
      views: 512,
      replies: [
        {
          id: 1,
          content: `
          <p>I've been collecting for over 30 years, and proper storage is definitely crucial. Here's what I recommend:</p>
          <p><strong>Albums:</strong> Lighthouse or Lindner albums with acid-free pages are excellent but pricey. For a more budget-friendly option, Vario stock books with glassine strips are good.</p>
          <p><strong>Mounts:</strong> Hawid or Showgard mounts are the gold standard. They're crystal clear and have archival-quality adhesive.</p>
          <p><strong>Environment:</strong> Keep your collection away from direct sunlight and in a room with stable temperature and humidity. Ideally 65-70°F and 40-50% relative humidity.</p>
          <p><strong>Handling:</strong> Always use stamp tongs, never fingers. The oils from your skin can damage stamps over time.</p>
          <p>For your most valuable stamps, consider individual archival-quality sleeves stored in a safe deposit box.</p>
        `,
          author: {
            name: "VintageCollector",
            avatar: "/placeholder.svg?height=40&width=40&text=VC",
            joinDate: "April 2021",
            posts: 312,
          },
          createdAt: "4 hours ago",
        },
        {
          id: 2,
          content: `
          <p>I'll add to the excellent advice above:</p>
          <p>For humidity control, silica gel packets work well when stored with your albums. Just remember to replace or recharge them periodically.</p>
          <p>If you live in a particularly humid climate, consider a dehumidifier for the room where you store your collection.</p>
          <p>Also, never store stamps in the basement or attic, as these areas typically have the most temperature and humidity fluctuations.</p>
        `,
          author: {
            name: "StampPreserver",
            avatar: "/placeholder.svg?height=40&width=40&text=SP",
            joinDate: "September 2022",
            posts: 64,
          },
          createdAt: "3 hours ago",
        },
      ],
    },
  }

  return topics[id as keyof typeof topics] || null
}

type Props = {
  params: { topicId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Redirect for new-topic
  if (params.topicId === "new-topic") {
    return {
      title: "Create New Topic - Stamps of Approval Community",
      description: "Create a new discussion topic in the Stamps of Approval collector community",
    }
  }

  const topicData = getTopicData(params.topicId)

  if (!topicData) {
    return {
      title: "Topic Not Found - Stamps of Approval Community",
      description: "The requested community topic could not be found",
    }
  }

  return {
    title: `${topicData.title} - Stamps of Approval Community`,
    description: `Join the discussion about ${topicData.title} in the Stamps of Approval collector community`,
  }
}

export default function TopicDetailPage({ params }: Props) {
  // Explicitly redirect for new-topic
  if (params.topicId === "new-topic") {
    redirect("/community/new-topic")
  }

  const topicData = getTopicData(params.topicId)

  if (!topicData) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-muted-foreground mb-6">The community topic you're looking for could not be found.</p>
        <Link href="/community">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Community
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{topicData.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="text-primary">
              {topicData.category}
            </Badge>
            <span>Posted {topicData.createdAt}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{topicData.replies.length} replies</span>
            </div>
            <span>•</span>
            <span>{topicData.views} views</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Original post */}
          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={topicData.author.avatar} alt={topicData.author.name} />
                  <AvatarFallback>{topicData.author.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <div>
                      <span className="font-medium">{topicData.author.name}</span>
                      <div className="text-xs text-muted-foreground">
                        Member since {topicData.author.joinDate} • {topicData.author.posts} posts
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{topicData.createdAt}</span>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground dark:prose-p:text-foreground prose-strong:text-foreground dark:prose-strong:text-foreground prose-a:text-primary dark:prose-a:text-primary max-w-none mt-4"
                    dangerouslySetInnerHTML={{ __html: topicData.content }}
                  />
                </div>
              </div>
            </div>
            <div className="bg-muted/50 p-3 border-t flex justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Heart className="h-4 w-4" /> Like
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
              <ReportDialog contentType="topic" contentId={topicData.id} contentTitle={topicData.title} />
            </div>
          </div>

          {/* Replies */}
          {topicData.replies.length > 0 && (
            <div>
              <h2 className="text-xl font-medium mb-4">Replies</h2>
              <div className="space-y-6">
                {topicData.replies.map((reply) => (
                  <div key={reply.id} className="bg-background rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                          <AvatarFallback>{reply.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                            <div>
                              <span className="font-medium">{reply.author.name}</span>
                              <div className="text-xs text-muted-foreground">
                                Member since {reply.author.joinDate} • {reply.author.posts} posts
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{reply.createdAt}</span>
                          </div>
                          <div
                            className="prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground dark:prose-p:text-foreground prose-strong:text-foreground dark:prose-strong:text-foreground prose-a:text-primary dark:prose-a:text-primary max-w-none mt-4"
                            dangerouslySetInnerHTML={{ __html: reply.content }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 border-t flex justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Heart className="h-4 w-4" /> Like
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Share2 className="h-4 w-4" /> Share
                        </Button>
                      </div>
                      <ReportDialog
                        contentType="comment"
                        contentId={reply.id}
                        contentTitle={`Reply to "${topicData.title}"`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply form */}
          <div>
            <Separator className="my-8" />
            <h2 className="text-xl font-medium mb-4">Post a Reply</h2>
            <TopicReplyForm topicId={topicData.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
