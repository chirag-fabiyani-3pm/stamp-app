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
              <TabsTrigger value="badges">Badges</TabsTrigger>
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
            <TabsContent value="badges" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="mt-2 font-medium">Early Adopter</div>
                  <div className="text-xs text-muted-foreground">Joined during beta</div>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </div>
                  <div className="mt-2 font-medium">Collector</div>
                  <div className="text-xs text-muted-foreground">10+ stamps</div>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0v-4a2 2 0 0 0-2-2Z" />
                      <path d="M18.59 13a9 9 0 0 1-11.2 0" />
                    </svg>
                  </div>
                  <div className="mt-2 font-medium">Community</div>
                  <div className="text-xs text-muted-foreground">Active member</div>
                </div>
                <div className="flex flex-col items-center rounded-lg border p-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </svg>
                  </div>
                  <div className="mt-2 font-medium">Trader</div>
                  <div className="text-xs text-muted-foreground">5+ trades</div>
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
