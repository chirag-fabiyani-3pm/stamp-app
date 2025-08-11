"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { ChevronRight, Search, Filter, Grid, List, ArrowLeft, Home, Share2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  ConnectionMode,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import dagre from 'dagre'

import { StampDetailsModal } from "./stamp-details-modal"
import { StampCardSkeleton, StampListSkeleton, GroupCardSkeleton, LoadingStamps } from "./loading-skeletons"
import { GroupNode } from "./group-node"
import { StampNode } from "./stamp-node"

import {
  StampData,
  GroupedStamps,
  GroupingField,
  NavigationState,
} from "@/types/catalog"

import {
  openDB,
  saveStampsToIndexedDB,
  getStampsFromIndexedDB,
  getPaginatedStampsFromIndexedDB,
  getTotalStampsCountFromIndexedDB,
  clearIndexedDB,
  checkIndexedDBEmpty,
  recreateIndexedDB
} from "@/lib/data/investigate-search-db"

import {
  mapApiStampToStampData,
  fetchAllStampsFromAPI
} from "@/lib/api/investigate-search-api"
import { apiStampData, convertApiStampToStampData } from "@/lib/data/catalog-data"
import { Skeleton } from "@/components/ui/skeleton"


// Override ReactFlow default styles to match theme
const reactFlowStyles = `
  .react-flow__node-default,
  .react-flow__node-input,
  .react-flow__node-output,
  .react-flow__node-group {
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    width: auto !important;
  }
  
  .react-flow__node {
    border: none !important;
  }
  
  /* Background styling to match theme */
  .react-flow__renderer {
    background: hsl(var(--background)) !important;
  }
  
  .react-flow__background {
    background: hsl(var(--background)) !important;
  }
  
  /* SVG Gradient Definitions */
  .react-flow svg defs {
    position: absolute;
  }
  
  /* Edge styling for elegance */
  .react-flow__edge {
    z-index: 1000 !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .react-flow__edge-path {
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  
  /* Group connection edges - elegant gradient flow */
  .react-flow__edge.group-connection .react-flow__edge-path {
    stroke: url(#group-gradient) !important;
    stroke-width: 3px;
    opacity: 0.95;
    filter: drop-shadow(0 4px 16px rgba(249, 115, 22, 0.2)) drop-shadow(0 0 8px rgba(249, 115, 22, 0.1));
  }
  
  /* Stamp connection edges - subtle dotted elegance */
  .react-flow__edge.stamp-connection .react-flow__edge-path {
    stroke: url(#stamp-gradient) !important;
    stroke-width: 2.5px;
    stroke-dasharray: 10 5;
    opacity: 0.85;
    filter: drop-shadow(0 3px 12px rgba(100, 116, 139, 0.15)) drop-shadow(0 0 6px rgba(100, 116, 139, 0.08));
    animation: dash 3s linear infinite;
  }
  
  /* Hover effects */
  .react-flow__edge:hover .react-flow__edge-path {
    filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.2));
    transform: scale(1.02);
    stroke-width: 4px !important;
  }
  
  .react-flow__edge.group-connection:hover .react-flow__edge-path {
    filter: drop-shadow(0 6px 24px rgba(249, 115, 22, 0.4)) drop-shadow(0 0 16px rgba(249, 115, 22, 0.3));
    stroke: url(#group-gradient-hover) !important;
    stroke-width: 4px !important;
    animation: breathe 2s ease-in-out infinite;
  }
  
  .react-flow__edge.stamp-connection:hover .react-flow__edge-path {
    filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.2));
    stroke: url(#stamp-gradient-hover) !important;
    stroke-width: 3px !important;
    stroke-dasharray: 14 7;
    animation: dash 1.2s linear infinite, breathe 2.5s ease-in-out infinite;
  }
  
  /* Selected state */
  .react-flow__edge.selected .react-flow__edge-path {
    stroke: url(#selected-gradient) !important;
    stroke-width: 5px !important;
    opacity: 1 !important;
    filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.2));
    animation: pulse 2s ease-in-out infinite;
  }
  
  /* Keyframe animations */
  @keyframes dash {
    to {
      stroke-dashoffset: -24;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.2));
    }
    50% {
      filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3));
    }
  }
  
  @keyframes breathe {
    0%, 100% {
      opacity: 0.9;
    }
    50% {
      opacity: 1;
    }
  }
  
  /* Edge markers (arrows) */
  .react-flow__edge .react-flow__edge-path {
    marker-end: url(#elegant-arrow);
  }
  
  .react-flow__edge.group-connection .react-flow__edge-path {
    marker-end: url(#group-arrow);
  }
  
  .react-flow__edge.stamp-connection .react-flow__edge-path {
    marker-end: url(#stamp-arrow);
  }
  
  /* Controls styling */
  .react-flow__controls {
    background: hsl(var(--card)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: var(--radius) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .react-flow__controls-button {
    background: hsl(var(--card)) !important;
    border: none !important;
    color: hsl(var(--foreground)) !important;
    transition: all 0.2s ease;
  }
  
  .react-flow__controls-button:hover {
    background: hsl(var(--accent)) !important;
    transform: scale(1.05);
  }
  
  /* Minimap styling */
  .react-flow__minimap {
    background: hsl(var(--card)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: var(--radius) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

// Central registry of grouping options with display labels and accessors.
// Add to this list to enable new grouping dimensions from the new API response shape.
const GROUPING_FIELDS: { value: GroupingField; label: string; accessor: (s: StampData) => string }[] = [
  { value: 'seriesName', label: 'Series Name', accessor: (s) => s.seriesName || 'Unknown Series' },
  { value: 'issueYear', label: 'Issue Year', accessor: (s) => (s.issueYear != null ? String(s.issueYear) : 'Unknown Year') },
  { value: 'country', label: 'Country', accessor: (s) => s.country || 'Unknown Country' },
  { value: 'color', label: 'Color', accessor: (s) => s.color || 'Unknown Color' },
  { value: 'paperType', label: 'Paper Type', accessor: (s) => s.paperType || 'Unknown Paper Type' },
  { value: 'denomination', label: 'Denomination', accessor: (s) => s.denominationValue ? `${s.denominationValue}${s.denominationSymbol || ''}` : 'Unknown Denomination' },
  // Back-compat alias
  { value: 'publisher', label: 'Publisher', accessor: (s) => s.publisher || 'Unknown Publisher' },
  // Additional groupings leveraging richer apiStampData → StampData mapping
  { value: 'catalogName', label: 'Catalog Name', accessor: (s) => s.catalogName || 'Unknown Catalog' },
  { value: 'stampGroupId', label: 'Stamp Group', accessor: (s) => s.stampGroupId || 'Unknown Group' },
  { value: 'countryCode', label: 'Country Code', accessor: (s) => s.countryCode || 'Unknown Country' },
  { value: 'denominationCurrency', label: 'Currency Code', accessor: (s) => s.denominationCurrency || 'Unknown Currency' },
  { value: 'denominationSymbol', label: 'Currency Symbol', accessor: (s) => s.denominationSymbol || 'Unknown Symbol' },
  { value: 'rarity', label: 'Rarity', accessor: (s) => s.rarity || 'Unknown' },
  { value: 'condition', label: 'Condition', accessor: (s) => s.condition || 'Unknown' },
  // Extracted from stampDetailsJson
  { value: 'perforation', label: 'Perforation', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.perforation || 'Unknown'; } catch { return 'Unknown'; }
    }
  },
  { value: 'watermark', label: 'Watermark', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.watermark || 'Unknown'; } catch { return 'Unknown'; }
    }
  },
  { value: 'printingMethod', label: 'Printing Method', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.printingMethod || 'Unknown'; } catch { return 'Unknown'; }
    }
  },
  { value: 'designer', label: 'Designer', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.designer || 'Unknown'; } catch { return 'Unknown'; }
    }
  },
  { value: 'postalHistoryType', label: 'Postal History Type', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.postalHistoryType || 'Unknown'; } catch { return 'Unknown'; }
    }
  },
  { value: 'errorType', label: 'Error Type', accessor: (s) => {
      try { const d = JSON.parse(s.stampDetailsJson); return d.errorType || 'None'; } catch { return 'Unknown'; }
    }
  },
]

export function CatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Inject custom styles to override ReactFlow defaults
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = reactFlowStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  
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
  
  // Modal state for stamp details
  const [selectedStamp, setSelectedStamp] = useState<StampData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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
    // Start from existing params (if preserving), otherwise fresh
    const params = preserveOtherParams
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()

    // Path
    if (newPath.length > 0) {
      params.set('path', encodeURIComponent(newPath.join(',')))
    } else {
      params.delete('path')
    }

    // Controlled params
    if (searchTerm) params.set('search', searchTerm); else params.delete('search')
    if (groupSearchTerm) params.set('groupSearch', groupSearchTerm); else params.delete('groupSearch')
    if (viewMode !== 'grid') params.set('view', viewMode); else params.delete('view')
    if (groupingLevels.length > 0) params.set('grouping', groupingLevels.join(',')); else params.delete('grouping')

    const newQuery = params.toString()
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : `${window.location.pathname}`
    const currentUrl = `${window.location.pathname}${window.location.search}`

    // Avoid pushing same URL to prevent loops
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }

  // Update URL when other parameters change
  const updateURLParams = () => {
    updateURL(navigation.path, true)
  }

  // Initialize IndexedDB with real API data if empty (now handled at ModernCatalog level)
  const initializeIndexedDB = async () => {
    try {
      const isEmpty = await checkIndexedDBEmpty()
      if (isEmpty) {
        // If empty here, still seed to keep investigate-search standalone-safe
        const seeded = apiStampData.map(convertApiStampToStampData)
        await saveStampsToIndexedDB(seeded)
        toast({
          title: "Database Initialized",
          description: `Loaded ${seeded.length} stamps into local database`,
        })
      }
    } catch (error) {
      console.error('Error initializing IndexedDB:', error)
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
      // Try to get total count first
      const totalCount = await getTotalStampsCountFromIndexedDB()
      setTotalStampsCount(totalCount)
      
      if (totalCount > 0) {
        // Load first page from IndexedDB
        const { stamps: initialStamps, hasMore } = await getPaginatedStampsFromIndexedDB(0, INDEXEDDB_PAGE_SIZE)
        setStamps(initialStamps)
        setCurrentOffset(INDEXEDDB_PAGE_SIZE)
        setAllStampsLoaded(!hasMore)
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
    try {
      // Use local example apiStampData immediately
      const localStamps = apiStampData.map(convertApiStampToStampData)
      setStamps(localStamps)
      setTotalStampsCount(localStamps.length)
      setAllStampsLoaded(true)
      // Persist into IndexedDB for subsequent paginated loads
      await saveStampsToIndexedDB(localStamps)
    } catch (error) {
      console.error('Error loading local apiStampData:', error)
      setStamps([])
      setTotalStampsCount(0)
      setAllStampsLoaded(true)
      setError('Unable to load local catalog data')
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
        // Find accessor for the current grouping field, fallback to dynamic property access
        const gf = GROUPING_FIELDS.find(f => f.value === currentLevel)
        const groupKey = gf
          ? gf.accessor(stamp)
          : String((stamp as any)[currentLevel] ?? 'Unknown')

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
  const countStampsInGroups = (groups: GroupedStamps | StampData[], visited = new Set()): number => {
    // Prevent infinite recursion with circular references
    if (visited.has(groups)) {
      return 0
    }
    visited.add(groups)
    
    if (Array.isArray(groups)) {
      return groups.length
    }
    
    // Check if groups is a valid object
    if (!groups || typeof groups !== 'object') {
      return 0
    }
    
    return Object.values(groups).reduce((total, value) => {
      // Ensure value exists and is valid before recursing
      if (value == null) {
        return total
      }
      return total + countStampsInGroups(value, visited)
    }, 0)
  }

  const filteredStampsCount = useMemo(() => {
    try {
      return countStampsInGroups(filteredGroups)
    } catch (error) {
      console.error('Error counting stamps in groups:', error)
      return 0
    }
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
          
          // Load all stamps from IndexedDB
          const allStamps = await getStampsFromIndexedDB()
          if (allStamps.length > 0) {
            setStamps(allStamps)
            setAllStampsLoaded(true)
            setCurrentOffset(allStamps.length)
            setTotalStampsCount(allStamps.length)
            
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
      } else if (viewMode === 'list' && navigation.level === 0) {
        // Hierarchical view - showing groups at root level
        const groupEntries = Object.entries(currentLevelData as GroupedStamps)
        currentTotalCount = groupEntries.length
        needsMoreFromDB = false // Groups are already computed from loaded data
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
  }, [isLoadingMore, filteredStamps.length, displayedItemsCount, allStampsLoaded, loadMoreStamps, groupingLevels, filteredGroups, navigation.path, viewMode, navigation.level])

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
          title: 'Investigate Search - Stamp Collection',
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
      const next = [...groupingLevels, field]
      setGroupingLevels(next)
      // Reset navigation when grouping changes and sync URL only if changed
      updateURL([], true)
    }
  }

  const removeGroupingLevel = (index: number) => {
    const newLevels = groupingLevels.filter((_, i) => i !== index)
    setGroupingLevels(newLevels)
    // Reset navigation when grouping changes and sync URL only if changed
    updateURL([], true)
    if (newLevels.length === 0 && viewMode === 'list') {
      setViewMode('grid')
    }
  }

  const formatDenomination = (value: number, symbol: string) => {
    return value ? `${value}${symbol || ''}` : 'N/A'
  }

  const handleStampClick = (stamp: StampData) => {
    setSelectedStamp(stamp)
    setIsModalOpen(true)
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

   

  // Function to create tree layout using dagre
  const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    
    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({ 
      rankdir: 'TB', // Top to Bottom
      ranksep: 120,  // Increased vertical spacing between ranks
      nodesep: 80,   // Increased horizontal spacing between nodes
      marginx: 60,
      marginy: 60,
      edgesep: 20,   // Space between edges
      ranker: 'longest-path' // Better edge routing
    })

    nodes.forEach((node) => {
      g.setNode(node.id, { width: 250, height: 100 })
    })

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target)
    })

    dagre.layout(g)

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id)
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - (node.type === 'stamp' ? 125 : 60),
          y: nodeWithPosition.y - 50,
        },
      }
    })

    return { nodes: layoutedNodes, edges }
  }

  // Function to convert grouped data to xyflow nodes and edges
  const createTreeFromData = (data: GroupedStamps | StampData[], parentId: string | null = null, level: number = 0, visited = new Set(), maxDepth = 10): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Prevent infinite recursion
    if (level >= maxDepth) {
      console.warn(`Maximum tree depth (${maxDepth}) reached, stopping recursion`)
      return { nodes, edges }
    }

    // Prevent circular references
    if (visited.has(data)) {
      console.warn('Circular reference detected in tree data, stopping recursion')
      return { nodes, edges }
    }
    visited.add(data)

    // Validate data
    if (!data || (typeof data !== 'object')) {
      console.warn('Invalid data provided to createTreeFromData:', data)
      return { nodes, edges }
    }

    if (Array.isArray(data)) {
      // This is an array of stamps
      data.forEach((stamp, index) => {
        const nodeId = `stamp-${stamp.id}`
        nodes.push({
          id: nodeId,
          type: 'stamp',
          position: { x: 0, y: 0 }, // Will be set by layout
          data: { stamp, level, onStampClick: handleStampClick },
        })

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${nodeId}`,
            source: parentId,
            sourceHandle: 'bottom',
            target: nodeId,
            targetHandle: 'top',
            className: 'stamp-connection',
            style: { 
              stroke: 'url(#stamp-gradient)',
              strokeWidth: 2,
              strokeOpacity: 0.8,
            },
            animated: false,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
              color: '#64748b',
            }
          })
        }
      })
    } else {
      // This is a grouped object
      const entries = Object.entries(data)
      
      // Validate grouping levels to prevent infinite recursion
      if (level >= groupingLevels.length) {
        console.warn(`Level ${level} exceeds available grouping levels (${groupingLevels.length}), treating as stamps`)
        // If we've exceeded grouping levels, treat any remaining data as stamps
        return { nodes, edges }
      }
      
      const groupingField = groupingLevels[level]
      const fieldLabel = GROUPING_FIELDS.find(f => f.value === groupingField)?.label || 'Group'
      
      // Prevent processing too many groups at once to avoid stack overflow
      if (entries.length > 100) {
        console.warn(`Too many groups (${entries.length}) at level ${level}, limiting to first 100`)
        entries.splice(100)
      }

      entries.forEach(([groupName, groupData]) => {
        // Validate group data before processing
        if (!groupData || (!Array.isArray(groupData) && typeof groupData !== 'object')) {
          console.warn(`Invalid group data for "${groupName}":`, groupData)
          return // Skip this group
        }
        
        // Ensure we don't have empty group names that could cause issues
        if (!groupName || groupName.trim() === '') {
          console.warn('Empty group name detected, skipping')
          return
        }
        
        const nodeId = `group-${level}-${groupName.replace(/[^a-zA-Z0-9]/g, '_')}-${Math.random()}`
        const stampCount = (() => {
          try {
            return countStampsInGroups(groupData)
          } catch (error) {
            console.error('Error counting stamps in createTreeFromData:', error)
            return 0
          }
        })()
        
        nodes.push({
          id: nodeId,
          type: 'group',
          position: { x: 0, y: 0 }, // Will be set by layout
          data: { 
            name: groupName, 
            count: stampCount, 
            level, 
            fieldLabel 
          },
        })

        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${nodeId}`,
            source: parentId,
            sourceHandle: 'bottom',
            target: nodeId,
            targetHandle: 'top',
            className: 'group-connection',
            style: { 
              stroke: 'url(#group-gradient)',
              strokeWidth: 3,
              strokeOpacity: 0.9
            },
            animated: false,
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#f97316',
            }
          })
        }

        // Recursively create child nodes
        const childResult = createTreeFromData(groupData, nodeId, level + 1, new Set(visited), maxDepth)
        nodes.push(...childResult.nodes)
        edges.push(...childResult.edges)
      })
    }

    // Clean up visited set for this level
    visited.delete(data)

    return { nodes, edges }
  }

  // Render tree view for a specific group's hierarchy
  const renderTreeForGroup = (groupData: GroupedStamps | StampData[], groupName: string) => {
    // Create root node for this group
    const rootNodeId = `root-${groupName}`
    const rootNode: Node = {
      id: rootNodeId,
      type: 'group',
      position: { x: 0, y: 0 },
      data: {
        name: groupName,
        count: (() => {
          try {
            return countStampsInGroups(groupData)
          } catch (error) {
            console.error('Error counting stamps in renderTreeForGroup:', error)
            return 0
          }
        })(),
        level: 0,
        fieldLabel: GROUPING_FIELDS.find(f => f.value === groupingLevels[0])?.label || 'Root'
      },
    }
    
    // Create tree structure for this specific group
    let treeData: { nodes: Node[], edges: Edge[] }
    try {
      treeData = createTreeFromData(groupData, rootNodeId, 1) // Start from level 1 since root is the accordion
    } catch (error) {
      console.error('Error creating tree data:', error)
      // Return early with just the stamps if tree creation fails
      if (Array.isArray(groupData)) {
        return (
          <div className="space-y-2 p-4">
            {groupData.map(stamp => (
              <div 
                key={stamp.id}
                className="group cursor-pointer transition-all duration-200 hover:bg-muted/30 rounded-lg p-3 border border-muted/50 hover:border-primary/30"
                onClick={() => handleStampClick(stamp)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 relative flex-shrink-0 bg-muted/10 rounded overflow-hidden">
                    <Image
                      src={stamp.stampImageUrl || "/placeholder.svg"}
                      alt={stamp.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1 text-foreground truncate" title={stamp.name}>
                      {stamp.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-1 py-0.5 h-auto">
                        {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                      </Badge>
                      <span>{stamp.issueYear || 'Unknown'}</span>
                      <span>#{stamp.catalogNumber}</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      // If not an array, return error message
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Unable to render tree view for this group</p>
          <p className="text-xs mt-1">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      )
    }
    
    // If no sub-structure, just show stamps
    if (Array.isArray(groupData)) {
      return (
        <div className="space-y-2 p-4">
          {groupData.map(stamp => (
            <div 
              key={stamp.id}
              className="group cursor-pointer transition-all duration-200 hover:bg-muted/30 rounded-lg p-3 border border-muted/50 hover:border-primary/30"
              onClick={() => handleStampClick(stamp)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 relative flex-shrink-0 bg-muted/10 rounded overflow-hidden">
                  <Image
                    src={stamp.stampImageUrl || "/placeholder.svg"}
                    alt={stamp.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight mb-1 text-foreground truncate" title={stamp.name}>
                    {stamp.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs px-1 py-0.5 h-auto">
                      {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                    </Badge>
                    <span>{stamp.issueYear || 'Unknown'}</span>
                    <span>#{stamp.catalogNumber}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Apply layout for tree visualization including root node
    const allNodes = [rootNode, ...treeData.nodes]
    const allEdges = treeData.edges
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(allNodes, allEdges)

    return (
      <div className="h-[400px] w-full">
        <ReactFlow
          nodes={layoutedNodes}
          edges={layoutedEdges}
          nodeTypes={{ group: GroupNode, stamp: StampNode }}
          connectionMode={ConnectionMode.Strict}
          fitView
          attributionPosition="bottom-left"
          className="bg-background"
          panOnDrag={true}
          zoomOnScroll={true}
          minZoom={0.5}
          maxZoom={2}
          defaultEdgeOptions={{
            style: { 
              strokeWidth: 2,
              strokeOpacity: 1
            },
            type: 'smoothstep'
          }}
        >
          {/* SVG Gradient Definitions */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              {/* Group connection gradients */}
              <linearGradient id="group-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fdba74" stopOpacity="0.7" />
              </linearGradient>
              
              <linearGradient id="group-gradient-hover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="1" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8" />
              </linearGradient>
              
              {/* Stamp connection gradients */}
              <linearGradient id="stamp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.6" />
              </linearGradient>
              
              <linearGradient id="stamp-gradient-hover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.7" />
              </linearGradient>
              
              {/* Selected edge gradient */}
              <linearGradient id="selected-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="1" />
                <stop offset="25%" stopColor="#94a3b8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#e2e8f0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="1" />
              </linearGradient>
              
              {/* Custom arrow markers */}
              <marker id="group-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0,0 0,6 9,3" fill="url(#group-gradient)" stroke="none" />
              </marker>
              
              <marker id="stamp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0,0 0,6 7,3" fill="url(#stamp-gradient)" stroke="none" />
              </marker>
              
              <marker id="elegant-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <polygon points="0,0 0,6 9,3" fill="#64748b" stroke="none" />
              </marker>
            </defs>
          </svg>
          
          <Background 
            color="hsl(214.3 31.8% 91.4%)" 
            size={1} 
          />
          <Controls 
            className="bg-background border border-muted rounded-lg shadow-sm" 
            showInteractive={false}
          />
        </ReactFlow>
        
        {/* Debug info */}
        <div className="mt-2 p-2 bg-gray-100 text-xs">
          <div>Nodes: {layoutedNodes.length}</div>
          <div>Edges: {layoutedEdges.length}</div>
          <div>Sample edge: {layoutedEdges[0] ? `${layoutedEdges[0].source} → ${layoutedEdges[0].target}` : 'None'}</div>
        </div>
      </div>
    )
  }

  // Main hierarchical accordion view with pagination
  const renderHierarchicalAccordionView = () => {
    const currentData = getCurrentLevelData
    
    // If no grouping levels, show message
    if (groupingLevels.length === 0) {
      return (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Hierarchical view is available when grouping levels are configured.
            </p>
            <p className="text-sm text-muted-foreground">
              Please add grouping levels to see the tree visualization.
            </p>
          </div>
        </div>
      )
    }

    // Get root level groups with pagination
    const groupEntries = Object.entries(currentData as GroupedStamps)
    const displayedGroups = groupEntries.slice(0, displayedItemsCount)
    const hasMoreGroups = displayedItemsCount < groupEntries.length
    const rootFieldLabel = GROUPING_FIELDS.find(f => f.value === groupingLevels[0])?.label || 'Groups'
    
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/20 rounded-lg border border-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="font-medium">Hierarchical Tree View</span>
          </div>
          <p>
            Showing {displayedGroups.length} of {groupEntries.length} {rootFieldLabel.toLowerCase()} organized by{' '}
            <span className="font-medium">
              {groupingLevels.map((field) => (
                GROUPING_FIELDS.find(f => f.value === field)?.label || field
              )).join(' → ')}
            </span>
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-3">
          {displayedGroups.map(([groupName, groupData]) => {
            const stampCount = (() => {
              try {
                return countStampsInGroups(groupData)
              } catch (error) {
                console.error('Error counting stamps in renderHierarchicalAccordionView:', error)
                return 0
              }
            })()
            
            return (
              <AccordionItem 
                key={groupName} 
                value={groupName}
                className="border border-muted/50 rounded-lg shadow-sm bg-background hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 rounded-t-lg data-[state=open]:rounded-b-none">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/70"></div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base text-foreground" title={groupName}>
                          {groupName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {rootFieldLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-sm font-medium bg-primary/10 text-primary border-primary/20">
                        {stampCount} stamp{stampCount !== 1 ? 's' : ''}
                      </Badge>
                      {groupingLevels.length > 1 && (
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border">
                          {GROUPING_FIELDS.find(f => f.value === groupingLevels[1])?.label} Tree
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <div className="border-t border-muted/30">
                    {renderTreeForGroup(groupData, groupName)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
        
        {/* Loading more accordions */}
        {isLoadingMore && hasMoreGroups && (
          <div className="text-center py-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-muted-foreground">Loading more groups...</p>
            </div>
          </div>
        )}
        
        {/* Show completion message */}
        {!hasMoreGroups && !isLoadingMore && groupEntries.length > 6 && displayedGroups.length >= groupEntries.length && (
          <div className="text-center py-4 text-muted-foreground">
            All {groupEntries.length} groups loaded
          </div>
        )}
        
        {groupEntries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No groups found
          </div>
        )}
      </div>
    )
  }



  const renderCurrentLevel = () => {
    // Use hierarchical accordion tree view when viewMode is 'list' and we have grouping levels
    if (viewMode === 'list' && groupingLevels.length > 0) {
      return renderHierarchicalAccordionView()
    }

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
            const stampCount = (() => {
              try {
                return countStampsInGroups(groupData)
              } catch (error) {
                console.error('Error counting stamps in renderCurrentLevel:', error)
                return 0
              }
            })()
            
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
      <Breadcrumb className="mb-4 bg-white px-4 py-2 rounded-lg shadow">
        <BreadcrumbList>
          {/* Home / Catalog */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => { e.preventDefault(); navigateHome() }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              <Home className="h-4 w-4 mr-1" />
              Catalog
            </BreadcrumbLink>
          </BreadcrumbItem>
  
          {navigation.path.map((segment, i) => {
            const isLast = i === navigation.path.length - 1
  
            return (
              <BreadcrumbItem key={i} className="flex items-center">
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </BreadcrumbSeparator>
  
                {isLast ? (
                  <BreadcrumbPage className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary text-white">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigateToLevel(i + 1) }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            )
          })}
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
          <h1 className="text-3xl font-bold">Investigate Search</h1>
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
            onClick={() => {
              setViewMode('grid')
            }}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              setViewMode('list')
            }}
            disabled={groupingLevels.length === 0}
            title={groupingLevels.length === 0 ? "List view requires grouping levels" : "Switch to hierarchical tree view"}
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
                    <>
                    <div key={index} className="flex items-center gap-2">
                      {/* Level indicator */}
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
                    </>
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

      {/* Stamp Details Modal */}
      <StampDetailsModal selectedStamp={selectedStamp} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
} 
