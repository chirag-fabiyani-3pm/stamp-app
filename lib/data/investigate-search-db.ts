import { StampData } from '@/types/catalog'

const DB_NAME = 'StampCatalogDB'
const DB_VERSION = 6 // Version 5: added metadata store, Version 6: fixed date refresh logic
const STORE_NAME = 'stamps'
const RAW_STORE_NAME = 'rawStamps'
const METADATA_STORE_NAME = 'metadata' // Store for last refresh date

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = (event.target as IDBOpenDBRequest).transaction!
      
      // Ensure normalized store exists and has only necessary indexes, preserve existing data
      let store: IDBObjectStore
      if (db.objectStoreNames.contains(STORE_NAME)) {
        store = transaction.objectStore(STORE_NAME)
      } else {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }

      // Only create indexes that are actually used for queries
      const usedIndexes = [
        { name: 'country', keyPath: 'country' },
        { name: 'seriesName', keyPath: 'seriesName' },
        { name: 'issueYear', keyPath: 'issueYear' }
      ]

      // Remove all unused indexes more aggressively
      const allCurrentIndexes = Array.from((store.indexNames as unknown as DOMStringList))
      const unusedIndexNames = ['stampCode', 'publisher']

      for (const indexName of allCurrentIndexes) {
        if (unusedIndexNames.includes(indexName)) {
          try {
            store.deleteIndex(indexName)
            console.log(`Deleted unused index: ${indexName}`)
          } catch (error) {
            console.warn(`Failed to delete index ${indexName}:`, error)
          }
        }
      }

      // Create only the indexes we actually use
      for (const { name, keyPath } of usedIndexes) {
        if (!(store.indexNames as unknown as DOMStringList).contains(name)) {
          try {
            store.createIndex(name, keyPath, { unique: false })
            console.log(`Created index: ${name}`)
          } catch (error) {
            console.warn(`Failed to create index ${name}:`, error)
          }
        }
      }

      // Create raw store for API items used by grouping UIs (preserve if already exists)
      let rawStore: IDBObjectStore
      if (db.objectStoreNames.contains(RAW_STORE_NAME)) {
        rawStore = transaction.objectStore(RAW_STORE_NAME)
      } else {
        rawStore = db.createObjectStore(RAW_STORE_NAME, { keyPath: 'id' })
      }

      // Only create indexes that are actually used for queries in rawStamps store
      const rawUsedIndexes = [
        { name: 'country', keyPath: 'country' },
        { name: 'seriesName', keyPath: 'seriesName' },
        { name: 'issueYear', keyPath: 'issueYear' }
      ]

      // Remove all unused indexes from rawStamps store more aggressively
      const rawAllCurrentIndexes = Array.from((rawStore.indexNames as unknown as DOMStringList))
      const rawUnusedIndexNames = [
        'currencyCode', 'denominationValue', 'colorCode', 'paperCode',
        'watermarkCode', 'perforationCode', 'itemTypeCode', 'isInstance'
      ]

      for (const indexName of rawAllCurrentIndexes) {
        if (rawUnusedIndexNames.includes(indexName)) {
          try {
            rawStore.deleteIndex(indexName)
            console.log(`Deleted unused rawStamps index: ${indexName}`)
          } catch (error) {
            console.warn(`Failed to delete rawStamps index ${indexName}:`, error)
          }
        }
      }

      // Create only the indexes we actually use for rawStamps
      for (const { name, keyPath } of rawUsedIndexes) {
        if (!(rawStore.indexNames as unknown as DOMStringList).contains(name)) {
          try {
            rawStore.createIndex(name, keyPath, { unique: false })
            console.log(`Created rawStamps index: ${name}`)
          } catch (error) {
            console.warn(`Failed to create rawStamps index ${name}:`, error)
          }
        }
      }

      // Create metadata store for tracking last refresh date
      if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
        const metadataStore = db.createObjectStore(METADATA_STORE_NAME, { keyPath: 'key' })
        metadataStore.createIndex('key', 'key', { unique: true })
      }
    }
  })
}

