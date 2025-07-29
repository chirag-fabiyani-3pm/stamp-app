import { SeriesData, TypeData, StampGroupData, CountryData, YearData, ReleaseData, CategoryData, PaperTypeData, StampData, StampInstance, ParsedStampDetails, StampDetailData } from "@/types/catalog"

export const generateSeriesData = async (): Promise<SeriesData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  const campbellPatersonSeries = [
    {
      id: "full-face-queens",
      name: "Full-Face Queens",
      description: "The first stamps of New Zealand, featuring Queen Victoria's full face portrait",
      totalTypes: 3,
      country: "New Zealand",
      periodStart: 1855,
      periodEnd: 1862
    },
    {
      id: "chalon-head",
      name: "Chalon Head",
      description: "Second design featuring Queen Victoria's profile by Alfred Edward Chalon",
      totalTypes: 4,
      country: "New Zealand",
      periodStart: 1862,
      periodEnd: 1867
    },
    {
      id: "second-sideface",
      name: "Second Sideface",
      description: "Third design with modified Queen Victoria profile",
      totalTypes: 5,
      country: "New Zealand",
      periodStart: 1867,
      periodEnd: 1873
    },
    {
      id: "long-type",
      name: "Long Type",
      description: "Fourth design with elongated format",
      totalTypes: 3,
      country: "New Zealand",
      periodStart: 1873,
      periodEnd: 1878
    },
    {
      id: "short-type",
      name: "Short Type",
      description: "Fifth design with compact format",
      totalTypes: 4,
      country: "New Zealand",
      periodStart: 1878,
      periodEnd: 1882
    },
    {
      id: "pictorials",
      name: "Pictorials",
      description: "First pictorial stamps featuring New Zealand landscapes and wildlife",
      totalTypes: 6,
      country: "New Zealand",
      periodStart: 1898,
      periodEnd: 1907
    },
    {
      id: "king-edward-vii",
      name: "King Edward VII",
      description: "Stamps featuring King Edward VII portrait",
      totalTypes: 3,
      country: "New Zealand",
      periodStart: 1902,
      periodEnd: 1910
    },
    {
      id: "king-george-v",
      name: "King George V",
      description: "Stamps featuring King George V portrait and various designs",
      totalTypes: 8,
      country: "New Zealand",
      periodStart: 1915,
      periodEnd: 1936
    },
    {
      id: "king-george-vi",
      name: "King George VI",
      description: "Stamps featuring King George VI and commemorative issues",
      totalTypes: 12,
      country: "New Zealand",
      periodStart: 1937,
      periodEnd: 1952
    },
    {
      id: "queen-elizabeth-ii",
      name: "Queen Elizabeth II",
      description: "Modern stamps featuring Queen Elizabeth II and diverse themes",
      totalTypes: 25,
      country: "New Zealand",
      periodStart: 1953,
      periodEnd: 2025
    }
  ]
  return campbellPatersonSeries
}

export const generateCountryData = async (): Promise<CountryData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  const stanleyGibbonsCountries = [
    {
      id: "great-britain",
      name: "Great Britain",
      code: "GB",
      description: "Including England, Scotland, Wales, and Northern Ireland",
      totalYears: 175,
      yearStart: 1840,
      yearEnd: 2025
    },
    {
      id: "australia",
      name: "Australia",
      code: "AU",
      description: "Commonwealth of Australia including states and territories",
      totalYears: 125,
      yearStart: 1901,
      yearEnd: 2025
    },
    {
      id: "new-zealand",
      name: "New Zealand",
      code: "NZ",
      description: "Including North Island, South Island, and dependencies",
      totalYears: 170,
      yearStart: 1855,
      yearEnd: 2025
    },
    {
      id: "canada",
      name: "Canada",
      code: "CA",
      description: "Dominion of Canada including provinces and territories",
      totalYears: 158,
      yearStart: 1867,
      yearEnd: 2025
    },
    {
      id: "south-africa",
      name: "South Africa",
      code: "ZA",
      description: "Union and Republic of South Africa",
      totalYears: 115,
      yearStart: 1910,
      yearEnd: 2025
    },
    {
      id: "india",
      name: "India",
      code: "IN",
      description: "British India and Republic of India",
      totalYears: 178,
      yearStart: 1847,
      yearEnd: 2025
    },
    {
      id: "hong-kong",
      name: "Hong Kong",
      code: "HK",
      description: "British Crown Colony and Special Administrative Region",
      totalYears: 165,
      yearStart: 1860,
      yearEnd: 2025
    },
    {
      id: "singapore",
      name: "Singapore",
      code: "SG",
      description: "British Straits Settlements and Republic of Singapore",
      totalYears: 80,
      yearStart: 1945,
      yearEnd: 2025
    }
  ]
  return stanleyGibbonsCountries
}

