"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { sendEmailOtc, verifyEmailOtc, storeUserData, googleSignIn } from "@/lib/api/auth"
import { ADMIN_ROLE_ID, ROUTES } from "@/lib/constants"
import { GoogleLogin, CredentialResponse, useGoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

type AuthStep = 'email' | 'otp'

// Google JWT payload interface
interface GoogleJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export function FederatedSignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { theme, resolvedTheme } = useTheme()
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

  // Helper function to determine Google button theme
  const getGoogleButtonTheme = () => {
    const currentTheme = resolvedTheme || theme
    return currentTheme === 'dark' ? 'filled_black' : 'outline'
  }

  // Helper functions for device detection
  const generateDeviceId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `device_${timestamp}_${randomStr}`;
  };

  const getDeviceId = (): string => {
    if (typeof window === 'undefined') {
      return generateDeviceId();
    }
    
    let deviceId = localStorage.getItem('stamp_device_id');
    if (!deviceId) {
      deviceId = generateDeviceId();
      localStorage.setItem('stamp_device_id', deviceId);
    }
    return deviceId;
  };

  const setCookie = (name: string, value: string, days: number = 30): void => {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  };

  // Google OAuth success handler
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(prev => ({ ...prev, google: true }));
    
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const response = await googleSignIn(credentialResponse.credential);
      
      toast({
        title: `Welcome, ${response.user?.firstName || response.user?.userName || 'User'}!`,
        description: "You have been successfully signed in with Google.",
      });
      
      // Check for redirect parameter
      const redirectPath = searchParams.get('redirect');
      
      // Determine target path (Google users are typically regular users, not admins)
      let targetPath: string;
      if (redirectPath) {
        targetPath = redirectPath;
      } else {
        targetPath = ROUTES.HOME; // Google users go to home by default
      }
      
      // Redirect to target page
      router.push(targetPath);
      
      // Refresh the page to update the header
      window.location.reload();
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Google OAuth error handler
  const handleGoogleError = () => {
    console.error('Google sign-in failed');
    toast({
      title: "Authentication failed",
      description: "Could not sign in with Google. Please try again.",
      variant: "destructive",
    });
    setIsLoading(prev => ({ ...prev, google: false }));
  };

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
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme={getGoogleButtonTheme()}
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
          auto_select={false}
          useOneTap={false}
          width={'400'}
        />
      </div>
    </div>
  )
} 