"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Crown,
    DollarSign,
    Users,
    Copy,
    TrendingUp,
    Gift,
    Wallet,
    Settings,
    Star,
    Timer,
    CreditCard,
    ArrowDownLeft
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSubscription } from "@/lib/hooks/useSubscription"
import { SubscriptionManagement } from "./subscription-management"

export function SubscriptionDashboard() {
    const { toast } = useToast()
    const { getPricingTier, getReferralProgress, subscriptionStatus } = useSubscription()
    const [referralToken] = useState('REF-' + Math.random().toString(36).substring(2, 8).toUpperCase())

    // Component state
    const [showManagement, setShowManagement] = useState(false)
    
    // Withdrawal and banking details state
    const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)
    const [isBankingDialogOpen, setIsBankingDialogOpen] = useState(false)
    const [isEditingBanking, setIsEditingBanking] = useState(false)
    const [withdrawalAmount, setWithdrawalAmount] = useState("")
    const [bankingForm, setBankingForm] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        routingNumber: ''
    })

    // Mock data based on BRD requirements
    const mockData = {
        referralCount: 8,
        monthlyCommission: 24.80,
        accountBalance: 156.40,
        activeReferrals: 8,
        totalEarnings: 487.20,
        totalWithdrawn: 245.60,
        nextBillingDate: '2024-10-18',
        subscriptionTier: '2-countries',
        subscriptionCost: 8,
        isDealer: false,
        commissionRate: 20 // 20% as per BRD
    }

    // Mock banking details (single account only)
    const [bankingDetails, setBankingDetails] = useState<{
        id: string;
        type: string;
        name: string;
        accountNumber: string;
        bankName: string;
        routingNumber: string;
    } | null>({
        id: "1",
        type: "bank",
        name: "Primary Checking",
        accountNumber: "****1234",
        bankName: "Chase Bank",
        routingNumber: "021000021"
    })

    const pricingTier = getPricingTier()
    const referralProgress = getReferralProgress()
    const remainingForDealer = Math.max(0, 20 - subscriptionStatus.referralCount)

    const copyReferralCode = () => {
        navigator.clipboard.writeText(subscriptionStatus.referralToken || '')
        toast({
            title: "Referral token copied!",
            description: "Share this token with friends to start earning commissions.",
        })
    }

    const shareReferralCode = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join Stamps of Approval',
                text: `Use my referral code ${referralToken} to get started with stamp collecting and I'll earn a commission!`,
                url: `${window.location.origin}/signup?ref=${referralToken}`
            })
        } else {
            copyReferralCode()
        }
    }

    const handleWithdrawal = () => {
        const amount = parseFloat(withdrawalAmount)
        if (!amount || amount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid withdrawal amount.",
                variant: "destructive"
            })
            return
        }

        if (amount > mockData.accountBalance) {
            toast({
                title: "Insufficient balance",
                description: "You don't have enough balance for this withdrawal.",
                variant: "destructive"
            })
            return
        }

        if (!bankingDetails) {
            toast({
                title: "No banking details found",
                description: "Please add your banking details before making a withdrawal.",
                variant: "destructive"
            })
            return
        }

        // Mock withdrawal processing
        toast({
            title: "Withdrawal request submitted",
            description: `$${amount} will be transferred to your ${bankingDetails.name}. Processing may take 3-5 business days.`,
        })

        setIsWithdrawalDialogOpen(false)
        setWithdrawalAmount("")
    }

    const handleManageBanking = () => {
        if (bankingDetails) {
            // Pre-fill form with existing details for editing
            setBankingForm({
                bankName: bankingDetails.bankName,
                accountName: bankingDetails.name,
                accountNumber: bankingDetails.accountNumber.replace('****', ''),
                routingNumber: bankingDetails.routingNumber
            })
            setIsEditingBanking(true)
        } else {
            // Clear form for new details
            setBankingForm({
                bankName: '',
                accountName: '',
                accountNumber: '',
                routingNumber: ''
            })
            setIsEditingBanking(false)
        }
        setIsBankingDialogOpen(true)
    }

    const handleSaveBanking = () => {
        // Basic validation
        if (!bankingForm.bankName || !bankingForm.accountName || !bankingForm.accountNumber || !bankingForm.routingNumber) {
            toast({
                title: "Please fill all fields",
                description: "All banking details are required.",
                variant: "destructive"
            })
            return
        }

        // Save banking details
        setBankingDetails({
            id: "1",
            type: "bank",
            name: bankingForm.accountName,
            accountNumber: `****${bankingForm.accountNumber.slice(-4)}`,
            bankName: bankingForm.bankName,
            routingNumber: bankingForm.routingNumber
        })

        toast({
            title: isEditingBanking ? "Banking details updated" : "Banking details added",
            description: "Your banking information has been saved securely.",
        })

        setIsBankingDialogOpen(false)
        setIsEditingBanking(false)
    }

    // Show subscription management flow
    if (showManagement) {
        const currentSubscription = {
            tier: mockData.subscriptionTier,
            countries: '2 Countries',
            price: mockData.subscriptionCost,
            selectedCountries: [
                { id: 'usa', name: 'United States', flag: '🇺🇸' },
                { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' }
            ],
            nextBillingDate: mockData.nextBillingDate,
            status: 'active' as const,
            isDealer: mockData.isDealer
        }

        return (
            <SubscriptionManagement
                currentSubscription={currentSubscription}
                onBack={() => setShowManagement(false)}
            />
        )
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Subscription Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your subscription, track referrals, and monitor earnings
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={mockData.isDealer ? "default" : "secondary"} className="text-sm">
                        {mockData.isDealer ? (
                            <>
                                <Crown className="w-4 h-4 mr-1" />
                                Dealer Status
                            </>
                        ) : (
                            "Normal Subscriber"
                        )}
                    </Badge>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Referrals</p>
                                <p className="text-2xl font-bold text-purple-600">{subscriptionStatus.referralCount}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Current Month Commission</p>
                                <p className="text-2xl font-bold text-green-600">${subscriptionStatus.currentMonthCommission}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Last Month Commission</p>
                                <p className="text-2xl font-bold text-yellow-600">${subscriptionStatus.lastMonthCommission}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                                <p className="text-2xl font-bold text-blue-600">${subscriptionStatus.totalWalletBalance}</p>
                            </div>
                            <Wallet className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">All-Time Earnings</p>
                                <p className="text-2xl font-bold text-orange-600">${subscriptionStatus.totalEarnings}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Withdrawn</p>
                                <p className="text-2xl font-bold text-red-600">${subscriptionStatus.totalWithdrawalAmount}</p>
                            </div>
                            <ArrowDownLeft className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-primary" />
                            Your Subscription
                        </CardTitle>
                        <CardDescription>Current subscription details and billing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{subscriptionStatus.countryCount === 1 ? '1 Country' : `${subscriptionStatus.countryCount} Countries`} Access</h3>
                                <p className="text-sm text-muted-foreground">Premium stamp catalog access</p>
                            </div>
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                Active
                            </Badge>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                                <p className="font-semibold">${subscriptionStatus.subscriptionCost}/month</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Next Billing</p>
                                <p className="font-semibold">{subscriptionStatus.nextBillingDate?.slice(0,10)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Commission Rate</p>
                                <p className="font-semibold">20%</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">User Type</p>
                                <p className="font-semibold">{subscriptionStatus.isDealer ? 'Dealer' : 'Normal Subscriber'}</p>
                            </div>
                        </div>

                        {/* <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowManagement(true)}
                            disabled={true}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Subscription
                        </Button> */}
                    </CardContent>
                </Card>

                {/* Referral Program */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-green-600" />
                            Referral Program
                        </CardTitle>
                        <CardDescription>Share your referral token and track earnings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">Your Referral Token</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyReferralCode}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-background p-3 rounded border font-mono text-center text-lg font-bold">
                                {subscriptionStatus.referralToken}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress to Dealer Status</span>
                                    <span>{subscriptionStatus.referralCount}/20 referrals</span>
                                </div>
                                <Progress value={(subscriptionStatus.referralCount / 20) * 100} className="h-3" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {remainingForDealer} more referrals to unlock $2/month subscription
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Withdrawal Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Account Balance & Withdrawal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-blue-600" />
                            Account Balance
                        </CardTitle>
                        <CardDescription>Manage your earnings and withdrawals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-6 rounded-lg">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600 mb-2">${subscriptionStatus.accountBalance}</p>
                                <p className="text-sm text-muted-foreground">Available Balance</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Earnings</span>
                                <span className="text-sm font-semibold text-green-600">${subscriptionStatus.totalEarnings}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Withdrawn</span>
                                <span className="text-sm font-semibold text-red-600">${subscriptionStatus.totalWithdrawalAmount}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Available Balance</span>
                                <span className="text-sm font-semibold">${subscriptionStatus.accountBalance}</span>
                            </div>
                        </div>

                        <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full" disabled={true}>
                                    <ArrowDownLeft className="w-4 h-4 mr-2" />
                                    Withdraw Funds
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Withdraw Funds</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you want to withdraw from your account balance.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Withdrawal Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={withdrawalAmount}
                                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                                            max={mockData.accountBalance}
                                            min="0"
                                            step="0.01"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Available: ${mockData.accountBalance}
                                        </p>
                                    </div>

                                    {bankingDetails && (
                                        <div className="space-y-2">
                                            <Label>Banking Method</Label>
                                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                <CreditCard className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm">{bankingDetails.name} - {bankingDetails.accountNumber}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button onClick={handleWithdrawal} className="flex-1">
                                            Submit Withdrawal
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleManageBanking}
                                            className="flex-1"
                                        >
                                            Manage Banking
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Banking Details Management Dialog */}
                        <Dialog open={isBankingDialogOpen} onOpenChange={setIsBankingDialogOpen}>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>
                                        {bankingDetails ? "Update Banking Details" : "Add Banking Details"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {bankingDetails ? 
                                            "Update your banking information for withdrawals. You can only have one bank account on file." :
                                            "Add your banking information for withdrawals. You can only have one bank account on file."
                                        }
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                    {/* Current Banking Details (if editing) */}
                                    {bankingDetails && (
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <h4 className="font-medium mb-2">Current Banking Details</h4>
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="w-5 h-5 text-purple-600" />
                                                <div>
                                                    <p className="font-medium">{bankingDetails.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {bankingDetails.bankName} • {bankingDetails.accountNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Banking Details Form */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="bankName">Bank Name</Label>
                                                <Input 
                                                    id="bankName" 
                                                    placeholder="e.g., Chase Bank" 
                                                    value={bankingForm.bankName}
                                                    onChange={(e) => setBankingForm(prev => ({...prev, bankName: e.target.value}))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="accountName">Account Name</Label>
                                                <Input 
                                                    id="accountName" 
                                                    placeholder="e.g., Primary Checking" 
                                                    value={bankingForm.accountName}
                                                    onChange={(e) => setBankingForm(prev => ({...prev, accountName: e.target.value}))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="accountNumber">Account Number</Label>
                                                <Input 
                                                    id="accountNumber" 
                                                    placeholder="Enter account number" 
                                                    value={bankingForm.accountNumber}
                                                    onChange={(e) => setBankingForm(prev => ({...prev, accountNumber: e.target.value}))}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="routingNumber">Routing Number</Label>
                                                <Input 
                                                    id="routingNumber" 
                                                    placeholder="Enter routing number" 
                                                    value={bankingForm.routingNumber}
                                                    onChange={(e) => setBankingForm(prev => ({...prev, routingNumber: e.target.value}))}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Button onClick={handleSaveBanking} className="flex-1">
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                {bankingDetails ? "Update" : "Save"} Banking Details
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsBankingDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                        
                                        {bankingDetails && (
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                                onClick={() => {
                                                    setBankingDetails(null)
                                                    setIsBankingDialogOpen(false)
                                                    toast({
                                                        title: "Banking details removed",
                                                        description: "Your banking details have been removed.",
                                                    })
                                                }}
                                            >
                                                Remove Banking Details
                                            </Button>
                                        )}
                                    </div>

                                    <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                                        <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">Single Account Policy</p>
                                        <p>For security and simplicity, you can only have one bank account on file. Updating your details will replace the existing account information.</p>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Commission Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            Recent Referral Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!subscriptionStatus?.referralActivity || subscriptionStatus.referralActivity.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground">
                                    No referral activity yet
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Share your referral link to start earning commissions
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {subscriptionStatus.referralActivity.map((referral, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                {referral.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{referral.name}</p>
                                                <p className="text-sm text-muted-foreground">{referral.plan} plan</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">{referral.commission}/mo</p>
                                            <p className="text-xs text-muted-foreground">{referral.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Banking Details Management */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                            Banking Details
                        </CardTitle>
                        <CardDescription>Your bank account for withdrawals (one account only)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!bankingDetails ? (
                            <div className="text-center py-8">
                                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-sm text-muted-foreground mb-4">
                                    No banking details saved yet
                                </p>
                                <Button onClick={handleManageBanking}>
                                    Add Banking Details
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{bankingDetails.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {bankingDetails.bankName} • {bankingDetails.accountNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">Active</Badge>
                                </div>

                                <Button variant="outline" className="w-full" onClick={handleManageBanking}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Update Banking Details
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card> */}
            </div>

            
        </div>
    )
}