export const generateTypeData = async (series: SeriesData): Promise<TypeData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const types: TypeData[] = []
  if (series.id === "full-face-queens") {
    types.push(
      {
        id: "type-a1",
        name: "Type A1",
        seriesId: series.id,
        description: "First printing with distinctive characteristics",
        totalStampGroups: 4,
        catalogPrefix: "A1"
      },
      {
        id: "type-a2",
        name: "Type A2",
        seriesId: series.id,
        description: "Second printing with modified design elements",
        totalStampGroups: 3,
        catalogPrefix: "A2"
      },
      {
        id: "type-a3",
        name: "Type A3",
        seriesId: series.id,
        description: "Third printing with further modifications",
        totalStampGroups: 2,
        catalogPrefix: "A3"
      }
    )
  } else {
    for (let i = 1; i <= series.totalTypes; i++) {
      types.push({
        id: `${series.id}-type-${i}`,
        name: `Type ${String.fromCharCode(64 + i)}${i}`,
        seriesId: series.id,
        description: `Type ${i} of the ${series.name} series`,
        totalStampGroups: Math.floor(Math.random() * 5) + 2,
        catalogPrefix: `${String.fromCharCode(64 + i)}${i}`
      })
    }
  }
  return types
}

export const generateYearData = async (country: CountryData): Promise<YearData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const years: YearData[] = []
  const startYear = country.yearStart
  const endYear = Math.min(country.yearEnd, 2025)
  const sampleYears = []
  for (let year = startYear; year <= endYear; year += Math.floor(Math.random() * 3) + 1) {
    if (sampleYears.length < 20) { // Limit to 20 years for demo
      sampleYears.push(year)
    }
  }
  sampleYears.forEach(year => {
    years.push({
      id: `${country.id}-${year}`,
      year: year,
      countryId: country.id,
      totalReleases: Math.floor(Math.random() * 8) + 2,
      description: `Stamp issues for ${year}`
    })
  })
  return years.sort((a, b) => a.year - b.year)
}

export const generateReleasesData = async (yearData: YearData): Promise<ReleaseData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const sampleReleases = [
    {
      id: `${yearData.id}-release-1`,
      name: `${yearData.year} (24 July)-55. Imperf.`,
      yearId: yearData.id,
      dateRange: `${yearData.year} (24 July)-55`,
      description: "Imperforate issue with distinctive characteristics",
      perforation: "Imperf",
      totalCategories: 3,
      hasCategories: true,
    },
    {
      id: `${yearData.id}-release-2`,
      name: `${yearData.year} (15 September). Perf 14.`,
      yearId: yearData.id,
      dateRange: `${yearData.year} (15 September)`,
      description: "Perforated issue with standard gauge",
      perforation: "Perf 14",
      totalCategories: 2,
      hasCategories: true,
    },
    {
      id: `${yearData.id}-release-3`,
      name: `${yearData.year} (December). Perf 12½.`,
      yearId: yearData.id,
      dateRange: `${yearData.year} (December)`,
      description: "Late year issue with different perforation",
      perforation: "Perf 12½",
      totalCategories: 0,
      hasCategories: false,
    },
  ]
  return sampleReleases.slice(0, yearData.totalReleases)
}

export const generateCategoriesData = async (releaseData: ReleaseData): Promise<CategoryData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const sampleCategories = [
    {
      id: `${releaseData.id}-cat-1`,
      name: "(a) Plate I",
      code: "a",
      releaseId: releaseData.id,
      description: "First plate printing with clear impressions",
      totalPaperTypes: 3,
      hasPaperTypes: true,
    },
    {
      id: `${releaseData.id}-cat-2`,
      name: "(b) Plate II",
      code: "b",
      releaseId: releaseData.id,
      description: "Second plate printing with slight variations",
      totalPaperTypes: 2,
      hasPaperTypes: true,
    },
    {
      id: `${releaseData.id}-cat-3`,
      name: "(c) Medium greyish blue wove paper",
      code: "c",
      releaseId: releaseData.id,
      description: "Specific paper type categorization",
      totalPaperTypes: 4,
      hasPaperTypes: true,
    },
  ]
  return sampleCategories.slice(0, releaseData.totalCategories)
}

