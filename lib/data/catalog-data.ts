import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption, SeriesOption } from "@/types/catalog"

export const generateCountriesData = async (): Promise<CountryOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return [
    { 
      code: 'GB', 
      name: 'Great Britain', 
      flag: '🇬🇧', 
      totalStamps: 18950, 
      firstIssue: '1840', 
      lastIssue: '2024', 
      featuredStampUrl: '/images/stamps/stamp.png',
      description: 'The birthplace of postal excellence',
      historicalNote: 'Home to the world\'s first adhesive postage stamp, the Penny Black, issued on May 1, 1840, setting the gold standard for philatelic approval.'
    },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
      totalStamps: 22100, 
    firstIssue: '1847',
    lastIssue: '2024',
      featuredStampUrl: '/images/stamps/stamp.png',
      description: 'American innovation in stamp design',
      historicalNote: 'The first U.S. stamps featured Benjamin Franklin and George Washington, establishing an enduring tradition of honoring national figures with philatelic approval.'
    },
    { 
      code: 'FR', 
      name: 'France', 
      flag: '🇫🇷', 
      totalStamps: 14200, 
      firstIssue: '1849', 
    lastIssue: '2024',
      featuredStampUrl: '/images/stamps/stamp.png',
      description: 'Artistic elegance in every issue',
      historicalNote: 'French stamps have long been celebrated for their artistic beauty and technical precision, earning worldwide approval from collectors and designers alike.'
    },
    { 
      code: 'DE', 
      name: 'Germany', 
      flag: '🇩🇪', 
      totalStamps: 16750, 
      firstIssue: '1872', 
    lastIssue: '2024',
      featuredStampUrl: '/images/stamps/stamp.png',
      description: 'Precision and innovation combined',
      historicalNote: 'German stamps reflect the nation\'s commitment to engineering excellence and design precision, consistently earning approval for their technical quality.'
    },
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
        totalStamps: 12380, 
      firstIssue: '1856',
      lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png',
        description: 'Natural wonders on stamps',
        historicalNote: 'Australian stamps showcase the continent\'s unique flora and fauna, earning international approval for their vibrant depictions of natural heritage.'
      },
      { 
        code: 'CA', 
        name: 'Canada', 
        flag: '🇨🇦', 
        totalStamps: 9840, 
        firstIssue: '1851', 
      lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png',
        description: 'Natural majesty preserved in miniature',
        historicalNote: 'The famous "Three-penny Beaver" was the world\'s first stamp to feature an animal, earning immediate approval and setting a new standard for wildlife on stamps.'
      },
      { 
        code: 'JP', 
        name: 'Japan', 
        flag: '🇯🇵', 
        totalStamps: 13560, 
        firstIssue: '1871', 
      lastIssue: '2024',
        featuredStampUrl: '/images/stamps/stamp.png',
        description: 'Where tradition meets innovation',
        historicalNote: 'Japanese stamps beautifully blend traditional artistic elements with modern design principles, earning approval for their cultural authenticity and aesthetic excellence.'
      },
      { 
        code: 'CH', 
        name: 'Switzerland', 
        flag: '🇨🇭', 
        totalStamps: 8920, 
        firstIssue: '1850', 
        lastIssue: '2024', 
        featuredStampUrl: '/images/stamps/stamp.png',
        description: 'Alpine precision meets design excellence',
        historicalNote: 'Swiss stamps are universally approved for their exceptional quality, innovative security features, and meticulous attention to detail that reflects the nation\'s commitment to excellence.'
      }
    ]
  }

export const generateStampGroupsData = async (countryCode: string): Promise<SeriesOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const groups: SeriesOption[] = []
  for (let i = 1; i <= 50; i++) {
    const catalogNumber = `${String(i).padStart(3, '0')}`
    groups.push({
      id: `${countryCode}-${catalogNumber}`,
      name: `Series ${catalogNumber} - Queen Victoria Chalon`,
      catalogNumber,
      totalStamps: Math.floor(Math.random() * 100) + 20,
      stampImageUrl: '/images/stamps/stamp.png',
      description: `Premium collection from the ${catalogNumber} series featuring detailed engravings worthy of collector approval`,
      period: '1855-1875',
      featured: i <= 3
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
      lastIssue: `${year}-12-20`,
    })
  }
  return years
}

export const generateCurrenciesData = async (stampCode: string, year: number): Promise<CurrencyOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'GBP', name: 'Pound Sterling', symbol: '£', totalStamps: 120, description: 'The prestigious currency of the British Empire' },
    { code: 'USD', name: 'US Dollar', symbol: '$', totalStamps: 85, description: 'America\'s emerging economic influence' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', totalStamps: 95, description: 'Colonial currency of the Australian territories' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', totalStamps: 65, description: 'Currency of the Canadian Dominion' },
    { code: 'EUR', name: 'Euro', symbol: '€', totalStamps: 110, description: 'Modern European monetary unity' }
  ]
}

export const generateDenominationsData = async (stampCode: string, currencyCode: string): Promise<DenominationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const values = ['1/2', '1', '2', '3', '4', '6', '8', '10', '1s', '2s', '5s', '10s']
  const symbol = currencyCode === 'GBP' ? 'd' : currencyCode === 'USD' ? 'c' : 'c'
  return values.map((value, index) => ({
    value,
    symbol,
    displayName: `${value}${symbol}`,
    totalStamps: Math.floor(Math.random() * 30) + 5,
    stampImageUrl: '/images/stamps/stamp.png',
    commonColors: ['Red', 'Blue', 'Green'],
    featured: index < 2
  }))
}

export const generateColorsData = async (stampCode: string, denomination: string): Promise<ColorOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'Blu', name: 'Royal Blue', hex: '#1e40af', totalStamps: 25, stampImageUrl: '/images/stamps/stamp.png', popularity: 9, description: 'The distinguished blue of royal heritage' },
    { code: 'R', name: 'Carmine Red', hex: '#dc2626', totalStamps: 20, stampImageUrl: '/images/stamps/stamp.png', popularity: 8, description: 'A bold red that commands approval' },
    { code: 'Gr', name: 'Emerald Green', hex: '#059669', totalStamps: 18, stampImageUrl: '/images/stamps/stamp.png', popularity: 7, description: 'The rich green of precious emeralds' },
    { code: 'Pur', name: 'Imperial Purple', hex: '#7c3aed', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png', popularity: 6, description: 'The purple of nobility and prestige' },
    { code: 'Br', name: 'Sepia Brown', hex: '#92400e', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', popularity: 5, description: 'Warm brown tones of vintage excellence' },
    { code: 'Blk', name: 'Jet Black', hex: '#1f2937', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png', popularity: 4, description: 'The profound depth of classic black' },
    { code: 'Yel', name: 'Golden Yellow', hex: '#f59e0b', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', popularity: 3, description: 'Bright as sunshine, valuable as gold' }
  ]
}

export const generatePapersData = async (stampCode: string, colorCode: string): Promise<PaperOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'wh', name: 'Pure White Paper', description: 'Premium white paper for optimal color reproduction', totalStamps: 15, stampImageUrl: '/images/stamps/white-paper.png', texture: 'Smooth', technicalNote: 'Crafted from high-quality cotton fibers for lasting approval' },
    { code: 'ch', name: 'Chalk Surfaced Paper', description: 'Paper with specialized chalk coating for enhanced security', totalStamps: 12, stampImageUrl: '/images/stamps/chalk-surfaced-paper.png', texture: 'Textured', technicalNote: 'Prevents tampering and ensures stamp authenticity' },
    { code: 'to', name: 'Toned Paper', description: 'Aged paper with warm, vintage character', totalStamps: 8, stampImageUrl: '/images/stamps/toned-paper.png', texture: 'Vintage', technicalNote: 'Natural aging creates distinctive character approved by collectors' },
    { code: 'fl', name: 'Fluorescent Paper', description: 'Modern paper with advanced optical brighteners', totalStamps: 6, stampImageUrl: '/images/stamps/glazed-fluorescent-paper.png', texture: 'Modern', technicalNote: 'Glows under UV light for enhanced security approval' }
  ]
}

