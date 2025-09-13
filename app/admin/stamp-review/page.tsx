"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  ChevronUp,
  ChevronDown,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Trash2,
  AlertTriangle,
  Upload,
  Copy,
  FileText,
  DollarSign,
  Download,
} from "lucide-react"

// API Response Types
interface StampReviewItem {
  id: string
  catalogExtractionProcessId: string
  stampCatalogCode: string
  categoryCode?: string
  subCategoryCode?: string
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
  publishedBy?: string
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
  isInstance?: boolean
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
  typeName?: string
  stampGroupName?: string
  categoryCode?: string
  subCategoryCode?: string
  itemTypeCode?: string
  itemTypeName?: string
  currencyCode?: string
  currencyName?: string
  currencySymbol?: string
  denominationDisplay?: string
  colorCode?: string
  colorName?: string
  colorHex?: string
  colorGroup?: string
  paperCode?: string
  paperName?: string
  paperOrientation?: string
  watermarkCode?: string
  watermarkName?: string
  watermarkPosition?: string
  perforationCode?: string
  perforationName?: string
  perforationMeasurement?: string
  periodStart?: number
  periodEnd?: number
  stampVectorJson?: string
  stampDetailsJson?: string
  recentSales?: string
  stampImageVariants?: any[]
}

// Import the actual StampMasterCatalogItem type
import type { StampMasterCatalogItem } from "@/lib/api/stamp-master-catalog"
import { strict } from "assert"

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
  'stampId': 'StampId',
  'isInstance': 'IsInstance',
  'parentStampId': 'ParentStampId',
  'catalogNumber': 'CatalogNumber',
  'name': 'Name',
  'description': 'Description',
  'country': 'Country',
  'countryName': 'CountryName',
  'seriesName': 'SeriesName',
  'typeName': 'TypeName',
  'stampGroupName': 'StampGroupName',
  'categoryCode': 'CategoryCode',
  'currencyCode': 'CurrencyCode',
  'currencyName': 'CurrencyName',
  'currencySymbol': 'CurrencySymbol',
  'denominationValue': 'DenominationValue',
  'denominationSymbol': 'DenominationSymbol',
  'denominationDisplay': 'DenominationDisplay',
  'colorCode': 'ColorCode',
  'colorName': 'ColorName',
  'colorHex': 'ColorHex',
  'colorGroup': 'ColorGroup',
  'paperCode': 'PaperCode',
  'paperName': 'PaperName',
  'paperOrientation': 'PaperOrientation',
  'watermarkCode': 'WatermarkCode',
  'watermarkName': 'WatermarkName',
  'watermarkPosition': 'WatermarkPosition',
  'perforationCode': 'PerforationCode',
  'perforationName': 'PerforationName',
  'perforationMeasurement': 'PerforationMeasurement',
  'itemTypeCode': 'ItemTypeCode',
  'itemTypeName': 'ItemTypeName',
  'issueDate': 'IssueDate',
  'issueYear': 'IssueYear',
  'periodStart': 'PeriodStart',
  'periodEnd': 'PeriodEnd',
  'printingMethod': 'PrintingMethod',
  'printer': 'Printer',
  'engraver': 'Engraver',
  'gumCondition': 'GumCondition',
  'sizeWidth': 'SizeWidth',
  'sizeHeight': 'SizeHeight',
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
  'stampVector': 'StampVector',
  'stampDetailsJson': 'StampDetailsJson',
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

// Define user data type
interface UserData {
  id: string;
  roleId: string | null;
  roleName: string;
  membershipCode: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  email: string;
  mobileNumber: string;
  isDisabled: boolean;
  isDeleted: boolean;
  forcePasswordChange: boolean;
  avatarUrl: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  usernameType: number;
}

