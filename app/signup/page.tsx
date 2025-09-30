import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FederatedSignUp } from "@/components/auth/federated-signup"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up - Stamps of Approval",
  description: "Create your Stamps of Approval account"
}

function SignUpContent({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirectPath = searchParams.redirect

  return (
    <div className="container flex items-center justify-center py-6 sm:py-12 md:py-24">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-5xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join Stamps of Approval</CardTitle>
          <CardDescription>Create your account and start collecting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 py-4">
          {redirectPath && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please sign up to access this page. You'll be redirected after signing up.
              </AlertDescription>
            </Alert>
          )}
          <FederatedSignUp />
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignUpPage({
  searchParams
}: {
  searchParams: { redirect?: string }
}) {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center py-6 sm:py-12 md:py-24">
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-5xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join Stamps of Approval</CardTitle>
            <CardDescription>Create your account and start collecting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  )
}
