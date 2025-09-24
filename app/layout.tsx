import { AppContent } from "@/components/app-content"
import { ChatProvider } from "@/components/chat-provider"
import { ConditionalChat } from "@/components/conditional-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stamps of Approval",
  description: "A comprehensive stamp cataloging application",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stamps of Approval",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#f4831f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Stamp Catalog" />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={"818826618127-43jqkdl3f4r3ei2uk060ed2rne14u91o.apps.googleusercontent.com"}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ChatProvider>
              <AppContent>{children}</AppContent>
              <ConditionalChat />
            </ChatProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