const userData: Record<string, UserData> = [
  {
    "id": "04675eed-f1dc-4ffb-bd2f-295b1d42df80",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "harshit.joshi@3pm.nz",
    "firstName": "Sunny",
    "lastName": "Satmp",
    "dateOfBirth": null,
    "email": "harshit.joshi@3pm.nz",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "ba57f0b0-5382-4abc-a11b-8ddef7c39f65",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "snehdecoded@gmail.com",
    "firstName": "Sneh",
    "lastName": "Decoded",
    "dateOfBirth": null,
    "email": "snehdecoded@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "0ce0e911-3458-4161-aa74-8f1a01c792c5",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "hjoshi85@gmail.com",
    "firstName": "harshit",
    "lastName": "BackendTesting",
    "dateOfBirth": null,
    "email": "hjoshi85@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "d171d254-3842-43ce-a195-0cdd3995b80b",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "jaimin.galiya@decoded.digital",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "jaimin.galiya@decoded.digital",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "fa27cc01-46a9-49fb-9643-2bdea0348f03",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "hcjoshi56@gmail.com",
    "firstName": "Sunny",
    "lastName": "Jo",
    "dateOfBirth": null,
    "email": "hcjoshi56@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "e2da1c39-4937-42cc-a5fb-4ae3418a5506",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "test3pmauk@gmail.com",
    "firstName": "Test 11",
    "lastName": "3pm",
    "dateOfBirth": "2025-08-07T00:00:00Z",
    "email": "test3pmauk@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "23678f06-02ed-48f1-8590-1a5e4b83fa0c",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "phil@wasabi.ws",
    "firstName": "Phillip",
    "lastName": "Wesley-Brown",
    "dateOfBirth": null,
    "email": "phil@wasabi.ws",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "03e03a9b-cb22-4a44-95c2-e71040265f2e",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "harshit.upgrade@gmail.com",
    "firstName": "Harshit",
    "lastName": "Joshi",
    "dateOfBirth": null,
    "email": "harshit.upgrade@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "bb64cce1-7f24-48be-ac57-12670b6f358c",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "hetal.pabari@decoded.digital",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "hetal.pabari@decoded.digital",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "b4bd29f3-a58d-4d9c-8015-34af3aabad43",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "shahn346@gmail.com",
    "firstName": "Shah",
    "lastName": "Tariq",
    "dateOfBirth": null,
    "email": "shahn346@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "d67236d8-bc48-4f48-a855-71727d6e5549",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "shivneel.rattan@decoded.digital",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "shivneel.rattan@decoded.digital",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "8f6ec513-2bea-473f-92ea-ba9e2bfbbb50",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "harshit.upgrade@gmnail.com",
    "firstName": "Harshit",
    "lastName": "Admin",
    "dateOfBirth": null,
    "email": "harshit.upgrade@gmnail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "82b1da69-ef47-45b9-9180-67b9917b37ef",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "bjburgs@gmail.com",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "bjburgs@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "ebab7cd4-1a46-4aa3-8c2f-1fcd09116b99",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "qatenant3pm@gmail.com",
    "firstName": "QA",
    "lastName": "Tenant",
    "dateOfBirth": null,
    "email": "qatenant3pm@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "f6a0fea8-d74d-43ea-b2cc-fa30aabe9188",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "andrew@3pm.nz",
    "firstName": "Andrew",
    "lastName": "Radcliffe",
    "dateOfBirth": "1979-08-15T00:00:00Z",
    "email": "andrew@3pm.nz",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "https://decodedstampstorage01.blob.core.windows.net/decoded-stamp/prod/userprofile/7f06ad67-6b2b-4afb-8647-5614f04ce242_Andrew%20Profile.jpg",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "957e01a5-6146-4806-8569-693c9419ba1b",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "naxdsolutions@gmail.com",
    "firstName": "Harshit",
    "lastName": "Decoded",
    "dateOfBirth": null,
    "email": "naxdsolutions@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "bac8d587-555f-43d5-8d0d-669273333168",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "admin@3pm.nz",
    "firstName": "Super",
    "lastName": "Admin",
    "dateOfBirth": null,
    "email": "admin@3pm.nz",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "6d41e553-fb55-476a-b8a7-8585714785ab",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "chirag.fabiyani@decoded.digital",
    "firstName": "Chirag",
    "lastName": "Fabiyani",
    "dateOfBirth": null,
    "email": "chirag.fabiyani@decoded.digital",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "2f709507-a9ee-42ad-92c1-7b0839e43a0b",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "chiragfabiyani.cf@gmail.com",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "chiragfabiyani.cf@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "0ca8df81-0acc-43d1-a8ff-5fb971bc46ad",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "berri@berrischroder.nz",
    "firstName": "Collector",
    "lastName": "",
    "dateOfBirth": null,
    "email": "berri@berrischroder.nz",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "bba14a9c-e7c1-4715-aedc-6cb3bbe18e9f",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "jaimin8460@gmail.com",
    "firstName": "Jaimin",
    "lastName": "Galiya",
    "dateOfBirth": null,
    "email": "jaimin8460@gmail.com",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  },
  {
    "id": "933db401-0f7f-445a-810b-56d1b14386d9",
    "roleId": null,
    "roleName": "",
    "membershipCode": "",
    "userName": "harshit.joshi@decoded.digital",
    "firstName": "Harshit",
    "lastName": "Admin",
    "dateOfBirth": null,
    "email": "harshit.joshi@decoded.digital",
    "mobileNumber": "",
    "isDisabled": false,
    "isDeleted": false,
    "forcePasswordChange": false,
    "avatarUrl": "",
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "usernameType": 0
  }
].reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {} as Record<string, UserData>)

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

