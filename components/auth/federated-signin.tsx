"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { sendEmailOtc, verifyEmailOtc } from "@/lib/api/auth"
import { ADMIN_ROLE_ID, ROUTES } from "@/lib/constants"

type AuthStep = 'email' | 'otp'

export function FederatedSignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [authStep, setAuthStep] = useState<AuthStep>('email')
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    email: false,
    otp: false,
    google: false,
    facebook: false
  })
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [userId, setUserId] = useState("")

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(prev => ({ ...prev, email: true }))
    
    try {
      const response = await sendEmailOtc(email)
      
      if (response.success && response.userId) {
        setUserId(response.userId)
        setAuthStep('otp')
        toast({
          title: "Check your email",
          description: "We sent you a verification code. Be sure to check your spam too.",
        })
      } else {
        throw new Error(response.message || 'Failed to send verification code')
      }
      
    } catch (error) {
      console.error('Email sign-in error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }))
    }
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || !userId) {
      toast({
        title: "Verification code required",
        description: "Please enter the verification code sent to your email.",
        variant: "destructive",
      })
      return
    }

    const otpNumber = parseInt(otp, 10)
    if (isNaN(otpNumber)) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid verification code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(prev => ({ ...prev, otp: true }))
    
    try {
      const response = await verifyEmailOtc(userId, otpNumber)
      
      if (response.success && response.user) {
        const userName = response.user.firstName || response.user.userName || 'User';
        
        toast({
          title: `Welcome, ${userName}!`,
          description: "You have been successfully signed in.",
        })
        
        // Check for redirect parameter
        const redirectPath = searchParams.get('redirect')
        
        // Determine target path based on user role
        let targetPath: string;
        if (redirectPath) {
          // If there's a specific redirect, use it
          targetPath = redirectPath;
        } else if (response.user.roleMasterId === ADMIN_ROLE_ID) {
          // If user is admin and no specific redirect, go to admin page
          targetPath = ROUTES.ADMIN;
        } else {
          // Regular users go to home
          targetPath = ROUTES.HOME;
        }
        
        // Redirect to target page
        router.push(targetPath)
        
        // Refresh the page to update the header
        window.location.reload()
      } else {
        throw new Error(response.message || 'Failed to verify code')
      }
      
    } catch (error) {
      console.error('OTP verification error:', error)
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, otp: false }))
    }
  }

  const handleBackToEmail = () => {
    setAuthStep('email')
    setOtp("")
    setUserId("")
  }

  const handleResendCode = async () => {
    if (!email) return
    
    setIsLoading(prev => ({ ...prev, email: true }))
    
    try {
      const response = await sendEmailOtc(email)
      
      if (response.success && response.userId) {
        setUserId(response.userId)
        toast({
          title: "Code resent",
          description: "A new verification code has been sent to your email.",
        })
      } else {
        throw new Error(response.message || 'Failed to resend verification code')
      }
      
    } catch (error) {
      console.error('Resend code error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }))
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(prev => ({ ...prev, google: true }))
    try {
      // This would call your backend authentication service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Replace with actual Google authentication
      // For now, this is a placeholder implementation
      
      // Check for redirect parameter
      const redirectPath = searchParams.get('redirect')
      const targetPath = redirectPath || ROUTES.HOME
      router.push(targetPath)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }))
    }
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(prev => ({ ...prev, facebook: true }))
    try {
      // This would call your backend authentication service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Replace with actual Facebook authentication
      // For now, this is a placeholder implementation
      
      // Check for redirect parameter
      const redirectPath = searchParams.get('redirect')
      const targetPath = redirectPath || ROUTES.HOME
      router.push(targetPath)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not sign in with Facebook. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(prev => ({ ...prev, facebook: false }))
    }
  }

  if (authStep === 'otp') {
    return (
      <div className="grid gap-6">
        <div className="text-center space-y-2">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>
        
        <form onSubmit={handleOtpVerification}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                disabled={isLoading.otp}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button disabled={isLoading.otp || otp.length < 4}>
              {isLoading.otp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Code
            </Button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={isLoading.email}
            >
              {isLoading.email && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToEmail}
              disabled={isLoading.otp}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Use different email
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleEmailSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button disabled={isLoading.email || !email.trim()}>
            {isLoading.email && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-4">
        <Button 
          variant="outline" 
          disabled={isLoading.google}
          onClick={handleGoogleSignIn}
        >
          {isLoading.google ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Sign in with Google
        </Button>
      </div>
    </div>
  )
} 