import { SeriesData, TypeData, StampGroupData, CountryData, YearData, ReleaseData, CategoryData, PaperTypeData, StampData, StampInstance, ParsedStampDetails, StampDetailData } from "@/types/catalog"
import {
    apiStampData,
    groupStampsByCountry,
    groupStampsBySeries,
    groupStampsByYear,
    groupStampsByCurrency,
    groupStampsByDenomination,
    groupStampsByColor,
    groupStampsByPaper,
    groupStampsByWatermark,
    groupStampsByPerforation,
    groupStampsByItemType,
    getStampDetails,
    convertApiStampToStampData
} from "@/lib/data/catalog-data"

export const getCampbellPatersonSeries = async (): Promise<SeriesData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

  // Filter for 'GB' country, as Campbell Paterson is New Zealand specific in dummy data,
  // but for actual data, we will need to adjust this filter or parameterize it.
  // For now, let's use all stamps and group them by series, as there isn't a direct "Campbell Paterson" filter in apiStampData.
  // We'll assume the series are the top level for Campbell Paterson.
  const allSeries = groupStampsBySeries(apiStampData, 'NZ'); // Using 'GB' as a placeholder, might need to adjust based on actual data.

  const seriesData: SeriesData[] = allSeries.map((series: any) => {
    // Calculate periodStart and periodEnd from the stamps within the series
    const years = series.stamps.map((stamp: any) => stamp.issueYear).filter(Boolean);
    const periodStart = years.length > 0 ? Math.min(...years) : 0;
    const periodEnd = years.length > 0 ? Math.max(...years) : 0;

    return {
      id: series.catalogNumber,
      name: series.name,
      description: series.description,
      totalTypes: series.stamps.length, // Placeholder: count of stamps in series as types
      country: series.stamps[0]?.countryName || 'Unknown',
      periodStart: periodStart,
      periodEnd: periodEnd
    };
  });
  return seriesData;
}

export const getStanleyGibbonsCountries = async (): Promise<CountryData[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

  const allCountries = groupStampsByCountry(apiStampData);

  const countryData: CountryData[] = allCountries.map((country: any) => {
    const years = country.stamps.map((stamp: any) => stamp.issueYear).filter(Boolean);
    const yearStart = years.length > 0 ? Math.min(...years) : 0;
    const yearEnd = years.length > 0 ? Math.max(...years) : 0;

    return {
      id: country.code,
      name: country.name,
      code: country.code,
      description: country.description,
      totalYears: country.stamps.length, // Placeholder: count of stamps in country as years
      yearStart: yearStart,
      yearEnd: yearEnd
    };
  });
  return countryData;
}

export const getTypesForSeries = async (seriesName: string): Promise<TypeData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  // Assuming 'types' in Campbell Paterson corresponds to itemType in apiStampData
  const seriesStamps = apiStampData.filter(s => s.seriesName === seriesName);
  const groupedByItemType = seriesStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.itemTypeName || 'unknown_type';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.itemTypeName || 'Unknown Type',
        seriesId: seriesName,
        description: stamp.itemTypeDescription || `${stamp.itemTypeName} category`,
        totalStampGroups: 0,
        catalogPrefix: key
      };
    }
    acc[key].totalStampGroups++;
    return acc;
  }, {});

  return Object.values(groupedByItemType);
}

export const getStampGroupsForType = async (seriesName: string, itemTypeCode: string): Promise<StampGroupData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const stampsForType = apiStampData.filter(s => s.seriesName === seriesName && (s.itemTypeName === itemTypeCode || (!s.itemTypeName && itemTypeCode === 'unknown_type')));
  
  const groupedByStampGroup = stampsForType.reduce((acc: any, stamp: any) => {
    const key = stamp.stampGroupName || 'unknown_group';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.stampGroupName || stamp.name,
        typeId: itemTypeCode,
        year: stamp.issueYear,
        issueDate: stamp.issueDate,
        description: stamp.stampGroupDescription || stamp.description,
        watermark: stamp.watermarkName || 'None',
        perforation: stamp.perforationName || 'Imperforate',
        printingMethod: stamp.printingMethod || 'Unknown',
        printer: stamp.printer || 'Unknown',
        totalStamps: 0,
      };
    }
    acc[key].totalStamps++;
    return acc;
  }, {});

  return Object.values(groupedByStampGroup);
}

