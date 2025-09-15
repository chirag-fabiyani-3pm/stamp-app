import { CountryOption, YearOption, CurrencyOption, DenominationOption, ColorOption, PaperOption, WatermarkOption, PerforationOption, ItemTypeOption, StampData, AdditionalCategoryOption, SeriesOption } from "@/types/catalog"
import { parseStampCode } from "@/lib/utils/parse-stamp-code"

export const generateCountriesData = async (): Promise<CountryOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return [
    {
      code: 'GB',
      name: 'Great Britain',
      totalStamps: 18950,
      firstIssue: '1840',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'The birthplace of postal excellence',
      historicalNote: 'Home to the world\'s first adhesive postage stamp, the Penny Black, issued on May 1, 1840, setting the gold standard for philatelic approval.'
    },
    {
      code: 'US',
      name: 'United States',
      totalStamps: 22100,
      firstIssue: '1847',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'American innovation in stamp design',
      historicalNote: 'The first U.S. stamps featured Benjamin Franklin and George Washington, establishing an enduring tradition of honoring national figures with philatelic approval.'
    },
    {
      code: 'FR',
      name: 'France',
      totalStamps: 14200,
      firstIssue: '1849',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'Artistic elegance in every issue',
      historicalNote: 'French stamps have long been celebrated for their artistic beauty and technical precision, earning worldwide approval from collectors and designers alike.'
    },
    {
      code: 'DE',
      name: 'Germany',
      totalStamps: 16750,
      firstIssue: '1872',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'Precision and innovation combined',
      historicalNote: 'German stamps reflect the nation\'s commitment to engineering excellence and design precision, consistently earning approval for their technical quality.'
    },
    {
      code: 'AU',
      name: 'Australia',
      totalStamps: 12380,
      firstIssue: '1856',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'Natural wonders on stamps',
      historicalNote: 'Australian stamps showcase the continent\'s unique flora and fauna, earning international approval for their vibrant depictions of natural heritage.'
    },
    {
      code: 'CA',
      name: 'Canada',
      totalStamps: 9840,
      firstIssue: '1851',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'Natural majesty preserved in miniature',
      historicalNote: 'The famous "Three-penny Beaver" was the world\'s first stamp to feature an animal, earning immediate approval and setting a new standard for wildlife on stamps.'
    },
    {
      code: 'JP',
      name: 'Japan',
      totalStamps: 13560,
      firstIssue: '1871',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
      description: 'Where tradition meets innovation',
      historicalNote: 'Japanese stamps beautifully blend traditional artistic elements with modern design principles, earning approval for their cultural authenticity and aesthetic excellence.'
    },
    {
      code: 'CH',
      name: 'Switzerland',
      totalStamps: 8920,
      firstIssue: '1850',
      lastIssue: '2024',
      featuredStampUrl: '/images/stamps/no-image-available.png',
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
      featuredStampUrl: '/images/stamps/no-image-available.png',
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
    stampImageUrl: '/images/stamps/no-image-available.png',
    commonColors: ['Red', 'Blue', 'Green'],
    featured: index < 2
  }))
}

