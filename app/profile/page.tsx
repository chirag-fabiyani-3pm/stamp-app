"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from "@/components/profile/profile-info"
import ProfileSettings from "@/components/profile/profile-settings"
import ProfileCollection from "@/components/profile/profile-collection"
import { AuthGuard } from "@/components/auth/route-guard"
import { SubscriptionGuard } from "@/components/auth/subscription-guard"
import { SubscriptionDashboard } from "@/components/subscription/subscription-dashboard"

export default function ProfilePage() {
  
  return (
    <SubscriptionGuard>
      <AuthGuard>
      <div className="container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile, collection, and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileInfo />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionDashboard />
            </TabsContent>

            <TabsContent value="collection">
              <ProfileCollection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </AuthGuard>
    </SubscriptionGuard>
  )
}
