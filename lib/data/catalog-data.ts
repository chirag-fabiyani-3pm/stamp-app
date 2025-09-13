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

// API Data Structure - Dummy Data for Testing
export const apiStampData = [
  {
    id: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    isInstance: false,
    parentStampId: '',
    catalogNumber: 'SG1',
    stampCode: 'NZ.1855.1d.DeepCarmineRed.LargeStar.WmkW1.Imperf.PerkinsBacon.StA1a',
    name: '1d Deep carmine-red',
    description: "1855 imperforate 1d stamp with a distinctive 'dried blood' deep carmine-red color, printed by Perkins, Bacon & Co. in London with Large Star watermark (W.1). Part of the Full-Face Queens series, representing one of the initial New Zealand stamps printed outside the colony.",
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf, Large Star Watermark',
    stampGroupName: '1855 (July 20 at Auckland) Imperf Large Star Watermark',
    categoryCode: 'A1a',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'DeepCarmineRed',
    colorName: 'Deep carmine-red',
    colorHex: '#960018',
    paperCode: 'unknown',
    paperName: 'Unknown',
    watermarkCode: 'W1',
    watermarkName: 'Large Star',
    watermarkPosition: 'full sheet',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-07-20',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Engraved',
    printer: 'Perkins, Bacon & Co.',
    printerLocation: 'London, England',
    printerReputation: 'Premier security printer',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 50000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'very rare',
    rarityScale: '1-10',
    rarityScore: 9,
    recentSales: [[Object], [Object], [Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'color, watermark, perforation',
    perforationVariety: 'Imperforate',
    colorVariety: "Deep carmine-red (distinct 'dried blood' hue)",
    paperVariety: 'White (standard), Deep Blue (on trial print)',
    watermarkVariety: 'Large Star (W.1), No watermark (on blue paper trial print)',
    knownError: 'None documented',
    majorVariety: 'SG1a with re-entries',
    postalHistoryType: 'cover, pair, single',
    postmarkType: 'Cancelled obliteration',
    proofType: 'Unknown',
    essayType: 'Unknown',
    errorType: 'None documented',
    authenticationRequired: true,
    expertCommittee: 'Royal Philatelic Society London (RPSL)',
    certificateAvailable: true,
    commonForgery: 'Crude lithographic copies',
    authenticationPoint: 'Watermark presence and clarity, printing quality, paper type',
    historicalSignificance: "First official New Zealand stamp issue, marking the beginning of the colony's postal system",
    culturalImportance: "Iconic representation of New Zealand's early postal history and colonial heritage",
    philatelicImportance: 'Highly prized by collectors for rarity, condition, and historical context',
    collectingPopularity: 'Very high among classic New Zealand collectors',
    exhibitionFrequency: 'Frequently exhibited in classic and colonial collections',
    researchStatus: 'Well researched with ongoing studies on varieties and printings',
    bibliography: 'NZ Stamp Catalogue, RPSL publications, Perkins Bacon archives',
    primaryReferences: ['NZ Stamp Catalogue 2024', 'RPSL Expert Committee Reports'],
    researchPapers: ['Studies on Perkins Bacon printings of NZ 1855 issues'],
    exhibitionLiterature: ['Exhibition catalogues featuring Full-Face Queens'],
    onlineResources: ['NZ Philatelic Society website', 'RPSL database'],
    specialNotes: "Distinctive 'dried blood' hue unique to this printing; plates shipped from London and used locally by J. Richardson and J. Davies",
    collectorNotes: 'Extremely valuable mint and used examples; re-entries and on cover examples command premium prices',
    conditionNotes: 'Prices reflect extremely fine condition; faults significantly reduce value',
    rarityNotes: 'One of the rarest and most valuable New Zealand stamps',
    marketNotes: 'Strong demand with high auction prices; limited availability',
    researchNotes: 'Further study ongoing on trial prints and plate varieties',
    StampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    ParentStampId: null,
    stampImageUrl: ''
  },
  {
    id: '4fb6aac0-fab9-460e-a4d8-0c82b874b8f7',
    isInstance: true,
    parentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    catalogNumber: 'SG1',
    stampCode: 'NZ.1855.1d.Red.Imperf.LargeStar.WmkW1.PBCL.A1a',
    name: '1d Deep Carmine-Red',
    description: "1855 (July 20 at Auckland) imperforate 1d stamp with Large Star watermark (W.1), printed by Perkins, Bacon & Co., London. Known for its distinctive 'dried blood' hue, part of the Full-Face Queens series. This particular variety features various re-entries.",
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Large Star Watermark (W.1) Group',
    categoryCode: 'A1a',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'DCR',
    colorName: 'Deep Carmine-Red',
    colorHex: '#8B0000',
    paperCode: 'unknown',
    paperName: 'Unknown',
    watermarkCode: 'W1',
    watermarkName: 'Large Star',
    watermarkPosition: 'full sheet',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-07-20',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Engraved',
    printer: 'Perkins, Bacon & Co.',
    printerLocation: 'London, England',
    printerReputation: 'Premier security printer',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries, various'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 50000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 8,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 5,
    varietyType: 'plate and color',
    perforationVariety: 'Imperforate',
    colorVariety: 'Deep carmine-red (distinctive dried blood hue)',
    paperVariety: 'White unwatermarked (main), Deep blue paper (trial prints)',
    watermarkVariety: 'Large Star (W.1)',
    knownError: 'None documented',
    majorVariety: 'SG1a Re-entries',
    postalHistoryType: 'cover',
    postmarkType: 'Cancelled obliteration',
    proofType: 'Unknown',
    essayType: 'Unknown',
    errorType: 'None documented',
    authenticationRequired: true,
    expertCommittee: 'RPSL',
    certificateAvailable: true,
    commonForgery: 'Crude lithographic copies',
    authenticationPoint: 'Watermark clarity and printing quality',
    historicalSignificance: 'First official New Zealand postage stamp series, foundational to NZ philately',
    culturalImportance: "Symbol of New Zealand's postal independence and colonial heritage",
    philatelicImportance: 'Highly prized by collectors for rarity and printing varieties',
    collectingPopularity: 'Very high',
    exhibitionFrequency: 'Frequent in major philatelic exhibitions',
    researchStatus: 'Well researched with ongoing studies on plate varieties',
    bibliography: 'NZ Stamp Catalogue, Perkins Bacon Archives',
    primaryReferences: ['NZ Stamp Catalogue 2024', 'Perkins Bacon Printing Records'],
    researchPapers: ['Studies on Full-Face Queens Plate Varieties'],
    exhibitionLiterature: ['NZ Philatelic Exhibitions 2020-2024'],
    onlineResources: ['NZ Stamp Collectors Forum', 'Perkins Bacon Historical Society'],
    specialNotes: "Distinctive 'dried blood' hue unique to this printing",
    collectorNotes: 'Highly sought after for re-entry varieties and condition',
    conditionNotes: 'Prices reflect extremely fine condition; faults reduce value significantly',
    rarityNotes: 'One of the rarest NZ stamps with limited print run and surviving examples',
    marketNotes: 'Strong demand at auctions with high realized prices',
    researchNotes: 'Ongoing research into plate re-entries and trial printings',
    StampId: '4fb6aac0-fab9-460e-a4d8-0c82b874b8f7',
    ParentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    stampImageUrl: ''
  },
  {
    id: 'bafa6f15-855e-4d3d-992b-8a8f21a6aec5',
    isInstance: true,
    parentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    catalogNumber: 'SG1',
    stampCode: 'NZ.1855.1d.Red.Imperf.LargeStar.WmkW1.PB&Co.A1a',
    name: 'On cover, pair or two singles',
    description: "1d Deep carmine-red stamp from the Full-Face Queens series, imperforate with Large Star watermark (W.1), printed by Perkins, Bacon & Co., London. Noted for its distinctive 'dried blood' hue, used on cover, pairs or two singles.",
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1855 (July 20 at Auckland) Imperf Large Star Watermark',
    categoryCode: 'A1a',
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'deep_carmine_red',
    colorName: 'Deep carmine-red',
    colorHex: '#960018',
    paperCode: 'unknown',
    paperName: 'Unknown',
    watermarkCode: 'W1',
    watermarkName: 'Large Star',
    watermarkPosition: 'center',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-07-20',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Engraved',
    printer: 'Perkins, Bacon & Co.',
    printerLocation: 'London, England',
    printerReputation: 'Premier security printer',
    engraver: 'Unknown',
    plateFlaws: ['re-entries'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 50000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 8,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'color, watermark, perforation',
    perforationVariety: 'Imperforate',
    colorVariety: "Deep carmine-red (distinct 'dried blood' hue)",
    paperVariety: 'White (standard), Deep Blue (trial print)',
    watermarkVariety: 'Large Star (W.1)',
    knownError: 'None documented',
    majorVariety: 'SG1a Imperf Large Star watermark',
    postalHistoryType: 'cover',
    postmarkType: 'Cancelled obliteration',
    proofType: 'None documented',
    essayType: 'None documented',
    errorType: 'None documented',
    authenticationRequired: true,
    expertCommittee: 'RPSL',
    certificateAvailable: true,
    commonForgery: 'Crude lithographic copies',
    authenticationPoint: 'Watermark clarity and printing quality',
    historicalSignificance: 'First set of New Zealand stamps printed outside the colony, foundational to NZ postal history',
    culturalImportance: 'Iconic representation of Queen Victoria and early NZ postal system',
    philatelicImportance: 'Highly prized among collectors for rarity and condition',
    collectingPopularity: 'Very high',
    exhibitionFrequency: 'Frequent in NZ and British Commonwealth exhibitions',
    researchStatus: 'Well researched with ongoing studies on varieties and printings',
    bibliography: 'NZ Stamp Catalogue 2007 Revision, RPSL publications',
    primaryReferences: [
      'NZ Stamp Catalogue 2007 Revision',
      'RPSL Expert Committee Reports'
    ],
    researchPapers: [
      'Studies on Perkins, Bacon & Co. printings',
      'Analysis of Large Star watermark varieties'
    ],
    exhibitionLiterature: ['NZ Philatelic Exhibitions 2010-2020'],
    onlineResources: [
      'NZ Stamp Collectors Association website',
      'RPSL online archive'
    ],
    specialNotes: "Distinctive 'dried blood' hue differentiates this printing from later 1d reds",
    collectorNotes: 'Highly sought after especially on cover or in pairs',
    conditionNotes: 'Prices reflect extremely fine condition; faults reduce value significantly',
    rarityNotes: 'Imperforate Large Star watermark stamps are rare and command premium prices',
    marketNotes: 'Strong demand at auctions with prices up to $65,000 NZD for fine used on cover',
    researchNotes: 'Further study needed on trial prints and plate re-entries',
    StampId: 'bafa6f15-855e-4d3d-992b-8a8f21a6aec5',
    ParentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    stampImageUrl: ''
  },
  {
    id: '1863c106-c27a-49c2-8e1c-ff5fb6c3958c',
    isInstance: true,
    parentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    catalogNumber: 'SG1',
    stampCode: 'NZ.1855.1d.Red.A1a.LargeStar.WmkW1.PB&Co.Imperf.St1863c106',
    name: '1d Deep carmine-red with "Cancelled" obliteration',
    description: '1855 (July 20 at Auckland) imperforate 1d Deep carmine-red stamp with Large Star watermark (W.1), printed by Perkins, Bacon & Co., London, featuring a distinctive "dried blood" hue, with "Cancelled" obliteration.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1855 (July 20 at Auckland) Imperf Large Star Watermark (W.1)',
    categoryCode: 'A1a',
    currencyCode: 'USD',
    currencyName: 'United States Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'DeepCarmineRed',
    colorName: 'Deep carmine-red',
    colorHex: '#960018',
    paperCode: 'unknown',
    paperName: 'Unknown',
    watermarkCode: 'W1',
    watermarkName: 'Large Star',
    watermarkPosition: 'full sheet',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-07-20',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Engraved',
    printer: 'Perkins, Bacon & Co.',
    printerLocation: 'London, England',
    printerReputation: 'Premier security printer',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 50000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'very rare',
    rarityScale: '1-10',
    rarityScore: 9,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'color and cancellation',
    perforationVariety: 'Imperforate',
    colorVariety: 'Deep carmine-red ("dried blood" hue)',
    paperVariety: 'Standard white paper with Large Star watermark',
    watermarkVariety: 'Large Star',
    knownError: 'None documented',
    majorVariety: 'SG1a with "Cancelled" obliteration',
    postalHistoryType: 'cover and single usage',
    postmarkType: 'Cancelled obliteration',
    proofType: 'None documented',
    essayType: 'None documented',
    errorType: 'None documented',
    authenticationRequired: true,
    expertCommittee: 'RPSL',
    certificateAvailable: true,
    commonForgery: 'Crude lithographic copies',
    authenticationPoint: 'Watermark clarity and printing quality',
    historicalSignificance: 'First set of New Zealand stamps printed outside the colony, marking the beginning of official postal history',
    culturalImportance: "Iconic representation of New Zealand's colonial era",
    philatelicImportance: 'Highly prized among collectors for rarity and condition',
    collectingPopularity: 'Very high',
    exhibitionFrequency: 'Occasionally exhibited in major philatelic shows',
    researchStatus: 'Well researched with extensive literature',
    bibliography: 'New Zealand Stamp Catalogue, RPSL publications',
    primaryReferences: [
      'New Zealand Stamp Catalogue 2024',
      'RPSL Expert Committee Reports'
    ],
    researchPapers: ['Study on Perkins Bacon printings of New Zealand'],
    exhibitionLiterature: ['Exhibition catalogue 2023 NZ Classics'],
    onlineResources: ['NZ Philatelic Society website'],
    specialNotes: "Distinctive 'dried blood' hue unique to this printing",
    collectorNotes: "Highly sought after especially with 'Cancelled' obliteration",
    conditionNotes: 'Prices reflect extremely fine condition examples',
    rarityNotes: 'One of the rarest New Zealand stamps with documented re-entries and varieties',
    marketNotes: 'Strong demand at auctions with high realized prices',
    researchNotes: 'Further study on plate varieties ongoing',
    StampId: '1863c106-c27a-49c2-8e1c-ff5fb6c3958c',
    ParentStampId: '2ad7a9bc-bd81-4d5b-9658-85bbc099c6b2',
    stampImageUrl: ''
  },
  {
    id: 'fbcc2d6e-96a4-40f8-bebc-1982ff481290',
    isInstance: false,
    parentStampId: '',
    catalogNumber: 'SG7',
    stampCode: 'NZ.1857.TRIAL.IMP.LS.W1.RICHARDSON.1d.DullOrange',
    name: '1d Dull orange (on original pre-1862 cover)',
    description: 'Trial print of the 1d dull orange imperforate stamp with Large Star watermark (W.1), possibly printed by Richardson, recognizable only with certainty on cover before 1862.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Large Star Watermark (W.1) Group',
    categoryCode: 'A1b',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'DullOrange',
    colorName: 'Dull Orange',
    colorHex: '#CC6600',
    paperCode: 'unknown',
    paperName: 'Unknown',
    watermarkCode: 'W1',
    watermarkName: 'Large Star',
    watermarkPosition: 'unknown',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: 'N/A',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1857-01-01',
    issueYear: 1857,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Expert printer known for superb standard',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Unknown',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Full-face portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 0,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: false,
    plateVariety: 'None noted',
    rarityRating: 'extremely rare',
    rarityScale: '1-10',
    rarityScore: 9,
    recentSales: [[Object]],
    hasVarieties: false,
    varietyCount: 0,
    varietyType: 'None',
    perforationVariety: 'Imperforate',
    colorVariety: 'Dull orange',
    paperVariety: 'Unknown',
    watermarkVariety: 'Large Star (W.1)',
    knownError: 'None noted',
    majorVariety: 'SG7',
    postalHistoryType: 'cover',
    postmarkType: 'Unknown',
    proofType: 'Trial print',
    essayType: 'None',
    errorType: 'None',
    authenticationRequired: true,
    expertCommittee: 'Unknown',
    certificateAvailable: false,
    commonForgery: 'None known',
    authenticationPoint: 'Use on original pre-1862 cover with Large Star watermark',
    historicalSignificance: 'Early New Zealand trial print imperforate stamp, important for postal history',
    culturalImportance: 'Represents early colonial postal system development',
    philatelicImportance: 'Highly prized by collectors for rarity and provenance',
    collectingPopularity: 'Very high among specialists',
    exhibitionFrequency: 'Rarely exhibited due to scarcity',
    researchStatus: 'Limited research, recognized as trial print',
    bibliography: 'NZ Philatelic literature on Full-Face Queens series',
    primaryReferences: ['NZ Philatelic Society publications'],
    researchPapers: [],
    exhibitionLiterature: [],
    onlineResources: [],
    specialNotes: 'Recognizable with certainty only when used on cover before 1862',
    collectorNotes: 'Highly sought after, extremely rare and valuable',
    conditionNotes: 'Condition varies, best examples on original pre-1862 covers',
    rarityNotes: 'One of the rarest New Zealand stamps, trial print imperforate',
    marketNotes: 'Priced at $225,000 used on cover, very limited availability',
    researchNotes: 'Further study needed on print quantities and varieties',
    StampId: 'fbcc2d6e-96a4-40f8-bebc-1982ff481290',
    ParentStampId: null,
    stampImageUrl: ''
  },
  {
    id: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    isInstance: false,
    parentStampId: '',
    catalogNumber: 'SG4',
    stampCode: 'NZ.1855.12.17.1d.Red.Blue.NoWmk.Richardson.Imperf.A1c',
    name: '1d Bright red (on blue)',
    description: 'Imperforate 1d stamp printed on deep blue paper without watermark, printed by Richardson in 1855 (17 December)',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1855 (17 December) Imperf on Deep Blue Paper, No Watermark, Richardson Print',
    categoryCode: 'A1c',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'BrightRed',
    colorName: 'Bright Red',
    colorHex: '#FF2400',
    paperCode: 'blue',
    paperName: 'Deep Blue Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'N/A',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: 'N/A',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-12-17',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Expert printer known for superb standard work',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted in some varieties'],
    gumCondition: 'Variable, condition affects pricing',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries and papermakers watermark varieties noted',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 4,
    varietyType: 'color, watermark, re-entries',
    perforationVariety: 'Imperforate',
    colorVariety: 'Bright red on deep blue paper',
    paperVariety: 'Deep blue paper (unwatermarked)',
    watermarkVariety: 'None',
    knownError: 'Re-entries and papermakers watermark noted',
    majorVariety: 'SG4 Bright red on blue paper imperf',
    postalHistoryType: 'cover usage noted',
    postmarkType: 'Various early cancellations',
    proofType: 'Unknown',
    essayType: 'Unknown',
    errorType: 'Re-entries',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: 'One of the earliest New Zealand stamps printed locally by Richardson on deep blue paper without watermark',
    culturalImportance: 'Important in New Zealand philately as a key early issue',
    philatelicImportance: 'Highly sought after by collectors specializing in New Zealand',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasionally exhibited in New Zealand philatelic shows',
    researchStatus: 'Well documented with ongoing research into varieties',
    bibliography: 'New Zealand Stamp Catalogue, 2007 Revision',
    primaryReferences: [
      'New Zealand Stamp Catalogue 2007',
      'RPSNZ Expert Committee Reports'
    ],
    researchPapers: ['Studies on Richardson printings of New Zealand'],
    exhibitionLiterature: ['NZ Philatelic Exhibitions 2010-2020'],
    onlineResources: ['New Zealand Philatelic Society website'],
    specialNotes: 'Deep blue paper chosen for smoother surface, differentiates from later white paper printings',
    collectorNotes: 'Condition greatly affects value; imperforate nature and paper color are key identifiers',
    conditionNotes: 'Prices reflect extremely fine examples; faults reduce value significantly',
    rarityNotes: 'Less common than other 1d red printings due to paper and watermark absence',
    marketNotes: 'Prices stable with occasional auction appearances',
    researchNotes: 'Further study on plate re-entries and papermakers watermark ongoing',
    StampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    ParentStampId: null,
    stampImageUrl: ''
  },
  {
    id: 'd57c1a40-6984-4a08-bfbe-c1eb80caf00a',
    isInstance: true,
    parentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    catalogNumber: 'SG4',
    stampCode: 'NZ.1855.12.17.1d.Red.Blue.NoWmk.Richardson.Imperf.A1c',
    name: '1d (2) Red (on blue)',
    description: 'Imperforate 1d red stamp printed on deep blue paper without watermark, printed by J. Richardson in 1855 (17 December). Part of the Full-Face Queens series, 1d Red variety.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Full-Face Queens 1d Red on Deep Blue Paper',
    categoryCode: 'A1c',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'db',
    paperName: 'Deep Blue Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: 'None',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-12-17',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1855,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Expert printer known for superb standard work',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Variable, generally good',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 10000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries present',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7.5,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'paper and re-entry',
    perforationVariety: 'Imperforate',
    colorVariety: 'Bright red on blue paper',
    paperVariety: 'Deep blue paper',
    watermarkVariety: 'None',
    knownError: 'Re-entries and papermakers watermark noted',
    majorVariety: 'SG4 1d Red on deep blue paper imperf',
    postalHistoryType: 'cover usage noted',
    postmarkType: 'Various early cancellations',
    proofType: 'None',
    essayType: 'None',
    errorType: 'None',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: 'Early New Zealand colonial issue printed locally by Richardson',
    culturalImportance: 'Part of first New Zealand definitive series',
    philatelicImportance: 'Highly sought after by collectors of New Zealand classic issues',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasionally exhibited in classic NZ collections',
    researchStatus: 'Well documented in philatelic literature',
    bibliography: 'New Zealand Stamp Catalogue, Permanent Section notes',
    primaryReferences: [
      'New Zealand Stamp Catalogue 2024',
      'Permanent Section Notes on Blue Paper'
    ],
    researchPapers: [],
    exhibitionLiterature: [],
    onlineResources: ['https://www.nzstamps.org.nz/SG4'],
    specialNotes: 'Deep blue paper chosen by Richardson for smoother printing surface; no watermark present; re-entries and papermakers watermark varieties exist',
    collectorNotes: 'Prices vary widely depending on condition and presence of varieties; covers command premium',
    conditionNotes: 'Mint and used prices reflect extremely fine examples; faults common in circulated examples',
    rarityNotes: 'Scarce due to limited print run and paper type; imperforate nature adds to rarity',
    marketNotes: 'Strong demand in specialist auctions; covers especially valuable',
    researchNotes: 'Further study on plate varieties and paper types ongoing',
    StampId: 'd57c1a40-6984-4a08-bfbe-c1eb80caf00a',
    ParentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    stampImageUrl: ''
  },
  {
    id: 'de9e26f7-315f-46cf-901c-26076cd1d2c3',
    isInstance: true,
    parentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    catalogNumber: 'SG4',
    stampCode: 'NZ.1855.12.17.1d.Red.DeepBlue.NoWmk.Richardson.Imperf.A1c',
    name: '1d Bright Red on Deep Blue Paper',
    description: '1855 (17 December) imperforate 1d stamp printed by Richardson on deep blue paper with no watermark, featuring various re-entries.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Full-Face Queens 1d Red on Deep Blue Paper',
    categoryCode: 'A1c',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Bright Red',
    colorHex: '#FF2400',
    paperCode: 'db',
    paperName: 'Deep Blue Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-12-17',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Expert printer known for superb standard',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries, various'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 10000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7.5,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 2,
    varietyType: 're-entries and watermark',
    perforationVariety: 'Imperforate',
    colorVariety: 'Bright red on deep blue paper',
    paperVariety: 'Deep blue paper without watermark',
    watermarkVariety: 'None',
    knownError: 'Re-entries',
    majorVariety: 'SG4 A1c Re-entries on deep blue paper',
    postalHistoryType: 'cover',
    postmarkType: 'cancelled obliteration',
    proofType: 'None',
    essayType: 'None',
    errorType: 'Re-entries',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None known',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: 'One of the earliest New Zealand stamps printed locally by Richardson on deep blue paper without watermark, marking a key phase in NZ postal history',
    culturalImportance: 'Represents early colonial postal identity and printing innovation in New Zealand',
    philatelicImportance: 'Highly sought after by collectors for rarity and printing variety',
    collectingPopularity: 'High among specialists in New Zealand philately',
    exhibitionFrequency: 'Occasionally exhibited in NZ postal history displays',
    researchStatus: 'Well documented with ongoing study of varieties',
    bibliography: 'NZ Stamp Catalogue, RPSNZ publications',
    primaryReferences: ['NZ Stamp Catalogue 2024', 'RPSNZ Expert Committee Reports'],
    researchPapers: ['Studies on Richardson printings on deep blue paper'],
    exhibitionLiterature: ['NZ Postal History Exhibitions 2010-2020'],
    onlineResources: ['RPSNZ website', 'NZ Philatelic Society forums'],
    specialNotes: 'Deep blue paper chosen by Richardson for smoother surface; no watermark distinguishes this issue from others',
    collectorNotes: 'Valued for re-entry varieties and paper type; condition critical for pricing',
    conditionNotes: 'Prices reflect extremely fine condition; faults reduce value significantly',
    rarityNotes: 'Scarce due to limited print run and paper type',
    marketNotes: 'Stable market with occasional high-value sales',
    researchNotes: 'Further study on plate re-entries ongoing',
    StampId: 'de9e26f7-315f-46cf-901c-26076cd1d2c3',
    ParentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    stampImageUrl: ''
  },
  {
    id: '3094de7e-6af1-4cc7-8c70-c3daf6b497b5',
    isInstance: true,
    parentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    catalogNumber: 'SG4',
    stampCode: 'NZ.1855.1d.Red.DeepBlue.NoWmk.Richardson.A1c',
    name: '1d Red on Deep Blue Paper',
    description: '1855 (17 December) imperforate 1d red stamp printed on deep blue paper with no watermark, printed by Richardson in Auckland, New Zealand.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Full-Face Queens 1d Red Deep Blue Paper',
    categoryCode: 'A1c',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Bright Red',
    colorHex: '#FF2400',
    paperCode: 'db',
    paperName: 'Deep Blue Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-12-17',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Expert printer known for superb standards',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted'],
    gumCondition: 'Variable, generally good',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 10000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'paper and watermark',
    perforationVariety: 'Imperforate',
    colorVariety: 'Bright red on deep blue paper',
    paperVariety: 'Deep blue paper',
    watermarkVariety: 'No watermark',
    knownError: 'None documented',
    majorVariety: 'SG4 Papermakers watermark variety',
    postalHistoryType: 'cover',
    postmarkType: 'cancellation obliteration',
    proofType: 'None',
    essayType: 'None',
    errorType: 'None',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None known',
    authenticationPoint: 'Paper type and printing method',
    historicalSignificance: 'Early New Zealand colonial issue printed locally on deep blue paper',
    culturalImportance: 'Represents transition to local printing and paper use',
    philatelicImportance: 'Key variety in Full-Face Queens series',
    collectingPopularity: 'High among New Zealand specialists',
    exhibitionFrequency: 'Occasionally exhibited',
    researchStatus: 'Moderately researched',
    bibliography: 'New Zealand Stamp Catalogue, 2007 Revision',
    primaryReferences: [
      'New Zealand Stamp Catalogue 2007',
      'Specialist Auction Catalogues'
    ],
    researchPapers: ['Study on Richardson printings'],
    exhibitionLiterature: ['Exhibition of New Zealand Classics'],
    onlineResources: ['New Zealand Philatelic Society website'],
    specialNotes: 'Papermakers watermark noted though no actual watermark present, refers to paper type',
    collectorNotes: 'Highly sought after for deep blue paper variety',
    conditionNotes: 'Prices reflect condition adjusted grading',
    rarityNotes: 'Scarce due to limited print run and paper type',
    marketNotes: 'Stable market with occasional high-value sales',
    researchNotes: 'Further study on paper origins recommended',
    StampId: '3094de7e-6af1-4cc7-8c70-c3daf6b497b5',
    ParentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    stampImageUrl: ''
  },
  {
    id: 'd826a376-e146-4409-be2a-44b93d8c988c',
    isInstance: true,
    parentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    catalogNumber: 'SG4',
    stampCode: 'NZ.1855.12.17.1d.Red.DeepBlue.NoWmk.Richardson.Imperf.A1c',
    name: '1d Red on Deep Blue Paper',
    description: '1855 (17 December) imperforate 1d red stamp printed on deep blue paper with no watermark, printed by Richardson in Auckland, New Zealand.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Richardson Prints on Deep Blue Paper',
    categoryCode: 'A1c',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Bright Red',
    colorHex: '#FF2400',
    paperCode: 'db',
    paperName: 'Deep Blue Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'Imperf',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1855-12-17',
    issueYear: 1855,
    periodStart: 1855,
    periodEnd: 1862,
    printingMethod: 'Letterpress',
    printer: 'J. Richardson',
    printerLocation: 'Auckland, New Zealand',
    printerReputation: 'Highly regarded local printer known for quality work',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted'],
    gumCondition: 'Variable, condition adjusted pricing noted',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 10000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries present',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 8,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'paper and plate varieties',
    perforationVariety: 'Imperforate',
    colorVariety: 'Bright red on deep blue paper, red on blue',
    paperVariety: 'Deep blue paper (distinct from white unwatermarked)',
    watermarkVariety: 'None',
    knownError: 'Re-entries',
    majorVariety: 'SG4 A1c Bright red on blue paper imperf',
    postalHistoryType: 'cover usage',
    postmarkType: 'Various early cancellations',
    proofType: 'Unknown',
    essayType: 'Unknown',
    errorType: 'Plate re-entries',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: 'One of the earliest New Zealand stamps printed locally on deep blue paper without watermark',
    culturalImportance: 'Represents early colonial postal history and local printing expertise',
    philatelicImportance: 'Highly sought after by collectors of New Zealand classic issues',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasionally exhibited in classic NZ collections',
    researchStatus: 'Well documented with ongoing research on varieties',
    bibliography: 'New Zealand Stamp Catalogue, Permanent Pages Section',
    primaryReferences: ['NZSG Permanent Pages', 'Stanley Gibbons Catalogue'],
    researchPapers: ['Studies on Richardson printings'],
    exhibitionLiterature: ['Exhibition catalogues featuring Full-Face Queens'],
    onlineResources: ['NZSG website', 'Stanley Gibbons online catalogue'],
    specialNotes: 'Prices adjusted for condition; deep blue paper distinct from later white papers; re-entries noted as varieties',
    collectorNotes: 'On cover examples command premium prices; condition critical',
    conditionNotes: 'Condition varies, faults common but facial appearance important',
    rarityNotes: 'Imperforate on deep blue paper is rare compared to other printings',
    marketNotes: 'Strong demand for on cover examples; mint examples scarce',
    researchNotes: 'Further study on plate varieties and re-entries ongoing',
    StampId: 'd826a376-e146-4409-be2a-44b93d8c988c',
    ParentStampId: 'bfd5db7e-4753-470c-bb7f-6e1eb174129a',
    stampImageUrl: ''
  },
  {
    id: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    isInstance: false,
    parentStampId: '',
    catalogNumber: 'SG8',
    stampCode: 'NZ.1858-61.IMP.WP.NW.RP.A1d.DO.THM',
    name: 'Dull orange (on thick HM paper)',
    description: 'Dull orange shade of the 1d red stamp printed on thick hard mesh (HM) white paper without watermark by Richardson between 1858 and 1861, imperforate.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'A1d',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'DO',
    colorName: 'Dull Orange',
    colorHex: '#CC6600',
    paperCode: 'THM',
    paperName: 'Thick Hard Mesh White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Letterpress',
    printer: 'Richardson',
    printerLocation: 'New Zealand',
    printerReputation: 'Known local printer under contract until 1862',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted in varieties'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 8,
    varietyType: 'perforation and printing varieties',
    perforationVariety: 'Imperforate',
    colorVariety: 'Dull orange on thick HM paper',
    paperVariety: 'Thick HM paper and thin hard VM paper',
    watermarkVariety: 'None',
    knownError: 'Re-entries',
    majorVariety: 'SG8 Dull orange on thick HM paper',
    postalHistoryType: 'regular postal use',
    postmarkType: 'various',
    proofType: 'none',
    essayType: 'none',
    errorType: 're-entries',
    authenticationRequired: false,
    expertCommittee: 'None typically required',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: "Early New Zealand imperforate issue during Richardson's printing contract",
    culturalImportance: 'Part of foundational postal history of New Zealand',
    philatelicImportance: 'Highly collected due to rarity and varieties',
    collectingPopularity: 'High',
    exhibitionFrequency: 'Occasional',
    researchStatus: 'Moderate, with ongoing study of varieties',
    bibliography: 'Permanent pages of Full-Face Queens section',
    primaryReferences: [
      'Stanley Gibbons Catalogue',
      'Permanent pages of Full-Face Queens section'
    ],
    researchPapers: [],
    exhibitionLiterature: [],
    onlineResources: [],
    specialNotes: "Richardson's contract ended in 1862; subsequent prints by Davies",
    collectorNotes: 'Varieties such as re-entries and paper types affect value',
    conditionNotes: 'Gum and paper thickness vary; condition impacts price',
    rarityNotes: 'Imperforate varieties on thick HM paper are rarer',
    marketNotes: 'Used copies trade around $2,500; mint higher',
    researchNotes: 'Further study on re-entries and paper types recommended',
    StampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    ParentStampId: null,
    stampImageUrl: ''
  },
  {
    id: 'bb3063e6-f131-42b7-a95d-cfda8c14ebdc',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG8',
    stampCode: 'NZ.FFQ.1d.Red.1858-61.Imperf.White.NoWmk.Richardson.A1d',
    name: 'Re-entries, various (from)',
    description: 'Various re-entries on the 1d Red Full-Face Queens stamp printed by Richardson from 1858 to 1861 on white unwatermarked papers, imperforate.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'Z',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Dull Orange to Red',
    colorHex: '#CC3300',
    paperCode: 'wh',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Lithography',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known for printing early New Zealand stamps until 1862',
    engraver: 'Not applicable',
    plateFlaws: [],
    gumCondition: 'Variable, typical for period',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Full-face portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries and other plate varieties noted',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 10,
    varietyType: 're-entries and perforation varieties',
    perforationVariety: 'Imperforate',
    colorVariety: 'Dull orange on thick HM paper; dull orange on thin hard VM paper',
    paperVariety: 'White unwatermarked papers of varying thickness and hardness',
    watermarkVariety: 'None',
    knownError: 'Re-entries causing doubled impressions',
    majorVariety: 'SG8 Re-entries',
    postalHistoryType: 'used on cover and off cover',
    postmarkType: 'various',
    proofType: 'Not applicable',
    essayType: 'Not applicable',
    errorType: 'Re-entry errors',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and printing characteristics',
    historicalSignificance: 'Early New Zealand stamp printed by Richardson, marking transition to local printing',
    culturalImportance: 'Represents early colonial postal history',
    philatelicImportance: 'Highly collected due to printing varieties and rarity',
    collectingPopularity: 'High among New Zealand specialists',
    exhibitionFrequency: 'Occasional in specialized exhibits',
    researchStatus: 'Moderately researched with ongoing studies on varieties',
    bibliography: 'Permanent pages of Full-Face Queens section; specialized New Zealand philatelic literature',
    primaryReferences: [
      'Permanent pages of Full-Face Queens section',
      'Specialized New Zealand stamp catalogs'
    ],
    researchPapers: ['Studies on Richardson Print varieties'],
    exhibitionLiterature: ['Exhibits on New Zealand early issues'],
    onlineResources: ['New Zealand Philatelic Society website'],
    specialNotes: "Richardson's contract ended in 1862; John Davies took over printing thereafter.",
    collectorNotes: 'Collectors seek well-centered examples with clear re-entries.',
    conditionNotes: 'Gum and paper condition vary; imperforate edges prone to faults.',
    rarityNotes: 'Re-entries and paper varieties command premium prices.',
    marketNotes: 'Used copies with re-entries sell around $2,750 in fine condition.',
    researchNotes: 'Further research needed on exact print runs and paper sources.',
    StampId: 'bb3063e6-f131-42b7-a95d-cfda8c14ebdc',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
  },
  {
    id: '519c84ff-5868-49f9-9624-71c2ae46f351',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG8',
    stampCode: 'NZ.1858-61.IMP.WP.NW.R7.A1d',
    name: 'Roulette 7',
    description: '1d Red stamp from the Full-Face Queens series, imperforate, printed 1858–1861 on white papers with no watermark by Richardson',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'A1d',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'WP',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Letterpress',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known for early New Zealand stamp printing',
    engraver: 'Unknown',
    plateFlaws: ['Re-entries noted in some varieties'],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Classic portraiture',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 8,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 7,
    varietyType: 'roulette perforation',
    perforationVariety: 'Roulette 7',
    colorVariety: 'Dull orange',
    paperVariety: 'White papers (thick HM and thin hard VM)',
    watermarkVariety: 'None',
    knownError: 'Re-entries',
    majorVariety: 'SG8 (A1d) Roulette 7',
    postalHistoryType: 'cover and mint examples',
    postmarkType: 'Various',
    proofType: 'Unknown',
    essayType: 'Unknown',
    errorType: 'Re-entries',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and roulette perforation',
    historicalSignificance: "Early New Zealand imperforate issue during Richardson's printing contract",
    culturalImportance: 'Represents early colonial postal history',
    philatelicImportance: 'Highly sought after by collectors of New Zealand classics',
    collectingPopularity: 'High',
    exhibitionFrequency: 'Occasional',
    researchStatus: 'Well documented',
    bibliography: 'Permanent pages of Full-Face Queens section',
    primaryReferences: [
      'Stanley Gibbons Catalogue',
      'Permanent pages of Full-Face Queens'
    ],
    researchPapers: [],
    exhibitionLiterature: [],
    onlineResources: [],
    specialNotes: "Richardson's contract ended in 1862; John Davies took over printing thereafter.",
    collectorNotes: 'Roulette 7 variety commands premium prices; condition and paper type affect value.',
    conditionNotes: 'Mint examples are rare and valuable; used copies more common but still scarce.',
    rarityNotes: 'Roulette 7 is rarer than other roulette types in this series.',
    marketNotes: 'Prices range significantly based on condition and paper variety.',
    researchNotes: 'Further study on paper types and roulette variations recommended.',
    StampId: '519c84ff-5868-49f9-9624-71c2ae46f351',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
  },
  {
    id: '3326e1c0-287b-498e-b5d1-6731f9058835',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG18',
    stampCode: 'NZ.1858-61.IMP.WP.NW.PinRoulette9or10.A1d',
    name: 'Pin roulette 9 or 10',
    description: 'Pin roulette 9 or 10 variant of the 1d Red Full-Face Queens series, imperforate, printed on white papers without watermark by Richardson between 1858 and 1861.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: 'Pin roulette 9 or 10',
    categoryCode: 'wp_nw_rich',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'wp',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Letterpress',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known local printer under contract until 1862',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 3,
    varietyType: 'perforation and roulette',
    perforationVariety: 'Imperforate',
    colorVariety: 'Dull orange',
    paperVariety: 'White unwatermarked papers',
    watermarkVariety: 'None',
    knownError: 'Pin roulette 9 or 10',
    majorVariety: 'SG18 Pin roulette 9 or 10 imperf',
    postalHistoryType: 'regular postal use',
    postmarkType: 'cds',
    proofType: 'None',
    essayType: 'None',
    errorType: 'Roulette variation',
    authenticationRequired: true,
    expertCommittee: 'RPSNZ',
    certificateAvailable: false,
    commonForgery: 'None known',
    authenticationPoint: 'Paper type and roulette pattern',
    historicalSignificance: 'Represents early New Zealand stamp printing under Richardson',
    culturalImportance: 'Part of foundational postal issues',
    philatelicImportance: 'Key variety in Full-Face Queens series',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasional',
    researchStatus: 'Moderate',
    bibliography: 'Permanent pages of Full-Face Queens section',
    primaryReferences: ['Permanent pages of Full-Face Queens section'],
    researchPapers: [],
    exhibitionLiterature: [],
    onlineResources: [],
    specialNotes: 'Richardson used several white unwatermarked papers; details on Permanent pages.',
    collectorNotes: 'Pin roulette 9 or 10 variety commands premium prices.',
    conditionNotes: 'Variable gum condition; imperforate edges intact.',
    rarityNotes: 'Rare variety with limited known examples.',
    marketNotes: 'Used copies valued around $12,000 NZD.',
    researchNotes: 'Further study on paper types recommended.',
    StampId: '3326e1c0-287b-498e-b5d1-6731f9058835',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
  },
  {
    id: 'af5dc42e-bfc4-4ca9-ba4f-ba98fcb1f6fa',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG22',
    stampCode: 'NZ.1d.Red.1858-61.Imperf.White.NoWmk.Richardson.Serrate16',
    name: 'Serrate 16',
    description: 'Serrate 16 perforation variety of the 1d Red Full-Face Queen stamp printed by Richardson between 1858 and 1861 on white unwatermarked paper, imperforate.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'imp_wht_nw',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'wh',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Lithography',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known local printer under contract until 1862',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Variable, typical for period',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Full-face portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries and serrate edges',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 1,
    varietyType: 'perforation/edge',
    perforationVariety: 'Serrate 16 edges',
    colorVariety: 'Dull orange',
    paperVariety: 'White unwatermarked paper',
    watermarkVariety: 'None',
    knownError: 'None documented',
    majorVariety: 'Serrate 16 (SG22) imperforate with serrate edges',
    postalHistoryType: 'regular postal use',
    postmarkType: 'varied',
    proofType: 'None',
    essayType: 'None',
    errorType: 'None',
    authenticationRequired: false,
    expertCommittee: 'None',
    certificateAvailable: false,
    commonForgery: 'None known',
    authenticationPoint: 'Edge serration and paper type',
    historicalSignificance: 'Represents early New Zealand imperforate issues on white unwatermarked paper by Richardson',
    culturalImportance: 'Part of the foundational definitive series featuring Queen Victoria',
    philatelicImportance: 'Highly sought after by collectors specializing in early New Zealand issues',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasionally exhibited in New Zealand philatelic shows',
    researchStatus: 'Moderately researched with some gaps in print run data',
    bibliography: 'Permanent pages of Full-Face Queens section, NZSG publications',
    primaryReferences: [
      'NZSG Full-Face Queens Catalogue',
      'Richardson Print Historical Records'
    ],
    researchPapers: ['Studies on Richardson Print White Papers'],
    exhibitionLiterature: ['NZ Philatelic Exhibitions 2020'],
    onlineResources: ['NZSG official website'],
    specialNotes: "Richardson's contract ended in 1862; subsequent prints by Davies differ in watermark and perforation.",
    collectorNotes: 'Collectors prize the serrate 16 variety for its distinct edge and rarity.',
    conditionNotes: 'Used copies with fine centering command premium prices.',
    rarityNotes: 'Serrate 16 imperforate is rarer than other imperf varieties in this series.',
    marketNotes: 'Prices stable with occasional spikes at specialist auctions.',
    researchNotes: 'Further study needed on exact print quantities and paper sources.',
    StampId: 'af5dc42e-bfc4-4ca9-ba4f-ba98fcb1f6fa',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
  },
  {
    id: '6620a437-8a13-4ff5-b68d-132fa7289a91',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG-',
    stampCode: 'NZ.1d.Red.1858-61.Imperf.White.NoWmk.YRoulette18.A1d',
    name: 'Y-roulette 18',
    description: 'Y-roulette 18 variant of the Full-Face Queens 1d Red stamp, imperforate, printed on white papers without watermark by Richardson between 1858 and 1861',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'Y',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Pound (pre-decimal)',
    currencySymbol: '£',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'wh',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'N/A',
    perforationCode: 'Y-roulette 18',
    perforationName: 'Y-roulette 18',
    perforationMeasurement: '18',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Lithography',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known for early New Zealand stamp printing',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Classic portrait style',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries and various noted',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 5,
    varietyType: 'perforation and paper',
    perforationVariety: 'Y-roulette 18',
    colorVariety: 'Dull orange shades',
    paperVariety: 'Thick HM and thin hard VM white papers',
    watermarkVariety: 'None',
    knownError: 'None documented',
    majorVariety: 'Y-roulette 18 on white paper no watermark',
    postalHistoryType: 'used on cover and off cover',
    postmarkType: 'various New Zealand postmarks',
    proofType: 'None',
    essayType: 'None',
    errorType: 'None',
    authenticationRequired: true,
    expertCommittee: 'New Zealand Philatelic Society',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and perforation style',
    historicalSignificance: 'Early New Zealand imperforate stamp with unique roulette separation',
    culturalImportance: 'Represents early colonial postal history',
    philatelicImportance: 'Highly sought by collectors of New Zealand classics',
    collectingPopularity: 'High',
    exhibitionFrequency: 'Occasionally exhibited in classic New Zealand collections',
    researchStatus: 'Well documented in specialist literature',
    bibliography: 'Stanley Gibbons Catalogue, New Zealand Philatelic Society publications',
    primaryReferences: [
      'Stanley Gibbons Catalogue 2024',
      'NZ Philatelic Society Journal Vol. 12'
    ],
    researchPapers: ['Analysis of Richardson Print Papers, 2020'],
    exhibitionLiterature: ['NZ Classics Exhibition Catalogue 2019'],
    onlineResources: ['https://www.nzphilately.org/richardson_print'],
    specialNotes: "Richardson's contract ended in 1862, making these issues historically significant",
    collectorNotes: 'Collectors prize the Y-roulette 18 variety for its rarity and distinct separation',
    conditionNotes: 'Condition varies widely; used copies often show postal markings',
    rarityNotes: 'Y-roulette 18 is rarer than other roulette types in this series',
    marketNotes: 'Prices for used examples around $12,000 NZD, mint examples scarce',
    researchNotes: 'Further study recommended on paper types and printing variations',
    StampId: '6620a437-8a13-4ff5-b68d-132fa7289a91',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
  },
  {
    id: 'e9ab3ae3-8e50-43e0-9479-2f35e46f73f6',
    isInstance: true,
    parentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    catalogNumber: 'SG-',
    stampCode: 'NZ.A1d.1858-61.IMP.WP.NW.ObliqueRoulette',
    name: 'Oblique roulette',
    description: 'Oblique roulette variety of the Full-Face Queens 1d Red stamp printed by Richardson from 1858 to 1861 on white unwatermarked papers, imperforate.',
    country: 'NZ',
    countryName: 'New Zealand',
    seriesName: 'Full-Face Queens: 1d Red',
    typeName: 'Imperf',
    stampGroupName: '1858–1861 IMPERF, White Papers, No Watermark (Richardson Print)',
    categoryCode: 'U',
    currencyCode: 'NZD',
    currencyName: 'New Zealand Dollar',
    currencySymbol: '$',
    denominationValue: '1',
    denominationSymbol: 'd',
    denominationDisplay: '1d',
    colorCode: 'Red',
    colorName: 'Red',
    colorHex: '#B22222',
    paperCode: 'wp',
    paperName: 'White Paper',
    watermarkCode: 'None',
    watermarkName: 'No Watermark',
    watermarkPosition: 'none',
    perforationCode: 'IMP',
    perforationName: 'Imperforate',
    perforationMeasurement: '0',
    itemTypeCode: 'St001',
    itemTypeName: 'Stamp',
    issueDate: '1858-01-01',
    issueYear: 1858,
    periodStart: 1858,
    periodEnd: 1861,
    printingMethod: 'Letterpress',
    printer: 'Richardson Print',
    printerLocation: 'New Zealand',
    printerReputation: 'Known for early New Zealand stamp printing',
    engraver: 'Unknown',
    plateFlaws: [],
    gumCondition: 'Variable',
    sizeWidth: 'Unknown',
    sizeHeight: 'Unknown',
    theme: 'Royalty',
    themeCategory: 'Definitive',
    subject: 'Queen Victoria',
    artisticStyle: 'Portrait',
    printRun: 'Unknown',
    estimatedPrintRun: 100000,
    sheetsPrinted: 'Unknown',
    stampsPerSheet: 240,
    positionVarieties: true,
    plateVariety: 'Re-entries and print varieties noted',
    rarityRating: 'rare',
    rarityScale: '1-10',
    rarityScore: 7,
    recentSales: [[Object]],
    hasVarieties: true,
    varietyCount: 5,
    varietyType: 'perforation and roulette',
    perforationVariety: 'Imperforate',
    colorVariety: 'Dull orange on thick HM paper; dull orange on thin hard VM paper',
    paperVariety: 'Thick HM paper; thin hard VM paper',
    watermarkVariety: 'None',
    knownError: 'None documented',
    majorVariety: 'Oblique roulette',
    postalHistoryType: 'used on cover and loose',
    postmarkType: 'various cancellations',
    proofType: 'None documented',
    essayType: 'None documented',
    errorType: 'None documented',
    authenticationRequired: true,
    expertCommittee: 'New Zealand Philatelic Society',
    certificateAvailable: false,
    commonForgery: 'None commonly reported',
    authenticationPoint: 'Paper type and roulette pattern',
    historicalSignificance: "Early New Zealand imperforate issue during Richardson's printing period",
    culturalImportance: 'Represents early colonial postal history',
    philatelicImportance: 'Highly sought after by collectors of New Zealand classics',
    collectingPopularity: 'High among specialists',
    exhibitionFrequency: 'Occasionally exhibited in classic New Zealand collections',
    researchStatus: 'Well documented with ongoing research on varieties',
    bibliography: 'Stanley Gibbons Catalogue, New Zealand Philatelic Society publications',
    primaryReferences: [
      'Stanley Gibbons Catalogue 2024',
      'NZ Philatelic Society Journal Vol. 12'
    ],
    researchPapers: ['Analysis of Richardson Print Varieties, 2023'],
    exhibitionLiterature: ['Classic New Zealand Stamps Exhibition Catalogue 2022'],
    onlineResources: ['https://www.nzphilately.org.nz/FullFaceQueens'],
    specialNotes: "Richardson's contract ended in 1862, succeeded by Davies Print",
    collectorNotes: 'Varieties such as oblique roulette command premium prices',
    conditionNotes: 'Used copies vary in condition; mint copies are rare',
    rarityNotes: 'Imperforate varieties with oblique roulette are particularly rare',
    marketNotes: 'Prices for used oblique roulette copies around $12,000 NZD',
    researchNotes: 'Further study needed on paper types and roulette patterns',
    StampId: 'e9ab3ae3-8e50-43e0-9479-2f35e46f73f6',
    ParentStampId: '74e2f28e-0ad9-411e-8289-a8ddd3749161',
    stampImageUrl: ''
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
      postalHistoryType: apiStamp.postalHistoryType,
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