export const generateColorsData = async (stampCode: string, denomination: string): Promise<ColorOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'Blu', name: 'Royal Blue', hex: '#1e40af', totalStamps: 25, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 9, description: 'The distinguished blue of royal heritage' },
    { code: 'R', name: 'Carmine Red', hex: '#dc2626', totalStamps: 20, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 8, description: 'A bold red that commands approval' },
    { code: 'Gr', name: 'Emerald Green', hex: '#059669', totalStamps: 18, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 7, description: 'The rich green of precious emeralds' },
    { code: 'Pur', name: 'Imperial Purple', hex: '#7c3aed', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 6, description: 'The purple of nobility and prestige' },
    { code: 'Br', name: 'Sepia Brown', hex: '#92400e', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 5, description: 'Warm brown tones of vintage excellence' },
    { code: 'Blk', name: 'Jet Black', hex: '#1f2937', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 4, description: 'The profound depth of classic black' },
    { code: 'Yel', name: 'Golden Yellow', hex: '#f59e0b', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', popularity: 3, description: 'Bright as sunshine, valuable as gold' }
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
    { code: 'WmkNZStr6mm', name: 'NZ and Star 6mm', description: 'New Zealand and Star watermark pattern', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png', pattern: 'Star', historicalInfo: 'Used during the colonial period for authentication' },
    { code: 'WmkLgStr', name: 'Large Star', description: 'Large star watermark for premium stamps', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', pattern: 'Large Star', historicalInfo: 'Symbol of imperial connection and approval' },
    { code: 'WmkCrownCC', name: 'Crown Over CC', description: 'Crown over CC colonial watermark', totalStamps: 6, stampImageUrl: '/images/stamps/no-image-available.png', pattern: 'Crown', historicalInfo: 'Crown Colony designation mark of official approval' },
    { code: 'NoWmk', name: 'No Watermark', description: 'No watermark present', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png', pattern: 'None', historicalInfo: 'Later printing methods without watermark authentication' }
  ]
}

export const generatePerforationsData = async (stampCode: string, watermarkCode: string): Promise<PerforationOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'P12', name: 'Perf 12', measurement: '12.0', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', style: 'Standard', technicalDetail: '12 holes per 2 centimeters - industry standard' },
    { code: 'P13', name: 'Perf 13', measurement: '13.0', totalStamps: 10, stampImageUrl: '/images/stamps/no-image-available.png', style: 'Fine', technicalDetail: '13 holes per 2 centimeters - fine quality' },
    { code: 'P14', name: 'Perf 14', measurement: '14.0', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', style: 'Very Fine', technicalDetail: '14 holes per 2 centimeters - premium grade' },
    { code: 'Imp', name: 'Imperforate', measurement: 'No perforations', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png', style: 'Special', technicalDetail: 'Hand-cut stamps for collectors\' approval' }
  ]
}

export const generateItemTypesData = async (stampCode: string, perforationCode: string): Promise<ItemTypeOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { code: 'St001', name: 'Mint Condition', description: 'Pristine unused stamps in perfect condition', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', category: 'Premium Grade', collectorsNote: 'The most sought-after condition, earning highest approval from collectors' },
    { code: 'OnP01', name: 'On Piece', description: 'Stamps still attached to original envelope fragments', totalStamps: 5, stampImageUrl: '/images/stamps/stamp-on-piece.png', category: 'Historical', collectorsNote: 'Preserves postal history context for research approval' },
    { code: 'OnC01', name: 'On Card', description: 'Stamps professionally mounted on collector cards', totalStamps: 3, stampImageUrl: '/images/stamps/stamp-on-card.png', category: 'Display Ready', collectorsNote: 'Perfect for exhibition and display approval' },
    { code: 'OnE01', name: 'On Cover', description: 'Complete postal covers with stamps attached', totalStamps: 4, stampImageUrl: '/images/stamps/stamp-on-envelope.png', category: 'Complete History', collectorsNote: 'Full postal documents earning historical approval' }
  ]
}

