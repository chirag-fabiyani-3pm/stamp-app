import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Tag, TrendingUp, ArrowUpRight, Award, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AdminRecentActivity from "@/components/admin/admin-recent-activity"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: 5 minutes ago
          </Button>
          <Button size="sm">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View Site
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Tag className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,672</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">24%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Authentications</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">428</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">32%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication System</CardTitle>
          <CardDescription>Overview of stamp authentication activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Pending Reviews</h3>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                  24 Pending
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Awaiting first review</span>
                  <span className="font-medium">12</span>
                </div>
                <Progress value={50} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Awaiting additional reviews</span>
                  <span className="font-medium">8</span>
                </div>
                <Progress value={33} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Awaiting final approval</span>
                  <span className="font-medium">4</span>
                </div>
                <Progress value={17} className="h-2 bg-muted" />
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/authentication/pending">View All Pending</Link>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Reviewer Distribution</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  86 Reviewers
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Apprentice Reviewers</span>
                  <span className="font-medium">62</span>
                </div>
                <Progress value={72} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Certified Authenticators</span>
                  <span className="font-medium">18</span>
                </div>
                <Progress value={21} className="h-2 bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Master Philatelists</span>
                  <span className="font-medium">6</span>
                </div>
                <Progress value={7} className="h-2 bg-muted" />
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/users?filter=reviewers">Manage Reviewers</Link>
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Recent Authentications</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  128 Completed
                </Badge>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&text=S${i}`} />
                      <AvatarFallback>S{i}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">1935 Silver Jubilee - New Zealand</p>
                      <p className="text-xs text-muted-foreground">Authenticated {i * 2} hours ago</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <CheckCircle className="h-3 w-3 mr-1" /> Genuine
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/authentication/history">View History</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity and Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>Content requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="listings">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="auth">Authentication</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Silver Jubilee 1935 - New Zealand</h3>
                        <p className="text-sm text-muted-foreground">Listed by StampCollector123 • 2 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Rare German States Collection</h3>
                        <p className="text-sm text-muted-foreground">Listed by VintageStamps • 5 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">US Bicentennial Complete Set</h3>
                        <p className="text-sm text-muted-foreground">Listed by USACollector • 1 day ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/admin/moderation/listings">
                    <Button variant="link">View All Pending Listings</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="posts" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Question about authentication services</h3>
                        <p className="text-sm text-muted-foreground">Posted by NewCollector • 3 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Upcoming stamp exhibition in London</h3>
                        <p className="text-sm text-muted-foreground">Posted by EventOrganizer • 6 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/admin/moderation/community">
                    <Button variant="link">View All Pending Posts</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Potentially counterfeit stamp listing</h3>
                        <p className="text-sm text-muted-foreground">Reported by StampExpert • 1 hour ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                        <Button size="sm" variant="destructive">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Inappropriate comment in discussion</h3>
                        <p className="text-sm text-muted-foreground">Reported by CollectorPro • 4 hours ago</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                        <Button size="sm" variant="destructive">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/admin/moderation/reports">
                    <Button variant="link">View All Reports</Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="auth" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">1935 King George V Silver Jubilee</h3>
                        <p className="text-sm text-muted-foreground">
                          Reviewed by <Badge variant="outline">Apprentice</Badge> StampLearner • 3 hours ago
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">1922 Peace and Commerce Issue - France</h3>
                        <p className="text-sm text-muted-foreground">
                          Reviewed by <Badge variant="outline">Apprentice</Badge> NewCollector • 5 hours ago
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/admin/authentication/pending">
                    <Button variant="link">View All Pending Authentications</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and performance metrics</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Services</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authentication</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Operational
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Operational
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Response Times</h3>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>API Response (avg)</span>
                    <span className="font-medium">124ms</span>
                  </div>
                  <Progress value={25} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Database Queries (avg)</span>
                    <span className="font-medium">86ms</span>
                  </div>
                  <Progress value={17} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Page Load Time (avg)</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <Progress value={60} className="h-2 bg-muted" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Error Rates (24h)</h3>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>API Errors</span>
                    <span className="font-medium">0.02%</span>
                  </div>
                  <Progress value={0.2} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Authentication Failures</span>
                    <span className="font-medium">0.5%</span>
                  </div>
                  <Progress value={0.5} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Database Timeouts</span>
                    <span className="font-medium">0.01%</span>
                  </div>
                  <Progress value={0.1} className="h-2 bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
