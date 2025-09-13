import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption } from "@/types/catalog"

export const generateCountriesData = async (): Promise<CountryOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return [
    { code: 'NZ', name: 'New Zealand', totalStamps: 15420 },
    { code: 'AU', name: 'Australia', totalStamps: 12380 },
    { code: 'GB', name: 'Great Britain', totalStamps: 18950 },
    { code: 'US', name: 'United States', totalStamps: 22100 },
    { code: 'CA', name: 'Canada', totalStamps: 9840 },
    { code: 'FR', name: 'France', totalStamps: 14200 },
    { code: 'DE', name: 'Germany', totalStamps: 16750 },
    { code: 'IT', name: 'Italy', totalStamps: 11890 },
  ]
}

export const generateStampGroupsData = async (countryCode: string): Promise<{id: string, name: string, catalogNumber: string, totalStamps: number, stampImageUrl: string}[]> => {
  // Simulate API call to get stamp groups for country
  await new Promise(resolve => setTimeout(resolve, 300))
  const groups: {id: string, name: string, catalogNumber: string, totalStamps: number, stampImageUrl: string}[] = []

  for (let i = 1; i <= 50; i++) {
    const catalogNumber = `${String(i).padStart(3, '0')}`
    groups.push({
      id: `${countryCode}-${catalogNumber}`,
      name: `Series ${catalogNumber} - Queen Victoria Chalon`,
      catalogNumber,
      totalStamps: Math.floor(Math.random() * 100) + 20,
      stampImageUrl: '/images/stamps/no-image-available.png'
    })
  }

  return groups
}

export const generateYearsData = async (stampCode: string, groupNumber: string): Promise<YearOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
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

export const generateCurrenciesData = async (stampCode: string, year: number): Promise<CurrencyOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const currencies: CurrencyOption[] = [
    { code: 'GBP', name: 'Pound Sterling', symbol: '£', totalStamps: 120 },
    { code: 'USD', name: 'US Dollar', symbol: '$', totalStamps: 85 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', totalStamps: 95 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', totalStamps: 65 },
    { code: 'EUR', name: 'Euro', symbol: '€', totalStamps: 110 },
  ]

  return currencies
}

export const generateDenominationsData = async (stampCode: string, currencyCode: string): Promise<DenominationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const values = ['1/2', '1', '2', '3', '4', '6', '8', '10', '1s', '2s', '5s', '10s']
  const symbol = currencyCode === 'GBP' ? 'd' : currencyCode === 'USD' ? 'c' : 'c'

  return values.map(value => ({
    value,
    symbol,
    displayName: `${value}${symbol}`,
    totalStamps: Math.floor(Math.random() * 30) + 5,
    stampImageUrl: '/images/stamps/no-image-available.png'
  }))
}

export const generateColorsData = async (stampCode: string, denomination: string): Promise<ColorOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const colors: ColorOption[] = [
    { code: 'Blu', name: 'Blue', hex: '#0066CC', totalStamps: 25, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'R', name: 'Red', hex: '#CC0000', totalStamps: 20, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Gr', name: 'Green', hex: '#00AA00', totalStamps: 18, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Pur', name: 'Purple', hex: '#6600CC', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Br', name: 'Brown', hex: '#8B4513', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Blk', name: 'Black', hex: '#000000', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Yel', name: 'Yellow', hex: '#FFDD00', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png' },
  ]

  return colors
}

export const generatePapersData = async (stampCode: string, colorCode: string): Promise<PaperOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const papers: PaperOption[] = [
    { code: 'wh', name: 'White Paper', description: 'Standard white paper', totalStamps: 15, stampImageUrl: '/images/stamps/white-paper.png' },
    { code: 'ch', name: 'Chalk Surfaced', description: 'Chalk surfaced paper', totalStamps: 12, stampImageUrl: '/images/stamps/chalk-surfaced-paper.png' },
    { code: 'to', name: 'Toned Paper', description: 'Slightly toned paper', totalStamps: 8, stampImageUrl: '/images/stamps/toned-paper.png' },
    { code: 'fl', name: 'Fluorescent', description: 'Fluorescent paper', totalStamps: 6, stampImageUrl: '/images/stamps/glazed-fluorescent-paper.png' },
  ]

  return papers
}