// Helper functions for date-based data refresh
export const getLastRefreshDate = async (): Promise<string | null> => {
  try {
    const db = await openDB()

    // Check if metadata store exists
    if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
      console.log('Metadata store does not exist yet')
      return null
    }

    const transaction = db.transaction([METADATA_STORE_NAME], 'readonly')
    const store = transaction.objectStore(METADATA_STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.get('lastRefreshDate')
      request.onsuccess = () => {
        const result = request.result
        const value = result?.value || null
        console.log('Retrieved last refresh date:', { result, value })
        resolve(value)
      }
      request.onerror = () => {
        console.error('Failed to get last refresh date from store:', request.error)
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('❌ Error getting last refresh date:', error)
    return null
  }
}

export const setLastRefreshDate = async (date: string): Promise<void> => {
  try {
    console.log(`Setting last refresh date to: "${date}"`)
    const db = await openDB()
    const transaction = db.transaction([METADATA_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(METADATA_STORE_NAME)

    await new Promise<void>((resolve, reject) => {
      const request = store.put({ key: 'lastRefreshDate', value: date })
      request.onsuccess = () => {
        console.log(`✅ Successfully set last refresh date to: "${date}"`)
        resolve()
      }
      request.onerror = () => {
        console.error('❌ Failed to set last refresh date:', request.error)
        reject(request.error)
      }
    })
  } catch (error) {
    console.error('❌ Error setting last refresh date:', error)
    throw error
  }
}

export const shouldRefreshData = async (): Promise<boolean> => {
  try {
    const today = new Date().toDateString() // Get current date as string (e.g., "Mon Jan 01 2024")
    const lastRefreshDate = await getLastRefreshDate()

    console.log('Date refresh check:', {
      today,
      lastRefreshDate,
      lastRefreshDateType: typeof lastRefreshDate,
      isNullOrUndefined: lastRefreshDate == null
    })

    if (!lastRefreshDate || lastRefreshDate.trim() === '') {
      // No last refresh date stored, should refresh (first time or cleared)
      console.log('No last refresh date found, will refresh data')
      return true
    }

    // Check if the last refresh date is older than 7 days
    const lastRefreshDateObj = new Date(lastRefreshDate.trim())
    const todayObj = new Date(today)
    const daysDifference = Math.floor((todayObj.getTime() - lastRefreshDateObj.getTime()) / (1000 * 60 * 60 * 24))
    const shouldRefreshDueToAge = daysDifference > 7

    console.log('Date comparison:', {
      today,
      lastRefreshDate: lastRefreshDate.trim(),
      daysDifference,
      shouldRefreshDueToAge,
      comparison: `${daysDifference} days difference, refresh if > 7 days`
    })

    if (shouldRefreshDueToAge) {
      console.log(`✅ Data is ${daysDifference} days old (older than 7 days), refreshing data...`)
    } else {
      console.log(`⏸️ Data is ${daysDifference} days old (within 7 days), using cached data`)
    }

    return shouldRefreshDueToAge
  } catch (error) {
    console.error('❌ Error checking if data should be refreshed:', error)
    // On error, don't refresh to avoid breaking the app
    return false
  }
}

export const markDataRefreshed = async (): Promise<void> => {
  const today = new Date().toDateString()
  console.log(`🎯 Marking data as refreshed for date: ${today}`)
  await setLastRefreshDate(today)
  console.log(`✅ Data refresh marked for date: ${today}`)
}

export const clearAllData = async (): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME, RAW_STORE_NAME], 'readwrite')

    // Clear both stores
    const stampsStore = transaction.objectStore(STORE_NAME)
    const rawStampsStore = transaction.objectStore(RAW_STORE_NAME)

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const clearRequest = stampsStore.clear()
        clearRequest.onsuccess = () => resolve()
        clearRequest.onerror = () => reject(clearRequest.error)
      }),
      new Promise<void>((resolve, reject) => {
        const clearRequest = rawStampsStore.clear()
        clearRequest.onsuccess = () => resolve()
        clearRequest.onerror = () => reject(clearRequest.error)
      })
    ])

    console.log('All data cleared for daily refresh')
  } catch (error) {
    console.error('Error clearing all data:', error)
    throw error
  }
}

