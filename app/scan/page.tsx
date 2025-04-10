import type { Metadata } from "next"
import StampScanner from "@/components/stamp-scanner"
import AuthCheck from "@/components/auth-check"

export const metadata: Metadata = {
  title: "Scan Stamp - Stamps of Approval",
  description: "Upload and identify stamps using AI recognition",
}

export default function ScanPage() {
  return (
    <AuthCheck>
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Stamp Recognition</h1>
            <p className="text-muted-foreground">Upload an image of your stamp and let our AI identify it</p>
          </div>

          <StampScanner />
        </div>
      </div>
    </AuthCheck>
  )
}