export const generateWatermarksData = async (stampCode: string, paperCode: string): Promise<WatermarkOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const watermarks: WatermarkOption[] = [
    { code: 'WmkNZStr6mm', name: 'NZ and Star 6mm', description: 'New Zealand and Star watermark', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'WmkLgStr', name: 'Large Star', description: 'Large star watermark', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'WmkCrownCC', name: 'Crown Over CC', description: 'Crown over CC watermark', totalStamps: 6, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'NoWmk', name: 'No Watermark', description: 'No watermark present', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png' },
  ]

  return watermarks
}

export const generatePerforationsData = async (stampCode: string, watermarkCode: string): Promise<PerforationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const perforations: PerforationOption[] = [
    { code: 'P12', name: 'Perf 12', measurement: '12.0', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'P13', name: 'Perf 13', measurement: '13.0', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'P14', name: 'Perf 14', measurement: '14.0', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'Imp', name: 'Imperforate', measurement: 'No perforations', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png' },
  ]

  return perforations
}

export const generateItemTypesData = async (stampCode: string, perforationCode: string): Promise<ItemTypeOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const itemTypes: ItemTypeOption[] = [
    { code: 'St001', name: 'Stamp', description: 'Regular stamp', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png' },
    { code: 'OnP01', name: 'On Piece', description: 'Stamp on piece', totalStamps: 5, stampImageUrl: '/images/stamps/stamp-on-piece.png' },
    { code: 'OnC01', name: 'On Card', description: 'Stamp on card', totalStamps: 3, stampImageUrl: '/images/stamps/stamp-on-card.png' },
    { code: 'OnE01', name: 'On Envelope', description: 'Stamp on envelope', totalStamps: 4, stampImageUrl: '/images/stamps/stamp-on-envelope.png' },
  ]

  return itemTypes
}

