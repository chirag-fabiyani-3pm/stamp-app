import type { Metadata } from "next"
import { Suspense } from "react"
import CommunityForums from "@/components/community-forums"

export const metadata: Metadata = {
  title: "Community - Stamps of Approval",
  description: "Connect with stamp collectors worldwide in our community forums",
}

export default function CommunityPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Stamp Collector Community</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join discussions, share knowledge, and connect with fellow stamp collectors from around the world
        </p>
      </div>

      <Suspense fallback={<div>Loading community forums...</div>}>
        <CommunityForums />
      </Suspense>
    </div>
  )
}
