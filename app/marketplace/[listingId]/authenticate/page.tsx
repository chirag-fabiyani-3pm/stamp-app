"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthenticationForm } from "@/components/authentication/authentication-form"
import { AuthenticationHistory } from "@/components/authentication/authentication-history"
import { AuthenticationStatusBadge } from "@/components/authentication/authentication-status"
import { ReviewerProgress } from "@/components/authentication/reviewer-progress"
import AuthCheck from "@/components/auth-check"

// This would typically come from a database
const getListingData = (listingId: string) => {
  // Sample data for demonstration
  return {
    id: listingId,
    title: "Silver Jubilee 1935 - New Zealand",
    image: "/silver-jubilee.jpg",
    authenticationStatus: "pending" as const,
  }
}

interface AuthenticatePageProps {
  params: {
    listingId: string
  }
}

export default function AuthenticatePage({ params }: AuthenticatePageProps) {
  const listingData = getListingData(params.listingId)

  // In a real app, these would come from user authentication context
  const [userRole, setUserRole] = useState("admin") // Admin users are Master Philatelists
  const [userLevel, setUserLevel] = useState("certified")

  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <div className="mb-6">
          <Link href={`/marketplace/${params.listingId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Listing
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Authenticate Stamp</h1>
            <p className="text-muted-foreground">Help verify the authenticity of this stamp listing</p>
          </div>
          <AuthenticationStatusBadge status={listingData.authenticationStatus} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Review</CardTitle>
                <CardDescription>Provide your expert opinion on this stamp's authenticity</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="review">
                  <TabsList className="mb-4">
                    <TabsTrigger value="review">Submit Review</TabsTrigger>
                    <TabsTrigger value="history">Review History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="review">
                    <AuthenticationForm
                      listingId={params.listingId}
                      listingTitle={listingData.title}
                      listingImage={listingData.image}
                    />
                  </TabsContent>
                  <TabsContent value="history">
                    <AuthenticationHistory
                      listingId={params.listingId}
                      userLevel={userLevel as any}
                      isAdmin={userRole === "admin"}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Current Status</p>
                    <AuthenticationStatusBadge
                      status={listingData.authenticationStatus}
                      className="w-full justify-center py-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Listing</p>
                    <p className="text-sm">{listingData.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ReviewerProgress level={userLevel as any} isAdmin={userRole === "admin"} />
          </div>
        </div>
      </div>
    </AuthCheck>
  )
}