export const generateStampDetails = async (stampCode: string, itemTypeCode: string): Promise<StampData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const baseData = generateComprehensiveStampData(stampCode)
  const stamps: StampData[] = []

  for (let i = 1; i <= Math.floor(Math.random() * 8) + 3; i++) {
    const conditionIndex = Math.floor(Math.random() * baseData.additionalCategories.conditions.length)
    const usageIndex = Math.floor(Math.random() * baseData.additionalCategories.usageStates.length)
    const postalHistoryIndex = Math.floor(Math.random() * baseData.additionalCategories.postalHistory.length)

    const condition = baseData.additionalCategories.conditions[conditionIndex]
    const usage = baseData.additionalCategories.usageStates[usageIndex]
    const postalHistory = baseData.additionalCategories.postalHistory[postalHistoryIndex]

    const basePrice = baseData.additionalCategories.marketFactors.catalogPrice
    const finalPrice = basePrice * condition.priceMultiplier * usage.priceMultiplier * postalHistory.priceMultiplier

    stamps.push({
      id: `${stampCode}-${itemTypeCode}-${i}`,
      stampId: `${stampCode}-${itemTypeCode}-${i}`,
      parentStampId: stampCode,
      isInstance: false,
      status: 1,
      stampCatalogId: null,
      name: `${baseData.baseStamp.name} - ${postalHistory.type} (${condition.grade})`,
      publisher: 'Unknown',
      country: baseData.baseStamp.country,
      countryCode: 'NZ',
      stampImageUrl: '/images/stamps/no-image-available.png',
      catalogName: null,
      catalogNumber: `SG${i}${postalHistory.type === 'Proofs' ? 'P' : postalHistory.type === 'Essays' ? 'E' : ''}`,
      seriesName: baseData.baseStamp.seriesName,
      issueDate: baseData.baseStamp.issueDate,
      issueYear: baseData.baseStamp.issueYear,
      denominationValue: parseInt(stampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
      denominationCurrency: 'GBP',
      denominationSymbol: stampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
      color: getColorName(stampCode.split('.')[5] || 'Blu'),
      paperType: getPaperName(stampCode.split('.')[6] || 'wh'),
      stampDetailsJson: JSON.stringify({
        perforation: getPerforation(stampCode.split('.')[8] || 'P12'),
        watermark: getWatermarkName(stampCode.split('.')[7] || 'WmkStar'),
        printingMethod: 'Engraved',
        printer: 'Unknown',
        itemType: getItemTypeName(itemTypeCode),
        postalHistoryType: postalHistory.type,
        postalHistoryDescription: postalHistory.description,
        condition: condition.grade,
        conditionDescription: condition.description,
        usage: usage.state,
        usageDescription: usage.description,
        catalogPrice: basePrice.toFixed(2),
        estimatedValue: (finalPrice * 0.8).toFixed(2),
        currentMarketValue: finalPrice.toFixed(2),
        priceFactors: {
          condition: `${condition.priceMultiplier}x`,
          usage: `${usage.priceMultiplier}x`,
          postalHistory: `${postalHistory.priceMultiplier}x`
        },
        recentSales: baseData.additionalCategories.marketFactors.actualSales.map(sale => ({
          ...sale,
          adjustedPrice: (sale.price * condition.priceMultiplier * usage.priceMultiplier * postalHistory.priceMultiplier).toFixed(2)
        })),
        marketTrend: baseData.additionalCategories.marketFactors.marketTrend,
        rarity: baseData.additionalCategories.marketFactors.rarity,
        demandLevel: baseData.additionalCategories.marketFactors.demandLevel,
        specialNotes: postalHistory.type === 'Errors' ? 'Rare printing error increases value significantly' :
          postalHistory.type === 'Proofs' ? 'Printer proof - very limited quantity' :
            postalHistory.type === 'Essays' ? 'Design essay - extremely rare' :
              'Standard catalog entry with market pricing variations'
      }),
      mintValue: finalPrice,
      finestUsedValue: finalPrice * 0.9,
      usedValue: finalPrice * 0.8,
      rarity: baseData.additionalCategories.marketFactors.rarity,
      condition: condition.grade,
      story: `${baseData.baseStamp.name} in ${condition.grade} condition`,
      stampGroupName: '',
      instances: [],
      typeName: postalHistory.type,
      categoryCode: itemTypeCode
    })
  }

  return stamps
}

