export type StampMasterCatalogItem = {
  id: string
  catalogExtractionProcessId: string
  similarityScore: number
  stampId: string
  isInstance: boolean
  parentStampId: string
  catalogNumber: string
  stampCode: string
  name: string
  description: string
  country: string
  countryName: string
  countryFlag: string
  seriesId: string
  seriesName: string
  seriesDescription: string
  typeId: string
  typeName: string
  typeDescription: string
  stampGroupId: string
  stampGroupName: string
  stampGroupDescription: string
  releaseId: string
  releaseName: string
  releaseDateRange: string
  releaseDescription: string
  categoryId: string
  categoryName: string
  categoryCode: string
  categoryDescription: string
  paperTypeId: string
  paperTypeName: string
  paperTypeCode: string
  paperTypeDescription: string
  currencyCode: string
  currencyName: string
  currencySymbol: string
  currencyDescription: string
  denominationValue: string
  denominationSymbol: string
  denominationDisplay: string
  denominationDescription: string
  colorCode: string
  colorName: string
  colorHex: string
  colorDescription: string
  colorVariant: string
  paperCode: string
  paperName: string
  paperDescription: string
  paperFiber: string
  paperThickness: string
  paperOpacity: string
  watermarkCode: string
  watermarkName: string
  watermarkDescription: string
  watermarkPosition: string
  watermarkClarity: string
  perforationCode: string
  perforationName: string
  perforationMeasurement: string
  perforationGauge: string
  perforationCleanCut: boolean
  perforationComb: boolean
  itemTypeCode: string
  itemTypeName: string
  itemTypeDescription: string
  itemFormat: string
  issueDate: string
  issueYear: number
  issueMonth: number
  issueDay: number
  firstDayIssue: boolean
  periodStart: number
  periodEnd: number
  issueLocation: string
  issuePurpose: string
  issueContext: string
  printingMethod: string
  printingProcess: string
  printingQuality: string
  designer: string
  designerNotes: string
  printer: string
  printerLocation: string
  printerReputation: string
  engraver: string
  dieNumber: string
  plateNumber: string
  plateCharacteristics: string
  paperManufacturer: string
  gumType: string
  gumCondition: string
  sizeWidth: string
  sizeHeight: string
  sizeFormat: string
  theme: string
  themeCategory: string
  subject: string
  artisticStyle: string
  printRun: string
  estimatedPrintRun: number
  sheetsPrinted: string
  stampsPerSheet: number
  positionVarieties: boolean
  plateVariety: string
  stampImageUrl: string
  stampImageAlt: string
  stampImageHighRes: string
  watermarkImageUrl: string
  perforationImageUrl: string
  rarityRating: string
  rarityScale: string
  rarityScore: number
  hasVarieties: boolean
  varietyCount: number
  varietyType: string
  perforationVariety: string
  colorVariety: string
  paperVariety: string
  watermarkVariety: string
  knownError: string
  majorVariety: string
  postalHistoryType: string
  postmarkType: string
  proofType: string
  essayType: string
  errorType: string
  authenticationRequired: boolean
  expertCommittee: string
  authenticationPoint: string
  certificateAvailable: boolean
  commonForgery: string
  historicalSignificance: string
  culturalImportance: string
  philatelicImportance: string
  collectingPopularity: string
  exhibitionFrequency: string
  researchStatus: string
  bibliography: string
  specialNotes: string
  collectorNotes: string
  conditionNotes: string
  rarityNotes: string
  marketNotes: string
  researchNotes: string
  instanceCatalogCode: string
  instanceDescription: string
  condition: string
  conditionGrade: string
  conditionDescription: string
  conditionDetails: string
  usageState: string
  usageDescription: string
  usageCode: string
  gumConditionSpecific: string
  gumDescription: string
  gumQuality: string
  centering: string
  centeringScore: string
  centeringDescription: string
  margins: string
  marginMeasurements: string
  colorFreshness: string
  colorIntensity: string
  colorDescriptionSpecific: string
  paperCondition: string
  paperFreshness: string
  surfaceCondition: string
  perforationsCondition: string
  perforationTips: string
  faults: string
  repairs: string
  alterations: string
  grade: string
  gradingService: string
  certification: string
  certificateNumber: string
  expertOpinion: string
  postmarkTypeInInstance: string
  postmarkLocation: string
  postmarkDate: string
  postmarkClarity: string
  postmarkPosition: string
  postmarkDescription: string
  mintValue: number
  usedValue: number
  finestUsedValue: number
  priceMultiplier: number
  priceFactors: string
  instanceRarity: string
  conditionRarity: string
  availability: string
  marketFrequency: string
  auctionFrequency: string
  lastAuctionDate: string
  lastAuctionPrice: number
  priceTrend: string
  instanceNotes: string
  investmentNotes: string
  exhibitionSuitability: string
  photographicQuality: string
  varietyTypeInInstance: string
  varietyDescription: string
  varietyPosition: string
  varietySeverity: string
  varietyVisibility: string
  varietyRarity: string
  varietyNotes: string
  stampVectorJson: string
  stampDetailsJson: string
  alternativeNames: string
  plateFlaws: string
  stampImageVariants: string[]
  recentSales: string
  primaryReferences: string
  researchPapers: string
  exhibitionLiterature: string
  onlineResources: string
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

const BASE_URL = 'https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog'
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


