import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewerProgress } from "@/components/authentication/reviewer-progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthenticationReview } from "@/components/authentication/authentication-review"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, BadgeCheck, CheckCircle2, Clock, GraduationCap, ShieldAlert, XCircle } from "lucide-react"
import Link from "next/link"
import AuthCheck from "@/components/auth-check"

export default function AuthenticationProfilePage() {
  // Sample data - in a real app, this would come from an API
  const userAuthenticationData = {
    level: "apprentice" as const,
    positivePoints: 42,
    accuracyRate: 87.5,
    approvedReviews: 12,
    nextLevelThreshold: {
      positivePoints: 100,
      accuracyRate: 85,
      approvedReviews: 50,
    },
    stats: {
      totalReviews: 16,
      pendingReviews: 4,
      approvedReviews: 12,
      rejectedReviews: 0,
      authenticVerdict: 14,
      counterfeitVerdict: 1,
      suspiciousVerdict: 1,
      uncertainVerdict: 0,
    },
  }

  // Sample reviews
  const myReviews = [
    {
      id: 1,
      reviewer: {
        name: "CurrentUser",
        avatar: "/placeholder.svg?height=40&width=40&text=CU",
        level: "apprentice" as const,
      },
      verdict: "authentic" as const,
      confidence: "high" as const,
      notes:
        "The stamp appears authentic based on my examination. The color is consistent with the period, and the printing details match reference examples. I've checked the perforations and they are correct for this issue.",
      catalogReference: "SG 573, Scott 185",
      date: "2 days ago",
      endorsements: 3,
      rejections: 0,
      status: "approved" as const,
      approvedBy: {
        name: "StampExpert",
        level: "master" as const,
        date: "1 day ago",
      },
      listingTitle: "Silver Jubilee 1935 - New Zealand",
      listingId: "1",
    },
    {
      id: 2,
      reviewer: {
        name: "CurrentUser",
        avatar: "/placeholder.svg?height=40&width=40&text=CU",
        level: "apprentice" as const,
      },
      verdict: "authentic" as const,
      confidence: "medium" as const,
      notes:
        "This appears to be an authentic example of the Coronation Series. The printing quality and colors match the reference examples I've seen.",
      date: "4 days ago",
      endorsements: 1,
      rejections: 0,
      status: "pending" as const,
      listingTitle: "Coronation Series 1953 - UK",
      listingId: "2",
    },
    {
      id: 3,
      reviewer: {
        name: "CurrentUser",
        avatar: "/placeholder.svg?height=40&width=40&text=CU",
        level: "apprentice" as const,
      },
      verdict: "counterfeit" as const,
      confidence: "high" as const,
      notes:
        "This stamp shows clear signs of being counterfeit. The perforations are irregular and the printing lacks the fine detail of authentic examples. The paper quality is also inconsistent with genuine stamps from this period.",
      date: "1 week ago",
      endorsements: 2,
      rejections: 0,
      status: "approved" as const,
      approvedBy: {
        name: "CollectorPro",
        level: "certified" as const,
        date: "6 days ago",
      },
      listingTitle: "Rare German States Collection",
      listingId: "5",
    },
  ]

  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl font-bold mb-6">Authentication Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ReviewerProgress
              currentLevel={userAuthenticationData.level}
              positivePoints={userAuthenticationData.positivePoints}
              accuracyRate={userAuthenticationData.accuracyRate}
              approvedReviews={userAuthenticationData.approvedReviews}
              nextLevelThreshold={userAuthenticationData.nextLevelThreshold}
            />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Authentication Stats</CardTitle>
                <CardDescription>Your authentication activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{userAuthenticationData.stats.totalReviews}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    <p className="text-2xl font-bold">{userAuthenticationData.accuracyRate}%</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Approved</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.approvedReviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.pendingReviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Rejected</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.rejectedReviews}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Authentic Verdicts</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.authenticVerdict}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Counterfeit Verdicts</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.counterfeitVerdict}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Suspicious Verdicts</span>
                    </div>
                    <span className="font-medium">{userAuthenticationData.stats.suspiciousVerdict}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Levels</CardTitle>
              <CardDescription>Understanding the reviewer hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-muted/30">
                  <GraduationCap className="h-10 w-10 text-slate-600 mb-2" />
                  <h3 className="font-bold text-lg">Apprentice Authenticator</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Entry-level authenticators learning the ropes. Reviews require approval from higher tiers.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Requirements:</p>
                    <p className="text-muted-foreground">New users start here</p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-muted/30">
                  <BadgeCheck className="h-10 w-10 text-blue-600 mb-2" />
                  <h3 className="font-bold text-lg">Certified Authenticator</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Experienced reviewers with proven expertise. Can approve Apprentice reviews.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Requirements:</p>
                    <ul className="text-muted-foreground text-left list-disc pl-5">
                      <li>100 positive points</li>
                      <li>85% accuracy rate</li>
                      <li>50 approved reviews</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center p-4 rounded-lg border bg-muted/30">
                  <Award className="h-10 w-10 text-amber-600 mb-2" />
                  <h3 className="font-bold text-lg">Master Philatelist</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    The highest level of authentication expertise. Final authority on authentications.
                  </p>
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Requirements:</p>
                    <ul className="text-muted-foreground text-left list-disc pl-5">
                      <li>500 positive points</li>
                      <li>95% accuracy rate</li>
                      <li>200 approved reviews</li>
                      <li>Admin approval</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Authentication Reviews</h2>
            <Link href="/marketplace">
              <Button className="gap-1">
                Find Stamps to Authenticate <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {myReviews.map((review) => (
                <div key={review.id} className="relative">
                  <div className="absolute -left-4 top-4 bottom-4 w-1 bg-muted-foreground/20 hidden md:block"></div>
                  <div className="mb-2">
                    <Link href={`/marketplace/${review.listingId}`} className="text-primary hover:underline">
                      {review.listingTitle}
                    </Link>
                  </div>
                  <AuthenticationReview {...review} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-6">
              {myReviews
                .filter((review) => review.status === "approved")
                .map((review) => (
                  <div key={review.id} className="relative">
                    <div className="absolute -left-4 top-4 bottom-4 w-1 bg-muted-foreground/20 hidden md:block"></div>
                    <div className="mb-2">
                      <Link href={`/marketplace/${review.listingId}`} className="text-primary hover:underline">
                        {review.listingTitle}
                      </Link>
                    </div>
                    <AuthenticationReview {...review} />
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-6">
              {myReviews
                .filter((review) => review.status === "pending")
                .map((review) => (
                  <div key={review.id} className="relative">
                    <div className="absolute -left-4 top-4 bottom-4 w-1 bg-muted-foreground/20 hidden md:block"></div>
                    <div className="mb-2">
                      <Link href={`/marketplace/${review.listingId}`} className="text-primary hover:underline">
                        {review.listingTitle}
                      </Link>
                    </div>
                    <AuthenticationReview {...review} />
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-6">
              {myReviews.filter((review) => review.status === "rejected").length > 0 ? (
                myReviews
                  .filter((review) => review.status === "rejected")
                  .map((review) => (
                    <div key={review.id} className="relative">
                      <div className="absolute -left-4 top-4 bottom-4 w-1 bg-muted-foreground/20 hidden md:block"></div>
                      <div className="mb-2">
                        <Link href={`/marketplace/${review.listingId}`} className="text-primary hover:underline">
                          {review.listingTitle}
                        </Link>
                      </div>
                      <AuthenticationReview {...review} />
                    </div>
                  ))
              ) : (
                <p className="text-center py-12 text-muted-foreground">
                  You don't have any rejected reviews. Keep up the good work!
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthCheck>
  )
}