export const generateStampDetails = async (stampCode: string, itemTypeCode: string): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const stamps: any[] = []
  for (let i = 1; i <= Math.floor(Math.random() * 8) + 3; i++) {
    stamps.push({
      id: `${stampCode}-${itemTypeCode}-${i}`,
      name: `Premium Specimen ${i}`,
      country: 'Great Britain',
      countryCode: 'GB',
      stampImageUrl: '/images/stamps/no-image-available.png',
      catalogNumber: `SOA${i}`,
      catalogName: 'Stamps of Approval',
      seriesName: 'Stamps of Approval Collection',
      issueDate: '1855-01-01',
      issueYear: 1855,
      denominationValue: parseInt(parseStampCode(stampCode).denominationValue || '2'),
      denominationSymbol: parseStampCode(stampCode).currencyCode || 'd',
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
      { code: 'CDS', name: 'Circular Date Stamp', description: 'Standard circular postmark with clear approval', totalStamps: 120, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.0, rarity: 'common' },
      { code: 'DUPLEX', name: 'Duplex Cancel', description: 'Combined postmark and killer earning approval', totalStamps: 85, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.3, rarity: 'common' },
      { code: 'NUMERAL', name: 'Numeral Cancel', description: 'Numeric obliterator with collector approval', totalStamps: 67, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 1.5, rarity: 'uncommon' },
      { code: 'SPECIAL', name: 'Special Occasion', description: 'Commemorative postmark with premium approval', totalStamps: 23, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 3.0, rarity: 'rare' }
    ],
    'proofs': [
      { code: 'DIE', name: 'Die Proof', description: 'Proof taken from the original die - ultimate approval', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'PLATE', name: 'Plate Proof', description: 'Proof from printing plate with expert approval', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 8.0, rarity: 'very rare' },
      { code: 'TRIAL', name: 'Trial Color Proof', description: 'Alternative color proof earning design approval', totalStamps: 15, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 6.0, rarity: 'rare' },
      { code: 'PROG', name: 'Progressive Proof', description: 'Printing stage proof with technical approval', totalStamps: 6, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 12.0, rarity: 'extremely rare' }
    ],
    'essays': [
      { code: 'DESIGN', name: 'Design Essay', description: 'Original design proposal with artistic approval', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'COLOR', name: 'Color Essay', description: 'Alternative color scheme with approval', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 12.0, rarity: 'very rare' },
      { code: 'FRAME', name: 'Frame Essay', description: 'Border design variant earning approval', totalStamps: 7, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'extremely rare' },
      { code: 'COMP', name: 'Composite Essay', description: 'Multiple design elements with unique approval', totalStamps: 3, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 25.0, rarity: 'unique' }
    ],
    'onPiece': [
      { code: 'ENV_PIECE', name: 'Envelope Piece', description: 'Corner or piece of envelope with approval', totalStamps: 95, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.8, rarity: 'common' },
      { code: 'CARD_PIECE', name: 'Card Piece', description: 'Piece of postal card with documented approval', totalStamps: 43, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 0.9, rarity: 'common' },
      { code: 'DOC_PIECE', name: 'Document Piece', description: 'Official document piece earning approval', totalStamps: 28, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.4, rarity: 'uncommon' },
      { code: 'WRAP_PIECE', name: 'Wrapper Piece', description: 'Newspaper wrapper piece with rare approval', totalStamps: 19, stampImageUrl: '/images/stamps/stamp-on-piece.png', priceMultiplier: 1.8, rarity: 'rare' }
    ],
    'errors': [
      { code: 'MISPERF', name: 'Misperforated', description: 'Perforations in wrong position - error approval', totalStamps: 12, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 8.0, rarity: 'rare' },
      { code: 'MISSING_COLOR', name: 'Missing Color', description: 'Colors omitted earning error approval', totalStamps: 8, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 15.0, rarity: 'very rare' },
      { code: 'DOUBLE_PRINT', name: 'Double Print', description: 'Double printing with prestigious approval', totalStamps: 5, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 20.0, rarity: 'extremely rare' },
      { code: 'INVERTED', name: 'Inverted Center', description: 'Upside down center - legendary approval', totalStamps: 2, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 50.0, rarity: 'unique' },
      { code: 'IMPERF', name: 'Imperforate', description: 'Missing perforations earning specialist approval', totalStamps: 18, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 6.0, rarity: 'rare' }
    ],
    'other': [
      { code: 'SPECIMENS', name: 'Specimens', description: 'SPECIMEN overprints with official approval', totalStamps: 25, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 3.0, rarity: 'uncommon' },
      { code: 'REPRINTS', name: 'Reprints', description: 'Later reprints with documented approval', totalStamps: 45, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 0.3, rarity: 'common' },
      { code: 'OFFICIALS', name: 'Official Overprints', description: 'Official use overprints with government approval', totalStamps: 35, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 2.5, rarity: 'uncommon' },
      { code: 'LOCALS', name: 'Local Issues', description: 'Local variants earning regional approval', totalStamps: 20, stampImageUrl: '/images/stamps/no-image-available.png', priceMultiplier: 4.0, rarity: 'rare' }
    ]
  }
  return categoryMap[categoryType] || []
}

