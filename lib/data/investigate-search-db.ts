import { StampData } from '@/types/catalog'

const DB_NAME = 'StampCatalogDB'
const DB_VERSION = 2 // Increment version to handle schema changes
const STORE_NAME = 'stamps'

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = (event.target as IDBOpenDBRequest).transaction!
      
      // Delete existing store if it exists (to handle schema changes)
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME)
      }
      
      // Create new store with updated schema
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      // Remove unique constraint from stampCode since API data can have duplicates
      store.createIndex('stampCode', 'stampCode', { unique: false })
      store.createIndex('country', 'country', { unique: false })
      store.createIndex('seriesName', 'seriesName', { unique: false })
      store.createIndex('issueYear', 'issueYear', { unique: false })
      store.createIndex('publisher', 'publisher', { unique: false })
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
    
    // Add new stamps
    for (const stamp of stamps) {
      await new Promise<void>((resolve, reject) => {
        const addRequest = store.add(stamp)
        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject(addRequest.error)
      })
    }
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