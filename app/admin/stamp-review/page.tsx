"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Trash2,
  AlertTriangle,
  Upload,
} from "lucide-react"

// API Response Types
interface StampReviewItem {
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
  status: string
  createdAt: string
  updatedAt: string
  isPublished: boolean
  publishNotes?: string
  pageNumber?: number
  stampId?: string
}

interface StampReviewResponse {
  items: StampReviewItem[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

interface StampInstanceItem extends StampReviewItem {
  // Instances have the same structure but may have additional instance-specific fields
  parentStampId?: string
  instanceCatalogCode?: string
  instanceDescription?: string
  condition?: string
  pageNumber?: number
  description?: string

  // Additional properties used in the form
  stampFileAttachment?: File
  countryName?: string
  countryFlag?: string
  issueLocation?: string
  seriesId?: string
  seriesDescription?: string
  typeId?: string
  typeName?: string
  typeDescription?: string
  stampGroupId?: string
  stampGroupName?: string
  stampGroupDescription?: string
  releaseId?: string
  releaseName?: string
  releaseDateRange?: string
  releaseDescription?: string
  categoryId?: string
  categoryName?: string
  categoryCode?: string
  categoryDescription?: string
  paperTypeId?: string
  paperTypeName?: string
  paperTypeCode?: string
  paperTypeDescription?: string
  itemTypeCode?: string
  itemTypeName?: string
  itemTypeDescription?: string
  itemFormat?: string
  currencyCode?: string
  currencyName?: string
  currencySymbol?: string
  currencyDescription?: string
  denominationDisplay?: string
  denominationDescription?: string
  colorCode?: string
  colorName?: string
  colorHex?: string
  colorDescription?: string
  colorVariant?: string
  paperCode?: string
  paperName?: string
  paperDescription?: string
  paperFiber?: string
  paperThickness?: string
  paperOpacity?: string
  watermarkCode?: string
  watermarkName?: string
  watermarkDescription?: string
  watermarkPosition?: string
  watermarkClarity?: string
  perforationCode?: string
  perforationName?: string
  perforationMeasurement?: string
  perforationGauge?: string
  perforationCleanCut?: boolean
  perforationComb?: boolean
  issueMonth?: number
  issueDay?: number
  firstDayIssue?: boolean
  periodStart?: number
  periodEnd?: number
  issuePurpose?: string
  issueContext?: string
  stampVectorJson?: string
  stampDetailsJson?: string
  alternativeNames?: string
  plateFlaws?: string
  recentSales?: string
  stampImageVariants?: any[]
}

// Import the actual StampMasterCatalogItem type
import type { StampMasterCatalogItem } from "@/lib/api/stamp-master-catalog"

// Editable stamp data for the popup - uses actual API type
type EditableStampData = StampMasterCatalogItem & { publish: boolean; isPublished: boolean; publishNotes?: string; stampFileAttachment?: File }

// JWT helper function
const getJWT = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const stampUserData = localStorage.getItem('stamp_user_data')
      if (stampUserData) {
        const userData = JSON.parse(stampUserData)
        if (userData && userData.jwt) {
          return userData.jwt
        }
      }
    } catch (error) {
      console.error('Error parsing stamp_user_data from localStorage:', error)
    }

    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'stamp_jwt') {
        return value
      }
    }
  }
  return null
}