export const generateAdditionalCategoriesData = async (categoryType: string, stampCode: string): Promise<AdditionalCategoryOption[]> => {
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
      { code: 'CDS', name: 'Circular Date Stamp', description: 'Standard circular postmark', totalStamps: 120, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.0, rarity: 'common' },
      { code: 'DUPLEX', name: 'Duplex Cancel', description: 'Combined postmark and killer', totalStamps: 85, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.3, rarity: 'common' },
      { code: 'NUMERAL', name: 'Numeral Cancel', description: 'Numeric obliterator', totalStamps: 67, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.5, rarity: 'uncommon' },
      { code: 'SPECIAL', name: 'Special Occasion', description: 'Commemorative or special event postmark', totalStamps: 23, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 3.0, rarity: 'rare' }
    ],
    'proofs': [
      { code: 'DIE', name: 'Die Proof', description: 'Proof taken from the original die', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'PLATE', name: 'Plate Proof', description: 'Proof taken from the printing plate', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 8.0, rarity: 'very rare' },
      { code: 'TRIAL', name: 'Trial Color Proof', description: 'Proof in different color', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 6.0, rarity: 'rare' },
      { code: 'PROG', name: 'Progressive Proof', description: 'Proof showing stages of printing', totalStamps: 6, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 12.0, rarity: 'extremely rare' }
    ],
    'essays': [
      { code: 'DESIGN', name: 'Design Essay', description: 'Original design proposal', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'COLOR', name: 'Color Essay', description: 'Alternative color scheme', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 12.0, rarity: 'very rare' },
      { code: 'FRAME', name: 'Frame Essay', description: 'Border or frame design variant', totalStamps: 7, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'COMP', name: 'Composite Essay', description: 'Multiple design elements combined', totalStamps: 3, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 25.0, rarity: 'unique' }
    ],
    'onPiece': [
      { code: 'ENV_PIECE', name: 'Envelope Piece', description: 'Corner or piece of envelope', totalStamps: 95, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.8, rarity: 'common' },
      { code: 'CARD_PIECE', name: 'Card Piece', description: 'Piece of postal card', totalStamps: 43, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
      { code: 'DOC_PIECE', name: 'Document Piece', description: 'Piece of official document', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.4, rarity: 'uncommon' },
      { code: 'WRAP_PIECE', name: 'Wrapper Piece', description: 'Piece of newspaper wrapper', totalStamps: 19, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.8, rarity: 'rare' }
    ],
    'errors': [
      { code: 'MISPERF', name: 'Misperforated', description: 'Perforations in wrong position', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 8.0, rarity: 'rare' },
      { code: 'MISSING_COLOR', name: 'Missing Color', description: 'One or more colors omitted', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'very rare' },
      { code: 'DOUBLE_PRINT', name: 'Double Print', description: 'Printed twice, images offset', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'INVERTED', name: 'Inverted Center', description: 'Center design upside down', totalStamps: 2, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 50.0, rarity: 'unique' },
      { code: 'IMPERF', name: 'Imperforate', description: 'Missing perforations', totalStamps: 18, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 6.0, rarity: 'rare' }
    ],
    'other': [
      { code: 'SPECIMENS', name: 'Specimens', description: 'Stamps overprinted SPECIMEN', totalStamps: 25, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 3.0, rarity: 'uncommon' },
      { code: 'REPRINTS', name: 'Reprints', description: 'Later reprints of original stamps', totalStamps: 45, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 0.3, rarity: 'common' },
      { code: 'OFFICIALS', name: 'Official Overprints', description: 'Stamps overprinted for official use', totalStamps: 35, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 2.5, rarity: 'uncommon' },
      { code: 'LOCALS', name: 'Local Issues', description: 'Locally produced variants', totalStamps: 20, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 4.0, rarity: 'rare' }
    ]
  }

  return categoryMap[categoryType] || []
}

export const generateStampsForAdditionalCategory = async (baseStampCode: string, categoryType: string, categoryCode: string): Promise<StampData[]> => {
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
      stampId: `${baseStampCode}-${categoryCode}-${i}`,
      parentStampId: baseStampCode,
      isInstance: false,
      status: 1,
      stampCatalogId: null,
      name: `${baseData.baseStamp.name} - ${categoryName} (${categoryCode})`,
      publisher: 'Unknown',
      country: baseData.baseStamp.country,
      countryCode: 'NZ',
      stampImageUrl: '/images/stamps/no-image-available.png',
      catalogName: null,
      catalogNumber: `SG${i}${categoryCode.substring(0, 2)}`,
      seriesName: baseData.baseStamp.seriesName,
      issueDate: baseData.baseStamp.issueDate,
      issueYear: baseData.baseStamp.issueYear,
      denominationValue: parseInt(baseStampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
      denominationCurrency: 'GBP',
      denominationSymbol: baseStampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
      color: getColorName(baseStampCode.split('.')[5] || 'Blu'),
      paperType: getPaperName(baseStampCode.split('.')[6] || 'wh'),
      stampDetailsJson: JSON.stringify({
        perforation: getPerforation(baseStampCode.split('.')[8] || 'P12'),
        watermark: getWatermarkName(baseStampCode.split('.')[7] || 'WmkStar'),
        printingMethod: 'Engraved',
        printer: 'Unknown',
        categoryType: categoryType,
        categoryCode: categoryCode,
        categoryName: categoryName,
        condition: condition.grade,
        conditionDescription: condition.description,
        usage: usage.state,
        usageDescription: usage.description,
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
      mintValue: finalPrice,
      finestUsedValue: finalPrice * 0.9,
      usedValue: finalPrice * 0.8,
      rarity: categoryMultiplier > 10 ? 'extremely rare' : categoryMultiplier > 5 ? 'very rare' : categoryMultiplier > 2 ? 'rare' : 'uncommon',
      condition: condition.grade,
      story: `${baseData.baseStamp.name} - ${categoryName} variant`,
      stampGroupName: '',
      instances: [],
      typeName: categoryName,
      categoryCode: categoryCode
    })
  }

  return stamps
}

