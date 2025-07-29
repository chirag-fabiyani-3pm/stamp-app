"use client"

import React, { Suspense } from "react"
import { ModernCatalogContent } from "@/components/catalog/modern-catalog-content"

export default function ModernCataloguePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModernCatalogContent />
    </Suspense>
  )
} 