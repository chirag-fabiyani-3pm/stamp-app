import { PaperTypeData, StampData, StampDetailData } from "@/types/catalog"

export const getPaperTypesForCategory = async (countryCode: string, year: number, stampGroupId: string, categoryId: string): Promise<PaperTypeData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

  const categoryStamps = apiStampData.filter(s => 
    s.country === countryCode && 
    s.issueYear === year && 
    (s.stampGroupName === stampGroupId || (!s.stampGroupName && stampGroupId === 'unknown_release')) && 
    (s.categoryCode === categoryId || (!s.categoryCode && categoryId === 'unknown_category'))
  );

  console.log(`Found ${categoryStamps.length} stamps for category ${categoryStamps}`)
  
  const groupedByPaperType = categoryStamps.reduce((acc: any, stamp: any) => {
    const key = stamp.paperName || 'unknown_paper_type';
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: stamp.paperName || 'Unknown Paper Type',
        code: key,
        categoryId,
        totalStamps: 0,
      };
    }
    acc[key].totalStamps++;
    return acc;
  }, {});

  return Object.values(groupedByPaperType);
}

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
      rarity: parsedDetails.rarityRating || 'Common'
    },
    bibliography: parsedDetails.bibliography || `Catalog Entry: ${stamp.catalogNumber}\n\nIssue Details:\nThe ${stamp.denominationValue}${stamp.denominationSymbol} ${stamp.color} stamp from the ${stamp.catalogNumber.startsWith('CP') ? 'Campbell Paterson' : 'Stanley Gibbons'} catalog. This stamp represents part of a comprehensive stamp group showcasing various themes.\n\nTechnical Specifications:\n• Perforation: ${parsedDetails.perforation || 'Unknown'}\n• Printing Method: ${parsedDetails.printingMethod || 'Unknown'}\n• Paper Type: ${parsedDetails.paperType || 'Unknown'}\n• Watermark: ${parsedDetails.watermark || 'Unknown'}\n• Gum Type: ${parsedDetails.gum || 'Unknown'}\n• Print Run: Unknown\n\nCollector Notes:\nThis stamp has a rarity rating of "${parsedDetails.rarityRating || 'Common'}" among collectors. The ${stamp.color || 'Unknown'} color variant is particularly sought after for its vibrant hues and precise registration.\n\nVarieties and Errors:\n${parsedDetails.varieties && parsedDetails.varieties.length > 0 ? `Known varieties include: ${parsedDetails.varieties.join(', ')}.` : 'No major varieties are currently documented.'} ${parsedDetails.errors && parsedDetails.errors.length > 0 ? `Known errors include: ${parsedDetails.errors.join(', ')}.` : ''} While no major varieties are currently documented, collectors should examine copies for minor plate flaws or color variations that may increase collectible value.\n\nReferences:\n• Official Postal Service Records\n• Specialized Philatelic Catalogues\n• Contemporary Collector Surveys`
  }
} 