export const getYearsForCountry = async (countryCode: string): Promise<YearData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const countryStamps = apiStampData.filter(s => s.country === countryCode);
  const groupedByYear = countryStamps.reduce((acc: any, stamp: any) => {
    const year = stamp.issueYear;
    if (!year) return acc;
    const key = year.toString();
    if (!acc[key]) {
      acc[key] = {
        id: `${countryCode}-${year}`,
        year: year,
        countryId: countryCode,
        totalReleases: 0,
        description: `Stamp issues for ${year}`
      };
    }
    acc[key].totalReleases++; // Placeholder: count of stamps as releases
    return acc;
  }, {});

  return( Object.values(groupedByYear).sort((a: any, b: any) => a.year - b.year) as YearData[]);
}

export const getReleasesForYear = async (countryCode: string, year: number): Promise<ReleaseData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const yearStamps = apiStampData.filter(s => s.country === countryCode && s.issueYear === year);
  const groupedByRelease = yearStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.releaseName || 'unknown_release';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.releaseName || `Release ${year}`,
        yearId: `${countryCode}-${year}`,
        dateRange: stamp.releaseDateRange || `${year}`,
        description: stamp.releaseDescription || `Stamp releases for ${year}`,
        perforation: stamp.perforationName || 'Unknown',
      totalCategories: 0,
      hasCategories: false,
      };
    }
    acc[key].totalCategories++; // Placeholder: count of stamps as categories
    acc[key].hasCategories = true; // Assume true if there are stamps
    return acc;
  }, {});

  return Object.values(groupedByRelease);
}

export const getCategoriesForRelease = async (countryCode: string, year: number, releaseId: string): Promise<CategoryData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const releaseStamps = apiStampData.filter(s => s.country === countryCode && s.issueYear === year && (s.releaseName === releaseId || (!s.releaseName && releaseId === 'unknown_release')));
  const groupedByCategory = releaseStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.categoryName || 'unknown_category';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.categoryName || 'Unknown Category',
        code: stamp.categoryCode || 'Unknown',
        releaseId: releaseId,
        description: stamp.categoryDescription || `${stamp.categoryName} category`,
        totalPaperTypes: 0,
        hasPaperTypes: false,
      };
    }
    acc[key].totalPaperTypes++; // Placeholder: count of stamps as paper types
    acc[key].hasPaperTypes = true; // Assume true if there are stamps
    return acc;
  }, {});

  return Object.values(groupedByCategory);
}

export const getPaperTypesForCategory = async (countryCode: string, year: number, releaseId: string, categoryId: string): Promise<PaperTypeData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const categoryStamps = apiStampData.filter(s => 
    s.country === countryCode && 
    s.issueYear === year && 
    (s.releaseName === releaseId || (!s.releaseName && releaseId === 'unknown_release')) && 
    (s.categoryName === categoryId || (!s.categoryName && categoryId === 'unknown_category'))
  );

  console.log(`Found ${categoryStamps.length} stamps for category ${categoryStamps}`)
  
  const groupedByPaperType = categoryStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.paperTypeName || 'unknown_paper_type';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.paperTypeName || 'Unknown Paper Type',
        code: key,
        categoryId: categoryId,
        description: stamp.paperTypeDescription || `${stamp.paperTypeName} paper type`,
        totalStamps: 0,
      };
    }
    acc[key].totalStamps++;
    return acc;
  }, {});

  return Object.values(groupedByPaperType);
}

export const getStampsForPaperType = async (countryCode: string, year: number, releaseId: string, categoryId: string, paperTypeCode: string): Promise<StampData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const stamps = apiStampData.filter(s =>
    s.country === countryCode &&
    s.issueYear === year &&
    (s.releaseName === releaseId || (!s.releaseName && releaseId === 'unknown_release')) &&
    (s.categoryName === categoryId || (!s.categoryName && categoryId === 'unknown_category')) &&
    (s.paperTypeName === paperTypeCode || (!s.paperTypeName && paperTypeCode === 'unknown_paper_type'))
  ).map(convertApiStampToStampData);

  const stampIds = stamps.map(s => s.stampId);
  const stampInstances = apiStampData.filter(s => stampIds.includes(s.ParentStampId)).map(convertApiStampToStampData);

  stamps.forEach(stamp => {
    const instances = stampInstances.filter(s => s.parentStampId === stamp.stampId);
    stamp.instances = instances as never;
  });

  return stamps as unknown as StampData[];
}

