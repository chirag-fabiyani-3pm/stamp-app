"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pencil, Bell, Mail, MessageSquare, Tag, AlertTriangle } from "lucide-react"
import { useState } from "react"

// Sample email templates
const emailTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    subject: "Welcome to Stamps of Approval!",
    description: "Sent to new users after registration",
    lastEdited: "2 weeks ago",
  },
  {
    id: 2,
    name: "Password Reset",
    subject: "Reset Your Stamps of Approval Password",
    description: "Sent when a user requests a password reset",
    lastEdited: "1 month ago",
  },
  {
    id: 3,
    name: "Listing Approved",
    subject: "Your Listing Has Been Approved",
    description: "Sent when a marketplace listing is approved",
    lastEdited: "3 weeks ago",
  },
  {
    id: 4,
    name: "New Bid Notification",
    subject: "New Bid on Your Listing",
    description: "Sent when someone places a bid on a user's listing",
    lastEdited: "1 month ago",
  },
  {
    id: 5,
    name: "Trade Offer",
    subject: "New Trade Offer Received",
    description: "Sent when someone makes a trade offer",
    lastEdited: "2 months ago",
  },
]

export default function NotificationsSettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    digestFrequency: "daily",
    adminAlerts: true,
    marketplaceNotifications: true,
    communityNotifications: true,
    systemNotifications: true,
  })

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">Configure how users receive notifications</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="events">Notification Events</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Configure how notifications are delivered</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => handleChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">In-App Notifications</h4>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                </div>
                <Switch
                  checked={notificationSettings.inAppNotifications}
                  onCheckedChange={(checked) => handleChange("inAppNotifications", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure notification frequency and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Email Digest Frequency</Label>
                <Select
                  value={notificationSettings.digestFrequency}
                  onValueChange={(value) => handleChange("digestFrequency", value)}
                >
                  <SelectTrigger id="digest-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How often to send email digests summarizing activity</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Admin Alerts</h4>
                  <p className="text-sm text-muted-foreground">Send notifications to admins for important events</p>
                </div>
                <Switch
                  checked={notificationSettings.adminAlerts}
                  onCheckedChange={(checked) => handleChange("adminAlerts", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Notification Email</Label>
                <Input id="admin-email" placeholder="admin@example.com" />
                <p className="text-xs text-muted-foreground">Email address to receive admin notifications</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize notification email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Template Name</th>
                      <th className="p-3 text-left font-medium">Subject</th>
                      <th className="p-3 text-left font-medium">Description</th>
                      <th className="p-3 text-left font-medium">Last Edited</th>
                      <th className="p-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailTemplates.map((template) => (
                      <tr key={template.id} className="border-b">
                        <td className="p-3">{template.name}</td>
                        <td className="p-3">{template.subject}</td>
                        <td className="p-3 text-muted-foreground text-sm">{template.description}</td>
                        <td className="p-3 text-muted-foreground text-sm">{template.lastEdited}</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              setSelectedTemplate(template)
                              setIsTemplateDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Template Edit Dialog */}
              <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="max-w-3xl">
                  {selectedTemplate && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Edit Template: {selectedTemplate.name}</DialogTitle>
                        <DialogDescription>
                          Customize the email template for {selectedTemplate.description.toLowerCase()}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="template-subject">Email Subject</Label>
                          <Input id="template-subject" defaultValue={selectedTemplate.subject} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="template-content">Email Content</Label>
                          <Textarea
                            id="template-content"
                            rows={12}
                            defaultValue={`Dear {{user.name}},

Thank you for joining Stamps of Approval! We're excited to have you as part of our community.

Your account has been successfully created and you can now start exploring our platform. Here are a few things you can do:

- Browse our extensive stamp catalog
- Upload and identify your stamps using our AI recognition
- Connect with fellow collectors
- Trade or sell stamps in our marketplace

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The Stamps of Approval Team`}
                          />
                          <p className="text-xs text-muted-foreground">
                            You can use variables like {`{{user.name}}`}, {`{{user.email}}`}, etc.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div className="border rounded-md p-4 bg-muted/50">
                            <p className="text-sm">Preview would be displayed here</p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsTemplateDialogOpen(false)}>Save Template</Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email Address</Label>
                <Input id="from-email" defaultValue="noreply@stampai.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" defaultValue="Stamps of Approval Team" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To Email</Label>
                <Input id="reply-to" defaultValue="support@stampai.com" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Include Logo in Emails</h4>
                  <p className="text-sm text-muted-foreground">Display your site logo in email templates</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Events</CardTitle>
              <CardDescription>Configure which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4" /> Marketplace Events
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Listing</h4>
                      <p className="text-sm text-muted-foreground">When a new listing is created</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketplaceNotifications}
                      onCheckedChange={(checked) => handleChange("marketplaceNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Bid</h4>
                      <p className="text-sm text-muted-foreground">When a bid is placed on a listing</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Trade Offer</h4>
                      <p className="text-sm text-muted-foreground">When a trade offer is received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Listing Approved/Rejected</h4>
                      <p className="text-sm text-muted-foreground">When a listing is moderated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4" /> Community Events
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Topic Reply</h4>
                      <p className="text-sm text-muted-foreground">When someone replies to your topic</p>
                    </div>
                    <Switch
                      checked={notificationSettings.communityNotifications}
                      onCheckedChange={(checked) => handleChange("communityNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Mention</h4>
                      <p className="text-sm text-muted-foreground">When someone mentions you in a post</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Topic Approved/Rejected</h4>
                      <p className="text-sm text-muted-foreground">When your topic is moderated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4" /> System Events
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Account Changes</h4>
                      <p className="text-sm text-muted-foreground">Password changes, email updates, etc.</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemNotifications}
                      onCheckedChange={(checked) => handleChange("systemNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Security Alerts</h4>
                      <p className="text-sm text-muted-foreground">Suspicious login attempts, etc.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">System Announcements</h4>
                      <p className="text-sm text-muted-foreground">Maintenance, new features, etc.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
