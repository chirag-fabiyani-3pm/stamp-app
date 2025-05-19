"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Mail, MapPin, Edit, User, Shield } from "lucide-react"

export default function ProfileInfo() {
  const [userName, setUserName] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    // Get user info from localStorage
    const storedName = localStorage.getItem("userName") || "User"
    const storedEmail = localStorage.getItem("userEmail") || "user@example.com"
    const storedRole = localStorage.getItem("userRole") || "user"

    setUserName(storedName)
    setUserEmail(storedEmail)
    setUserRole(storedRole)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative pb-0">
          <div className="absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit profile</span>
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/man-avatar-profile-picture.avif" alt={userName} />
              <AvatarFallback className="text-2xl">{userName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h2 className="text-2xl font-bold">{userName}</h2>
                <Badge variant={userRole === "admin" ? "destructive" : "secondary"} className="mt-1 sm:mt-0">
                  {userRole === "admin" ? (
                    <>
                      <Shield className="mr-1 h-3 w-3" /> Administrator
                    </>
                  ) : (
                    <>
                      <User className="mr-1 h-3 w-3" /> Member
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row">
                <div className="flex items-center">
                  <Mail className="mr-1 h-4 w-4" />
                  {userEmail}
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  New York, USA
                </div>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  Joined April 2023
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-4">
              <div>
                <h3 className="font-medium">Bio</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {userRole === "admin"
                    ? "Platform administrator and stamp enthusiast with a passion for rare and historical stamps. I manage the Stamps of Approval platform and help maintain community standards."
                    : "Passionate stamp collector with interests in historical and commemorative stamps. I enjoy trading with fellow collectors and learning about stamp history."}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Interests</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">Historical Stamps</Badge>
                  <Badge variant="outline">Commemorative Issues</Badge>
                  <Badge variant="outline">Postal History</Badge>
                  <Badge variant="outline">Rare Finds</Badge>
                  <Badge variant="outline">International Stamps</Badge>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Collection</div>
                  <div className="text-2xl font-bold">42</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Trades</div>
                  <div className="text-2xl font-bold">18</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Listings</div>
                  <div className="text-2xl font-bold">7</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Forum Posts</div>
                  <div className="text-2xl font-bold">24</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" className="w-full">
            View Public Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
