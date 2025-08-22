"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { convertApiStampToStampData } from "@/lib/data/catalog-data"
import { checkIndexedDBEmpty, saveStampsToIndexedDB, getStampsFromIndexedDB, getRawStampsFromIndexedDB, saveRawStampsToIndexedDB } from "@/lib/data/investigate-search-db"
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
    // Prevent double initialization under React 18 StrictMode dev double-invoke
    let hasInitialized = false

    const initialize = async () => {
      if (hasInitialized) return
      hasInitialized = true
      try {
        setLoading(true)
        setError(null)

        // 1) Try loading RAW stamps from IndexedDB first
        const rawFromDB = await getRawStampsFromIndexedDB()
        console.log('rawFromDB', rawFromDB)
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
          setDbReady(true)
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
            stampCode: ns.stampCode,
            name: ns.name,
            description: ns.story,
            country: ns.countryCode || ns.country || '',
            countryName: ns.country || '',
            countryFlag: '',
            seriesId: ns.stampGroupId,
            seriesName: ns.seriesName || '',
            seriesDescription: '',
            typeId: '',
            typeName: '',
            typeDescription: '',
            stampGroupId: ns.stampGroupId,
            stampGroupName: ns.seriesName || '',
            stampGroupDescription: '',
            releaseId: '',
            releaseName: '',
            releaseDateRange: '',
            releaseDescription: '',
            categoryId: '',
            categoryName: '',
            categoryCode: '',
            categoryDescription: '',
            paperTypeId: '',
            paperTypeName: ns.paperType || '',
            paperTypeCode: '',
            paperTypeDescription: '',
            currencyCode: ns.denominationCurrency || '',
            currencyName: ns.denominationCurrency || '',
            currencySymbol: ns.denominationSymbol || '',
            currencyDescription: '',
            denominationValue: String(ns.denominationValue ?? ''),
            denominationSymbol: ns.denominationSymbol || '',
            denominationDisplay: ns.denominationValue != null ? `${ns.denominationValue}${ns.denominationSymbol || ''}` : '',
            denominationDescription: '',
            colorCode: '',
            colorName: ns.color || '',
            colorHex: '',
            colorDescription: '',
            colorVariant: '',
            paperCode: '',
            paperName: ns.paperType || '',
            paperDescription: '',
            paperFiber: '',
            paperThickness: '',
            paperOpacity: '',
            watermarkCode: '',
            watermarkName: '',
            watermarkDescription: '',
            watermarkPosition: '',
            watermarkClarity: '',
            perforationCode: '',
            perforationName: '',
            perforationMeasurement: '',
            perforationGauge: '',
            perforationCleanCut: false,
            perforationComb: false,
            itemTypeCode: '',
            itemTypeName: '',
            itemTypeDescription: '',
            itemFormat: '',
            issueDate: ns.issueDate,
            issueYear: ns.issueYear ?? 0,
            issueMonth: 0,
            issueDay: 0,
            firstDayIssue: false,
            periodStart: ns.issueYear ?? 0,
            periodEnd: ns.issueYear ?? 0,
            issueLocation: '',
            issuePurpose: '',
            issueContext: '',
            printingMethod: '',
            printingProcess: '',
            printingQuality: '',
            designer: '',
            designerNotes: '',
            printer: '',
            printerLocation: '',
            printerReputation: '',
            engraver: '',
            dieNumber: '',
            plateNumber: '',
            plateCharacteristics: '',
            paperManufacturer: '',
            gumType: '',
            gumCondition: '',
            sizeWidth: '',
            sizeHeight: '',
            sizeFormat: '',
            theme: '',
            themeCategory: '',
            subject: '',
            artisticStyle: '',
            printRun: '',
            estimatedPrintRun: 0,
            sheetsPrinted: '',
            stampsPerSheet: 0,
            positionVarieties: false,
            plateVariety: '',
            stampImageUrl: ns.stampImageUrl,
            stampImageAlt: ns.name,
            stampImageHighRes: ns.stampImageUrl,
            watermarkImageUrl: '',
            perforationImageUrl: '',
            rarityRating: ns.rarity || '',
            rarityScale: '',
            rarityScore: 0,
            hasVarieties: false,
            varietyCount: 0,
            varietyType: '',
            perforationVariety: '',
            colorVariety: '',
            paperVariety: '',
            watermarkVariety: '',
            knownError: '',
            majorVariety: '',
            postalHistoryType: '',
            postmarkType: '',
            proofType: '',
            essayType: '',
            errorType: '',
            authenticationRequired: false,
            expertCommittee: '',
            authenticationPoint: '',
            certificateAvailable: false,
            commonForgery: '',
            historicalSignificance: '',
            culturalImportance: '',
            philatelicImportance: '',
            collectingPopularity: '',
            exhibitionFrequency: '',
            researchStatus: '',
            bibliography: '',
            specialNotes: '',
            collectorNotes: '',
            conditionNotes: '',
            rarityNotes: '',
            marketNotes: '',
            researchNotes: '',
            instanceCatalogCode: '',
            instanceDescription: '',
            condition: ns.condition || '',
            conditionGrade: '',
            conditionDescription: '',
            conditionDetails: '',
            usageState: '',
            usageDescription: '',
            usageCode: '',
            gumConditionSpecific: '',
            gumDescription: '',
            gumQuality: '',
            centering: '',
            centeringScore: '',
            centeringDescription: '',
            margins: '',
            marginMeasurements: '',
            colorFreshness: '',
            colorIntensity: '',
            colorDescriptionSpecific: '',
            paperCondition: '',
            paperFreshness: '',
            surfaceCondition: '',
            perforationsCondition: '',
            perforationTips: '',
            faults: '',
            repairs: '',
            alterations: '',
            grade: '',
            gradingService: '',
            certification: '',
            certificateNumber: '',
            expertOpinion: '',
            postmarkTypeInInstance: '',
            postmarkLocation: '',
            postmarkDate: '',
            postmarkClarity: '',
            postmarkPosition: '',
            postmarkDescription: '',
            mintValue: 0,
            usedValue: 0,
            finestUsedValue: 0,
            priceMultiplier: 0,
            priceFactors: '',
            instanceRarity: '',
            conditionRarity: '',
            availability: '',
            marketFrequency: '',
            auctionFrequency: '',
            lastAuctionDate: '',
            lastAuctionPrice: 0,
            priceTrend: '',
            instanceNotes: '',
            investmentNotes: '',
            exhibitionSuitability: '',
            photographicQuality: '',
            varietyTypeInInstance: '',
            varietyDescription: '',
            varietyPosition: '',
            varietySeverity: '',
            varietyVisibility: '',
            varietyRarity: '',
            varietyNotes: '',
            stampVectorJson: '',
            stampDetailsJson: ns.stampDetailsJson,
            alternativeNames: '',
            plateFlaws: '',
            stampImageVariants: [],
            recentSales: '',
            primaryReferences: '',
            researchPapers: '',
            exhibitionLiterature: '',
            onlineResources: ''
          }))

          // Persist synthetic RAW for subsequent loads
          try { await saveRawStampsToIndexedDB(syntheticRaw) } catch (err) { console.warn('saveRawStampsToIndexedDB failed', err) }

          if (!isMounted) return
          setStamps(syntheticRaw)
          setNormalizedStamps(normalizedOnly)
          setDbReady(true)
          return
        }

        // 3) Nothing in IndexedDB: fetch from backend once to seed
        const jwt = getCookie('stamp_jwt') || undefined
        const apiData = await fetchStampMasterCatalogAll('c1a24978-9c0a-4f2b-8478-1a18fc20560f', 200, jwt)
        const converted = apiData.map(convertApiStampToStampData)

        if (!isMounted) return
        setStamps(apiData)
        setNormalizedStamps(converted)

        // Seed IndexedDB with both raw and normalized for future offline loads
        try {
          await saveRawStampsToIndexedDB(apiData)
        } catch (err) { console.warn('saveRawStampsToIndexedDB failed', err) }
        try {
          await saveStampsToIndexedDB(converted)
        } catch (err) { console.warn('saveStampsToIndexedDB failed', err) }
        if (!isMounted) return
        setDbReady(true)
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


