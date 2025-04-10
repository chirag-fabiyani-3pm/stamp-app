import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { MailOpen, MapPin, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-12">
      <Heading className="mb-4">Contact Us</Heading>
      <Separator className="mb-8" />

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MailOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground mb-1">For general inquiries:</p>
                  <a href="mailto:info@stampai.com" className="text-primary hover:underline">
                    info@stampai.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">For support:</p>
                  <a href="mailto:support@stampai.com" className="text-primary hover:underline">
                    support@stampai.com
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-sm text-muted-foreground mb-1">Customer Support:</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 9:00 AM - 5:00 PM EST</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Office</h3>
                  <p className="text-sm text-muted-foreground">123 Philately Street</p>
                  <p className="text-sm text-muted-foreground">Suite 456</p>
                  <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                  <p className="text-sm text-muted-foreground">United States</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Community</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Join our community forum to connect with other collectors and get faster answers to common
                    questions.
                  </p>
                  <a href="/community" className="text-primary hover:underline">
                    Visit Community Forum
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>

              <form className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email address" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is your message about?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Please describe your inquiry in detail..." rows={6} />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="privacy" className="rounded border-gray-300" />
                  <Label htmlFor="privacy" className="text-sm cursor-pointer">
                    I agree to the{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </Card>

          <div className="mt-8 rounded-lg overflow-hidden border h-80 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map view would appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