export const generatePaperTypesData = async (dataId: string, totalStampsToGenerate: number): Promise<PaperTypeData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const samplePaperTypes = [
    {
      id: `${dataId}-paper-1`,
      name: "(i) Thick yellowish wove paper",
      code: "i",
      categoryId: dataId,
      description: "Thick paper with yellowish tint",
      totalStamps: 4,
    },
    {
      id: `${dataId}-paper-2`,
      name: "(ii) Fine impressions, blue to greyish medium paper",
      code: "ii",
      categoryId: dataId,
      description: "Fine quality impressions on medium paper",
      totalStamps: 3,
    },
    {
      id: `${dataId}-paper-3`,
      name: "(iii) Worn plate, blue to greyish medium paper",
      code: "iii",
      categoryId: dataId,
      description: "Later impressions from worn plate",
      totalStamps: 2,
    },
  ]
  return samplePaperTypes.slice(0, totalStampsToGenerate)
}

export const generateStampGroupsData = async (typeData: TypeData): Promise<StampGroupData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const groups: StampGroupData[] = []
  if (typeData.id === "type-a1") {
    groups.push(
      {
        id: "1855-july-20-large-star",
        name: '1855 (JULY 20 at Auckland), IMPERF, "LARGE STAR" WATERMARK (W.1), PRINTED BY PERKINS, BACON & CO., LONDON',
        typeId: typeData.id,
        year: 1855,
        issueDate: "1855-07-20",
        description: "First issue of New Zealand stamps with Large Star watermark",
        watermark: "Large Star (W.1)",
        perforation: "Imperforate",
        printingMethod: "Engraved",
        printer: "Perkins, Bacon & Co., London",
        totalStamps: 3,
      },
      {
        id: "1857-trial-print",
        name: '1857 TRIAL PRINT? IMPERF, "LARGE STAR" WATERMARK (W.1), PRINTED BY RICHARDSON?',
        typeId: typeData.id,
        year: 1857,
        issueDate: "1857-01-01",
        description: "Trial printing with Large Star watermark",
        watermark: "Large Star (W.1)",
        perforation: "Imperforate",
        printingMethod: "Engraved",
        printer: "Richardson?",
        totalStamps: 2,
      },
      {
        id: "1855-december-deep-blue",
        name: '1855 (17 DECEMBER), IMPERF, ON DEEP BLUE PAPER, NO WATERMARK, RICHARDSON PRINT',
        typeId: typeData.id,
        year: 1855,
        issueDate: "1855-12-17",
        description: "Issue on deep blue paper without watermark",
        watermark: "None",
        perforation: "Imperforate",
        printingMethod: "Engraved",
        printer: "Richardson",
        totalStamps: 2,
      },
      {
        id: "1862-1864-large-star",
        name: '1862-1864 IMPERF, "LARGE STAR" WMK (W.1), (DAVIES PRINT, AUCKLAND)',
        typeId: typeData.id,
        year: 1862,
        issueDate: "1862-01-01",
        description: "Davies print from Auckland with Large Star watermark",
        watermark: "Large Star (W.1)",
        perforation: "Imperforate",
        printingMethod: "Engraved",
        printer: "Davies Print, Auckland",
        totalStamps: 4,
      },
    )
  } else {
    for (let i = 1; i <= typeData.totalStampGroups; i++) {
      groups.push({
        id: `${typeData.id}-group-${i}`,
        name: `Stamp Group ${i} - ${typeData.name}`,
        typeId: typeData.id,
        year: 1855 + i,
        issueDate: `${1855 + i}-01-01`,
        description: `Stamp group ${i} description`,
        watermark: i % 2 === 0 ? "Large Star" : "None",
        perforation: i % 3 === 0 ? "Perf 14" : "Imperforate",
        printingMethod: "Engraved",
        printer: "Various",
        totalStamps: Math.floor(Math.random() * 5) + 2,
      })
    }
  }
  return groups
}