export const generateWatermarksData = async (stampCode: string, paperCode: string): Promise<WatermarkOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'WmkNZStr6mm', name: 'NZ and Star 6mm', description: 'New Zealand and Star watermark pattern', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png', pattern: 'Star', historicalInfo: 'Used during the colonial period for authentication' },
    { code: 'WmkLgStr', name: 'Large Star', description: 'Large star watermark for premium stamps', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', pattern: 'Large Star', historicalInfo: 'Symbol of imperial connection and approval' },
    { code: 'WmkCrownCC', name: 'Crown Over CC', description: 'Crown over CC colonial watermark', totalStamps: 6, stampImageUrl: '/images/stamps/stamp.png', pattern: 'Crown', historicalInfo: 'Crown Colony designation mark of official approval' },
    { code: 'NoWmk', name: 'No Watermark', description: 'No watermark present', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png', pattern: 'None', historicalInfo: 'Later printing methods without watermark authentication' }
  ]
}

export const generatePerforationsData = async (stampCode: string, watermarkCode: string): Promise<PerforationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'P12', name: 'Perf 12', measurement: '12.0', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', style: 'Standard', technicalDetail: '12 holes per 2 centimeters - industry standard' },
    { code: 'P13', name: 'Perf 13', measurement: '13.0', totalStamps: 10, stampImageUrl: '/images/stamps/stamp.png', style: 'Fine', technicalDetail: '13 holes per 2 centimeters - fine quality' },
    { code: 'P14', name: 'Perf 14', measurement: '14.0', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', style: 'Very Fine', technicalDetail: '14 holes per 2 centimeters - premium grade' },
    { code: 'Imp', name: 'Imperforate', measurement: 'No perforations', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png', style: 'Special', technicalDetail: 'Hand-cut stamps for collectors\' approval' }
  ]
}

export const generateItemTypesData = async (stampCode: string, perforationCode: string): Promise<ItemTypeOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'St001', name: 'Mint Condition', description: 'Pristine unused stamps in perfect condition', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', category: 'Premium Grade', collectorsNote: 'The most sought-after condition, earning highest approval from collectors' },
    { code: 'OnP01', name: 'On Piece', description: 'Stamps still attached to original envelope fragments', totalStamps: 5, stampImageUrl: '/images/stamps/stamp-on-piece.png', category: 'Historical', collectorsNote: 'Preserves postal history context for research approval' },
    { code: 'OnC01', name: 'On Card', description: 'Stamps professionally mounted on collector cards', totalStamps: 3, stampImageUrl: '/images/stamps/stamp-on-card.png', category: 'Display Ready', collectorsNote: 'Perfect for exhibition and display approval' },
    { code: 'OnE01', name: 'On Cover', description: 'Complete postal covers with stamps attached', totalStamps: 4, stampImageUrl: '/images/stamps/stamp-on-envelope.png', category: 'Complete History', collectorsNote: 'Full postal documents earning historical approval' }
  ]
}

export const generateStampDetails = async (stampCode: string, itemTypeCode: string): Promise<StampData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const stamps: StampData[] = []
  for (let i = 1; i <= Math.floor(Math.random() * 8) + 3; i++) {
    stamps.push({
      id: `${stampCode}-${itemTypeCode}-${i}`,
      name: `Premium Specimen ${i}`,
      country: 'Great Britain',
      countryCode: 'GB',
      stampImageUrl: '/images/stamps/stamp.png',
      catalogNumber: `SOA${i}`,
      catalogName: 'Stamps of Approval',
      seriesName: 'Stamps of Approval Collection',
      issueDate: '1855-01-01',
      issueYear: 1855,
      denominationValue: parseInt(stampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
      denominationSymbol: stampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
      denominationCurrency: 'GBP',
      color: 'Royal Blue',
      paperType: 'Pure White',
      stampDetailsJson: JSON.stringify({
        perforation: '12.0',
        watermark: 'Crown',
        printingMethod: 'Line Engraving',
        catalogPrice: '£125.00',
        marketValue: '£89.50',
      }),
      stampCode: `${stampCode}.${itemTypeCode}`,
      estimatedMarketValue: Math.floor(Math.random() * 1000) + 50,
      actualPrice: Math.floor(Math.random() * 800) + 30,
      rarity: ['Common', 'Uncommon', 'Rare', 'Collector Approved'][Math.floor(Math.random() * 4)],
      condition: ['Mint', 'Near Mint', 'Fine', 'Premium'][Math.floor(Math.random() * 4)],
      story: `This exceptional specimen from the ${1855 + i} series represents the pinnacle of Victorian printing mastery. Each stamp has earned its place in our collection through meticulous evaluation and collector approval, showcasing the finest examples of postal artistry and historical significance.`,
      status: 1,
      userId: 'dummyUser',
      stampCatalogId: null,
      stampGroupId: `group-${stampCode}`,
      publisher: 'Unknown Publisher',
      instances: []
    })
  }
  return stamps
}

