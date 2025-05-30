"use client"

import { AuthGuard } from "@/components/auth/route-guard"
import ScanPage from "./page"

export default function ProtectedScanPage() {
  return (
    <AuthGuard>
      <ScanPage />
    </AuthGuard>
  )
} 