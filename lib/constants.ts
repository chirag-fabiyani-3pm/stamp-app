// Application Constants

// Role Master IDs
export const ROLE_MASTER_IDS = {
  ADMIN: "9fb0e270-a6b1-4612-b708-a5caedc88bb3",
  // Add other role IDs here as needed
} as const;

// Admin role ID constant for easy access
export const ADMIN_ROLE_ID = ROLE_MASTER_IDS.ADMIN;

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
  PROFILE: "/profile",
} as const;

// Utility function to check if a user has admin role
export const isUserAdmin = (roleMasterId: string): boolean => {
  return roleMasterId === ADMIN_ROLE_ID;
};

// Use local development server when running locally, otherwise use the configured backend
export const BACKEND_URL = "http://localhost:3000";

// Frontend URL - use local development server when running locally, otherwise use the production URL
export const FRONTEND_URL = "http://localhost:3000";