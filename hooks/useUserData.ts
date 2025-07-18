import { useState, useEffect, useCallback } from 'react'

interface UserData {
  id: string
  roleId: string
  roleName: string
  membershipCode: string
  userName: string
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  mobileNumber: string
  isDisabled: boolean
  isDeleted: boolean
  forcePasswordChange: boolean
  avatarUrl: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  usernameType: number
}

interface LocalStorageUserData {
  id: string
  userId: string
  jwt: string
  // ... other fields from UserAuthResponse
}

// Get JWT token from cookie
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  const nameEQ = "stamp_jwt=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    try {
      console.log("Starting fetchUserData")
      setLoading(true)
      setError(null)
      
      // Get JWT from cookie
      const jwt = getAuthToken()
      console.log("JWT from cookie:", jwt ? "found" : "not found")
      
      // Get user data from localStorage
      const storedData = localStorage.getItem('stamp_user_data')
      console.log("storedData", storedData ? "exists" : "missing")
      
      if (!storedData) {
        throw new Error('No user data found in localStorage. Please log in again.')
      }

      const userInfo: LocalStorageUserData = JSON.parse(storedData)
      const userId = userInfo.userId || userInfo.id // Try both fields
      
      if (!jwt) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      if (!userId) {
        throw new Error('No user ID found in localStorage. Please log in again.')
      }
      
      console.log("jwt", jwt ? "present" : "missing")
      console.log("userId", userId)
      
      // Construct the API URL
      const apiUrl = `https://3pm-stampapp-prod.azurewebsites.net/api/v1/User/${userId}?id=${userId}`
      console.log("Making API call to:", apiUrl)
      
      // Fetch user data from API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log("response status:", response.status)
      console.log("response.url", response.url)
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view this profile.')
        }
        if (response.status === 404) {
          throw new Error('User profile not found.')
        }
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API data received:", data)
      
      if (!data) {
        throw new Error('No user data received from server.')
      }
      
      setUserData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log("useUserData hook - useEffect called")
    fetchUserData()
  }, [fetchUserData])

  const refetch = useCallback(() => {
    console.log("Refetching user data...")
    fetchUserData()
  }, [fetchUserData])

  return { userData, loading, error, refetch }
} 