const createStampInstance = async (instanceData: Partial<StampInstanceItem>): Promise<StampInstanceItem> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  // Convert the instance data to FormData with PascalCase keys
  const formData = convertToFormData(instanceData)

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog`,
    {
      method: "POST",
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

// Generate UUID function
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const createStamp = async (stampData: Partial<EditableStampData>): Promise<StampReviewItem> => {
  const jwt = getJWT()
  if (!jwt) {
    throw new Error("Authentication required. Please log in again.")
  }

  // Generate new UUIDs for stampId and parentStampId
  const newStampId = generateUUID()
  const newParentStampId = generateUUID()

  // Prepare the stamp data with generated IDs and required fields
  const stampToCreate = {
    ...stampData,
    stampId: newStampId,
    parentStampId: newParentStampId,
    // Ensure required fields have default values
    catalogExtractionProcessId: stampData.catalogExtractionProcessId || "254c793b-16d0-40a3-8b10-66d987b54474",
    isInstance: false, // New stamps are not instances
    isPublished: false, // New stamps start unpublished
  }

  // Convert the stamp data to FormData with PascalCase keys
  const formData = convertToFormData(stampToCreate)

  const response = await fetch(
    `https://decoded-app-stamp-api-prod-01.azurewebsites.net/api/v1/StampMasterCatalog`,
    {
      method: "POST",
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

  // Sorting states
  const [sortField, setSortField] = useState<'pageNumber' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Modal states
  const [selectedStamp, setSelectedStamp] = useState<EditableStampData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<EditableStampData>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Duplicate modal states
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [duplicateFormData, setDuplicateFormData] = useState<Partial<EditableStampData>>({})
  const [isDuplicating, setIsDuplicating] = useState(false)

  // Stamp instances states
  const [stampInstances, setStampInstances] = useState<StampInstanceItem[]>([])
  const [isLoadingInstances, setIsLoadingInstances] = useState(false)

  // Import instances states
  const [isImportingInstances, setIsImportingInstances] = useState(false)
  const [importStampId, setImportStampId] = useState("")
  const [showImportForm, setShowImportForm] = useState(false)

  // Inline editing states for instances
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(null)
  const [editingInstanceData, setEditingInstanceData] = useState<Partial<StampInstanceItem>>({})
  const [isUpdatingInstanceInline, setIsUpdatingInstanceInline] = useState(false)

  // Instance edit states
  const [selectedInstance, setSelectedInstance] = useState<StampInstanceItem | null>(null)
  const [isInstanceEditModalOpen, setIsInstanceEditModalOpen] = useState(false)
  const [instanceEditFormData, setInstanceEditFormData] = useState<Partial<StampInstanceItem>>({})
  const [createInstanceFormData, setCreateInstanceFormData] = useState<Partial<StampInstanceItem>>({})
  const [isUpdatingInstance, setIsUpdatingInstance] = useState(false)

  // Instance delete states
  const [isInstanceDeleteDialogOpen, setIsInstanceDeleteDialogOpen] = useState(false)
  const [isCreateInstanceDialogOpen, setIsCreateInstanceDialogOpen] = useState(false)
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

  // Handle opening duplicate modal
  const handleDuplicateStamp = (stamp: StampReviewItem) => {
    // Create a copy of the stamp data, excluding id and stampId
    const { id, stampId, ...stampDataToCopy } = stamp

    setSelectedStamp(stamp as unknown as EditableStampData)
    setDuplicateFormData({
      ...stampDataToCopy,
      // Set default values for the excluded fields
      isInstance: false, // New stamps are not instances by default
      isPublished: false, // New stamps start as unpublished
      publishNotes: "" // Clear publish notes
    } as unknown as Partial<EditableStampData>)
    setIsDuplicateModalOpen(true)
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
  const handleCreateInstance = async () => {
    if (!selectedStamp) return

    try {
      setIsUpdatingInstance(true)

      // Generate UUID for StampId
      const newStampId = crypto.randomUUID()

      // Prepare the instance data with prepopulated fields
      const instanceData = {
        ...createInstanceFormData,
        stampId: newStampId,
        parentStampId: selectedStamp.stampId,
        catalogExtractionProcessId: selectedStamp.catalogExtractionProcessId,
        pageNumber: (selectedStamp as any).pageNumber,
        isPublished: true,
        isInstance: true
      }

      const newInstance = await createStampInstance(instanceData)

      // Refresh the instances list
      if (selectedStamp.stampId) {
        const instances = await fetchStampInstances(selectedStamp.stampId)
        setStampInstances(instances)
      }

      // Reset form and close dialog
      setCreateInstanceFormData({})
      setIsCreateInstanceDialogOpen(false)

      toast({
        title: "Success",
        description: "Stamp instance created successfully.",
      })
    } catch (error) {
      console.error("Error creating instance:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create stamp instance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingInstance(false)
    }
  }

  const handleOpenCreateInstanceDialog = () => {
    if (!selectedStamp) return

    // Prepopulate form data
    setCreateInstanceFormData({
      name: selectedStamp.name,
      catalogNumber: selectedStamp.catalogNumber,
      // Other fields will be filled by user
    })
    setIsCreateInstanceDialogOpen(true)
  }

  const handleImportInstances = async () => {
    if (!selectedStamp || !importStampId.trim()) return

    try {
      setIsImportingInstances(true)

      // Fetch instances from the provided stampId
      const importedInstances = await fetchStampInstances(importStampId.trim())

      if (importedInstances.length === 0) {
        toast({
          title: "No Instances Found",
          description: `No instances found for stampId: ${importStampId}`,
          variant: "default",
        })
        return
      }

      // Create new stampId using UUID and update parentStampId to current stamp's stampId
      const currentStampId = selectedStamp.stampId || selectedStamp.id
      const updatedInstances = importedInstances.map(instance => ({
        ...instance,
        stampId: generateUUID(), // Generate new unique stampId for each instance
        parentStampId: currentStampId, // Set parentStampId to current stamp's stampId
        // Remove the id so it gets treated as a new instance
        id: undefined
      }))

      // Create each instance
      const createdInstances: StampInstanceItem[] = []
      for (const instance of updatedInstances) {
        try {
          const newInstance = await createStampInstance(instance)
          createdInstances.push(newInstance)
        } catch (error) {
          console.error(`Failed to create instance:`, error)
          // Continue with other instances even if one fails
        }
      }

      // Update local state with the newly created instances
      setStampInstances(prev => [...prev, ...createdInstances])

      toast({
        title: "Instances Imported Successfully",
        description: `Imported ${createdInstances.length} out of ${updatedInstances.length} instances.`,
        variant: "default",
      })

      // Reset the import form
      setImportStampId("")
      setShowImportForm(false)

    } catch (error) {
      console.error("Error importing instances:", error)
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import instances. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImportingInstances(false)
    }
  }

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

  // Inline editing functions for instances
  const handleStartInlineEdit = (instance: StampInstanceItem) => {
    setEditingInstanceId(instance.id)
    setEditingInstanceData({
      name: instance.name,
      categoryCode: instance.categoryCode,
      subCategoryCode: instance.subCategoryCode,
      ...(instance as any).mintValue !== undefined && { mintValue: (instance as any).mintValue },
      ...(instance as any).usedValue !== undefined && { usedValue: (instance as any).usedValue },
      ...(instance as any).finestUsedValue !== undefined && { finestUsedValue: (instance as any).finestUsedValue },
      catalogNumber: instance.catalogNumber,
      isPublished: instance.isPublished
    } as any)
  }

  const handleSaveInlineEdit = async () => {
    if (!editingInstanceId) return

    try {
      setIsUpdatingInstanceInline(true)

      // Find the original instance to merge with edited data
      const originalInstance = stampInstances.find(inst => inst.id === editingInstanceId)
      if (!originalInstance) return

      const updatedInstance = { ...originalInstance, ...editingInstanceData }

      // Make PUT API call to update the instance
      await updateStampInstance(editingInstanceId, updatedInstance)

      // Update local state
      setStampInstances(prev =>
        prev.map(inst =>
          inst.id === editingInstanceId ? updatedInstance : inst
        )
      )

      toast({
        title: "Instance Updated",
        description: "Instance details have been updated successfully.",
        variant: "default",
      })

      // Reset editing state
      setEditingInstanceId(null)
      setEditingInstanceData({})

    } catch (error) {
      console.error("Error updating instance:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update instance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingInstanceInline(false)
    }
  }

  const handleCancelInlineEdit = () => {
    setEditingInstanceId(null)
    setEditingInstanceData({})
  }

  // Filter stamps based on search and filters
  const filteredStamps = stamps.filter(stamp => {
    const matchesSearch =
      stamp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.seriesName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.catalogNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.stampCatalogCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.pageNumber?.toString().includes(searchTerm)

    const matchesCountry = countryFilter === "all" || stamp.country === countryFilter
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "published" && stamp.isPublished) ||
      (statusFilter === "draft" && !stamp.isPublished)

    return matchesSearch && matchesCountry && matchesStatus
  })

  // Sort filtered stamps
  const sortedStamps = [...filteredStamps].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField] ?? 0
    const bValue = b[sortField] ?? 0

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
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
    setSortField(null)
    setSortDirection('asc')
  }

  // Handle sorting
  const handleSort = (field: 'pageNumber') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
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
                  <SelectItem value="200">200 per page</SelectItem>
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
                  placeholder="Search stamps by name, series, catalog number, stamp code, or page number..."
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
                Showing {sortedStamps.length} of {totalCount} stamps
                {sortField && (
                  <span className="ml-2 text-xs">
                    (sorted by {sortField === 'pageNumber' ? 'Page' : sortField} {sortDirection === 'asc' ? '↑' : '↓'})
                  </span>
                )}
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
                      <TableHead
                        className="w-[60px] cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('pageNumber')}
                      >
                        <div className="flex items-center gap-1">
                          Page
                          {sortField === 'pageNumber' && (
                            sortDirection === 'asc' ?
                              <ChevronUp className="h-4 w-4" /> :
                              <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[60px]">Category Code</TableHead>
                      <TableHead className="w-[60px]">Sub Category Code</TableHead>
                      <TableHead className="min-w-[200px] max-w-[250px]">Stamp</TableHead>
                      <TableHead className="w-[120px]">Mint</TableHead>
                      <TableHead className="w-[80px]">Used</TableHead>
                      <TableHead className="w-[80px]">Finest Used</TableHead>
                      <TableHead className="w-[120px]">Catalog Number</TableHead>
                      <TableHead className="w-[120px]">Published By</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStamps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No stamps found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedStamps.map((stamp, index) => (
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
                                onClick={() => handleDuplicateStamp(stamp)}
                                title="Duplicate Stamp"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>

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
                          <TableCell className="w-[60px]">
                            <Badge variant="outline" className="font-mono">
                              {stamp.categoryCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[60px]">
                            <Badge variant="outline" className="font-mono">
                              {stamp.subCategoryCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={stamp.name}>
                              {stamp.name}
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex items-center gap-1 overflow-hidden">
                              <span className="overflow-hidden text-ellipsis whitespace-nowrap">{(stamp as any).mintValue || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <span>{(stamp as any).usedValue || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[80px]">
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <span>{(stamp as any).finestUsedValue || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={stamp.catalogNumber}>
                              <Badge variant="outline" className="font-mono text-xs max-w-full">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{stamp.catalogNumber}</span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex flex-col gap-1">
                              <span>{stamp.publishedBy && userData?.[stamp.publishedBy]?.firstName} {stamp.publishedBy && userData?.[stamp.publishedBy]?.lastName}</span>
                              <span>{stamp.publishedBy && userData?.[stamp.publishedBy]?.email}</span>
                            </div>
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
          // Reset import form states
          setShowImportForm(false)
          setImportStampId("")
          setIsImportingInstances(false)
          // Reset inline editing states
          setEditingInstanceId(null)
          setEditingInstanceData({})
          setIsUpdatingInstanceInline(false)
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 rounded-full"
              onClick={() => setIsEditModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stampId">stampId</Label>
                      <Input
                        id="stampId"
                        value={editFormData.stampId || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, stampId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isInstance">isInstance</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isInstance"
                          checked={editFormData.isInstance || false}
                          onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isInstance: checked as boolean }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentStampId">parentStampId</Label>
                      <Input
                        id="parentStampId"
                        value={editFormData.parentStampId || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, parentStampId: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="catalogNumber">catalogNumber</Label>
                      <Input
                        id="catalogNumber"
                        value={editFormData.catalogNumber || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">name</Label>
                      <Input
                        id="name"
                        value={editFormData.name || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">description</Label>
                      <Textarea
                        id="description"
                        value={editFormData.description || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryName">countryName</Label>
                      <Input
                        id="countryName"
                        value={editFormData.countryName || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, countryName: e.target.value }))}
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
                      <Label htmlFor="seriesName">seriesName</Label>
                      <Input
                        id="seriesName"
                        value={editFormData.seriesName || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, seriesName: e.target.value }))}
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
                      <Label htmlFor="stampGroupName">stampGroupName</Label>
                      <Input
                        id="stampGroupName"
                        value={editFormData.stampGroupName || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, stampGroupName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subCategoryCode">subCategoryCode</Label>
                      <Input
                        id="subCategoryCode"
                        value={editFormData.subCategoryCode || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, subCategoryCode: e.target.value }))}
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
                      <Label htmlFor="colorGroup">colorGroup</Label>
                      <Input
                        id="colorGroup"
                        value={editFormData.colorGroup || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, colorGroup: e.target.value }))}
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
                      <Label htmlFor="paperOrientation">paperOrientation</Label>
                      <Input
                        id="paperOrientation"
                        value={editFormData.paperOrientation || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, paperOrientation: e.target.value }))}
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
                      <Label htmlFor="watermarkPosition">watermarkPosition</Label>
                      <Input
                        id="watermarkPosition"
                        value={editFormData.watermarkPosition || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, watermarkPosition: e.target.value }))}
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
                      <Label htmlFor="issueYear">issueYear</Label>
                      <Input
                        id="issueYear"
                        type="number"
                        value={editFormData.issueYear || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">issueDate</Label>
                      <Input
                        id="issueDate"
                        value={editFormData.issueDate || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodStart">periodStart</Label>
                      <Input
                        id="periodStart"
                        type="number"
                        value={editFormData.periodStart || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, periodStart: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periodEnd">periodEnd</Label>
                      <Input
                        id="periodEnd"
                        type="number"
                        value={editFormData.periodEnd || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, periodEnd: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Printing & Rarity Information */}
                <div className="bg-muted/20 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Printing & Rarity Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="printingMethod">printingMethod</Label>
                      <Input
                        id="printingMethod"
                        value={editFormData.printingMethod || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, printingMethod: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="printer">printer</Label>
                      <Input
                        id="printer"
                        value={editFormData.printer || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, printer: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engraver">engraver</Label>
                      <Input
                        id="engraver"
                        value={editFormData.engraver || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, engraver: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gumCondition">gumCondition</Label>
                      <Input
                        id="gumCondition"
                        value={editFormData.gumCondition || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, gumCondition: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sizeWidth">sizeWidth</Label>
                      <Input
                        id="sizeWidth"
                        value={editFormData.sizeWidth || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, sizeWidth: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sizeHeight">sizeHeight</Label>
                      <Input
                        id="sizeHeight"
                        value={editFormData.sizeHeight || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, sizeHeight: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rarityRating">rarityRating</Label>
                      <Input
                        id="rarityRating"
                        value={editFormData.rarityRating || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, rarityRating: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rarityScale">rarityScale</Label>
                      <Input
                        id="rarityScale"
                        value={editFormData.rarityScale || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, rarityScale: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rarityScore">rarityScore</Label>
                      <Input
                        id="rarityScore"
                        value={editFormData.rarityScore || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, rarityScore: Number(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>


                {/* Pricing & Market Information */}
                <div className="bg-muted/20 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    Pricing & Market Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mintValue">mintValue</Label>
                      <Input
                        id="mintValue"
                        type="number"
                        value={editFormData.mintValue || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, mintValue: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="finestUsedValue">finestUsedValue</Label>
                      <Input
                        id="finestUsedValue"
                        type="number"
                        value={editFormData.finestUsedValue || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, finestUsedValue: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usedValue">usedValue</Label>
                      <Input
                        id="usedValue"
                        type="number"
                        value={editFormData.usedValue || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, usedValue: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="historicalSignificance">historicalSignificance</Label>
                      <Input
                        id="historicalSignificance"
                        value={editFormData.historicalSignificance || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, historicalSignificance: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bibliography">bibliography</Label>
                      <Input
                        id="bibliography"
                        value={editFormData.bibliography || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, bibliography: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialNotes">specialNotes</Label>
                      <Input
                        id="specialNotes"
                        value={editFormData.specialNotes || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Status & Publish Notes */}
                <div className="bg-muted/20 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Status & Publish Notes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="isPublished">Published Status</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isPublished"
                          checked={editFormData.isPublished || false}
                          onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isPublished: checked as boolean }))}
                        />
                        <span className="text-sm">Published</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishNotes">Publish Notes</Label>
                      <Textarea
                        id="publishNotes"
                        value={editFormData.publishNotes || ""}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, publishNotes: e.target.value }))}
                        rows={2}
                        placeholder="Notes about publishing this stamp..."
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Stamp Instances
                  {isLoadingInstances && (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  )}
                </h3>
                <Button
                  onClick={handleOpenCreateInstanceDialog}
                // className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Create Instance
                </Button>
              </div>

              {isLoadingInstances ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading instances...</span>
                </div>
              ) : stampInstances.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <div className="text-muted-foreground">
                    <p className="mb-4">No instances found for this stamp.</p>
                  </div>

                  {!showImportForm ? (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowImportForm(true)}
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Import Instances from Another Stamp
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Import existing instances from another stamp by providing its stampId
                      </p>
                    </div>
                  ) : (
                    <div className="bg-muted/20 rounded-xl p-6 border max-w-md mx-auto">
                      <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Import Instances
                      </h4>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="import-stamp-id" className="text-sm">Source Stamp ID</Label>
                          <Input
                            id="import-stamp-id"
                            value={importStampId}
                            onChange={(e) => setImportStampId(e.target.value)}
                            placeholder="Enter stampId to import instances from"
                            className="text-sm"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleImportInstances}
                            disabled={!importStampId.trim() || isImportingInstances}
                            size="sm"
                            className="flex-1"
                          >
                            {isImportingInstances ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Importing...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Import
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowImportForm(false)
                              setImportStampId("")
                            }}
                            disabled={isImportingInstances}
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px] font-semibold">Actions</TableHead>
                        <TableHead className="w-[60px] font-semibold">Page</TableHead>
                        <TableHead className="w-[60px] font-semibold">Category Code</TableHead>
                        <TableHead className="w-[60px] font-semibold">Sub Category Code</TableHead>
                        <TableHead className="min-w-[200px] max-w-[250px] font-semibold">Stamp</TableHead>
                        <TableHead className="w-[120px] font-semibold">Mint</TableHead>
                        <TableHead className="w-[80px] font-semibold">Used</TableHead>
                        <TableHead className="w-[140px] font-semibold">Finest Used</TableHead>
                        <TableHead className="w-[120px] font-semibold">Catalog Number</TableHead>
                        <TableHead className="w-[120px] font-semibold">Published By</TableHead>
                        <TableHead className="w-[120px] font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stampInstances.map((instance, index) => (
                        <TableRow key={instance.id}>
                          <TableCell>
                            <div className="flex gap-1">
                              {editingInstanceId === instance.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSaveInlineEdit}
                                    disabled={isUpdatingInstanceInline}
                                    title="Save Changes"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    {isUpdatingInstanceInline ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelInlineEdit}
                                    disabled={isUpdatingInstanceInline}
                                    title="Cancel Edit"
                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartInlineEdit(instance)}
                                    title="Edit Instance Inline"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditInstance(instance)}
                                    title="Edit Instance (Modal)"
                                  >
                                    <Eye className="h-4 w-4" />
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
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="w-[60px]">
                            <Badge variant="outline" className="font-mono">
                              {instance.pageNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[60px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                value={editingInstanceData.categoryCode || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, categoryCode: e.target.value }))}
                                className="h-8 text-xs"
                                placeholder="Code"
                              />
                            ) : (
                              <Badge variant="outline" className="font-mono">
                                {instance.categoryCode}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="w-[60px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                value={editingInstanceData.subCategoryCode || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, subCategoryCode: e.target.value }))}
                                className="h-8 text-xs"
                                placeholder="Code"
                              />
                            ) : (
                              <Badge variant="outline" className="font-mono">
                                {instance.subCategoryCode}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="min-w-[200px] max-w-[250px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                value={editingInstanceData.name || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, name: e.target.value }))}
                                className="h-8 text-sm"
                                placeholder="Stamp name"
                              />
                            ) : (
                              <div className="font-medium text-sm overflow-hidden text-ellipsis whitespace-nowrap pr-2" title={instance.name}>
                                {instance.name}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={(editingInstanceData as any).mintValue || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, mintValue: parseFloat(e.target.value) || 0 } as any))}
                                className="h-8 text-xs"
                                placeholder="0.00"
                              />
                            ) : (
                              <div className="flex items-center gap-1 overflow-hidden">
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{(instance as any).mintValue || '-'}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[80px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={(editingInstanceData as any).usedValue || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, usedValue: parseFloat(e.target.value) || 0 } as any))}
                                className="h-8 text-xs"
                                placeholder="0.00"
                              />
                            ) : (
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <span>{(instance as any).usedValue || '-'}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[80px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                type="number"
                                step="0.01"
                                value={(editingInstanceData as any).finestUsedValue || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, finestUsedValue: parseFloat(e.target.value) || 0 } as any))}
                                className="h-8 text-xs"
                                placeholder="0.00"
                              />
                            ) : (
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <span>{(instance as any).finestUsedValue || '-'}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {editingInstanceId === instance.id ? (
                              <Input
                                value={editingInstanceData.catalogNumber || ""}
                                onChange={(e) => setEditingInstanceData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                                className="h-8 text-xs"
                                placeholder="Catalog #"
                              />
                            ) : (
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap" title={instance.catalogNumber}>
                                <Badge variant="outline" className="font-mono text-xs max-w-full">
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{instance.catalogNumber}</span>
                                </Badge>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <div className="flex flex-col gap-1">
                              <span>{instance.publishedBy && userData?.[instance.publishedBy]?.firstName} {instance.publishedBy && userData?.[instance.publishedBy]?.lastName}</span>
                              <span>{instance.publishedBy && userData?.[instance.publishedBy]?.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[120px]">
                            {editingInstanceId === instance.id ? (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`isPublished-${instance.id}`}
                                  checked={editingInstanceData.isPublished || false}
                                  onCheckedChange={(checked) => setEditingInstanceData(prev => ({ ...prev, isPublished: checked as boolean }))}
                                />
                                <label htmlFor={`isPublished-${instance.id}`} className="text-xs">
                                  Published
                                </label>
                              </div>
                            ) : (
                              instance.isPublished ? (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge variant="outline">Draft</Badge>
                              )
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
              disabled={isUpdating}
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
                disabled={isUpdating}
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

      {/* Create Instance Dialog */}
      <Dialog open={isCreateInstanceDialogOpen} onOpenChange={(open) => {
        setIsCreateInstanceDialogOpen(open)
        if (!open) {
          setCreateInstanceFormData({})
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Create Stamp Instance
            </DialogTitle>
            <DialogDescription>
              Create a new instance of the selected stamp with custom values and file attachment.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Read-only fields from base stamp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentStampId" className="text-sm font-medium">
                  Parent Stamp ID
                </Label>
                <Input
                  id="parentStampId"
                  value={selectedStamp?.stampId || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catalogExtractionProcessId" className="text-sm font-medium">
                  Catalog Extraction Process ID
                </Label>
                <Input
                  id="catalogExtractionProcessId"
                  value={selectedStamp?.catalogExtractionProcessId || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageNumber" className="text-sm font-medium">
                  Page Number
                </Label>
                <Input
                  id="pageNumber"
                  value={(selectedStamp as any)?.pageNumber || ""}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            {/* User input fields */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                value={createInstanceFormData.name || ""}
                onChange={(e) => setCreateInstanceFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter stamp name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogNumber" className="text-sm font-medium">
                Catalog Number *
              </Label>
              <Input
                id="catalogNumber"
                value={createInstanceFormData.catalogNumber || ""}
                onChange={(e) => setCreateInstanceFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                placeholder="Enter catalog number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stampFileAttachment" className="text-sm font-medium">
                Stamp File Attachment
              </Label>
              <Input
                id="stampFileAttachment"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setCreateInstanceFormData(prev => ({ ...prev, stampFileAttachment: file }))
                  }
                }}
                className="cursor-pointer"
              />
              {createInstanceFormData.stampFileAttachment && (
                <p className="text-sm text-muted-foreground">
                  Selected: {(createInstanceFormData.stampFileAttachment as File).name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mintValue" className="text-sm font-medium">
                  Mint Value
                </Label>
                <Input
                  id="mintValue"
                  type="number"
                  value={(createInstanceFormData as any).mintValue || ""}
                  onChange={(e) => setCreateInstanceFormData(prev => ({ ...prev, mintValue: Number(e.target.value) } as any))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finestUsedValue" className="text-sm font-medium">
                  Finest Used Value
                </Label>
                <Input
                  id="finestUsedValue"
                  type="number"
                  value={(createInstanceFormData as any).finestUsedValue || ""}
                  onChange={(e) => setCreateInstanceFormData(prev => ({ ...prev, finestUsedValue: Number(e.target.value) } as any))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usedValue" className="text-sm font-medium">
                  Used Value
                </Label>
                <Input
                  id="usedValue"
                  type="number"
                  value={(createInstanceFormData as any).usedValue || ""}
                  onChange={(e) => setCreateInstanceFormData(prev => ({ ...prev, usedValue: Number(e.target.value) } as any))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateInstanceDialogOpen(false)}
              disabled={isUpdatingInstance}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleCreateInstance}
              disabled={isUpdatingInstance || !createInstanceFormData.name || !createInstanceFormData.catalogNumber}
            // className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdatingInstance ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Instance
                </>
              )}
            </Button>
          </DialogFooter>
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
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 rounded-full"
              onClick={() => setIsInstanceEditModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instance-catalogNumber">catalogNumber</Label>
                      <Input
                        id="instance-catalogNumber"
                        value={instanceEditFormData.catalogNumber || ""}
                        onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instance-isInstance">isInstance</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="instance-isInstance"
                          checked={instanceEditFormData.isInstance || false}
                          onCheckedChange={(checked) => setInstanceEditFormData(prev => ({ ...prev, isInstance: checked as boolean }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instance-parentStampId">parentStampId</Label>
                      <Input
                        id="instance-parentStampId"
                        value={instanceEditFormData.parentStampId || ""}
                        onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, parentStampId: e.target.value }))}
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
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Market Information */}
                <div className="bg-muted/20 rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    Pricing & Market Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="instance-mintValue">mintValue</Label>
                      <Input
                        id="instance-mintValue"
                        type="number"
                        value={(instanceEditFormData as any).mintValue || ""}
                        onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, mintValue: Number(e.target.value) } as any))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instance-finestUsedValue">finestUsedValue</Label>
                      <Input
                        id="instance-finestUsedValue"
                        type="number"
                        value={(instanceEditFormData as any).finestUsedValue || ""}
                        onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, finestUsedValue: Number(e.target.value) } as any))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instance-usedValue">usedValue</Label>
                      <Input
                        id="instance-usedValue"
                        type="number"
                        value={(instanceEditFormData as any).usedValue || ""}
                        onChange={(e) => setInstanceEditFormData(prev => ({ ...prev, usedValue: Number(e.target.value) } as any))}
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
              disabled={isUpdatingInstance}
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
                disabled={isUpdatingInstance}
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

      {/* Duplicate Stamp Modal */}
      <Dialog open={isDuplicateModalOpen} onOpenChange={(open) => {
        setIsDuplicateModalOpen(open)
        if (!open) {
          // Clear form data when modal closes
          setDuplicateFormData({})
          setIsDuplicating(false)
        }
      }}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 rounded-full"
              onClick={() => setIsDuplicateModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Duplicate Stamp
            </DialogTitle>
            <DialogDescription>
              Create a new stamp based on the selected stamp's data. Review and modify the information as needed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-muted/20 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duplicate-catalogExtractionProcessId">catalogExtractionProcessId</Label>
                  <Input
                    id="duplicate-catalogExtractionProcessId"
                    value={duplicateFormData.catalogExtractionProcessId || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, catalogExtractionProcessId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-isInstance">isInstance</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="duplicate-isInstance"
                      checked={duplicateFormData.isInstance || false}
                      onCheckedChange={(checked) => setDuplicateFormData(prev => ({ ...prev, isInstance: checked as boolean }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-catalogNumber">catalogNumber</Label>
                  <Input
                    id="duplicate-catalogNumber"
                    value={duplicateFormData.catalogNumber || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-name">name *</Label>
                  <Input
                    id="duplicate-name"
                    value={duplicateFormData.name || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-description">description</Label>
                  <Textarea
                    id="duplicate-description"
                    value={duplicateFormData.description || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, description: e.target.value }))}
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
                  <Label htmlFor="duplicate-stampFileAttachment">Upload New Stamp Image</Label>
                  <Input
                    id="duplicate-stampFileAttachment"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setDuplicateFormData(prev => ({
                          ...prev,
                          stampFileAttachment: file
                        }))
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a new image to replace the current stamp image. Supported formats: JPG, PNG, GIF, WebP
                  </p>
                  {duplicateFormData.stampFileAttachment && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm">
                        Selected: {(duplicateFormData.stampFileAttachment as File).name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDuplicateFormData(prev => ({
                          ...prev,
                          stampFileAttachment: undefined
                        }))}
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
                  <Label htmlFor="duplicate-country">country</Label>
                  <Input
                    id="duplicate-country"
                    value={duplicateFormData.country || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-countryName">countryName</Label>
                  <Input
                    id="duplicate-countryName"
                    value={duplicateFormData.countryName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, countryName: e.target.value }))}
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
                  <Label htmlFor="duplicate-seriesName">seriesName</Label>
                  <Input
                    id="duplicate-seriesName"
                    value={duplicateFormData.seriesName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, seriesName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-typeName">typeName</Label>
                  <Input
                    id="duplicate-typeName"
                    value={duplicateFormData.typeName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, typeName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-stampGroupName">stampGroupName</Label>
                  <Input
                    id="duplicate-stampGroupName"
                    value={duplicateFormData.stampGroupName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, stampGroupName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-subCategoryCode">subCategoryCode</Label>
                  <Input
                    id="duplicate-subCategoryCode"
                    value={duplicateFormData.subCategoryCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, subCategoryCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-categoryCode">categoryCode</Label>
                  <Input
                    id="duplicate-categoryCode"
                    value={duplicateFormData.categoryCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, categoryCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-itemTypeCode">itemTypeCode</Label>
                  <Input
                    id="duplicate-itemTypeCode"
                    value={duplicateFormData.itemTypeCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, itemTypeCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-itemTypeName">itemTypeName</Label>
                  <Input
                    id="duplicate-itemTypeName"
                    value={duplicateFormData.itemTypeName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, itemTypeName: e.target.value }))}
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
                  <Label htmlFor="duplicate-currencyCode">currencyCode</Label>
                  <Input
                    id="duplicate-currencyCode"
                    value={duplicateFormData.currencyCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, currencyCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-currencyName">currencyName</Label>
                  <Input
                    id="duplicate-currencyName"
                    value={duplicateFormData.currencyName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, currencyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-currencySymbol">currencySymbol</Label>
                  <Input
                    id="duplicate-currencySymbol"
                    value={duplicateFormData.currencySymbol || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, currencySymbol: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-denominationValue">denominationValue</Label>
                  <Input
                    id="duplicate-denominationValue"
                    value={duplicateFormData.denominationValue || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, denominationValue: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-denominationSymbol">denominationSymbol</Label>
                  <Input
                    id="duplicate-denominationSymbol"
                    value={duplicateFormData.denominationSymbol || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, denominationSymbol: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-denominationDisplay">denominationDisplay</Label>
                  <Input
                    id="duplicate-denominationDisplay"
                    value={duplicateFormData.denominationDisplay || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, denominationDisplay: e.target.value }))}
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
                  <Label htmlFor="duplicate-colorCode">colorCode</Label>
                  <Input
                    id="duplicate-colorCode"
                    value={duplicateFormData.colorCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-colorGroup">colorGroup</Label>
                  <Input
                    id="duplicate-colorGroup"
                    value={duplicateFormData.colorGroup || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, colorGroup: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-colorName">colorName</Label>
                  <Input
                    id="duplicate-colorName"
                    value={duplicateFormData.colorName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, colorName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-colorHex">colorHex</Label>
                  <Input
                    id="duplicate-colorHex"
                    value={duplicateFormData.colorHex || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, colorHex: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-paperCode">paperCode</Label>
                  <Input
                    id="duplicate-paperCode"
                    value={duplicateFormData.paperCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, paperCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-paperName">paperName</Label>
                  <Input
                    id="duplicate-paperName"
                    value={duplicateFormData.paperName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, paperName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-paperOrientation">paperOrientation</Label>
                  <Input
                    id="duplicate-paperOrientation"
                    value={duplicateFormData.paperOrientation || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, paperOrientation: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-watermarkCode">watermarkCode</Label>
                  <Input
                    id="duplicate-watermarkCode"
                    value={duplicateFormData.watermarkCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, watermarkCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-watermarkName">watermarkName</Label>
                  <Input
                    id="duplicate-watermarkName"
                    value={duplicateFormData.watermarkName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, watermarkName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-watermarkPosition">watermarkPosition</Label>
                  <Input
                    id="duplicate-watermarkPosition"
                    value={duplicateFormData.watermarkPosition || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, watermarkPosition: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-perforationCode">perforationCode</Label>
                  <Input
                    id="duplicate-perforationCode"
                    value={duplicateFormData.perforationCode || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, perforationCode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-perforationName">perforationName</Label>
                  <Input
                    id="duplicate-perforationName"
                    value={duplicateFormData.perforationName || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, perforationName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-perforationMeasurement">perforationMeasurement</Label>
                  <Input
                    id="duplicate-perforationMeasurement"
                    value={duplicateFormData.perforationMeasurement || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, perforationMeasurement: e.target.value }))}
                  />
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
                  <Label htmlFor="duplicate-issueYear">issueYear</Label>
                  <Input
                    id="duplicate-issueYear"
                    type="number"
                    value={duplicateFormData.issueYear || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, issueYear: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-issueDate">issueDate</Label>
                  <Input
                    id="duplicate-issueDate"
                    value={duplicateFormData.issueDate || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-periodStart">periodStart</Label>
                  <Input
                    id="duplicate-periodStart"
                    type="number"
                    value={duplicateFormData.periodStart || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, periodStart: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-periodEnd">periodEnd</Label>
                  <Input
                    id="duplicate-periodEnd"
                    type="number"
                    value={duplicateFormData.periodEnd || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, periodEnd: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Printing & Rarity Information */}
            <div className="bg-muted/20 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Printing & Rarity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duplicate-printingMethod">printingMethod</Label>
                  <Input
                    id="duplicate-printingMethod"
                    value={duplicateFormData.printingMethod || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, printingMethod: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-printer">printer</Label>
                  <Input
                    id="duplicate-printer"
                    value={duplicateFormData.printer || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, printer: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-engraver">engraver</Label>
                  <Input
                    id="duplicate-engraver"
                    value={duplicateFormData.engraver || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, engraver: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-gumCondition">gumCondition</Label>
                  <Input
                    id="duplicate-gumCondition"
                    value={duplicateFormData.gumCondition || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, gumCondition: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-sizeWidth">sizeWidth</Label>
                  <Input
                    id="duplicate-sizeWidth"
                    value={duplicateFormData.sizeWidth || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, sizeWidth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-sizeHeight">sizeHeight</Label>
                  <Input
                    id="duplicate-sizeHeight"
                    value={duplicateFormData.sizeHeight || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, sizeHeight: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-rarityRating">rarityRating</Label>
                  <Input
                    id="duplicate-rarityRating"
                    value={duplicateFormData.rarityRating || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, rarityRating: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-rarityScale">rarityScale</Label>
                  <Input
                    id="duplicate-rarityScale"
                    value={duplicateFormData.rarityScale || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, rarityScale: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-rarityScore">rarityScore</Label>
                  <Input
                    id="duplicate-rarityScore"
                    value={duplicateFormData.rarityScore || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, rarityScore: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Market Information */}
            <div className="bg-muted/20 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="text-lg">💰</span>
                Pricing & Market Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duplicate-mintValue">mintValue</Label>
                  <Input
                    id="duplicate-mintValue"
                    type="number"
                    value={duplicateFormData.mintValue || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, mintValue: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-finestUsedValue">finestUsedValue</Label>
                  <Input
                    id="duplicate-finestUsedValue"
                    type="number"
                    value={duplicateFormData.finestUsedValue || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, finestUsedValue: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-usedValue">usedValue</Label>
                  <Input
                    id="duplicate-usedValue"
                    type="number"
                    value={duplicateFormData.usedValue || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, usedValue: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-historicalSignificance">historicalSignificance</Label>
                  <Input
                    id="duplicate-historicalSignificance"
                    value={duplicateFormData.historicalSignificance || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, historicalSignificance: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-bibliography">bibliography</Label>
                  <Input
                    id="duplicate-bibliography"
                    value={duplicateFormData.bibliography || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, bibliography: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-specialNotes">specialNotes</Label>
                  <Input
                    id="duplicate-specialNotes"
                    value={duplicateFormData.specialNotes || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Status & Publish Notes */}
            <div className="bg-muted/20 rounded-xl p-6 border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Status & Publish Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duplicate-isPublished">Published Status</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="duplicate-isPublished"
                      checked={duplicateFormData.isPublished || false}
                      onCheckedChange={(checked) => setDuplicateFormData(prev => ({ ...prev, isPublished: checked as boolean }))}
                    />
                    <span className="text-sm">Published</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duplicate-publishNotes">Publish Notes</Label>
                  <Textarea
                    id="duplicate-publishNotes"
                    value={duplicateFormData.publishNotes || ""}
                    onChange={(e) => setDuplicateFormData(prev => ({ ...prev, publishNotes: e.target.value }))}
                    rows={2}
                    placeholder="Notes about publishing this stamp..."
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDuplicateModalOpen(false)}
              disabled={isDuplicating}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  setIsDuplicating(true)

                  // Validate required fields
                  if (!duplicateFormData.name?.trim()) {
                    toast({
                      title: "Validation Error",
                      description: "Stamp name is required.",
                      variant: "destructive",
                      duration: 5000,
                    })
                    return
                  }

                  // Create the new stamp
                  const newStamp = await createStamp(duplicateFormData)

                  toast({
                    title: "Stamp Created Successfully",
                    description: `New stamp "${newStamp.name}" has been created.`,
                    variant: "default",
                    duration: 5000,
                  })

                  // Close modal and refresh data
                  setIsDuplicateModalOpen(false)
                  setDuplicateFormData({})

                  // Refresh the stamps list
                  await loadStamps()

                } catch (error) {
                  console.error("Error creating stamp:", error)
                  toast({
                    title: "Failed to Create Stamp",
                    description: error instanceof Error ? error.message : "Unable to create stamp. Please try again.",
                    variant: "destructive",
                    duration: 5000,
                  })
                } finally {
                  setIsDuplicating(false)
                }
              }}
              disabled={isDuplicating}
            >
              {isDuplicating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Stamp
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