export const getStampsForStampGroup = async (stampGroupId: string, typeId: string, seriesName: string): Promise<StampData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

  const stamps = apiStampData.filter(s =>
    (s.stampGroupName === stampGroupId || (!s.stampGroupName && stampGroupId === 'unknown_group')) &&
    (s.itemTypeName === typeId || (!s.itemTypeName && typeId === 'unknown_type')) &&
    (s.seriesName === seriesName || (!s.seriesName && seriesName === 'unknown_series') &&
    (s.isInstance === false))
  ).map(convertApiStampToStampData);

  const stampIds = stamps.map(s => s.stampId);

  const stampInstances = apiStampData.filter(s => stampIds.includes(s.ParentStampId)).map(convertApiStampToStampData);

  stamps.forEach(stamp => {
    const instances = stampInstances.filter(s => s.parentStampId === stamp.stampId);
    stamp.instances = instances as never;
  })

  return stamps as unknown as StampData[];
}

export const parseStampDetails = (stampDetailsJson: string): ParsedStampDetails => {
  try {
    const details = JSON.parse(stampDetailsJson);
    
    // Direct mapping from apiStampData fields to ParsedStampDetails
    return {
      perforation: details.perforation || details.perforationName || 'Unknown',
      watermark: details.watermark || details.watermarkName || 'None',
      printingMethod: details.printingMethod || 'Unknown',
      designer: details.designer || 'Unknown',
      printRun: details.printRun || 'Unknown',
      paperType: details.paperType || details.paperName || 'Standard',
      gum: details.gumType || 'Original gum',
      theme: details.theme || 'General',
      size: details.sizeFormat || 'Standard',
      rarityRating: details.rarityRating || 'Common',
      catalogPrice: details.catalogPrice,
      estimatedValue: details.estimatedMarketValue,
      currentMarketValue: details.currentMarketValue,
      condition: details.conditionNotes || 'Unknown',
      usage: 'Unknown', // No direct mapping in apiStampData
      postalHistoryType: details.postalHistoryType,
      errorType: details.errorType as string || 'None',
      specialNotes: details.specialNotes,
      rarity: details.rarityRating,
      varieties: details.varietyType ? details.varietyType.split(',').map((v: string) => v.trim()) : [],
      errors: details.knownError ? [details.knownError] : [],
    };
  } catch (error) {
    console.error('Error parsing stamp details:', error);
    return {
      perforation: 'Unknown',
      watermark: 'None',
      printingMethod: 'Unknown',
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
    relatedStamps: [], // This would require more logic to find related stamps
    varieties: {
      perforations: parsedDetails.perforation ? [parsedDetails.perforation] : [],
      colors: stamp.color ? [stamp.color] : [],
      paperTypes: parsedDetails.paperType ? [parsedDetails.paperType] : [],
      errors: parsedDetails.errors || []
    },
    marketInfo: {
      mintValue: stamp.estimatedMarketValue ? `$${stamp.estimatedMarketValue.toFixed(2)}` : undefined,
      usedValue: stamp.actualPrice ? `$${stamp.actualPrice.toFixed(2)}` : undefined,
      rarity: parsedDetails.rarityRating || 'Common'
    },
    bibliography: parsedDetails.bibliography || `Catalog Entry: ${stamp.catalogNumber}\n\nIssue Details:\nThe ${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color} stamp from the ${stamp.catalogNumber.startsWith('CP') ? 'Campbell Paterson' : 'Stanley Gibbons'} catalog. This stamp represents part of a comprehensive stamp group showcasing ${parsedDetails.theme || 'various themes'}.\n\nTechnical Specifications:\n• Perforation: ${parsedDetails.perforation || 'Unknown'}\n• Printing Method: ${parsedDetails.printingMethod || 'Unknown'}\n• Paper Type: ${parsedDetails.paperType || 'Unknown'}\n• Watermark: ${parsedDetails.watermark || 'Unknown'}\n• Gum Type: ${parsedDetails.gum || 'Unknown'}\n• Designer: ${parsedDetails.designer || 'Unknown'}\n• Print Run: ${parsedDetails.printRun || 'Unknown'}\n\nCollector Notes:\nThis stamp has a rarity rating of "${parsedDetails.rarityRating || 'Common'}" among collectors. The ${stamp.color || 'Unknown'} color variant is particularly sought after for its vibrant hues and precise registration.\n\nVarieties and Errors:\n${parsedDetails.varieties && parsedDetails.varieties.length > 0 ? `Known varieties include: ${parsedDetails.varieties.join(', ')}.` : 'No major varieties are currently documented.'} ${parsedDetails.errors && parsedDetails.errors.length > 0 ? `Known errors include: ${parsedDetails.errors.join(', ')}.` : ''} While no major varieties are currently documented, collectors should examine copies for minor plate flaws or color variations that may increase collectible value.\n\nReferences:\n• Official Postal Service Records\n• Specialized Philatelic Catalogues\n• Contemporary Collector Surveys`
  }
} 