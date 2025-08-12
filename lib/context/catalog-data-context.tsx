"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { convertApiStampToStampData } from "@/lib/data/catalog-data"
import { checkIndexedDBEmpty, saveStampsToIndexedDB } from "@/lib/data/investigate-search-db"
import { StampData } from "@/types/catalog"
import { fetchStampMasterCatalogAll } from "@/lib/api/stamp-master-catalog"
import { getCookie } from "@/lib/utils/cookies"

type CatalogDataContextValue = {
  // Raw API stamps (unconverted)
  stamps: any[]
  // Converted StampData list (normalized for UI/DB)
  normalizedStamps: StampData[]
  // Loading status for initial fetch/seed
  loading: boolean
  // Error state if initial fetch/seed fails
  error: string | null
  // Whether IndexedDB is initialized/seeded
  dbReady: boolean
}

const CatalogDataContext = createContext<CatalogDataContextValue | undefined>(undefined)

export function CatalogDataProvider({ children }: { children: React.ReactNode }) {
  const [stamps, setStamps] = useState<any[]>([])
  const [normalizedStamps, setNormalizedStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initialize = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all pages from backend with Authorization header from cookies
        const jwt = getCookie('stamp_jwt') || undefined
        const apiData = await fetchStampMasterCatalogAll('8822e88b-34b5-4c51-85d7-53dec3dde99e', 200, jwt)
        const converted = apiData.map(convertApiStampToStampData)

        if (!isMounted) return
        setStamps(apiData)
        setNormalizedStamps(converted)

        // Ensure IndexedDB is seeded once
        try {
          const isEmpty = await checkIndexedDBEmpty()
          if (isEmpty) {
            await saveStampsToIndexedDB(converted)
          }
          if (!isMounted) return
          setDbReady(true)
        } catch (dbErr) {
          // Non-fatal: allow UI to proceed with in-memory data
          console.warn("StampCatalogDB init skipped:", dbErr)
          if (!isMounted) return
          setDbReady(true)
        }
      } catch (e) {
        console.error("Failed to initialize catalog data:", e)
        if (!isMounted) return
        setError("Failed to load catalog data")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initialize()
    return () => { isMounted = false }
  }, [])

  const value = useMemo(() => ({
    stamps,
    normalizedStamps,
    loading,
    error,
    dbReady,
  }), [stamps, normalizedStamps, loading, error, dbReady])

  return (
    <CatalogDataContext.Provider value={value}>
      {children}
    </CatalogDataContext.Provider>
  )
}

export function useCatalogData(): CatalogDataContextValue {
  const ctx = useContext(CatalogDataContext)
  if (!ctx) {
    throw new Error("useCatalogData must be used within a CatalogDataProvider")
  }
  return ctx
}


