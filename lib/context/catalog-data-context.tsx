"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { convertApiStampToStampData } from "@/lib/data/catalog-data"
import {
  saveStampsToIndexedDB,
  getStampsFromIndexedDB,
  getRawStampsFromIndexedDB,
  saveRawStampsToIndexedDB,
  shouldRefreshData,
  clearAllData,
  markDataRefreshed,
  forceCleanupUnusedIndexes,
  APP_VERSION
} from "@/lib/data/investigate-search-db"
import { StampData } from "@/types/catalog"
import { fetchStampMasterCatalogWithProgress } from "@/lib/api/stamp-master-catalog"
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
  // Progress tracking for API data fetching
  fetchProgress: {
    isFetching: boolean
    progress: number
    totalItems: number
    currentItems: number
    currentPage: number
    totalPages: number
    pageSize: number
    message: string
    isComplete: boolean
  }
  // Loading state type (to differentiate IndexedDB vs API loading)
  loadingType: 'none' | 'indexeddb' | 'api'
}

const CatalogDataContext = createContext<CatalogDataContextValue | undefined>(undefined)

export function CatalogDataProvider({ children }: { children: React.ReactNode }) {
  const [stamps, setStamps] = useState<any[]>([])
  const [normalizedStamps, setNormalizedStamps] = useState<StampData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbReady, setDbReady] = useState(false)
  const [fetchProgress, setFetchProgress] = useState({
    isFetching: false,
    progress: 0,
    totalItems: 0,
    currentItems: 0,
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    message: "",
    isComplete: false
  })
  const [loadingType, setLoadingType] = useState<'none' | 'indexeddb' | 'api'>('none')

  useEffect(() => {
    let isMounted = true
    // Prevent double initialization under React 18 StrictMode dev double-invoke
    let hasInitialized = false

    const initialize = async () => {
      if (hasInitialized) return
      hasInitialized = true
      try {
        setLoading(true)
        setLoadingType('indexeddb') // Start with IndexedDB loading
        setError(null)

        // Force cleanup unused indexes for existing users (one-time operation)
        try {
          await forceCleanupUnusedIndexes()
        } catch (error) {
          console.warn('Index cleanup failed, continuing anyway:', error)
        }

        // Check if we need to refresh data based on version change
        const needsRefresh = await shouldRefreshData()
        if (needsRefresh) {
          console.log(`App version changed to ${APP_VERSION}, clearing old data for fresh start...`)
          await clearAllData()
        }

        // 1) Try loading RAW stamps from IndexedDB first
        const rawFromDB = await getRawStampsFromIndexedDB()

        if ((rawFromDB?.length || 0) > 0) {
          const normalizedFromDB = await getStampsFromIndexedDB()
          const normalized = (normalizedFromDB?.length || 0) > 0
            ? normalizedFromDB
            : rawFromDB.map(convertApiStampToStampData)

          if ((normalizedFromDB?.length || 0) === 0) {
            try { await saveStampsToIndexedDB(normalized) } catch (err) { console.warn('saveStampsToIndexedDB failed', err) }
          } else {
            // One-time migration to ensure indexes are populated with stable defaults
            try {
              if (typeof window !== 'undefined' && !localStorage.getItem('stamps_migrated_v3')) {
                await saveStampsToIndexedDB(normalized)
                localStorage.setItem('stamps_migrated_v3', '1')
              }
            } catch (err) {
              console.warn('stamps migration failed', err)
            }
          }

          if (!isMounted) return
          setStamps(rawFromDB)
          setNormalizedStamps(normalized)

          // Mark data as refreshed for today (even when loading from cache)
          await markDataRefreshed()

          setDbReady(true)
          setLoadingType('none') // IndexedDB loading complete
          return
        }

        // 2) If RAW is empty, try loading normalized stamps only
        const normalizedOnly = await getStampsFromIndexedDB()
        console.log('normalizedOnly', normalizedOnly)
        if ((normalizedOnly?.length || 0) > 0) {
          // Synthesize a minimal RAW-like array so upstream grouping UIs continue to work
          const syntheticRaw = normalizedOnly.map(ns => ({
            id: ns.id,
            isInstance: false,
            catalogNumber: ns.catalogNumber,
            name: ns.name,
            description: ns.story,
            country: ns.countryCode || ns.country || '',
            countryName: ns.country || '',
            seriesName: ns.seriesName || '',
            typeName: '',
            stampGroupName: ns.seriesName || '',
            categoryCode: '',
            subCategoryCode: '',
            currencyCode: ns.denominationCurrency || '',
            currencyName: ns.denominationCurrency || '',
            currencySymbol: ns.denominationSymbol || '',
            denominationValue: String(ns.denominationValue ?? ''),
            denominationSymbol: ns.denominationSymbol || '',
            denominationDisplay: ns.denominationValue != null ? `${ns.denominationValue}${ns.denominationSymbol || ''}` : '',
            colorCode: '',
            colorName: ns.color || '',
            colorHex: '',
            colorGroup: '',
            paperCode: '',
            paperName: ns.paperType || '',
            paperOrientation: '',
            watermarkCode: '',
            watermarkName: '',
            watermarkPosition: '',
            perforationCode: '',
            perforationName: '',
            perforationMeasurement: '',
            itemTypeCode: '',
            itemTypeName: '',
            issueDate: ns.issueDate,
            issueYear: ns.issueYear ?? 0,
            periodStart: ns.issueYear ?? 0,
            periodEnd: ns.issueYear ?? 0,
            printingMethod: '',
            printer: '',
            engraver: '',
            gumCondition: '',
            sizeWidth: '',
            sizeHeight: '',
            stampImageUrl: ns.stampImageUrl,
            stampImageHighRes: ns.stampImageUrl,
            watermarkImageUrl: '',
            perforationImageUrl: '',
            rarityRating: ns.rarity || '',
            rarityScale: '',
            rarityScore: 0,
            historicalSignificance: '',
            bibliography: '',
            specialNotes: '',
            mintValue: 0,
            usedValue: 0,
            finestUsedValue: 0,
          }))

          // Persist synthetic RAW for subsequent loads
          try { await saveRawStampsToIndexedDB(syntheticRaw) } catch (err) { console.warn('saveRawStampsToIndexedDB failed', err) }

          if (!isMounted) return
          setStamps(syntheticRaw)
          setNormalizedStamps(normalizedOnly)

          // Mark data as refreshed for today (even when loading from cache)
          await markDataRefreshed()

          setDbReady(true)
          setLoadingType('none') // IndexedDB loading complete
          return
        }

        // 3) Nothing in IndexedDB: fetch from backend once to seed
        setLoadingType('api')
        setFetchProgress(prev => ({
          ...prev,
          isFetching: true,
          message: "Starting data fetch...",
          progress: 0
        }))

        const jwt = getCookie('stamp_jwt') || undefined

        // Use the new function with real progress tracking
        const apiData = await fetchStampMasterCatalogWithProgress(
          '254c793b-16d0-40a3-8b10-66d987b54474',
          200,
          jwt,
          (progressData) => {
            setFetchProgress(prev => ({
              ...prev,
              currentPage: progressData.currentPage,
              totalPages: progressData.totalPages,
              totalItems: progressData.totalCount,
              currentItems: progressData.currentItems,
              progress: progressData.progress,
              message: progressData.message,
              // Keep fetching true until we complete ALL processing
              isFetching: true,
              isComplete: false
            }))
          }
        )

        const converted = apiData.map(convertApiStampToStampData)

        setFetchProgress(prev => ({
          ...prev,
          message: "Saving to local storage...",
          progress: 100,
          // Still keep fetching true during IndexedDB operations
          isFetching: true,
          isComplete: false
        }))

        if (!isMounted) return
        setStamps(apiData)
        setNormalizedStamps(converted)

        // Seed IndexedDB with both raw and normalized for future offline loads
        setFetchProgress(prev => ({
          ...prev,
          message: `Saving ${apiData.length.toLocaleString()} stamps to local storage...`,
          progress: 85
        }))

        try {
          await saveRawStampsToIndexedDB(apiData)
          setFetchProgress(prev => ({
            ...prev,
            message: "Processing stamp data for search...",
            progress: 92
          }))
        } catch (err) {
          console.warn('saveRawStampsToIndexedDB failed', err)
          setFetchProgress(prev => ({
            ...prev,
            message: "Error saving raw data, continuing...",
            progress: 92
          }))
        }

        try {
          await saveStampsToIndexedDB(converted)
          setFetchProgress(prev => ({
            ...prev,
            message: "Finalizing your catalog...",
            progress: 98
          }))
        } catch (err) {
          console.warn('saveStampsToIndexedDB failed', err)
          setFetchProgress(prev => ({
            ...prev,
            message: "Error saving processed data, continuing...",
            progress: 98
          }))
        }

        // Mark data as refreshed for today
        await markDataRefreshed()

        // Show completion message briefly before closing
        setFetchProgress(prev => ({
          ...prev,
          message: "Complete! Starting your catalog...",
          progress: 100,
          isComplete: true,
          isFetching: false
        }))

        if (!isMounted) return

        // Add a small delay to show the completion message
        await new Promise(resolve => setTimeout(resolve, 1500))

        setDbReady(true)
        setLoadingType('none') // API loading complete

        // Reset progress state after everything is done
        setFetchProgress(prev => ({
          ...prev,
          isFetching: false,
          isComplete: false,
          progress: 0,
          message: ""
        }))
      } catch (e) {
        console.error("Failed to initialize catalog data:", e)
        if (!isMounted) return
        setError("Failed to load catalog data")
        setFetchProgress(prev => ({
          ...prev,
          isFetching: false,
          message: "Error loading data",
          progress: 0
        }))
        setLoadingType('none')
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
    fetchProgress,
    loadingType,
  }), [stamps, normalizedStamps, loading, error, dbReady, fetchProgress, loadingType])

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


