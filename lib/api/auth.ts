import { ADMIN_ROLE_ID, SUPER_ADMIN_ROLE_ID } from '@/lib/constants';

const API_BASE_URL = 'https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1';

// Generate a unique device ID
function generateDeviceId(): string {
  // Create a unique device ID using timestamp and random string
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `device_${timestamp}_${randomStr}`;
}

// Get or create device ID from localStorage
function getDeviceId(): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return generateDeviceId();
  }
  
  let deviceId = localStorage.getItem('stamp_device_id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('stamp_device_id', deviceId);
  }
  return deviceId;
}

// Check if device is Apple (iOS/macOS)
function isAppleDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent;
  return /iPad|iPhone|iPod|Macintosh/.test(userAgent);
}

export interface SendEmailOtcRequest {
  emailId: string;
  deviceId: string;
  isAppleDevice: boolean;
}

export interface SendEmailOtcResponse {
  userId: string;
  success: boolean;
  message?: string;
}

export interface VerifyEmailRequest {
  userId: string;
  otc: number;
  deviceId: string;
  isAppleDevice: boolean;
}

export interface UserAuthResponse {
  id: string;
  themeColour: string;
  userId: string;
  userName: string;
  roleMasterId: string;
  roleMasterName: string;
  firstName: string;
  lastName: string;
  created: string;
  expiresAt: string;
  forcePasswordChange: boolean;
  avatarName: string;
  avatarUrl: string;
  trackingInterval: number;
  passKey: string;
  signUpType: number;
  isNewUser: boolean;
  jwt: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  user?: UserAuthResponse;
  message?: string;
}

// Cookie management functions
function setCookie(name: string, value: string, days: number = 30): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
}

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Send Email OTC
export async function sendEmailOtc(emailId: string): Promise<SendEmailOtcResponse> {
  const deviceId = getDeviceId();
  const isApple = isAppleDevice();
  
  // Build query parameters
  const params = new URLSearchParams({
    emailId: emailId,
    deviceId: deviceId,
    isAppleDevice: isApple.toString()
  });

  try {
    const response = await fetch(`${API_BASE_URL}/UserFederatedAuth/SendEmailOtc?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      userId: data.userId,
      success: true,
      message: data.message
    };
  } catch (error) {
    console.error('Send Email OTC error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send OTC');
  }
}

// Verify Email OTC
export async function verifyEmailOtc(userId: string, otc: number): Promise<VerifyEmailResponse> {
  const deviceId = getDeviceId();
  const isApple = isAppleDevice();
  
  // Build query parameters
  const params = new URLSearchParams({
    userId: userId,
    otc: otc.toString(),
    deviceId: deviceId,
    isAppleDevice: isApple.toString()
  });

  try {
    const response = await fetch(`${API_BASE_URL}/UserFederatedAuth/VerifyEmail?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: UserAuthResponse = await response.json();
    
    // Store JWT as cookie and user data in localStorage
    if (data.jwt) {
      setCookie('stamp_jwt', data.jwt, 30);
      storeUserData(data);
    }
    
    return {
      success: true,
      user: data,
      message: 'Successfully authenticated'
    };
  } catch (error) {
    console.error('Verify Email OTC error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify OTC');
  }
}

// Maintain Google Sign In
export async function googleSignIn(idToken: string): Promise<VerifyEmailResponse> {
  const deviceId = getDeviceId();
  const isApple = isAppleDevice();
  
  // Build query parameters
  const body = {
    idToken: idToken,
    deviceId: deviceId,
    isAppleDevice: "false"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/UserFederatedAuth/GoogleAuth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: UserAuthResponse = await response.json();
    
    // Store JWT as cookie and user data in localStorage
    if (data.jwt) {
      setCookie('stamp_jwt', data.jwt, 30);
      storeUserData(data);
    }
    
    return {
      success: true,
      user: data,
      message: 'Successfully authenticated'
    };
  } catch (error) {
    console.error('Verify Email OTC error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify OTC');
  }
}

// Store user data in localStorage
export function storeUserData(userData: UserAuthResponse): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('stamp_user_data', JSON.stringify(userData));
  }
}

// Get user data from localStorage
export function getUserData(): UserAuthResponse | null {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('stamp_user_data');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

// Get JWT token from cookie
export function getAuthToken(): string | null {
  return getCookie('stamp_jwt');
}

// Clear authentication data
export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    deleteCookie('stamp_jwt');
    localStorage.removeItem('stamp_user_data');
    localStorage.removeItem('stamp_auth_token'); // Remove old token if exists
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const userData = getUserData();
  
  if (!token || !userData) return false;
  
  // Check if token is expired
  const expiresAt = new Date(userData.expiresAt);
  const now = new Date();
  
  if (now >= expiresAt) {
    clearAuthData();
    return false;
  }
  
  return true;
}

// Check if user is admin
export function isAdmin(): boolean {
  return true;
  const userData = getUserData();
  if (!userData) return false;
  
  // Check if the user has the admin role ID
  return userData.roleMasterId === ADMIN_ROLE_ID || userData.roleMasterId === SUPER_ADMIN_ROLE_ID;
}

// Get user display name
export function getUserDisplayName(): string {
  const userData = getUserData();
  if (!userData) return '';
  
  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`.trim();
  }
  
  if (userData.firstName) {
    return userData.firstName;
  }
  
  return userData.userName || '';
}

// Get user avatar
export function getUserAvatar(): string | null {
  const userData = getUserData();
  return userData?.avatarUrl || null;
}

// Sign out function
export function signOut(): void {
  clearAuthData();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// Legacy function for backward compatibility
export function storeAuthToken(token: string): void {
  // This is now handled by verifyEmailOtc, but keeping for compatibility
  console.warn('storeAuthToken is deprecated, JWT is now stored automatically');
} 