export const generateStampsForAdditionalCategory = async (baseStampCode: string, categoryType: string, categoryCode: string): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const stamps: any[] = []
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
      stampImageUrl: '/images/stamps/no-image-available.png',
      catalogNumber: `SOA${i}${categoryCode.substring(0, 2)}`,
      catalogName: 'Additional Categories',
      seriesName: 'Stamps of Approval Collection',
      issueDate: '1855-01-01',
      issueYear: 1855,
      denominationValue: parseInt(parseStampCode(baseStampCode).denominationValue || '2'),
      denominationSymbol: parseStampCode(baseStampCode).currencyCode || 'd',
      denominationCurrency: 'GBP',
      color: 'Royal Blue',
      paperType: 'Pure White',
      stampDetailsJson: JSON.stringify({
        perforation: '12.0',
        watermark: 'Crown',
        printingMethod: 'Line Engraving',
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
      rarity: categoryMultiplier > 10 ? 'Collector Approved' : categoryMultiplier > 5 ? 'Rare' : categoryMultiplier > 2 ? 'Uncommon' : 'Common',
      story: `This exceptional ${categoryName} specimen represents a remarkable example of ${categoryCode} that has earned its place in our collection through meticulous evaluation and expert approval.`,
      status: 1,
      stampCatalogId: null,
      publisher: 'Unknown Publisher',
      condition: ['Superb', 'Very Fine', 'Fine'][Math.floor(Math.random() * 3)],
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
    imageUrl: '/images/stamps/no-image-available.png',
    readTime: '8 min read',
    category: 'Historical Milestones',
    excerpt: 'Discover the fascinating story behind the creation of the Penny Black and how it transformed global communication, earning the approval of nations worldwide.'
  },
  {
    id: '2',
    title: 'Watermarks: Hidden Signatures',
    subtitle: 'The secret marks that give stamps their stamp of approval',
    imageUrl: '/images/stamps/no-image-available.png',
    readTime: '6 min read',
    category: 'Technical Excellence',
    excerpt: 'Learn to identify the subtle watermarks that authenticate stamps and make them worthy of collector approval.'
  },
  {
    id: '3',
    title: 'Color Mastery in Philately',
    subtitle: 'The artistry that earns stamps lasting approval',
    imageUrl: '/images/stamps/no-image-available.png',
    readTime: '10 min read',
    category: 'Artistic Heritage',
    excerpt: 'Explore how master printers created the vibrant colors that have earned stamps their enduring approval through the centuries.'
  }
]

// Helper function to find first stamp with valid image URL
export const findFirstStampWithImage = (stamps: any[], fieldKey?: string) => {
  return stamps.find((stamp: any) => stamp.stampImageUrl && stamp.stampImageUrl.trim() !== '' && (fieldKey ? (stamp[fieldKey] && stamp[fieldKey].trim() !== 'N/A') : true)) ||
    stamps[0]; // fallback to first stamp if none have images
};

// Helper functions for API data grouping


export const groupStampsByCountry = (stamps: any[]) => {
  const grouped = stamps.reduce((acc: any, stamp: any) => {
    if (!stamp.isInstance) {
      const key = stamp.country;
      if (!acc[key]) {
        // Find the first stamp with a valid image URL for this country
        const countryStamps = stamps.filter((s: any) => s.country === key);
        const firstStampWithImage = findFirstStampWithImage(countryStamps);

        acc[key] = {
          code: stamp.country,
          name: stamp.countryName,
          stamps: [],
          totalStamps: 0,
          description: `Explore the philatelic heritage of ${stamp.countryName}`,
          firstIssue: Math.min(...stamps.filter((s: any) => s.country === key && s.issueYear).map((s: any) => s.issueYear)).toString(),
          lastIssue: Math.max(...stamps.filter((s: any) => s.country === key && s.issueYear).map((s: any) => s.issueYear)).toString(),
          historicalNote: `Rich philatelic history spanning multiple eras and postal innovations.`,
          featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
        };
      }
      acc[key].stamps.push(stamp);
      acc[key].totalStamps++;
    }
    return acc;
  }, {});

  return Object.values(grouped);
};

