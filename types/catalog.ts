export interface CountryOption {
  code: string
  name: string
  flag: string
  totalStamps: number
  firstIssue?: string
  lastIssue?: string
  featuredStampUrl?: string
  description?: string
  historicalNote?: string
}

export interface SeriesOption {
  id: string
  name: string
  catalogNumber: string
  totalStamps: number
  featuredStampUrl?: string
  description?: string
  period?: string
  featured?: boolean
}

export interface YearOption {
  year: number
  totalStamps: number
  firstIssue: string
  lastIssue: string
  highlightedSeries?: string
  historicalEvents?: string[]
  featuredStampUrl?: string
}

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  totalStamps: number
  country?: string
  description?: string
  featuredStampUrl?: string
}

export interface DenominationOption {
  value: string
  symbol: string
  displayName: string
  totalStamps: number
  stampImageUrl: string
  commonColors?: string[]
  featured?: boolean
  featuredStampUrl?: string
}

export interface ColorOption {
  code: string
  name: string
  hex: string
  totalStamps: number
  stampImageUrl: string
  popularity?: number
  description?: string
  featuredStampUrl?: string
}

export interface PaperOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  texture?: string
  technicalNote?: string
  featuredStampUrl?: string
}

export interface WatermarkOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  pattern?: string
  historicalInfo?: string
  featuredStampUrl?: string
}

export interface PerforationOption {
  code: string
  name: string
  measurement: string
  totalStamps: number
  stampImageUrl: string
  style?: string
  technicalDetail?: string
  featuredStampUrl?: string
}

export interface ItemTypeOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  category?: string
  collectorsNote?: string
  featuredStampUrl?: string
}

export interface StampData {
  id: string
  stampCode: string
  stampId: string
  parentStampId: string
  isInstance: boolean
  status: number
  stampCatalogId: string | null
  name: string
  publisher: string
  country: string
  countryCode: string
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
  mintValue: number | null
  finestUsedValue: number | null
  usedValue: number | null
  rarity?: string
  condition?: string
  story: string
  stampGroupId: string;
  instances: StampInstance[];
  typeName: string;
}

export interface ApiStampData {
  id: string
  catalogExtractionProcessId: string
  stampCatalogCode: string
  name: string
  publisher: string
  country: string
  countryCode: string
  story: string
  stampGroupId: string
  instances: StampInstance[]
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

export interface ApiResponse {
  items: ApiStampData[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface GroupedStamps {
  [key: string]: StampData[] | GroupedStamps
}

export interface NavigationState {
  path: string[]
  level: number
}

// GroupingField is intentionally broad to allow grouping by any available or computed field
export type GroupingField = string

export interface StampInstance {
  id: string
  code: string
  description: string
  mintValue: string
  finestUsedValue: string
  usedValue: string
}

export interface ParsedStampDetails {
  perforation?: string
  watermark?: string
  printingMethod?: string
  designer?: string
  printRun?: string
  paperType?: string
  gum?: string
  varieties?: string[]
  theme?: string
  size?: string
  errors?: string[]
  rarityRating?: string
  rarity?: string
  catalogPrice?: string
  estimatedValue?: string
  currentMarketValue?: string
  condition?: string
  conditionDescription?: string
  usage?: string
  usageDescription?: string
  postalHistoryType?: string
  postalHistoryDescription?: string
  priceFactors?: {
    condition?: string
    usage?: string
    postalHistory?: string
    category?: string
  }
  recentSales?: Array<{
    date: string
    price: number
    venue: string
    adjustedPrice: string
  }>
  marketTrend?: string
  demandLevel?: string
  specialNotes?: string
  bibliography?: string
  errorType?: string
}

export interface StampDetailData extends StampData {
  parsedDetails: ParsedStampDetails
  relatedStamps: StampData[]
  varieties: {
    perforations: string[]
    colors: string[]
    paperTypes: string[]
    errors: string[]
  }
  marketInfo?: {
    mintValue?: string
    usedValue?: string
    rarity?: string
  }
  bibliography: string
}

export interface AdditionalCategoryOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  priceMultiplier?: number
  rarity?: string
}

// Modal types for the navigation stack
export type ModalType = 'series' | 'country' | 'stampGroup' | 'year' | 'currency' | 'denomination' | 
                 'color' | 'paper' | 'watermark' | 'perforation' | 'itemType' | 'stampDetails' |
                 'postalHistory' | 'postmarks' | 'proofs' | 'essays' | 'onPiece' | 'errors' | 'other'

export interface ModalStackItem {
  type: ModalType
  title: string
  data: any
  stampCode: string
  selectedAdditionalCategories?: string[]
}

export interface FeaturedStory {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  readTime: string
  category: string
  excerpt: string
} 

export interface SeriesData {
  id: string
  name: string
  description: string
  totalTypes: number
  country: string
  periodStart: number
  periodEnd: number
  totalStampGroups: number
  typeNames: Record<string, boolean>
  stampGroupNames: Record<string, Record<string, boolean>>
}

export interface TypeData {
  id: string
  name: string
  seriesId: string
  description: string
  totalStampGroups: number
  catalogPrefix: string
}

export interface StampGroupData {
  id: string
  name: string
  typeId: string
  year: number
  issueDate: string
  description: string
  watermark: string
  perforation: string
  printingMethod: string
  printer: string
  totalStamps: number
}

export interface CountryData {
  id: string
  name: string
  code: string
  description: string
  totalYears: number
  yearStart: number
  yearEnd: number
}

export interface YearData {
  id: string
  year: number
  countryId: string
  totalReleases: number
  description: string
}

export interface ReleaseData {
  id: string
  name: string
  yearId: string
  dateRange: string
  description: string
  perforation: string
  totalCategories: number
  hasCategories: boolean
}

export interface CategoryData {
  id: string
  name: string
  code: string
  releaseId: string
  description: string
  totalPaperTypes: number
  hasPaperTypes: boolean
}

export interface PaperTypeData {
  id: string
  name: string
  code: string
  categoryId: string
  description: string
  totalStamps: number
}

// Layout types
export type CatalogLayout = 'campbell-paterson' | 'stanley-gibbons'

// Modal stack state item for list-catalogue
export interface ListModalStackItem {
  type: 'series' | 'type' | 'stampGroup' | 'stamps' | 'country' | 'year' | 'release' | 'category' | 'paperType'
  data: any
  title: string
} 