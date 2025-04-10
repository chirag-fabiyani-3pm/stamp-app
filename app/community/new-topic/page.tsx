import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import NewTopicForm from "@/components/new-topic-form"
import AuthCheck from "@/components/auth-check"

export const metadata: Metadata = {
  title: "Create New Topic - Stamps of Approval Community",
  description: "Start a new discussion in the Stamps of Approval collector community",
}

export default function NewTopicPage() {
  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <div className="mb-6">
          <Link href="/community">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Community
            </Button>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Topic</h1>
            <p className="text-muted-foreground">Start a discussion with the Stamps of Approval collector community</p>
          </div>

          <NewTopicForm />
        </div>
      </div>
    </AuthCheck>
  )
}