export const groupStampsBySeries = (stamps: any[], countryCode: string) => {
  const countryStamps = stamps.filter(s => s.country === countryCode && !s.isInstance);
  const grouped = countryStamps.reduce((acc, stamp) => {
    // If seriesName is null, this stamp should go directly to details
    if (!stamp.seriesName) {
      return acc;
    }

    const key = stamp.seriesName;

    if (!acc[key]) {
      // Find the first stamp with a valid image URL for this series
      const seriesStamps = countryStamps.filter((s: any) => s.seriesName === key);
      const firstStampWithImage = findFirstStampWithImage(seriesStamps);

      acc[key] = {
        catalogNumber: stamp.catalogNumber,
        name: stamp.seriesName,
        totalStamps: 0,
        stamps: [],
        yearRange: '',
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
  const seriesStamps = stamps.filter(s => s.country === countryCode && s.seriesName === seriesName && !s.isInstance);
  const grouped = seriesStamps.reduce((acc, stamp) => {
    const year = stamp.issueYear;
    if (!year) return acc;

    const key = year.toString();
    if (!acc[key]) {
      // Find the first stamp with a valid image URL for this year
      const yearStamps = seriesStamps.filter((s: any) => s.issueYear === year);
      const firstStampWithImage = findFirstStampWithImage(yearStamps);

      acc[key] = {
        year: year,
        description: `Stamps issued in ${year}`,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
    s.issueYear === year &&
    !s.isInstance
  );

  const grouped = yearStamps.reduce((acc, stamp) => {
    const key = stamp.currencyCode;
    if (!key) return acc;
    const currencyStamps = yearStamps.filter((y: any) => y.currencyCode === key);
    const firstStampWithImage = findFirstStampWithImage(currencyStamps);

    if (!acc[key]) {
      acc[key] = {
        code: stamp.currencyCode,
        name: stamp.currencyName,
        symbol: stamp.currencySymbol,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
    s.currencyCode === currencyCode &&
    !s.isInstance
  );



  const grouped = currencyStamps.reduce((acc: any, stamp: any) => {
    // If denominationValue is null, this stamp should go directly to details
    if (!stamp.denominationValue) {
      return acc;
    }

    const key = stamp.denominationValue;
    if (!acc[key]) {
      // Find the first stamp with a valid image URL for this denomination
      const denominationStamps = currencyStamps.filter((s: any) => s.denominationValue === key);
      const firstStampWithImage = findFirstStampWithImage(denominationStamps);

      const denominationOption = {
        value: stamp.denominationValue,
        symbol: stamp.denominationSymbol,
        displayName: stamp.denominationDisplay,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
      };



      acc[key] = denominationOption;
    }
    acc[key].stamps.push(stamp);
    acc[key].totalStamps++;
    return acc;
  }, {});

  return Object.values(grouped);
};

export const groupStampsByColor = (stamps: any[], countryCode: string, seriesName: string, year: number, currencyCode: string, denominationValue: string) => {
  const denominationStamps = stamps.filter(s =>
    s.country === countryCode &&
    s.seriesName === seriesName &&
    s.issueYear === year &&
    s.currencyCode === currencyCode &&
    s.denominationValue === denominationValue &&
    !s.isInstance
  );

  const grouped = denominationStamps.reduce((acc, stamp) => {
    const key = stamp.colorCode;
    if (!key) return acc;

    const colorStamps = denominationStamps.filter((s: any) => s.colorCode === key);
    const firstStampWithImage = findFirstStampWithImage(colorStamps);

    if (!acc[key]) {
      acc[key] = {
        code: stamp.colorCode,
        name: stamp.colorName,
        hex: stamp.colorHex,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
    s.colorCode === colorCode &&
    !s.isInstance
  );

  const grouped = colorStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.paperCode;
    if (!key) return acc;

    if (!acc[key]) {
      // Find the first stamp with a valid image URL for this paper type
      const paperStamps = colorStamps.filter((s: any) => s.paperCode === key);
      const firstStampWithImage = findFirstStampWithImage(paperStamps);

      const paperOption = {
        code: stamp.paperCode,
        name: stamp.paperName,
        texture: stamp.paperOrientation || 'Unknown',
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
      };



      acc[key] = paperOption;
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
    s.paperCode === paperCode &&
    !s.isInstance
  );

  const grouped = paperStamps.reduce((acc, stamp) => {
    const key = stamp.watermarkCode || 'NoWmk';

    const watermarkStamps = paperStamps.filter((s: any) => s.watermarkCode === key);
    const firstStampWithImage = findFirstStampWithImage(watermarkStamps);

    if (!acc[key]) {
      acc[key] = {
        code: stamp.watermarkCode || 'NoWmk',
        name: stamp.watermarkName || 'No Watermark',
        totalStamps: 0,
        pattern: stamp.watermarkName || 'None',
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
    (s.watermarkCode === watermarkCode || (watermarkCode === 'NoWmk' && !s.watermarkCode)) &&
    !s.isInstance
  );

  const grouped = watermarkStamps.reduce((acc, stamp) => {
    const key = stamp.perforationCode || 'imperf';

    const perforationStamps = watermarkStamps.filter((s: any) => s.perforationCode === key);
    const firstStampWithImage = findFirstStampWithImage(perforationStamps);

    if (!acc[key]) {
      acc[key] = {
        code: stamp.perforationCode,
        name: stamp.perforationName || 'Imperforate',
        measurement: stamp.perforationMeasurement || stamp.perforationCode,
        description: stamp.perforationCode ? `Perforation ${stamp.perforationMeasurement || stamp.perforationCode}` : 'Imperforate stamp',
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
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
    (s.perforationCode === perforationCode || (perforationCode === 'imperf' && !s.perforationCode)) &&
    !s.isInstance
  );

  const grouped = perforationStamps.reduce((acc, stamp) => {
    const key = stamp.itemTypeCode;
    if (!key) return acc;

    if (!acc[key]) {
      // Find the first stamp with a valid image URL for this item type
      const itemTypeStamps = perforationStamps.filter((s: any) => s.itemTypeCode === key);
      const firstStampWithImage = findFirstStampWithImage(itemTypeStamps);

      const itemTypeOption = {
        code: stamp.itemTypeCode,
        name: stamp.itemTypeName,
        totalStamps: 0,
        stamps: [],
        featuredStampUrl: firstStampWithImage.stampImageUrl || '/images/stamps/no-image-available.png'
      };



      acc[key] = itemTypeOption;
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
  let filteredStamps = stamps.filter(s => s.country === countryCode && !s.isInstance);

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
    stampId: apiStamp.stampId,
    parentStampId: apiStamp.parentStampId,
    isInstance: apiStamp.isInstance,
    status: 1,
    stampCatalogId: apiStamp.catalogNumber,
    name: apiStamp.name,
    description: apiStamp.description,
    publisher: apiStamp.printer || "Unknown Publisher",
    country: apiStamp.countryName,
    countryCode: apiStamp.country, // Ensure countryCode is mapped
    stampImageUrl: apiStamp.stampImageUrl || '/images/stamps/no-image-available.png',
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
      printer: apiStamp.printer,
      catalogPrice: (apiStamp.mintValue && isNaN(Number(apiStamp.mintValue))) ? `${apiStamp.currencySymbol}${apiStamp.mintValue}` : '-',
      currentMarketValue: '-',
      errorType: apiStamp.errorType,
      specialNotes: apiStamp.specialNotes,
      estimatedValue: (apiStamp.mintValue && isNaN(Number(apiStamp.mintValue))) ? `${apiStamp.currencySymbol}${apiStamp.mintValue}` : '-',
    }),
    mintValue: apiStamp.mintValue || 0,
    finestUsedValue: apiStamp.finestUsedValue || 0,
    usedValue: apiStamp.usedValue || 0,
    stampGroupName: apiStamp.stampGroupName || "unknown",
    typeName: apiStamp.typeName || "unknown",
    instances: [], // ApiStampData does not contain instances, so initialize as empty
    rarity: apiStamp.rarityRating || 'Common', // Mapped directly, not in stampDetailsJson
    condition: apiStamp.conditionNotes || 'Mint', // Mapped directly, not in stampDetailsJson
    story: apiStamp.story || '',
    categoryCode: apiStamp.categoryCode || '',
    colorCode: apiStamp.colorCode || '',
    paperCode: apiStamp.paperCode || '',
    watermarkCode: apiStamp.watermarkCode || '',
    perforationCode: apiStamp.perforationCode || '',
    itemTypeCode: apiStamp.itemTypeCode || '',
    currencyCode: apiStamp.currencyCode || ''
  };
}; 