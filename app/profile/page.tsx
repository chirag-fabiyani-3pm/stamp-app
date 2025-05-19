"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfo from "@/components/profile/profile-info"
import ProfileSettings from "@/components/profile/profile-settings"
import ProfileCollection from "@/components/profile/profile-collection"
import AuthCheck from "@/components/auth-check"

export default function ProfilePage() {
  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile, collection, and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="collection">Collection</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileInfo />
            </TabsContent>

            <TabsContent value="collection">
              <ProfileCollection />
            </TabsContent>

            <TabsContent value="settings">
              <ProfileSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthCheck>
  )
}