export const generateAdditionalCategoriesData = async (categoryType: string, stampCode: string): Promise<AdditionalCategoryOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const categoryMap: { [key: string]: AdditionalCategoryOption[] } = {
    'postalHistory': [
      { code: 'COVER', name: 'On Cover', description: 'Stamp used on envelope or cover earning historical approval', totalStamps: 45, stampImageUrl: '/images/stamps/stamp-on-envelope.png', priceMultiplier: 1.8, rarity: 'common' },
      { code: 'PIECE', name: 'On Piece', description: 'Stamp on piece of envelope or card with collector approval', totalStamps: 32, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
      { code: 'CARD', name: 'On Card', description: 'Stamp on postal card with documented approval', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-card.png', priceMultiplier: 1.2, rarity: 'uncommon' },
      { code: 'NEWS', name: 'On Newspaper', description: 'Stamp used on newspaper wrapper - rare approval', totalStamps: 15, stampImageUrl: '/images/stamps/stamp-on-newspaper.png', priceMultiplier: 2.5, rarity: 'rare' }
    ],
    'postmarks': [
      { code: 'CDS', name: 'Circular Date Stamp', description: 'Standard circular postmark with clear approval', totalStamps: 120, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.0, rarity: 'common' },
      { code: 'DUPLEX', name: 'Duplex Cancel', description: 'Combined postmark and killer earning approval', totalStamps: 85, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.3, rarity: 'common' },
      { code: 'NUMERAL', name: 'Numeral Cancel', description: 'Numeric obliterator with collector approval', totalStamps: 67, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 1.5, rarity: 'uncommon' },
      { code: 'SPECIAL', name: 'Special Occasion', description: 'Commemorative postmark with premium approval', totalStamps: 23, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 3.0, rarity: 'rare' }
    ],
    'proofs': [
      { code: 'DIE', name: 'Die Proof', description: 'Proof taken from the original die - ultimate approval', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'PLATE', name: 'Plate Proof', description: 'Proof from printing plate with expert approval', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 8.0, rarity: 'very rare' },
      { code: 'TRIAL', name: 'Trial Color Proof', description: 'Alternative color proof earning design approval', totalStamps: 15, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 6.0, rarity: 'rare' },
      { code: 'PROG', name: 'Progressive Proof', description: 'Printing stage proof with technical approval', totalStamps: 6, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 12.0, rarity: 'extremely rare' }
    ],
    'essays': [
      { code: 'DESIGN', name: 'Design Essay', description: 'Original design proposal with artistic approval', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'COLOR', name: 'Color Essay', description: 'Alternative color scheme with approval', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 12.0, rarity: 'very rare' },
      { code: 'FRAME', name: 'Frame Essay', description: 'Border design variant earning approval', totalStamps: 7, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'COMP', name: 'Composite Essay', description: 'Multiple design elements with unique approval', totalStamps: 3, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 25.0, rarity: 'unique' }
    ],
    'onPiece': [
      { code: 'ENV_PIECE', name: 'Envelope Piece', description: 'Corner or piece of envelope with approval', totalStamps: 95, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.8, rarity: 'common' },
      { code: 'CARD_PIECE', name: 'Card Piece', description: 'Piece of postal card with documented approval', totalStamps: 43, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
      { code: 'DOC_PIECE', name: 'Document Piece', description: 'Official document piece earning approval', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.4, rarity: 'uncommon' },
      { code: 'WRAP_PIECE', name: 'Wrapper Piece', description: 'Newspaper wrapper piece with rare approval', totalStamps: 19, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.8, rarity: 'rare' }
    ],
    'errors': [
      { code: 'MISPERF', name: 'Misperforated', description: 'Perforations in wrong position - error approval', totalStamps: 12, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 8.0, rarity: 'rare' },
      { code: 'MISSING_COLOR', name: 'Missing Color', description: 'Colors omitted earning error approval', totalStamps: 8, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 15.0, rarity: 'very rare' },
      { code: 'DOUBLE_PRINT', name: 'Double Print', description: 'Double printing with prestigious approval', totalStamps: 5, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'INVERTED', name: 'Inverted Center', description: 'Upside down center - legendary approval', totalStamps: 2, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 50.0, rarity: 'unique' },
      { code: 'IMPERF', name: 'Imperforate', description: 'Missing perforations earning specialist approval', totalStamps: 18, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 6.0, rarity: 'rare' }
    ],
    'other': [
      { code: 'SPECIMENS', name: 'Specimens', description: 'SPECIMEN overprints with official approval', totalStamps: 25, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 3.0, rarity: 'uncommon' },
      { code: 'REPRINTS', name: 'Reprints', description: 'Later reprints with documented approval', totalStamps: 45, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 0.3, rarity: 'common' },
      { code: 'OFFICIALS', name: 'Official Overprints', description: 'Official use overprints with government approval', totalStamps: 35, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 2.5, rarity: 'uncommon' },
      { code: 'LOCALS', name: 'Local Issues', description: 'Local variants earning regional approval', totalStamps: 20, stampImageUrl: '/images/stamps/stamp.png', priceMultiplier: 4.0, rarity: 'rare' }
    ]
  }
  return categoryMap[categoryType] || []
}

export const generateStampsForAdditionalCategory = async (baseStampCode: string, categoryType: string, categoryCode: string): Promise<StampData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const stamps: StampData[] = []
  const count = Math.floor(Math.random() * 6) + 3
  for (let i = 1; i <= count; i++) {
    let categoryMultiplier = 1.0
    const categoryName = categoryType.charAt(0).toUpperCase() + categoryType.slice(1)

    if (categoryCode === 'DIE') categoryMultiplier = 15.0
    else if (categoryCode === 'DESIGN') categoryMultiplier = 20.0
    else if (categoryCode === 'INVERTED') categoryMultiplier = 50.0
    else if (categoryCode === 'DOUBLE_PRINT') categoryMultiplier = 20.0
    else if (categoryCode === 'MISSING_COLOR') categoryMultiplier = 15.0
    else if (categoryCode.includes('PROOF')) categoryMultiplier = 8.0
    else if (categoryCode.includes('ERROR')) categoryMultiplier = 10.0
    else categoryMultiplier = Math.random() * 3 + 0.5

    const basePrice = 150.00
    const finalPrice = basePrice * categoryMultiplier

    stamps.push({
      id: `${baseStampCode}-${categoryCode}-${i}`,
      name: `Queen Victoria Chalon - ${categoryName} (${categoryCode})`,
      country: 'Great Britain',
      countryCode: 'GB',
      stampImageUrl: '/images/stamps/stamp.png',
      catalogNumber: `SOA${i}${categoryCode.substring(0, 2)}`,
      catalogName: 'Additional Categories',
      seriesName: 'Stamps of Approval Collection',
      issueDate: '1855-01-01',
      issueYear: 1855,
      denominationValue: parseInt(baseStampCode.split('.')[4]?.replace(/[^\d]/g, '') || '2'),
      denominationSymbol: baseStampCode.split('.')[4]?.replace(/[\d]/g, '') || 'd',
      denominationCurrency: 'GBP',
      color: 'Royal Blue',
      paperType: 'Pure White',
      stampDetailsJson: JSON.stringify({
        perforation: '12.0',
        watermark: 'Crown',
        printingMethod: 'Line Engraving',
        designer: 'Unknown',
        printer: 'Unknown',
        categoryType: categoryType,
        categoryCode: categoryCode,
        categoryName: categoryName,
        condition: ['Superb', 'Very Fine', 'Fine'][Math.floor(Math.random() * 3)],
        usage: ['Mint', 'Used'][Math.floor(Math.random() * 2)],
        catalogPrice: basePrice.toFixed(2),
        estimatedValue: (finalPrice * 0.8).toFixed(2),
        currentMarketValue: finalPrice.toFixed(2),
        priceFactors: {
          category: `${categoryMultiplier}x`
        },
        marketTrend: 'stable',
        rarity: categoryMultiplier > 10 ? 'Collector Approved' : categoryMultiplier > 5 ? 'Rare' : categoryMultiplier > 2 ? 'Uncommon' : 'Common',
        specialNotes: `${categoryName} variant with ${categoryCode} characteristics that have earned prestigious collector approval`
      }),
      stampCode: `${baseStampCode}.${categoryCode}`,
      estimatedMarketValue: Math.floor(finalPrice),
      rarity: categoryMultiplier > 10 ? 'Collector Approved' : categoryMultiplier > 5 ? 'Rare' : categoryMultiplier > 2 ? 'Uncommon' : 'Common',
      story: `This exceptional ${categoryName} specimen represents a remarkable example of ${categoryCode} that has earned its place in our collection through meticulous evaluation and expert approval.`,
      status: 1,
      userId: 'dummyUser',
      stampCatalogId: null,
      publisher: 'Unknown Publisher',
      actualPrice: Math.floor(finalPrice * 0.75),
      condition: ['Superb', 'Very Fine', 'Fine'][Math.floor(Math.random() * 3)],
      stampGroupId: `group-${baseStampCode}`,
      instances: []
    })
  }
  return stamps
}

export const featuredStories = [
  {
    id: '1',
    title: 'The Penny Black Revolution',
    subtitle: 'How the world\'s first postage stamp earned universal approval',
    imageUrl: '/images/stamps/stamp.png',
    readTime: '8 min read',
    category: 'Historical Milestones',
    excerpt: 'Discover the fascinating story behind the creation of the Penny Black and how it transformed global communication, earning the approval of nations worldwide.'
  },
  {
    id: '2',
    title: 'Watermarks: Hidden Signatures',
    subtitle: 'The secret marks that give stamps their stamp of approval',
    imageUrl: '/images/stamps/stamp.png',
    readTime: '6 min read',
    category: 'Technical Excellence',
    excerpt: 'Learn to identify the subtle watermarks that authenticate stamps and make them worthy of collector approval.'
  },
  {
    id: '3',
    title: 'Color Mastery in Philately',
    subtitle: 'The artistry that earns stamps lasting approval',
    imageUrl: '/images/stamps/stamp.png',
    readTime: '10 min read',
    category: 'Artistic Heritage',
    excerpt: 'Explore how master printers created the vibrant colors that have earned stamps their enduring approval through the centuries.'
  }
] 

// API Data Structure - Dummy Data for Testing
export const apiStampData = [
  // United Kingdom stamps - complete hierarchy that goes ALL the way down
  {
    "id": "3a3da89c-5a57-454f-84ff-e7eb9445eee4",
    "catalogExtractionProcessId": "1d1d5901-90f7-4600-8c4f-8dc0eeb2c66d",
    "similarityScore": 0,
    "stampId": "1f5d14ee-c57a-4646-bcc3-d95ee98a2dd1",
    "isInstance": false,
    "parentStampId": null,
    "catalogNumber": "K16a",
    "stampCode": "GB.1916.1.5d.black.local.plate",
    "name": "1½d Black (Local Plate)",
    "description": "George V surface-printed 1½d black stamp issued April 1916 on De La Rue chalky paper",
    "country": "GB",
    "countryName": "United Kingdom",
    "countryFlag": "🇬🇧",
    "seriesId": "series_gv_surface_1d_1.5d_black_brown",
    "seriesName": "George V (Surface) — 1d, 1½d black, 1½d brown",
    "seriesDescription": "Surface printed George V stamps including 1d, 1½d black and 1½d brown denominations issued on various papers",
    "typeId": "type_surface_1916",
    "typeName": "Surface",
    "typeDescription": "Surface printed stamps issued in 1916 on De La Rue chalky paper",
    "stampGroupId": "sg_gv_surface_1916_local_plate",
    "stampGroupName": "George V Surface 1½d Black Local Plate",
    "stampGroupDescription": "Local plate printing of the 1½d black George V surface printed stamp on De La Rue chalky paper, April 1916 issue",
    "releaseId": "release_1916_04_de_la_rue_chalky_1.5d_black",
    "releaseName": "1916 (April) on De La Rue chalky paper",
    "releaseDateRange": "April 1916",
    "releaseDescription": "Surface printed 1½d black stamp issued on De La Rue chalky paper in April 1916",
    "categoryId": "cat_k16a",
    "categoryName": "K16a",
    "categoryCode": "K16a",
    "categoryDescription": "1½d Black (Local Plate), Type K16a, perforation 14 x 15, watermark W.7 HM",
    "paperTypeId": "paper_delarue_chalky",
    "paperTypeName": "De La Rue chalky paper",
    "paperTypeCode": "chalky",
    "paperTypeDescription": "Chalky paper produced by De La Rue, used for surface printed stamps in 1916",
    "currencyCode": "GBP",
    "currencyName": "Pound Sterling",
    "currencySymbol": "£",
    "currencyDescription": "British Pound Sterling used in United Kingdom",
    "denominationValue": "1.5",
    "denominationSymbol": "d",
    "denominationDisplay": "1½d",
    "denominationDescription": "One and a half pence denomination",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "colorDescription": "Black color used for printing",
    "colorVariant": "(1) Black",
    "paperCode": "chalky",
    "paperName": "Chalky Paper",
    "paperDescription": "Chalky paper with a smooth surface finish",
    "paperFiber": "Unknown",
    "paperThickness": "Unknown",
    "paperOpacity": "Unknown",
    "watermarkCode": "W.7",
    "watermarkName": "W Crown CA",
    "watermarkDescription": "Watermark W.7, Crown and CA pattern",
    "watermarkPosition": "normal",
    "watermarkClarity": "clear to distinct",
    "perforationCode": "14x15",
    "perforationName": "Perf 14 x 15",
    "perforationMeasurement": "14 x 15",
    "perforationGauge": "14 x 15",
    "perforationCleanCut": true,
    "perforationComb": true,
    "itemTypeCode": "StSurface1dBlack",
    "itemTypeName": "Surface Printed Stamp",
    "itemTypeDescription": "Surface printed postage stamp on chalky paper",
    "itemFormat": "single",
    "issueDate": "1916-04-01",
    "issueYear": 1916,
    "issueMonth": 4,
    "issueDay": 1,
    "firstDayIssue": false,
    "periodStart": 1916,
    "periodEnd": 1933,
    "issueLocation": "United Kingdom",
    "issuePurpose": "Regular postal use",
    "issueContext": "George V surface printed definitive series on chalky paper",
    "printingMethod": "Surface printing",
    "printingProcess": "Surface printing on chalky paper",
    "printingQuality": "Good quality typical of De La Rue surface printing",
    "designer": "Unknown",
    "designerNotes": "Design based on George V portrait",
    "printer": "De La Rue & Co.",
    "printerLocation": "London, England",
    "printerReputation": "Renowned security printer",
    "engraver": "Unknown",
    "dieNumber": "Unknown",
    "plateNumber": "Local Plate (K16a)",
    "plateCharacteristics": "Standard surface printing plate characteristics",
    "paperManufacturer": "De La Rue chalky paper",
    "gumType": "Original gum",
    "gumCondition": "Variable, includes double gum varieties",
    "sizeWidth": "Unknown",
    "sizeHeight": "Unknown",
    "sizeFormat": "Standard definitive size",
    "theme": "Monarch",
    "themeCategory": "Definitive",
    "subject": "King George V",
    "artisticStyle": "Portrait",
    "printRun": "Unknown",
    "estimatedPrintRun": 1000000,
    "sheetsPrinted": "Unknown",
    "stampsPerSheet": 240,
    "positionVarieties": true,
    "plateVariety": "Local plate varieties including watermark inversions and perforation errors",
    "stampImageUrl": "/images/stamps/uk-george-v-1.5d-black.png",
    "stampImageAlt": null,
    "stampImageHighRes": null,
    "watermarkImageUrl": null,
    "perforationImageUrl": null,
    "rarityRating": "common to scarce",
    "rarityScale": "1-10",
    "rarityScore": 4.5,
    "hasVarieties": true,
    "varietyCount": 6,
    "varietyType": "color, watermark, perforation, printing error",
    "perforationVariety": "Double perforations, perforation missing lines",
    "colorVariety": "Black, grey-black, grey",
    "paperVariety": "De La Rue chalky paper",
    "watermarkVariety": "Normal, inverted, inverted and reversed",
    "knownError": "Offset on back, watermark inverted and reversed, double perforations",
    "majorVariety": "Watermark inverted and reversed (W.7e)",
    "postalHistoryType": "regular postal use",
    "postmarkType": "varied, including cds",
    "proofType": "Unknown",
    "essayType": "Unknown",
    "errorType": "Printing errors including offset and double perforations",
    "authenticationRequired": false,
    "expertCommittee": "British Philatelic Association (BPA)",
    "authenticationPoint": "Watermark orientation and perforation quality",
    "certificateAvailable": true,
    "commonForgery": "None widely reported",
    "historicalSignificance": "Part of George V definitive series, important for surface printing study",
    "culturalImportance": "Depicts King George V, reflecting early 20th century British monarchy",
    "philatelicImportance": "Popular among collectors of British Commonwealth and George V issues",
    "collectingPopularity": "High",
    "exhibitionFrequency": "Occasional in British Commonwealth thematic exhibits",
    "researchStatus": "Well researched with detailed cataloging",
    "bibliography": "Stanley Gibbons Commonwealth and British Empire Catalogue, 2023 edition",
    "specialNotes": "Watermark inverted and reversed varieties command premium prices; double perforations are notable errors.",
    "collectorNotes": "Collectors seek unhinged mint examples with clear watermark and no offset.",
    "conditionNotes": "Gum condition varies; offset on back noted in some examples; perforation quality important for grading.",
    "rarityNotes": "Watermark inverted and reversed varieties are scarce; double perforations are rare errors.",
    "marketNotes": "Prices stable with premium for watermark varieties and errors.",
    "researchNotes": "Further study on plate flaws and position varieties ongoing.",
    "mintValue": 125.00,
    "usedValue": 45.00
  },
  // Another UK stamp - SAME everything but different additional categories for testing additional category navigation
  {
    "id": "3a3da89c-5a57-454f-84ff-e7eb9445eee5",
    "stampId": "1f5d14ee-c57a-4646-bcc3-d95ee98a2dd2",
    "catalogNumber": "K16a-var1",
    "name": "1½d Black (Local Plate) - Postal History Variant",
    "isInstance": true,
    "description": "George V surface-printed 1½d black stamp with specific postal history usage",
    "country": "GB",
    "countryName": "United Kingdom",
    "countryFlag": "🇬🇧",
    "seriesName": "George V (Surface) — 1d, 1½d black, 1½d brown",
    "seriesDescription": "Surface printed George V stamps including 1d, 1½d black and 1½d brown denominations issued on various papers",
    "issueYear": 1916,
    "currencyCode": "GBP",
    "currencyName": "Pound Sterling",
    "currencySymbol": "£",
    "denominationValue": "1.5",
    "denominationSymbol": "d",
    "denominationDisplay": "1½d",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "paperCode": "chalky",
    "paperName": "Chalky Paper",
    "watermarkCode": "W.7",
    "watermarkName": "W Crown CA",
    "perforationCode": "14x15",
    "perforationName": "Perf 14 x 15",
    "itemTypeCode": "StSurface1dBlack",
    "itemTypeName": "Surface Printed Stamp",
    "postalHistoryType": "registered mail",
    "stampImageUrl": "/images/stamps/uk-george-v-1.5d-black-var1.png",
    "mintValue": 145.00,
    "usedValue": 65.00
  },
  // Another UK stamp - Same path but with errors category
  {
    "id": "3a3da89c-5a57-454f-84ff-e7eb9445eee6",
    "stampId": "1f5d14ee-c57a-4646-bcc3-d95ee98a2dd3",
    "catalogNumber": "K16a-error1",
    "name": "1½d Black (Local Plate) - Double Perforation Error",
    "isInstance": true,
    "description": "George V surface-printed 1½d black stamp with double perforation printing error",
    "country": "GB",
    "countryName": "United Kingdom",
    "countryFlag": "🇬🇧",
    "seriesName": "George V (Surface) — 1d, 1½d black, 1½d brown",
    "issueYear": 1916,
    "currencyCode": "GBP",
    "currencyName": "Pound Sterling",
    "currencySymbol": "£",
    "denominationValue": "1.5",
    "denominationSymbol": "d",
    "denominationDisplay": "1½d",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "paperCode": "chalky",
    "paperName": "Chalky Paper",
    "watermarkCode": "W.7",
    "watermarkName": "W Crown CA",
    "perforationCode": "14x15",
    "perforationName": "Perf 14 x 15",
    "itemTypeCode": "StSurface1dBlack",
    "itemTypeName": "Surface Printed Stamp",
    "errorType": "double perforation",
    "stampImageUrl": "/images/stamps/uk-george-v-1.5d-black-error.png",
    "mintValue": 750.00,
    "usedValue": 350.00
  },
  // UK stamp that should stop at year level (no currency data)
  {
    "id": "4b4eb8ad-6b68-565g-95gg-f8fc0556fff5",
    "stampId": "2g6e25ff-d68b-5757-cdd4-e06ff09b3ee2",
    "catalogNumber": "K17b",
    "name": "1d Rose Red",
    "description": "George V surface-printed 1d rose red stamp issued May 1917 on ordinary paper",
    "country": "GB",
    "countryName": "United Kingdom",
    "countryFlag": "🇬🇧",
    "isInstance": false,
    "seriesName": "George V (Surface) — 1d, 1½d black, 1½d brown",
    "seriesDescription": "Surface printed George V stamps including 1d, 1½d black and 1½d brown denominations issued on various papers",
    "issueYear": 1916,
    "currencyCode": "GBP",
    "currencyName": "Pound Sterling",
    "currencySymbol": "£",
    "denominationValue": "1",
    "denominationSymbol": "d",
    "denominationDisplay": "1d",
    "colorCode": "Rose Red",
    "colorName": "Rose Red",
    "colorHex": "#FF69B4",
    "paperCode": "ordinary",
    "paperName": "Ordinary Paper",
    "watermarkCode": "W.8",
    "watermarkName": "W Crown CA Simple",
    "perforationCode": "15x14",
    "perforationName": "Perf 15 x 14",
    "itemTypeCode": "StSurface1dRose",
    "itemTypeName": "Surface Printed Stamp",
    "stampImageUrl": "/images/stamps/uk-george-v-1d-rose.png",
    "mintValue": 85.00,
    "usedValue": 25.00
  },
  // UK stamp with missing hierarchy levels (should open stamp details directly)
  {
    "id": "5c5fc9be-7c79-676h-a6hh-g9gd1667ggg6",
    "stampId": "3h7f36gg-e79c-6868-dee5-f17gg10c4ff3",
    "catalogNumber": "SG1",
    "name": "Penny Black",
    "description": "World's first adhesive postage stamp, issued 6 May 1840",
    "country": "GB",
    "countryName": "United Kingdom",
    "countryFlag": "🇬🇧",
    "isInstance": false,
    "seriesName": "Penny Black",
    "seriesDescription": "World's first adhesive postage stamp, issued 6 May 1840",
    "issueYear": 1840,
    "currencyCode": "GBP",
    "currencyName": "Pound Sterling",
    "currencySymbol": "£",
    "denominationValue": "1",
    "denominationSymbol": "d",
    "denominationDisplay": "1d",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "paperCode": null,
    "paperName": null,
    "watermarkCode": null,
    "watermarkName": null,
    "perforationCode": null,
    "perforationName": null,
    "itemTypeCode": null,
    "itemTypeName": null,
    "stampImageUrl": "/images/stamps/penny-black.png",
    "mintValue": 3500.00,
    "usedValue": 450.00
  },
  // United States stamps
  {
    "id": "6d6gd0cf-8d80-787i-b7ii-h0he2778hhh7",
    "stampId": "4i8g47hh-f80d-7979-eff6-g28hh21d5gg4",
    "catalogNumber": "US001",
    "name": "Franklin 1c Green",
    "description": "Benjamin Franklin 1 cent green stamp, first US postage stamp",
    "country": "US",
    "countryName": "United States",
    "countryFlag": "🇺🇸",
    "isInstance": false,
    "seriesName": "1847 First Issue",
    "seriesDescription": "First postage stamps issued by the United States Post Office",
    "issueYear": 1847,
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "currencySymbol": "$",
    "denominationValue": "1",
    "denominationSymbol": "c",
    "denominationDisplay": "1¢",
    "colorCode": "Green",
    "colorName": "Green",
    "colorHex": "#008000",
    "paperCode": "wove",
    "paperName": "Wove Paper",
    "watermarkCode": null,
    "watermarkName": null,
    "perforationCode": "imperf",
    "perforationName": "Imperforate",
    "itemTypeCode": "StClassic1c",
    "itemTypeName": "Classic Stamp",
    "stampImageUrl": "/images/stamps/us-franklin-1c.png",
    "mintValue": 5500.00,
    "usedValue": 350.00
  },
  {
    "id": "7e7he1dg-9e91-898j-c8jj-i1if3889iii8",
    "stampId": "5j9h58ii-g91e-8080-fgg7-h39ii32e6hh5",
    "catalogNumber": "US002",
    "name": "Washington 10c Black",
    "description": "George Washington 10 cent black stamp, second US postage stamp",
    "country": "US",
    "countryName": "United States",
    "countryFlag": "🇺🇸",
    "isInstance": false,
    "seriesName": "1847 First Issue",
    "seriesDescription": "First postage stamps issued by the United States Post Office",
    "issueYear": 1847,
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "currencySymbol": "$",
    "denominationValue": "10",
    "denominationSymbol": "c",
    "denominationDisplay": "10¢",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "paperCode": "wove",
    "paperName": "Wove Paper",
    "watermarkCode": null,
    "watermarkName": null,
    "perforationCode": "imperf",
    "perforationName": "Imperforate",
    "itemTypeCode": "StClassic10c",
    "itemTypeName": "Classic Stamp",
    "stampImageUrl": "/images/stamps/us-washington-10c.png",
    "mintValue": 12000.00,
    "usedValue": 750.00
  },
  // France stamps
  {
    "id": "8f8if2eh-0f02-909k-d9kk-j2jg4990jjj9",
    "stampId": "6k0i69jj-h02f-9191-ghh8-i40jj43f7ii6",
    "catalogNumber": "FR001",
    "name": "Ceres 20c Black",
    "description": "First French postage stamp featuring Ceres, goddess of agriculture",
    "country": "FR",
    "countryName": "France",
    "countryFlag": "🇫🇷",
    "isInstance": false,
    "seriesName": "1849 Ceres Issue",
    "seriesDescription": "First postage stamps of France featuring the goddess Ceres",
    "issueYear": 1849,
    "currencyCode": "EUR",
    "currencyName": "Euro",
    "currencySymbol": "€",
    "denominationValue": "20",
    "denominationSymbol": "c",
    "denominationDisplay": "20c",
    "colorCode": "Black",
    "colorName": "Black",
    "colorHex": "#000000",
    "paperCode": "laid",
    "paperName": "Laid Paper",
    "watermarkCode": null,
    "watermarkName": null,
    "perforationCode": "imperf",
    "perforationName": "Imperforate",
    "itemTypeCode": "StClassicCeres",
    "itemTypeName": "Classic Stamp",
    "stampImageUrl": "/images/stamps/france-ceres-20c.png",
    "mintValue": 1800.00,
    "usedValue": 85.00
  },
  // Canada stamps - test case with broken hierarchy
  {
    "id": "9g9jg3fi-1g13-010l-e0ll-k3kh5001kkk0",
    "stampId": "7l1j70kk-i13g-0202-hii9-j51kk54g8jj7",
    "catalogNumber": "CA001",
    "name": "Victoria 3d Red",
    "description": "Queen Victoria 3 pence red stamp on laid paper",
    "country": "CA",
    "countryName": "Canada",
    "countryFlag": "🇨🇦",
    "isInstance": false,
    "seriesName": "1851 Pence Issue",
    "seriesDescription": "First postage stamps of the Province of Canada",
    "issueYear": 1851,
    "currencyCode": "CAD",
    "currencyName": "Canadian Dollar",
    "currencySymbol": "C$",
    "denominationValue": null, // Missing - should break hierarchy here
    "denominationSymbol": null,
    "denominationDisplay": null,
    "colorCode": "Red",
    "colorName": "Red",
    "colorHex": "#FF0000",
    "paperCode": "laid",
    "paperName": "Laid Paper",
    "watermarkCode": null,
    "watermarkName": null,
    "perforationCode": "imperf",
    "perforationName": "Imperforate",
    "itemTypeCode": "StClassicVictoria",
    "itemTypeName": "Classic Stamp",
    "stampImageUrl": "/images/stamps/canada-victoria-3d.png",
    "mintValue": 8500.00,
    "usedValue": 1200.00
  },
  // Australia stamps
  {
    "id": "0h0kh4gj-2h24-121m-f1mm-l4li6112lll1",
    "stampId": "8m2k81ll-j24h-1313-ijj0-k62ll65h9kk8",
    "catalogNumber": "AU001",
    "name": "Kangaroo 2d Purple",
    "description": "First Australian stamp featuring kangaroo and map",
    "country": "AU",
    "countryName": "Australia",
    "countryFlag": "🇦🇺",
    "isInstance": false,
    "seriesName": "1913 Kangaroo & Map",
    "seriesDescription": "First definitive stamps of the Commonwealth of Australia",
    "issueYear": 1913,
    "currencyCode": "AUD",
    "currencyName": "Australian Dollar",
    "currencySymbol": "A$",
    "denominationValue": "2",
    "denominationSymbol": "d",
    "denominationDisplay": "2d",
    "colorCode": "Purple",
    "colorName": "Purple",
    "colorHex": "#800080",
    "paperCode": "ordinary",
    "paperName": "Ordinary Paper",
    "watermarkCode": "Crown A",
    "watermarkName": "Crown over A",
    "perforationCode": "11.5x12",
    "perforationName": "Perf 11½ x 12",
    "itemTypeCode": "StKangaroo2d",
    "itemTypeName": "Kangaroo Definitive",
    "stampImageUrl": "/images/stamps/australia-kangaroo-2d.png",
    "mintValue": 450.00,
    "usedValue": 25.00
  }
];

// Helper functions for API data grouping
export const groupStampsByCountry = (stamps: any[]) => {
  const grouped = stamps.reduce((acc: any, stamp: any) => {
    const key = stamp.country;
    if (!acc[key]) {
      acc[key] = {
        code: stamp.country,
        name: stamp.countryName,
        flag: stamp.countryFlag,
        stamps: [],
        totalStamps: 0,
        description: `Explore the philatelic heritage of ${stamp.countryName}`,
        firstIssue: Math.min(...stamps.filter((s: any) => s.country === key && s.issueYear).map((s: any) => s.issueYear)).toString(),
        lastIssue: Math.max(...stamps.filter((s: any) => s.country === key && s.issueYear).map((s: any) => s.issueYear)).toString(),
        historicalNote: `Rich philatelic history spanning multiple eras and postal innovations.`,
        featuredStampUrl: stamp.stampImageUrl || '/images/stamps/stamp.png'
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsBySeries = (stamps: any[], countryCode: string) => {
  const countryStamps = stamps.filter(s => s.country === countryCode);
  const grouped = countryStamps.reduce((acc, stamp) => {
    // If seriesName is null, this stamp should go directly to details
    if (!stamp.seriesName) {
      return acc;
    }
    
    const key = stamp.seriesName;
    if (!acc[key]) {
      acc[key] = {
        catalogNumber: stamp.seriesId || key.replace(/\s+/g, '_').toLowerCase(),
        name: stamp.seriesName,
        description: stamp.seriesDescription || `Series featuring various denominations and designs`,
        totalStamps: 0,
        stamps: [],
        yearRange: '',
        featuredStampUrl: stamp.stampImageUrl || '/images/stamps/stamp.png'
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  // Calculate year ranges for each series
  Object.values(grouped).forEach((series: any) => {
    const years = series.stamps.filter((s: any) => s.issueYear).map((s: any) => s.issueYear);
    if (years.length > 0) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      series.yearRange = minYear === maxYear ? minYear.toString() : `${minYear}-${maxYear}`;
    }
  });
  
  return Object.values(grouped);
};

export const groupStampsByYear = (stamps: any[], countryCode: string, seriesName: string) => {
  const seriesStamps = stamps.filter(s => s.country === countryCode && s.seriesName === seriesName);
  const grouped = seriesStamps.reduce((acc, stamp) => {
    const year = stamp.issueYear;
    if (!year) return acc;
    
    const key = year.toString();
    if (!acc[key]) {
      acc[key] = {
        year: year,
        description: `Stamps issued in ${year}`,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: stamp.stampImageUrl || '/images/stamps/stamp.png'
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByCurrency = (stamps: any[], countryCode: string, seriesName: string, year: number) => {
  const yearStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year
  );
  
  const grouped = yearStamps.reduce((acc, stamp) => {
    const key = stamp.currencyCode;
    if (!key) return acc;
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.currencyCode,
        name: stamp.currencyName,
        symbol: stamp.currencySymbol,
        description: stamp.currencyDescription || `${stamp.currencyName} denominations`,
        totalStamps: 0,
        stamps: []
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByDenomination = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string) => {
  const currencyStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode
  );
  
  const grouped = currencyStamps.reduce((acc: any, stamp: any) => {
    // If denominationValue is null, this stamp should go directly to details
    if (!stamp.denominationValue) {
      return acc;
    }
    
    const key = stamp.denominationValue;
    
    if (!acc[key]) {
      const denominationOption = {
        value: stamp.denominationValue,
        symbol: stamp.denominationSymbol,
        displayName: stamp.denominationDisplay,
        description: stamp.denominationDescription || `${stamp.denominationDisplay} denomination`,
        totalStamps: 0,
        stamps: []
      };
      acc[key] = denominationOption;
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  const result = Object.values(grouped);
  return result;
};

export const groupStampsByColor = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string) => {
  const denominationStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue
  );
  
  const grouped = denominationStamps.reduce((acc, stamp) => {
    const key = stamp.colorCode;
    if (!key) return acc;
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.colorCode,
        name: stamp.colorName,
        hex: stamp.colorHex,
        description: stamp.colorDescription || `${stamp.colorName} color variant`,
        totalStamps: 0,
        stamps: []
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByPaper = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string, colorCode: string) => {
  const colorStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue &&
    s.colorCode === colorCode
  );
  
  const grouped = colorStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.paperCode;
    if (!key) return acc;
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.paperCode,
        name: stamp.paperName,
        texture: stamp.paperFiber || 'Unknown',
        description: stamp.paperDescription || `${stamp.paperName} type`,
        totalStamps: 0,
        stamps: []
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByWatermark = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string, colorCode: string, paperCode: string) => {
  const paperStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue &&
    s.colorCode === colorCode &&
    s.paperCode === paperCode
  );
  
  const grouped = paperStamps.reduce((acc, stamp) => {
    const key = stamp.watermarkCode || 'NoWmk';
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.watermarkCode || 'NoWmk',
        name: stamp.watermarkName || 'No Watermark',
        description: stamp.watermarkDescription || (stamp.watermarkCode ? `${stamp.watermarkName} watermark` : 'No watermark present'),
        totalStamps: 0,
        pattern: stamp.watermarkName || 'None',
        stamps: []
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByPerforation = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string, colorCode: string, paperCode: string, watermarkCodeParam: string) => {
  const watermarkCode = watermarkCodeParam === null ? 'NoWmk' : watermarkCodeParam;
  const watermarkStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue &&
    s.colorCode === colorCode &&
    s.paperCode === paperCode &&
    (s.watermarkCode === watermarkCode || (watermarkCode === 'NoWmk' && !s.watermarkCode))
  );
  
  const grouped = watermarkStamps.reduce((acc, stamp) => {
    const key = stamp.perforationCode || 'imperf';
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.perforationCode,
        name: stamp.perforationName || 'Imperforate',
        measurement: stamp.perforationMeasurement || stamp.perforationCode,
        description: stamp.perforationCode ? `Perforation ${stamp.perforationMeasurement || stamp.perforationCode}` : 'Imperforate stamp',
        totalStamps: 0,
        stamps: []
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const groupStampsByItemType = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string, colorCode: string, paperCode: string, watermarkCodeParam: string, perforationCode: string) => {
  const watermarkCode = watermarkCodeParam === null ? 'NoWmk' : watermarkCodeParam;
  const perforationStamps = stamps.filter(s => 
    s.country === countryCode && 
    s.seriesName === seriesName && 
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue &&
    s.colorCode === colorCode &&
    s.paperCode === paperCode &&
    (s.watermarkCode === watermarkCode || (watermarkCode === 'NoWmk' && !s.watermarkCode)) &&
    (s.perforationCode === perforationCode || (perforationCode === 'imperf' && !s.perforationCode))
  );
  
  const grouped = perforationStamps.reduce((acc, stamp) => {
    const key = stamp.itemTypeCode;
    if (!key) return acc;
    
    if (!acc[key]) {
      acc[key] = {
        code: stamp.itemTypeCode,
        name: stamp.itemTypeName,
        description: stamp.itemTypeDescription || `${stamp.itemTypeName} category`,
        totalStamps: 0,
        stamps: [],
        category: stamp.itemFormat || 'Unknown',
      };
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

// Function to get individual stamps for stamp details
export const getStampDetails = (stamps: any[], countryCode: string, seriesName?: string, year?: number, currencyCode?: string, denominationValue?: string, colorCode?: string, paperCode?: string, watermarkCodeParam?: string, perforationCode?: string, itemTypeCode?: string) => {
  const watermarkCode = watermarkCodeParam === null ? 'NoWmk' : watermarkCodeParam;
  let filteredStamps = stamps.filter(s => s.country === countryCode);
  
  // Handle broken hierarchy - if seriesName is null, return stamps directly
  if (!seriesName) {
    return filteredStamps.filter(s => !s.seriesName);
  }
  
  filteredStamps = filteredStamps.filter(s => s.seriesName === seriesName);
  
  if (year !== undefined) {
    filteredStamps = filteredStamps.filter(s => s.issueYear === year);
  }
  
  if (currencyCode) {
    filteredStamps = filteredStamps.filter(s => s.currencyCode === currencyCode);
  }
  
  // Handle broken hierarchy - if denominationValue is null, return stamps directly
  if (denominationValue === undefined) {
    return filteredStamps.filter(s => !s.denominationValue);
  }
  
  if (denominationValue) {
    filteredStamps = filteredStamps.filter(s => s.denominationValue === denominationValue);
  }
  
  if (colorCode) {
    filteredStamps = filteredStamps.filter(s => s.colorCode === colorCode);
  }
  
  if (paperCode) {
    filteredStamps = filteredStamps.filter(s => s.paperCode === paperCode);
  }
  
  if (watermarkCode) {
    if (watermarkCode === 'NoWmk') {
      filteredStamps = filteredStamps.filter(s => !s.watermarkCode);
    } else {
      filteredStamps = filteredStamps.filter(s => s.watermarkCode === watermarkCode);
    }
  }
  
  if (perforationCode) {
    if (perforationCode === 'imperf') {
      filteredStamps = filteredStamps.filter(s => s.perforationCode === 'imperf');
    } else {
      filteredStamps = filteredStamps.filter(s => s.perforationCode === perforationCode);
    }
  }
  
  if (itemTypeCode) {
    filteredStamps = filteredStamps.filter(s => s.itemTypeCode === itemTypeCode);
  }
  
  return filteredStamps;
};

// Helper function to convert API stamp data to StampData format
export const convertApiStampToStampData = (apiStamp: any) => {
  return {
    id: apiStamp.id,
    stampCode: `${apiStamp.country}.${apiStamp.catalogNumber}`,
    status: 1,
    userId: "user123",
    stampCatalogId: apiStamp.catalogNumber,
    name: apiStamp.name,
    publisher: apiStamp.printer || "Unknown Publisher",
    country: apiStamp.countryName,
    countryCode: apiStamp.country, // Ensure countryCode is mapped
    stampImageUrl: apiStamp.stampImageUrl || '/images/stamps/stamp.png',
    catalogName: apiStamp.seriesName,
    catalogNumber: apiStamp.catalogNumber,
    seriesName: apiStamp.seriesName || "Unknown Series",
    issueDate: apiStamp.issueDate || `${apiStamp.issueYear}-01-01`,
    issueYear: apiStamp.issueYear,
    denominationValue: parseFloat(apiStamp.denominationValue || "0"),
    denominationCurrency: apiStamp.currencyCode || "USD",
    denominationSymbol: apiStamp.denominationSymbol || "$",
    color: apiStamp.colorName || "Unknown",
    paperType: apiStamp.paperName,
    stampDetailsJson: JSON.stringify({
      perforation: apiStamp.perforationName,
      watermark: apiStamp.watermarkName,
      printingMethod: apiStamp.printingMethod,
      designer: apiStamp.designer,
      printer: apiStamp.printer,
      catalogPrice: `${apiStamp.currencySymbol}${apiStamp.mintValue}` || '',
      currentMarketValue: `${apiStamp.currencySymbol}${apiStamp.mintValue}` || '',
      postalHistoryType: apiStamp.postalHistoryType,
      errorType: apiStamp.errorType,
      specialNotes: apiStamp.specialNotes,
    }),
    estimatedMarketValue: apiStamp.mintValue || 0,
    actualPrice: apiStamp.usedValue || 0,
    stampGroupId: apiStamp.stampGroupId || "unknown",
    instances: [], // ApiStampData does not contain instances, so initialize as empty
    rarity: apiStamp.rarityRating || 'Common', // Mapped directly, not in stampDetailsJson
    condition: apiStamp.conditionNotes || 'Mint', // Mapped directly, not in stampDetailsJson
  };
}; 