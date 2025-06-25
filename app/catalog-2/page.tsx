"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Search, Filter, Grid, List, ArrowLeft, Home, Share2, RefreshCw, Loader2, Star, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"

interface StampData {
  id: string
  stampCode: string
  status: number
  userId: string
  stampCatalogId: string | null
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string | null
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number | null
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  paperType: string | null
  stampDetailsJson: string
  estimatedMarketValue: number | null
  actualPrice: number | null
}

interface ApiStampData {
  id: string
  catalogExtractionProcessId: string
  stampCatalogCode: string
  name: string
  publisher: string
  country: string
  stampImageUrl: string
  catalogName: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number
  denominationValue: number
  denominationCurrency: string
  denominationSymbol: string
  color: string
  paperType: string
  stampDetailsJson: string
}

interface ApiResponse {
  items: ApiStampData[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface GroupedStamps {
  [key: string]: StampData[] | GroupedStamps
}

interface NavigationState {
  path: string[]
  level: number
}

type GroupingField = 'seriesName' | 'issueYear' | 'country' | 'color' | 'paperType' | 'denominationValue' | 'publisher'

const GROUPING_FIELDS: { value: GroupingField; label: string }[] = [
  { value: 'seriesName', label: 'Series Name' },
  { value: 'issueYear', label: 'Issue Year' },
  { value: 'country', label: 'Country' },
  { value: 'color', label: 'Color' },
  { value: 'paperType', label: 'Paper Type' },
  { value: 'denominationValue', label: 'Denomination' },
  { value: 'publisher', label: 'Publisher' },
]

// IndexedDB utility functions
const DB_NAME = 'StampCatalogDB'
const DB_VERSION = 2 // Increment version to handle schema changes
const STORE_NAME = 'stamps'

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      const transaction = (event.target as IDBOpenDBRequest).transaction!
      
      // Delete existing store if it exists (to handle schema changes)
      if (db.objectStoreNames.contains(STORE_NAME)) {
        console.log('Deleting existing store to upgrade schema...')
        db.deleteObjectStore(STORE_NAME)
      }
      
      // Create new store with updated schema
      console.log('Creating new store with updated schema...')
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

const saveStampsToIndexedDB = async (stamps: StampData[]): Promise<void> => {
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

const getStampsFromIndexedDB = async (): Promise<StampData[]> => {
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

const getPaginatedStampsFromIndexedDB = async (offset: number = 0, limit: number = 50): Promise<{ stamps: StampData[], hasMore: boolean, total: number }> => {
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

const getTotalStampsCountFromIndexedDB = async (): Promise<number> => {
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

const clearIndexedDB = async (): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
    
    console.log('IndexedDB cleared successfully')
  } catch (error) {
    console.error('Error clearing IndexedDB:', error)
    throw error
  }
}

const checkIndexedDBEmpty = async (): Promise<boolean> => {
  try {
    const stamps = await getStampsFromIndexedDB()
    return stamps.length === 0
  } catch (error) {
    console.error('Error checking IndexedDB:', error)
    return true
  }
}

// Map API response to StampData format
const mapApiStampToStampData = (apiStamp: ApiStampData): StampData => {
  return {
    id: apiStamp.id,
    stampCode: apiStamp.stampCatalogCode,
    status: 1, // Default to active
    userId: 'system', // Default value
    stampCatalogId: apiStamp.catalogExtractionProcessId,
    name: apiStamp.name,
    publisher: apiStamp.publisher,
    country: apiStamp.country,
    stampImageUrl: apiStamp.stampImageUrl,
    catalogName: apiStamp.catalogName,
    catalogNumber: apiStamp.catalogNumber,
    seriesName: apiStamp.seriesName,
    issueDate: apiStamp.issueDate,
    issueYear: apiStamp.issueYear || null,
    denominationValue: apiStamp.denominationValue,
    denominationCurrency: apiStamp.denominationCurrency,
    denominationSymbol: apiStamp.denominationSymbol,
    color: apiStamp.color,
    paperType: apiStamp.paperType || null,
    stampDetailsJson: apiStamp.stampDetailsJson,
    estimatedMarketValue: null, // Not provided by API
    actualPrice: null // Not provided by API
  }
}

// Fetch all stamps from API with pagination
const fetchAllStampsFromAPI = async (jwt: string): Promise<StampData[]> => {
  const allStamps: StampData[] = []
  let currentPage = 1
  let hasMorePages = true
  const maxPageSize = 200 // Use maximum allowed page size for efficiency

  console.log('Starting API fetch with JWT token length:', jwt.length)

  try {
    while (hasMorePages) {
      console.log(`Fetching page ${currentPage} from API...`)
      
      const url = new URL('https://3pm-stampapp-prod.azurewebsites.net/api/v1/StampCatalog')
      url.searchParams.append('pageNumber', currentPage.toString())
      url.searchParams.append('pageSize', maxPageSize.toString())
      
      console.log('API Request URL:', url.toString())
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })

      console.log(`API Response: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        if (response.status === 204) {
          console.log('API returned 204 No Content - end of data')
          break
        }
        const errorText = await response.text()
        console.error(`API error response:`, errorText)
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const data: ApiResponse = await response.json()
      console.log('API Response data:', {
        itemsCount: data.items?.length || 0,
        pageNumber: data.pageNumber,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage
      })
      
      if (data.items && data.items.length > 0) {
        const mappedStamps = data.items.map(mapApiStampToStampData)
        allStamps.push(...mappedStamps)
        console.log(`Fetched ${data.items.length} stamps from page ${currentPage}. Total so far: ${allStamps.length}`)
        
        // Check if there are more pages
        hasMorePages = data.hasNextPage && currentPage < data.totalPages
        currentPage++
      } else {
        console.log('No items in response, ending pagination')
        hasMorePages = false
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`Finished fetching all stamps. Total: ${allStamps.length}`)
    return allStamps
  } catch (error) {
    console.error('Error fetching stamps from API:', error)
    throw error
  }
}

function Catalog2Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [stamps, setStamps] = useState<StampData[]>([])
  const [allStampsLoaded, setAllStampsLoaded] = useState(false)
  const [totalStampsCount, setTotalStampsCount] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [groupingLevels, setGroupingLevels] = useState<GroupingField[]>([]) // Default to empty - show all stamps
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [groupSearchTerm, setGroupSearchTerm] = useState("")
  const [debouncedGroupSearchTerm, setDebouncedGroupSearchTerm] = useState("")
  const [isInitialized, setIsInitialized] = useState(false) // Track initialization
  
  // Infinite scrolling state
  const [displayedItemsCount, setDisplayedItemsCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const ITEMS_PER_LOAD = 15
  const INDEXEDDB_PAGE_SIZE = 50

  // Get navigation state from URL
  const navigation = useMemo(() => {
    const pathParam = searchParams.get('path')
    const path = pathParam ? decodeURIComponent(pathParam).split(',').filter(Boolean) : []
    return {
      path,
      level: path.length
    }
  }, [searchParams])

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search')
    const urlGroupSearch = searchParams.get('groupSearch')
    const urlViewMode = searchParams.get('view') as 'grid' | 'list'
    const urlGrouping = searchParams.get('grouping')

    if (urlSearchTerm !== null) {
      setSearchTerm(urlSearchTerm)
      setDebouncedSearchTerm(urlSearchTerm)
    }
    if (urlGroupSearch !== null) {
      setGroupSearchTerm(urlGroupSearch)
      setDebouncedGroupSearchTerm(urlGroupSearch)
    }
    if (urlViewMode && ['grid', 'list'].includes(urlViewMode)) setViewMode(urlViewMode)
    if (urlGrouping) {
      const groupingFields = urlGrouping.split(',').filter(field => 
        GROUPING_FIELDS.some(f => f.value === field)
      ) as GroupingField[]
      if (groupingFields.length > 0) {
        setGroupingLevels(groupingFields)
      }
    }
    setIsInitialized(true)
  }, [searchParams])

  // Debounce search terms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedGroupSearchTerm(groupSearchTerm)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [groupSearchTerm])

  // Update URL when search, view mode, or grouping changes
  useEffect(() => {
    // Only update URL after initial load to prevent overwriting pasted URLs
    if (!isInitialized) return
    
    const timeoutId = setTimeout(() => {
      updateURLParams()
    }, 300) // Debounce for search
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, groupSearchTerm, viewMode, groupingLevels, isInitialized])

  // Update URL when navigation changes
  const updateURL = (newPath: string[], preserveOtherParams: boolean = true) => {
    const params = new URLSearchParams()
    
    // Add navigation path
    if (newPath.length > 0) {
      params.set('path', encodeURIComponent(newPath.join(',')))
    }
    
    
    if (preserveOtherParams) {
      // Preserve other parameters
      if (searchTerm) params.set('search', searchTerm)
      if (groupSearchTerm) params.set('groupSearch', groupSearchTerm)
      if (viewMode !== 'grid') params.set('view', viewMode)
      // Only add grouping param if there are actual grouping levels set
      if (groupingLevels.length > 0) {
        params.set('grouping', groupingLevels.join(','))
      }
    }
    
    const queryString = params.toString()
    const url = queryString ? `/catalog-2?${queryString}` : '/catalog-2'
    router.push(url, { scroll: false })
  }

  // Update URL when other parameters change
  const updateURLParams = () => {
    updateURL(navigation.path, true)
  }

  // Initialize IndexedDB with real API data if empty
  const initializeIndexedDB = async () => {
    try {
      const isEmpty = await checkIndexedDBEmpty()
      console.log('IndexedDB isEmpty:', isEmpty)
      
      if (isEmpty) {
        console.log('IndexedDB is empty, checking authentication...')
        
        // Check if user is logged in
        const userDataStr = localStorage.getItem('stamp_user_data')
        console.log('User data from localStorage:', userDataStr ? 'Found' : 'Not found')
        
        if (!userDataStr) {
          // No logged in user - show error that authentication is required
          console.log('User not logged in, no data available')
          toast({
            title: "Authentication Required",
            description: "Please log in to access the stamp catalog",
            variant: "destructive"
          })
          return
        }

        try {
          const userData = JSON.parse(userDataStr)
          console.log('Parsed user data:', { hasJwt: !!userData.jwt, userId: userData.id || 'N/A' })
          const jwt = userData.jwt

          if (!jwt) {
            console.log('No JWT token found in user data')
            throw new Error('No JWT token found')
          }

          console.log('JWT token found, fetching data from API...')
          toast({
            title: "Loading Catalog",
            description: "Fetching stamp data from server...",
          })

          // Fetch all stamps from API
          const apiStamps = await fetchAllStampsFromAPI(jwt)
          console.log(`API returned ${apiStamps.length} stamps`)
          
          if (apiStamps.length > 0) {
            console.log('Saving API stamps to IndexedDB...')
            await saveStampsToIndexedDB(apiStamps)
            toast({
              title: "Database Initialized",
              description: `Loaded ${apiStamps.length} stamps from server`,
            })
          } else {
            // No stamps available from API
            console.log('API returned no stamps')
            toast({
              title: "No Data Available", 
              description: "No stamps found on server",
              variant: "destructive"
            })
          }
        } catch (apiError: unknown) {
          console.error('Error fetching from API:', apiError)
          const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error'
          
          // Check if it's a constraint error (schema issue)
          if (errorMessage.includes('ConstraintError') || errorMessage.includes('uniqueness requirements')) {
            console.log('Detected schema conflict, recreating database...')
            try {
              await recreateIndexedDB()
              // Try API fetch again with fresh database
              const userData = JSON.parse(userDataStr)
              const retryJwt = userData.jwt
              if (retryJwt) {
                const apiStamps = await fetchAllStampsFromAPI(retryJwt)
                if (apiStamps.length > 0) {
                  await saveStampsToIndexedDB(apiStamps)
                  toast({
                    title: "Database Upgraded",
                    description: `Database schema updated. Loaded ${apiStamps.length} stamps from server.`,
                  })
                  return
                }
              }
            } catch (retryError) {
              console.error('Retry after database recreation failed:', retryError)
            }
          }
          
          toast({
            title: "Server Error",
            description: `Unable to load data: ${errorMessage}`,
            variant: "destructive"
          })
        }
      } else {
        console.log('IndexedDB already has data, skipping initialization')
      }
    } catch (error) {
      console.error('Error initializing IndexedDB:', error)
      toast({
        title: "Database Error",
        description: "Unable to initialize local database",
        variant: "destructive"
      })
    }
  }

  // Clear and recreate IndexedDB (for schema changes)
  const recreateIndexedDB = async () => {
    try {
      // Close any existing connections
      const dbs = await indexedDB.databases()
      for (const dbInfo of dbs) {
        if (dbInfo.name === DB_NAME) {
          console.log('Deleting existing database for schema upgrade...')
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(DB_NAME)
            deleteRequest.onsuccess = () => resolve()
            deleteRequest.onerror = () => reject(deleteRequest.error)
          })
          break
        }
      }
    } catch (error) {
      console.log('Database deletion not needed or failed:', error)
    }
  }

  // Force refresh data from API
  const refreshDataFromAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Clear existing data
      await clearIndexedDB()
      
      // Reset state
      setStamps([])
      setCurrentOffset(0)
      setAllStampsLoaded(false)
      setTotalStampsCount(0)
      
      // Initialize with fresh data
      await initializeIndexedDB()
      
      // Reload data
      await loadInitialStamps()
      
      toast({
        title: "Data Refreshed",
        description: "Catalog data has been refreshed from server",
      })
    } catch (error) {
      console.error('Error refreshing data:', error)
      setError('Failed to refresh data from server')
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh data from server",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Load initial stamps data
  const loadInitialStamps = async () => {
    setLoading(true)
    setError(null)
    setCurrentOffset(0)
    setAllStampsLoaded(false)

    try {
      // First, initialize IndexedDB if needed
      await initializeIndexedDB()
      
      // Try to get total count first
      const totalCount = await getTotalStampsCountFromIndexedDB()
      setTotalStampsCount(totalCount)
      
      if (totalCount > 0) {
        // Load first page from IndexedDB
        const { stamps: initialStamps, hasMore } = await getPaginatedStampsFromIndexedDB(0, INDEXEDDB_PAGE_SIZE)
        setStamps(initialStamps)
        setCurrentOffset(INDEXEDDB_PAGE_SIZE)
        setAllStampsLoaded(!hasMore)
        console.log(`Loaded ${initialStamps.length} stamps from IndexedDB (page 1)`)
      } else {
        // Fallback to API or mock data
        await loadFromAPIOrData()
      }
    } catch (err) {
      console.warn('Error loading initial stamps:', err)
      await loadFromAPIOrData()
      setError('Using offline data. Some features may be limited.')
    } finally {
      setLoading(false)
    }
  }

  // Load more stamps from IndexedDB for infinite scroll
  const loadMoreStamps = async () => {
    if (isLoadingMore || allStampsLoaded) return
    
    setIsLoadingMore(true)
    
    try {
      const { stamps: moreStamps, hasMore } = await getPaginatedStampsFromIndexedDB(currentOffset, INDEXEDDB_PAGE_SIZE)
      
      if (moreStamps.length > 0) {
        setStamps(prevStamps => [...prevStamps, ...moreStamps])
        setCurrentOffset(prev => prev + INDEXEDDB_PAGE_SIZE)
        setAllStampsLoaded(!hasMore)
        console.log(`Loaded ${moreStamps.length} more stamps from IndexedDB`)
      } else {
        setAllStampsLoaded(true)
      }
    } catch (err) {
      console.error('Error loading more stamps:', err)
      setAllStampsLoaded(true)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Fallback function for API data
  const loadFromAPIOrData = async () => {
    const userDataStr = localStorage.getItem('stamp_user_data')
    if (!userDataStr) {
      // No user logged in
      setStamps([])
      setTotalStampsCount(0)
      setAllStampsLoaded(true)
      setError('Please log in to access the stamp catalog')
      return
    }
    
    try {
      const userData = JSON.parse(userDataStr)
      const jwt = userData.jwt

      if (!jwt) {
        throw new Error('No JWT token found')
      }

      // Fetch all stamps from the API endpoint
      const apiStamps = await fetchAllStampsFromAPI(jwt)
      
      if (apiStamps.length > 0) {
        setStamps(apiStamps)
        setTotalStampsCount(apiStamps.length)
        setAllStampsLoaded(true)
        
        // Save fetched data to IndexedDB for future use
        await saveStampsToIndexedDB(apiStamps)
      } else {
        // No stamps available from API
        setStamps([])
        setTotalStampsCount(0)
        setAllStampsLoaded(true)
        setError('No stamps found on server')
      }
    } catch (error) {
      console.error('Error fetching from API:', error)
      // No data available
      setStamps([])
      setTotalStampsCount(0)
      setAllStampsLoaded(true)
      setError('Unable to load stamp data from server')
    }
  }

  useEffect(() => {
    loadInitialStamps()
  }, [])

  // Filter stamps based on debounced search term
  const filteredStamps = useMemo(() => {
    if (!debouncedSearchTerm) return stamps
    
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase()
    return stamps.filter(stamp => 
      stamp.name.toLowerCase().includes(lowerSearchTerm) ||
      stamp.seriesName.toLowerCase().includes(lowerSearchTerm) ||
      stamp.country.toLowerCase().includes(lowerSearchTerm) ||
      stamp.color.toLowerCase().includes(lowerSearchTerm) ||
      (stamp.denominationValue && stamp.denominationSymbol && 
       `${stamp.denominationValue}${stamp.denominationSymbol}`.toLowerCase().includes(lowerSearchTerm))
    )
  }, [stamps, debouncedSearchTerm])

  // Group stamps by the selected grouping levels
  const groupedStamps = useMemo(() => {
    const groupStamps = (stamps: StampData[], levels: GroupingField[]): GroupedStamps => {
      if (levels.length === 0) {
        return { "All Stamps": stamps }
      }

      const [currentLevel, ...remainingLevels] = levels
      const grouped: GroupedStamps = {}

      stamps.forEach(stamp => {
        let groupKey: string
        
        switch (currentLevel) {
          case 'seriesName':
            groupKey = stamp.seriesName || 'Unknown Series'
            break
          case 'issueYear':
            groupKey = stamp.issueYear ? stamp.issueYear.toString() : 'Unknown Year'
            break
          case 'country':
            groupKey = stamp.country || 'Unknown Country'
            break
          case 'color':
            groupKey = stamp.color || 'Unknown Color'
            break
          case 'paperType':
            groupKey = stamp.paperType || 'Unknown Paper Type'
            break
          case 'denominationValue':
            groupKey = stamp.denominationValue 
              ? `${stamp.denominationValue}${stamp.denominationSymbol || ''}`
              : 'Unknown Denomination'
            break
          case 'publisher':
            groupKey = stamp.publisher || 'Unknown Publisher'
            break
          default:
            groupKey = 'Other'
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = []
        }

        if (Array.isArray(grouped[groupKey])) {
          (grouped[groupKey] as StampData[]).push(stamp)
        }
      })

      // If there are more levels, recursively group each sub-group
      if (remainingLevels.length > 0) {
        Object.keys(grouped).forEach(key => {
          if (Array.isArray(grouped[key])) {
            grouped[key] = groupStamps(grouped[key] as StampData[], remainingLevels)
          }
        })
      }

      return grouped
    }

    return groupStamps(filteredStamps, groupingLevels)
  }, [filteredStamps, groupingLevels])

  // Filter groups based on debounced group search term
  const filteredGroups = useMemo(() => {
    if (!debouncedGroupSearchTerm) return groupedStamps

    const filterGroups = (groups: GroupedStamps): GroupedStamps => {
      const filtered: GroupedStamps = {}
      const lowerSearchTerm = debouncedGroupSearchTerm.toLowerCase()

      Object.entries(groups).forEach(([key, value]) => {
        // Check if the group key matches the search term
        if (key.toLowerCase().includes(lowerSearchTerm)) {
          filtered[key] = value
        } else if (!Array.isArray(value)) {
          // If it's a nested group, recursively filter
          const nestedFiltered = filterGroups(value as GroupedStamps)
          if (Object.keys(nestedFiltered).length > 0) {
            filtered[key] = nestedFiltered
          }
        }
      })

      return filtered
    }

    return filterGroups(groupedStamps)
  }, [groupedStamps, debouncedGroupSearchTerm])

  // Get top-level group options for quick filter
  const topLevelGroups = useMemo(() => {
    if (groupingLevels.length === 0) return []
    
    const topLevel = Object.keys(groupedStamps)
    return topLevel.sort()
  }, [groupedStamps, groupingLevels])

  const setQuickGroupFilter = (groupName: string) => {
    setGroupSearchTerm(groupName)
    setDebouncedGroupSearchTerm(groupName) // Update immediately for quick filters
  }

  const clearGroupSearch = () => {
    setGroupSearchTerm("")
    setDebouncedGroupSearchTerm("") // Update immediately for clear action
  }

  // Count total stamps in filtered groups
  const countStampsInGroups = (groups: GroupedStamps | StampData[]): number => {
    if (Array.isArray(groups)) {
      return groups.length
    }
    
    return Object.values(groups).reduce((total, value) => {
      return total + countStampsInGroups(value)
    }, 0)
  }

  const filteredStampsCount = useMemo(() => {
    return countStampsInGroups(filteredGroups)
  }, [filteredGroups])

  // Get current level data based on navigation path
  const getCurrentLevelData = useMemo(() => {
    let currentData: GroupedStamps | StampData[] = filteredGroups
    
    for (const pathSegment of navigation.path) {
      if (!Array.isArray(currentData) && currentData[pathSegment]) {
        currentData = currentData[pathSegment]
      } else {
        // Path doesn't exist, reset to root
        updateURL([])
        return filteredGroups
      }
    }
    
    return currentData
  }, [filteredGroups, navigation.path])

  // Reset displayed items count when filters or grouping changes
  useEffect(() => {
    setDisplayedItemsCount(15)
  }, [searchTerm, groupSearchTerm, groupingLevels, navigation.path])

  // Load all stamps when debounced search terms or grouping changes to ensure complete results
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (!isInitialized) return
      
      // If user is searching or grouping is applied, we need all stamps for accurate results
      const needsAllStamps = debouncedSearchTerm.trim() !== '' || groupingLevels.length > 0
      
      if (needsAllStamps && !allStampsLoaded) {
        try {
          setLoading(true)
          console.log('Loading all stamps for search/grouping...')
          
          // Load all stamps from IndexedDB
          const allStamps = await getStampsFromIndexedDB()
          if (allStamps.length > 0) {
            setStamps(allStamps)
            setAllStampsLoaded(true)
            setCurrentOffset(allStamps.length)
            setTotalStampsCount(allStamps.length)
            console.log(`Loaded all ${allStamps.length} stamps for complete search/grouping`)
            
            toast({
              title: "Complete Dataset Loaded",
              description: `All ${allStamps.length} stamps are now available for accurate search and grouping results.`,
            })
          }
        } catch (error) {
          console.error('Error loading all stamps for search/grouping:', error)
        } finally {
          setLoading(false)
        }
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [debouncedSearchTerm, groupingLevels, isInitialized, allStampsLoaded])

  // Infinite scroll detection
  const handleScroll = useCallback(() => {
    if (isLoadingMore) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    // Load more when user is 200px from bottom
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      // Calculate current level data within the callback
      let currentLevelData: GroupedStamps | StampData[] = filteredGroups
      
      for (const pathSegment of navigation.path) {
        if (!Array.isArray(currentLevelData) && currentLevelData[pathSegment]) {
          currentLevelData = currentLevelData[pathSegment]
        } else {
          currentLevelData = filteredGroups
          break
        }
      }
      
      // Determine what type of data we're currently displaying
      let currentTotalCount: number
      let needsMoreFromDB = false
      
      if (groupingLevels.length === 0) {
        // No grouping - showing all filtered stamps
        currentTotalCount = filteredStamps.length
        needsMoreFromDB = displayedItemsCount >= filteredStamps.length * 0.8 && !allStampsLoaded
      } else if (Array.isArray(currentLevelData)) {
        // At stamp level within a group
        currentTotalCount = currentLevelData.length
        // For grouped stamps, we might need more data if this group is exhausted and we haven't loaded all stamps
        needsMoreFromDB = displayedItemsCount >= currentLevelData.length && !allStampsLoaded
      } else {
        // At group level
        const groupEntries = Object.entries(currentLevelData)
        currentTotalCount = groupEntries.length
        needsMoreFromDB = false // Groups are already computed from loaded data
      }
      
      // Check if we need to load more data from IndexedDB
      if (needsMoreFromDB) {
        loadMoreStamps()
      } else if (displayedItemsCount < currentTotalCount) {
        // Just show more of the already loaded/computed data
        setIsLoadingMore(true)
        setTimeout(() => {
          setDisplayedItemsCount(prev => prev + ITEMS_PER_LOAD)
          setIsLoadingMore(false)
        }, 300)
      }
    }
  }, [isLoadingMore, filteredStamps.length, displayedItemsCount, allStampsLoaded, loadMoreStamps, groupingLevels, filteredGroups, navigation.path])

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Navigation functions
  const navigateToGroup = (groupName: string) => {
    const newPath = [...navigation.path, groupName]
    updateURL(newPath)
  }

  const navigateToLevel = (level: number) => {
    const newPath = navigation.path.slice(0, level)
    updateURL(newPath)
  }

  const navigateBack = () => {
    if (navigation.level > 0) {
      navigateToLevel(navigation.level - 1)
    }
  }

  const navigateHome = () => {
    updateURL([])
  }

  // Share current URL
  const shareCurrentURL = async () => {
    const currentURL = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Catalog 2.0 - Stamp Collection',
          url: currentURL
        })
      } else {
        await navigator.clipboard.writeText(currentURL)
        toast({
          title: "URL copied to clipboard",
          description: "You can now share this URL with others",
        })
      }
    } catch (error) {
      console.error('Error sharing URL:', error)
    }
  }

  const addGroupingLevel = (field: GroupingField) => {
    if (!groupingLevels.includes(field)) {
      setGroupingLevels([...groupingLevels, field])
      // Reset navigation when grouping changes
      updateURL([])
    }
  }

  const removeGroupingLevel = (index: number) => {
    const newLevels = groupingLevels.filter((_, i) => i !== index)
    setGroupingLevels(newLevels)
    // Reset navigation when grouping changes
    updateURL([])
  }

  const formatDenomination = (value: number, symbol: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  // Loading components
  const StampCardSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="aspect-square relative bg-muted/10">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-2 left-2">
          <Skeleton className="h-5 w-12 rounded" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  )

  const StampListSkeleton = () => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-16 h-16 rounded" />
          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  )

  const GroupCardSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  )

  const LoadingStamps = ({ count = 6, type = 'grid' }: { count?: number; type?: 'grid' | 'list' | 'groups' }) => (
    <div className="space-y-6">
      <div className={cn(
        type === 'grid' 
          ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          : type === 'list'
          ? "space-y-3"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      )}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i}>
            {type === 'grid' ? <StampCardSkeleton /> : 
             type === 'list' ? <StampListSkeleton /> : 
             <GroupCardSkeleton />}
          </div>
        ))}
      </div>
      <div className="text-center py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm text-muted-foreground">Loading content...</p>
        </div>
      </div>
    </div>
  )

  const handleStampClick = (stamp: StampData) => {
    router.push(`/catalog-2/${stamp.id}`)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const renderStampCard = (stamp: StampData) => (
    <Card 
      key={stamp.id} 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg border bg-background hover:bg-muted/20"
      onClick={() => handleStampClick(stamp)}
    >
      {/* Image Section */}
      <div className="aspect-square relative overflow-hidden bg-muted/10">
        <Image
          src={stamp.stampImageUrl || "/placeholder.svg"}
          alt={stamp.name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        
        {/* Simple denomination badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="text-xs font-medium bg-background/90 backdrop-blur-sm">
            {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
          </Badge>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
      </div>
      
      {/* Content Section */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1" title={stamp.name}>
            {stamp.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate" title={stamp.seriesName}>
            {stamp.seriesName}
          </p>
        </div>
        
        {/* Simple info row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{stamp.issueYear || 'Unknown'}</span>
          <span>•</span>
          <span>{stamp.country}</span>
        </div>
        
        {/* Catalog number */}
        <div className="text-xs text-muted-foreground">
          #{stamp.catalogNumber}
        </div>
      </div>
    </Card>
  )

  const renderStampList = (stamp: StampData) => (
    <Card 
      key={stamp.id} 
      className="group mb-3 cursor-pointer transition-all duration-200 hover:shadow-md border bg-background hover:bg-muted/10"
      onClick={() => handleStampClick(stamp)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 relative flex-shrink-0 bg-muted/10 rounded overflow-hidden">
            <Image
              src={stamp.stampImageUrl || "/placeholder.svg"}
              alt={stamp.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold text-base leading-tight mb-1" title={stamp.name}>
                {stamp.name}
              </h3>
              <p className="text-sm text-muted-foreground" title={stamp.seriesName}>
                {stamp.seriesName}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
              </Badge>
              <span>{stamp.issueYear || 'Unknown'}</span>
              <span>•</span>
              <span>{stamp.country}</span>
              <span>•</span>
              <span>#{stamp.catalogNumber}</span>
            </div>
          </div>
          
          <div className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentLevel = () => {
    const currentData = getCurrentLevelData
    
    // If no grouping levels are set, show all filtered stamps directly
    if (groupingLevels.length === 0) {
      const displayedStamps = filteredStamps.slice(0, displayedItemsCount)
      const hasMore = displayedItemsCount < filteredStamps.length
      
      return (
        <div className="space-y-4">
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              : "space-y-2"
          )}>
            {displayedStamps.map(stamp => 
              viewMode === 'grid' ? renderStampCard(stamp) : renderStampList(stamp)
            )}
          </div>
          {isLoadingMore && (hasMore || (!allStampsLoaded && displayedItemsCount >= filteredStamps.length * 0.8)) && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm text-muted-foreground">Loading more...</p>
              </div>
            </div>
          )}
          {!hasMore && !isLoadingMore && filteredStamps.length > 6 && displayedItemsCount >= filteredStamps.length && (
            <div className="text-center py-4 text-muted-foreground">
              {allStampsLoaded 
                ? `All ${filteredStamps.length} stamps loaded` 
                : `Showing ${filteredStamps.length} stamps (${totalStampsCount - stamps.length} more available)`
              }
            </div>
          )}
        </div>
      )
    }
    
    if (Array.isArray(currentData)) {
      // We're at the final level - show stamps
      const displayedStamps = currentData.slice(0, displayedItemsCount)
      const hasMore = displayedItemsCount < currentData.length
      
      return (
        <div className="space-y-4">
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              : "space-y-2"
          )}>
            {displayedStamps.map(stamp => 
              viewMode === 'grid' ? renderStampCard(stamp) : renderStampList(stamp)
            )}
          </div>
          {isLoadingMore && (hasMore || (!allStampsLoaded && displayedItemsCount >= currentData.length)) && (
            <div className="text-center py-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm text-muted-foreground">Loading more...</p>
              </div>
            </div>
          )}
          {!hasMore && !isLoadingMore && currentData.length > 6 && displayedItemsCount >= currentData.length && (
            <div className="text-center py-4 text-muted-foreground">
              {allStampsLoaded 
                ? `All ${currentData.length} stamps loaded in this group` 
                : `Showing ${currentData.length} stamps in this group (more may be available)`
              }
            </div>
          )}
        </div>
      )
    }

    // We're at a group level - show groups as clickable cards
    const groupEntries = Object.entries(currentData)
    const displayedGroups = groupEntries.slice(0, displayedItemsCount)
    const hasMore = displayedItemsCount < groupEntries.length

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedGroups.map(([groupName, groupData]) => {
            const stampCount = countStampsInGroups(groupData)
            
            return (
              <Card 
                key={groupName} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
                onClick={() => navigateToGroup(groupName)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg truncate" title={groupName}>
                      {groupName}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      {stampCount} stamp{stampCount !== 1 ? 's' : ''}
                    </Badge>
                    {navigation.level < groupingLevels.length - 1 && (
                      <span className="text-xs text-muted-foreground">
                        {GROUPING_FIELDS.find(f => f.value === groupingLevels[navigation.level + 1])?.label}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {isLoadingMore && hasMore && groupEntries.length > 0 && (
          <div className="text-center py-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-muted-foreground">Loading more...</p>
            </div>
          </div>
        )}
        {!hasMore && groupEntries.length > 6 && displayedItemsCount >= groupEntries.length && (
          <div className="text-center py-4 text-muted-foreground">
            All {groupEntries.length} groups loaded
          </div>
        )}
      </div>
    )
  }

  const renderBreadcrumbs = () => {
    if (navigation.path.length === 0) return null

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigateHome() }}
              className="flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Catalog
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {navigation.path.map((segment, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === navigation.path.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigateToLevel(index + 1) }}
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  if (loading && stamps.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Controls skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2 mb-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-4 w-40" />
          </CardContent>
        </Card>

        {/* Stamps skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <LoadingStamps count={12} type="grid" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadInitialStamps}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catalog 2.0</h1>
          <p className="text-muted-foreground">Advanced stamp catalog with flexible grouping</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshDataFromAPI}
            title="Refresh data from server"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={shareCurrentURL}
            title="Share current view"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Grouping & Search Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Stamps</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, series, country, color, or denomination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grouping Levels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Grouping Hierarchy</Label>
              {groupingLevels.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGroupingLevels([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {groupingLevels.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Groups are nested from left to right. Remove levels from right to left only.
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {groupingLevels.map((level, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {/* Level indicator */}
                      <div className="flex items-center gap-1">
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold",
                          index === 0 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-primary/20 text-primary"
                        )}>
                          {index + 1}
                        </div>
                        <Badge 
                          variant={index === 0 ? "default" : "secondary"} 
                          className={cn(
                            "flex items-center gap-1 pr-1",
                            index === groupingLevels.length - 1 && "ring-2 ring-primary/20"
                          )}
                        >
                          <span className="text-xs">
                            {index === 0 ? "Root: " : "Then: "}
                          </span>
                          {GROUPING_FIELDS.find(f => f.value === level)?.label}
                          {/* Only show remove button on the last (rightmost) item */}
                          {index === groupingLevels.length - 1 && (
                            <button
                              onClick={() => removeGroupingLevel(index)}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                              title="Remove this grouping level"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      </div>
                      
                      {/* Arrow separator (except for last item) */}
                      {index < groupingLevels.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Select 
              onValueChange={(value) => addGroupingLevel(value as GroupingField)}
              value="" // Always keep the select empty/uncontrolled
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={
                  groupingLevels.length === 0 
                    ? "Select root grouping level" 
                    : `Add level ${groupingLevels.length + 1} grouping`
                } />
              </SelectTrigger>
              <SelectContent>
                {GROUPING_FIELDS.filter(field => !groupingLevels.includes(field.value)).map(field => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                    {groupingLevels.length === 0 && (
                      <span className="text-xs text-muted-foreground ml-2">(Root level)</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Quick Grouping Options */}
            {groupingLevels.length === 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Quick start with common groupings:</Label>
                <div className="flex flex-wrap gap-2">
                  {GROUPING_FIELDS.slice(0, 4).map(field => (
                    <Button
                      key={field.value}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => addGroupingLevel(field.value)}
                    >
                      {field.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Add More Grouping Options */}
            {groupingLevels.length > 0 && groupingLevels.length < GROUPING_FIELDS.length && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Quick add grouping level:</Label>
                <div className="flex flex-wrap gap-2">
                  {GROUPING_FIELDS
                    .filter(field => !groupingLevels.includes(field.value))
                    .map(field => (
                      <Button
                        key={field.value}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => addGroupingLevel(field.value)}
                      >
                        + {field.label}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Helpful explanation */}
            {groupingLevels.length === 0 && (
              <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                💡 <strong>Tip:</strong> Start with a root grouping (e.g., Country), then add nested levels (e.g., Year, then Series). 
                Stamps will be organized hierarchically based on your selection order.
              </div>
            )}
          </div>

          {/* Group Search */}
          {groupingLevels.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="groupSearch">Search Groups</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="groupSearch"
                  placeholder={`Search ${GROUPING_FIELDS.find(f => f.value === groupingLevels[0])?.label.toLowerCase() || 'groups'}...`}
                  value={groupSearchTerm}
                  onChange={(e) => setGroupSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {groupSearchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={clearGroupSearch}
                  >
                    ×
                  </Button>
                )}
              </div>
              
              {/* Quick Group Value Filters */}
              {topLevelGroups.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Quick filter by {GROUPING_FIELDS.find(f => f.value === groupingLevels[0])?.label.toLowerCase() || 'group'}:
                  </Label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {topLevelGroups.slice(0, 20).map(groupName => (
                      <Button
                        key={groupName}
                        variant={debouncedGroupSearchTerm === groupName ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7 flex-shrink-0"
                        onClick={() => setQuickGroupFilter(groupName)}
                      >
                        {groupName}
                      </Button>
                    ))}
                    {topLevelGroups.length > 20 && (
                      <div className="text-xs text-muted-foreground flex items-center px-2 py-1 bg-muted/50 rounded">
                        +{topLevelGroups.length - 20} more
                      </div>
                    )}
                  </div>
                  {debouncedGroupSearchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 text-muted-foreground hover:text-foreground"
                      onClick={clearGroupSearch}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Found {filteredStamps.length} stamps
            {!allStampsLoaded && ` (${stamps.length} of ${totalStampsCount} loaded)`}
            {debouncedGroupSearchTerm && ` • Showing ${filteredStampsCount} stamps in groups matching "${debouncedGroupSearchTerm}"`}
            {(debouncedSearchTerm.trim() !== '' || groupingLevels.length > 0) && !allStampsLoaded && (
              <span className="text-orange-600 font-medium">
                {" • Loading complete dataset for accurate results..."}
              </span>
            )}
            {searchTerm !== debouncedSearchTerm && searchTerm.trim() !== '' && (
              <span className="text-blue-600 font-medium">
                {" • Typing..."}
              </span>
            )}
          </div>
          

        </CardContent>
      </Card>

      {/* Grouped Stamps */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>
              {groupingLevels.length === 0 ? 'All Stamps' :
               navigation.level === 0 ? 'All Groups' : 
               navigation.level >= groupingLevels.length ? 'Stamps' :
               `${GROUPING_FIELDS.find(f => f.value === groupingLevels[navigation.level])?.label || 'Groups'}`}
            </CardTitle>
            {navigation.level > 0 && (
              <Button variant="outline" size="sm" onClick={navigateBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          {renderBreadcrumbs()}
        </CardHeader>
        <CardContent className="p-6">
          {loading && (debouncedSearchTerm.trim() !== '' || groupingLevels.length > 0) && !allStampsLoaded ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-muted-foreground">Loading complete dataset...</p>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Search className="h-4 w-4" />
                      <span>Ensuring accurate search results</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Show skeleton while loading */}
              <LoadingStamps 
                count={6} 
                type={groupingLevels.length === 0 ? viewMode : 
                      Array.isArray(getCurrentLevelData) ? viewMode : 'groups'} 
              />
            </div>
          ) : filteredStamps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No stamps found</p>
            </div>
                      ) : Object.keys(filteredGroups).length === 0 && debouncedGroupSearchTerm ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No groups found matching "{debouncedGroupSearchTerm}"</p>
              <Button variant="outline" className="mt-2" onClick={clearGroupSearch}>
                Clear group search
              </Button>
            </div>
          ) : (
            renderCurrentLevel()
          )}
        </CardContent>
      </Card>


    </div>
  )
}

// Loading component for the Suspense fallback
function Catalog2Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Catalog2Page() {
  return (
    <Suspense fallback={<Catalog2Loading />}>
      <Catalog2Content />
    </Suspense>
  )
} 