export const generateStampsData = async (dataId: string, totalStampsToGenerate: number, dataType: 'paperType' | 'stampGroup'): Promise<StampData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  const mockStamps: StampData[] = []
  let denominations: { value: number; symbol: string }[] = []
  let colors = ["Deep carmine-red", "Bright red", "Dull orange", "Bright orange-vermillion", "Carmine", "Vermillion"]

  if (dataType === 'stampGroup') {
    // Logic for Campbell Paterson style denominations
    const stampGroupYear = 1855; // Placeholder, replace with actual stampGroupData.year if needed
    if (stampGroupYear >= 1970) {
      denominations = [
        { value: 10, symbol: "c" }, { value: 20, symbol: "c" }, { value: 30, symbol: "c" },
        { value: 50, symbol: "c" }, { value: 80, symbol: "c" }, { value: 1.00, symbol: "$" },
        { value: 1.50, symbol: "$" }, { value: 2.00, symbol: "$" }, { value: 3.00, symbol: "$" },
        { value: 5.00, symbol: "$" },
      ]
    } else {
      denominations = [
        { value: 1, symbol: "d" }, { value: 2, symbol: "d" }, { value: 3, symbol: "d" },
        { value: 4, symbol: "d" }, { value: 6, symbol: "d" }, { value: 8, symbol: "d" },
        { value: 1, symbol: "/-" }, { value: 2, symbol: "/-" },
      ]
    }

    for (let i = 0; i < totalStampsToGenerate; i++) {
      const denom = denominations[i % denominations.length]
      const color = colors[i % colors.length]

      const instances: StampInstance[] = [
        {
          id: `${dataId}-stamp-${i + 1}-mint`,
          code: "",
          description: "Mint unhinged",
          mintValue: `$${(denom.value * 25).toFixed(2)}`,
          usedValue: "",
        },
        {
          id: `${dataId}-stamp-${i + 1}-used`,
          code: "",
          description: "Fine used",
          mintValue: "",
          usedValue: `$${(denom.value * 12).toFixed(2)}`,
        },
      ]

      if (i % 2 === 0) {
        instances.push({
          id: `${dataId}-stamp-${i + 1}-reentry`,
          code: "(Z)",
          description: "Re-entries, various",
          mintValue: `$${(denom.value * 35).toFixed(2)}`,
          usedValue: `$${(denom.value * 18).toFixed(2)}`,
        })
      }

      if (i % 3 === 0) {
        instances.push({
          id: `${dataId}-stamp-${i + 1}-cover`,
          code: "(Y)",
          description: "On cover, pair or two singles",
          mintValue: "",
          usedValue: `$${(denom.value * 45).toFixed(2)}`,
        })
      }

      mockStamps.push({
        id: `${dataId}-stamp-${i + 1}`,
        name: `${denom.value}${denom.symbol} ${color}`,
        country: "New Zealand",
        stampImageUrl: "/placeholder.svg",
        catalogNumber: `CP${i + 1}`,
        stampGroupId: dataId,
        denominationValue: denom.value,
        denominationSymbol: denom.symbol,
        color: color,
        paperType: "Wove paper",
        instances: instances,
        stampDetailsJson: JSON.stringify({
          perforation: "Imperforate",
          watermark: "Large Star",
          printingMethod: "Engraved",
          designer: "Unknown",
          printRun: "Unknown",
          paperType: "Wove paper",
          gum: "Original gum",
          varieties: instances.filter(inst => inst.code).map(inst => inst.description),
          theme: "Queen Victoria",
          size: "Standard",
          errors: [],
          rarityRating: "Fine",
        }),
      })
    }
  } else if (dataType === 'paperType') {
    // Logic for Stanley Gibbons style stamps
    const stanleyGibbonsStamps = [
      {
        denominationValue: 2,
        denominationSymbol: "d",
        color: "deep ultramarine",
        instances: [
          {
            id: `${dataId}-stamp-1-mint`,
            code: "",
            description: "Mint",
            mintValue: "£125",
            usedValue: "",
          },
          {
            id: `${dataId}-stamp-1-used`,
            code: "",
            description: "Used",
            mintValue: "",
            usedValue: "£45",
          },
          {
            id: `${dataId}-stamp-1-waees`,
            code: 'a',
            description: '"WAEES" (R. 3/3)',
            mintValue: "£350",
            usedValue: "£150",
            rarity: "Scarce",
          },
        ],
      },
      {
        denominationValue: 2,
        denominationSymbol: "d",
        color: "indigo",
        instances: [
          {
            id: `${dataId}-stamp-2-mint`,
            code: "",
            description: "Mint",
            mintValue: "£115",
            usedValue: "",
          },
          {
            id: `${dataId}-stamp-2-used`,
            code: "",
            description: "Used",
            mintValue: "",
            usedValue: "£40",
          },
          {
            id: `${dataId}-stamp-2-waees`,
            code: 'a',
            description: '"WAEES" (R. 3/3)',
            mintValue: "£350",
            usedValue: "£150",
            rarity: "Scarce",
          },
        ],
      },
    ]

    stanleyGibbonsStamps.forEach((stampTemplate, index) => {
      mockStamps.push({
        id: `${dataId}-stamp-${index + 1}`,
        name: `${stampTemplate.denominationValue}${stampTemplate.denominationSymbol} ${stampTemplate.color}`,
        country: "Great Britain",
        stampImageUrl: "/placeholder.svg",
        catalogNumber: `SG${index + 1}`,
        paperTypeId: dataId,
        denominationValue: stampTemplate.denominationValue,
        denominationSymbol: stampTemplate.denominationSymbol,
        color: stampTemplate.color,
        paperType: "", // This will be filled by parsing stampDetailsJson later
        instances: stampTemplate.instances,
        stampDetailsJson: JSON.stringify({
          perforation: "Imperf",
          watermark: "None",
          printingMethod: "Line Engraved",
          designer: "Unknown",
          printRun: "Unknown",
          paperType: "(i) Thick yellowish wove paper", // Example value
          gum: "Original gum",
          theme: "Definitive",
          size: "Standard",
          rarityRating: "Fine",
        }),
      })
    })
  }
  return mockStamps.slice(0, totalStampsToGenerate)
}

