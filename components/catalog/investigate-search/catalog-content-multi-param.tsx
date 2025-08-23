// Alternative implementation using multiple query parameters
// This shows how to implement the multi-parameter approach

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Multi-parameter approach functions
const encodePathMultiParam = (path: string[]): string => {
  const params = new URLSearchParams()

  path.forEach((segment, index) => {
    params.set(`path${index + 1}`, encodeURIComponent(segment))
  })

  return params.toString()
}

const decodePathMultiParam = (queryString: string): string[] => {
  const params = new URLSearchParams(queryString)
  const pathSegments: string[] = []

  // Find all parameters starting with "path"
  const pathParams: { index: number; value: string }[] = []
  for (const [key, value] of params.entries()) {
    if (key.startsWith('path')) {
      const index = parseInt(key.replace('path', ''))
      if (!isNaN(index)) {
        pathParams.push({ index, value: decodeURIComponent(value) })
      }
    }
  }

  // Sort by index and extract values
  pathParams.sort((a, b) => a.index - b.index)
  return pathParams.map(item => item.value)
}

// Example usage in component
export function CatalogContentMultiParam() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get navigation state using multi-parameter approach
  const navigation = useMemo(() => {
    const currentQuery = searchParams.toString()
    const path = decodePathMultiParam(currentQuery)
    return {
      path,
      level: path.length
    }
  }, [searchParams])

  // Update URL using multi-parameter approach
  const updateURL = (newPath: string[], preserveOtherParams: boolean = true) => {
    // Start from existing params (if preserving), otherwise fresh
    const params = preserveOtherParams
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams()

    // Remove old path parameters
    for (const key of params.keys()) {
      if (key.startsWith('path')) {
        params.delete(key)
      }
    }

    // Add new path parameters
    newPath.forEach((segment, index) => {
      params.set(`path${index + 1}`, encodeURIComponent(segment))
    })

    // Controlled params (same as before)
    // ... rest of your existing parameter handling

    const newQuery = params.toString()
    const newUrl = newQuery ? `${window.location.pathname}?${newQuery}` : `${window.location.pathname}`
    const currentUrl = `${window.location.pathname}${window.location.search}`

    // Avoid pushing same URL to prevent loops
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }

  // Navigation functions remain the same
  const navigateToGroup = (groupName: string) => {
    const newPath = [...navigation.path, groupName]
    updateURL(newPath)
  }

  const navigateToLevel = (level: number) => {
    const newPath = navigation.path.slice(0, level)
    updateURL(newPath)
  }

  // The rest of your component remains the same...

  return (
    <div>
      {/* Your existing JSX */}
    </div>
  )
}

// Helper function to check if URL length might be an issue
export const checkURLLength = (path: string[]): boolean => {
  const encoded = encodePathMultiParam(path)
  const fullUrl = `${window.location.origin}${window.location.pathname}?${encoded}`

  // Most browsers support URLs up to 2048 characters
  const MAX_URL_LENGTH = 2048
  return fullUrl.length > MAX_URL_LENGTH
}

// Example of how to handle long URLs
export const navigateWithLengthCheck = (path: string[], router: any) => {
  if (checkURLLength(path)) {
    console.warn('URL might be too long, consider using fewer path segments or alternative storage')
    // Could fall back to localStorage/sessionStorage or show a warning
  }

  const encoded = encodePathMultiParam(path)
  router.push(`?${encoded}`)
}
