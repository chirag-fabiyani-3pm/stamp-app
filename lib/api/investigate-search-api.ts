import { ApiStampData, ApiResponse, StampData } from '@/types/catalog'

// Map API response to StampData format
export const mapApiStampToStampData = (apiStamp: ApiStampData): StampData => {
  return {
    id: apiStamp.id,
    stampId: apiStamp.stampId,
    parentStampId: apiStamp.parentStampId,
    isInstance: apiStamp.instances && apiStamp.instances.length > 0, // True if instances exist
    status: 1, // Default to active
    stampCatalogId: apiStamp.catalogExtractionProcessId || null,
    name: apiStamp.name,
    publisher: apiStamp.publisher,
    country: apiStamp.country,
    stampImageUrl: apiStamp.stampImageUrl,
    catalogName: apiStamp.catalogName || null,
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
    countryCode: apiStamp.countryCode || '',
    story: apiStamp.story || '',
    stampGroupName: apiStamp.stampGroupName || '',
    instances: apiStamp.instances || [],
    mintValue: null, // Default to null, as it's not directly in ApiStampData
    finestUsedValue: null, // Default to null
    usedValue: null, // Default to null
    rarity: undefined, // Default to undefined
    condition: undefined, // Default to undefined
    typeName: '', // Default to empty string
    categoryCode: '', // Default to empty string
  }
}

// Fetch all stamps from API with pagination
export const fetchAllStampsFromAPI = async (jwt: string): Promise<StampData[]> => {
  const allStamps: StampData[] = []
  let currentPage = 1
  let hasMorePages = true
  const maxPageSize = 200 // Use maximum allowed page size for efficiency

  try {
    while (hasMorePages) {
      
      const url = new URL('https://decoded-app-stamp-api-dev.azurewebsites.net/api/v1/StampCatalog')
      url.searchParams.append('pageNumber', currentPage.toString())
      url.searchParams.append('pageSize', maxPageSize.toString())
      
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 204) {
          break
        }
        const errorText = await response.text()
        console.error(`API error response:`, errorText)
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const data: ApiResponse = await response.json()
      
      if (data.items && data.items.length > 0) {
        const mappedStamps = data.items.map(mapApiStampToStampData)
        allStamps.push(...mappedStamps)
        
        // Check if there are more pages
        hasMorePages = data.hasNextPage && currentPage < data.totalPages
        currentPage++
      } else {
        hasMorePages = false
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return allStamps
  } catch (error) {
    throw error
  }
} 