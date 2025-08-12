import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Edit,
  User,
  Shield,
  Loader2,
  Phone,
  RefreshCw,
  AlertCircle,
  Calendar,
  IdCard,
  Save,
  X,
  MapPin,
  Eye,
  Upload
} from "lucide-react"

interface UserData {
  id: string
  userId: string
  userName: string
  roleMasterId: string
  roleMasterName: string
  firstName: string
  lastName: string
  created: string
  expiresAt: string
  forcePasswordChange: boolean
  avatarName: string
  avatarUrl: string
  trackingInterval: number
  passKey: string
  signUpType: number
  isNewUser: boolean
  jwt: string
  themeColour: string
  // Additional fields that might be in the user data
  email?: string
  mobileNumber?: string
  dateOfBirth?: string
  aboutMe?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  membershipCode?: string
}

interface AddressData {
  id?: string
  userId: string
  fullAddress: string
  addressLatitude: number
  addressLongitude: number
}

export default function ProfileInfo() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addressLoading, setAddressLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    aboutMe: "",
    mobileNumber: "",
    userName: "",
    fullAddress: ""
  })

  // Load user data from localStorage
  useEffect(() => {
    try {
      const userDataStr = localStorage.getItem('stamp_user_data')
      if (userDataStr) {
        const parsedUserData = JSON.parse(userDataStr)

        // Fetch fresh user data from API instead of using localStorage data directly
        fetchUserData(parsedUserData)
      } else {
        setError('No user data found in localStorage')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error)
      setError('Failed to load user data')
      setLoading(false)
    }
  }, [])

  // Fetch user data from API
  const fetchUserData = async (userData: UserData) => {
    const { userId, jwt } = userData;
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/User/${userId}?id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const userResult = await response.json()

      // Merge the API response with jwt from localStorage
      const updatedUserData = {
        ...userData,
        ...userResult,
        jwt: jwt // Keep the JWT from localStorage
      }

      setUserData(updatedUserData)
      setLoading(false)

      // Fetch address data
      fetchAddressData(userId, jwt)
    } catch (error) {
      console.error('Error fetching user data from API:', error)
      setError('Failed to fetch user data from server')
      setLoading(false)
    }
  }

  // Fetch address data
  const fetchAddressData = async (userId: string, jwt: string) => {
    setAddressLoading(true)

    try {
      const response = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/UserAddress?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true'
        }
      })

      if (response.ok) {
        const addressResult = await response.json()
        setAddressData(addressResult)
      } else if (response.status === 404) {
        setAddressData(null)
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching address data:', error)
    } finally {
      setAddressLoading(false)
    }
  }

  // Initialize form when userData and addressData change
  useEffect(() => {
    if (userData) {
      const addressItem = Array.isArray(addressData) ? addressData[0] : addressData;
      setEditForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : "",
        aboutMe: userData.aboutMe || "",
        mobileNumber: userData.mobileNumber || "",
        userName: userData.userName || "",
        fullAddress: addressItem?.fullAddress || ""
      })
    }
  }, [userData, addressData])
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)

    try {
      if (!userData) {
        throw new Error('User data not available')
      }

      // Update user profile
      const userBody = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        dateOfBirth: editForm.dateOfBirth ? new Date(editForm.dateOfBirth).toISOString() : null,
        aboutMe: editForm.aboutMe,
        mobileNumber: editForm.mobileNumber,
        userName: editForm.userName
      }
      const userId = localStorage.getItem('stamp_user_data') && JSON.parse(localStorage.getItem('stamp_user_data') || '{}').userId || ''
      const userResponse = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/User/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(userBody)
      })

      if (!userResponse.ok) {
        throw new Error(`Failed to update user profile! status: ${userResponse.status}`)
      }

      // Update or create address using PUT method with address ID
      const addressItem = Array.isArray(addressData) ? addressData[0] : addressData;
      const addressBody = {
        userId: userData.userId,
        fullAddress: editForm.fullAddress
      }

      // Use PUT method with address ID if available, otherwise POST for new address
      const addressEndpoint = addressItem?.id
        ? `https://3pm-stampapp-prod.azurewebsites.net/api/v1/UserAddress/${addressItem.id}`
        : `https://3pm-stampapp-prod.azurewebsites.net/api/v1/UserAddress`;

      const addressResponse = await fetch(addressEndpoint, {
        method: addressItem?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: JSON.stringify(addressBody)
      })

      if (!addressResponse.ok) {
        throw new Error(`Failed to update address! status: ${addressResponse.status}`)
      }


      const parsedUserData = localStorage.getItem('stamp_user_data') && JSON.parse(localStorage.getItem('stamp_user_data') || '{}')
      const jwt = parsedUserData.jwt || ''
      // Refresh address data
      await fetchAddressData(userId, jwt)

      // Fetch fresh user data from API to ensure we have the latest data
      await fetchUserData(parsedUserData)

      setIsEditDialogOpen(false)

    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  // Handle image file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.')
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.')
        return
      }

      setSelectedImage(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage || !userData) {
      return
    }

    setImageUploading(true)

    try {
      const formData = new FormData()
      formData.append('profileImage', selectedImage)

      const response = await fetch(`https://3pm-stampapp-prod.azurewebsites.net/api/v1/User/ManageProfileImage?id=${userData.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userData.jwt}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to upload image! status: ${response.status}`)
      }

      // Get the updated user data
      await response.json()
      const parsedUserData = localStorage.getItem('stamp_user_data') && JSON.parse(localStorage.getItem('stamp_user_data') || '{}')
      // Fetch fresh user data from API to get the updated avatar URL
      await fetchUserData(parsedUserData)

      // Clean up
      setSelectedImage(null)
      setPreviewUrl(null)
      setIsImageDialogOpen(false)

      alert('Profile image updated successfully!')

    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Refresh function to fetch fresh data
  const handleRefresh = async () => {
    try {
      const userDataStr = localStorage.getItem('stamp_user_data')
      if (userDataStr) {
        const parsedUserData = JSON.parse(userDataStr)
        await fetchUserData(parsedUserData)
      } else {
        setError('No user data found in localStorage')
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      setError('Failed to refresh user data')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: '#f4831f' }} />
              <p className="text-slate-600 dark:text-slate-300">Loading your profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
              <p className="text-red-600 dark:text-red-400">Error loading profile</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-3 border-[#f4831f] text-[#f4831f] hover:bg-[#f4831f] hover:text-white dark:border-[#f4831f] dark:text-[#f4831f] dark:hover:bg-[#f4831f] dark:hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="space-y-4">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-slate-500 dark:text-slate-400" />
              <p className="text-slate-600 dark:text-slate-300">No profile data found</p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-3 border-[#f4831f] text-[#f4831f] hover:bg-[#f4831f] hover:text-white dark:border-[#f4831f] dark:text-[#f4831f] dark:hover:bg-[#f4831f] dark:hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getFullName = () => {
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
    return fullName || userData.userName || 'User'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return null
    }
  }

  const isAdmin = userData.roleMasterName?.toLowerCase().includes('admin') ||
    userData.roleMasterName?.toLowerCase().includes('administrator')



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Subtle Profile Header */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            <div className="relative">
              <Avatar
                className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-slate-100 dark:border-slate-600 shadow-sm cursor-pointer hover:border-[#f4831f] transition-colors duration-200"
                onClick={() => setIsImageDialogOpen(true)}
              >
                <AvatarImage
                  src={userData.avatarUrl || "/man-avatar-profile-picture.avif"}
                  alt={getFullName()}
                />
                <AvatarFallback className="text-base sm:text-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                  {(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '') ||
                    userData.userName?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* Camera icon overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full transition-all duration-200 cursor-pointer opacity-0 hover:opacity-100"
                onClick={() => setIsImageDialogOpen(true)}>
                <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{getFullName()}</h1>
              <div className="flex flex-col sm:flex-row md:flex-row items-center gap-2 mb-3">
                <Badge variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs">
                  {isAdmin ? (
                    <>
                      <Shield className="mr-1 h-3 w-3" /> {userData.roleMasterName}
                    </>
                  ) : (
                    <>
                      <User className="mr-1 h-3 w-3" /> {userData.roleMasterName || 'Member'}
                    </>
                  )}
                </Badge>
                <span className="text-slate-500 dark:text-slate-400 text-sm">{userData.userName}</span>
              </div>
              <div className="flex justify-center md:justify-start">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-xs transition-colors w-full sm:w-auto"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] h-[450px] flex flex-col p-0 mx-2">
                    <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-700">
                      <DialogTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-base sm:text-lg">
                        <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        Edit Profile
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
                      <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-slate-600 dark:text-slate-300 text-sm">First Name</Label>
                            <Input
                              id="firstName"
                              value={editForm.firstName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                              placeholder="Enter your first name"
                              className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-slate-600 dark:text-slate-300 text-sm">Last Name</Label>
                            <Input
                              id="lastName"
                              value={editForm.lastName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                              placeholder="Enter your last name"
                              className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="dateOfBirth" className="text-slate-600 dark:text-slate-300 text-sm">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={editForm.dateOfBirth}
                              onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                              className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mobileNumber" className="text-slate-600 dark:text-slate-300 text-sm">Mobile Number</Label>
                            <Input
                              id="mobileNumber"
                              type="tel"
                              value={editForm.mobileNumber}
                              onChange={(e) => setEditForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                              placeholder="Enter your mobile number"
                              className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="userName" className="text-slate-600 dark:text-slate-300 text-sm">Username</Label>
                          <Input
                            id="userName"
                            value={editForm.userName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, userName: e.target.value }))}
                            placeholder="Enter your username"
                            className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-slate-600 dark:text-slate-300 text-sm">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData?.email || ""}
                            readOnly
                            className="border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="aboutMe" className="text-slate-600 dark:text-slate-300 text-sm">About Me</Label>
                          <Textarea
                            id="aboutMe"
                            value={editForm.aboutMe}
                            onChange={(e) => setEditForm(prev => ({ ...prev, aboutMe: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            rows={3}
                            className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                          />
                        </div>

                        {/* Address Section */}
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <Label htmlFor="fullAddress" className="text-slate-600 dark:text-slate-300 text-sm">Address</Label>
                            <Input
                              id="fullAddress"
                              value={editForm.fullAddress}
                              onChange={(e) => setEditForm(prev => ({ ...prev, fullAddress: e.target.value }))}
                              placeholder="Enter your full address"
                              className="border-slate-200 dark:border-slate-600 focus:border-slate-400 dark:focus:border-slate-500 text-sm"
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditDialogOpen(false)}
                          disabled={editLoading}
                          className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 w-full sm:w-auto order-2 sm:order-1"
                        >
                          <X className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={editLoading}
                          className="bg-[#f4831f] hover:bg-[#e67317] text-white border-0 w-full sm:w-auto order-1 sm:order-2"
                          style={{ backgroundColor: editLoading ? '#e67317' : '#f4831f' }}
                          onClick={handleEditSubmit}
                        >
                          {editLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 sm:mr-2" />
                          )}
                          {editLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Management Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[400px] mx-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-base sm:text-lg">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Profile Image
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-slate-200 dark:border-slate-600">
                <AvatarImage
                  src={previewUrl || userData.avatarUrl || "/man-avatar-profile-picture.avif"}
                  alt={getFullName()}
                />
                <AvatarFallback className="text-xl sm:text-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                  {(userData.firstName?.[0] || '') + (userData.lastName?.[0] || '') ||
                    userData.userName?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {!selectedImage ? (
              <div className="space-y-2 sm:space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsImagePreviewOpen(true)}
                    className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  <Button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="bg-[#f4831f] hover:bg-[#e67317] text-white text-sm"
                  >
                    <Upload className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Update</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                  New image selected: {selectedImage.name}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null)
                      setPreviewUrl(null)
                    }}
                    disabled={imageUploading}
                    className="border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                  >
                    <X className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                  <Button
                    onClick={handleImageUpload}
                    disabled={imageUploading}
                    className="bg-[#f4831f] hover:bg-[#e67317] text-white text-sm"
                  >
                    {imageUploading ? (
                      <Loader2 className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1 sm:mr-2" />
                    )}
                    {imageUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="sm:max-w-[600px] mx-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-base sm:text-lg">
              <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Profile Image Preview
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-2 sm:p-4">
            <img
              src={userData.avatarUrl || "/man-avatar-profile-picture.avif"}
              alt={getFullName()}
              className="max-w-full max-h-64 sm:max-h-96 rounded-lg shadow-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Information Section */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-600 py-2 sm:py-3">
          <h3 className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 flex items-center">
            <User className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
            Profile Information
          </h3>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
            {/* Full Name - Always show */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Full Name</label>
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer min-w-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium truncate">
                  {getFullName() !== userData.userName ? getFullName() : (
                    <span className="text-slate-500 dark:text-slate-400 italic">Name not provided</span>
                  )}
                </span>
              </div>
            </div>

            {/* Username - Always show */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Username</label>
              <div className="flex items-center gap-2 sm:gap-3 p-2 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer min-w-0">
                <IdCard className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{userData.userName}</span>
              </div>
            </div>

            {/* Role - Only show if available */}
            {userData.roleMasterName && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Role</label>
                <div className="flex items-center gap-2 sm:gap-3 p-2 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer min-w-0">
                  {isAdmin ? (
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  ) : (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{userData.roleMasterName}</span>
                </div>
              </div>
            )}

            {/* Membership Code - Only show if available */}
            {userData.membershipCode && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Membership Code</label>
                <div className="flex items-center gap-2 sm:gap-3 p-2 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer min-w-0">
                  <IdCard className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{userData.membershipCode}</span>
                </div>
              </div>
            )}

            {/* Date of Birth - Only show if available */}
            {userData.dateOfBirth && formatDate(userData.dateOfBirth) && (
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Date of Birth</label>
                <div className="flex items-center gap-2 sm:gap-3 p-2 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer min-w-0">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{formatDate(userData.dateOfBirth)}</span>
                </div>
              </div>
            )}
          </div>

          {/* About Me Section - Only show if aboutMe exists */}
          {(userData as Record<string, any>).aboutMe && (
            <>
              <Separator className="my-3 sm:my-4 dark:bg-slate-600" />

              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">About Me</label>
                <div className="p-2 sm:p-3 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed break-words">{(userData as Record<string, any>).aboutMe}</p>
                </div>
              </div>
            </>
          )}

          {/* Address Section - Always show */}
          <>
            <Separator className="my-3 sm:my-4 dark:bg-slate-600" />

            <div>
              <label className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">Address</label>
              {addressLoading ? (
                <div className="flex items-center justify-center py-2 sm:py-3 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-slate-400 mr-2" />
                  <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Loading address...</span>
                </div>
              ) : addressData && (Array.isArray(addressData) ? addressData[0]?.fullAddress : addressData.fullAddress) ? (
                <div className="p-2 sm:p-3 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 break-words">{Array.isArray(addressData) ? addressData[0]?.fullAddress : addressData.fullAddress}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50/30 dark:bg-transparent rounded-lg border border-dashed border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400 italic text-xs sm:text-sm">No address provided</span>
                </div>
              )}
            </div>
          </>

        </CardContent>
      </Card>
      {/* Contact Information Section */}
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-600 py-2 sm:py-3">
          <h3 className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 flex items-center">
            <Mail className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
            Contact Information
          </h3>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex-shrink-0">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1 text-sm sm:text-base">Email Address</h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm truncate">{userData?.email}</p>
              </div>
            </div>

            {userData.mobileNumber ? (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50/50 dark:bg-transparent rounded-lg border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex-shrink-0">
                  <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1 text-sm sm:text-base">Phone Number</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">{userData.mobileNumber}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50/30 dark:bg-transparent rounded-lg border border-dashed border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex-shrink-0">
                  <div className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-600 rounded-full">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-1 text-sm sm:text-base">Phone Number</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">No phone number provided</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