// Manual cleanup function for existing users to force remove unused indexes
export const forceCleanupUnusedIndexes = async (): Promise<void> => {
  try {
    console.log('🔧 Starting manual cleanup of unused indexes...')

    const db = await openDB()
    const transaction = db.transaction([STORE_NAME, RAW_STORE_NAME], 'readwrite')

    // Clean up stamps store indexes
    const stampsStore = transaction.objectStore(STORE_NAME)
    const stampsIndexes = Array.from((stampsStore.indexNames as unknown as DOMStringList))
    const unusedStampsIndexes = ['stampCode', 'publisher']

    for (const indexName of stampsIndexes) {
      if (unusedStampsIndexes.includes(indexName)) {
        try {
          stampsStore.deleteIndex(indexName)
          console.log(`🗑️ Deleted unused index: ${indexName} from stamps store`)
        } catch (error) {
          console.warn(`Failed to delete index ${indexName}:`, error)
        }
      }
    }

    // Clean up rawStamps store indexes
    const rawStampsStore = transaction.objectStore(RAW_STORE_NAME)
    const rawStampsIndexes = Array.from((rawStampsStore.indexNames as unknown as DOMStringList))
    const unusedRawStampsIndexes = [
      'currencyCode', 'denominationValue', 'colorCode', 'paperCode',
      'watermarkCode', 'perforationCode', 'itemTypeCode', 'isInstance'
    ]

    for (const indexName of rawStampsIndexes) {
      if (unusedRawStampsIndexes.includes(indexName)) {
        try {
          rawStampsStore.deleteIndex(indexName)
          console.log(`🗑️ Deleted unused index: ${indexName} from rawStamps store`)
        } catch (error) {
          console.warn(`Failed to delete index ${indexName}:`, error)
        }
      }
    }

    // Wait for transaction to complete
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('✅ Manual index cleanup completed successfully')
        resolve()
      }
      transaction.onerror = () => {
        console.error('❌ Manual index cleanup failed:', transaction.error)
        reject(transaction.error)
      }
    })

  } catch (error) {
    console.error('❌ Error during manual index cleanup:', error)
    throw error
  }
}

// Utility function for manual cleanup - can be called from browser console
// Usage: import { manualCleanup } from '@/lib/data/investigate-search-db'; manualCleanup()
export const manualCleanup = async (): Promise<void> => {
  console.log('🧹 Starting manual cleanup...')
  try {
    await forceCleanupUnusedIndexes()
    console.log('✅ Manual cleanup completed!')
  } catch (error) {
    console.error('❌ Manual cleanup failed:', error)
  }
}

export const saveStampsToIndexedDB = async (stamps: StampData[]): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    // Clear existing data
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
    
    // Add/Update stamps (use put to avoid duplicate key ConstraintError)
    for (const stamp of stamps) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(stamp)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }

    // Ensure the transaction completes before returning
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  } catch (error) {
    console.error('Error saving stamps to IndexedDB:', error)
    throw error
  }
}

export const getStampsFromIndexedDB = async (): Promise<StampData[]> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting stamps from IndexedDB:', error)
    return []
  }
}