export const generateComprehensiveStampData = (baseStampCode: string) => {
  const baseStamp = {
    id: `stamp-${baseStampCode}`,
    name: 'Queen Victoria Chalon',
    country: 'New Zealand',
    stampImageUrl: '/images/stamps/no-image-available.png',
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

  const additionalCategories = {
    postalHistory: [
      { type: 'Postal History', description: 'Used on cover', priceMultiplier: 1.5 },
      { type: 'Postmarks', description: 'Special postmark varieties', priceMultiplier: 1.2 },
      { type: 'Proofs', description: 'Printer proofs', priceMultiplier: 3.0 },
      { type: 'Essays', description: 'Design essays', priceMultiplier: 5.0 },
      { type: 'On Piece', description: 'Stamp on piece of envelope', priceMultiplier: 0.8 },
      { type: 'Errors', description: 'Printing errors', priceMultiplier: 10.0 },
      { type: 'Other', description: 'Miscellaneous varieties', priceMultiplier: 1.1 }
    ],
    conditions: [
      { grade: 'Superb', description: 'Perfect centering and condition', priceMultiplier: 4.0 },
      { grade: 'Very Fine', description: 'Excellent condition', priceMultiplier: 2.0 },
      { grade: 'Fine', description: 'Good condition', priceMultiplier: 1.0 },
      { grade: 'Average', description: 'Standard condition', priceMultiplier: 0.5 },
      { grade: 'Poor', description: 'Damaged condition', priceMultiplier: 0.2 }
    ],
    usageStates: [
      { state: 'Mint', description: 'Never hinged original gum', priceMultiplier: 2.0 },
      { state: 'Mint Hinged', description: 'Original gum with hinge mark', priceMultiplier: 1.5 },
      { state: 'Used', description: 'Postally used', priceMultiplier: 1.0 },
      { state: 'No Gum', description: 'Without original gum', priceMultiplier: 0.3 }
    ],
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

export const getColorName = (colorCode: string): string => {
  const colorMap: { [key: string]: string } = {
    'Blu': 'Blue', 'R': 'Red', 'G': 'Green', 'Y': 'Yellow', 'Yel': 'Yellow',
    'Blk': 'Black', 'Wh': 'White', 'Br': 'Brown', 'Or': 'Orange', 'Pur': 'Purple',
    'Pk': 'Pink', 'Gr': 'Gray', 'V': 'Violet'
  }
  return colorMap[colorCode] || colorCode
}

export const getPaperName = (paperCode: string): string => {
  const paperMap: { [key: string]: string } = {
    'wh': 'White Paper', 'cr': 'Cream Paper', 'gw': 'Glazed White',
    'pel': 'Pelure Paper', 'cha': 'Chalk Surfaced', 'flu': 'Fluorescent',
    'syn': 'Synthetic', 'emb': 'Embossed', 'ton': 'Toned Paper'
  }
  return paperMap[paperCode] || paperCode
}

export const getPerforation = (perforationCode: string): string => {
  if (perforationCode.startsWith('P')) {
    return perforationCode.substring(1).replace(/(\d+)/, '$1.0')
  }
  return perforationCode
}

export const getWatermarkName = (watermarkCode: string): string => {
  const watermarkMap: { [key: string]: string } = {
    'WmkStar': 'Star Watermark', 'WmkNZStr6mm': 'NZ and Star 6mm',
    'WmkCrownCC': 'Crown over CC', 'WmkLgStr': 'Large Star',
    'NoWmk': 'No Watermark', 'WmkCrown': 'Crown Watermark'
  }
  return watermarkMap[watermarkCode] || watermarkCode
}

export const getItemTypeName = (itemTypeCode: string): string => {
  const itemTypeMap: { [key: string]: string } = {
    'St001': 'Standard Stamp', 'Bklt': 'Booklet', 'Sht': 'Sheet',
    'Coil': 'Coil Stamp', 'FDC': 'First Day Cover', 'Max': 'Maximum Card'
  }
  return itemTypeMap[itemTypeCode] || itemTypeCode
} 