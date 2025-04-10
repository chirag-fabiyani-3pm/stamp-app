import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
      <p className="text-muted-foreground mb-6">The community topic you're looking for could not be found.</p>
      <Link href="/community">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Community
        </Button>
      </Link>
    </div>
  )
}