export const saveRawStampsToIndexedDB = async (rawStamps: any[]): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([RAW_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(RAW_STORE_NAME)

    // Clear existing data
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })

    // Select only the fields we actually use in the UI to keep storage small and reliable
    const project = (item: any) => ({
      id: item.id,
      // Index fields with safe defaults
      isInstance: Boolean(item.isInstance),
      country: item.country ?? '',
      seriesName: item.seriesName ?? '',
      issueYear: (item.issueYear ?? 0) as number,
      currencyCode: item.currencyCode ?? '',
      denominationValue: item.denominationValue ?? '',
      colorCode: item.colorCode ?? '',
      paperCode: item.paperCode ?? '',
      watermarkCode: item.watermarkCode ?? '',
      perforationCode: item.perforationCode ?? '',
      itemTypeCode: item.itemTypeCode ?? '',

      // Other useful fields (optional)
      parentStampId: item.parentStampId,
      catalogNumber: item.catalogNumber,
      stampCode: item.stampCode,
      name: item.name,
      description: item.description,
      countryName: item.countryName,
      countryFlag: item.countryFlag,
      seriesId: item.seriesId,
      seriesDescription: item.seriesDescription,
      typeId: item.typeId,
      typeName: item.typeName,
      typeDescription: item.typeDescription,
      stampGroupId: item.stampGroupId,
      stampGroupName: item.stampGroupName,
      stampGroupDescription: item.stampGroupDescription,
      releaseId: item.releaseId,
      releaseName: item.releaseName,
      releaseDateRange: item.releaseDateRange,
      releaseDescription: item.releaseDescription,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryCode: item.categoryCode,
      categoryDescription: item.categoryDescription,
      paperTypeId: item.paperTypeId,
      paperTypeName: item.paperTypeName,
      paperTypeCode: item.paperTypeCode,
      paperTypeDescription: item.paperTypeDescription,
      currencyName: item.currencyName,
      currencySymbol: item.currencySymbol,
      currencyDescription: item.currencyDescription,
      denominationSymbol: item.denominationSymbol,
      denominationDisplay: item.denominationDisplay,
      denominationDescription: item.denominationDescription,
      colorName: item.colorName,
      colorHex: item.colorHex,
      colorDescription: item.colorDescription,
      colorVariant: item.colorVariant,
      paperName: item.paperName,
      paperDescription: item.paperDescription,
      watermarkName: item.watermarkName,
      watermarkDescription: item.watermarkDescription,
      perforationName: item.perforationName,
      perforationMeasurement: item.perforationMeasurement,
      itemTypeName: item.itemTypeName,
      itemTypeDescription: item.itemTypeDescription,
      itemFormat: item.itemFormat,
      issueDate: item.issueDate,
      stampImageUrl: item.stampImageUrl,
      hasVarieties: item.hasVarieties,
      varietyCount: item.varietyCount,
      postalHistoryType: item.postalHistoryType,
      proofType: item.proofType,
      essayType: item.essayType,
      errorType: item.errorType,
      stampDetailsJson: item.stampDetailsJson,
    })

    // Add/Update raw stamps (projected) using put to avoid duplicate key errors
    for (const item of rawStamps) {
      await new Promise<void>((resolve, reject) => {
        const request = store.put(project(item))
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }

    // Ensure the transaction completes before returning
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  } catch (error) {
    console.error('Error saving raw stamps to IndexedDB:', error)
    throw error
  }
}

export const getRawStampsFromIndexedDB = async (): Promise<any[]> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([RAW_STORE_NAME], 'readonly')
    const store = transaction.objectStore(RAW_STORE_NAME)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting raw stamps from IndexedDB:', error)
    return []
  }
}

export const getPaginatedStampsFromIndexedDB = async (offset: number = 0, limit: number = 50): Promise<{ stamps: StampData[], hasMore: boolean, total: number }> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    // First, get the total count
    const countRequest = store.count()
    const total = await new Promise<number>((resolve, reject) => {
      countRequest.onsuccess = () => resolve(countRequest.result)
      countRequest.onerror = () => reject(countRequest.error)
    })
    
    // Then get the paginated data using cursor
    const stamps: StampData[] = []
    let currentOffset = 0
    let collected = 0
    
    return new Promise((resolve, reject) => {
      const request = store.openCursor()
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        
        if (cursor && collected < limit) {
          if (currentOffset >= offset) {
            stamps.push(cursor.value)
            collected++
          }
          currentOffset++
          cursor.continue()
        } else {
          const hasMore = offset + limit < total
          resolve({ stamps, hasMore, total })
        }
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting paginated stamps from IndexedDB:', error)
    return { stamps: [], hasMore: false, total: 0 }
  }
}

export const getTotalStampsCountFromIndexedDB = async (): Promise<number> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.count()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting stamps count from IndexedDB:', error)
    return 0
  }
}

export const clearIndexedDB = async (): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
    
  } catch (error) {
    console.error('Error clearing IndexedDB:', error)
    throw error
  }
}

export const checkIndexedDBEmpty = async (): Promise<boolean> => {
  try {
    const stamps = await getStampsFromIndexedDB()
    return stamps.length === 0
  } catch (error) {
    console.error('Error checking IndexedDB:', error)
    return true
  }
}

export const recreateIndexedDB = async () => {
  try {
    // Close any existing connections
    const dbs = await indexedDB.databases()
    for (const dbInfo of dbs) {
      if (dbInfo.name === DB_NAME) {
        await new Promise<void>((resolve, reject) => {
          const deleteRequest = indexedDB.deleteDatabase(DB_NAME)
          deleteRequest.onsuccess = () => resolve()
          deleteRequest.onerror = () => reject(deleteRequest.error)
        })
        break
      }
    }
  } catch (error) {
    console.error('Database deletion not needed or failed:', error)
  }
} 