export const parseStampDetails = (stampDetailsJson: string): ParsedStampDetails => {
  try {
    const details = JSON.parse(stampDetailsJson);
    
    const getNestedValue = (obj: any, path: string): string => {
      const keys = path.split('.');
      let current = obj;
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return '';
        }
      }
      return typeof current === 'string' ? current : '';
    };

    return {
      perforation: getNestedValue(details, 'perfsep.perftype.value') || getNestedValue(details, 'perftype.value') || details.perforation || 'Perf 14',
      watermark: getNestedValue(details, 'wmkchar.watermarkpresence.value') || details.watermark || 'None',
      printingMethod: getNestedValue(details, 'printchar.printmethods.printmethod.value') || getNestedValue(details, 'printmethod.value') || details.printingMethod || 'Engraved',
      designer: getNestedValue(details, 'design.designer.value') || details.designer || 'Unknown',
      printRun: getNestedValue(details, 'quantity.value') || details.printRun || 'Unknown',
      paperType: getNestedValue(details, 'paperchar.papertypes.papertype.value') || details.paperType || 'Standard',
      gum: getNestedValue(details, 'primarydetails.gum.value') || details.gum || 'Original gum',
      theme: getNestedValue(details, 'theme.value') || details.theme || 'General',
      size: getNestedValue(details, 'size.value') || details.size || 'Standard',
      rarityRating: getNestedValue(details, 'knownrarity.rarityrating.value') || details.rarityRating || 'Common'
    };
  } catch (error) {
    console.error('Error parsing stamp details:', error);
    return {
      perforation: 'Perf 14',
      watermark: 'None',
      printingMethod: 'Engraved',
      designer: 'Unknown',
      printRun: 'Unknown',
      paperType: 'Standard',
      gum: 'Original gum',
      theme: 'General',
      size: 'Standard',
      rarityRating: 'Common'
    };
  }
};

export const createStampDetailData = (stamp: StampData): StampDetailData => {
  const parsedDetails = parseStampDetails(stamp.stampDetailsJson)
  
  return {
    ...stamp,
    parsedDetails,
    relatedStamps: [],
    varieties: {
      perforations: [parsedDetails.perforation || 'Perf 14'],
      colors: [stamp.color],
      paperTypes: [stamp.paperType || 'Standard'],
      errors: []
    },
    marketInfo: {
      mintValue: stamp.instances.find(i => i.mintValue)?.mintValue || undefined,
      usedValue: stamp.instances.find(i => i.usedValue)?.usedValue || undefined,
      rarity: parsedDetails.rarityRating || 'Common'
    },
    bibliography: `Catalog Entry: ${stamp.catalogNumber}\n\nIssue Details:\nThe ${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color} stamp from the ${stamp.catalogNumber.startsWith('CP') ? 'Campbell Paterson' : 'Stanley Gibbons'} catalog. This stamp represents part of a comprehensive stamp group showcasing ${parsedDetails.theme || 'various themes'}.\n\nTechnical Specifications:\n• Perforation: ${parsedDetails.perforation}\n• Printing Method: ${parsedDetails.printingMethod}\n• Paper Type: ${parsedDetails.paperType}\n• Watermark: ${parsedDetails.watermark}\n• Gum Type: ${parsedDetails.gum}\n• Designer: ${parsedDetails.designer}\n• Print Run: ${parsedDetails.printRun}\n\nCollector Notes:\nThis stamp has a rarity rating of "${parsedDetails.rarityRating}" among collectors. The ${stamp.color} color variant is particularly sought after for its vibrant hues and precise registration.\n\nVarieties and Errors:\nWhile no major varieties are currently documented, collectors should examine copies for minor plate flaws or color variations that may increase collectible value.\n\nReferences:\n• Official Postal Service Records\n• Specialized Philatelic Catalogues\n• Contemporary Collector Surveys`
  }
} 