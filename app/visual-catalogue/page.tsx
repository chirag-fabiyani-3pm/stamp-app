"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, BookOpen, Archive, Eye, ChevronRight, X, Grid, AlertCircle, ArrowLeft, MapPin, Palette, ImageIcon, Globe, Coins, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth/route-guard"

// Traditional catalog styling - simple and clean
const traditionalStyles = {
  background: "bg-white",
  card: "bg-white border border-gray-300 shadow-sm",
  header: "text-black border-b border-gray-300",
  text: "text-black",
  mutedText: "text-gray-600",
  accent: "text-black",
  vintage: "font-serif"
}

// Types for the stamp code hierarchy
interface CountryOption {
  code: string
  name: string
  flag: string
  totalStamps: number
}

interface StampGroupOption {
  id: string
  name: string
  catalogNumber: string
  totalStamps: number
  stampImageUrl: string
}

interface YearOption {
  year: number
  totalStamps: number
  firstIssue: string
  lastIssue: string
}

interface CurrencyOption {
  code: string
  name: string
  symbol: string
  totalStamps: number
}

interface DenominationOption {
  value: string
  symbol: string
  displayName: string
  totalStamps: number
  stampImageUrl: string
}

interface ColorOption {
  code: string
  name: string
  hexColor: string
  totalStamps: number
  stampImageUrl: string
}

interface PaperOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
}

interface WatermarkOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
}

interface PerforationOption {
  code: string
  name: string
  measurement: string
  totalStamps: number
  stampImageUrl: string
}

interface ItemTypeOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
}

interface StampData {
  id: string
  name: string
  country: string
  stampImageUrl: string
  catalogNumber: string
  seriesName: string
  issueDate: string
  issueYear: number
  denominationValue: number
  denominationSymbol: string
  color: string
  paperType: string
  stampDetailsJson: string
  stampCode: string
}

interface AdditionalCategoryOption {
  code: string
  name: string
  description: string
  totalStamps: number
  stampImageUrl: string
  priceMultiplier?: number
  rarity?: string
}

// Modal types for the LIFO stack
type ModalType = 'country' | 'stampGroup' | 'year' | 'currency' | 'denomination' | 
                 'color' | 'paper' | 'watermark' | 'perforation' | 'itemType' | 'stampDetails' |
                 'postalHistory' | 'postmarks' | 'proofs' | 'essays' | 'onPiece' | 'errors' | 'other'

interface ModalStackItem {
  type: ModalType
  title: string
  data: any
  stampCode: string // Current stamp code being built
  selectedAdditionalCategories?: string[] // Track selected additional categories to prevent circular navigation
}

