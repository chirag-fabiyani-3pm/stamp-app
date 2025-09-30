export type StampMasterCatalogItem = {
  id: string
  catalogExtractionProcessId: string
  similarityScore: number
  stampId: string
  isInstance: boolean
  parentStampId: string
  catalogNumber: string
  name: string
  description: string
  country: string
  countryName: string
  seriesName: string
  typeName: string
  stampGroupName: string
  subCategoryCode: string
  categoryCode: string
  currencyCode: string
  currencyName: string
  currencySymbol: string
  denominationValue: string
  denominationSymbol: string
  denominationDisplay: string
  colorCode: string
  colorName: string
  colorHex: string
  colorGroup: string
  paperCode: string
  paperName: string
  paperOrientation: string
  watermarkCode: string
  watermarkName: string
  watermarkPosition: string
  perforationCode: string
  perforationName: string
  perforationMeasurement: string
  itemTypeCode: string
  itemTypeName: string
  issueDate: string
  issueYear: number
  periodStart: number
  periodEnd: number
  printingMethod: string
  printer: string
  engraver: string
  gumCondition: string
  sizeWidth: string
  sizeHeight: string
  stampImageUrl: string
  stampImageHighRes: string
  watermarkImageUrl: string
  perforationImageUrl: string
  rarityRating: string
  rarityScale: string
  rarityScore: number
  historicalSignificance: string
  bibliography: string
  specialNotes: string
  mintValue: number
  usedValue: number
  finestUsedValue: number
}

type StampMasterCatalogResponse = {
  items: StampMasterCatalogItem[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const BASE_URL = 'https://decoded-app-stamp-api-dev.azurewebsites.net/api/v1/StampMasterCatalog/Published'
const JWT_COOKIE_NAME = 'jwt'

export async function fetchStampMasterCatalogPage(params: { pageNumber: number, pageSize: number, catalogExtractionProcessId: string, jwt?: string }): Promise<StampMasterCatalogResponse> {
  const url = new URL(BASE_URL)
  url.searchParams.set('pageNumber', String(params.pageNumber))
  url.searchParams.set('pageSize', String(params.pageSize))
  url.searchParams.set('catalogExtractionProcessId', params.catalogExtractionProcessId)

  const headers: Record<string, string> = {}
  if (params.jwt) headers['Authorization'] = `Bearer ${params.jwt}`
  const res = await fetch(url.toString(), { method: 'GET', headers })
  if (!res.ok) {
    throw new Error(`Failed to fetch catalog page ${params.pageNumber}: ${res.status}`)
  }
  return res.json()
}

export async function fetchStampMasterCatalogAll(catalogExtractionProcessId: string, pageSize = 200, jwt?: string): Promise<StampMasterCatalogItem[]> {
  let pageNumber = 1
  const all: StampMasterCatalogItem[] = []
  // Defensive loop limit to prevent infinite loops
  const maxPages = 2000
  while (pageNumber <= maxPages) {
    const { items, hasNextPage } = await fetchStampMasterCatalogPage({ pageNumber, pageSize, catalogExtractionProcessId, jwt })
    all.push(...(items || []))
    if (!hasNextPage || (items || []).length < pageSize) break
    pageNumber += 1
  }
  return all
}

// New function with progress tracking
export async function fetchStampMasterCatalogWithProgress(
  catalogExtractionProcessId: string,
  pageSize = 200,
  jwt?: string,
  onProgress?: (progress: {
    currentPage: number,
    totalPages: number,
    totalCount: number,
    currentItems: number,
    progress: number,
    message: string
  }) => void
): Promise<StampMasterCatalogItem[]> {
  let pageNumber = 1
  const all: StampMasterCatalogItem[] = []
  let totalCount = 0
  let totalPages = 1

  // Get first page to determine total count and pages
  const firstResponse = await fetchStampMasterCatalogPage({ pageNumber, pageSize, catalogExtractionProcessId, jwt })
  all.push(...(firstResponse.items || []))
  totalCount = firstResponse.totalCount
  totalPages = firstResponse.totalPages

  // Report initial progress
  onProgress?.({
    currentPage: 1,
    totalPages,
    totalCount,
    currentItems: firstResponse.items.length,
    progress: Math.round((1 / totalPages) * 85),
    message: `Loaded page 1 of ${totalPages}`
  })

  // Continue fetching remaining pages
  pageNumber = 2
  while (pageNumber <= totalPages && pageNumber <= 2000) {
    const response = await fetchStampMasterCatalogPage({ pageNumber, pageSize, catalogExtractionProcessId, jwt })
    all.push(...(response.items || []))

    // Report progress
    onProgress?.({
      currentPage: pageNumber,
      totalPages,
      totalCount,
      currentItems: all.length,
      progress: Math.round((pageNumber / totalPages) * 85),
      message: `Loaded page ${pageNumber} of ${totalPages}`
    })

    if (!response.hasNextPage || (response.items || []).length < pageSize) break
    pageNumber += 1
  }

  // Final progress update
  onProgress?.({
    currentPage: totalPages,
    totalPages,
    totalCount,
    currentItems: all.length,
    progress: 85,
    message: `Successfully loaded ${all.length.toLocaleString()} stamps!`
  })

  return all
}