// Key mapping from GET API response keys (camelCase) to form data keys (PascalCase)
const keyMapping: Record<string, string> = {
  'id': 'Id',
  'catalogExtractionProcessId': 'CatalogExtractionProcessId',
  'similarityScore': 'SimilarityScore',
  'stampId': 'StampId',
  'isInstance': 'IsInstance',
  'parentStampId': 'ParentStampId',
  'catalogNumber': 'CatalogNumber',
  'stampCode': 'StampCode',
  'name': 'Name',
  'description': 'Description',
  'country': 'Country',
  'countryName': 'CountryName',
  'countryFlag': 'CountryFlag',
  'seriesId': 'SeriesId',
  'seriesName': 'SeriesName',
  'seriesDescription': 'SeriesDescription',
  'typeId': 'TypeId',
  'typeName': 'TypeName',
  'typeDescription': 'TypeDescription',
  'stampGroupId': 'StampGroupId',
  'stampGroupName': 'StampGroupName',
  'stampGroupDescription': 'StampGroupDescription',
  'releaseId': 'ReleaseId',
  'releaseName': 'ReleaseName',
  'releaseDateRange': 'ReleaseDateRange',
  'releaseDescription': 'ReleaseDescription',
  'categoryId': 'CategoryId',
  'categoryName': 'CategoryName',
  'categoryCode': 'CategoryCode',
  'categoryDescription': 'CategoryDescription',
  'paperTypeId': 'PaperTypeId',
  'paperTypeName': 'PaperTypeName',
  'paperTypeCode': 'PaperTypeCode',
  'paperTypeDescription': 'PaperTypeDescription',
  'currencyCode': 'CurrencyCode',
  'currencyName': 'CurrencyName',
  'currencySymbol': 'CurrencySymbol',
  'currencyDescription': 'CurrencyDescription',
  'denominationValue': 'DenominationValue',
  'denominationSymbol': 'DenominationSymbol',
  'denominationDisplay': 'DenominationDisplay',
  'denominationDescription': 'DenominationDescription',
  'colorCode': 'ColorCode',
  'colorName': 'ColorName',
  'colorHex': 'ColorHex',
  'colorDescription': 'ColorDescription',
  'colorVariant': 'ColorVariant',
  'paperCode': 'PaperCode',
  'paperName': 'PaperName',
  'paperDescription': 'PaperDescription',
  'paperFiber': 'PaperFiber',
  'paperThickness': 'PaperThickness',
  'paperOpacity': 'PaperOpacity',
  'watermarkCode': 'WatermarkCode',
  'watermarkName': 'WatermarkName',
  'watermarkDescription': 'WatermarkDescription',
  'watermarkPosition': 'WatermarkPosition',
  'watermarkClarity': 'WatermarkClarity',
  'perforationCode': 'PerforationCode',
  'perforationName': 'PerforationName',
  'perforationMeasurement': 'PerforationMeasurement',
  'perforationGauge': 'PerforationGauge',
  'perforationCleanCut': 'PerforationCleanCut',
  'perforationComb': 'PerforationComb',
  'itemTypeCode': 'ItemTypeCode',
  'itemTypeName': 'ItemTypeName',
  'itemTypeDescription': 'ItemTypeDescription',
  'itemFormat': 'ItemFormat',
  'issueDate': 'IssueDate',
  'issueYear': 'IssueYear',
  'issueMonth': 'IssueMonth',
  'issueDay': 'IssueDay',
  'firstDayIssue': 'FirstDayIssue',
  'periodStart': 'PeriodStart',
  'periodEnd': 'PeriodEnd',
  'issueLocation': 'IssueLocation',
  'issuePurpose': 'IssuePurpose',
  'issueContext': 'IssueContext',
  'printingMethod': 'PrintingMethod',
  'printingProcess': 'PrintingProcess',
  'printingQuality': 'PrintingQuality',
  'designer': 'Designer',
  'designerNotes': 'DesignerNotes',
  'printer': 'Printer',
  'printerLocation': 'PrinterLocation',
  'printerReputation': 'PrinterReputation',
  'engraver': 'Engraver',
  'dieNumber': 'DieNumber',
  'plateNumber': 'PlateNumber',
  'plateCharacteristics': 'PlateCharacteristics',
  'paperManufacturer': 'PaperManufacturer',
  'gumType': 'GumType',
  'gumCondition': 'GumCondition',
  'sizeWidth': 'SizeWidth',
  'sizeHeight': 'SizeHeight',
  'sizeFormat': 'SizeFormat',
  'theme': 'Theme',
  'themeCategory': 'ThemeCategory',
  'subject': 'Subject',
  'artisticStyle': 'ArtisticStyle',
  'printRun': 'PrintRun',
  'estimatedPrintRun': 'EstimatedPrintRun',
  'sheetsPrinted': 'SheetsPrinted',
  'stampsPerSheet': 'StampsPerSheet',
  'positionVarieties': 'PositionVarieties',
  'plateVariety': 'PlateVariety',
  'stampImageUrl': 'StampImageUrl',
  'stampImageAlt': 'StampImageAlt',
  'stampImageHighRes': 'StampImageHighRes',
  'watermarkImageUrl': 'WatermarkImageUrl',
  'perforationImageUrl': 'PerforationImageUrl',
  'rarityRating': 'RarityRating',
  'rarityScale': 'RarityScale',
  'rarityScore': 'RarityScore',
  'hasVarieties': 'HasVarieties',
  'varietyCount': 'VarietyCount',
  'varietyType': 'VarietyType',
  'perforationVariety': 'PerforationVariety',
  'colorVariety': 'ColorVariety',
  'paperVariety': 'PaperVariety',
  'watermarkVariety': 'WatermarkVariety',
  'knownError': 'KnownError',
  'majorVariety': 'MajorVariety',
  'postalHistoryType': 'PostalHistoryType',
  'postmarkType': 'PostmarkType',
  'proofType': 'ProofType',
  'essayType': 'EssayType',
  'errorType': 'ErrorType',
  'authenticationRequired': 'AuthenticationRequired',
  'expertCommittee': 'ExpertCommittee',
  'authenticationPoint': 'AuthenticationPoint',
  'certificateAvailable': 'CertificateAvailable',
  'commonForgery': 'CommonForgery',
  'historicalSignificance': 'HistoricalSignificance',
  'culturalImportance': 'CulturalImportance',
  'philatelicImportance': 'PhilatelicImportance',
  'collectingPopularity': 'CollectingPopularity',
  'exhibitionFrequency': 'ExhibitionFrequency',
  'researchStatus': 'ResearchStatus',
  'bibliography': 'Bibliography',
  'specialNotes': 'SpecialNotes',
  'collectorNotes': 'CollectorNotes',
  'conditionNotes': 'ConditionNotes',
  'rarityNotes': 'RarityNotes',
  'marketNotes': 'MarketNotes',
  'researchNotes': 'ResearchNotes',
  'instanceCatalogCode': 'InstanceCatalogCode',
  'instanceDescription': 'InstanceDescription',
  'condition': 'Condition',
  'conditionGrade': 'ConditionGrade',
  'conditionDescription': 'ConditionDescription',
  'conditionDetails': 'ConditionDetails',
  'usageState': 'UsageState',
  'usageDescription': 'UsageDescription',
  'usageCode': 'UsageCode',
  'gumConditionSpecific': 'GumConditionSpecific',
  'gumDescription': 'GumDescription',
  'gumQuality': 'GumQuality',
  'centering': 'Centering',
  'centeringScore': 'CenteringScore',
  'centeringDescription': 'CenteringDescription',
  'margins': 'Margins',
  'marginMeasurements': 'MarginMeasurements',
  'colorFreshness': 'ColorFreshness',
  'colorIntensity': 'ColorIntensity',
  'colorDescriptionSpecific': 'ColorDescriptionSpecific',
  'paperCondition': 'PaperCondition',
  'paperFreshness': 'PaperFreshness',
  'surfaceCondition': 'SurfaceCondition',
  'perforationsCondition': 'PerforationsCondition',
  'perforationTips': 'PerforationTips',
  'faults': 'Faults',
  'repairs': 'Repairs',
  'alterations': 'Alterations',
  'grade': 'Grade',
  'gradingService': 'GradingService',
  'certification': 'Certification',
  'certificateNumber': 'CertificateNumber',
  'expertOpinion': 'ExpertOpinion',
  'postmarkTypeInInstance': 'PostmarkTypeInInstance',
  'postmarkLocation': 'PostmarkLocation',
  'postmarkDate': 'PostmarkDate',
  'postmarkClarity': 'PostmarkClarity',
  'postmarkPosition': 'PostmarkPosition',
  'postmarkDescription': 'PostmarkDescription',
  'mintValue': 'MintValue',
  'usedValue': 'UsedValue',
  'finestUsedValue': 'FinestUsedValue',
  'priceMultiplier': 'PriceMultiplier',
  'priceFactors': 'PriceFactors',
  'instanceRarity': 'InstanceRarity',
  'conditionRarity': 'ConditionRarity',
  'availability': 'Availability',
  'marketFrequency': 'MarketFrequency',
  'auctionFrequency': 'AuctionFrequency',
  'lastAuctionDate': 'LastAuctionDate',
  'lastAuctionPrice': 'LastAuctionPrice',
  'priceTrend': 'PriceTrend',
  'instanceNotes': 'InstanceNotes',
  'investmentNotes': 'InvestmentNotes',
  'exhibitionSuitability': 'ExhibitionSuitability',
  'photographicQuality': 'PhotographicQuality',
  'varietyTypeInInstance': 'VarietyTypeInInstance',
  'varietyDescription': 'VarietyDescription',
  'varietyPosition': 'VarietyPosition',
  'varietySeverity': 'VarietySeverity',
  'varietyVisibility': 'VarietyVisibility',
  'varietyRarity': 'VarietyRarity',
  'varietyNotes': 'VarietyNotes',
  'stampVectorJson': 'StampVectorJson',
  'stampDetailsJson': 'StampDetailsJson',
  'alternativeNames': 'AlternativeNames',
  'plateFlaws': 'PlateFlaws',
  'stampImageVariants': 'StampImageVariants',
  'recentSales': 'RecentSales',
  'primaryReferences': 'PrimaryReferences',
  'researchPapers': 'ResearchPapers',
  'exhibitionLiterature': 'ExhibitionLiterature',
  'onlineResources': 'OnlineResources',
  'isPublished': 'IsPublished',
  'publishNotes': 'PublishNotes',
  'pageNumber': 'PageNumber',
  'stampFileAttachment': 'StampFileAttachment'
}

// Function to convert camelCase data to PascalCase FormData
const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    // Skip undefined/null values
    if (value === undefined || value === null) {
      return
    }

    // Map the key to PascalCase
    const formKey = keyMapping[key] || key

    // Handle special cases for nested objects
    if (key === 'stampVector' && typeof value === 'object') {
      if (value.memory) {
        if (value.memory.length !== undefined) {
          formData.append('StampVector.Memory.Length', String(value.memory.length))
        }
        if (value.memory.isEmpty !== undefined) {
          formData.append('StampVector.Memory.IsEmpty', String(value.memory.isEmpty))
        }
      }
    } else if (key === 'publish' && value === true) {
      // Handle publish flag - convert to IsPublished
      formData.append('IsPublished', 'true')
    } else if (Array.isArray(value)) {
      // Handle arrays (like stampImageVariants)
      formData.append(formKey, JSON.stringify(value))
    } else if (key === 'stampFileAttachment') {
      formData.append(formKey, value)
    } else {
      // Handle all other values
      formData.append(formKey, String(value))
    }
  })

  return formData
}

