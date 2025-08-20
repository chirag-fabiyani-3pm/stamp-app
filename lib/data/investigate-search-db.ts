import { StampData } from '@/types/catalog'

const DB_NAME = 'StampCatalogDB'
const DB_VERSION = 3 // Increment version to handle schema changes
const STORE_NAME = 'stamps'
const RAW_STORE_NAME = 'rawStamps'

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = (event.target as IDBOpenDBRequest).transaction!
      
      // Ensure normalized store exists and has indexes, preserve existing data
      let store: IDBObjectStore
      if (db.objectStoreNames.contains(STORE_NAME)) {
        store = transaction.objectStore(STORE_NAME)
      } else {
        store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
      const ensureIndex = (name: string, keyPath: string) => {
        if (!(store.indexNames as unknown as DOMStringList).contains(name)) {
          store.createIndex(name, keyPath, { unique: false })
        }
      }
      ensureIndex('stampCode', 'stampCode')
      ensureIndex('country', 'country')
      ensureIndex('seriesName', 'seriesName')
      ensureIndex('issueYear', 'issueYear')
      ensureIndex('publisher', 'publisher')

      // Create raw store for API items used by grouping UIs (preserve if already exists)
      if (!db.objectStoreNames.contains(RAW_STORE_NAME)) {
        const rawStore = db.createObjectStore(RAW_STORE_NAME, { keyPath: 'id' })
        rawStore.createIndex('country', 'country', { unique: false })
        rawStore.createIndex('seriesName', 'seriesName', { unique: false })
        rawStore.createIndex('issueYear', 'issueYear', { unique: false })
        rawStore.createIndex('currencyCode', 'currencyCode', { unique: false })
        rawStore.createIndex('denominationValue', 'denominationValue', { unique: false })
        rawStore.createIndex('colorCode', 'colorCode', { unique: false })
        rawStore.createIndex('paperCode', 'paperCode', { unique: false })
        rawStore.createIndex('watermarkCode', 'watermarkCode', { unique: false })
        rawStore.createIndex('perforationCode', 'perforationCode', { unique: false })
        rawStore.createIndex('itemTypeCode', 'itemTypeCode', { unique: false })
        rawStore.createIndex('isInstance', 'isInstance', { unique: false })
      }
    }
  })
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