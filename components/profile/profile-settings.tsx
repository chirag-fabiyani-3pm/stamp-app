"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getUserData } from "@/lib/api/auth"

// Helper function to get JWT token
const getJWT = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const stampUserData = localStorage.getItem('stamp_user_data');
      if (stampUserData) {
        const userData = JSON.parse(stampUserData);
        if (userData && userData.jwt) {
          return userData.jwt;
        }
      }
    } catch (error) {
      console.error('Error parsing stamp_user_data from localStorage:', error);
    }

    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'stamp_jwt') {
        return value;
      }
    }
  }
  return null;
};

// Helper function to get user ID
const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const userData = getUserData();
      return userData?.userId || null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
  return null;
};

export default function ProfileSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketplaceAlerts: true,
    communityNotifications: true,
    publicProfile: true,
    showOnlineStatus: true,
    allowMessages: true,
    theme: "system",
    language: "en",
  })
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Load theme from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('stamp_app_theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setSettings(prev => ({
            ...prev,
            theme: savedTheme
          }));
        }
      } catch (error) {
        console.error('Error loading theme from localStorage:', error);
      }
    }
  }, []);

  const handleToggle = (setting: string, value: boolean) => {
    setSettings({
      ...settings,
      [setting]: value,
    })
  }

  const handleChange = (setting: string, value: string) => {
    setSettings({
      ...settings,
      [setting]: value,
    })
    
    // Save theme to localStorage when it changes
    if (setting === 'theme' && typeof window !== 'undefined') {
      try {
        localStorage.setItem('stamp_app_theme', value);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const jwt = getJWT();
      const userId = getUserId();
      
      if (!jwt) {
        throw new Error('No JWT token found. Please login first.');
      }
      
      if (!userId) {
        throw new Error('No user ID found. Please login first.');
      }

      // Make DELETE request to the API
      const response = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/User/${userId}?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Clear user data from localStorage and cookies
      localStorage.removeItem('stamp_user_data');
      localStorage.removeItem('stamp_app_theme');
      
      // Clear JWT cookie
      document.cookie = 'stamp_jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login or home page
      alert('Account deleted successfully. You will be redirected to the login page.');
      window.location.href = '/login'; // or wherever your login page is
      
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(`Error deleting account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => handleChange("theme", value)}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                    <p className="font-medium">All of the following will be permanently deleted:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Your profile and personal information</li>
                      <li>All your stamp collections and observations</li>
                      <li>Your transaction history</li>
                      <li>Any saved preferences and settings</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