// API Functions
const fetchStampsForReview = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<StampReviewResponse> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/BaseStamps?pageNumber=${pageNumber}&pageSize=${pageSize}&catalogExtractionProcessId=254c793b-16d0-40a3-8b10-66d987b54474`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const updateStamp = async (stampId: string, stampData: Partial<EditableStampData>): Promise<StampReviewItem> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  // Convert the stamp data to FormData with PascalCase keys
  const formData = convertToFormData(stampData)

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`,
    {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${jwt}`
        // Note: Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const approveStamp = async (stampId: string, publishNotes: string): Promise<StampReviewItem> => {
  return updateStamp(stampId, { publish: true, publishNotes })
}

const deleteStamp = async (stampId: string): Promise<void> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${stampId}`,
    {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

const fetchStampInstances = async (stampId: string): Promise<StampInstanceItem[]> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/Instances/${stampId}`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  return data.items || data || []
}

const updateStampInstance = async (instanceId: string, instanceData: Partial<StampInstanceItem>): Promise<StampInstanceItem> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  // Convert the instance data to FormData with PascalCase keys
  const formData = convertToFormData(instanceData)

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${instanceId}`,
    {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${jwt}`
        // Note: Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

const deleteStampInstance = async (instanceId: string): Promise<void> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog/${instanceId}`,
    {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

export default function StampReviewPage() {
  const [stamps, setStamps] = useState<StampReviewItem[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal states
  const [selectedStamp, setSelectedStamp] = useState<EditableStampData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<EditableStampData>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Stamp instances states
  const [stampInstances, setStampInstances] = useState<StampInstanceItem[]>([])
  const [isLoadingInstances, setIsLoadingInstances] = useState(false)

  // Instance edit states
  const [selectedInstance, setSelectedInstance] = useState<StampInstanceItem | null>(null)
  const [isInstanceEditModalOpen, setIsInstanceEditModalOpen] = useState(false)
  const [instanceEditFormData, setInstanceEditFormData] = useState<Partial<StampInstanceItem>>({})
  const [isUpdatingInstance, setIsUpdatingInstance] = useState(false)

  // Instance delete states
  const [isInstanceDeleteDialogOpen, setIsInstanceDeleteDialogOpen] = useState(false)
  const [isDeletingInstance, setIsDeletingInstance] = useState(false)
  const [instanceToDelete, setInstanceToDelete] = useState<StampInstanceItem | null>(null)

  // Publish Notes Modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [publishNotes, setPublishNotes] = useState("")
  const [stampToApprove, setStampToApprove] = useState<StampReviewItem | null>(null)

  const { toast } = useToast()

  // Load stamps data
  const loadStamps = async (page: number = 1, refresh: boolean = false, pageSizeOverride?: number) => {
    try {
      if (refresh) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const response = await fetchStampsForReview(page, pageSizeOverride ?? pageSize)
      setStamps(response.items || [])
      setPageNumber(response.pageNumber || page)
      // Don't override the user-selected pageSize with API response
      setTotalCount(response.totalCount || 0)
      setTotalPages(response.totalPages || 0)

    } catch (error) {
      console.error("Error loading stamps:", error)
      toast({
        title: "Failed to Load Stamps",
        description: error instanceof Error ? error.message : "Unable to fetch stamps for review. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Handle opening publish notes modal
  const handleOpenPublishModal = (stamp: StampReviewItem) => {
    setStampToApprove(stamp)
    setPublishNotes("")
    setIsPublishModalOpen(true)
  }

  // Handle approve stamp with publish notes
  const handleApproveStamp = async () => {
    if (!stampToApprove || !publishNotes.trim()) {
      toast({
        title: "Validation Error",
        description: "Publish notes are required to approve this stamp.",
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    try {
      setIsUpdating(true)
      await approveStamp(stampToApprove.id, publishNotes.trim())

      // Update local state
      setStamps(prev => prev.map(stamp =>
        stamp.id === stampToApprove.id ? { ...stamp, isPublished: true, publishNotes: publishNotes.trim() } : stamp
      ))

      setIsPublishModalOpen(false)
      setStampToApprove(null)
      setPublishNotes("")

      toast({
        title: "Stamp Approved",
        description: "The stamp has been successfully approved and published.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error approving stamp:", error)
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Unable to approve stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle save stamp changes
  const handleSaveStamp = async () => {
    if (!selectedStamp) return

    try {
      setIsUpdating(true)
      const updatedStamp = await updateStamp(selectedStamp.id, editFormData)

      // Update local state
      setStamps(prev => prev.map(stamp =>
        stamp.id === selectedStamp.id ? updatedStamp : stamp
      ))

      setIsEditModalOpen(false)
      setSelectedStamp(null)
      setEditFormData({})

      toast({
        title: "Stamp Updated",
        description: "The stamp details have been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating stamp:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Unable to update stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete stamp
  const handleDeleteStamp = async () => {
    if (!selectedStamp) return

    try {
      setIsDeleting(true)
      await deleteStamp(selectedStamp.id)

      // Remove from local state
      setStamps(prev => prev.filter(stamp => stamp.id !== selectedStamp.id))

      setIsDeleteDialogOpen(false)
      setIsEditModalOpen(false)
      setSelectedStamp(null)
      setEditFormData({})

      toast({
        title: "Stamp Deleted",
        description: "The stamp has been successfully deleted.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error deleting stamp:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete stamp. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle opening edit modal
  const handleEditStamp = async (stamp: StampReviewItem) => {
    setSelectedStamp(stamp as unknown as EditableStampData)
    setEditFormData({ ...stamp } as unknown as Partial<EditableStampData>)
    setIsEditModalOpen(true)

    // Fetch stamp instances
    try {
      setIsLoadingInstances(true)
      const stampIdToUse = stamp.stampId || stamp.id
      const instances = await fetchStampInstances(stampIdToUse)
      setStampInstances(instances)
    } catch (error) {
      console.error("Error loading stamp instances:", error)
      toast({
        title: "Failed to Load Instances",
        description: error instanceof Error ? error.message : "Unable to fetch stamp instances. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
      setStampInstances([])
    } finally {
      setIsLoadingInstances(false)
    }
  }

  // Handle editing stamp instance
  const handleEditInstance = (instance: StampInstanceItem) => {
    setSelectedInstance(instance)
    setInstanceEditFormData({ ...instance })
    setIsInstanceEditModalOpen(true)
  }

  // Handle saving instance changes
  const handleSaveInstance = async () => {
    if (!selectedInstance) return

    try {
      setIsUpdatingInstance(true)
      const updatedInstance = await updateStampInstance(selectedInstance.id, instanceEditFormData)

      // Update local state
      setStampInstances(prev => prev.map(instance =>
        instance.id === selectedInstance.id ? updatedInstance : instance
      ))

      setIsInstanceEditModalOpen(false)
      setSelectedInstance(null)
      setInstanceEditFormData({})

      toast({
        title: "Instance Updated",
        description: "The stamp instance details have been successfully updated.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating instance:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Unable to update stamp instance. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdatingInstance(false)
    }
  }

  // Handle opening delete instance dialog
  const handleOpenInstanceDeleteDialog = (instance: StampInstanceItem) => {
    setInstanceToDelete(instance)
    setIsInstanceDeleteDialogOpen(true)
  }

  // Handle deleting stamp instance
  const handleDeleteInstance = async () => {
    if (!instanceToDelete) return

    try {
      setIsDeletingInstance(true)
      await deleteStampInstance(instanceToDelete.id)

      // Remove from local state
      setStampInstances(prev => prev.filter(instance => instance.id !== instanceToDelete.id))

      setIsInstanceDeleteDialogOpen(false)
      setInstanceToDelete(null)

      toast({
        title: "Instance Deleted",
        description: "The stamp instance has been successfully deleted.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error deleting instance:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Unable to delete stamp instance. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsDeletingInstance(false)
    }
  }

  // Filter stamps based on search and filters
  const filteredStamps = stamps.filter(stamp => {
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.stampCatalogCode?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === "all" || stamp.country === countryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && stamp.isPublished) ||
      (statusFilter === "draft" && !stamp.isPublished)

    return matchesSearch && matchesCountry && matchesStatus
  })

  // Get unique countries for filter
  const countries = [...new Set(stamps.map(stamp => stamp.country))].sort()

  // Format denomination
  const formatDenomination = (value: number, symbol: string) => {
    return `${value}${symbol}`
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
    loadStamps(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageNumber(1)
    loadStamps(1, false, newPageSize)
  }

  // Refresh data
  const refreshData = () => {
    loadStamps(pageNumber, true)
  }

  // Load data on component mount
  useEffect(() => {
    loadStamps(1)
  }, [])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setCountryFilter("all")
    setStatusFilter("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Stamp Review</h1>
          <p className="text-muted-foreground">Review and approve stamps for publication</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Stamp Review Queue</CardTitle>
              <CardDescription>
                Review stamps extracted from catalogs and approve them for publication
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(Number(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stamps by name, series, catalog number, or stamp code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredStamps.length} of {totalCount} stamps
              </span>
              <span>
                Page {pageNumber} of {totalPages}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading stamps...</span>
            </div>
          ) : (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Actions</TableHead>
                      <TableHead className="w-[60px]">Page</TableHead>
                      <TableHead className="min-w-[200px] max-w-[250px]">Stamp</TableHead>
                      <TableHead className="w-[120px]">Country</TableHead>
                      <TableHead className="w-[80px]">Year</TableHead>
                      <TableHead className="w-[120px]">Catalog Number</TableHead>
                      <TableHead className="w-[140px]">Stamp Code</TableHead>
                      <TableHead className="w-[100px]">Denomination</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStamps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No stamps found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStamps.map((stamp) => (
                        <TableRow key={stamp.id}>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditStamp(stamp)}
                                        title="View/Edit Stamp"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </Dialog>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedStamp(stamp as unknown as EditableStampData)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                    title="Delete Stamp"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="w-[60px]">
                                <Badge variant="outline" className="font-mono">
                                  {stamp.pageNumber}
                                </Badge>
                              </TableCell>
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={stamp.name}>
                              {stamp.name}
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span>{stamp.issueYear}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={stamp.catalogNumber}>
                              <Badge variant="outline" className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.catalogNumber}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="w-[140px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={stamp.stampCatalogCode}>
                              <Badge className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.stampCatalogCode}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium w-[100px] whitespace-nowrap">
                            {formatDenomination(stamp.denominationValue, stamp.denominationSymbol)}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {stamp.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            {!stamp.isPublished && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenPublishModal(stamp)}
                                disabled={isUpdating}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={pageNumber === 1 || totalPages <= 1}
                    >
                      <ChevronsLeft className="h-4 w-4 mr-1" />
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNumber - 1)}
                      disabled={pageNumber === 1 || totalPages <= 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    {totalPages > 1 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumberToShow
                      if (totalPages <= 5) {
                        pageNumberToShow = i + 1
                      } else if (pageNumber <= 3) {
                        pageNumberToShow = i + 1
                      } else if (pageNumber >= totalPages - 2) {
                        pageNumberToShow = totalPages - 4 + i
                      } else {
                        pageNumberToShow = pageNumber - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumberToShow}
                          variant={pageNumber === pageNumberToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumberToShow)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumberToShow}
                        </Button>
                      )
                    })}
                    {totalPages === 1 && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-8 h-8 p-0"
                        disabled
                      >
                        1
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNumber + 1)}
                      disabled={pageNumber === totalPages || totalPages <= 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={pageNumber === totalPages || totalPages <= 1}
                    >
                      Last
                      <ChevronsRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Stamp Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open)
        if (!open) {
          // Clear instances data when modal closes
          setStampInstances([])
          setIsLoadingInstances(false)
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Stamp Details
            </DialogTitle>
            <DialogDescription>
              Review and modify stamp information before approval
            </DialogDescription>
          </DialogHeader>

          {selectedStamp && (
            <div className="space-y-8">
              {/* Top Section: Image and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stamp Image */}
                <div className="lg:col-span-1">
                  <div className="sticky top-0">
                    <div className="aspect-square bg-muted rounded-xl flex items-center justify-center shadow-sm">
                      {selectedStamp.stampImageUrl ? (
                        <img
                          src={selectedStamp.stampImageUrl}
                          alt={selectedStamp.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-16 w-16 mx-auto mb-3" />
                          <p className="text-sm font-medium">No image available</p>
                        </div>
                      )}
                      <div className="hidden text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-3" />
                        <p className="text-sm font-medium">Image not available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information Summary */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-muted/30 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Stamp Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm font-medium">{selectedStamp.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Catalog Number</label>
                          <p className="text-sm font-mono">{selectedStamp.catalogNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <p className="text-sm">{selectedStamp.country}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Issue Year</label>
                          <p className="text-sm">{selectedStamp.issueYear}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Denomination</label>
                          <p className="text-sm font-medium">
                            {selectedStamp.denominationValue}{selectedStamp.denominationSymbol}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Series</label>
                          <p className="text-sm">{selectedStamp.seriesName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            {selectedStamp.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Form Sections */}
              <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="id">id</Label>
                        <Input
                          id="id"
                          value={editFormData.id || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, id: e.target.value }))}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catalogExtractionProcessId">catalogExtractionProcessId</Label>
                        <Input
                          id="catalogExtractionProcessId"
                          value={editFormData.catalogExtractionProcessId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, catalogExtractionProcessId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="similarityScore">similarityScore</Label>
                        <Input
                          id="similarityScore"
                          type="number"
                          step="0.01"
                          value={editFormData.similarityScore || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, similarityScore: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampId">stampId</Label>
                        <Input
                          id="stampId"
                          value={editFormData.stampId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isInstance">isInstance</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isInstance"
                            checked={editFormData.isInstance || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isInstance: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentStampId">parentStampId</Label>
                        <Input
                          id="parentStampId"
                          value={editFormData.parentStampId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, parentStampId: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="catalogNumber">catalogNumber</Label>
                        <Input
                          id="catalogNumber"
                          value={editFormData.catalogNumber || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampCode">stampCode</Label>
                        <Input
                          id="stampCode"
                          value={editFormData.stampCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampCode: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">name</Label>
                        <Input
                          id="name"
                          value={editFormData.name || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">description</Label>
                        <Textarea
                          id="description"
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stamp Image Upload */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Stamp Image Upload
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stampFileAttachment">Upload New Stamp Image</Label>
                        <Input
                          id="stampFileAttachment"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setEditFormData(prev => ({
                                ...prev,
                                stampFileAttachment: file
                              }))
                            }
                          }}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a new image to replace the current stamp image. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                        {editFormData.stampFileAttachment && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <ImageIcon className="h-4 w-4" />
                            <span className="text-sm">
                              Selected: {(editFormData.stampFileAttachment as File).name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditFormData(prev => ({
                                ...prev,
                                stampFileAttachment: undefined
                              }))}
                              disabled={selectedStamp?.isPublished}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Country & Geographic Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Country & Geographic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country">country</Label>
                        <Input
                          id="country"
                          value={editFormData.country || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryName">countryName</Label>
                        <Input
                          id="countryName"
                          value={editFormData.countryName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, countryName: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="countryFlag">countryFlag</Label>
                        <Input
                          id="countryFlag"
                          value={editFormData.countryFlag || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, countryFlag: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueLocation">issueLocation</Label>
                        <Input
                          id="issueLocation"
                          value={editFormData.issueLocation || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueLocation: e.target.value }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Series & Classification */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Series & Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="seriesId">seriesId</Label>
                        <Input
                          id="seriesId"
                          value={editFormData.seriesId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seriesName">seriesName</Label>
                        <Input
                          id="seriesName"
                          value={editFormData.seriesName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seriesDescription">seriesDescription</Label>
                        <Textarea
                          id="seriesDescription"
                          value={editFormData.seriesDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, seriesDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeId">typeId</Label>
                        <Input
                          id="typeId"
                          value={editFormData.typeId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeName">typeName</Label>
                        <Input
                          id="typeName"
                          value={editFormData.typeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="typeDescription">typeDescription</Label>
                        <Textarea
                          id="typeDescription"
                          value={editFormData.typeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, typeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupId">stampGroupId</Label>
                        <Input
                          id="stampGroupId"
                          value={editFormData.stampGroupId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupName">stampGroupName</Label>
                        <Input
                          id="stampGroupName"
                          value={editFormData.stampGroupName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampGroupDescription">stampGroupDescription</Label>
                        <Textarea
                          id="stampGroupDescription"
                          value={editFormData.stampGroupDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseId">releaseId</Label>
                        <Input
                          id="releaseId"
                          value={editFormData.releaseId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseName">releaseName</Label>
                        <Input
                          id="releaseName"
                          value={editFormData.releaseName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseDateRange">releaseDateRange</Label>
                        <Input
                          id="releaseDateRange"
                          value={editFormData.releaseDateRange || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseDateRange: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="releaseDescription">releaseDescription</Label>
                        <Textarea
                          id="releaseDescription"
                          value={editFormData.releaseDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, releaseDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryId">categoryId</Label>
                        <Input
                          id="categoryId"
                          value={editFormData.categoryId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryName">categoryName</Label>
                        <Input
                          id="categoryName"
                          value={editFormData.categoryName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryCode">categoryCode</Label>
                        <Input
                          id="categoryCode"
                          value={editFormData.categoryCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription">categoryDescription</Label>
                        <Textarea
                          id="categoryDescription"
                          value={editFormData.categoryDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, categoryDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeId">paperTypeId</Label>
                        <Input
                          id="paperTypeId"
                          value={editFormData.paperTypeId || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeName">paperTypeName</Label>
                        <Input
                          id="paperTypeName"
                          value={editFormData.paperTypeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeCode">paperTypeCode</Label>
                        <Input
                          id="paperTypeCode"
                          value={editFormData.paperTypeCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperTypeDescription">paperTypeDescription</Label>
                        <Textarea
                          id="paperTypeDescription"
                          value={editFormData.paperTypeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperTypeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeCode">itemTypeCode</Label>
                        <Input
                          id="itemTypeCode"
                          value={editFormData.itemTypeCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeName">itemTypeName</Label>
                        <Input
                          id="itemTypeName"
                          value={editFormData.itemTypeName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemTypeDescription">itemTypeDescription</Label>
                        <Textarea
                          id="itemTypeDescription"
                          value={editFormData.itemTypeDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemTypeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemFormat">itemFormat</Label>
                        <Input
                          id="itemFormat"
                          value={editFormData.itemFormat || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, itemFormat: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Currency & Denomination */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      Currency & Denomination
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="currencyCode">currencyCode</Label>
                        <Input
                          id="currencyCode"
                          value={editFormData.currencyCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencyName">currencyName</Label>
                        <Input
                          id="currencyName"
                          value={editFormData.currencyName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencySymbol">currencySymbol</Label>
                        <Input
                          id="currencySymbol"
                          value={editFormData.currencySymbol || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencySymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currencyDescription">currencyDescription</Label>
                        <Textarea
                          id="currencyDescription"
                          value={editFormData.currencyDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, currencyDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationValue">denominationValue</Label>
                        <Input
                          id="denominationValue"
                          value={editFormData.denominationValue || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationValue: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationSymbol">denominationSymbol</Label>
                        <Input
                          id="denominationSymbol"
                          value={editFormData.denominationSymbol || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationSymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationDisplay">denominationDisplay</Label>
                        <Input
                          id="denominationDisplay"
                          value={editFormData.denominationDisplay || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationDisplay: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="denominationDescription">denominationDescription</Label>
                        <Textarea
                          id="denominationDescription"
                          value={editFormData.denominationDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, denominationDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Characteristics */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      Physical Characteristics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="colorCode">colorCode</Label>
                        <Input
                          id="colorCode"
                          value={editFormData.colorCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorName">colorName</Label>
                        <Input
                          id="colorName"
                          value={editFormData.colorName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorHex">colorHex</Label>
                        <Input
                          id="colorHex"
                          value={editFormData.colorHex || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorDescription">colorDescription</Label>
                        <Textarea
                          id="colorDescription"
                          value={editFormData.colorDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="colorVariant">colorVariant</Label>
                        <Input
                          id="colorVariant"
                          value={editFormData.colorVariant || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, colorVariant: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperCode">paperCode</Label>
                        <Input
                          id="paperCode"
                          value={editFormData.paperCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperName">paperName</Label>
                        <Input
                          id="paperName"
                          value={editFormData.paperName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperDescription">paperDescription</Label>
                        <Textarea
                          id="paperDescription"
                          value={editFormData.paperDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperFiber">paperFiber</Label>
                        <Input
                          id="paperFiber"
                          value={editFormData.paperFiber || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperFiber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperThickness">paperThickness</Label>
                        <Input
                          id="paperThickness"
                          value={editFormData.paperThickness || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperThickness: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paperOpacity">paperOpacity</Label>
                        <Input
                          id="paperOpacity"
                          value={editFormData.paperOpacity || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, paperOpacity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkCode">watermarkCode</Label>
                        <Input
                          id="watermarkCode"
                          value={editFormData.watermarkCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkName">watermarkName</Label>
                        <Input
                          id="watermarkName"
                          value={editFormData.watermarkName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkDescription">watermarkDescription</Label>
                        <Textarea
                          id="watermarkDescription"
                          value={editFormData.watermarkDescription || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkPosition">watermarkPosition</Label>
                        <Input
                          id="watermarkPosition"
                          value={editFormData.watermarkPosition || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkPosition: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="watermarkClarity">watermarkClarity</Label>
                        <Input
                          id="watermarkClarity"
                          value={editFormData.watermarkClarity || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkClarity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationCode">perforationCode</Label>
                        <Input
                          id="perforationCode"
                          value={editFormData.perforationCode || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationName">perforationName</Label>
                        <Input
                          id="perforationName"
                          value={editFormData.perforationName || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationMeasurement">perforationMeasurement</Label>
                        <Input
                          id="perforationMeasurement"
                          value={editFormData.perforationMeasurement || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationMeasurement: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationGauge">perforationGauge</Label>
                        <Input
                          id="perforationGauge"
                          value={editFormData.perforationGauge || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, perforationGauge: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationCleanCut">perforationCleanCut</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perforationCleanCut"
                            checked={editFormData.perforationCleanCut || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, perforationCleanCut: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perforationComb">perforationComb</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="perforationComb"
                            checked={editFormData.perforationComb || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, perforationComb: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issue & Date Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Issue & Date Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="issueDate">issueDate</Label>
                        <Input
                          id="issueDate"
                          value={editFormData.issueDate || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueYear">issueYear</Label>
                        <Input
                          id="issueYear"
                          type="number"
                          value={editFormData.issueYear || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueMonth">issueMonth</Label>
                        <Input
                          id="issueMonth"
                          type="number"
                          value={editFormData.issueMonth || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueMonth: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueDay">issueDay</Label>
                        <Input
                          id="issueDay"
                          type="number"
                          value={editFormData.issueDay || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueDay: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstDayIssue">firstDayIssue</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="firstDayIssue"
                            checked={editFormData.firstDayIssue || false}
                            onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, firstDayIssue: checked as boolean }))}
                            disabled={selectedStamp?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodStart">periodStart</Label>
                        <Input
                          id="periodStart"
                          type="number"
                          value={editFormData.periodStart || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, periodStart: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="periodEnd">periodEnd</Label>
                        <Input
                          id="periodEnd"
                          type="number"
                          value={editFormData.periodEnd || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, periodEnd: Number(e.target.value) }))}
                          disabled={selectedStamp?.isPublished}
                          className={selectedStamp?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuePurpose">issuePurpose</Label>
                        <Input
                          id="issuePurpose"
                          value={editFormData.issuePurpose || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issuePurpose: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueContext">issueContext</Label>
                        <Textarea
                          id="issueContext"
                          value={editFormData.issueContext || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, issueContext: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical & JSON Data */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">⚙️</span>
                      Technical & JSON Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="stampVectorJson">stampVectorJson</Label>
                        <Textarea
                          id="stampVectorJson"
                          value={editFormData.stampVectorJson || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampVectorJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampDetailsJson">stampDetailsJson</Label>
                        <Textarea
                          id="stampDetailsJson"
                          value={editFormData.stampDetailsJson || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, stampDetailsJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternativeNames">alternativeNames</Label>
                        <Textarea
                          id="alternativeNames"
                          value={editFormData.alternativeNames || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, alternativeNames: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plateFlaws">plateFlaws</Label>
                        <Textarea
                          id="plateFlaws"
                          value={editFormData.plateFlaws || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, plateFlaws: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recentSales">recentSales</Label>
                        <Textarea
                          id="recentSales"
                          value={editFormData.recentSales || ""}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, recentSales: e.target.value }))}
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stampImageVariants">stampImageVariants (JSON Array)</Label>
                        <Textarea
                          id="stampImageVariants"
                          value={editFormData.stampImageVariants ? JSON.stringify(editFormData.stampImageVariants, null, 2) : ""}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value || "[]");
                              setEditFormData(prev => ({ ...prev, stampImageVariants: Array.isArray(parsed) ? parsed : [] }));
                            } catch {
                              // Invalid JSON, keep as string for now
                              setEditFormData(prev => ({ ...prev, stampImageVariants: [] }));
                            }
                          }}
                          rows={4}
                          className="font-mono text-xs"
                          placeholder="Enter JSON array of image variants"
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          )}

          {/* Stamp Instances Table */}
          {selectedStamp && (
            <div className="mt-8 bg-muted/10 rounded-xl p-6 border">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6" />
                Stamp Instances
                {isLoadingInstances && (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                )}
              </h3>

              {isLoadingInstances ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading instances...</span>
                </div>
              ) : stampInstances.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No instances found for this stamp.</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                        <TableHead className="w-[60px] font-semibold">Page</TableHead>
                        <TableHead className="min-w-[200px] max-w-[250px] font-semibold">Stamp</TableHead>
                        <TableHead className="w-[120px] font-semibold">Country</TableHead>
                        <TableHead className="w-[80px] font-semibold">Year</TableHead>
                        <TableHead className="w-[120px] font-semibold">Catalog Number</TableHead>
                        <TableHead className="w-[140px] font-semibold">Stamp Code</TableHead>
                        <TableHead className="w-[100px] font-semibold">Denomination</TableHead>
                        <TableHead className="w-[120px] font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stampInstances.map((instance) => (
                        <TableRow key={instance.id}>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditInstance(instance)}
                                title="Edit Instance"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenInstanceDeleteDialog(instance)}
                                title="Delete Instance"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="w-[60px]">
                            <Badge variant="outline" className="font-mono">
                              {instance.pageNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={instance.name}>
                              {instance.name}
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{instance.country}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span>{instance.issueYear}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={instance.catalogNumber}>
                              <Badge variant="outline" className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{instance.catalogNumber}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="w-[140px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={instance.stampCatalogCode}>
                              <Badge className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{instance.stampCatalogCode}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium w-[100px] whitespace-nowrap">
                            {formatDenomination(instance.denominationValue, instance.denominationSymbol)}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {instance.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isUpdating || selectedStamp?.isPublished}
              size="lg"
              className="px-6"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Stamp
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
                size="lg"
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveStamp}
                disabled={isUpdating || selectedStamp?.isPublished}
                size="lg"
                className="px-6"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Stamp
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this stamp? This action cannot be undone.
              <br />
              <br />
              <strong>Stamp:</strong> {selectedStamp?.name}
              <br />
              <strong>Catalog Number:</strong> {selectedStamp?.catalogNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStamp}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Stamp
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Publish Notes Modal */}
      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Approve Stamp for Publication
            </DialogTitle>
            <DialogDescription>
              Please provide publish notes before approving this stamp for publication.
              <br />
              <br />
              <strong>Stamp:</strong> {stampToApprove?.name}
              <br />
              <strong>Catalog Number:</strong> {stampToApprove?.catalogNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="publishNotes" className="text-sm font-medium">
                Publish Notes <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="publishNotes"
                value={publishNotes}
                onChange={(e) => setPublishNotes(e.target.value)}
                placeholder="Enter notes about why this stamp is being approved for publication..."
                rows={4}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                These notes will be saved with the stamp approval and cannot be changed later.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsPublishModalOpen(false)
                setStampToApprove(null)
                setPublishNotes("")
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApproveStamp}
              disabled={isUpdating || !publishNotes.trim()}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Stamp
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instance Edit Modal */}
      <Dialog open={isInstanceEditModalOpen} onOpenChange={setIsInstanceEditModalOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Stamp Instance
            </DialogTitle>
            <DialogDescription>
              Modify the details of this stamp instance
            </DialogDescription>
          </DialogHeader>

          {selectedInstance && (
            <div className="space-y-8">
              {/* Top Section: Image and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stamp Image */}
                <div className="lg:col-span-1">
                  <div className="sticky top-0">
                    <div className="aspect-square bg-muted rounded-xl flex items-center justify-center shadow-sm">
                      {selectedInstance.stampImageUrl ? (
                        <img
                          src={selectedInstance.stampImageUrl}
                          alt={selectedInstance.name}
                          className="max-w-full max-h-full object-contain rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageIcon className="h-16 w-16 mx-auto mb-3" />
                          <p className="text-sm font-medium">No image available</p>
                        </div>
                      )}
                      <div className="hidden text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-3" />
                        <p className="text-sm font-medium">Image not available</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information Summary */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-muted/30 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Instance Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-sm font-medium">{selectedInstance.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Catalog Number</label>
                          <p className="text-sm font-mono">{selectedInstance.catalogNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <p className="text-sm">{selectedInstance.country}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Issue Year</label>
                          <p className="text-sm">{selectedInstance.issueYear}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Denomination</label>
                          <p className="text-sm font-medium">
                            {selectedInstance.denominationValue || 0}{selectedInstance.denominationSymbol}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Series</label>
                          <p className="text-sm">{selectedInstance.seriesName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            {selectedInstance.isPublished ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Condition</label>
                          <p className="text-sm">{selectedInstance.condition || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Form Sections - Same as Base Stamp */}
              <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instance-id">ID</Label>
                    <Input
                      id="instance-id"
                      value={instanceEditFormData.id || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-name">name</Label>
                        <Input
                          id="instance-name"
                          value={instanceEditFormData.name || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-catalogNumber">catalogNumber</Label>
                        <Input
                          id="instance-catalogNumber"
                          value={instanceEditFormData.catalogNumber || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-country">country</Label>
                        <Input
                          id="instance-country"
                          value={instanceEditFormData.country || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, country: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueYear">issueYear</Label>
                        <Input
                          id="instance-issueYear"
                          type="number"
                          value={instanceEditFormData.issueYear || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-condition">condition</Label>
                        <Input
                          id="instance-condition"
                          value={instanceEditFormData.condition || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, condition: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-description">description</Label>
                        <Textarea
                          id="instance-description"
                          value={instanceEditFormData.description || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-instanceDescription">instanceDescription</Label>
                        <Textarea
                          id="instance-instanceDescription"
                          value={instanceEditFormData.instanceDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, instanceDescription: e.target.value }))}
                          rows={3}
                        />
                      </div>
                </div>
              </div>

                  {/* Stamp Image Upload */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Stamp Image Upload
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampFileAttachment">Upload New Stamp Image</Label>
                        <Input
                          id="instance-stampFileAttachment"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setInstanceEditFormData(prev => ({
                                ...prev,
                                stampFileAttachment: file
                              }))
                            }
                          }}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a new image to replace the current stamp image. Supported formats: JPG, PNG, GIF, WebP
                        </p>
                        {instanceEditFormData.stampFileAttachment && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <ImageIcon className="h-4 w-4" />
                            <span className="text-sm">
                              Selected: {(instanceEditFormData.stampFileAttachment as File).name}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setInstanceEditFormData(prev => ({
                                ...prev,
                                stampFileAttachment: undefined
                              }))}
                              disabled={selectedInstance?.isPublished}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Country & Geographic Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Country & Geographic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-countryName">countryName</Label>
                        <Input
                          id="instance-countryName"
                          value={instanceEditFormData.countryName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, countryName: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-countryFlag">countryFlag</Label>
                        <Input
                          id="instance-countryFlag"
                          value={instanceEditFormData.countryFlag || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, countryFlag: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueLocation">issueLocation</Label>
                        <Input
                          id="instance-issueLocation"
                          value={instanceEditFormData.issueLocation || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueLocation: e.target.value }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Series & Classification */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Series & Classification
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-seriesId">seriesId</Label>
                        <Input
                          id="instance-seriesId"
                          value={instanceEditFormData.seriesId || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-seriesName">seriesName</Label>
                        <Input
                          id="instance-seriesName"
                          value={instanceEditFormData.seriesName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, seriesName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-seriesDescription">seriesDescription</Label>
                        <Textarea
                          id="instance-seriesDescription"
                          value={instanceEditFormData.seriesDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, seriesDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-typeId">typeId</Label>
                        <Input
                          id="instance-typeId"
                          value={instanceEditFormData.typeId || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, typeId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-typeName">typeName</Label>
                        <Input
                          id="instance-typeName"
                          value={instanceEditFormData.typeName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, typeName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-typeDescription">typeDescription</Label>
                        <Textarea
                          id="instance-typeDescription"
                          value={instanceEditFormData.typeDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, typeDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampGroupId">stampGroupId</Label>
                        <Input
                          id="instance-stampGroupId"
                          value={instanceEditFormData.stampGroupId || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, stampGroupId: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampGroupName">stampGroupName</Label>
                        <Input
                          id="instance-stampGroupName"
                          value={instanceEditFormData.stampGroupName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, stampGroupName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampGroupDescription">stampGroupDescription</Label>
                        <Textarea
                          id="instance-stampGroupDescription"
                          value={instanceEditFormData.stampGroupDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, stampGroupDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Currency & Denomination */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      Currency & Denomination
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-currencyCode">currencyCode</Label>
                        <Input
                          id="instance-currencyCode"
                          value={instanceEditFormData.currencyCode || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, currencyCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-currencyName">currencyName</Label>
                        <Input
                          id="instance-currencyName"
                          value={instanceEditFormData.currencyName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, currencyName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-currencySymbol">currencySymbol</Label>
                        <Input
                          id="instance-currencySymbol"
                          value={instanceEditFormData.currencySymbol || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, currencySymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-currencyDescription">currencyDescription</Label>
                        <Textarea
                          id="instance-currencyDescription"
                          value={instanceEditFormData.currencyDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, currencyDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-denominationValue">denominationValue</Label>
                        <Input
                          id="instance-denominationValue"
                          type="number"
                          value={instanceEditFormData.denominationValue ?? ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, denominationValue: e.target.value === "" ? undefined : Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-denominationSymbol">denominationSymbol</Label>
                        <Input
                          id="instance-denominationSymbol"
                          value={instanceEditFormData.denominationSymbol || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, denominationSymbol: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-denominationDisplay">denominationDisplay</Label>
                        <Input
                          id="instance-denominationDisplay"
                          value={instanceEditFormData.denominationDisplay || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, denominationDisplay: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-denominationDescription">denominationDescription</Label>
                        <Textarea
                          id="instance-denominationDescription"
                          value={instanceEditFormData.denominationDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, denominationDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Characteristics */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      Physical Characteristics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-colorCode">colorCode</Label>
                        <Input
                          id="instance-colorCode"
                          value={instanceEditFormData.colorCode || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-colorName">colorName</Label>
                        <Input
                          id="instance-colorName"
                          value={instanceEditFormData.colorName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, colorName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-colorHex">colorHex</Label>
                        <Input
                          id="instance-colorHex"
                          value={instanceEditFormData.colorHex || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-colorDescription">colorDescription</Label>
                        <Textarea
                          id="instance-colorDescription"
                          value={instanceEditFormData.colorDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, colorDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-colorVariant">colorVariant</Label>
                        <Input
                          id="instance-colorVariant"
                          value={instanceEditFormData.colorVariant || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, colorVariant: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperCode">paperCode</Label>
                        <Input
                          id="instance-paperCode"
                          value={instanceEditFormData.paperCode || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperName">paperName</Label>
                        <Input
                          id="instance-paperName"
                          value={instanceEditFormData.paperName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperDescription">paperDescription</Label>
                        <Textarea
                          id="instance-paperDescription"
                          value={instanceEditFormData.paperDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperFiber">paperFiber</Label>
                        <Input
                          id="instance-paperFiber"
                          value={instanceEditFormData.paperFiber || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperFiber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperThickness">paperThickness</Label>
                        <Input
                          id="instance-paperThickness"
                          value={instanceEditFormData.paperThickness || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperThickness: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-paperOpacity">paperOpacity</Label>
                        <Input
                          id="instance-paperOpacity"
                          value={instanceEditFormData.paperOpacity || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, paperOpacity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-watermarkCode">watermarkCode</Label>
                        <Input
                          id="instance-watermarkCode"
                          value={instanceEditFormData.watermarkCode || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, watermarkCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-watermarkName">watermarkName</Label>
                        <Input
                          id="instance-watermarkName"
                          value={instanceEditFormData.watermarkName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, watermarkName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-watermarkDescription">watermarkDescription</Label>
                        <Textarea
                          id="instance-watermarkDescription"
                          value={instanceEditFormData.watermarkDescription || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, watermarkDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-watermarkPosition">watermarkPosition</Label>
                        <Input
                          id="instance-watermarkPosition"
                          value={instanceEditFormData.watermarkPosition || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, watermarkPosition: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-watermarkClarity">watermarkClarity</Label>
                        <Input
                          id="instance-watermarkClarity"
                          value={instanceEditFormData.watermarkClarity || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, watermarkClarity: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationCode">perforationCode</Label>
                        <Input
                          id="instance-perforationCode"
                          value={instanceEditFormData.perforationCode || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, perforationCode: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationName">perforationName</Label>
                        <Input
                          id="instance-perforationName"
                          value={instanceEditFormData.perforationName || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, perforationName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationMeasurement">perforationMeasurement</Label>
                        <Input
                          id="instance-perforationMeasurement"
                          value={instanceEditFormData.perforationMeasurement || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, perforationMeasurement: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationGauge">perforationGauge</Label>
                        <Input
                          id="instance-perforationGauge"
                          value={instanceEditFormData.perforationGauge || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, perforationGauge: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationCleanCut">perforationCleanCut</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="instance-perforationCleanCut"
                            checked={instanceEditFormData.perforationCleanCut || false}
                            onCheckedChange={(checked) => setInstanceEditFormData(prev => ({ ...prev, perforationCleanCut: checked as boolean }))}
                            disabled={selectedInstance?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-perforationComb">perforationComb</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="instance-perforationComb"
                            checked={instanceEditFormData.perforationComb || false}
                            onCheckedChange={(checked) => setInstanceEditFormData(prev => ({ ...prev, perforationComb: checked as boolean }))}
                            disabled={selectedInstance?.isPublished}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issue & Date Information */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Issue & Date Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueDate">issueDate</Label>
                        <Input
                          id="instance-issueDate"
                          value={instanceEditFormData.issueDate || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueYear">issueYear</Label>
                        <Input
                          id="instance-issueYear"
                          type="number"
                          value={instanceEditFormData.issueYear || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueMonth">issueMonth</Label>
                        <Input
                          id="instance-issueMonth"
                          type="number"
                          value={instanceEditFormData.issueMonth || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueMonth: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueDay">issueDay</Label>
                        <Input
                          id="instance-issueDay"
                          type="number"
                          value={instanceEditFormData.issueDay || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueDay: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-firstDayIssue">firstDayIssue</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="instance-firstDayIssue"
                            checked={instanceEditFormData.firstDayIssue || false}
                            onCheckedChange={(checked) => setInstanceEditFormData(prev => ({ ...prev, firstDayIssue: checked as boolean }))}
                            disabled={selectedInstance?.isPublished}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-periodStart">periodStart</Label>
                        <Input
                          id="instance-periodStart"
                          type="number"
                          value={instanceEditFormData.periodStart || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, periodStart: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-periodEnd">periodEnd</Label>
                        <Input
                          id="instance-periodEnd"
                          type="number"
                          value={instanceEditFormData.periodEnd || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, periodEnd: Number(e.target.value) }))}
                          disabled={selectedInstance?.isPublished}
                          className={selectedInstance?.isPublished ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issuePurpose">issuePurpose</Label>
                        <Input
                          id="instance-issuePurpose"
                          value={instanceEditFormData.issuePurpose || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issuePurpose: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-issueContext">issueContext</Label>
                        <Textarea
                          id="instance-issueContext"
                          value={instanceEditFormData.issueContext || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, issueContext: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical & JSON Data */}
                  <div className="bg-muted/20 rounded-xl p-6 border">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <span className="text-lg">⚙️</span>
                      Technical & JSON Data
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampVectorJson">stampVectorJson</Label>
                        <Textarea
                          id="instance-stampVectorJson"
                          value={instanceEditFormData.stampVectorJson || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, stampVectorJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampDetailsJson">stampDetailsJson</Label>
                        <Textarea
                          id="instance-stampDetailsJson"
                          value={instanceEditFormData.stampDetailsJson || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, stampDetailsJson: e.target.value }))}
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-alternativeNames">alternativeNames</Label>
                        <Textarea
                          id="instance-alternativeNames"
                          value={instanceEditFormData.alternativeNames || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, alternativeNames: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-plateFlaws">plateFlaws</Label>
                        <Textarea
                          id="instance-plateFlaws"
                          value={instanceEditFormData.plateFlaws || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, plateFlaws: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-recentSales">recentSales</Label>
                        <Textarea
                          id="instance-recentSales"
                          value={instanceEditFormData.recentSales || ""}
                          onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, recentSales: e.target.value }))}
                          rows={4}
                          className="font-mono text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instance-stampImageVariants">stampImageVariants (JSON Array)</Label>
                        <Textarea
                          id="instance-stampImageVariants"
                          value={instanceEditFormData.stampImageVariants ? JSON.stringify(instanceEditFormData.stampImageVariants, null, 2) : ""}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value || "[]");
                              setInstanceEditFormData(prev => ({ ...prev, stampImageVariants: Array.isArray(parsed) ? parsed : [] }));
                            } catch {
                              // Invalid JSON, keep as string for now
                              setInstanceEditFormData(prev => ({ ...prev, stampImageVariants: [] }));
                            }
                          }}
                          rows={4}
                          className="font-mono text-xs"
                          placeholder="Enter JSON array of image variants"
                        />
                      </div>
                    </div>
                  </div>

              {/* Instance Status */}
              <div className="bg-muted/20 rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Status & Publishing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instance-isPublished">Published Status</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="instance-isPublished"
                        checked={instanceEditFormData.isPublished || false}
                        onCheckedChange={(checked) => setInstanceEditFormData(prev => ({ ...prev, isPublished: checked as boolean }))}
                      />
                      <span className="text-sm">Published</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instance-publishNotes">Publish Notes</Label>
                    <Textarea
                      id="instance-publishNotes"
                      value={instanceEditFormData.publishNotes || ""}
                      onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, publishNotes: e.target.value }))}
                      rows={2}
                      placeholder="Notes about publishing this instance..."
                    />
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t">
            <Button
              variant="destructive"
              onClick={() => setIsInstanceDeleteDialogOpen(true)}
              disabled={isUpdatingInstance || selectedInstance?.isPublished}
              size="lg"
              className="px-6"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Instance
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsInstanceEditModalOpen(false)}
                disabled={isUpdatingInstance}
                size="lg"
                className="px-6"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveInstance}
                disabled={isUpdatingInstance || selectedInstance?.isPublished}
                size="lg"
                className="px-6"
              >
                {isUpdatingInstance ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instance Delete Confirmation Dialog */}
      <Dialog open={isInstanceDeleteDialogOpen} onOpenChange={setIsInstanceDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Stamp Instance
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this stamp instance? This action cannot be undone.
              <br />
              <br />
              <strong>Instance:</strong> {instanceToDelete?.name}
              <br />
              <strong>Catalog Number:</strong> {instanceToDelete?.catalogNumber}
              <br />
              <strong>Condition:</strong> {instanceToDelete?.condition || 'Not specified'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsInstanceDeleteDialogOpen(false)}
              disabled={isDeletingInstance}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInstance}
              disabled={isDeletingInstance}
            >
              {isDeletingInstance ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Instance
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
