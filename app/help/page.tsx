import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function HelpCenterPage() {
  return (
    <div className="container py-12">
      <Heading className="mb-4">Help Center</Heading>
      <Separator className="mb-8" />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-medium mb-3">Getting Started</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">Creating an account</li>
            <li className="hover:text-primary">Setting up your profile</li>
            <li className="hover:text-primary">Adding stamps to your collection</li>
            <li className="hover:text-primary">Navigating the marketplace</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-medium mb-3">Stamp Identification</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">Using the AI scanner</li>
            <li className="hover:text-primary">Understanding stamp details</li>
            <li className="hover:text-primary">Manual search options</li>
            <li className="hover:text-primary">Saving identification results</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-medium mb-3">Authentication</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">Getting stamps authenticated</li>
            <li className="hover:text-primary">Becoming a reviewer</li>
            <li className="hover:text-primary">Understanding certification levels</li>
            <li className="hover:text-primary">Disputing authentication results</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-medium mb-3">Community</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">Forum guidelines</li>
            <li className="hover:text-primary">Creating and replying to topics</li>
            <li className="hover:text-primary">Community badges and rewards</li>
            <li className="hover:text-primary">Reporting inappropriate content</li>
          </ul>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-medium mb-3">Account Settings</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-primary">Managing your profile</li>
            <li className="hover:text-primary">Notification preferences</li>
            <li className="hover:text-primary">Privacy settings</li>
            <li className="hover:text-primary">Deleting your account</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
