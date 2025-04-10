import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CreateListingForm from "@/components/create-listing-form"
import AuthCheck from "@/components/auth-check"

export const metadata: Metadata = {
  title: "Create Listing - Stamps of Approval Marketplace",
  description: "Create a new listing to sell or trade your stamps",
}

export default function CreateListingPage() {
  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Marketplace
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Marketplace Listing</h1>
            <p className="text-muted-foreground">List your stamp for sale or trade with collectors worldwide</p>
          </div>

          <CreateListingForm />
        </div>
      </div>
    </AuthCheck>
  )
}
