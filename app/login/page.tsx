import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FederatedSignIn } from "@/components/auth/federated-signin"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login - Stamps of Approval",
  description: "Sign in to your Stamps of Approval account"
}

function LoginContent({ searchParams }: { searchParams: { redirect?: string } }) {
  const redirectPath = searchParams.redirect

  return (
    <div className="container flex items-center justify-center py-6 sm:py-12 md:py-24">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Stamps of Approval account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {redirectPath && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please sign in to access this page. You'll be redirected after signing in.
              </AlertDescription>
            </Alert>
          )}
          <FederatedSignIn />
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage({ 
  searchParams 
}: { 
  searchParams: { redirect?: string } 
}) {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center py-6 sm:py-12 md:py-24">
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Sign in to your Stamps of Approval account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  )
}
