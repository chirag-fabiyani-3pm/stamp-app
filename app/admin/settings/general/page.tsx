"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function GeneralSettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Stamps of Approval",
    siteDescription: "AI-powered platform for stamp collectors to catalog, identify, and trade stamps worldwide.",
    contactEmail: "support@stampai.com",
    supportPhone: "+1 (555) 123-4567",
    maintenanceMode: false,
    registrationEnabled: true,
    defaultUserRole: "user",
    itemsPerPage: "12",
    dateFormat: "MM/DD/YYYY",
    timeZone: "UTC",
    colorScheme: "orange",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setSiteSettings({
      ...siteSettings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-muted-foreground">Configure your platform settings</p>
        </div>
      </div>

      <Tabs defaultValue="site">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site">Site Information</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="users">User Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteSettings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteSettings.siteDescription}
                  onChange={(e) => handleChange("siteDescription", e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This description will be used for SEO and when sharing your site on social media.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone (Optional)</Label>
                  <Input
                    id="support-phone"
                    value={siteSettings.supportPhone}
                    onChange={(e) => handleChange("supportPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page URL</Label>
                <Input id="facebook" placeholder="https://facebook.com/yourbusiness" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile URL</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourbusiness" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Profile URL</Label>
                <Input id="instagram" placeholder="https://instagram.com/yourbusiness" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your platform's look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color-scheme">Primary Color Scheme</Label>
                <Select value={siteSettings.colorScheme} onValueChange={(value) => handleChange("colorScheme", value)}>
                  <SelectTrigger id="color-scheme">
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange">Orange (Current)</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground">Logo</span>
                  </div>
                  <Button variant="outline">Upload New Logo</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 200x50 pixels. Max file size: 2MB.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">Icon</span>
                  </div>
                  <Button variant="outline">Upload New Favicon</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 32x32 pixels. Max file size: 1MB.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Homepage Layout</CardTitle>
              <CardDescription>Configure your homepage sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Hero Section</h4>
                    <p className="text-sm text-muted-foreground">Main banner at the top of the homepage</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Features Section</h4>
                    <p className="text-sm text-muted-foreground">Highlight platform features</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">How It Works Section</h4>
                    <p className="text-sm text-muted-foreground">Step-by-step guide for new users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Featured Listings</h4>
                    <p className="text-sm text-muted-foreground">Showcase selected marketplace items</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>Configure user registration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow New Registrations</h4>
                  <p className="text-sm text-muted-foreground">Enable or disable new user registrations</p>
                </div>
                <Switch
                  checked={siteSettings.registrationEnabled}
                  onCheckedChange={(checked) => handleChange("registrationEnabled", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-role">Default User Role</Label>
                <Select
                  value={siteSettings.defaultUserRole}
                  onValueChange={(value) => handleChange("defaultUserRole", value)}
                >
                  <SelectTrigger id="default-role">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Verification Required</h4>
                  <p className="text-sm text-muted-foreground">Require users to verify their email address</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Social Login</h4>
                  <p className="text-sm text-muted-foreground">Enable login with Google, Facebook, etc.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Configure user privacy options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Public User Profiles</h4>
                  <p className="text-sm text-muted-foreground">Allow user profiles to be publicly visible</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Show Online Status</h4>
                  <p className="text-sm text-muted-foreground">Display when users are online</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Allow Direct Messages</h4>
                  <p className="text-sm text-muted-foreground">Enable direct messaging between users</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Take the site offline for maintenance (admins can still access)
                  </p>
                </div>
                <Switch
                  checked={siteSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange("maintenanceMode", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
                <Select
                  value={siteSettings.itemsPerPage}
                  onValueChange={(value) => handleChange("itemsPerPage", value)}
                >
                  <SelectTrigger id="items-per-page">
                    <SelectValue placeholder="Select items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select value={siteSettings.dateFormat} onValueChange={(value) => handleChange("dateFormat", value)}>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select value={siteSettings.timeZone} onValueChange={(value) => handleChange("timeZone", value)}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Export</CardTitle>
              <CardDescription>Manage your platform data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Database Backup</h4>
                <p className="text-sm text-muted-foreground">Create a backup of your entire database</p>
                <Button variant="outline">Generate Backup</Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">Export specific data in CSV format</p>
                <div className="flex gap-2">
                  <Button variant="outline">Export Users</Button>
                  <Button variant="outline">Export Listings</Button>
                  <Button variant="outline">Export Transactions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