export function CatalogContent() {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modal stack state - LIFO behavior
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([])
  
  // Countries data
  const [countries, setCountries] = useState<CountryOption[]>([])

  useEffect(() => {
    generateCountriesData()
  }, [])

  const generateCountriesData = async () => {
    try {
      setLoading(true)
      
      const countriesData: CountryOption[] = [
        { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', totalStamps: 15420 },
        { code: 'AU', name: 'Australia', flag: '🇦🇺', totalStamps: 12380 },
        { code: 'GB', name: 'Great Britain', flag: '🇬🇧', totalStamps: 18950 },
        { code: 'US', name: 'United States', flag: '🇺🇸', totalStamps: 22100 },
        { code: 'CA', name: 'Canada', flag: '🇨🇦', totalStamps: 9840 },
        { code: 'FR', name: 'France', flag: '🇫🇷', totalStamps: 14200 },
        { code: 'DE', name: 'Germany', flag: '🇩🇪', totalStamps: 16750 },
        { code: 'IT', name: 'Italy', flag: '🇮🇹', totalStamps: 11890 },
      ]
      
      setCountries(countriesData)
    } catch (error) {
      console.error('Error generating countries data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCountryClick = async (country: CountryOption) => {
    const stampGroups = await generateStampGroupsData(country.code)
    
    setModalStack([{
      type: 'country',
      title: `${country.name} Stamp Catalog`,
      data: { country, stampGroups },
      stampCode: country.code
    }])
  }

  const generateStampGroupsData = async (countryCode: string): Promise<StampGroupOption[]> => {
    // Simulate API call to get stamp groups for country
    const groups: StampGroupOption[] = []
    
    for (let i = 1; i <= 50; i++) {
      const catalogNumber = `${String(i).padStart(3, '0')}`
      groups.push({
        id: `${countryCode}-${catalogNumber}`,
        name: `Series ${catalogNumber} - Queen Victoria Chalon`,
        catalogNumber,
        totalStamps: Math.floor(Math.random() * 100) + 20,
        stampImageUrl: '/images/stamps/stamp.png'
      })
    }
    
    return groups
  }

  const handleStampGroupClick = async (group: StampGroupOption, currentStampCode: string) => {
    const years = await generateYearsData(currentStampCode, group.catalogNumber)
    const newStampCode = `${currentStampCode}.${group.catalogNumber}`
    
    setModalStack(prev => [...prev, {
      type: 'stampGroup',
      title: `${group.name}`,
      data: { group, years },
      stampCode: newStampCode
    }])
  }

  const generateYearsData = async (stampCode: string, groupNumber: string): Promise<YearOption[]> => {
    const years: YearOption[] = []
    const startYear = 1855
    const endYear = 2025
    
    for (let year = startYear; year <= endYear; year += 5) {
      years.push({
        year,
        totalStamps: Math.floor(Math.random() * 50) + 10,
        firstIssue: `${year}-01-15`,
        lastIssue: `${year}-12-20`
      })
    }
    
    return years
  }

  const handleYearClick = async (year: YearOption, currentStampCode: string) => {
    const currencies = await generateCurrenciesData(currentStampCode, year.year)
    const newStampCode = `${currentStampCode}.${year.year}`
    
    setModalStack(prev => [...prev, {
      type: 'year',
      title: `${year.year} Issues`,
      data: { year, currencies },
      stampCode: newStampCode
    }])
  }

  const generateCurrenciesData = async (stampCode: string, year: number): Promise<CurrencyOption[]> => {
    const currencies: CurrencyOption[] = [
      { code: 'GBP', name: 'Pound Sterling', symbol: '£', totalStamps: 120 },
      { code: 'USD', name: 'US Dollar', symbol: '$', totalStamps: 85 },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', totalStamps: 95 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', totalStamps: 65 },
      { code: 'EUR', name: 'Euro', symbol: '€', totalStamps: 110 },
    ]
    
    return currencies
  }

  const handleCurrencyClick = async (currency: CurrencyOption, currentStampCode: string) => {
    const denominations = await generateDenominationsData(currentStampCode, currency.code)
    const newStampCode = `${currentStampCode}.${currency.code}`
    
    setModalStack(prev => [...prev, {
      type: 'currency',
      title: `${currency.name} Denominations`,
      data: { currency, denominations },
      stampCode: newStampCode
    }])
  }

  const generateDenominationsData = async (stampCode: string, currencyCode: string): Promise<DenominationOption[]> => {
    const values = ['1/2', '1', '2', '3', '4', '6', '8', '10', '1s', '2s', '5s', '10s']
    const symbol = currencyCode === 'GBP' ? 'd' : currencyCode === 'USD' ? 'c' : 'c'
    
    return values.map(value => ({
      value,
      symbol,
      displayName: `${value}${symbol}`,
      totalStamps: Math.floor(Math.random() * 30) + 5,
      stampImageUrl: '/images/stamps/stamp.png'
    }))
  }

  const handleDenominationClick = async (denomination: DenominationOption, currentStampCode: string) => {
    const colors = await generateColorsData(currentStampCode, denomination.value)
    const newStampCode = `${currentStampCode}.${denomination.value}${denomination.symbol}`
    
    setModalStack(prev => [...prev, {
      type: 'denomination',
      title: `${denomination.displayName} Colors`,
      data: { denomination, colors },
      stampCode: newStampCode
    }])
  }

  const generateColorsData = async (stampCode: string, denomination: string): Promise<ColorOption[]> => {
    const colors: ColorOption[] = [
      { code: 'Blu', name: 'Blue', hexColor: '#0066CC', totalStamps: 25, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'R', name: 'Red', hexColor: '#CC0000', totalStamps: 20, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Gr', name: 'Green', hexColor: '#00AA00', totalStamps: 18, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Pur', name: 'Purple', hexColor: '#6600CC', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Br', name: 'Brown', hexColor: '#8B4513', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Blk', name: 'Black', hexColor: '#000000', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Yel', name: 'Yellow', hexColor: '#FFDD00', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png' },
    ]
    
    return colors
  }

  const handleColorClick = async (color: ColorOption, currentStampCode: string) => {
    const papers = await generatePapersData(currentStampCode, color.code)
    const newStampCode = `${currentStampCode}.${color.code}`
    
    setModalStack(prev => [...prev, {
      type: 'color',
      title: `${color.name} Paper Types`,
      data: { color, papers },
      stampCode: newStampCode
    }])
  }

  const generatePapersData = async (stampCode: string, colorCode: string): Promise<PaperOption[]> => {
    const papers: PaperOption[] = [
      { code: 'wh', name: 'White Paper', description: 'Standard white paper', totalStamps: 15, stampImageUrl: '/images/stamps/white-paper.png' },
      { code: 'ch', name: 'Chalk Surfaced', description: 'Chalk surfaced paper', totalStamps: 12, stampImageUrl: '/images/stamps/chalk-surfaced-paper.png' },
      { code: 'to', name: 'Toned Paper', description: 'Slightly toned paper', totalStamps: 8, stampImageUrl: '/images/stamps/toned-paper.png' },
      { code: 'fl', name: 'Fluorescent', description: 'Fluorescent paper', totalStamps: 6, stampImageUrl: '/images/stamps/glazed-fluorescent-paper.png' },
    ]
    
    return papers
  }

  const handlePaperClick = async (paper: PaperOption, currentStampCode: string) => {
    const watermarks = await generateWatermarksData(currentStampCode, paper.code)
    const newStampCode = `${currentStampCode}.${paper.code}`
    
    setModalStack(prev => [...prev, {
      type: 'paper',
      title: `${paper.name} Watermarks`,
      data: { paper, watermarks },
      stampCode: newStampCode
    }])
  }

  const generateWatermarksData = async (stampCode: string, paperCode: string): Promise<WatermarkOption[]> => {
    const watermarks: WatermarkOption[] = [
      { code: 'WmkNZStr6mm', name: 'NZ and Star 6mm', description: 'New Zealand and Star watermark', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'WmkLgStr', name: 'Large Star', description: 'Large star watermark', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'WmkCrownCC', name: 'Crown Over CC', description: 'Crown over CC watermark', totalStamps: 6, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'NoWmk', name: 'No Watermark', description: 'No watermark present', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png' },
    ]
    
    return watermarks
  }

  const handleWatermarkClick = async (watermark: WatermarkOption, currentStampCode: string) => {
    const perforations = await generatePerforationsData(currentStampCode, watermark.code)
    const newStampCode = `${currentStampCode}.${watermark.code}`
    
    setModalStack(prev => [...prev, {
      type: 'watermark',
      title: `${watermark.name} Perforations`,
      data: { watermark, perforations },
      stampCode: newStampCode
    }])
  }

  const generatePerforationsData = async (stampCode: string, watermarkCode: string): Promise<PerforationOption[]> => {
    const perforations: PerforationOption[] = [
      { code: 'P12', name: 'Perf 12', measurement: '12.0', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'P13', name: 'Perf 13', measurement: '13.0', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'P14', name: 'Perf 14', measurement: '14.0', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'Imp', name: 'Imperforate', measurement: 'No perforations', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png' },
    ]
    
    return perforations
  }

  const handlePerforationClick = async (perforation: PerforationOption, currentStampCode: string) => {
    const itemTypes = await generateItemTypesData(currentStampCode, perforation.code)
    const newStampCode = `${currentStampCode}.${perforation.code}`
    
    setModalStack(prev => [...prev, {
      type: 'perforation',
      title: `${perforation.name} Item Types`,
      data: { perforation, itemTypes },
      stampCode: newStampCode
    }])
  }

  const generateItemTypesData = async (stampCode: string, perforationCode: string): Promise<ItemTypeOption[]> => {
    const itemTypes: ItemTypeOption[] = [
      { code: 'St001', name: 'Stamp', description: 'Regular stamp', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png' },
      { code: 'OnP01', name: 'On Piece', description: 'Stamp on piece', totalStamps: 5, stampImageUrl: '/images/stamps/stamp-on-piece.png' },
      { code: 'OnC01', name: 'On Card', description: 'Stamp on card', totalStamps: 3, stampImageUrl: '/images/stamps/stamp-on-card.png' },
      { code: 'OnE01', name: 'On Envelope', description: 'Stamp on envelope', totalStamps: 4, stampImageUrl: '/images/stamps/stamp-on-envelope.png' },
    ]
    
    return itemTypes
  }

  const handleItemTypeClick = async (itemType: ItemTypeOption, currentStampCode: string) => {
    const stamps = await generateStampDetails(currentStampCode, itemType.code)
    const newStampCode = `${currentStampCode}.${itemType.code}`
    
    setModalStack(prev => [...prev, {
      type: 'itemType',
      title: `${itemType.name} Details`,
      data: { itemType, stamps },
      stampCode: newStampCode
    }])
  }

  const generateStampDetails = async (stampCode: string, itemTypeCode: string): Promise<StampData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const baseData = generateComprehensiveStampData(stampCode)
    const stamps: StampData[] = []
    
    // Generate multiple variations with different additional categories
    for (let i = 1; i <= Math.floor(Math.random() * 8) + 3; i++) {
      const conditionIndex = Math.floor(Math.random() * baseData.additionalCategories.conditions.length)
      const usageIndex = Math.floor(Math.random() * baseData.additionalCategories.usageStates.length)
      const postalHistoryIndex = Math.floor(Math.random() * baseData.additionalCategories.postalHistory.length)
      
      const condition = baseData.additionalCategories.conditions[conditionIndex]
      const usage = baseData.additionalCategories.usageStates[usageIndex]
      const postalHistory = baseData.additionalCategories.postalHistory[postalHistoryIndex]
      
      // Calculate final price based on all multipliers
      const basePrice = baseData.additionalCategories.marketFactors.catalogPrice
      const finalPrice = basePrice * condition.priceMultiplier * usage.priceMultiplier * postalHistory.priceMultiplier
      
      stamps.push({
        id: `${stampCode}-${itemTypeCode}-${i}`,
        name: `${baseData.baseStamp.name} - ${postalHistory.type} (${condition.grade})`,
        country: baseData.baseStamp.country,
        stampImageUrl: '/images/stamps/stamp.png',
        catalogNumber: `SG${i}${postalHistory.type === 'Proofs' ? 'P' : postalHistory.type === 'Essays' ? 'E' : ''}`,
        seriesName: baseData.baseStamp.seriesName,
        issueDate: baseData.baseStamp.issueDate,
        issueYear: baseData.baseStamp.issueYear,
        denominationValue: parseInt(stampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
        denominationSymbol: stampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
        color: getColorName(stampCode.split('.')[5] || 'Blu'),
        paperType: getPaperName(stampCode.split('.')[6] || 'wh'),
        stampDetailsJson: JSON.stringify({
          // Core stamp details
          perforation: getPerforation(stampCode.split('.')[8] || 'P12'),
          watermark: getWatermarkName(stampCode.split('.')[7] || 'WmkStar'),
          printingMethod: 'Engraved',
          designer: 'Unknown',
          printer: 'Unknown',
          itemType: getItemTypeName(itemTypeCode),
          
          // Additional category details from image
          postalHistoryType: postalHistory.type,
          postalHistoryDescription: postalHistory.description,
          condition: condition.grade,
          conditionDescription: condition.description,
          usage: usage.state,
          usageDescription: usage.description,
          
          // Market data with telescopic pricing
          catalogPrice: basePrice.toFixed(2),
          estimatedValue: (finalPrice * 0.8).toFixed(2),
          currentMarketValue: finalPrice.toFixed(2),
          priceFactors: {
            condition: `${condition.priceMultiplier}x`,
            usage: `${usage.priceMultiplier}x`,
            postalHistory: `${postalHistory.priceMultiplier}x`
          },
          
          // Recent sales data points for telescopic chart (from image)
          recentSales: baseData.additionalCategories.marketFactors.actualSales.map(sale => ({
            ...sale,
            adjustedPrice: (sale.price * condition.priceMultiplier * usage.priceMultiplier * postalHistory.priceMultiplier).toFixed(2)
          })),
          
          marketTrend: baseData.additionalCategories.marketFactors.marketTrend,
          rarity: baseData.additionalCategories.marketFactors.rarity,
          demandLevel: baseData.additionalCategories.marketFactors.demandLevel,
          
          // Additional notes
          specialNotes: postalHistory.type === 'Errors' ? 'Rare printing error increases value significantly' :
                       postalHistory.type === 'Proofs' ? 'Printer proof - very limited quantity' :
                       postalHistory.type === 'Essays' ? 'Design essay - extremely rare' :
                       'Standard catalog entry with market pricing variations'
        }),
        stampCode: `${stampCode}.${postalHistory.type.replace(/\s/g, '')}.${condition.grade.replace(/\s/g, '')}.${usage.state.replace(/\s/g, '')}`
      })
    }
    
    return stamps
  }

  const closeModal = () => {
    setModalStack(prev => prev.slice(0, -1))
  }

  const closeAllModals = () => {
    setModalStack([])
  }

  const handleStampDetailClick = (stamp: StampData) => {
    // Get current modal to propagate selected categories
    const currentModal = modalStack[modalStack.length - 1]
    const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
    
    setModalStack(prev => [...prev, {
      type: 'stampDetails',
      title: `${stamp.name} Details`,
      data: { stamp, selectedAdditionalCategories: currentSelectedCategories },
      stampCode: stamp.stampCode,
      selectedAdditionalCategories: currentSelectedCategories
    }])
  }

  // Additional Category Handlers
  const handleAdditionalCategoryClick = async (categoryType: string, currentStampCode: string) => {
    const categories = await generateAdditionalCategoriesData(categoryType, currentStampCode)
    
    // Get current modal to track selected categories
    const currentModal = modalStack[modalStack.length - 1]
    const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
    
    setModalStack(prev => [...prev, {
      type: categoryType as ModalType,
      title: `${categoryType.charAt(0).toUpperCase() + categoryType.slice(1)} Categories`,
      data: { categoryType, categories, stampCode: currentStampCode },
      stampCode: currentStampCode,
      selectedAdditionalCategories: [...currentSelectedCategories, categoryType]
    }])
  }

  const generateAdditionalCategoriesData = async (categoryType: string, stampCode: string): Promise<AdditionalCategoryOption[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const categoryMap: { [key: string]: AdditionalCategoryOption[] } = {
      'postalHistory': [
        { code: 'COVER', name: 'On Cover', description: 'Stamp used on envelope or cover', totalStamps: 45, stampImageUrl: '/images/stamps/stamp-on-envelope.png', priceMultiplier: 1.8, rarity: 'common' },
        { code: 'PIECE', name: 'On Piece', description: 'Stamp on piece of envelope or card', totalStamps: 32, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
        { code: 'CARD', name: 'On Card', description: 'Stamp on postal card', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-card.png', priceMultiplier: 1.2, rarity: 'uncommon' },
        { code: 'NEWS', name: 'On Newspaper', description: 'Stamp used on newspaper wrapper', totalStamps: 15, stampImageUrl: '/images/stamps/stamp-on-newspaper.png', priceMultiplier: 2.5, rarity: 'rare' }
      ],
      'postmarks': [
        { code: 'CDS', name: 'Circular Date Stamp', description: 'Standard circular postmark', totalStamps: 120, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.0, rarity: 'common' },
        { code: 'DUPLEX', name: 'Duplex Cancel', description: 'Combined postmark and killer', totalStamps: 85, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.3, rarity: 'common' },
        { code: 'NUMERAL', name: 'Numeral Cancel', description: 'Numeric obliterator', totalStamps: 67, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.5, rarity: 'uncommon' },
        { code: 'SPECIAL', name: 'Special Occasion', description: 'Commemorative or special event postmark', totalStamps: 23, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 3.0, rarity: 'rare' }
      ],
      'proofs': [
        { code: 'DIE', name: 'Die Proof', description: 'Proof taken from the original die', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
        { code: 'PLATE', name: 'Plate Proof', description: 'Proof taken from the printing plate', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 8.0, rarity: 'very rare' },
        { code: 'TRIAL', name: 'Trial Color Proof', description: 'Proof in different color', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 6.0, rarity: 'rare' },
        { code: 'PROG', name: 'Progressive Proof', description: 'Proof showing stages of printing', totalStamps: 6, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 12.0, rarity: 'extremely rare' }
      ],
      'essays': [
        { code: 'DESIGN', name: 'Design Essay', description: 'Original design proposal', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
        { code: 'COLOR', name: 'Color Essay', description: 'Alternative color scheme', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 12.0, rarity: 'very rare' },
        { code: 'FRAME', name: 'Frame Essay', description: 'Border or frame design variant', totalStamps: 7, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
        { code: 'COMP', name: 'Composite Essay', description: 'Multiple design elements combined', totalStamps: 3, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 25.0, rarity: 'unique' }
      ],
      'onPiece': [
        { code: 'ENV_PIECE', name: 'Envelope Piece', description: 'Corner or piece of envelope', totalStamps: 95, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.8, rarity: 'common' },
        { code: 'CARD_PIECE', name: 'Card Piece', description: 'Piece of postal card', totalStamps: 43, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
        { code: 'DOC_PIECE', name: 'Document Piece', description: 'Piece of official document', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.4, rarity: 'uncommon' },
        { code: 'WRAP_PIECE', name: 'Wrapper Piece', description: 'Piece of newspaper wrapper', totalStamps: 19, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.8, rarity: 'rare' }
      ],
      'errors': [
        { code: 'MISPERF', name: 'Misperforated', description: 'Perforations in wrong position', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 8.0, rarity: 'rare' },
        { code: 'MISSING_COLOR', name: 'Missing Color', description: 'One or more colors omitted', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'very rare' },
        { code: 'DOUBLE_PRINT', name: 'Double Print', description: 'Printed twice, images offset', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
        { code: 'INVERTED', name: 'Inverted Center', description: 'Center design upside down', totalStamps: 2, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 50.0, rarity: 'unique' },
        { code: 'IMPERF', name: 'Imperforate', description: 'Missing perforations', totalStamps: 18, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 6.0, rarity: 'rare' }
      ],
      'other': [
        { code: 'SPECIMENS', name: 'Specimens', description: 'Stamps overprinted SPECIMEN', totalStamps: 25, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 3.0, rarity: 'uncommon' },
        { code: 'REPRINTS', name: 'Reprints', description: 'Later reprints of original stamps', totalStamps: 45, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 0.3, rarity: 'common' },
        { code: 'OFFICIALS', name: 'Official Overprints', description: 'Stamps overprinted for official use', totalStamps: 35, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 2.5, rarity: 'uncommon' },
        { code: 'LOCALS', name: 'Local Issues', description: 'Locally produced variants', totalStamps: 20, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 4.0, rarity: 'rare' }
      ]
    }

    return categoryMap[categoryType] || []
  }

  const handleAdditionalCategoryOptionClick = async (category: AdditionalCategoryOption, categoryType: string, currentStampCode: string) => {
    // Generate stamps for the selected additional category
    const stamps = await generateStampsForAdditionalCategory(currentStampCode, categoryType, category.code)
    
    // Get current modal to propagate selected categories
    const currentModal = modalStack[modalStack.length - 1]
    const currentSelectedCategories = currentModal?.selectedAdditionalCategories || []
    
    if (stamps.length === 1) {
      // If only one stamp, go directly to stamp details
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${category.name} - Stamp Details`,
        data: { 
          stamp: stamps[0], 
          categoryFilter: category,
          baseStampCode: currentStampCode,
          selectedAdditionalCategories: currentSelectedCategories
        },
        stampCode: `${currentStampCode}.${category.code}`,
        selectedAdditionalCategories: currentSelectedCategories
      }])
    } else {
      // If multiple stamps, show them as individual stamp detail options
      setModalStack(prev => [...prev, {
        type: 'stampDetails',
        title: `${category.name} - Select Stamp`,
        data: { 
          stamps, 
          categoryFilter: category,
          baseStampCode: currentStampCode,
          showAsIndividualCards: true,
          selectedAdditionalCategories: currentSelectedCategories
        },
        stampCode: `${currentStampCode}.${category.code}`,
        selectedAdditionalCategories: currentSelectedCategories
      }])
    }
  }

  const generateStampsForAdditionalCategory = async (baseStampCode: string, categoryType: string, categoryCode: string): Promise<StampData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const baseData = generateComprehensiveStampData(baseStampCode)
    const stamps: StampData[] = []
    
    // Generate 3-12 stamps for the category
    const count = Math.floor(Math.random() * 10) + 3
    
    for (let i = 1; i <= count; i++) {
      const conditionIndex = Math.floor(Math.random() * baseData.additionalCategories.conditions.length)
      const usageIndex = Math.floor(Math.random() * baseData.additionalCategories.usageStates.length)
      
      const condition = baseData.additionalCategories.conditions[conditionIndex]
      const usage = baseData.additionalCategories.usageStates[usageIndex]
      
      // Get category-specific multiplier
      let categoryMultiplier = 1.0
      const categoryName = categoryType.charAt(0).toUpperCase() + categoryType.slice(1)
      
      if (categoryCode === 'DIE') categoryMultiplier = 15.0
      else if (categoryCode === 'DESIGN') categoryMultiplier = 20.0
      else if (categoryCode === 'INVERTED') categoryMultiplier = 50.0
      else if (categoryCode === 'DOUBLE_PRINT') categoryMultiplier = 20.0
      else if (categoryCode === 'MISSING_COLOR') categoryMultiplier = 15.0
      else if (categoryCode.includes('PROOF')) categoryMultiplier = 8.0
      else if (categoryCode.includes('ERROR')) categoryMultiplier = 10.0
      else categoryMultiplier = Math.random() * 3 + 0.5 // Random between 0.5x and 3.5x
      
      const basePrice = baseData.additionalCategories.marketFactors.catalogPrice
      const finalPrice = basePrice * condition.priceMultiplier * usage.priceMultiplier * categoryMultiplier
      
      stamps.push({
        id: `${baseStampCode}-${categoryCode}-${i}`,
        name: `${baseData.baseStamp.name} - ${categoryName} (${categoryCode})`,
        country: baseData.baseStamp.country,
        stampImageUrl: '/images/stamps/stamp.png',
        catalogNumber: `SG${i}${categoryCode.substring(0, 2)}`,
        seriesName: baseData.baseStamp.seriesName,
        issueDate: baseData.baseStamp.issueDate,
        issueYear: baseData.baseStamp.issueYear,
        denominationValue: parseInt(baseStampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
        denominationSymbol: baseStampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
        color: getColorName(baseStampCode.split('.')[5] || 'Blu'),
        paperType: getPaperName(baseStampCode.split('.')[6] || 'wh'),
        stampDetailsJson: JSON.stringify({
          // Core stamp details
          perforation: getPerforation(baseStampCode.split('.')[8] || 'P12'),
          watermark: getWatermarkName(baseStampCode.split('.')[7] || 'WmkStar'),
          printingMethod: 'Engraved',
          designer: 'Unknown',
          printer: 'Unknown',
          
          // Additional category specific details
          categoryType: categoryType,
          categoryCode: categoryCode,
          categoryName: categoryName,
          condition: condition.grade,
          conditionDescription: condition.description,
          usage: usage.state,
          usageDescription: usage.description,
          
          // Market data with category-specific pricing
          catalogPrice: basePrice.toFixed(2),
          estimatedValue: (finalPrice * 0.8).toFixed(2),
          currentMarketValue: finalPrice.toFixed(2),
          priceFactors: {
            condition: `${condition.priceMultiplier}x`,
            usage: `${usage.priceMultiplier}x`,
            category: `${categoryMultiplier}x`
          },
          
          marketTrend: baseData.additionalCategories.marketFactors.marketTrend,
          rarity: categoryMultiplier > 10 ? 'extremely rare' : categoryMultiplier > 5 ? 'very rare' : categoryMultiplier > 2 ? 'rare' : 'uncommon',
          
          specialNotes: `${categoryName} variant with specific characteristics affecting market value`
        }),
        stampCode: `${baseStampCode}.${categoryCode}.${condition.grade.replace(/\s/g, '')}.${usage.state.replace(/\s/g, '')}`
      })
    }
    
    return stamps
  }

  // Enhanced data generation with additional categories from the image
  const generateComprehensiveStampData = (baseStampCode: string) => {
    const baseStamp = {
      id: `stamp-${baseStampCode}`,
      name: 'Queen Victoria Chalon',
      country: 'New Zealand',
      stampImageUrl: '/images/stamps/stamp.png',
      catalogNumber: 'SG1',
      seriesName: 'Queen Victoria Chalon',
      issueDate: '1855-07-18',
      issueYear: 1855,
      denominationValue: 2,
      denominationSymbol: 'd',
      color: 'Blue',
      paperType: 'White Paper',
      stampCode: baseStampCode
    }

    // Additional categories based on image analysis
    const additionalCategories = {
      // Postal History variants
      postalHistory: [
        { type: 'Postal History', description: 'Used on cover', priceMultiplier: 1.5 },
        { type: 'Postmarks', description: 'Special postmark varieties', priceMultiplier: 1.2 },
        { type: 'Proofs', description: 'Printer proofs', priceMultiplier: 3.0 },
        { type: 'Essays', description: 'Design essays', priceMultiplier: 5.0 },
        { type: 'On Piece', description: 'Stamp on piece of envelope', priceMultiplier: 0.8 },
        { type: 'Errors', description: 'Printing errors', priceMultiplier: 10.0 },
        { type: 'Other', description: 'Miscellaneous varieties', priceMultiplier: 1.1 }
      ],

      // Condition factors
      conditions: [
        { grade: 'Superb', description: 'Perfect centering and condition', priceMultiplier: 4.0 },
        { grade: 'Very Fine', description: 'Excellent condition', priceMultiplier: 2.0 },
        { grade: 'Fine', description: 'Good condition', priceMultiplier: 1.0 },
        { grade: 'Average', description: 'Standard condition', priceMultiplier: 0.5 },
        { grade: 'Poor', description: 'Damaged condition', priceMultiplier: 0.2 }
      ],

      // Usage state
      usageStates: [
        { state: 'Mint', description: 'Never hinged original gum', priceMultiplier: 2.0 },
        { state: 'Mint Hinged', description: 'Original gum with hinge mark', priceMultiplier: 1.5 },
        { state: 'Used', description: 'Postally used', priceMultiplier: 1.0 },
        { state: 'No Gum', description: 'Without original gum', priceMultiplier: 0.3 }
      ],

      // Market factors
      marketFactors: {
        catalogPrice: 150.00,
        estimatedValue: 120.00,
        actualSales: [
          { date: '2024-01-15', price: 135.00, venue: 'Auction House A' },
          { date: '2024-02-20', price: 125.00, venue: 'Online Marketplace' },
          { date: '2024-03-10', price: 140.00, venue: 'Stamp Show' }
        ],
        marketTrend: 'stable',
        rarity: 'common',
        demandLevel: 'moderate'
      }
    }

    return { baseStamp, additionalCategories }
  }

  // Helper functions to decode stamp code parts
  const getColorName = (colorCode: string): string => {
    const colorMap: { [key: string]: string } = {
      'Blu': 'Blue', 'R': 'Red', 'G': 'Green', 'Y': 'Yellow', 'Yel': 'Yellow',
      'Blk': 'Black', 'Wh': 'White', 'Br': 'Brown', 'Or': 'Orange', 'Pur': 'Purple',
      'Pk': 'Pink', 'Gr': 'Gray', 'V': 'Violet'
    }
    return colorMap[colorCode] || colorCode
  }

  const getPaperName = (paperCode: string): string => {
    const paperMap: { [key: string]: string } = {
      'wh': 'White Paper', 'cr': 'Cream Paper', 'gw': 'Glazed White',
      'pel': 'Pelure Paper', 'cha': 'Chalk Surfaced', 'flu': 'Fluorescent',
      'syn': 'Synthetic', 'emb': 'Embossed', 'ton': 'Toned Paper'
    }
    return paperMap[paperCode] || paperCode
  }

  const getPerforation = (perforationCode: string): string => {
    if (perforationCode.startsWith('P')) {
      return perforationCode.substring(1).replace(/(\d+)/, '$1.0')
    }
    return perforationCode
  }

  const getWatermarkName = (watermarkCode: string): string => {
    const watermarkMap: { [key: string]: string } = {
      'WmkStar': 'Star Watermark', 'WmkNZStr6mm': 'NZ and Star 6mm',
      'WmkCrownCC': 'Crown over CC', 'WmkLgStr': 'Large Star',
      'NoWmk': 'No Watermark', 'WmkCrown': 'Crown Watermark'
    }
    return watermarkMap[watermarkCode] || watermarkCode
  }

  const getItemTypeName = (itemTypeCode: string): string => {
    const itemTypeMap: { [key: string]: string } = {
      'St001': 'Standard Stamp', 'Bklt': 'Booklet', 'Sht': 'Sheet',
      'Coil': 'Coil Stamp', 'FDC': 'First Day Cover', 'Max': 'Maximum Card'
    }
    return itemTypeMap[itemTypeCode] || itemTypeCode
  }

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    
    return countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [countries, searchTerm])

  // Get current modal
  const currentModal = modalStack[modalStack.length - 1]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stamp catalog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 ${traditionalStyles.background}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`text-4xl font-bold ${traditionalStyles.text} ${traditionalStyles.vintage}`}>
              Visual Catalogue
            </h1>
            <p className={`text-lg ${traditionalStyles.mutedText} mt-2`}>
              Navigate through stamps by hierarchical categories
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              Total Countries: {countries.length}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCountries.map((country) => (
          <Card 
            key={country.code}
            className={`${traditionalStyles.card} hover:shadow-lg transition-shadow cursor-pointer`}
            onClick={() => handleCountryClick(country)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <CardTitle className={`text-lg ${traditionalStyles.text}`}>
                      {country.name}
                    </CardTitle>
                    <p className={`text-sm ${traditionalStyles.mutedText}`}>
                      {country.code}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Archive className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm ${traditionalStyles.mutedText}`}>
                    {country.totalStamps.toLocaleString()} stamps
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Stack Rendering - LIFO with stacked positioning */}
      {modalStack.map((modal, index) => (
        <Dialog key={index} open={true} onOpenChange={() => {
          // Close only the top modal (LIFO)
          if (index === modalStack.length - 1) {
            closeModal()
          }
        }}>
          <DialogContent 
            className="max-w-6xl max-h-[90vh] overflow-y-auto"
            style={{
              zIndex: 50 + index * 10,
            }}
          >
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {modal.title}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Stamp Code: <code className="bg-gray-100 px-2 py-1 rounded">{modal.stampCode}</code>
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            {/* Render content based on modal type */}
            {modal.type === 'country' && (
              <CountryModalContent 
                data={modal.data} 
                onStampGroupClick={(group) => handleStampGroupClick(group, modal.stampCode)}
              />
            )}
            {modal.type === 'stampGroup' && (
              <StampGroupModalContent 
                data={modal.data} 
                onYearClick={(year) => handleYearClick(year, modal.stampCode)}
              />
            )}
            {modal.type === 'year' && (
              <YearModalContent 
                data={modal.data} 
                onCurrencyClick={(currency) => handleCurrencyClick(currency, modal.stampCode)}
              />
            )}
            {modal.type === 'currency' && (
              <CurrencyModalContent 
                data={modal.data} 
                onDenominationClick={(denomination) => handleDenominationClick(denomination, modal.stampCode)}
              />
            )}
            {modal.type === 'denomination' && (
              <DenominationModalContent 
                data={modal.data} 
                onColorClick={(color) => handleColorClick(color, modal.stampCode)}
              />
            )}
            {modal.type === 'color' && (
              <ColorModalContent 
                data={modal.data} 
                onPaperClick={(paper) => handlePaperClick(paper, modal.stampCode)}
              />
            )}
            {modal.type === 'paper' && (
              <PaperModalContent 
                data={modal.data} 
                onWatermarkClick={(watermark) => handleWatermarkClick(watermark, modal.stampCode)}
              />
            )}
            {modal.type === 'watermark' && (
              <WatermarkModalContent 
                data={modal.data} 
                onPerforationClick={(perforation) => handlePerforationClick(perforation, modal.stampCode)}
              />
            )}
            {modal.type === 'perforation' && (
              <PerforationModalContent 
                data={modal.data} 
                onItemTypeClick={(itemType) => handleItemTypeClick(itemType, modal.stampCode)}
              />
            )}
            {modal.type === 'itemType' && (
              <ItemTypeModalContent 
                data={modal.data}
                onStampClick={(stamp) => handleStampDetailClick(stamp)}
              />
            )}
            {modal.type === 'stampDetails' && (
              <StampDetailsModalContent 
                data={modal.data}
                onAdditionalCategoryClick={handleAdditionalCategoryClick}
                onStampClick={(stamp) => handleStampDetailClick(stamp)}
              />
            )}
            {(modal.type === 'postalHistory' || modal.type === 'postmarks' || modal.type === 'proofs' || 
              modal.type === 'essays' || modal.type === 'onPiece' || modal.type === 'errors' || modal.type === 'other') && (
              <AdditionalCategoryModalContent 
                data={modal.data}
                onCategoryOptionClick={handleAdditionalCategoryOptionClick}
              />
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}

// Modal Content Components
function CountryModalContent({ data, onStampGroupClick }: { 
  data: { country: CountryOption, stampGroups: StampGroupOption[] }
  onStampGroupClick: (group: StampGroupOption) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.stampGroups.map((group) => (
          <Card 
            key={group.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onStampGroupClick(group)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={group.stampImageUrl}
                  alt={group.name}
                  width={60}
                  height={80}
                  className="rounded border"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stamps/no-image-available.png'
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{group.name}</h3>
                  <p className="text-xs text-gray-500">#{group.catalogNumber}</p>
                  <p className="text-xs text-gray-400">{group.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StampGroupModalContent({ data, onYearClick }: { 
  data: { group: StampGroupOption, years: YearOption[] }
  onYearClick: (year: YearOption) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.years.map((year) => (
          <Card 
            key={year.year}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onYearClick(year)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-bold text-lg">{year.year}</h3>
              <p className="text-xs text-gray-500">{year.totalStamps} stamps</p>
              <p className="text-xs text-gray-400">{year.firstIssue} - {year.lastIssue}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function YearModalContent({ data, onCurrencyClick }: { 
  data: { year: YearOption, currencies: CurrencyOption[] }
  onCurrencyClick: (currency: CurrencyOption) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.currencies.map((currency) => (
          <Card 
            key={currency.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCurrencyClick(currency)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <Coins className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{currency.name}</h3>
                  <p className="text-sm text-gray-500">{currency.symbol} - {currency.code}</p>
                  <p className="text-xs text-gray-400">{currency.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CurrencyModalContent({ data, onDenominationClick }: { 
  data: { currency: CurrencyOption, denominations: DenominationOption[] }
  onDenominationClick: (denomination: DenominationOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.denominations.map((denomination, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onDenominationClick(denomination)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={denomination.stampImageUrl}
                  alt={denomination.displayName}
                  width={50}
                  height={60}
                  className="rounded border"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stamps/no-image-available.png'
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{denomination.displayName}</h3>
                  <p className="text-xs text-gray-400">{denomination.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DenominationModalContent({ data, onColorClick }: { 
  data: { denomination: DenominationOption, colors: ColorOption[] }
  onColorClick: (color: ColorOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.colors.map((color) => (
          <Card 
            key={color.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onColorClick(color)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color.hexColor }}
                  />
                  <Image
                    src={color.stampImageUrl}
                    alt={color.name}
                    width={50}
                    height={60}
                    className="rounded border"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{color.name}</h3>
                  <p className="text-sm text-gray-500">{color.code}</p>
                  <p className="text-xs text-gray-400">{color.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PaperModalContent({ data, onWatermarkClick }: { 
  data: { paper: PaperOption, watermarks: WatermarkOption[] }
  onWatermarkClick: (watermark: WatermarkOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.watermarks.map((watermark) => (
          <Card 
            key={watermark.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onWatermarkClick(watermark)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={watermark.stampImageUrl}
                  alt={watermark.name}
                  width={60}
                  height={80}
                  className="rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{watermark.name}</h3>
                  <p className="text-sm text-gray-500">{watermark.description}</p>
                  <p className="text-xs text-gray-400">{watermark.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WatermarkModalContent({ data, onPerforationClick }: { 
  data: { watermark: WatermarkOption, perforations: PerforationOption[] }
  onPerforationClick: (perforation: PerforationOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.perforations.map((perforation) => (
          <Card 
            key={perforation.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onPerforationClick(perforation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={perforation.stampImageUrl}
                  alt={perforation.name}
                  width={60}
                  height={80}
                  className="rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{perforation.name}</h3>
                  <p className="text-sm text-gray-500">{perforation.measurement}</p>
                  <p className="text-xs text-gray-400">{perforation.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PerforationModalContent({ data, onItemTypeClick }: { 
  data: { perforation: PerforationOption, itemTypes: ItemTypeOption[] }
  onItemTypeClick: (itemType: ItemTypeOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.itemTypes.map((itemType) => (
          <Card 
            key={itemType.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onItemTypeClick(itemType)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={itemType.stampImageUrl}
                  alt={itemType.name}
                  width={60}
                  height={80}
                  className="rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{itemType.name}</h3>
                  <p className="text-sm text-gray-500">{itemType.description}</p>
                  <p className="text-xs text-gray-400">{itemType.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ItemTypeModalContent({ data, onStampClick }: { 
  data: { itemType: ItemTypeOption, stamps: StampData[] }
  onStampClick: (stamp: StampData) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.stamps.map((stamp) => (
          <Card 
            key={stamp.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onStampClick(stamp)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Image
                    src={stamp.stampImageUrl}
                    alt={stamp.name}
                    width={120}
                    height={160}
                    className="rounded border"
                    onError={(e) => {
                      e.currentTarget.src = '/images/stamps/no-image-available.png'
                    }}
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-sm">{stamp.name}</h3>
                  <p className="text-xs text-gray-500">{stamp.catalogNumber}</p>
                  <p className="text-xs text-gray-400">
                    {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                  </p>
                  <p className="text-xs text-gray-400">{stamp.issueDate}</p>
                  <div className="mt-2 overflow-hidden">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block">
                      {stamp.stampCode}
                    </code>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ColorModalContent({ data, onPaperClick }: { 
  data: { color: ColorOption, papers: PaperOption[] }
  onPaperClick: (paper: PaperOption) => void 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.papers.map((paper) => (
          <Card 
            key={paper.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onPaperClick(paper)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={paper.stampImageUrl}
                  alt={paper.name}
                  width={60}
                  height={80}
                  className="rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{paper.name}</h3>
                  <p className="text-sm text-gray-500">{paper.description}</p>
                  <p className="text-xs text-gray-400">{paper.totalStamps} stamps</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StampDetailsModalContent({ data, onAdditionalCategoryClick, onStampClick }: { 
  data: { stamp?: StampData, stamps?: StampData[], partialCode?: string, missingFrom?: ModalType, categoryFilter?: AdditionalCategoryOption, baseStampCode?: string, showAsIndividualCards?: boolean, selectedAdditionalCategories?: string[] }
  onAdditionalCategoryClick?: (categoryType: string, stampCode: string) => void
  onStampClick?: (stamp: StampData) => void
}) {
  const { stamp, stamps, partialCode, missingFrom, categoryFilter, baseStampCode, showAsIndividualCards, selectedAdditionalCategories } = data

  if (stamp) {
    // Single stamp detail view with comprehensive categories
    const parsedDetails = stamp.stampDetailsJson ? JSON.parse(stamp.stampDetailsJson) : {}
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Stamp Image and Basic Info */}
          <div className="lg:w-1/3 space-y-4">
            {/* Stamp Image */}
            <div className="relative">
              <Image
                src={stamp.stampImageUrl}
                alt={stamp.name}
                width={250}
                height={300}
                className="rounded-lg border shadow-lg w-full"
                onError={(e) => {
                  e.currentTarget.src = '/images/stamps/no-image-available.png'
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {stamp.catalogNumber}
                </Badge>
              </div>
            </div>

            {/* Additional Categories (from image) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Additional Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Postal History Categories - Only show if not already selected */}
                  {!selectedAdditionalCategories?.includes('postalHistory') && (
                    <button 
                      className="p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('postalHistory', stamp.stampCode)}
                    >
                      <div className="font-medium">Postal History</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('postmarks') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('postmarks', stamp.stampCode)}
                    >
                      <div className="font-medium">Postmarks</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('proofs') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('proofs', stamp.stampCode)}
                    >
                      <div className="font-medium">Proofs</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('essays') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('essays', stamp.stampCode)}
                    >
                      <div className="font-medium">Essays</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('onPiece') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('onPiece', stamp.stampCode)}
                    >
                      <div className="font-medium">On Piece</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('errors') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('errors', stamp.stampCode)}
                    >
                      <div className="font-medium">Errors</div>
                    </button>
                  )}
                  {!selectedAdditionalCategories?.includes('other') && (
                    <button 
                      className="p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border text-left transition-colors"
                      onClick={() => onAdditionalCategoryClick?.('other', stamp.stampCode)}
                    >
                      <div className="font-medium">Other</div>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details and Market Data */}
          <div className="lg:w-2/3 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stamp.name}</h2>
              <p className="text-lg text-gray-600">{stamp.seriesName}</p>
              <p className="text-sm text-gray-500">{stamp.country} • {stamp.issueDate}</p>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">DESCRIPTION</label>
                  <p className="text-sm font-semibold">{stamp.denominationValue}{stamp.denominationSymbol} {stamp.color}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CATALOGUE VALUE</label>
                  <p className="text-sm font-semibold">${parsedDetails.catalogPrice || '150.00'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">MARKET PRICE</label>
                  <p className="text-sm font-semibold">${parsedDetails.currentMarketValue || '120.00'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">PAPER TYPE</label>
                  <p className="text-sm font-semibold">{stamp.paperType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CONDITION</label>
                  <p className="text-sm font-semibold">{parsedDetails.condition || 'Fine'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">USAGE</label>
                  <p className="text-sm font-semibold">{parsedDetails.usage || 'Used'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">PERFORATION</label>
                  <p className="text-sm font-semibold">{parsedDetails.perforation || '12.0'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">WATERMARK</label>
                  <p className="text-sm font-semibold">{parsedDetails.watermark || 'Star'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">POSTAL HISTORY</label>
                  <p className="text-sm font-semibold">{parsedDetails.postalHistoryType || 'Standard'}</p>
                </div>
              </div>
            </div>

            {/* Market Value Box (Telescopic Style from Image) */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Market Value Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Summary */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Catalog</div>
                    <div className="text-lg font-bold text-gray-900">${parsedDetails.catalogPrice || '150.00'}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Estimate</div>
                    <div className="text-lg font-bold text-blue-600">${parsedDetails.estimatedValue || '120.00'}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Current</div>
                    <div className="text-lg font-bold text-green-600">${parsedDetails.currentMarketValue || '125.00'}</div>
                  </div>
                </div>

                {/* Price Factors */}
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Multipliers</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Condition:</span>
                      <span className="ml-2 font-semibold text-blue-600">{parsedDetails.priceFactors?.condition || '1.0x'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Usage:</span>
                      <span className="ml-2 font-semibold text-green-600">{parsedDetails.priceFactors?.usage || '1.0x'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 font-semibold text-purple-600">{parsedDetails.priceFactors?.postalHistory || '1.0x'}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Sales (Telescopic Chart Area) */}
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Sales History</h4>
                  <div className="space-y-2">
                    {parsedDetails.recentSales?.map((sale: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div className="text-sm text-gray-600">{sale.date} • {sale.venue}</div>
                        <div className="text-sm font-semibold text-green-600">${sale.adjustedPrice}</div>
                      </div>
                    )) || (
                      <div className="text-center py-4">
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Price chart area - telescopic view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complete Stamp Code */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Complete Stamp Code</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono block break-all whitespace-pre-wrap">
                  {stamp.stampCode}
                </code>
                {parsedDetails.specialNotes && (
                  <p className="text-xs text-gray-600 mt-2">{parsedDetails.specialNotes}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (stamps && stamps.length > 0) {
    if (showAsIndividualCards) {
      // Show stamps as individual clickable cards that open stamp details
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stamps.map((stamp) => (
              <Card 
                key={stamp.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onStampClick?.(stamp)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={stamp.stampImageUrl}
                      alt={stamp.name}
                      width={80}
                      height={100}
                      className="rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/images/stamps/no-image-available.png'
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{stamp.name}</h3>
                      <p className="text-xs text-gray-500">{stamp.catalogNumber}</p>
                      <p className="text-xs text-gray-400">
                        {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                      </p>
                      <div className="mt-2 overflow-hidden">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block">
                          {stamp.stampCode}
                        </code>
                      </div>
                      <div className="mt-2">
                      <Button variant="outline" size="sm" className="mt-2">
                        View Details
                      </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    } else {
      // Regular multiple stamps view (for partial matches)
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Partial Match Found</h3>
                <p className="text-sm text-yellow-700">
                  Some categories are missing from the stamp code. Showing stamps that match: <code>{partialCode}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stamps.map((stamp) => (
              <Card key={stamp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={stamp.stampImageUrl}
                      alt={stamp.name}
                      width={80}
                      height={100}
                      className="rounded border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{stamp.name}</h3>
                      <p className="text-xs text-gray-500">{stamp.catalogNumber}</p>
                      <p className="text-xs text-gray-400">
                        {stamp.denominationValue}{stamp.denominationSymbol} - {stamp.color}
                      </p>
                      <div className="mt-2 overflow-hidden">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all whitespace-pre-wrap word-break overflow-wrap-break-word max-w-full block">
                          {stamp.stampCode}
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No stamp details available</p>
    </div>
  )
}

function AdditionalCategoryModalContent({ data, onCategoryOptionClick }: { 
  data: { categoryType: string, categories: AdditionalCategoryOption[], stampCode: string }
  onCategoryOptionClick: (category: AdditionalCategoryOption, categoryType: string, stampCode: string) => void
}) {
  const { categoryType, categories, stampCode } = data
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.code}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onCategoryOptionClick(category, categoryType, stampCode)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={category.stampImageUrl}
                  alt={category.name}
                  width={60}
                  height={80}
                  className="rounded border"
                  onError={(e) => {
                    e.currentTarget.src = '/images/stamps/no-image-available.png'
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{category.totalStamps} stamps</p>
                    <div className="flex items-center space-x-2">
                      {category.priceMultiplier && (
                        <Badge variant="outline" className="text-xs">
                          {category.priceMultiplier}x
                        </Badge>
                      )}
                      {category.rarity && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            category.rarity === 'unique' ? 'bg-purple-100 text-purple-800' :
                            category.rarity === 'extremely rare' ? 'bg-red-100 text-red-800' :
                            category.rarity === 'very rare' ? 'bg-orange-100 text-orange-800' :
                            category.rarity === 'rare' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {category.rarity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function VisualCataloguePage() {
  return (
    <AuthGuard>
      <CatalogContent />
    </AuthGuard>
  )
} 