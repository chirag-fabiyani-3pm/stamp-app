"use client"

import React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowLeft, Users, DollarSign, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createAccountAndSendEmailOtc, verifyEmailOtc, googleSignIn, validateReferralCode, sendEmailOtc } from "@/lib/api/auth"
import { ADMIN_ROLE_ID, ROUTES } from "@/lib/constants"
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import Link from "next/link"

type AuthStep = 'email' | 'otp'

export function FederatedSignUp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { theme, resolvedTheme } = useTheme()
  const [authStep, setAuthStep] = useState<AuthStep>('email')
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    email: false,
    otp: false,
    google: false,
    facebook: false,
    referral: false
  })
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [otp, setOtp] = useState("")
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""))
  const [userId, setUserId] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showReferralInfo, setShowReferralInfo] = useState(false)
  const [referralValidation, setReferralValidation] = useState<{
    isValid: boolean | null;
    referrerName: string | null;
    isLoading: boolean;
    error: string | null;
  }>({
    isValid: null,
    referrerName: null,
    isLoading: false,
    error: null
  })

  // Helper function to determine Google button theme
  const getGoogleButtonTheme = () => {
    const currentTheme = resolvedTheme || theme
    return currentTheme === 'dark' ? 'filled_black' : 'outline'
  }

  // Verify referral code
  const handleVerifyReferralCode = async () => {
    if (!referralCode.trim()) {
      setReferralValidation({
        isValid: null,
        referrerName: null,
        isLoading: false,
        error: "Please enter a referral code"
      })
      return
    }

    setReferralValidation(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await validateReferralCode(referralCode)

      if (response.success && response.valid) {
        setReferralValidation({
          isValid: true,
          referrerName: response.fullName || null,
          isLoading: false,
          error: null
        })
        toast({
          title: "Referral code verified!",
          description: `Successfully connected to ${response.referrerName || 'referrer'}. You can now proceed with signup.`,
        })
      } else {
        setReferralValidation({
          isValid: false,
          referrerName: null,
          isLoading: false,
          error: response.message || "Invalid referral code"
        })
        toast({
          title: "Invalid referral code",
          description: response.message || "Please check your referral code and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setReferralValidation({
        isValid: false,
        referrerName: null,
        isLoading: false,
        error: "Failed to verify referral code"
      })
        toast({
          title: "Verification failed",
          description: "Unable to verify referral code. Please try again.",
          variant: "destructive",
        })
    }
  }

  // Reset referral verification when code changes
  const handleReferralCodeChange = (value: string) => {
    setReferralCode(value.toUpperCase())
    // Reset verification if code is cleared or changed
    if (value !== referralCode) {
      setReferralValidation({
        isValid: null,
        referrerName: null,
        isLoading: false,
        error: null
      })
    }
  }

  // Handle OTP digit input
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newDigits = [...otpDigits]
    newDigits[index] = value
    setOtpDigits(newDigits)
    
    // Update the combined OTP string
    const newOtp = newDigits.join("")
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Handle OTP digit keydown for navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newDigits = [...otpDigits]
      
      if (otpDigits[index]) {
        // Clear current digit
        newDigits[index] = ""
      } else if (index > 0) {
        // Move to previous and clear
        newDigits[index - 1] = ""
        const prevInput = document.getElementById(`otp-${index - 1}`)
        prevInput?.focus()
      }
      
      setOtpDigits(newDigits)
      setOtp(newDigits.join(""))
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (otpDigits.join("").length >= 4) {
        handleOtpVerification(e as any)
      }
    }
  }

  // Handle paste for OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newDigits = Array(6).fill("")
    
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i]
    }
    
    setOtpDigits(newDigits)
    setOtp(newDigits.join(""))
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newDigits.findIndex(digit => digit === "")
    const targetIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5)
    const targetInput = document.getElementById(`otp-${targetIndex}`)
    targetInput?.focus()
  }

  // Google OAuth success handler
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    // Check referral code validation if provided
    if (Boolean(referralCode) && referralValidation.isValid !== true) {
      toast({
        title: "Referral code required",
        description: "Please verify your referral code before proceeding with signup.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(prev => ({ ...prev, google: true }));

    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      const response = await googleSignIn(credentialResponse.credential, referralCode);

      toast({
        title: `Welcome, ${response.user?.firstName || response.user?.userName || 'User'}!`,
        description: "Your account has been created successfully with Google.",
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
      console.error('Google sign-up error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Google OAuth error handler
  const handleGoogleError = () => {
    console.error('Google sign-up failed');
    toast({
      title: "Registration failed",
      description: "Could not create account with Google. Please try again.",
      variant: "destructive",
    });
    setIsLoading(prev => ({ ...prev, google: false }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }
    
    if (!firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name.",
        variant: "destructive",
      })
      return
    }
    
    if (!lastName.trim()) {
      toast({
        title: "Last name required",
        description: "Please enter your last name.",
        variant: "destructive",
      })
      return
    }

    // Check referral code validation if provided
    if (Boolean(referralCode) && referralValidation.isValid !== true) {
      toast({
        title: "Referral code required",
        description: "Please verify your referral code before proceeding with signup.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(prev => ({ ...prev, email: true }))

    try {
      const response = await createAccountAndSendEmailOtc(email, firstName.trim(), lastName.trim(), referralCode)

      console.log(response)

      if (response.success && response.userId) {
        setUserId(response.userId)
        setAuthStep('otp')
        toast({
          title: "Check your email",
          description: "We sent you a verification code. Be sure to check your spam too.",
        })
      } else {
        toast({
          title: "Error",
          description: response.message,
        })
        throw new Error(response.message || 'Failed to send verification code')
      }

    } catch (error) {
      console.error('Email sign-up error:', error)
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
          description: "Your account has been created successfully.",
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
    setOtpDigits(Array(6).fill(""))
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
          <div className="grid gap-6">
            <div className="space-y-4">
              <Label className="text-center block text-sm font-medium">
                Verification Code
              </Label>
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={isLoading.otp}
                    className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg transition-all duration-200 bg-background ${
                      digit 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                    autoComplete="off"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            <Button 
              disabled={isLoading.otp || otp.length < 4}
              className="w-full h-11 font-medium"
              size="lg"
            >
              {isLoading.otp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </div>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
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
    <div className="space-y-8">
      {/* Desktop: Two-column layout, Mobile: Single column */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-10">
        {/* Left Column: Referral Code Section */}
        <div className="space-y-6 md:pr-8 lg:pr-10 md:border-r md:border-border/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Referral Code</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have a referral code? Enter it below to unlock exclusive benefits and join our community network.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="referralCode" className="text-sm font-medium">
                Referral Code (Optional)
              </Label>
              <div className="flex gap-3">
                <Input
                  id="referralCode"
                  placeholder="Enter code"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  value={referralCode}
                  onChange={(e) => handleReferralCodeChange(e.target.value)}
                  className="uppercase text-center font-mono text-lg tracking-wider"
                  disabled={referralValidation.isLoading}
                />
                <Button
                  type="button"
                  variant={referralValidation.isValid === true ? "default" : "outline"}
                  onClick={handleVerifyReferralCode}
                  disabled={!referralCode.trim() || referralValidation.isValid === true || referralValidation.isLoading}
                  className="shrink-0 min-w-[90px]"
                >
                  {referralValidation.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : referralValidation.isValid === true ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verified
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>

            {/* Validation Status */}
            {referralValidation.isValid === true && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Valid referral code {referralValidation.referrerName && (
                      <>from <span className="font-medium">{referralValidation.referrerName}</span></>
                    )}
                  </span>
                </p>
              </div>
            )}

            {referralValidation.isValid === false && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {referralValidation.error || "Invalid referral code"}
                </p>
              </div>
            )}
          </div>

          {/* Referral Benefits */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Referral Benefits</h4>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-green-800 dark:text-green-300">Earn 20% Commission</p>
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Get 20% of your referrals' subscription fees as monthly rewards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-primary">Become a Dealer</p>
                    <p className="text-xs text-muted-foreground">
                      Reach 20 successful referrals and get your subscription reduced to just $2/month.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                href="/pricing#referral-program" 
                className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                View Full Commission Details →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Sign Up Options */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Create Your Account</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose your preferred sign-up method to get started with our philatelic community.
            </p>
          </div>

          <div className="space-y-5">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="given-name"
                    autoCorrect="off"
                    disabled={isLoading.email}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="family-name"
                    autoCorrect="off"
                    disabled={isLoading.email}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
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
                  className="h-11"
                />
              </div>
              <Button
                disabled={isLoading.email || !email.trim() || !firstName.trim() || !lastName.trim() || (Boolean(referralCode) && referralValidation.isValid !== true)}
                className="w-full h-11 font-medium"
                size="lg"
              >
                {isLoading.email && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign up with Email
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="relative">
              <div className={`transition-opacity duration-200 ${referralCode && referralValidation.isValid !== true ? 'opacity-50' : ''}`}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme={getGoogleButtonTheme()}
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  logo_alignment="left"
                  auto_select={false}
                  useOneTap={false}
                  width={'100%'}
                />
              </div>
              {referralCode && referralValidation.isValid !== true && (
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-md flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Please verify your referral code first
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This ensures proper credit allocation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {referralCode && referralValidation.isValid === true && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400 text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Referral code <span className="font-mono font-medium bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">{referralCode}</span> verified and ready to apply
          </p>
        </div>
      )}

      {referralCode && referralValidation.isValid === false && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-400 text-center">
            ⚠ Please verify your referral code to continue with signup
          </p>
        </div>
      )}
    </div>
  )
}
