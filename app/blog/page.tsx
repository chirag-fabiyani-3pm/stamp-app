import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogPage() {
  // Sample blog posts
  const featuredPost = {
    id: "1",
    title: "The History and Significance of the Inverted Jenny",
    excerpt:
      "Explore the fascinating story behind one of the world's most famous stamp errors, the Inverted Jenny, and its impact on philately.",
    date: "April 5, 2024",
    author: "Emma Phillips",
    category: "Stamp History",
    image: "/placeholder.svg?height=400&width=800&text=Inverted+Jenny",
  }

  const recentPosts = [
    {
      id: "2",
      title: "Beginner's Guide to Stamp Collecting",
      excerpt:
        "Everything you need to know to start your stamp collecting journey, from tools and storage to understanding catalog values.",
      date: "March 28, 2024",
      author: "James Wilson",
      category: "Guides",
    },
    {
      id: "3",
      title: "How AI is Revolutionizing Stamp Identification",
      excerpt:
        "A look at how artificial intelligence technologies are making it easier than ever to identify and authenticate rare stamps.",
      date: "March 20, 2024",
      author: "Dr. Robert Chen",
      category: "Technology",
    },
    {
      id: "4",
      title: "Top 10 Most Valuable Stamps of the 21st Century",
      excerpt:
        "Discover which modern stamps have appreciated the most in value and why they're worth watching in your collection.",
      date: "March 15, 2024",
      author: "Sarah Johnson",
      category: "Market Trends",
    },
    {
      id: "5",
      title: "Conservation Techniques for Preserving Your Collection",
      excerpt:
        "Expert advice on how to protect your stamps from environmental damage and maintain their condition for generations to come.",
      date: "March 8, 2024",
      author: "David Thompson",
      category: "Conservation",
    },
  ]

  return (
    <div className="container py-12">
      <Heading className="mb-4">Philately Blog</Heading>
      <Separator className="mb-8" />

      {/* Featured Post */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Featured Article</h2>
        <div className="rounded-xl overflow-hidden border">
          <div className="aspect-[2/1] bg-muted relative">
            <img
              src={featuredPost.image || "/placeholder.svg"}
              alt={featuredPost.title}
              className="object-cover h-full w-full"
            />
          </div>
          <div className="p-6">
            <Badge className="mb-3">{featuredPost.category}</Badge>
            <h3 className="text-2xl font-bold mb-2">{featuredPost.title}</h3>
            <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                By {featuredPost.author} • {featuredPost.date}
              </div>
              <Button>Read More</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {recentPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge>{post.category}</Badge>
                  <div className="text-xs text-muted-foreground">{post.date}</div>
                </div>
                <CardTitle className="mt-2">{post.title}</CardTitle>
                <CardDescription>By {post.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Read Article
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-12 p-8 rounded-xl bg-muted">
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mb-4">
            Get the latest philately news, collecting tips, and articles delivered to your inbox.
          </p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 rounded-md border px-3 py-2" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
